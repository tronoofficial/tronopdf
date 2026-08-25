/* TronoPDF - PDF to PowerPoint v1 | pdf.js render + PptxGenJS, browser-only */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
var PPTXGEN_SRC='https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js';
function loadJS(src){return new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=function(){res(true);};s.onerror=function(){rej(new Error('load fail'));};document.head.appendChild(s);});}
var html='';
html+='<style>';
html+='.pt-wrap{max-width:1400px;margin:0 auto}';
html+='.pt-hero{text-align:center;padding:50px 16px 40px}';
html+='.pt-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.pt-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.pt-big{background:linear-gradient(135deg,#d35230,#e06a48);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(211,82,48,.35)}';
html+='.pt-big:hover{transform:translateY(-2px)}';
html+='.pt-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.pt-zone{border:2px dashed transparent;border-radius:18px}';
html+='.pt-zone.on{border-color:#d35230;background:#fdeee9}';
html+='.pt-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden;padding:22px}';
html+='.pt-grid{display:grid;grid-template-columns:340px 1fr;gap:20px}';
html+='.pt-side{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px}';
html+='.pt-side h2{font-size:20px;font-weight:900;margin-bottom:6px}';
html+='.pt-sub{font-size:13px;color:#9a9aa5;margin-bottom:14px}';
html+='.pt-count{background:#fdeee9;border:1px solid #f6c9bc;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:800;color:#b3401f;margin-bottom:12px}';
html+='.pt-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}';
html+='.pt-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;background:#fff}';
html+='.pt-go{width:100%;background:linear-gradient(135deg,#d35230,#e06a48);color:#fff;font-size:17px;font-weight:800;padding:16px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(211,82,48,.35);margin-top:14px}';
html+='.pt-go:active{transform:scale(.98)}';
html+='.pt-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.pt-preview{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px;overflow:auto;max-height:760px}';
html+='.pt-preview h3{font-size:16px;font-weight:900;margin-bottom:12px}';
html+='.pt-pages{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}';
html+='.pt-page{border:2px solid #eceaf6;border-radius:8px;overflow:hidden;background:#fff;aspect-ratio:4/3;position:relative}';
html+='.pt-page img{width:100%;height:100%;object-fit:cover}';
html+='.pt-page .num{position:absolute;top:4px;left:4px;background:rgba(0,0,0,.7);color:#fff;font-size:11px;font-weight:800;padding:2px 8px;border-radius:4px}';
html+='.pt-busy{display:none;text-align:center;padding:60px 20px}';
html+='.pt-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.pt-busy .st{color:#7a7a85;font-size:15px;margin-bottom:26px}';
html+='.pt-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.pt-bar div{height:100%;width:0;background:linear-gradient(90deg,#d35230,#e06a48);transition:width .3s}';
html+='.pt-pct{font-size:36px;font-weight:900}';
html+='.pt-done{display:none;text-align:center;padding:50px 20px}';
html+='.pt-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.pt-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.pt-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='.pt-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);background:#16a34a;color:#fff;font-weight:800;padding:14px 28px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:all .3s;z-index:999;font-size:14px}';
html+='.pt-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}';
html+='.pt-toast.err{background:#dc2626}';
html+='@media(max-width:900px){.pt-grid{grid-template-columns:1fr}}';
html+='</style>';
html+='<div class="pt-wrap">';
html+='<div id="ptPick"><div class="pt-hero"><h1>PDF to PowerPoint</h1><p>Turn PDF pages into PowerPoint slides - free & private.</p>';
html+='<div class="pt-zone" id="ptZone"><button class="pt-big" id="ptBtn" type="button">Select PDF file</button><p class="pt-drop-hint">or drop a PDF here</p></div></div></div>';
html+='<div class="pt-work" id="ptWork"><div class="pt-grid">';
html+='<div class="pt-side"><h2>Convert settings</h2><p class="pt-sub">Runs fully in your browser</p>';
html+='<div class="pt-count" id="ptCount">0 page(s) detected</div>';
html+='<div class="pt-lbl">Slide quality</div><select class="pt-inp" id="ptQuality"><option value="2">High (2x - recommended)</option><option value="1.5">Medium (1.5x)</option><option value="1">Standard (1x)</option></select>';
html+='<button class="pt-go" id="ptGo" type="button" disabled>Convert to PowerPoint →</button></div>';
html+='<div class="pt-preview"><h3>Slide preview</h3><div class="pt-pages" id="ptPages"></div></div>';
html+='</div></div>';
html+='<div class="pt-busy" id="ptBusy"><h2>Converting to PowerPoint...</h2><p class="st" id="ptStatus">Working...</p><div class="pt-bar"><div id="ptBarFill"></div></div><div class="pt-pct" id="ptPct">0%</div></div>';
html+='<div class="pt-done" id="ptDone"><div class="pt-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PowerPoint ready!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="ptDoneInfo"></p><a class="pt-dl" id="ptDl" href="#">⬇ Download .pptx</a><button class="pt-again" id="ptAgain" type="button">Convert another</button></div>';
html+='<div class="pt-toast" id="ptToast"></div>';
html+='<input type="file" id="ptFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var file=null,doc=null,totalPages=0;
var pick=document.getElementById('ptPick'),work=document.getElementById('ptWork'),busy=document.getElementById('ptBusy'),done=document.getElementById('ptDone');
var zone=document.getElementById('ptZone'),btn=document.getElementById('ptBtn'),inp=document.getElementById('ptFile');
var pagesBox=document.getElementById('ptPages'),countEl=document.getElementById('ptCount'),goBtn=document.getElementById('ptGo');
var toastEl=document.getElementById('ptToast');
function toast(m,e){toastEl.textContent=m;toastEl.classList.toggle('err',!!e);toastEl.classList.add('show');clearTimeout(toastEl.__h);toastEl.__h=setTimeout(function(){toastEl.classList.remove('show');},2200);}
function pct(p){document.getElementById('ptPct').textContent=Math.round(p)+'%';document.getElementById('ptBarFill').style.width=p+'%';}
function setStatus(s){document.getElementById('ptStatus').textContent=s;}
btn.onclick=function(){inp.click();};
function renderThumb(n){
 return doc.getPage(n).then(function(page){
  var v1=page.getViewport({scale:1});
  var s=Math.min(0.4,200/v1.width);
  var vp=page.getViewport({scale:s});
  var cv=document.createElement('canvas');cv.width=Math.floor(vp.width);cv.height=Math.floor(vp.height);
  var cx=cv.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,cv.width,cv.height);
  return page.render({canvasContext:cx,viewport:vp}).promise.then(function(){return cv.toDataURL('image/jpeg',0.8);});
 });
}
function loadFile(f){
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){toast('Please select a PDF file',true);return;}
 file=f;
 loadJS(PDFJS_SRC).then(function(){
  window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
  return f.arrayBuffer();
 }).then(function(b){return window.pdfjsLib.getDocument({data:b}).promise;}).then(function(d){
  doc=d;totalPages=d.numPages;
  pick.style.display='none';done.style.display='none';work.style.display='block';
  countEl.textContent=totalPages+' page(s) detected';
  goBtn.disabled=false;
  pagesBox.innerHTML='';
  var limit=Math.min(totalPages,24);
  for(var i=1;i<=limit;i++){
   (function(n){
    var d=document.createElement('div');d.className='pt-page';d.innerHTML='<span class="num">'+n+'</span>';
    pagesBox.appendChild(d);
    renderThumb(n).then(function(data){var im=document.createElement('img');im.src=data;d.insertBefore(im,d.firstChild);});
   })(i);
  }
  if(totalPages>24){var p=document.createElement('p');p.style.cssText='font-size:12px;color:#9a9aa5;margin-top:8px';p.textContent='Showing first 24 of '+totalPages+' pages.';pagesBox.parentNode.appendChild(p);}
  toast('✓ PDF loaded ('+totalPages+' pages)');
 }).catch(function(){pick.style.display='block';toast('Could not read PDF',true);});
}
inp.onchange=function(){if(inp.files[0]){loadFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){loadFile(e.dataTransfer.files[0]);}};
goBtn.onclick=async function(){
 if(!file||!doc){toast('Select a PDF first',true);return;}
 work.style.display='none';done.style.display='none';busy.style.display='block';
 pct(5);setStatus('Loading engines...');
 try{
  await Promise.all([loadJS(PDFJS_SRC),loadJS(PPTXGEN_SRC)]);
  window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
  var scale=parseFloat(document.getElementById('ptQuality').value)||2;
  var pptx=new window.PptxGenJS();
  // set layout from first page aspect
  var p1=await doc.getPage(1);
  var v1=p1.getViewport({scale:1});
  var W=10,H=10*v1.height/v1.width;
  pptx.defineLayout({name:'CUSTOM',width:W,height:H});
  pptx.layout='CUSTOM';
  for(var i=1;i<=totalPages;i++){
   setStatus('Rendering slide '+i+' of '+totalPages+'...');
   var page=await doc.getPage(i);
   var vp=page.getViewport({scale:scale});
   var cv=document.createElement('canvas');cv.width=Math.floor(vp.width);cv.height=Math.floor(vp.height);
   var cx=cv.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,cv.width,cv.height);
   await page.render({canvasContext:cx,viewport:vp}).promise;
   var data=cv.toDataURL('image/jpeg',0.92);
   var slide=pptx.addSlide();
   slide.background={color:'FFFFFF'};
   slide.addImage({data:data,x:0,y:0,w:W,h:H});
   pct(5+(i/totalPages)*85);
  }
  setStatus('Building PPTX...');
  var blob=await pptx.write({outputType:'blob'});
  pct(100);setStatus('Done!');
  setTimeout(function(){
   busy.style.display='none';done.style.display='block';
   document.getElementById('ptDoneInfo').textContent=totalPages+' slide(s) • '+(blob.size/1024).toFixed(1)+' KB';
   var dl=document.getElementById('ptDl');
   dl.href=URL.createObjectURL(blob);
   dl.download=file.name.replace(/\.pdf$/i,'')+'.pptx';
   toast('✓ PowerPoint ready! ('+totalPages+' slides)');
  },300);
 }catch(err){
  busy.style.display='none';work.style.display='block';
  toast('Conversion failed: '+((err&&err.message)||err),true);
 }
};
document.getElementById('ptAgain').onclick=function(){
 done.style.display='none';pick.style.display='block';
 file=null;doc=null;
};
})();
