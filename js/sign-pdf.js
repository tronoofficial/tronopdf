/* TronoPDF - Sign PDF v3 | Web Worker + Lazy Load + Cancel */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

/* Lazy load with caching */
var loadedLibs={};
function loadJS(src,cb){
  if(loadedLibs[src]){cb(false);return;}
  var s=document.createElement('script');
  s.src=src;
  s.onload=function(){loadedLibs[src]=true;cb(false);};
  s.onerror=function(){cb(true);};
  document.head.appendChild(s);
}

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

/* Web Worker for PDF signing */
var workerCode = `
importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');

self.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'sign') {
    var buffer = data.buffer;
    var sigData = data.sigData;
    var coords = data.coords;
    var applyAll = data.applyAll;
    var curPage = data.curPage;
    var pdfScale = data.pdfScale;
    
    self.postMessage({type: 'progress', percent: 10, msg: 'Loading PDF...'});
    
    PDFLib.PDFDocument.load(buffer, {ignoreEncryption: true}).then(function(pdf) {
      self.postMessage({type: 'progress', percent: 25, msg: 'Embedding signature...'});
      
      return pdf.embedPng(sigData).then(function(sigImg) {
        var pages = pdf.getPages();
        var targets = applyAll ? pages : [pages[curPage - 1]];
        
        var wPdf = coords.wCss / pdfScale;
        var hPdf = coords.hCss / pdfScale;
        var xPdf = coords.leftCss / pdfScale;
        var yTop = coords.topCss / pdfScale;
        
        self.postMessage({type: 'progress', percent: 40, msg: 'Applying signature...'});
        
        for (var i = 0; i < targets.length; i++) {
          var pg = targets[i];
          var size = pg.getSize();
          pg.drawImage(sigImg, {
            x: xPdf,
            y: size.height - yTop - hPdf,
            width: wPdf,
            height: hPdf
          });
          
          var percent = 40 + ((i + 1) / targets.length) * 50;
          self.postMessage({
            type: 'progress',
            percent: percent,
            msg: 'Signing page ' + (i + 1) + ' of ' + targets.length
          });
        }
        
        self.postMessage({type: 'progress', percent: 95, msg: 'Saving PDF...'});
        return pdf.save();
      });
    }).then(function(bytes) {
      self.postMessage({type: 'complete', bytes: bytes});
    }).catch(function(err) {
      self.postMessage({type: 'error', msg: 'Signing failed: ' + err.message});
    });
  }
};
`;

/* Create Worker */
var blob = new Blob([workerCode], {type: 'application/javascript'});
var workerUrl = URL.createObjectURL(blob);
var worker = new Worker(workerUrl);

function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}

