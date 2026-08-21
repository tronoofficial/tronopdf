/* TronoPDF - Organize PDF v1 | reorder, delete, rotate, multi-file */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
function loadJS(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(false);};s.onerror=function(){cb(true);};document.head.appendChild(s);}
loadJS(PDFLIB_SRC,function(){});
loadJS(PDFJS_SRC,function(e){if(!e&&window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;}});
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
'.og-wrap{max-width:1400px;margin:0 auto}'+
'.og-hero{text-align:center;padding:50px 16px 40px}'+
'.og-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}'+
'.og-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}'+
'.og-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}'+
'.og-big:hover{transform:translateY(-2px)}'+
'.og-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}'+
'.og-zone{border:2px dashed transparent;border-radius:18px}'+
'.og-zone.on{border-color:#7c3aed;background:#f3f0ff}'+
'.og-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}'+
'.og-main{display:flex;min-height:620px}'+
'.og-pages{flex:1;padding:40px;overflow-y:auto}'+
'.og-tip{background:#ede9fe;border-radius:10px;padding:12px 16px;font-size:13px;color:#5b21b6;margin-bottom:20px}'+
'.og-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:18px}'+
'.og-card{background:#fff;border:2px solid #eceaf6;border-radius:10px;padding:12px;text-align:center;cursor:grab;transition:.2s;position:relative}'+
'.og-card:hover{border-color:#7c3aed;transform:translateY(-2px);box-shadow:0 8px 24px rgba(124,58,237,.12)}'+
'.og-card.drag{opacity:.4}'+
'.og-thumb{height:170px;display:flex;align-items:center;justify-content:center;background:#fafbfe;border-radius:6px;margin-bottom:8px;overflow:hidden}'+
'.og-thumb img{max-width:100%;max-height:100%;object-fit:contain;transition:transform .3s}'+
'.og-num{font-size:12px;font-weight:800;color:#4b4b5a}'+
'.og-acts{position:absolute;top:6px;right:6px;display:none;gap:4px}'+
'.og-card:hover .og-acts{display:flex}'+
'.og-acts button{width:26px;height:26px;border:none;border-radius:6px;background:rgba(255,255,255,.95);color:#4b4b5a;font-size:13px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.15)}'+
'.og-acts button:hover{background:#7c3aed;color:#fff}'+
'.og-acts .del:hover{background:#dc2626}'+
'.og-add{border:2px dashed #c9cddd;border-radius:10px;min-height:210px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#8a8fa3;cursor:pointer;font-weight:700}'+
'.og-add:hover{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}'+
'.og-addcircle{width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:24px;border:none;cursor:pointer;box-shadow:0 8px 20px rgba(124,58,237,.4)}'+
'.og-side{width:360px;background:#fff;border-left:1px solid #eceaf6;padding:28px;display:flex;flex-direction:column}'+
'.og-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:18px}'+
'.og-files{flex:1;overflow-y:auto;margin-bottom:16px}'+
'.og-file{background:#f7f6fc;border:1px solid #eceaf6;border-radius:10px;padding:12px 14px;margin-bottom:8px;font-size:13px;font-weight:600;color:#4b4b5a}'+
'.og-file small{display:block;color:#9a9aa5;font-weight:600;margin-top:2px}'+
'.og-reset{width:100%;border:1px solid #fecaca;background:#fff5f5;color:#dc2626;font-weight:700;font-size:13px;padding:10px;border-radius:8px;cursor:pointer;margin-bottom:12px}'+
'.og-reset:hover{background:#fdeaea}'+
'.og-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}'+
'.og-go:disabled{opacity:.5;cursor:not-allowed}'+
'.og-busy{display:none;padding:60px 20px;text-align:center}'+
'.og-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}'+
'.og-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:26px}'+
'.og-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}'+
'.og-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .3s}'+
'.og-pct{font-size:36px;font-weight:900}'+
'.og-done{display:none;text-align:center;padding:60px 20px}'+
'.og-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}'+
'.og-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}'+
'.og-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}'+
'@media(max-width:900px){.og-main{flex-direction:column}.og-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}'+
'</style>'+
'<div class="og-wrap">'+
'<div id="ogPick"><div class="og-hero"><h1>Organize PDF pages</h1><p>Reorder, delete and rotate pages. Combine multiple PDFs. Free, private and unlimited.</p>'+
'<div class="og-zone" id="ogZone"><button class="og-big" id="ogBtn" type="button">Select PDF files</button><p class="og-drop-hint">or drop PDFs here</p></div></div></div>'+
'<div class="og-work" id="ogWork"><div class="og-main"><div class="og-pages"><div class="og-tip">💡 Drag pages to reorder • Hover for rotate & delete • Add more files anytime</div><div class="og-grid" id="ogGrid"></div></div>'+
'<aside class="og-side"><h2>Organize PDF</h2><div class="og-files" id="ogFiles"></div>'+
'<button class="og-reset" id="ogReset" type="button">↺ Reset all</button>'+
'<button class="og-go" id="ogGo" type="button">Organize →</button></aside></div></div>'+
'<div class="og-busy" id="ogBusy"><h2>Organizing pages...</h2><p class="fn" id="ogBusyName"></p><div class="og-bar"><div id="ogBarFill"></div></div><div class="og-pct" id="ogPct">0%</div></div>'+
'<div class="og-done" id="ogDone"><div class="og-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF organized successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="ogDoneInfo"></p><a class="og-dl" id="ogDl" href="#">⬇ Download organized PDF</a><button class="og-again" id="ogAgain" type="button">Organize another</button></div>'+
'<input type="file" id="ogFile" accept="application/pdf,.pdf" multiple style="display:none">'+
'</div>';
var docs=[];var items=[];var initial=[];var dragIdx=null;
var pick=document.getElementById('ogPick'),work=document.getElementById('ogWork'),busy=document.getElementById('ogBusy'),done=document.getElementById('ogDone');
var zone=document.getElementById('ogZone'),btn=document.getElementById('ogBtn'),inp=document.getElementById('ogFile'),grid=document.getElementById('ogGrid');
var go=document.getElementById('ogGo'),filesEl=document.getElementById('ogFiles');
function addFiles(fl){
 var pdfs=[];
 for(var i=0;i<fl.length;i++){var f=fl[i];if(f.type==='application/pdf'||/\.pdf$/i.test(f.name)){pdfs.push(f);}}
 if(!pdfs.length){alert('Please select PDF files.');return;}
 pick.style.display='none';work.style.display='block';
 Promise.all([waitLib('PDFLib'),waitLib('pdfjsLib')]).then(function(ok){
  if(ok[0]===false||ok[1]===false){alert('Error loading libraries.');return;}
  window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
  var chain=Promise.resolve();
  pdfs.forEach(function(f){chain=chain.then(function(){return loadOne(f);});});
  chain.then(function(){
   snapshot();renderFiles();renderGrid();
  }).catch(function(){alert('Error reading PDF files.');});
 });
}
function loadOne(f){
 return f.arrayBuffer().then(function(b1){
  return PDFLib.PDFDocument.load(b1,{ignoreEncryption:true}).then(function(libdoc){
   return f.arrayBuffer().then(function(b2){
    return window.pdfjsLib.getDocument({data:b2}).promise.then(function(jsdoc){
     var di=docs.length;docs.push({doc:libdoc,name:f.name,pages:jsdoc.numPages});
     var n=jsdoc.numPages;var chain=Promise.resolve();
     for(var p=1;p<=n;p++){
      (function(pg){
       chain=chain.then(function(){
        return jsdoc.getPage(pg).then(function(page){
         var vp=page.getViewport({scale:1});
         var scale=Math.min(1,150/vp.width);
         var vp2=page.getViewport({scale:scale});
         var canvas=document.createElement('canvas');
         canvas.width=Math.floor(vp2.width);canvas.height=Math.floor(vp2.height);
         return page.render({canvasContext:canvas.getContext('2d'),viewport:vp2}).promise.then(function(){
          items.push({d:di,p:pg-1,rot:0,thumb:canvas.toDataURL('image/jpeg',0.6)});
         });
        });
       });
      })(p);
     }
     return chain.then(function(){jsdoc.destroy();});
    });
   });
  });
 });
}
function snapshot(){initial=items.map(function(it){return {d:it.d,p:it.p,rot:it.rot,thumb:it.thumb};});}
function renderFiles(){
 filesEl.innerHTML='';
 docs.forEach(function(d){
  var div=document.createElement('div');div.className='og-file';
  div.innerHTML='📄 '+d.name+'<small>'+d.pages+' pages</small>';
  filesEl.appendChild(div);
 });
}
function renderGrid(){
 grid.innerHTML='';
 items.forEach(function(it,i){
  var c=document.createElement('div');c.className='og-card';c.draggable=true;
  c.innerHTML='<div class="og-acts"><button class="rl" type="button" title="Rotate left">↺</button><button class="rr" type="button" title="Rotate right">↻</button><button class="del" type="button" title="Delete">✕</button></div><div class="og-thumb"><img src="'+it.thumb+'" alt="" style="transform:rotate('+it.rot+'deg)"></div><div class="og-num">'+(i+1)+'</div>';
  c.querySelector('.rl').onclick=function(){it.rot=(it.rot+270)%360;renderGrid();};
  c.querySelector('.rr').onclick=function(){it.rot=(it.rot+90)%360;renderGrid();};
  c.querySelector('.del').onclick=function(){items.splice(i,1);renderGrid();};
  c.addEventListener('dragstart',function(){dragIdx=i;c.classList.add('drag');});
  c.addEventListener('dragend',function(){c.classList.remove('drag');dragIdx=null;});
  c.addEventListener('dragover',function(e){e.preventDefault();});
  c.addEventListener('drop',function(e){e.preventDefault();if(dragIdx===null||dragIdx===i){return;}items.splice(i,0,items.splice(dragIdx,1)[0]);dragIdx=null;renderGrid();});
  grid.appendChild(c);
 });
 var add=document.createElement('div');add.className='og-add';
 add.innerHTML='<button class="og-addcircle" type="button">+</button><span>Add more files</span>';
 add.onclick=function(){inp.click();};
 grid.appendChild(add);
 go.disabled=items.length<1;
}
document.getElementById('ogReset').onclick=function(){
 items=initial.map(function(it){return {d:it.d,p:it.p,rot:it.rot,thumb:it.thumb};});
 renderGrid();
};
btn.onclick=function(){inp.click();};
inp.onchange=function(){addFiles(inp.files);inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');addFiles(e.dataTransfer.files);};
function pct(p){document.getElementById('ogPct').textContent=Math.round(p)+'%';document.getElementById('ogBarFill').style.width=p+'%';}
go.onclick=function(){
 if(items.length<1){return;}
 work.style.display='none';busy.style.display='block';
 document.getElementById('ogBusyName').textContent=items.length+' page(s)';
 pct(5);
 PDFLib.PDFDocument.create().then(function(out){
  var chain=Promise.resolve();
  items.forEach(function(it,idx){
   chain=chain.then(function(){
    pct(10+(idx/items.length)*80);
    return out.copyPages(docs[it.d].doc,[it.p]).then(function(copied){
     var pg=copied[0];
     if(it.rot!==0){
      var cur=pg.getRotation().angle;
      pg.setRotation(PDFLib.degrees((cur+it.rot)%360));
     }
     out.addPage(pg);
    });
   });
  });
  chain.then(function(){
   return out.save().then(function(bytes){
    pct(100);
    setTimeout(function(){
     busy.style.display='none';done.style.display='block';
     document.getElementById('ogDoneInfo').textContent=out.getPageCount()+' pages • '+fmtB(bytes.length);
     var blob=new Blob([bytes],{type:'application/pdf'});
     var dl=document.getElementById('ogDl');dl.href=URL.createObjectURL(blob);dl.download='organized.pdf';
    },300);
   });
  });
 }).catch(function(){
  busy.style.display='none';work.style.display='block';
  alert('Error organizing PDF. Please try again.');
 });
};
document.getElementById('ogAgain').onclick=function(){
 docs=[];items=[];initial=[];
 done.style.display='none';work.style.display='none';pick.style.display='block';
};
})();
