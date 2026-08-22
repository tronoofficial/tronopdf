/* TronoPDF - Crop PDF v5 | FIXED: download scope bug (targetCount) */
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
var PRESETS={a4:['A4',210/297],letter:['Letter',8.5/11],r169:['16:9',16/9],r43:['4:3',4/3],sq:['Square',1]};
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
html+='.cp-cropbox{position:absolute;border:2px dashed #7c3aed;background:rgba(124,58,237,.08);cursor:move;touch-action:none}';
html+='.cp-handle{position:absolute;width:14px;height:14px;background:#7c3aed;border:2px solid #fff;border-radius:50%}';
html+='.cp-handle.nw{top:-7px;left:-7px;cursor:nw-resize}';
html+='.cp-handle.ne{top:-7px;right:-7px;cursor:ne-resize}';
html+='.cp-handle.sw{bottom:-7px;left:-7px;cursor:sw-resize}';
html+='.cp-handle.se{bottom:-7px;right:-7px;cursor:se-resize}';
html+='.cp-pagenav{display:flex;gap:10px;align-items:center}';
html+='.cp-pagenav button{border:1px solid #eceaf6;background:#fff;border-radius:8px;padding:8px 14px;font-weight:800;cursor:pointer}';
html+='.cp-pagenav button:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.cp-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.cp-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:6px}';
html+='.cp-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:16px}';
html+='.cp-auto{width:100%;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;font-weight:800;font-size:15px;padding:14px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 10px 24px rgba(22,163,74,.3)}';
html+='.cp-auto:hover{filter:brightness(1.05)}';
html+='.cp-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:14px 0 6px}';
html+='.cp-presetgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}';
html+='.cp-preset{border:2px solid #eceaf6;border-radius:8px;padding:9px 4px;font-size:11px;font-weight:800;text-align:center;cursor:pointer;background:#fff;color:#4b4b5a}';
html+='.cp-preset.active{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}';
html+='.cp-chk{display:flex;gap:8px;align-items:center;margin:10px 0}';
html+='.cp-chk input{width:16px;height:16px;accent-color:#7c3aed}';
html+='.cp-chk label{font-size:13px;font-weight:600;cursor:pointer}';
html+='.cp-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:12px}';
html+='.cp-adv{margin-top:14px;border:1px solid #eceaf6;border-radius:10px;padding:10px 14px;background:#fafbfe}';
html+='.cp-adv summary{font-size:13px;font-weight:800;color:#7c3aed;cursor:pointer}';
html+='.cp-adv[open] summary{margin-bottom:8px}';
html+='.cp-advgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}';
html+='.cp-advgrid label{font-size:11px;font-weight:800;color:#9a9aa5;display:block;margin-bottom:3px}';
html+='.cp-advgrid input{width:100%;padding:9px;border:1px solid #ddd;border-radius:8px;font-size:13px}';
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
html+='<div id="cpPick"><div class="cp-hero"><h1>Crop PDF</h1><p>Remove margins and crop PDF pages to exact size - one click, free and private.</p>';
html+='<div class="cp-zone" id="cpZone"><button class="cp-big" id="cpBtn" type="button">Select PDF file</button><p class="cp-drop-hint">or drop PDF here</p></div></div></div>';
html+='<div class="cp-work" id="cpWork"><div class="cp-main"><div class="cp-prev"><div class="cp-canvaswrap" id="cpCanvasWrap"><canvas id="cpCanvas"></canvas><div class="cp-cropbox" id="cpCropBox"><div class="cp-handle nw"></div><div class="cp-handle ne"></div><div class="cp-handle sw"></div><div class="cp-handle se"></div></div></div>';
html+='<div class="cp-pagenav"><button id="cpPrev" type="button">←</button><span id="cpPageLbl" style="font-weight:800"></span><button id="cpNext" type="button">→</button></div></div>';
html+='<aside class="cp-side"><h2>Crop settings</h2><p class="cp-sub">One click to remove margins - or crop any way you like</p>';
html+='<button class="cp-auto" id="cpAutoBtn" type="button">✨ Auto-detect & remove margins</button>';
html+='<div class="cp-lbl">Or pick a preset size</div><div class="cp-presetgrid" id="cpPresets"></div>';
html+='<div class="cp-chk"><input type="checkbox" id="cpAll" checked/><label for="cpAll">Apply to all pages</label></div>';
html+='<button class="cp-go" id="cpGo" type="button">Apply Crop →</button>';
html+='<details class="cp-adv"><summary>⚙️ Manual fine-tune (advanced)</summary><div class="cp-advgrid">';
html+='<div><label>X (left)</label><input type="number" id="cpX" min="0"/></div>';
html+='<div><label>Y (top)</label><input type="number" id="cpY" min="0"/></div>';
html+='<div><label>Width</label><input type="number" id="cpW" min="10"/></div>';
html+='<div><label>Height</label><input type="number" id="cpH" min="10"/></div>';
html+='</div></details></aside></div></div>';
html+='<div class="cp-busy" id="cpBusy"><h2>Cropping PDF...</h2><p class="fn" id="cpBusyName"></p><div class="cp-bar"><div id="cpBarFill"></div></div><div class="cp-pct" id="cpPct">0%</div></div>';
html+='<div class="cp-done" id="cpDone"><div class="cp-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF cropped successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="cpDoneInfo"></p><a class="cp-dl" id="cpDl" href="#">⬇ Download Cropped PDF</a><button class="cp-again" id="cpAgain" type="button">Crop another PDF</button></div>';
html+='<input type="file" id="cpFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var file=null,doc=null,totalPages=0,curPage=1,targetCount=0;
var pageW=595,pageH=842,scale=1;
var crop={x:0,y:0,w:595,h:842};
var pick=document.getElementById('cpPick'),work=document.getElementById('cpWork'),busy=document.getElementById('cpBusy'),done=document.getElementById('cpDone');
var zone=document.getElementById('cpZone'),btn=document.getElementById('cpBtn'),inp=document.getElementById('cpFile');
var canvas=document.getElementById('cpCanvas'),ctx=canvas.getContext('2d');
var cropEl=document.getElementById('cpCropBox'),pageLbl=document.getElementById('cpPageLbl');
var elX=document.getElementById('cpX'),elY=document.getElementById('cpY'),elW=document.getElementById('cpW'),elH=document.getElementById('cpH');
var elAll=document.getElementById('cpAll');
var presetWrap=document.getElementById('cpPresets');
Object.keys(PRESETS).forEach(function(k){
 var d=document.createElement('div');d.className='cp-preset';d.textContent=PRESETS[k][0];d.setAttribute('data-k',k);
 d.onclick=function(){
  presetWrap.querySelectorAll('.cp-preset').forEach(function(x){x.classList.remove('active');});
  d.classList.add('active');
  applyRatio(PRESETS[k][1]);
 };
 presetWrap.appendChild(d);
});
function applyRatio(r){
 var h=pageH,w=h*r;
 if(w>pageW){w=pageW;h=w/r;}
 crop={x:(pageW-w)/2,y:(pageH-h)/2,w:w,h:h};
 syncUI();
}
function clampCrop(){
 crop.w=Math.max(20,Math.min(crop.w,pageW));
 crop.h=Math.max(20,Math.min(crop.h,pageH));
 crop.x=Math.max(0,Math.min(crop.x,pageW-crop.w));
 crop.y=Math.max(0,Math.min(crop.y,pageH-crop.h));
}
function syncUI(){
 clampCrop();
 cropEl.style.left=(crop.x*scale)+'px';
 cropEl.style.top=(crop.y*scale)+'px';
 cropEl.style.width=(crop.w*scale)+'px';
 cropEl.style.height=(crop.h*scale)+'px';
 elX.value=Math.round(crop.x);elY.value=Math.round(crop.y);
 elW.value=Math.round(crop.w);elH.value=Math.round(crop.h);
}
[elX,elY,elW,elH].forEach(function(i){
 i.addEventListener('input',function(){
  crop.x=parseFloat(elX.value)||0;crop.y=parseFloat(elY.value)||0;
  crop.w=parseFloat(elW.value)||20;crop.h=parseFloat(elH.value)||20;
  syncUI();
 });
});
var dragMode=null,sx=0,sy=0,sb=null;
cropEl.addEventListener('pointerdown',function(e){
 dragMode=e.target.classList.contains('cp-handle')?e.target.classList[1]:'move';
 sx=e.clientX;sy=e.clientY;sb={x:crop.x,y:crop.y,w:crop.w,h:crop.h};
 cropEl.setPointerCapture(e.pointerId);e.preventDefault();
});
cropEl.addEventListener('pointermove',function(e){
 if(!dragMode){return;}
 var dx=(e.clientX-sx)/scale,dy=(e.clientY-sy)/scale;
 if(dragMode==='move'){crop.x=sb.x+dx;crop.y=sb.y+dy;}
 else if(dragMode==='nw'){crop.x=sb.x+dx;crop.y=sb.y+dy;crop.w=sb.w-dx;crop.h=sb.h-dy;}
 else if(dragMode==='ne'){crop.y=sb.y+dy;crop.w=sb.w+dx;crop.h=sb.h-dy;}
 else if(dragMode==='sw'){crop.x=sb.x+dx;crop.w=sb.w-dx;crop.h=sb.h+dy;}
 else if(dragMode==='se'){crop.w=sb.w+dx;crop.h=sb.h+dy;}
 syncUI();
});
cropEl.addEventListener('pointerup',function(){dragMode=null;});
cropEl.addEventListener('pointercancel',function(){dragMode=null;});
function autoDetect(){
 if(!doc){return;}
 doc.getPage(curPage).then(function(page){
  var vp=page.getViewport({scale:1});
  var tc=document.createElement('canvas');tc.width=Math.floor(vp.width);tc.height=Math.floor(vp.height);
  var tx=tc.getContext('2d');
  page.render({canvasContext:tx,viewport:vp}).promise.then(function(){
   var d=tx.getImageData(0,0,tc.width,tc.height).data;
   var W=tc.width,H=tc.height;
   var left=0,right=W-1,top=0,bottom=H-1;
   function darkAt(x,y){var i=(y*W+x)*4;return d[i]<240||d[i+1]<240||d[i+2]<240;}
   outer1:for(var x=0;x<W;x++){for(var y=0;y<H;y++){if(darkAt(x,y)){left=x;break outer1;}}}
   outer2:for(var x2=W-1;x2>=0;x2--){for(var y2=0;y2<H;y2++){if(darkAt(x2,y2)){right=x2;break outer2;}}}
   outer3:for(var y3=0;y3<H;y3++){for(var x3=0;x3<W;x3++){if(darkAt(x3,y3)){top=y3;break outer3;}}}
   outer4:for(var y4=H-1;y4>=0;y4--){for(var x4=0;x4<W;x4++){if(darkAt(x4,y4)){bottom=y4;break outer4;}}}
   var pad=6;
   crop={x:Math.max(0,left-pad),y:Math.max(0,top-pad),w:Math.min(pageW,right-left+pad*2),h:Math.min(pageH,bottom-top+pad*2)};
   syncUI();
  });
 });
}
document.getElementById('cpAutoBtn').onclick=autoDetect;
function addFile(f){
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){alert('Please select a PDF file.');return;}
 file=f;pick.style.display='none';work.style.display='block';done.style.display='none';
 waitLib('pdfjsLib').then(function(ok){
  if(!ok){return;}
  window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
  f.arrayBuffer().then(function(b){
   return window.pdfjsLib.getDocument({data:b}).promise.then(function(d){
    doc=d;totalPages=d.numPages;curPage=1;renderPage(true);
   });
  });
 });
}
function renderPage(auto){
 if(!doc){return;}
 doc.getPage(curPage).then(function(page){
  var vp1=page.getViewport({scale:1});
  pageW=vp1.width;pageH=vp1.height;
  scale=Math.min(1.4,560/pageW);
  var vp=page.getViewport({scale:scale});
  canvas.width=Math.floor(vp.width);canvas.height=Math.floor(vp.height);
  page.render({canvasContext:ctx,viewport:vp}).promise.then(function(){
   pageLbl.textContent='Page '+curPage+' / '+totalPages;
   if(auto){autoDetect();}else{syncUI();}
  });
 });
}
document.getElementById('cpPrev').onclick=function(){if(curPage>1){curPage--;renderPage(false);}};
document.getElementById('cpNext').onclick=function(){if(curPage<totalPages){curPage++;renderPage(false);}};
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};
function pct(p){document.getElementById('cpPct').textContent=Math.round(p)+'%';document.getElementById('cpBarFill').style.width=p+'%';}
document.getElementById('cpGo').onclick=function(){
 if(!file||!doc){return;}
 clampCrop();
 work.style.display='none';busy.style.display='block';
 document.getElementById('cpBusyName').textContent=file.name;
 pct(10);
 waitLib('PDFLib').then(function(){
  return file.arrayBuffer();
 }).then(function(buf){
  return window.PDFLib.PDFDocument.load(buf,{ignoreEncryption:true});
 }).then(function(pdf){
  var pages=pdf.getPages();
  var targets=elAll.checked?pages:[pages[curPage-1]];
  targetCount=targets.length;
  for(var i=0;i<targets.length;i++){
   var pg=targets[i];
   var pw=pg.getWidth(),ph=pg.getHeight();
   var w=Math.min(crop.w,pw),h=Math.min(crop.h,ph);
   var x=Math.max(0,Math.min(crop.x,pw-w));
   var yTop=Math.max(0,Math.min(crop.y,ph-h));
   pg.setCropBox(x,ph-yTop-h,w,h);
   pct(10+((i+1)/targets.length)*80);
  }
  return pdf.save();
 }).then(function(bytes){
  pct(100);
  setTimeout(function(){
   busy.style.display='none';done.style.display='block';
   document.getElementById('cpDoneInfo').textContent=targetCount+' page(s) cropped • '+fmtB(bytes.length);
   var blob=new Blob([bytes],{type:'application/pdf'});
   var dl=document.getElementById('cpDl');
   dl.href=URL.createObjectURL(blob);
   dl.download='cropped-'+(file.name||'document.pdf');
  },200);
 }).catch(function(err){
  busy.style.display='none';work.style.display='block';
  alert('Error cropping PDF: '+((err&&err.message)||err));
 });
};
document.getElementById('cpAgain').onclick=function(){
 done.style.display='none';pick.style.display='block';work.style.display='none';
 file=null;doc=null;totalPages=0;targetCount=0;
};
})();