var html='';
html+='<style>';
html+='.sg-wrap{max-width:1400px;margin:0 auto}';
html+='.sg-hero{text-align:center;padding:50px 16px 40px}';
html+='.sg-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.sg-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.sg-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.sg-big:hover{transform:translateY(-2px)}';
html+='.sg-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.sg-zone{border:2px dashed transparent;border-radius:18px}';
html+='.sg-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.sg-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.sg-main{display:flex;min-height:640px}';
html+='.sg-prev{flex:1;padding:30px;display:flex;flex-direction:column;align-items:center;gap:14px;overflow:auto}';
html+='.sg-pagebox{position:relative;border-radius:8px;overflow:hidden;box-shadow:0 10px 40px rgba(30,20,60,.18);background:#fff}';
html+='.sg-pagebox canvas{display:block}';
html+='.sg-sig{position:absolute;cursor:move;touch-action:none;border:1px dashed rgba(124,58,237,.6);background:rgba(124,58,237,.05)}';
html+='.sg-sig img{width:100%;height:100%;pointer-events:none}';
html+='.sg-pagenav{display:flex;gap:10px;align-items:center}';
html+='.sg-pagenav button{border:1px solid #eceaf6;background:#fff;border-radius:8px;padding:8px 14px;font-weight:800;cursor:pointer}';
html+='.sg-pagenav button:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.sg-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.sg-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:6px}';
html+='.sg-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:16px}';
html+='.sg-tabs{display:flex;gap:8px;margin-bottom:14px}';
html+='.sg-tab{flex:1;border:2px solid #eceaf6;border-radius:10px;background:#fff;padding:11px;font-size:13px;font-weight:800;text-align:center;cursor:pointer}';
html+='.sg-tab.active{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}';
html+='.sg-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:10px 0 6px}';
html+='.sg-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;font-family:inherit;background:#fff}';
html+='.sg-draw{width:100%;height:140px;border:2px dashed #c9cddd;border-radius:10px;background:#fff;cursor:crosshair;touch-action:none}';
html+='.sg-row{display:flex;gap:8px;align-items:center;margin-top:8px}';
html+='.sg-row button{border:1px solid #eceaf6;background:#f7f6fc;border-radius:8px;padding:8px 12px;font-size:12px;font-weight:800;cursor:pointer}';
html+='.sg-row button:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.sg-row input[type=range]{flex:1;accent-color:#7c3aed}';
html+='.sg-chk{display:flex;gap:8px;align-items:center;margin:8px 0}';
html+='.sg-chk input{width:16px;height:16px;accent-color:#7c3aed}';
html+='.sg-chk label{font-size:13px;font-weight:600;cursor:pointer}';
html+='.sg-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:14px}';
html+='.sg-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.sg-busy{display:none;padding:60px 20px;text-align:center}';
html+='.sg-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.sg-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:10px}';
html+='.sg-busy .st{color:#7c3aed;font-size:13px;font-weight:700;margin-bottom:16px;min-height:18px}';
html+='.sg-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.sg-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .3s}';
html+='.sg-pct{font-size:36px;font-weight:900}';
html+='.sg-cancel{margin-top:16px;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;border:none;cursor:pointer}';
html+='.sg-cancel:hover{background:#e6e8f5}';
html+='.sg-done{display:none;text-align:center;padding:50px 20px}';
html+='.sg-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.sg-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.sg-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='@media(max-width:900px){.sg-main{flex-direction:column}.sg-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="sg-wrap">';
html+='<div id="sgPick"><div class="sg-hero"><h1>Sign PDF</h1><p>Draw, type or upload your signature and place it anywhere on your PDF.</p>';
html+='<div class="sg-zone" id="sgZone"><button class="sg-big" id="sgBtn" type="button">Select PDF file</button><p class="sg-drop-hint">or drop PDF here</p></div></div></div>';
html+='<div class="sg-work" id="sgWork"><div class="sg-main"><div class="sg-prev"><div class="sg-pagebox" id="sgPageBox"><canvas id="sgCanvas"></canvas><div class="sg-sig" id="sgSig" style="display:none"><img id="sgSigImg" alt=""/></div></div>';
html+='<div class="sg-pagenav"><button id="sgPrev" type="button">←</button><span id="sgPageLbl" style="font-weight:800"></span><button id="sgNext" type="button">→</button></div></div>';
html+='<aside class="sg-side"><h2>Create signature</h2><p class="sg-sub">Choose a method, then drag it onto the page</p>';
html+='<div class="sg-tabs"><div class="sg-tab active" id="sgTabDraw">✍️ Draw</div><div class="sg-tab" id="sgTabType">⌨️ Type</div><div class="sg-tab" id="sgTabUp">🖼 Upload</div></div>';
html+='<div id="sgDrawSec"><canvas class="sg-draw" id="sgDraw"></canvas><div class="sg-row"><button id="sgClear" type="button">Clear</button><span style="font-size:12px;color:#9a9aa5">Draw with mouse or finger</span></div></div>';
html+='<div id="sgTypeSec" style="display:none"><input class="sg-inp" id="sgType" placeholder="Type your name"/><div class="sg-row"><select class="sg-inp" id="sgFont"><option value="cursive">Cursive</option><option value="italic">Italic</option><option value="bold">Bold</option></select><input type="color" id="sgColor" value="#1e293b"/></div></div>';
html+='<div id="sgUpSec" style="display:none"><button class="sg-big" id="sgUpBtn" style="font-size:14px;padding:12px 24px" type="button">+ Upload signature image</button></div>';
html+='<div class="sg-lbl">Signature size</div><div class="sg-row"><input type="range" id="sgSize" min="60" max="320" value="160"/></div>';
html+='<div class="sg-chk"><input type="checkbox" id="sgAll"/><label for="sgAll">Apply to all pages</label></div>';
html+='<button class="sg-go" id="sgGo" type="button">Sign PDF →</button></aside></div></div>';
html+='<div class="sg-busy" id="sgBusy"><h2>Signing PDF...</h2><p class="fn" id="sgBusyName"></p><p class="st" id="sgStatus">Preparing...</p><div class="sg-bar"><div id="sgBarFill"></div></div><div class="sg-pct" id="sgPct">0%</div><button class="sg-cancel" id="sgCancel" type="button">✕ Cancel</button></div>';
html+='<div class="sg-done" id="sgDone"><div class="sg-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF signed successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="sgDoneInfo"></p><a class="sg-dl" id="sgDl" href="#">⬇ Download Signed PDF</a><button class="sg-again" id="sgAgain" type="button">Sign another PDF</button></div>';
html+='<input type="file" id="sgFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='<input type="file" id="sgUpFile" accept="image/*" style="display:none"/>';
html+='</div>';
root.innerHTML=html;

var file=null;var doc=null;var totalPages=0;var curPage=1;var pdfScale=1;
var sigData=null;
var cancelRequested=false;

var pick=document.getElementById('sgPick'),work=document.getElementById('sgWork'),busy=document.getElementById('sgBusy'),done=document.getElementById('sgDone');
var zone=document.getElementById('sgZone'),btn=document.getElementById('sgBtn'),inp=document.getElementById('sgFile');
var canvas=document.getElementById('sgCanvas'),ctx=canvas.getContext('2d');
var sigEl=document.getElementById('sgSig'),sigImg=document.getElementById('sgSigImg');
var pageLbl=document.getElementById('sgPageLbl');
var elSize=document.getElementById('sgSize');
var drawC=document.getElementById('sgDraw'),dctx=drawC.getContext('2d');
var goBtn=document.getElementById('sgGo');
var cancelBtn=document.getElementById('sgCancel');
var statusEl=document.getElementById('sgStatus');

drawC.width=360;drawC.height=140;

/* Worker message handler */
worker.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'progress') {
    document.getElementById('sgPct').textContent = Math.round(data.percent) + '%';
    document.getElementById('sgBarFill').style.width = data.percent + '%';
    statusEl.textContent = data.msg || 'Processing...';
  } else if (data.type === 'complete') {
    document.getElementById('sgPct').textContent = '100%';
    document.getElementById('sgBarFill').style.width = '100%';
    statusEl.textContent = 'Complete!';
    
    setTimeout(function() {
      busy.style.display = 'none';
      done.style.display = 'block';
      document.getElementById('sgDoneInfo').textContent = fmtB(data.bytes.length);
      
      var blob = new Blob([data.bytes], {type: 'application/pdf'});
      var dl = document.getElementById('sgDl');
      dl.href = URL.createObjectURL(blob);
      dl.download = 'signed-' + (file ? file.name : 'document.pdf');
      goBtn.disabled = false;
    }, 300);
  } else if (data.type === 'error') {
    busy.style.display = 'none';
    work.style.display = 'block';
    goBtn.disabled = false;
    alert(data.msg || 'Error signing PDF. Please try again.');
  }
};

