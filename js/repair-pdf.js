/* TronoPDF - Repair PDF v2 | Web Worker + Cancel + Progress */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

/* Web Worker for PDF repair */
var workerCode = `
importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');

self.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'repair') {
    var buffer = data.buffer;
    
    self.postMessage({type: 'progress', percent: 5, msg: 'Loading PDF...'});
    
    PDFLib.PDFDocument.load(buffer, {ignoreEncryption: true, updateMetadata: false}).then(function(srcPdf) {
      self.postMessage({type: 'progress', percent: 15, msg: 'Creating repaired structure...'});
      
      return PDFLib.PDFDocument.create().then(function(newPdf) {
        var total = srcPdf.getPageCount();
        var recovered = 0;
        var chain = Promise.resolve();
        
        for (var i = 0; i < total; i++) {
          (function(idx) {
            chain = chain.then(function() {
              var percent = 20 + ((idx + 1) / total) * 65;
              self.postMessage({
                type: 'progress',
                percent: percent,
                msg: 'Recovering page ' + (idx + 1) + ' of ' + total
              });
              
              return newPdf.copyPages(srcPdf, [idx]).then(function(copied) {
                newPdf.addPage(copied[0]);
                recovered++;
              }).catch(function() {
                /* skip damaged page */
              });
            });
          })(i);
        }
        
        return chain.then(function() {
          self.postMessage({type: 'progress', percent: 90, msg: 'Saving repaired PDF...'});
          return newPdf.save().then(function(bytes) {
            self.postMessage({
              type: 'complete',
              bytes: bytes,
              recovered: recovered,
              total: total
            });
          });
        });
      });
    }).catch(function(err) {
      self.postMessage({
        type: 'error',
        msg: 'Repair failed: ' + (err.message || err)
      });
    });
  }
};
`;

/* Create Worker */
var blob = new Blob([workerCode], {type: 'application/javascript'});
var workerUrl = URL.createObjectURL(blob);
var worker = new Worker(workerUrl);

function loadJS(src){return new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=function(){res(true);};s.onerror=function(){rej(new Error('load fail'));};document.head.appendChild(s);});}

