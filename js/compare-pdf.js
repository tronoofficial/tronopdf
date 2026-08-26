/* TronoPDF - Compare PDF v2 | Web Worker + Cancel + Progress */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

/* Web Worker for pixel diff computation */
var workerCode = `
self.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'computeDiff') {
    var baseData = data.baseData;
    var otherData = data.otherData;
    var width = data.width;
    var height = data.height;
    
    self.postMessage({type: 'progress', percent: 10, msg: 'Computing differences...'});
    
    var out = new Uint8ClampedArray(baseData.length);
    var diffCount = 0;
    var total = width * height;
    var chunkSize = Math.floor(total / 10);
    
    for (var i = 0; i < baseData.length; i += 4) {
      var dr = Math.abs(baseData[i] - otherData[i]);
      var dg = Math.abs(baseData[i + 1] - otherData[i + 1]);
      var db = Math.abs(baseData[i + 2] - otherData[i + 2]);
      
      if (dr > 40 || dg > 40 || db > 40) {
        out[i] = 220;
        out[i + 1] = 38;
        out[i + 2] = 38;
        out[i + 3] = 255;
        diffCount++;
      } else {
        out[i] = baseData[i];
        out[i + 1] = baseData[i + 1];
        out[i + 2] = baseData[i + 2];
        out[i + 3] = 60;
      }
      
      /* Progress update every 10% */
      var pixelIdx = i / 4;
      if (pixelIdx % chunkSize === 0 && pixelIdx > 0) {
        var percent = 10 + (pixelIdx / total) * 80;
        self.postMessage({
          type: 'progress',
          percent: percent,
          msg: 'Processing pixels... ' + Math.round((pixelIdx / total) * 100) + '%'
        });
      }
    }
    
    var pctDiff = (diffCount / total) * 100;
    
    self.postMessage({
      type: 'complete',
      diffData: out,
      width: width,
      height: height,
      pctDiff: pctDiff
    });
  }
};
`;

/* Create Worker */
var blob = new Blob([workerCode], {type: 'application/javascript'});
var workerUrl = URL.createObjectURL(blob);
var worker = new Worker(workerUrl);

function loadJS(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(false);};s.onerror=function(){cb(true);};document.head.appendChild(s);}
loadJS(PDFJS_SRC,function(e){if(!e&&window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;}});

function waitLib(name){return new Promise(function(res){var t=0;(function w(){if(window[name]){res(true);return;}if(t>40){res(false);return;}t++;setTimeout(w,500);})();});}

