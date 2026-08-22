/* TronoPDF - Crop PDF v1 | drag handles, auto-detect, presets, browser-based */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
function loadJS(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(false);};s.onerror=function(){cb(true);};document.head.appendChild(s);}
loadJS(PDFLIB_SRC,function(){});
loadJS(PDFJS_SRC,function(e){if(!e&&window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;}});
function waitLib(name){return new Promise(function(res){var t=0;(function w(){if(window[name]){res(true);return;}if(t>40){res(false);return;}t++;setTimeout(w,500);})();});}
function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
var PRESETS={
 custom:{label:'Custom',ratio:0},
 a4:{label:'A4 (210×297mm)',ratio:210/297},
 letter:{label:'Letter (8.5×11in)',ratio:8.5/11},
 r16_9:{label:'16:9 Widescreen',ratio:16/9},
 r4_3:{label:'4:3 Standard',ratio:4/3},
 square:{label:'Square 1:1',ratio:1}
};
var html='';
html+='<style>';
html+='.cp-wrap{max-width:1400px;margin:0 auto}';
html+='.cp-hero{text-align:center;padding:50px 16px 40px}';
html+='.cp-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.cp-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.cp-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.cp-big:hover{transform:translateY(-2px)}';
html+='.cp-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.cp-zone{border:2px dashed transparent;border-radius:18px}';
html+='.cp-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.cp-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.cp-main{display:flex;min-height:680px}';
html+='.cp-prev{flex:1;padding:30px;display:flex;flex-direction:column;align-items:center;gap:14px;overflow:auto}';
html+='.cp-canvaswrap{position:relative;border-radius:8px;overflow:hidden;box-shadow:0 10px 40px rgba(30,20,60,.18);background:#fff}';
html+='.cp-canvaswrap canvas{display:block}';
html+='.cp-cropbox{position:absolute;border:2px dashed #7c3aed;background:rgba(124,58,237,.08);cursor:move}';
html+='.cp-handle{position:absolute;width:12px;height:12px;background:#7c3aed;border:2px solid #fff;border-radius:50%;cursor:se-resize}';
html+='.cp-handle.nw{top:-6px;left:-6px;cursor:nw-resize}';
html+='.cp-handle.ne{top:-6px;right:-6px;cursor:ne-resize}';
html+='.cp-handle.sw{bottom:-6px;left:-6px;cursor:sw-resize}';
html+='.cp-handle.se{bottom:-6px;right:-6px;cursor:se-resize}';
html+='.cp-pagenav{display:flex;gap:10px;align-items:center}';
html+='.cp-pagenav button{border:1px solid #eceaf6;background:#fff;border-radius:8px;padding:8px 14px;font-weight:800;cursor:pointer}';
html+='.cp-pagenav button:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.cp-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.cp-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:6px}';
html+='.cp-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:16px}';
html+='.cp-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}';
html+='.cp-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;font-family:inherit;background:#fff}';
html+='.cp-row{display:flex;gap:10px;align-items:center;margin-top:8px}';
html+='.cp-row input[type=number]{flex:1;padding:10px;border:1px solid #ddd;border-radius:10px;font-size:14px;min-width:0}';
html+='.cp-chk{display:flex;gap:8px;align-items:center;margin:6px 0}';
html+='.cp-chk input{width:16px;height:16px;accent-color:#7c3aed}';
html+='.cp-chk label{font-size:13px;font-weight:600;cursor:pointer}';
html+='.cp-presetgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px}';
html+='.cp-preset{border:2px solid #eceaf6;border-radius:8px;padding:8px;font-size:11px;font-weight:800;text-align:center;cursor:pointer;background:#fff;color:#4b4b5a}';
html+='.cp-preset.active{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}';
html+='.cp-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:16px}';
html+='.cp-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.cp-busy{display:none;padding:60px 20px;text-align:center}';
html+='.cp-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.cp-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:26px}';
html+='.cp-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.cp-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .3s}';
html+='.cp-pct{font-size:36px;font-weight:900}';
html+='.cp-done{display:none;text-align:center;padding:50px 20px}';
html+='.cp-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.cp-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.cp-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='@media(max-width:900px){.cp-main{flex-direction:column}.cp-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="cp-wrap">';
html+='<div id="cpPick"><div class="cp-hero"><h1>Crop PDF</h1><p>Remove margins and crop PDF pages to exact size - fast, free and private.</p>';
html+='<div class="cp-zone" id="cpZone"><button class="cp-big" id="cpBtn" type="button">Select PDF file</button><p class="cp-drop-hint">or drop PDF here</p></div></div></div>';
html+='<div class="cp-work" id="cpWork"><div class="cp-main"><div class="cp-prev"><div class="cp-canvaswrap" id="cpCanvasWrap"><canvas id="cpCanvas"></canvas><div class="cp-cropbox" id="cpCropBox"><div class="cp-handle nw"></div><div class="cp-handle ne"></div><div class="cp-handle sw"></div><div class="cp-handle se"></div></div></div>';
html+='<div class="cp-pagenav"><button id="cpPrev" type="button">←</button><span id="cpPageLbl" style="font-weight:800"></span><button id="cpNext" type="button">→</button></div></div>';
html+='<aside class="cp-side"><h2>Crop settings</h2><p class="cp-sub">Drag handles or choose a preset</p>';
html+='<div class="cp-lbl">Preset ratio</div><div class="cp-presetgrid">';
Object.keys(PRESETS).forEach(function(key){
 html+='<div class="cp-preset'+(key==='a4'?' active':'')+'" data-k="'+key+'">'+PRESETS[key].label+'</div>';
});
html+='</div>';
html+='<div class="cp-lbl" style="margin-top:12px">Or custom dimensions (px)</div><div class="cp-row"><input type="number" id="cpW" min="10" placeholder="Width"/><span style="color:#9a9aa5">×</span><input type="number" id="cpH" min="10" placeholder="Height"/></div>';
html+='<div class="cp-chk" style="margin-top:12px"><input type="checkbox" id="cpAuto" checked/><label for="cpAuto">Auto-detect content (remove white margins)</label></div>';
html+='<div class="cp-chk"><input type="checkbox" id="cpAll" checked/><label for="cpAll">Apply to all pages</label></div>';
html+='<button class="cp-go" id="cpGo" type="button">Apply Crop →</button></aside></div></div>';
html+='<div class="cp-busy" id="cpBusy"><h2>Cropping PDF...</h2><p class="fn" id="cpBusyName"></p><div class="cp-bar"><div id="cpBarFill"></div></div><div class="cp-pct" id="cpPct">0%</div></div>';
html+='<div class="cp-done" id="cpDone"><div class="cp-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF cropped successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="cpDoneInfo"></p><a class="cp-dl" id="cpDl" href="#">⬇ Download Cropped PDF</a><button class="cp-again" id="cpAgain" type="button">Crop another PDF</button></div>';
html+='<input type="file" id="cpFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var file=null;var fileBuf=null;var doc=null;var totalPages=0;var curPage=1;var pdfScale=1;
var cropBox={x:50,y:50,w:400,h:500};
var dragging=false,draggingHandle=null,startX=0,startY=0,startBox={};
var pick=document.getElementById('cpPick'),work=document.getElementById('cpWork'),busy=document.getElementById('cpBusy'),done=document.getElementById('cpDone');
var zone=document.getElementById('cpZone'),btn=document.getElementById('cpBtn'),inp=document.getElementById('cpFile');
var canvasWrap=document.getElementById('cpCanvasWrap'),canvas=document.getElementById('cpCanvas'),ctx=canvas.getContext('2d');
var cropBoxEl=document.getElementById('cpCropBox'),pageLbl=document.getElementById('cpPageLbl');
var elW=document.getElementById('cpW'),elH=document.getElementById('cpH'),elAuto=document.getElementById('cpAuto'),elAll=document.getElementById('cpAll');
var presetBtns=document.querySelectorAll('.cp-preset');
function setPreset(key){
 presetBtns.forEach(function(b){b.classList.toggle('active',b.getAttribute('data-k')===key);});
 var p=PRESETS[key];
 if(p&&p.ratio>0){
  var boxW=cropBoxEl.offsetWidth;
  var boxH=Math.round(boxW/p.ratio);
  cropBox.w=boxW;cropBox.h=boxH;
  updateCropBox();
 }
}
presetBtns.forEach(function(b){
 b.onclick=function(){setPreset(b.getAttribute('data-k'));};
});
function updateCropBox(){
 cropBoxEl.style.left=cropBox.x+'px';
 cropBoxEl.style.top=cropBox.y+'px';
 cropBoxEl.style.width=cropBox.w+'px';
 cropBoxEl.style.height=cropBox.h+'px';
 elW.value=Math.round(cropBox.w/pdfScale);
 elH.value=Math.round(cropBox.h/pdfScale);
}
function autoDetect(){
 if(!doc){return;}
 doc.getPage(curPage).then(function(page){
  var vp=page.getViewport({scale:1});
  var tempCanvas=document.createElement('canvas');
  var tctx=tempCanvas.getContext('2d');
  tempCanvas.width=vp.width;tempCanvas.height=vp.height;
  page.render({canvasContext:tctx,viewport:vp}).promise.then(function(){
   var imgData=tctx.getImageData(0,0,tempCanvas.width,tempCanvas.height);
   var data=imgData.data;
   var left=0,right=tempCanvas.width-1,top=0,bottom=tempCanvas.height-1;
   while(left<right){
    var hasContent=false;
    for(var y=top;y<=bottom;y++){
     var i=(y*tempCanvas.width+left)*4;
     if(data[i]<240||data[i+1]<240||data[i+2]<240){hasContent=true;break;}
    }
    if(hasContent)break;
    left++;
   }
   while(right>left){
    var hasContent=false;
    for(var y=top;y<=bottom;y++){
     var i=(y*tempCanvas.width+right)*4;
     if(data[i]<240||data[i+1]<240||data[i+2]<240){hasContent=true;break;}
    }
    if(hasContent)break;
    right--;
   }
   while(top<bottom){
    var hasContent=false;
    for(var x=left;x<=right;x++){
     var i=(top*tempCanvas.width+x)*4;
     if(data[i]<240||data[i+1]<240||data[i+2]<240){hasContent=true;break;}
    }
    if(hasContent)break;
    top++;
   }
   while(bottom>top){
    var hasContent=false;
    for(var x=left;x<=right;x++){
     var i=(bottom*tempCanvas.width+x)*4;
     if(data[i]<240||data[i+1]<240||data[i+2]<240){hasContent=true;break;}
    }
    if(hasContent)break;
    bottom--;
   }
   cropBox.x=Math.round(left/pdfScale);
   cropBox.y=Math.round(top/pdfScale);
   cropBox.w=Math.round((right-left)/pdfScale);
   cropBox.h=Math.round((bottom-top)/pdfScale);
   updateCropBox();
  });
 });
}
cropBoxEl.addEventListener('pointerdown',function(e){
 if(e.target.classList.contains('cp-handle')){
  draggingHandle=e.target.classList[1];
 }else{
  dragging=true;
 }
 startX=e.clientX;startY=e.clientY;
 startBox={x:cropBox.x,y:cropBox.y,w:cropBox.w,h:cropBox.h};
 cropBoxEl.setPointerCapture(e.pointerId);
 e.preventDefault();
});
cropBoxEl.addEventListener('pointermove',function(e){
 if(!dragging&&!draggingHandle){return;}
 var dx=(e.clientX-startX)/pdfScale;
 var dy=(e.clientY-startY)/pdfScale;
 if(dragging){
  cropBox.x=startBox.x+dx;
  cropBox.y=startBox.y+dy;
 }else if(draggingHandle==='nw'){
  cropBox.x=startBox.x+dx;cropBox.y=startBox.y+dy;
  cropBox.w=startBox.w-dx;cropBox.h=startBox.h-dy;
 }else if(draggingHandle==='ne'){
  cropBox.y=startBox.y+dy;
  cropBox.w=startBox.w+dx;cropBox.h=startBox.h-dy;
 }else if(draggingHandle==='sw'){
  cropBox.x=startBox.x+dx;
  cropBox.w=startBox.w-dx;cropBox.h=startBox.h+dy;
 }else if(draggingHandle==='se'){
  cropBox.w=startBox.w+dx;cropBox.h=startBox.h+dy;
 }
 if(cropBox.x<0)cropBox.x=0;
 if(cropBox.y<0)cropBox.y=0;
 if(cropBox.w<50)cropBox.w=50;
 if(cropBox.h<50)cropBox.h=50;
 updateCropBox();
});
cropBoxEl.addEventListener('pointerup',function(){dragging=false;draggingHandle=null;});
cropBoxEl.addEventListener('pointercancel',function(){dragging=false;draggingHandle=null;});
elW.addEventListener('input',function(){
 var w=parseInt(this.value)||100;
 cropBox.w=w*pdfScale;
 updateCropBox();
});
elH.addEventListener('input',function(){
 var h=parseInt(this.value)||100;
 cropBox.h=h*pdfScale;
 updateCropBox();
});
function addFile(f){
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){alert('Please select a PDF file.');return;}
 file=f;pick.style.display='none';work.style.display='block';done.style.display='none';
 f.arrayBuffer().then(function(b){
  fileBuf=b;
  return waitLib('pdfjsLib').then(function(ok){
   if(!ok){return;}
   window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
   return window.pdfjsLib.getDocument({data:b}).promise.then(function(d){
    doc=d;totalPages=d.numPages;curPage=1;renderPage();
   });
  });
 });
}
function renderPage(){
 if(!doc){return;}
 doc.getPage(curPage).then(function(page){
  var vp1=page.getViewport({scale:1});
  pdfScale=Math.min(1.4,560/vp1.width);
  var vp=page.getViewport({scale:pdfScale});
  canvas.width=Math.floor(vp.width);canvas.height=Math.floor(vp.height);
  page.render({canvasContext:ctx,viewport:vp}).promise.then(function(){
   pageLbl.textContent='Page '+curPage+' / '+totalPages;
   if(curPage===1&&elAuto.checked){setTimeout(autoDetect,200);}
   else{updateCropBox();}
  });
 });
}
document.getElementById('cpPrev').onclick=function(){if(curPage>1){curPage--;renderPage();}};
document.getElementById('cpNext').onclick=function(){if(curPage<totalPages){curPage++;renderPage();}};
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};
function pct(p){document.getElementById('cpPct').textContent=Math.round(p)+'%';document.getElementById('cpBarFill').style.width=p+'%';}
document.getElementById('cpGo').onclick=function(){
 if(!file||!fileBuf||!doc){return;}
 work.style.display='none';busy.style.display='block';
 document.getElementById('cpBusyName').textContent=file.name;
 pct(10);
 waitLib('PDFLib').then(function(ok){
  if(!ok){throw new Error('libs');}
  return PDFLib.PDFDocument.load(fileBuf,{ignoreEncryption:true}).then(function(pdf){
   var pages=pdf.getPages();
   var cropX=cropBox.x*pdfScale;
   var cropY=cropBox.y*pdfScale;
   var cropW=cropBox.w*pdfScale;
   var cropH=cropBox.h*pdfScale;
   var targets=elAll.checked?pages:[pages[curPage-1]];
   targets.forEach(function(pg,idx){
    var size=pg.getSize();
    pg.setCropBox({x:cropX,y:size.height-cropY-cropH,width:cropW,height:cropH});
    pct(10+((idx+1)/targets.length)*80);
   });
   return pdf.save().then(function(bytes){
    pct(100);
    setTimeout(function(){
     busy.style.display='none';done.style.display='block';
     document.getElementById('cpDoneInfo').textContent=targets.length+' page(s) cropped • '+fmtB(bytes.length);
     var blob=new Blob([bytes],{type:'application/pdf'});
     var dl=document.getElementById('cpDl');
     dl.href=URL.createObjectURL(blob);
     dl.download='cropped-'+(file.name||'document.pdf');
    },200);
   });
  });
 }).catch(function(){
  busy.style.display='none';work.style.display='block';
  alert('Error cropping PDF. Please try again.');
 });
};
document.getElementById('cpAgain').onclick=function(){
 done.style.display='none';pick.style.display='block';work.style.display='none';
 file=null;fileBuf=null;doc=null;totalPages=0;
};
})();