var html='';
html+='<style>';
html+='.rp-wrap{max-width:1400px;margin:0 auto}';
html+='.rp-hero{text-align:center;padding:50px 16px 40px}';
html+='.rp-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.rp-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.rp-big{background:linear-gradient(135deg,#ef4444,#f87171);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(239,68,68,.35)}';
html+='.rp-big:hover{transform:translateY(-2px)}';
html+='.rp-big:disabled{opacity:.5;cursor:not-allowed}';
html+='.rp-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.rp-zone{border:2px dashed transparent;border-radius:18px}';
html+='.rp-zone.on{border-color:#ef4444;background:#fef2f2}';
html+='.rp-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden;padding:22px}';
html+='.rp-grid{display:grid;grid-template-columns:340px 1fr;gap:20px}';
html+='.rp-side{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px}';
html+='.rp-side h2{font-size:20px;font-weight:900;margin-bottom:6px}';
html+='.rp-sub{font-size:13px;color:#9a9aa5;margin-bottom:14px}';
html+='.rp-status{background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:12px 14px;font-size:13px;font-weight:700;color:#991b1b;margin-bottom:12px;line-height:1.5}';
html+='.rp-status.ok{background:#eafbef;border-color:#bbe7c6;color:#166534}';
html+='.rp-count{background:#e0f2fe;border:1px solid #bae6fd;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:800;color:#075985;margin-bottom:12px}';
html+='.rp-go{width:100%;background:linear-gradient(135deg,#ef4444,#f87171);color:#fff;font-size:17px;font-weight:800;padding:16px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(239,68,68,.35);margin-top:12px}';
html+='.rp-go:active{transform:scale(.98)}';
html+='.rp-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.rp-preview{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px;overflow:auto;max-height:760px}';
html+='.rp-preview h3{font-size:16px;font-weight:900;margin-bottom:12px}';
html+='.rp-pages{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px}';
html+='.rp-page{border:2px solid #eceaf6;border-radius:8px;overflow:hidden;background:#fff;aspect-ratio:3/4;position:relative}';
html+='.rp-page.ok{border-color:#16a34a}';
html+='.rp-page.fail{border-color:#dc2626;opacity:.5}';
html+='.rp-page img{width:100%;height:100%;object-fit:cover}';
html+='.rp-page .num{position:absolute;top:4px;left:4px;background:rgba(0,0,0,.7);color:#fff;font-size:11px;font-weight:800;padding:2px 8px;border-radius:4px}';
html+='.rp-page .badge{position:absolute;bottom:4px;right:4px;font-size:10px;font-weight:800;padding:3px 8px;border-radius:4px}';
html+='.rp-page.ok .badge{background:#16a34a;color:#fff}';
html+='.rp-page.fail .badge{background:#dc2626;color:#fff}';
html+='.rp-busy{display:none;text-align:center;padding:60px 20px}';
html+='.rp-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.rp-busy .st{color:#7a7a85;font-size:15px;margin-bottom:10px;min-height:20px}';
html+='.rp-busy .st2{color:#ef4444;font-size:13px;font-weight:700;margin-bottom:16px;min-height:18px}';
html+='.rp-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.rp-bar div{height:100%;width:0;background:linear-gradient(90deg,#ef4444,#f87171);transition:width .3s}';
html+='.rp-pct{font-size:36px;font-weight:900}';
html+='.rp-cancel{margin-top:16px;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;border:none;cursor:pointer}';
html+='.rp-cancel:hover{background:#e6e8f5}';
html+='.rp-done{display:none;text-align:center;padding:50px 20px}';
html+='.rp-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.rp-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.rp-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='.rp-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);background:#16a34a;color:#fff;font-weight:800;padding:14px 28px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:all .3s;z-index:999;font-size:14px}';
html+='.rp-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}';
html+='.rp-toast.err{background:#dc2626}';
html+='@media(max-width:900px){.rp-grid{grid-template-columns:1fr}}';
html+='</style>';
html+='<div class="rp-wrap">';
html+='<div id="rpPick"><div class="rp-hero"><h1>Repair PDF</h1><p>Fix corrupted, damaged or broken PDFs - rebuild structure & recover pages.</p>';
html+='<div class="rp-zone" id="rpZone"><button class="rp-big" id="rpBtn" type="button">Select PDF file</button><p class="rp-drop-hint">or drop a damaged PDF here</p></div></div></div>';
html+='<div class="rp-work" id="rpWork"><div class="rp-grid">';
html+='<div class="rp-side"><h2>Repair settings</h2><p class="rp-sub">Runs fully in your browser</p>';
html+='<div class="rp-status" id="rpStatus">Analyzing PDF structure...</div>';
html+='<div class="rp-count" id="rpCount">0 page(s) detected</div>';
html+='<button class="rp-go" id="rpGo" type="button" disabled>Repair PDF →</button></div>';
html+='<div class="rp-preview"><h3>Page recovery preview</h3><div class="rp-pages" id="rpPages"></div></div>';
html+='</div></div>';
html+='<div class="rp-busy" id="rpBusy"><h2>Repairing PDF...</h2><p class="st" id="rpBusyStatus">Working...</p><p class="st2" id="rpBusyStatus2"></p><div class="rp-bar"><div id="rpBarFill"></div></div><div class="rp-pct" id="rpPct">0%</div><button class="rp-cancel" id="rpCancel" type="button">✕ Cancel</button></div>';
html+='<div class="rp-done" id="rpDone"><div class="rp-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF repaired!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="rpDoneInfo"></p><a class="rp-dl" id="rpDl" href="#">⬇ Download Repaired PDF</a><button class="rp-again" id="rpAgain" type="button">Repair another</button></div>';
html+='<div class="rp-toast" id="rpToast"></div>';
html+='<input type="file" id="rpFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;

var file=null,doc=null,totalPages=0,recoverable=[];
var cancelRequested=false;

