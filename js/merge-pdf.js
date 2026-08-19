/* TronoPDF - Merge PDF v1 | previews, drag-drop, stable */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
function loadJS(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(false);};s.onerror=function(){cb(true);};document.head.appendChild(s);}
loadJS(PDFJS_SRC,function(e){if(!e&&window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;}});
loadJS(PDFLIB_SRC,function(){});
var pdfjsReady=null;
function ensurePdfjs(){
 if(pdfjsReady){return pdfjsReady;}
 pdfjsReady=new Promise(function(res){
  var tries=0;
  (function wait(){
   if(window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;res(true);return;}
   if(tries>40){res(false);return;}
   tries++;setTimeout(wait,500);
  })();
 });
 return pdfjsReady;
}
root.innerHTML='<style>'+
'.mg-wrap{max-width:1400px;margin:0 auto}'+
'.mg-hero{text-align:center;padding:50px 16px 40px}'+
'.mg-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}'+
'.mg-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}'+
'.mg-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}'+
'.mg-big:hover{transform:translateY(-2px)}'+
'.mg-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}'+
'.mg-zone{border:2px dashed transparent;border-radius:18px}'+
'.mg-zone.on{border-color:#7c3aed;background:#f3f0ff}'+
'.mg-work{display:flex;min-height:70vh;background:#f7f6fc;border-radius:14px;overflow:hidden}'+
'.mg-main{flex:1;padding:40px;overflow-y:auto}'+
'.mg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px}'+
'.mg-card{background:#fff;border-radius:10px;box-shadow:0 2px 10px rgba(30,20,60,.08);padding:14px;text-align:center;position:relative;cursor:grab}'+
'.mg-card.drag{opacity:.4}'+
'.mg-card:hover{box-shadow:0 8px 24px rgba(124,58,237,.14)}'+
'.mg-x{position:absolute;top:8px;right:8px;width:26px;height:26px;border:none;border-radius:50%;background:#f1f2f8;color:#666;font-size:12px;cursor:pointer;opacity:0;transition:.15s}'+
'.mg-card:hover .mg-x{opacity:1}'+
'.mg-x:hover{background:#fdeaea;color:#dc2626}'+
'.mg-thumb{height:210px;display:flex;align-items:center;justify-content:center;background:#fafbfe;border:1px solid #eef0f6;border-radius:6px;overflow:hidden;margin-bottom:10px}'+
'.mg-thumb img{max-width:100%;max-height:100%;object-fit:contain}'+
'.mg-ph{color:#c3c6d4;font-size:30px}'+
'.mg-load{width:26px;height:26px;border:3px solid #e0e7ff;border-top-color:#7c3aed;border-radius:50%;animation:mgsp .8s linear infinite;display:inline-block}'+
'@keyframes mgsp{to{transform:rotate(360deg)}}'+
'.mg-nm{font-size:12.5px;font-weight:600;color:#4b4b55;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
'.mg-card.bad .mg-thumb{background:#fdeaea}'+
'.mg-addcard{border:2px dashed #c9cddd;border-radius:10px;min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#8a8fa3;cursor:pointer;font-weight:700}'+
'.mg-addcard:hover{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}'+
'.mg-addcircle{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:26px;border:none;cursor:pointer;box-shadow:0 10px 24px rgba(124,58,237,.4)}'+
'.mg-side{width:330px;background:#fff;border-left:1px solid #eceaf6;padding:30px 26px;display:flex;flex-direction:column}'+
'.mg-side h2{font-size:26px;font-weight:900;text-align:center;margin-bottom:18px}'+
'.mg-tip{background:#ede9fe;border-radius:10px;padding:14px 16px;font-size:13.5px;color:#5b21b6;line-height:1.55}'+
'.mg-side-foot{margin-top:auto;display:flex;flex-direction:column;gap:12px}'+
'.mg-sort{background:#f4f5fa;border:none;border-radius:10px;padding:12px;font-weight:800;color:#4b4b55;cursor:pointer}'+
'.mg-sort:hover{background:#e6e8f5}'+
'.mg-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}'+
'.mg-go:disabled{opacity:.5;cursor:not-allowed}'+
'.mg-busy{padding:80px 20px;text-align:center}'+
'.mg-busy h2{font-size:30px;font-weight:900;margin-bottom:8px}'+
'.mg-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:26px}'+
'.mg-bar{max-width:760px;margin:0 auto 18px;height:16px;background:#fff;border-radius:999px;overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,.08)}'+
'.mg-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);border-radius:999px;transition:width .3s}'+
'.mg-pct{font-size:40px;font-weight:900}'+
'.mg-note{color:#9a9aa5;font-size:13px;margin-top:14px}'+
'.mg-done{text-align:center;padding:70px 20px}'+
'.mg-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}'+
'.mg-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}'+
'.mg-again{display:inline-block;margin-left:12px;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:17px 26px;border-radius:12px;border:none;cursor:pointer}'+
'@media(max-width:900px){.mg-work{flex-direction:column}.mg-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}'+
'</style>'+
'<div class="mg-wrap">'+
'<div id="mgPick"><div class="mg-hero"><h1>Merge PDF files</h1><p>Combine PDFs in the order you want with the easiest PDF merger available.</p>'+
'<div class="mg-zone" id="mgZone"><button class="mg-big" id="mgBtn" type="button">Select PDF files</button><p class="mg-drop-hint">or drop PDFs here</p></div></div></div>'+
'<div id="mgWork" style="display:none" class="mg-work">'+
'<div class="mg-main"><div class="mg-grid" id="mgList"></div></div>'+
'<aside class="mg-side"><h2>Merge PDF</h2>'+
'<div class="mg-tip">ℹ️ To change the order of your PDFs, drag and drop the files as you want. Files are processed on your device - nothing is uploaded.</div>'+
'<div class="mg-side-foot"><button class="mg-sort" id="mgSort" type="button">↓A-Z Sort by name</button><button class="mg-go" id="mgGo" type="button">Merge PDF →</button></div></aside></div>'+
'<div id="mgBusy" style="display:none" class="mg-busy"><h2 id="mgBusyTitle">Processing files...</h2><p class="fn" id="mgBusyName"></p><div class="mg-bar"><div id="mgBarFill"></div></div><div class="mg-pct" id="mgPct">0%</div><p class="mg-note">⚡ Processed locally on your device - no upload needed, fully private</p></div>'+
'<div id="mgDone" style="display:none" class="mg-done"><div class="mg-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDFs merged successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="mgDoneInfo"></p><a class="mg-dl" id="mgDl" href="#">⬇ Download merged PDF</a><button class="mg-again" id="mgAgain" type="button">Merge more files</button></div>'+
'<input type="file" id="mgFile" accept="application/pdf,.pdf" multiple style="display:none">'+
'</div>';
var files=[];var queue=[];var processing=false;var dragIdx=null;
var pick=document.getElementById('mgPick'),work=document.getElementById('mgWork'),busy=document.getElementById('mgBusy'),done=document.getElementById('mgDone');
var zone=document.getElementById('mgZone'),btn=document.getElementById('mgBtn'),inp=document.getElementById('mgFile'),list=document.getElementById('mgList'),go=document.getElementById('mgGo');
function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
function addFiles(fl){
 var added=0;
 for(var i=0;i<fl.length;i++){var f=fl[i];if(f.type==='application/pdf'||/\.pdf$/i.test(f.name)){var it={f:f,size:f.size,pages:null,thumb:null,bad:false,done:false};files.push(it);queue.push(it);added++;}}
 if(!added){return;}
 pick.style.display='none';work.style.display='flex';
 render();processQueue();
}
function processQueue(){
 if(processing){return;}
 var it=queue.shift();
 if(!it){return;}
 processing=true;
 ensurePdfjs().then(function(ok){
  if(!ok){it.done=true;processing=false;render();processQueue();return;}
  it.f.arrayBuffer().then(function(buf){
   return window.pdfjsLib.getDocument({data:buf}).promise.then(function(doc){
    it.pages=doc.numPages;
    return doc.getPage(1).then(function(p){
     var vp=p.getViewport({scale:1});
     var vp2=p.getViewport({scale:Math.min(2,220/vp.width)});
     var canvas=document.createElement('canvas');
     canvas.width=Math.floor(vp2.width);canvas.height=Math.floor(vp2.height);
     return p.render({canvasContext:canvas.getContext('2d'),viewport:vp2}).promise.then(function(){it.thumb=canvas.toDataURL('image/png');doc.destroy();});
    });
   });
  }).catch(function(){}).then(function(){it.done=true;processing=false;render();processQueue();});
 });
}
function render(){
 list.innerHTML='';
 files.forEach(function(it,i){
  var c=document.createElement('div');c.className='mg-card'+(it.bad?' bad':'');c.draggable=true;
  var th=it.thumb?'<img src="'+it.thumb+'" alt="">':(it.bad?'<span class="mg-ph">⚠️</span>':(it.done?'<span class="mg-ph">📄</span>':'<span class="mg-load"></span>'));
  c.innerHTML='<button class="mg-x" type="button" title="Remove">✕</button><div class="mg-thumb">'+th+'</div><div class="mg-nm">'+it.f.name+(it.pages?' <span style="color:#9a9aa5;font-weight:600">• '+it.pages+'p</span>':'')+'</div>';
  c.querySelector('.mg-x').onclick=function(){files.splice(i,1);render();};
  c.addEventListener('dragstart',function(){dragIdx=i;c.classList.add('drag');});
  c.addEventListener('dragend',function(){c.classList.remove('drag');dragIdx=null;});
  c.addEventListener('dragover',function(e){e.preventDefault();});
  c.addEventListener('drop',function(e){e.preventDefault();if(dragIdx===null||dragIdx===i){return;}files.splice(i,0,files.splice(dragIdx,1)[0]);dragIdx=null;render();});
  list.appendChild(c);
 });
 var add=document.createElement('div');add.className='mg-addcard';
 add.innerHTML='<button class="mg-addcircle" type="button">+</button><span>Add more files</span>';
 add.onclick=function(){inp.click();};
 list.appendChild(add);
 var good=files.filter(function(x){return !x.bad;});
 go.disabled=good.length<2;
}
document.getElementById('mgSort').onclick=function(){files.sort(function(a,b){return a.f.name.toLowerCase()<b.f.name.toLowerCase()?-1:1;});render();};
btn.onclick=function(){inp.click();};
inp.onchange=function(){addFiles(inp.files);inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');addFiles(e.dataTransfer.files);};
go.onclick=function(){
 var good=files.filter(function(x){return !x.bad;});
 if(good.length<2){return;}
 work.style.display='none';busy.style.display='block';
 var skipped=0;
 function pct(p){document.getElementById('mgPct').textContent=Math.round(p)+'%';document.getElementById('mgBarFill').style.width=p+'%';}
 function step(i,out){
  pct(i/good.length*100);
  if(i>=good.length){
   out.save().then(function(bytes){
    var blob=new Blob([bytes],{type:'application/pdf'});
    var u=URL.createObjectURL(blob);
    pct(100);
    setTimeout(function(){
     busy.style.display='none';done.style.display='block';
     document.getElementById('mgDoneInfo').textContent=out.getPageCount()+' pages • '+fmtB(blob.size)+(skipped?' • '+skipped+' unreadable file(s) skipped':'');
     var dl=document.getElementById('mgDl');dl.href=u;dl.download='tronopdf-merged.pdf';
    },400);
   }).catch(function(){busy.style.display='none';work.style.display='flex';});
   return;
  }
  document.getElementById('mgBusyTitle').textContent='Merging file '+(i+1)+' of '+good.length;
  document.getElementById('mgBusyName').textContent=good[i].f.name+' ('+fmtB(good[i].size)+')';
  good[i].f.arrayBuffer().then(function(buf){
   return PDFLib.PDFDocument.load(buf,{ignoreEncryption:true}).then(function(src){
    return out.copyPages(src,src.getPageIndices()).then(function(pg){pg.forEach(function(p){out.addPage(p);});});
   });
  }).catch(function(){skipped++;}).then(function(){step(i+1,out);});
 }
 PDFLib.PDFDocument.create().then(function(out){step(0,out);});
};
document.getElementById('mgAgain').onclick=function(){files=[];queue=[];done.style.display='none';busy.style.display='none';work.style.display='none';pick.style.display='block';};
})();
