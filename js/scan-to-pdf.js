/* TronoPDF - Scan to PDF v1 | camera + file upload + filters + multi-page + pdf-lib */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
function loadJS(src){return new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=function(){res(true);};s.onerror=function(){rej(new Error('load fail'));};document.head.appendChild(s);});}
var html='';
html+='<style>';
html+='.sc-wrap{max-width:1400px;margin:0 auto}';
html+='.sc-hero{text-align:center;padding:50px 16px 40px}';
html+='.sc-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.sc-hero p{font-size:18px;color:#7a7a85;margin-bottom:30px}';
html+='.sc-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}';
html+='.sc-big{background:linear-gradient(135deg,#0ea5e9,#38bdf8);color:#fff;font-size:17px;font-weight:800;padding:18px 40px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(14,165,233,.35)}';
html+='.sc-big:hover{transform:translateY(-2px)}';
html+='.sc-sec{background:#fff;border:2px solid #eceaf6;color:#4b4b5a;font-size:15px;font-weight:800;padding:18px 30px;border-radius:12px;cursor:pointer}';
html+='.sc-sec:hover{border-color:#0ea5e9;color:#0ea5e9}';
html+='.sc-drop-hint{margin-top:16px;color:#9a9aa5;font-size:14px}';
html+='.sc-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden;padding:22px}';
html+='.sc-grid{display:grid;grid-template-columns:1fr 340px;gap:20px}';
html+='.sc-canvas{background:#111;border-radius:12px;overflow:hidden;position:relative;min-height:400px;display:flex;align-items:center;justify-content:center}';
html+='.sc-canvas video{width:100%;max-height:70vh;display:block;border-radius:12px}';
html+='.sc-canvas .ph{color:#9a9aa5;text-align:center;padding:40px}';
html+='.sc-shot-btn{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);width:72px;height:72px;border-radius:50%;background:#fff;border:4px solid #0ea5e9;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.3)}';
html+='.sc-shot-btn::after{content:"";display:block;width:56px;height:56px;border-radius:50%;background:#0ea5e9;margin:auto;position:absolute;inset:4px}';
html+='.sc-shot-btn:active::after{transform:scale(.9)}';
html+='.sc-cam-err{display:none;text-align:center;color:#dc2626;padding:40px}';
html+='.sc-pages{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-top:16px}';
html+='.sc-page{position:relative;border-radius:8px;overflow:hidden;border:2px solid #eceaf6;background:#fff;aspect-ratio:3/4;cursor:pointer}';
html+='.sc-page.sel{border-color:#0ea5e9}';
html+='.sc-page img{width:100%;height:100%;object-fit:cover}';
html+='.sc-page .num{position:absolute;top:4px;left:4px;background:rgba(0,0,0,.7);color:#fff;font-size:11px;font-weight:800;padding:2px 8px;border-radius:4px}';
html+='.sc-page .del{position:absolute;top:4px;right:4px;width:22px;height:22px;border-radius:50%;background:#dc2626;color:#fff;border:none;font-size:12px;cursor:pointer;display:none}';
html+='.sc-page.sel .del{display:block}';
html+='.sc-side{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px;display:flex;flex-direction:column}';
html+='.sc-side h2{font-size:20px;font-weight:900;margin-bottom:6px}';
html+='.sc-sub{font-size:13px;color:#9a9aa5;margin-bottom:14px}';
html+='.sc-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}';
html+='.sc-count{background:#e0f2fe;border:1px solid #bae6fd;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:800;color:#075985;margin-bottom:12px}';
html+='.sc-filters{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}';
html+='.sc-filters button{border:2px solid #eceaf6;border-radius:8px;padding:10px 4px;font-size:11px;font-weight:800;cursor:pointer;background:#fff;color:#4b4b5a}';
html+='.sc-filters button.active{border-color:#0ea5e9;color:#0ea5e9;background:#e0f2fe}';
html+='.sc-row{display:flex;gap:8px;margin-top:10px}';
html+='.sc-row button{flex:1;border:1px solid #eceaf6;background:#fff;border-radius:10px;padding:11px;font-size:13px;font-weight:800;cursor:pointer}';
html+='.sc-row button:hover{border-color:#0ea5e9;color:#0ea5e9}';
html+='.sc-go{width:100%;background:linear-gradient(135deg,#0ea5e9,#38bdf8);color:#fff;font-size:17px;font-weight:800;padding:16px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(14,165,233,.35);margin-top:auto}';
html+='.sc-go:active{transform:scale(.98)}';
html+='.sc-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.sc-busy{display:none;text-align:center;padding:60px 20px}';
html+='.sc-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.sc-busy .st{color:#7a7a85;font-size:15px;margin-bottom:26px}';
html+='.sc-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.sc-bar div{height:100%;width:0;background:linear-gradient(90deg,#0ea5e9,#38bdf8);transition:width .3s}';
html+='.sc-pct{font-size:36px;font-weight:900}';
html+='.sc-done{display:none;text-align:center;padding:50px 20px}';
html+='.sc-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.sc-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.sc-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='.sc-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);background:#16a34a;color:#fff;font-weight:800;padding:14px 28px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:all .3s;z-index:999;font-size:14px}';
html+='.sc-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}';
html+='.sc-toast.err{background:#dc2626}';
html+='@media(max-width:900px){.sc-grid{grid-template-columns:1fr}}';
html+='</style>';
html+='<div class="sc-wrap">';
html+='<div id="scPick"><div class="sc-hero"><h1>Scan to PDF</h1><p>Turn documents into clean PDFs - camera or photos, no watermark.</p>';
html+='<div class="sc-btns"><button class="sc-big" id="scCamBtn" type="button">📷 Open Camera</button><button class="sc-sec" id="scUpBtn" type="button">🖼️ Upload Photos</button></div>';
html+='<p class="sc-drop-hint">Works best on mobile - allow camera access when prompted</p></div></div>';
html+='<div class="sc-work" id="scWork"><div class="sc-grid">';
html+='<div><div class="sc-canvas" id="scCanvas"><div class="ph" id="scPh">📷 Click "Open Camera" to start scanning<br/><small>or upload photos to begin</small></div><video id="scVideo" autoplay playsinline style="display:none"></video><button class="sc-shot-btn" id="scShot" type="button" style="display:none" title="Capture"></button><div class="sc-cam-err" id="scCamErr">Camera not available. Please allow camera access or use Upload Photos.</div></div>';
html+='<div class="sc-pages" id="scPages"></div></div>';
html+='<div class="sc-side"><h2>Scan settings</h2><p class="sc-sub">Runs fully in your browser</p>';
html+='<div class="sc-count" id="scCount">0 page(s) scanned</div>';
html+='<div class="sc-lbl">Filter</div><div class="sc-filters"><button data-f="color" class="active">Color</button><button data-f="gray">Gray</button><button data-f="bw">B&W</button></div>';
html+='<div class="sc-lbl">Page actions</div><div class="sc-row"><button id="scAdd" type="button">+ Add photos</button><button id="scClear" type="button">Clear all</button></div>';
html+='<button class="sc-go" id="scGo" type="button" disabled>Create PDF →</button></div>';
html+='</div></div>';
html+='<div class="sc-busy" id="scBusy"><h2>Building PDF...</h2><p class="st" id="scStatus">Working...</p><div class="sc-bar"><div id="scBarFill"></div></div><div class="sc-pct" id="scPct">0%</div></div>';
html+='<div class="sc-done" id="scDone"><div class="sc-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF ready!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="scDoneInfo"></p><a class="sc-dl" id="scDl" href="#">⬇ Download PDF</a><button class="sc-again" id="scAgain" type="button">Scan another</button></div>';
html+='<div class="sc-toast" id="scToast"></div>';
html+='<input type="file" id="scFile" accept="image/*" multiple style="display:none"/>';
html+='<input type="file" id="scAddFile" accept="image/*" multiple style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var pages=[],stream=null,filter='color',selIdx=-1;
var pick=document.getElementById('scPick'),work=document.getElementById('scWork'),busy=document.getElementById('scBusy'),done=document.getElementById('scDone');
var video=document.getElementById('scVideo'),canvas=document.getElementById('scCanvas');
var ph=document.getElementById('scPh'),shot=document.getElementById('scShot'),camErr=document.getElementById('scCamErr');
var pagesBox=document.getElementById('scPages'),countEl=document.getElementById('scCount'),goBtn=document.getElementById('scGo');
var toastEl=document.getElementById('scToast');
function toast(m,e){toastEl.textContent=m;toastEl.classList.toggle('err',!!e);toastEl.classList.add('show');clearTimeout(toastEl.__h);toastEl.__h=setTimeout(function(){toastEl.classList.remove('show');},2200);}
function pct(p){document.getElementById('scPct').textContent=Math.round(p)+'%';document.getElementById('scBarFill').style.width=p+'%';}
function setStatus(s){document.getElementById('scStatus').textContent=s;}
function applyFilter(cv){
 var cx=cv.getContext('2d');
 var img=cx.getImageData(0,0,cv.width,cv.height);
 var d=img.data;
 if(filter==='gray'){
  for(var i=0;i<d.length;i+=4){var g=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2];d[i]=d[i+1]=d[i+2]=g;}
 }else if(filter==='bw'){
  for(var i=0;i<d.length;i+=4){var g2=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2];var v=g2>130?255:0;d[i]=d[i+1]=d[i+2]=v;}
 }
 cx.putImageData(img,0,0);
 return cv;
}
function renderPages(){
 pagesBox.innerHTML='';
 countEl.textContent=pages.length+' page(s) scanned';
 goBtn.disabled=(pages.length===0);
 pages.forEach(function(p,i){
  var d=document.createElement('div');d.className='sc-page'+(i===selIdx?' sel':'');
  d.innerHTML='<span class="num">'+(i+1)+'</span><img src="'+p.data+'"/><button class="del" type="button">✕</button>';
  d.querySelector('.del').onclick=function(e){e.stopPropagation();pages.splice(i,1);if(selIdx===i)selIdx=-1;else if(selIdx>i)selIdx--;renderPages();};
  d.onclick=function(){selIdx=(selIdx===i?-1:i);renderPages();};
  pagesBox.appendChild(d);
 });
}
function captureCanvas(src){
 var cv=document.createElement('canvas');
 cv.width=src.width||src.videoWidth;cv.height=src.height||src.videoHeight;
 cv.getContext('2d').drawImage(src,0,0);
 applyFilter(cv);
 return cv.toDataURL('image/jpeg',0.92);
}
async function openCamera(){
 try{
  stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment',width:{ideal:1920},height:{ideal:1080}},audio:false});
  video.srcObject=stream;video.style.display='block';shot.style.display='block';ph.style.display='none';camErr.style.display='none';
  pick.style.display='none';work.style.display='block';
  toast('✓ Camera ready - point at document');
 }catch(e){
  pick.style.display='none';work.style.display='block';
  ph.style.display='none';camErr.style.display='block';
 }
}
function stopCamera(){
 if(stream){stream.getTracks().forEach(function(t){t.stop();});stream=null;}
 video.srcObject=null;video.style.display='none';shot.style.display='none';
}
shot.onclick=function(){
 if(!stream||video.readyState<2){toast('Camera not ready',true);return;}
 var data=captureCanvas(video);
 pages.push({data:data});
 selIdx=pages.length-1;
 renderPages();
 toast('✓ Page '+(pages.length)+' captured');
};
function handleFiles(files){
 if(!files||!files.length){return;}
 pick.style.display='none';work.style.display='block';
 Array.prototype.slice.call(files).forEach(function(f){
  var rd=new FileReader();
  rd.onload=function(e){
   var im=new Image();
   im.onload=function(){
    var cv=document.createElement('canvas');
    cv.width=im.width;cv.height=im.height;
    cv.getContext('2d').drawImage(im,0,0);
    applyFilter(cv);
    pages.push({data:cv.toDataURL('image/jpeg',0.92)});
    renderPages();
   };
   im.src=e.target.result;
  };
  rd.readAsDataURL(f);
 });
 toast('✓ Adding '+files.length+' photo(s)...');
}
document.getElementById('scCamBtn').onclick=openCamera;
document.getElementById('scUpBtn').onclick=function(){document.getElementById('scFile').click();};
document.getElementById('scFile').onchange=function(){handleFiles(this.files);this.value='';};
document.getElementById('scAdd').onclick=function(){document.getElementById('scAddFile').click();};
document.getElementById('scAddFile').onchange=function(){handleFiles(this.files);this.value='';};
document.getElementById('scClear').onclick=function(){
 if(!pages.length){return;}
 if(!confirm('Clear all '+pages.length+' page(s)?')){return;}
 pages=[];selIdx=-1;renderPages();
 toast('All pages cleared');
};
document.querySelectorAll('.sc-filters button').forEach(function(b){
 b.onclick=function(){
  document.querySelectorAll('.sc-filters button').forEach(function(x){x.classList.remove('active');});
  b.classList.add('active');
  filter=b.getAttribute('data-f');
  toast('Filter: '+filter);
 };
});
goBtn.onclick=async function(){
 if(!pages.length){toast('Scan or upload pages first',true);return;}
 work.style.display='none';done.style.display='none';busy.style.display='block';
 pct(5);setStatus('Loading engine...');
 try{
  await loadJS(PDFLIB_SRC);
  var PDFLib=window.PDFLib;
  var pdf=await PDFLib.PDFDocument.create();
  for(var i=0;i<pages.length;i++){
   setStatus('Building page '+(i+1)+' of '+pages.length+'...');
   var img=await pdf.embedJpg(pages[i].data);
   var w=img.width,h=img.height;
   var page=pdf.addPage([w,h]);
   page.drawImage(img,{x:0,y:0,width:w,height:h});
   pct(5+((i+1)/pages.length)*85);
  }
  setStatus('Saving PDF...');
  var bytes=await pdf.save();
  pct(100);setStatus('Done!');
  stopCamera();
  setTimeout(function(){
   busy.style.display='none';done.style.display='block';
   document.getElementById('scDoneInfo').textContent=pages.length+' page(s) • '+(bytes.length/1024).toFixed(1)+' KB • No watermark';
   var blob=new Blob([bytes],{type:'application/pdf'});
   var dl=document.getElementById('scDl');
   dl.href=URL.createObjectURL(blob);
   dl.download='scan-'+new Date().toISOString().slice(0,10)+'.pdf';
   toast('✓ PDF ready! ('+pages.length+' pages)');
  },300);
 }catch(err){
  busy.style.display='none';work.style.display='block';
  toast('Build failed: '+((err&&err.message)||err),true);
 }
};
document.getElementById('scAgain').onclick=function(){
 done.style.display='none';pick.style.display='block';
 pages=[];selIdx=-1;renderPages();
};
})();