var pick=document.getElementById('rpPick'),work=document.getElementById('rpWork'),busy=document.getElementById('rpBusy'),done=document.getElementById('rpDone');
var zone=document.getElementById('rpZone'),btn=document.getElementById('rpBtn'),inp=document.getElementById('rpFile');
var pagesBox=document.getElementById('rpPages'),countEl=document.getElementById('rpCount'),statusEl=document.getElementById('rpStatus'),goBtn=document.getElementById('rpGo');
var toastEl=document.getElementById('rpToast');
var cancelBtn=document.getElementById('rpCancel');
var busyStatusEl=document.getElementById('rpBusyStatus');
var busyStatus2El=document.getElementById('rpBusyStatus2');

/* Worker message handler */
worker.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'progress') {
    document.getElementById('rpPct').textContent = Math.round(data.percent) + '%';
    document.getElementById('rpBarFill').style.width = data.percent + '%';
    busyStatusEl.textContent = data.msg || 'Processing...';
  } else if (data.type === 'complete') {
    document.getElementById('rpPct').textContent = '100%';
    document.getElementById('rpBarFill').style.width = '100%';
    busyStatusEl.textContent = 'Complete!';
    busyStatus2El.textContent = '';
    
    setTimeout(function() {
      busy.style.display = 'none';
      done.style.display = 'block';
      document.getElementById('rpDoneInfo').textContent = data.recovered + ' of ' + data.total + ' page(s) recovered • ' + (data.bytes.length / 1024).toFixed(1) + ' KB';
      
      var blob = new Blob([data.bytes], {type: 'application/pdf'});
      var dl = document.getElementById('rpDl');
      dl.href = URL.createObjectURL(blob);
      dl.download = 'repaired-' + (file ? file.name.replace(/\.pdf$/i, '') : 'document') + '.pdf';
      goBtn.disabled = false;
      toast('✓ PDF repaired! (' + data.recovered + '/' + data.total + ' pages)');
    }, 300);
  } else if (data.type === 'error') {
    busy.style.display = 'none';
    work.style.display = 'block';
    goBtn.disabled = false;
    toast('Repair failed: ' + data.msg, true);
  }
};

function toast(m,e){
  toastEl.textContent=m;
  toastEl.classList.toggle('err',!!e);
  toastEl.classList.add('show');
  clearTimeout(toastEl.__h);
  toastEl.__h=setTimeout(function(){toastEl.classList.remove('show');},2200);
}

btn.onclick=function(){inp.click();};

function renderPageThumb(n){
  return doc.getPage(n).then(function(page){
    var vp1=page.getViewport({scale:1});
    var scale=Math.min(0.4,200/vp1.width);
    var vp=page.getViewport({scale:scale});
    var cv=document.createElement('canvas');
    cv.width=Math.floor(vp.width);
    cv.height=Math.floor(vp.height);
    var cx=cv.getContext('2d');
    cx.fillStyle='#fff';
    cx.fillRect(0,0,cv.width,cv.height);
    return page.render({canvasContext:cx,viewport:vp}).promise.then(function(){
      return cv.toDataURL('image/jpeg',0.8);
    });
  });
}

function loadFile(f){
  if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){
    toast('Please select a PDF file',true);
    return;
  }
  file=f;
  
  Promise.all([loadJS(PDFLIB_SRC),loadJS(PDFJS_SRC)]).then(function(){
    window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
    return f.arrayBuffer();
  }).then(function(b){
    return window.pdfjsLib.getDocument({data:b}).promise;
  }).then(function(d){
    doc=d;
    totalPages=d.numPages;
    pick.style.display='none';
    done.style.display='none';
    work.style.display='block';
    statusEl.textContent='✓ PDF loaded - '+totalPages+' page(s) detected';
    statusEl.classList.add('ok');
    countEl.textContent=totalPages+' page(s) detected';
    goBtn.disabled=false;
    
    /* render thumbnails */
    pagesBox.innerHTML='';
    for(var i=1;i<=totalPages;i++){
      (function(n){
        var d=document.createElement('div');
        d.className='rp-page';
        d.innerHTML='<span class="num">'+n+'</span><div class="badge">Checking...</div>';
        pagesBox.appendChild(d);
        
        renderPageThumb(n).then(function(data){
          var img=document.createElement('img');
          img.src=data;
          d.insertBefore(img,d.firstChild);
          d.classList.add('ok');
          d.querySelector('.badge').textContent='OK';
          recoverable.push(n);
        }).catch(function(){
          d.classList.add('fail');
          d.querySelector('.badge').textContent='Damaged';
        });
      })(i);
    }
    
    toast('✓ PDF loaded ('+totalPages+' pages)');
  }).catch(function(e){
    pick.style.display='block';
    toast('Could not read PDF: '+((e&&e.message)||e),true);
  });
}