var html='';
html+='<style>';
html+='.cm-wrap{max-width:1500px;margin:0 auto}';
html+='.cm-hero{text-align:center;padding:50px 16px 40px}';
html+='.cm-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.cm-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.cm-zones{display:flex;gap:20px;justify-content:center;flex-wrap:wrap}';
html+='.cm-zone{border:2px dashed #c9cddd;border-radius:14px;padding:30px 40px;cursor:pointer;background:#fff;transition:.2s;text-align:center}';
html+='.cm-zone:hover{border-color:#7c3aed;background:#f3f0ff}';
html+='.cm-zone.loaded{border-color:#16a34a;background:#eafbef}';
html+='.cm-zone .ico{font-size:36px;display:block;margin-bottom:8px}';
html+='.cm-zone .t{font-weight:800;font-size:15px;color:#4b4b5a}';
html+='.cm-zone .s{font-size:12px;color:#9a9aa5;margin-top:4px}';
html+='.cm-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden;padding:20px}';
html+='.cm-top{display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;margin-bottom:16px}';
html+='.cm-top button{border:1px solid #eceaf6;background:#fff;border-radius:8px;padding:8px 14px;font-weight:800;cursor:pointer}';
html+='.cm-top button:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.cm-diff{background:#ede9fe;border-radius:10px;padding:8px 16px;font-size:13px;font-weight:800;color:#5b21b6}';
html+='.cm-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}';
html+='.cm-col{background:#fff;border:1px solid #eceaf6;border-radius:10px;padding:10px;text-align:center}';
html+='.cm-col h4{font-size:12px;font-weight:800;color:#9a9aa5;margin:0 0 8px}';
html+='.cm-col canvas{max-width:100%;border-radius:6px;background:#fafbfe}';
html+='.cm-busy{display:none;text-align:center;padding:60px 20px}';
html+='.cm-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.cm-busy .st{color:#7a7a85;font-size:15px;margin-bottom:10px;min-height:20px}';
html+='.cm-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.cm-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .3s}';
html+='.cm-pct{font-size:36px;font-weight:900}';
html+='.cm-cancel{margin-top:16px;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;border:none;cursor:pointer}';
html+='.cm-cancel:hover{background:#e6e8f5}';
html+='@media(max-width:900px){.cm-grid{grid-template-columns:1fr}}';
html+='</style>';
html+='<div class="cm-wrap">';
html+='<div id="cmPick"><div class="cm-hero"><h1>Compare PDF</h1><p>Spot every difference between two PDFs - side-by-side with automatic highlighting.</p>';
html+='<div class="cm-zones">';
html+='<div class="cm-zone" id="cmZoneA"><span class="ico">📄</span><span class="t">First PDF</span><span class="s" id="cmNameA">Click to upload</span></div>';
html+='<div class="cm-zone" id="cmZoneB"><span class="ico">📑</span><span class="t">Second PDF</span><span class="s" id="cmNameB">Click to upload</span></div>';
html+='</div></div></div>';
html+='<div class="cm-work" id="cmWork">';
html+='<div class="cm-top"><button id="cmPrev" type="button">←</button><span id="cmPageLbl" style="font-weight:800"></span><button id="cmNext" type="button">→</button><span class="cm-diff" id="cmDiff">—</span><button id="cmRestart" type="button">↺ Start over</button></div>';
html+='<div class="cm-grid"><div class="cm-col"><h4>FIRST PDF</h4><canvas id="cmA"></canvas></div><div class="cm-col"><h4>SECOND PDF</h4><canvas id="cmB"></canvas></div><div class="cm-col"><h4>DIFFERENCES (red)</h4><canvas id="cmD"></canvas></div></div>';
html+='</div>';
html+='<div class="cm-busy" id="cmBusy"><h2>Comparing PDFs...</h2><p class="st" id="cmStatus">Working...</p><div class="cm-bar"><div id="cmBarFill"></div></div><div class="cm-pct" id="cmPct">0%</div><button class="cm-cancel" id="cmCancel" type="button">✕ Cancel</button></div>';
html+='<input type="file" id="cmFileA" accept="application/pdf,.pdf" style="display:none"/>';
html+='<input type="file" id="cmFileB" accept="application/pdf,.pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;

var docA=null,docB=null,curPage=1,maxPages=0;
var cancelRequested=false;

var pick=document.getElementById('cmPick'),work=document.getElementById('cmWork'),busy=document.getElementById('cmBusy');
var cA=document.getElementById('cmA'),cB=document.getElementById('cmB'),cD=document.getElementById('cmD');
var pageLbl=document.getElementById('cmPageLbl'),diffLbl=document.getElementById('cmDiff');
var zoneA=document.getElementById('cmZoneA'),zoneB=document.getElementById('cmZoneB');
var fileInA=document.getElementById('cmFileA'),fileInB=document.getElementById('cmFileB');
var cancelBtn=document.getElementById('cmCancel');
var statusEl=document.getElementById('cmStatus');

/* Worker message handler */
worker.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'progress') {
    document.getElementById('cmPct').textContent = Math.round(data.percent) + '%';
    document.getElementById('cmBarFill').style.width = data.percent + '%';
    statusEl.textContent = data.msg || 'Processing...';
  } else if (data.type === 'complete') {
    document.getElementById('cmPct').textContent = '100%';
    document.getElementById('cmBarFill').style.width = '100%';
    statusEl.textContent = 'Complete!';
    
    /* Draw diff result */
    cD.width = data.width;
    cD.height = data.height;
    var dctx = cD.getContext('2d');
    var imgData = new ImageData(data.diffData, data.width, data.height);
    dctx.putImageData(imgData, 0, 0);
    
    var pctDiff = data.pctDiff;
    diffLbl.textContent = pctDiff < 0.01 ? '✓ Identical page' : pctDiff.toFixed(2) + '% different';
    
    setTimeout(function() {
      busy.style.display = 'none';
      work.style.display = 'block';
    }, 300);
  }
};

function loadDoc(f,cb){
  f.arrayBuffer().then(function(b){
    window.pdfjsLib.getDocument({data:b}).promise.then(cb);
  });
}

function tryStart(){
  if(docA&&docB){
    maxPages=Math.min(docA.numPages,docB.numPages);
    curPage=1;
    pick.style.display='none';
    work.style.display='block';
    render();
  }
}