function setTab(t){
  document.getElementById('sgTabDraw').classList.toggle('active',t==='draw');
  document.getElementById('sgTabType').classList.toggle('active',t==='type');
  document.getElementById('sgTabUp').classList.toggle('active',t==='up');
  document.getElementById('sgDrawSec').style.display=t==='draw'?'block':'none';
  document.getElementById('sgTypeSec').style.display=t==='type'?'block':'none';
  document.getElementById('sgUpSec').style.display=t==='up'?'block':'none';
}

document.getElementById('sgTabDraw').onclick=function(){setTab('draw');useDraw();};
document.getElementById('sgTabType').onclick=function(){setTab('type');useType();};
document.getElementById('sgTabUp').onclick=function(){setTab('up');};
document.getElementById('sgUpBtn').onclick=function(){document.getElementById('sgUpFile').click();};

document.getElementById('sgUpFile').onchange=function(){
  var f=this.files[0];if(!f){return;}
  var rd=new FileReader();
  rd.onload=function(){sigData=rd.result;showSig();};
  rd.readAsDataURL(f);
  this.value='';
};

var dOn=false;
dctx.lineWidth=2.5;dctx.lineCap='round';dctx.lineJoin='round';dctx.strokeStyle='#1e293b';

drawC.addEventListener('pointerdown',function(e){
  dOn=true;dctx.beginPath();
  var r=drawC.getBoundingClientRect();
  dctx.moveTo(e.clientX-r.left,e.clientY-r.top);
  drawC.setPointerCapture(e.pointerId);
});

