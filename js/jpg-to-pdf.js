/* TronoPDF - JPG to PDF v1 | orientation, sizes, margins, quality, reorder */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
function loadJS(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(false);};s.onerror=function(){cb(true);};document.head.appendChild(s);}
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
function dataURLtoBytes(d){var b=atob(d.split(',')[1]);var a=new Uint8Array(b.length);for(var i=0;i<b.length;i++){a[i]=b.charCodeAt(i);}return a;}
function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
root.innerHTML='<style>'+
'.jp-wrap{max-width:1400px;margin:0 auto}'+
'.jp-hero{text-align:center;padding:50px 16px 40px}'+
'.jp-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}'+
'.jp-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}'+
'.jp-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}'+
'.jp-big:hover{transform:translateY(-2px)}'+
'.jp-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}'+
'.jp-zone{border:2px dashed transparent;border-radius:18px}'+
'.jp-zone.on{border-color:#7c3aed;background:#f3f0ff}'+
'.jp-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}'+
'.jp-main{display:flex;min-height:560px}'+
'.jp-images{flex:1;padding:40px;overflow-y:auto}'+
'.jp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px}'+
'.jp-card{background:#fff;border:2px solid #eceaf6;border-radius:10px;padding:12px;text-align:center;cursor:grab;transition:.2s;position:relative}'+
'.jp-card:hover{border-color:#7c3aed;transform:translateY(-2px)}'+
'.jp-card.drag{opacity:.4}'+
'.jp-card img{width:100%;height:150px;object-fit:cover;border-radius:6px;background:#fafbfe;margin-bottom:8px}'+
'.jp-card .nm{font-size:11.5px;font-weight:600;color:#4b4b5a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
'.jp-card .x{position:absolute;top:6px;right:6px;width:24px;height:24px;border:none;border-radius:50%;background:rgba(255,255,255,.9);color:#dc2626;font-size:12px;cursor:pointer;opacity:0;transition:.15s;box-shadow:0 2px 8px rgba(0,0,0,.15)}'+
'.jp-card:hover .x{opacity:1}'+
'.jp-add{border:2px dashed #c9cddd;border-radius:10px;min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#8a8fa3;cursor:pointer;font-weight:700}'+
'.jp-add:hover{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}'+
'.jp-addcircle{width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:24px;border:none;cursor:pointer;box-shadow:0 8px 20px rgba(124,58,237,.4)}'+
'.jp-side{width:380px;background:#fff;border-left:1px solid #eceaf6;padding:30px;display:flex;flex-direction:column;overflow-y:auto}'+
'.jp-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:22px}'+
'.jp-lbl{font-size:13px;font-weight:800;color:#4b4b5a;margin-bottom:10px}'+
'.jp-sec{margin-bottom:20px}'+
'.jp-two{display:flex;gap:10px}'+
'.jp-btn{flex:1;border:2px solid #eceaf6;border-radius:10px;background:#fff;padding:14px 10px;font-size:13px;font-weight:700;color:#6b6b7a;cursor:pointer;text-align:center;transition:.2s}'+
'.jp-btn:hover{border-color:#7c3aed}'+
'.jp-btn.active{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}'+
'.jp-three{display:flex;gap:8px}'+
'.jp-select{width:100%;padding:12px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;font-family:inherit;background:#fff}'+
'.jp-merge{display:flex;align-items:center;gap:10px;margin-top:4px}'+
'.jp-merge input{width:18px;height:18px;accent-color:#7c3aed}'+
'.jp-merge label{font-size:13px;font-weight:600;color:#4b4b5a;cursor:pointer}'+
'.jp-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:auto}'+
'.jp-go:disabled{opacity:.5;cursor:not-allowed}'+
'.jp-busy{display:none;padding:60px 20px;text-align:center}'+
'.jp-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}'+
'.jp-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:26px}'+
'.jp-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,.08)}'+
'.jp-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);border-radius:999px;transition:width .3s}'+
'.jp-pct{font-size:36px;font-weight:900}'+
'.jp-done{display:none;text-align:center;padding:60px 20px}'+
'.jp-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}'+
'.jp-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35);margin:6px}'+
'.jp-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-top:14px}'+
'@media(max-width:900px){.jp-main{flex-direction:column}.jp-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}'+
'</style>'+
'<div class="jp-wrap">'+
'<div id="jpPick"><div class="jp-hero"><h1>JPG to PDF</h1><p>Convert JPG, PNG and WEBP images to PDF. Free, private and unlimited.</p>'+
'<div class="jp-zone" id="jpZone"><button class="jp-big" id="jpBtn" type="button">Select images</button><p class="jp-drop-hint">or drop images here</p></div></div></div>'+
'<div class="jp-work" id="jpWork"><div class="jp-main"><div class="jp-images"><div class="jp-grid" id="jpGrid"></div></div>'+
'<aside class="jp-side"><h2>Image to PDF options</h2>'+
'<div class="jp-sec"><div class="jp-lbl">Page orientation</div><div class="jp-two"><button class="jp-btn active" id="jpPortrait" type="button">📄 Portrait</button><button class="jp-btn" id="jpLandscape" type="button">📄 Landscape</button></div></div>'+
'<div class="jp-sec"><div class="jp-lbl">Page size</div><select class="jp-select" id="jpSize"><option value="a4">A4 (210x297 mm)</option><option value="letter">Letter (8.5x11 in)</option><option value="legal">Legal (8.5x14 in)</option><option value="fit">Fit to image</option></select></div>'+
'<div class="jp-sec"><div class="jp-lbl">Margin</div><div class="jp-three"><button class="jp-btn active" data-m="0" type="button">No margin</button><button class="jp-btn" data-m="20" type="button">Small</button><button class="jp-btn" data-m="40" type="button">Big</button></div></div>'+
'<div class="jp-sec"><div class="jp-lbl">Image quality</div><div class="jp-three"><button class="jp-btn" data-q="0.6" type="button">Low</button><button class="jp-btn active" data-q="0.8" type="button">Good</button><button class="jp-btn" data-q="0.92" type="button">Best</button></div></div>'+
'<div class="jp-sec jp-merge"><input type="checkbox" id="jpMerge" checked><label for="jpMerge">Merge all images in one PDF file</label></div>'+
'<button class="jp-go" id="jpGo" type="button">Convert to PDF →</button></aside></div></div>'+
'<div class="jp-busy" id="jpBusy"><h2>Converting images...</h2><p class="fn" id="jpBusyName"></p><div class="jp-bar"><div id="jpBarFill"></div></div><div class="jp-pct" id="jpPct">0%</div></div>'+
'<div class="jp-done" id="jpDone"><div class="jp-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF created successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:24px" id="jpDoneInfo"></p><div id="jpDownloads"></div><br><button class="jp-again" id="jpAgain" type="button">Convert more images</button></div>'+
'<input type="file" id="jpFile" accept="image/*,.jpg,.jpeg,.png,.webp" multiple style="display:none">'+
'</div>';
var files=[];var dragIdx=null;
var orient='portrait',margin=0,quality=0.8;
var SIZES={a4:[595.28,841.89],letter:[612,792],legal:[612,1008]};
var pick=document.getElementById('jpPick'),work=document.getElementById('jpWork'),busy=document.getElementById('jpBusy'),done=document.getElementById('jpDone');
var zone=document.getElementById('jpZone'),btn=document.getElementById('jpBtn'),inp=document.getElementById('jpFile'),grid=document.getElementById('jpGrid');
var go=document.getElementById('jpGo');
function addFiles(fl){
 var added=0;
 for(var i=0;i<fl.length;i++){
  var f=fl[i];
  if(f.type.indexOf('image/')===0||/\.(jpg|jpeg|png|webp)$/i.test(f.name)){
   files.push({f:f,url:URL.createObjectURL(f),name:f.name});added++;
  }
 }
 if(!added){alert('Please select image files (JPG, PNG, WEBP).');return;}
 pick.style.display='none';work.style.display='block';
 render();
}
function render(){
 grid.innerHTML='';
 files.forEach(function(it,i){
  var c=document.createElement('div');c.className='jp-card';c.draggable=true;
  c.innerHTML='<button class="x" type="button">✕</button><img src="'+it.url+'" alt=""><div class="nm">'+(i+1)+'. '+it.name+'</div>';
  c.querySelector('.x').onclick=function(){URL.revokeObjectURL(it.url);files.splice(i,1);render();};
  c.addEventListener('dragstart',function(){dragIdx=i;c.classList.add('drag');});
  c.addEventListener('dragend',function(){c.classList.remove('drag');dragIdx=null;});
  c.addEventListener('dragover',function(e){e.preventDefault();});
  c.addEventListener('drop',function(e){e.preventDefault();if(dragIdx===null||dragIdx===i){return;}files.splice(i,0,files.splice(dragIdx,1)[0]);dragIdx=null;render();});
  grid.appendChild(c);
 });
 var add=document.createElement('div');add.className='jp-add';
 add.innerHTML='<button class="jp-addcircle" type="button">+</button><span>Add more images</span>';
 add.onclick=function(){inp.click();};
 grid.appendChild(add);
 go.disabled=files.length<1;
}
document.getElementById('jpPortrait').onclick=function(){orient='portrait';this.classList.add('active');document.getElementById('jpLandscape').classList.remove('active');};
document.getElementById('jpLandscape').onclick=function(){orient='landscape';this.classList.add('active');document.getElementById('jpPortrait').classList.remove('active');};
document.querySelectorAll('[data-m]').forEach(function(b){
 b.onclick=function(){margin=parseInt(this.getAttribute('data-m'));document.querySelectorAll('[data-m]').forEach(function(x){x.classList.remove('active');});this.classList.add('active');};
});
document.querySelectorAll('[data-q]').forEach(function(b){
 b.onclick=function(){quality=parseFloat(this.getAttribute('data-q'));document.querySelectorAll('[data-q]').forEach(function(x){x.classList.remove('active');});this.classList.add('active');};
});
btn.onclick=function(){inp.click();};
inp.onchange=function(){addFiles(inp.files);inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');addFiles(e.dataTransfer.files);};
function imgToJpeg(file,q){
 return new Promise(function(res,rej){
  var img=new Image();var u=URL.createObjectURL(file);
  img.onload=function(){
   var maxD=3000;var sc=Math.min(1,maxD/Math.max(img.width,img.height));
   var c=document.createElement('canvas');
   c.width=Math.max(1,Math.round(img.width*sc));c.height=Math.max(1,Math.round(img.height*sc));
   var ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);
   ctx.drawImage(img,0,0,c.width,c.height);
   URL.revokeObjectURL(u);
   res({bytes:dataURLtoBytes(c.toDataURL('image/jpeg',q)),w:c.width,h:c.height});
  };
  img.onerror=function(){URL.revokeObjectURL(u);rej(new Error('bad image'));};
  img.src=u;
 });
}
function pct(p){document.getElementById('jpPct').textContent=Math.round(p)+'%';document.getElementById('jpBarFill').style.width=p+'%';}
go.onclick=function(){
 if(files.length<1){return;}
 work.style.display='none';busy.style.display='block';
 document.getElementById('jpBusyName').textContent=files.length+' image(s)';
 pct(5);
 waitLib('PDFLib').then(function(ok){
  if(!ok){busy.style.display='none';work.style.display='block';alert('Error loading PDF library.');return;}
  var merge=document.getElementById('jpMerge').checked;
  var size=document.getElementById('jpSize').value;
  var results=[];var skipped=0;
  var chain=Promise.resolve();
  var mergedDoc=null;
  chain=PDFLib.PDFDocument.create().then(function(d){mergedDoc=d;return null;});
  files.forEach(function(it,idx){
   chain=chain.then(function(){
    pct(10+(idx/files.length)*80);
    return imgToJpeg(it.f,quality).then(function(img){
     function placeInto(doc){
      var pw,ph;
      var iw=img.w*0.75,ih=img.h*0.75;
      if(size==='fit'){pw=iw+margin*2;ph=ih+margin*2;}
      else{
       var d=SIZES[size];
       if(orient==='portrait'){pw=d[0];ph=d[1];}else{pw=d[1];ph=d[0];}
      }
      var page=doc.addPage([pw,ph]);
      return doc.embedJpg(img.bytes).then(function(ej){
       var cw=pw-margin*2,ch=ph-margin*2;
       var sc=Math.min(cw/iw,ch/ih);
       var dw=iw*sc,dh=ih*sc;
       page.drawImage(ej,{x:(pw-dw)/2,y:(ph-dh)/2,width:dw,height:dh});
       return null;
      });
     }
     if(merge){return placeInto(mergedDoc);}
     return PDFLib.PDFDocument.create().then(function(d){return placeInto(d).then(function(){return d.save();});}).then(function(bytes){results.push({name:it.name.replace(/\.[^.]+$/,'')+'.pdf',bytes:bytes});});
    }).catch(function(){skipped++;});
   });
  });
  chain.then(function(){
   if(merge){
    return mergedDoc.save().then(function(bytes){results.push({name:'tronopdf-images.pdf',bytes:bytes});});
   }
   return null;
  }).then(function(){
   pct(100);
   setTimeout(function(){
    busy.style.display='none';done.style.display='block';
    var total=results.reduce(function(a,r){return a+r.bytes.length;},0);
    document.getElementById('jpDoneInfo').textContent=results.length+' PDF file(s) created • '+fmtB(total)+(skipped?' • '+skipped+' image(s) skipped':'');
    var dl=document.getElementById('jpDownloads');dl.innerHTML='';
    results.forEach(function(r){
     var blob=new Blob([r.bytes],{type:'application/pdf'});
     var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=r.name;a.className='jp-dl';a.textContent='⬇ '+r.name;
     dl.appendChild(a);
    });
   },300);
  }).catch(function(){
   busy.style.display='none';work.style.display='block';
   alert('Error converting images. Please try again.');
  });
 });
};
document.getElementById('jpAgain').onclick=function(){
 files.forEach(function(it){URL.revokeObjectURL(it.url);});
 files=[];done.style.display='none';work.style.display='none';pick.style.display='block';
};
})();