zoneA.onclick=function(){fileInA.click();};
zoneB.onclick=function(){fileInB.click();};

fileInA.onchange=function(){
  var f=this.files[0];
  if(!f){return;}
  waitLib('pdfjsLib').then(function(){
    window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
    loadDoc(f,function(d){
      docA=d;
      zoneA.classList.add('loaded');
      document.getElementById('cmNameA').textContent=f.name;
      tryStart();
    });
  });
  this.value='';
};

fileInB.onchange=function(){
  var f=this.files[0];
  if(!f){return;}
  waitLib('pdfjsLib').then(function(){
    window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
    loadDoc(f,function(d){
      docB=d;
      zoneB.classList.add('loaded');
      document.getElementById('cmNameB').textContent=f.name;
      tryStart();
    });
  });
  this.value='';
};

document.getElementById('cmPrev').onclick=function(){if(curPage>1){curPage--;render();}};
document.getElementById('cmNext').onclick=function(){if(curPage<maxPages){curPage++;render();}};

document.getElementById('cmRestart').onclick=function(){
  docA=null;
  docB=null;
  zoneA.classList.remove('loaded');
  zoneB.classList.remove('loaded');
  document.getElementById('cmNameA').textContent='Click to upload';
  document.getElementById('cmNameB').textContent='Click to upload';
  work.style.display='none';
  pick.style.display='block';
};

function renderPageTo(doc,canvas,cb){
  doc.getPage(curPage).then(function(page){
    var vp1=page.getViewport({scale:1});
    var scale=Math.min(1.2,420/vp1.width);
    var vp=page.getViewport({scale:scale});
    canvas.width=Math.floor(vp.width);
    canvas.height=Math.floor(vp.height);
    page.render({canvasContext:canvas.getContext('2d'),viewport:vp}).promise.then(function(){
      cb(canvas);
    });
  });
}

function computeDiff(){
  work.style.display='none';
  busy.style.display='block';
  
  document.getElementById('cmPct').textContent='0%';
  document.getElementById('cmBarFill').style.width='0%';
  statusEl.textContent='Rendering PDFs...';
  cancelRequested=false;
  
  /* Get image data from both canvases */
  var ctxA = cA.getContext('2d');
  var ctxB = cB.getContext('2d');
  var baseData = ctxA.getImageData(0, 0, cA.width, cA.height).data;
  var otherData = ctxB.getImageData(0, 0, cB.width, cB.height).data;
  
  /* Send to worker */
  worker.postMessage({
    type: 'computeDiff',
    baseData: baseData,
    otherData: otherData,
    width: cA.width,
    height: cA.height
  });
}

function render(){
  pageLbl.textContent='Page '+curPage+' / '+maxPages;
  
  renderPageTo(docA,cA,function(){
    renderPageTo(docB,cB,function(){
      computeDiff();
    });
  });
}

cancelBtn.onclick=function(){
  cancelRequested=true;
  statusEl.textContent='Cancelling...';
  
  /* Terminate and recreate worker */
  worker.terminate();
  var blob = new Blob([workerCode], {type: 'application/javascript'});
  var workerUrl = URL.createObjectURL(blob);
  worker = new Worker(workerUrl);
  
  /* Reattach message handler */
  worker.onmessage = function(e) {
    var data = e.data;
    if (data.type === 'progress') {
      document.getElementById('cmPct').textContent = Math.round(data.percent) + '%';
      document.getElementById('cmBarFill').style.width = data.percent + '%';
      statusEl.textContent = data.msg || 'Processing...';
    } else if (data.type === 'complete') {
      document.getElementById('cmPct').textContent = '100%';
      document.getElementById('cmBarFill').style.width = '100%';
      statusEl.textContent = 'Complete!';
      cD.width = data.width;
      cD.height = data.height;
      var dctx = cD.getContext('2d');
      var imgData = new ImageData(data.diffData, data.width, data.height);
      dctx.putImageData(imgData, 0, 0);
      var pctDiff = data.pctDiff;
      diffLbl.textContent = pctDiff < 0.01 ? '✓ Identical page' : pctDiff.toFixed(2) + '% different';
      setTimeout(function() {
        busy.style.display = 'none';
        work.style.display = 'block';
      }, 300);
    }
  };
  
  busy.style.display='none';
  work.style.display='block';
};

})();