drawC.addEventListener('pointermove',function(e){
  if(!dOn){return;}
  var r=drawC.getBoundingClientRect();
  dctx.lineTo(e.clientX-r.left,e.clientY-r.top);
  dctx.stroke();
});

drawC.addEventListener('pointerup',function(){dOn=false;useDraw();});

document.getElementById('sgClear').onclick=function(){
  dctx.clearRect(0,0,drawC.width,drawC.height);
  sigData=null;sigEl.style.display='none';
};

function isCanvasBlank(c){
  var d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
  for(var i=3;i<d.length;i+=4){if(d[i]!==0){return false;}}
  return true;
}

function useDraw(){
  sigData=isCanvasBlank(drawC)?null:drawC.toDataURL('image/png');
  if(sigData){showSig();}else{sigEl.style.display='none';}
}

function useType(){
  var txt=document.getElementById('sgType').value.trim();
  var col=document.getElementById('sgColor').value;
  var font=document.getElementById('sgFont').value;
  if(!txt){sigData=null;sigEl.style.display='none';return;}
  var c=document.createElement('canvas');c.width=600;c.height=160;
  var x=c.getContext('2d');
  x.fillStyle=col;
  x.font=font==='cursive'?'italic 700 70px "Brush Script MT","Segoe Script",cursive':(font==='italic'?'italic 700 70px Georgia,serif':'900 70px Inter,sans-serif');
  x.textBaseline='middle';
  x.fillText(txt,20,80);
  sigData=c.toDataURL('image/png');
  showSig();
}

document.getElementById('sgType').oninput=useType;
document.getElementById('sgFont').onchange=useType;
document.getElementById('sgColor').oninput=useType;

function showSig(){
  if(!sigData){sigEl.style.display='none';return;}
  sigImg.src=sigData;
  sigEl.style.display='block';
  var w=parseInt(elSize.value);
  sigEl.style.width=w+'px';
  sigEl.style.height=Math.round(w*0.4)+'px';
  if(!sigEl.style.left){sigEl.style.left='40px';sigEl.style.top='40px';}
}

elSize.oninput=showSig;

var sOn=false,sx=0,sy=0;
sigEl.addEventListener('pointerdown',function(e){
  sOn=true;sx=e.clientX;sy=e.clientY;
  sigEl.setPointerCapture(e.pointerId);e.preventDefault();
});

