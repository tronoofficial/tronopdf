/* TronoPDF - Rotate PDF v1 | visual thumbnails, per-page + bulk rotation */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
function loadJS(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(false);};s.onerror=function(){cb(true);};document.head.appendChild(s);}
loadJS(PDFJS_SRC,function(e){if(!e&&window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;}});
loadJS(PDFLIB_SRC,function(){});
function waitLib(name){
 return new Promise(function(res){
  var tries=0;
  (function w(){
   if(window[name]){res(true);return;}
   if(tries>40){res(false);return;}
   tries++;setTimeout(w,500);
  })();
 });
}
function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
root.innerHTML='<style>'+
'.rt-wrap{max-width:1400px;margin:0 auto}'+
'.rt-hero{text-align:center;padding:50px 16px 40px}'+
'.rt-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}'+
'.rt-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}'+
'.rt-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}'+
'.rt-big:hover{transform:translateY(-2px)}'+
'.rt-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}'+
'.rt-zone{border:2px dashed transparent;border-radius:18px}'+
'.rt-zone.on{border-color:#7c3aed;background:#f3f0ff}'+
'.rt-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}'+
'.rt-main{display:flex;min-height:600px}'+
'.rt-pages{flex:1;padding:40px;overflow-y:auto}'+
'.rt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px}'+
'.rt-page{background:#fff;border:2px solid #eceaf6;border-radius:10px;padding:12px;text-align:center;transition:.2s;position:relative;cursor:pointer}'+
'.rt-page:hover{border-color:#7c3aed;transform:translateY(-2px)}'+
'.rt-page.rotated{border-color:#7c3aed;background:#f3f0ff}'+
'.rt-thumb{height:160px;display:flex;align-items:center;justify-content:center;background:#fafbfe;border-radius:6px;margin-bottom:8px;overflow:hidden;position:relative}'+
'.rt-thumb img{max-width:100%;max-height:100%;object-fit:contain;transition:transform .3s ease}'+
'.rt-num{font-size:12px;font-weight:700;color:#4b4b5a}'+
'.rt-angle{position:absolute;top:6px;right:6px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:10px;font-weight:800;padding:3px 7px;border-radius:999px}'+
'.rt-side{width:380px;background:#fff;border-left:1px solid #eceaf6;padding:30px;display:flex;flex-direction:column}'+
'.rt-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:22px}'+
'.rt-info{background:#f7f6fc;border:1px solid #eceaf6;border-radius:10px;padding:14px;margin-bottom:20px;font-size:13px;color:#4b4b5a}'+
'.rt-info strong{color:#7c3aed}'+
'.rt-lbl{font-size:13px;font-weight:800;color:#4b4b5a;margin-bottom:10px}'+
'.rt-sec{margin-bottom:20px}'+
'.rt-bulk{display:flex;gap:8px;margin-bottom:16px}'+
'.rt-btn{flex:1;border:2px solid #eceaf6;border-radius:10px;background:#fff;padding:14px 8px;font-size:12px;font-weight:800;color:#4b4b5a;cursor:pointer;text-align:center;transition:.2s;display:flex;flex-direction:column;align-items:center;gap:6px}'+
'.rt-btn:hover{border-color:#7c3aed;background:#f3f0ff}'+
'.rt-btn .ic{font-size:20px}'+
'.rt-reset{width:100%;border:1px solid #fecaca;background:#fff5f5;color:#dc2626;font-weight:700;font-size:13px;padding:10px;border-radius:8px;cursor:pointer;margin-bottom:16px}'+
'.rt-reset:hover{background:#fdeaea}'+
'.rt-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:auto}'+
'.rt-go:disabled{opacity:.5;cursor:not-allowed}'+
'.rt-busy{display:none;padding:60px 20px;text-align:center}'+
'.rt-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}'+
'.rt-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:26px}'+
'.rt-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,.08)}'+
'.rt-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);border-radius:999px;transition:width .3s}'+
'.rt-pct{font-size:36px;font-weight:900}'+
'.rt-done{display:none;text-align:center;padding:60px 20px}'+
'.rt-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}'+
'.rt-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}'+
'.rt-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}'+
'@media(max-width:900px){.rt-main{flex-direction:column}.rt-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}'+
'</style>'+
'<div class="rt-wrap">'+
'<div id="rtPick"><div class="rt-hero"><h1>Rotate PDF pages</h1><p>Rotate all or specific pages of your PDF. Free, private and unlimited.</p>'+
'<div class="rt-zone" id="rtZone"><button class="rt-big" id="rtBtn" type="button">Select PDF file</button><p class="rt-drop-hint">or drop PDF here</p></div></div></div>'+
'<div class="rt-work" id="rtWork"><div class="rt-main"><div class="rt-pages"><div class="rt-grid" id="rtGrid"></div></div>'+
'<aside class="rt-side"><h2>Rotate</h2>'+
'<div class="rt-info" id="rtInfo">Click on any page to rotate it individually, or use the buttons below.</div>'+
'<div class="rt-sec"><div class="rt-lbl">Rotate all pages</div>'+
'<div class="rt-bulk"><button class="rt-btn" id="rtAllL" type="button"><span class="ic">↺</span><span>Left 90°</span></button><button class="rt-btn" id="rtAll180" type="button"><span class="ic">🔄</span><span>180°</span></button><button class="rt-btn" id="rtAllR" type="button"><span class="ic">↻</span><span>Right 90°</span></button></div>'+
'<button class="rt-reset" id="rtReset" type="button">↺ Reset all rotations</button></div>'+
'<button class="rt-go" id="rtGo" type="button">Apply Rotation →</button></aside></div></div>'+
'<div class="rt-busy" id="rtBusy"><h2>Rotating pages...</h2><p class="fn" id="rtBusyName"></p><div class="rt-bar"><div id="rtBarFill"></div></div><div class="rt-pct" id="rtPct">0%</div></div>'+
'<div class="rt-done" id="rtDone"><div class="rt-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF rotated successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="rtDoneInfo"></p><a class="rt-dl" id="rtDl" href="#">⬇ Download rotated PDF</a><button class="rt-again" id="rtAgain" type="button">Rotate another PDF</button></div>'+
'<input type="file" id="rtFile" accept="application/pdf,.pdf" style="display:none">'+
'</div>';
var file=null;var buf=null;var doc=null;var totalPages=0;
var rotations=[];
var pick=document.getElementById('rtPick'),work=document.getElementById('rtWork'),busy=document.getElementById('rtBusy'),done=document.getElementById('rtDone');
var zone=document.getElementById('rtZone'),btn=document.getElementById('rtBtn'),inp=document.getElementById('rtFile'),grid=document.getElementById('rtGrid');
var go=document.getElementById('rtGo'),infoEl=document.getElementById('rtInfo');
function renderPages(){
 grid.innerHTML='';
 var any=false;
 for(var i=1;i<=totalPages;i++){
  (function(pg){
   var ang=rotations[pg-1]||0;if(ang!==0){any=true;}
   var div=document.createElement('div');div.className='rt-page'+(ang!==0?' rotated':'');div.setAttribute('data-page',pg);
   div.innerHTML='<div class="rt-thumb"><span style="color:#c3c6d4;font-size:24px">📄</span>'+(ang!==0?'<span class="rt-angle">'+ang+'°</span>':'')+'</div><div class="rt-num">Page '+pg+(ang!==0?' • '+ang+'°':'')+'</div>';
   div.onclick=function(){
    var cur=rotations[pg-1]||0;
    cur=(cur+90)%360;
    rotations[pg-1]=cur;
    renderPages();
    updateInfo();
   };
   grid.appendChild(div);
   doc.getPage(pg).then(function(page){
    var vp=page.getViewport({scale:1});
    var scale=Math.min(1,140/vp.width);
    var vp2=page.getViewport({scale:scale});
    var canvas=document.createElement('canvas');
    canvas.width=Math.floor(vp2.width);canvas.height=Math.floor(vp2.height);
    page.render({canvasContext:canvas.getContext('2d'),viewport:vp2}).promise.then(function(){
     var thumb=div.querySelector('.rt-thumb');
     var img=document.createElement('img');
     img.src=canvas.toDataURL('image/jpeg',0.5);
     img.alt='Page '+pg;
     img.style.transform='rotate('+ang+'deg)';
     thumb.innerHTML='';
     thumb.appendChild(img);
     if(ang!==0){var badge=document.createElement('span');badge.className='rt-angle';badge.textContent=ang+'°';thumb.appendChild(badge);}
    });
   });
  })(i);
 }
 go.disabled=!any;
}
function updateInfo(){
 var any=false;var count=0;
 for(var i=0;i<rotations.length;i++){if((rotations[i]||0)!==0){any=true;count++;}}
 if(!any){infoEl.innerHTML='Click on any page to rotate it individually, or use the buttons below.';}
 else{infoEl.innerHTML='<strong>'+count+'</strong> page(s) rotated. Click Apply Rotation to save.';}
 go.disabled=!any;
}
function rotateAll(delta){
 for(var i=0;i<totalPages;i++){
  var cur=rotations[i]||0;
  cur=(cur+delta+360)%360;
  rotations[i]=cur;
 }
 renderPages();updateInfo();
}
function resetAll(){
 for(var i=0;i<totalPages;i++){rotations[i]=0;}
 renderPages();updateInfo();
}
function addFile(f){
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){alert('Please select a PDF file.');return;}
 file=f;pick.style.display='none';work.style.display='block';
 waitLib('pdfjsLib').then(function(ok){
  if(!ok){alert('Error loading PDF library');return;}
  window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
  f.arrayBuffer().then(function(b){
   buf=b;
   return window.pdfjsLib.getDocument({data:b}).promise.then(function(d){
    doc=d;totalPages=d.numPages;
    rotations=new Array(totalPages).fill(0);
    renderPages();updateInfo();
   });
  }).catch(function(){alert('Error reading PDF');});
 });
}
document.getElementById('rtAllL').onclick=function(){rotateAll(270);};
document.getElementById('rtAllR').onclick=function(){rotateAll(90);};
document.getElementById('rtAll180').onclick=function(){rotateAll(180);};
document.getElementById('rtReset').onclick=resetAll;
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};
function pct(p){document.getElementById('rtPct').textContent=Math.round(p)+'%';document.getElementById('rtBarFill').style.width=p+'%';}
go.onclick=function(){
 if(!file||!buf){return;}
 work.style.display='none';busy.style.display='block';
 document.getElementById('rtBusyName').textContent=file.name;
 pct(5);
 waitLib('PDFLib').then(function(ok){
  if(!ok){busy.style.display='none';work.style.display='block';alert('Error loading PDF library.');return;}
  PDFLib.PDFDocument.load(buf,{ignoreEncryption:true}).then(function(pdf){
   var pages=pdf.getPages();
   for(var i=0;i<pages.length;i++){
    var ang=rotations[i]||0;
    if(ang!==0){
     var cur=pages[i].getRotation().angle;
     pages[i].setRotation(PDFLib.degrees((cur+ang)%360));
    }
    pct(10+(i/pages.length)*80);
   }
   pdf.save().then(function(bytes){
    pct(100);
    setTimeout(function(){
     busy.style.display='none';done.style.display='block';
     var rotated=0;for(var i=0;i<rotations.length;i++){if((rotations[i]||0)!==0){rotated++;}}
     document.getElementById('rtDoneInfo').textContent=rotated+' page(s) rotated • '+fmtB(bytes.length);
     var blob=new Blob([bytes],{type:'application/pdf'});
     var dl=document.getElementById('rtDl');dl.href=URL.createObjectURL(blob);dl.download='rotated-'+file.name;
    },300);
   }).catch(function(){
    busy.style.display='none';work.style.display='block';
    alert('Error saving PDF. Please try again.');
   });
  }).catch(function(){
   busy.style.display='none';work.style.display='block';
   alert('Error processing PDF. Please try again.');
  });
 });
};
document.getElementById('rtAgain').onclick=function(){
 file=null;buf=null;doc=null;totalPages=0;rotations=[];
 done.style.display='none';work.style.display='none';pick.style.display='block';
};
})();