inp.onchange=function(){if(inp.files[0]){loadFile(inp.files[0]);}inp.value='';};

zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){
  e.preventDefault();
  zone.classList.remove('on');
  if(e.dataTransfer.files[0]){loadFile(e.dataTransfer.files[0]);}
};

goBtn.onclick=function(){
  if(!file||!doc){toast('Select a PDF first',true);return;}
  
  work.style.display='none';
  done.style.display='none';
  busy.style.display='block';
  
  document.getElementById('rpPct').textContent='0%';
  document.getElementById('rpBarFill').style.width='0%';
  busyStatusEl.textContent='Starting repair...';
  busyStatus2El.textContent='';
  cancelRequested=false;
  goBtn.disabled=true;
  
  /* Read file and send to worker */
  file.arrayBuffer().then(function(buf){
    if(cancelRequested){
      busy.style.display='none';
      work.style.display='block';
      goBtn.disabled=false;
      return;
    }
    
    worker.postMessage({
      type: 'repair',
      buffer: buf
    }, [buf]); /* Transfer ArrayBuffer for zero-copy */
  }).catch(function(err){
    busy.style.display='none';
    work.style.display='block';
    goBtn.disabled=false;
    toast('Error reading file: '+err.message,true);
  });
};

cancelBtn.onclick=function(){
  cancelRequested=true;
  busyStatusEl.textContent='Cancelling...';
  busyStatus2El.textContent='';
  
  /* Terminate and recreate worker */
  worker.terminate();
  var blob = new Blob([workerCode], {type: 'application/javascript'});
  var workerUrl = URL.createObjectURL(blob);
  worker = new Worker(workerUrl);
  
  /* Reattach message handler */
  worker.onmessage = function(e) {
    var data = e.data;
    if (data.type === 'progress') {
      document.getElementById('rpPct').textContent = Math.round(data.percent) + '%';
      document.getElementById('rpBarFill').style.width = data.percent + '%';
      busyStatusEl.textContent = data.msg || 'Processing...';
    } else if (data.type === 'complete') {
      document.getElementById('rpPct').textContent = '100%';
      document.getElementById('rpBarFill').style.width = '100%';
      busyStatusEl.textContent = 'Complete!';
      busyStatus2El.textContent = '';
      setTimeout(function() {
        busy.style.display = 'none';
        done.style.display = 'block';
        document.getElementById('rpDoneInfo').textContent = data.recovered + ' of ' + data.total + ' page(s) recovered • ' + (data.bytes.length / 1024).toFixed(1) + ' KB';
        var blob = new Blob([data.bytes], {type: 'application/pdf'});
        var dl = document.getElementById('rpDl');
        dl.href = URL.createObjectURL(blob);
        dl.download = 'repaired-' + (file ? file.name.replace(/\.pdf$/i, '') : 'document') + '.pdf';
        goBtn.disabled = false;
        toast('✓ PDF repaired! (' + data.recovered + '/' + data.total + ' pages)');
      }, 300);
    } else if (data.type === 'error') {
      busy.style.display = 'none';
      work.style.display = 'block';
      goBtn.disabled = false;
      toast('Repair failed: ' + data.msg, true);
    }
  };
  
  busy.style.display='none';
  work.style.display='block';
  goBtn.disabled=false;
};

document.getElementById('rpAgain').onclick=function(){
  done.style.display='none';
  pick.style.display='block';
  file=null;
  doc=null;
  recoverable=[];
};

})();