sigEl.addEventListener('pointermove',function(e){
  if(!sOn){return;}
  sigEl.style.left=(sigEl.offsetLeft+(e.clientX-sx))+'px';
  sigEl.style.top=(sigEl.offsetTop+(e.clientY-sy))+'px';
  sx=e.clientX;sy=e.clientY;
});

sigEl.addEventListener('pointerup',function(){sOn=false;});

function addFile(f){
  if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){
    alert('Please select a PDF file.');
    return;
  }
  file=f;pick.style.display='none';work.style.display='block';done.style.display='none';
  
  /* Lazy load pdf.js only when file is selected */
  loadJS(PDFJS_SRC,function(err){
    if(err||!window.pdfjsLib){return;}
    window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
    f.arrayBuffer().then(function(b){
      return window.pdfjsLib.getDocument({data:b}).promise.then(function(d){
        doc=d;totalPages=d.numPages;curPage=1;renderPage();
      });
    });
  });
}

function renderPage(){
  doc.getPage(curPage).then(function(page){
    var vp1=page.getViewport({scale:1});
    pdfScale=Math.min(1.6,520/vp1.width);
    var vp=page.getViewport({scale:pdfScale});
    canvas.width=Math.floor(vp.width);canvas.height=Math.floor(vp.height);
    page.render({canvasContext:ctx,viewport:vp}).promise.then(function(){
      pageLbl.textContent='Page '+curPage+' / '+totalPages;
    });
  });
}

document.getElementById('sgPrev').onclick=function(){if(curPage>1){curPage--;renderPage();}};
document.getElementById('sgNext').onclick=function(){if(curPage<totalPages){curPage++;renderPage();}};

btn.onclick=function(){inp.click();};

inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};

zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){
  e.preventDefault();zone.classList.remove('on');
  if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}
};

goBtn.onclick=function(){
  if(!file){return;}
  if(!sigData){alert('Please create a signature first (draw, type or upload).');return;}
  
  work.style.display='none';busy.style.display='block';
  document.getElementById('sgBusyName').textContent=file.name;
  document.getElementById('sgPct').textContent='0%';
  document.getElementById('sgBarFill').style.width='0%';
  statusEl.textContent='Reading file...';
  cancelRequested=false;
  goBtn.disabled=true;
  
  /* Collect signature coordinates */
  var leftCss=parseFloat(sigEl.style.left)||40;
  var topCss=parseFloat(sigEl.style.top)||40;
  var wCss=sigEl.offsetWidth||160;
  var hCss=sigEl.offsetHeight||64;
  var applyAll=document.getElementById('sgAll').checked;
  
  /* Read file and send to worker */
  file.arrayBuffer().then(function(buf){
    if(cancelRequested){
      busy.style.display='none';
      work.style.display='block';
      goBtn.disabled=false;
      return;
    }
    
    worker.postMessage({
      type: 'sign',
      buffer: buf,
      sigData: sigData,
      coords: {leftCss: leftCss, topCss: topCss, wCss: wCss, hCss: hCss},
      applyAll: applyAll,
      curPage: curPage,
      pdfScale: pdfScale
    }, [buf]); /* Transfer ArrayBuffer for zero-copy */
  }).catch(function(err){
    busy.style.display='none';
    work.style.display='block';
    goBtn.disabled=false;
    alert('Error reading file: '+err.message);
  });
};

cancelBtn.onclick=function(){
  cancelRequested=true;
  statusEl.textContent='Cancelling...';
  busy.style.display='none';
  work.style.display='block';
  goBtn.disabled=false;
};

document.getElementById('sgAgain').onclick=function(){
  done.style.display='none';pick.style.display='block';work.style.display='none';
  file=null;doc=null;totalPages=0;sigData=null;sigEl.style.display='none';
  dctx.clearRect(0,0,drawC.width,drawC.height);
};

})();
