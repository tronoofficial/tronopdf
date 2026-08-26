/* TronoPDF - Rotate PDF v3 | Web Worker + Cancel + Progress */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';

/* Web Worker for PDF rotation */
var workerCode = `
importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');

self.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'rotate') {
    var buffer = data.buffer;
    var rotations = data.rotations;
    
    self.postMessage({type: 'progress', percent: 5, msg: 'Loading PDF...'});
    
    PDFLib.PDFDocument.load(buffer, {ignoreEncryption: true}).then(function(pdf) {
      self.postMessage({type: 'progress', percent: 15, msg: 'Rotating pages...'});
      
      var pages = pdf.getPages();
      var total = pages.length;
      var rotated = 0;
      
      for (var i = 0; i < total; i++) {
        var ang = rotations[i] || 0;
        if (ang !== 0) {
          var cur = pages[i].getRotation().angle;
          pages[i].setRotation(PDFLib.degrees((cur + ang) % 360));
          rotated++;
        }
        
        var percent = 15 + ((i + 1) / total) * 75;
        self.postMessage({
          type: 'progress',
          percent: percent,
          msg: 'Processing page ' + (i + 1) + ' of ' + total
        });
      }
      
      self.postMessage({type: 'progress', percent: 95, msg: 'Saving PDF...'});
      return pdf.save().then(function(bytes) {
        self.postMessage({
          type: 'complete',
          bytes: bytes,
          rotated: rotated
        });
      });
    }).catch(function(err) {
      self.postMessage({
        type: 'error',
        msg: 'Rotation failed: ' + (err.message || err)
      });
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

function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}

var html='';
html+='<style>';
html+='.rt-wrap{max-width:1400px;margin:0 auto}';
html+='.rt-hero{text-align:center;padding:50px 16px 40px}';
html+='.rt-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.rt-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.rt-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.rt-big:hover{transform:translateY(-2px)}';
html+='.rt-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.rt-zone{border:2px dashed transparent;border-radius:18px}';
html+='.rt-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.rt-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.rt-main{display:flex;min-height:600px}';
html+='.rt-pages{flex:1;padding:40px;overflow-y:auto}';
html+='.rt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px}';
html+='.rt-page{background:#fff;border:2px solid #eceaf6;border-radius:10px;padding:12px;text-align:center;transition:.2s;position:relative;cursor:pointer}';
html+='.rt-page:hover{border-color:#7c3aed;transform:translateY(-2px)}';
html+='.rt-page.rotated{border-color:#7c3aed;background:#f3f0ff}';
html+='.rt-thumb{height:160px;display:flex;align-items:center;justify-content:center;background:#fafbfe;border-radius:6px;margin-bottom:8px;overflow:hidden;position:relative}';
html+='.rt-thumb img{max-width:100%;max-height:100%;object-fit:contain;transition:transform .3s ease}';
html+='.rt-num{font-size:12px;font-weight:700;color:#4b4b5a}';
html+='.rt-angle{position:absolute;top:6px;right:6px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:10px;font-weight:800;padding:3px 7px;border-radius:999px}';
html+='.rt-side{width:380px;background:#fff;border-left:1px solid #eceaf6;padding:30px;display:flex;flex-direction:column}';
html+='.rt-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:22px}';
html+='.rt-tip{background:#ede9fe;border-radius:10px;padding:14px 16px;font-size:13px;color:#5b21b6;line-height:1.55;margin-bottom:18px}';
html+='.rt-info{background:#f7f6fc;border:1px solid #eceaf6;border-radius:10px;padding:14px;margin-bottom:20px;font-size:13px;color:#4b4b5a}';
html+='.rt-info strong{color:#7c3aed}';
html+='.rt-lbl{font-size:13px;font-weight:800;color:#4b4b5a;margin-bottom:10px}';
html+='.rt-sec{margin-bottom:20px}';
html+='.rt-bulk{display:flex;gap:8px;margin-bottom:16px}';
html+='.rt-btn{flex:1;border:2px solid #eceaf6;border-radius:10px;background:#fff;padding:14px 8px;font-size:12px;font-weight:800;color:#4b4b5a;cursor:pointer;text-align:center;transition:.2s;display:flex;flex-direction:column;align-items:center;gap:6px}';
html+='.rt-btn:hover{border-color:#7c3aed;background:#f3f0ff}';
html+='.rt-btn .ic{font-size:20px}';
html+='.rt-reset{width:100%;border:1px solid #fecaca;background:#fff5f5;color:#dc2626;font-weight:700;font-size:13px;padding:10px;border-radius:8px;cursor:pointer;margin-bottom:16px}';
html+='.rt-reset:hover{background:#fdeaea}';
html+='.rt-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:auto}';
html+='.rt-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.rt-busy{display:none;padding:60px 20px;text-align:center}';
html+='.rt-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.rt-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:10px}';
html+='.rt-busy .st{color:#7c3aed;font-size:13px;font-weight:700;margin-bottom:16px;min-height:18px}';
html+='.rt-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,.08)}';
html+='.rt-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);border-radius:999px;transition:width .3s}';
html+='.rt-pct{font-size:36px;font-weight:900}';
html+='.rt-cancel{margin-top:16px;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;border:none;cursor:pointer}';
html+='.rt-cancel:hover{background:#e6e8f5}';
html+='.rt-done{display:none;text-align:center;padding:60px 20px}';
html+='.rt-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.rt-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.rt-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='@media(max-width:900px){.rt-main{flex-direction:column}.rt-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="rt-wrap">';
html+='<div id="rtPick"><div class="rt-hero"><h1>Rotate PDF pages</h1><p>Rotate all or specific pages of your PDF. Free, private and unlimited.</p>';
html+='<div class="rt-zone" id="rtZone"><button class="rt-big" id="rtBtn" type="button">Select PDF file</button><p class="rt-drop-hint">or drop PDF here</p></div></div></div>';
html+='<div class="rt-work" id="rtWork"><div class="rt-main"><div class="rt-pages"><div class="rt-grid" id="rtGrid"></div></div>';
html+='<aside class="rt-side"><h2>Rotate PDF</h2>';
html+='<div class="rt-tip">ℹ️ Click on any page thumbnail to rotate it. Use the buttons below to rotate ALL pages at once. Only the pages you rotate will change - everything else stays exactly the same.</div>';
html+='<div class="rt-info" id="rtInfo">Click on any page to rotate it individually, or use the buttons below.</div>';
html+='<div class="rt-sec"><div class="rt-lbl">Rotate all pages</div>';
html+='<div class="rt-bulk"><button class="rt-btn" id="rtAllL" type="button"><span class="ic">↺</span><span>Left 90°</span></button><button class="rt-btn" id="rtAll180" type="button"><span class="ic">🔄</span><span>180°</span></button><button class="rt-btn" id="rtAllR" type="button"><span class="ic">↻</span><span>Right 90°</span></button></div>';
html+='<button class="rt-reset" id="rtReset" type="button">↺ Reset all rotations</button></div>';
html+='<button class="rt-go" id="rtGo" type="button">Apply Rotation →</button></aside></div></div>';
html+='<div class="rt-busy" id="rtBusy"><h2>Rotating pages...</h2><p class="fn" id="rtBusyName"></p><p class="st" id="rtStatus">Preparing...</p><div class="rt-bar"><div id="rtBarFill"></div></div><div class="rt-pct" id="rtPct">0%</div><button class="rt-cancel" id="rtCancel" type="button">✕ Cancel</button></div>';
html+='<div class="rt-done" id="rtDone"><div class="rt-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF rotated successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="rtDoneInfo"></p><a class="rt-dl" id="rtDl" href="#">⬇ Download rotated PDF</a><button class="rt-again" id="rtAgain" type="button">Rotate another PDF</button></div>';
html+='<input type="file" id="rtFile" accept="application/pdf,.pdf" style="display:none">';
html+='</div>';
root.innerHTML=html;

var file=null;var doc=null;var totalPages=0;
var rotations=[];
var cancelRequested=false;

var pick=document.getElementById('rtPick'),work=document.getElementById('rtWork'),busy=document.getElementById('rtBusy'),done=document.getElementById('rtDone');
var zone=document.getElementById('rtZone'),btn=document.getElementById('rtBtn'),inp=document.getElementById('rtFile'),grid=document.getElementById('rtGrid');
var go=document.getElementById('rtGo'),infoEl=document.getElementById('rtInfo');
var cancelBtn=document.getElementById('rtCancel');
var statusEl=document.getElementById('rtStatus');

/* Worker message handler */
worker.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'progress') {
    document.getElementById('rtPct').textContent = Math.round(data.percent) + '%';
    document.getElementById('rtBarFill').style.width = data.percent + '%';
    statusEl.textContent = data.msg || 'Processing...';
  } else if (data.type === 'complete') {
    document.getElementById('rtPct').textContent = '100%';
    document.getElementById('rtBarFill').style.width = '100%';
    statusEl.textContent = 'Complete!';
    
    setTimeout(function() {
      busy.style.display = 'none';
      done.style.display = 'block';
      document.getElementById('rtDoneInfo').textContent = data.rotated + ' page(s) rotated • ' + fmtB(data.bytes.length);
      
      var blob = new Blob([data.bytes], {type: 'application/pdf'});
      var dl = document.getElementById('rtDl');
      dl.href = URL.createObjectURL(blob);
      dl.download = 'rotated-' + file.name;
      go.disabled = false;
    }, 300);
  } else if (data.type === 'error') {
    busy.style.display = 'none';
    work.style.display = 'block';
    go.disabled = false;
    alert('Error: ' + data.msg);
  }
};

function renderPages(){
  grid.innerHTML='';
  var any=false;
  for(var i=1;i<=totalPages;i++){
    (function(pg){
      var ang=rotations[pg-1]||0;
      if(ang!==0){any=true;}
      var div=document.createElement('div');
      div.className='rt-page'+(ang!==0?' rotated':'');
      div.setAttribute('data-page',pg);
      div.innerHTML='<div class="rt-thumb"><span style="color:#c3c6d4;font-size:24px">📄</span></div><div class="rt-num">Page '+pg+(ang!==0?' • '+ang+'°':'')+'</div>';
      div.onclick=function(){
        var cur=rotations[pg-1]||0;
        cur=(cur+90)%360;
        rotations[pg-1]=cur;
        renderPages();
        updateInfo();
      };
      grid.appendChild(div);
      doc.getPage(pg).then(function(page){
        var vp=page.getViewport({scale:1});
        var scale=Math.min(1,140/vp.width);
        var vp2=page.getViewport({scale:scale});
        var canvas=document.createElement('canvas');
        canvas.width=Math.floor(vp2.width);
        canvas.height=Math.floor(vp2.height);
        page.render({canvasContext:canvas.getContext('2d'),viewport:vp2}).promise.then(function(){
          var thumb=div.querySelector('.rt-thumb');
          var img=document.createElement('img');
          img.src=canvas.toDataURL('image/jpeg',0.5);
          img.alt='Page '+pg;
          img.style.transform='rotate('+ang+'deg)';
          thumb.innerHTML='';
          thumb.appendChild(img);
          if(ang!==0){
            var badge=document.createElement('span');
            badge.className='rt-angle';
            badge.textContent=ang+'°';
            thumb.appendChild(badge);
          }
        });
      });
    })(i);
  }
  go.disabled=!any;
}

function updateInfo(){
  var count=0;
  for(var i=0;i<rotations.length;i++){
    if((rotations[i]||0)!==0){count++;}
  }
  if(count===0){
    infoEl.innerHTML='Click on any page to rotate it individually, or use the buttons below.';
  }else{
    infoEl.innerHTML='<strong>'+count+'</strong> page(s) rotated. Click Apply Rotation to save.';
  }
  go.disabled=count===0;
}

function rotateAll(delta){
  for(var i=0;i<totalPages;i++){
    var cur=rotations[i]||0;
    rotations[i]=(cur+delta+360)%360;
  }
  renderPages();
  updateInfo();
}

function resetAll(){
  for(var i=0;i<totalPages;i++){rotations[i]=0;}
  renderPages();
  updateInfo();
}

function addFile(f){
  if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){
    alert('Please select a PDF file.');
    return;
  }
  file=f;
  pick.style.display='none';
  work.style.display='block';
  
  waitLib('pdfjsLib').then(function(ok){
    if(!ok){alert('Error loading PDF library');return;}
    window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
    f.arrayBuffer().then(function(b){
      return window.pdfjsLib.getDocument({data:b}).promise.then(function(d){
        doc=d;
        totalPages=d.numPages;
        rotations=new Array(totalPages).fill(0);
        renderPages();
        updateInfo();
      });
    }).catch(function(){alert('Error reading PDF');});
  });
}

document.getElementById('rtAllL').onclick=function(){rotateAll(270);};
document.getElementById('rtAllR').onclick=function(){rotateAll(90);};
document.getElementById('rtAll180').onclick=function(){rotateAll(180);};
document.getElementById('rtReset').onclick=resetAll;

btn.onclick=function(){inp.click();};

inp.onchange=function(){
  if(inp.files[0]){addFile(inp.files[0]);}
  inp.value='';
};

zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){
  e.preventDefault();
  zone.classList.remove('on');
  if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}
};

go.onclick=function(){
  if(!file){return;}
  
  work.style.display='none';
  busy.style.display='block';
  document.getElementById('rtBusyName').textContent=file.name;
  document.getElementById('rtPct').textContent='0%';
  document.getElementById('rtBarFill').style.width='0%';
  statusEl.textContent='Starting rotation...';
  cancelRequested=false;
  go.disabled=true;
  
  /* Read file and send to worker */
  file.arrayBuffer().then(function(buf){
    if(cancelRequested){
      busy.style.display='none';
      work.style.display='block';
      go.disabled=false;
      return;
    }
    
    worker.postMessage({
      type: 'rotate',
      buffer: buf,
      rotations: rotations
    }, [buf]); /* Transfer ArrayBuffer for zero-copy */
  }).catch(function(err){
    busy.style.display='none';
    work.style.display='block';
    go.disabled=false;
    alert('Error reading file: '+err.message);
  });
};

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
      document.getElementById('rtPct').textContent = Math.round(data.percent) + '%';
      document.getElementById('rtBarFill').style.width = data.percent + '%';
      statusEl.textContent = data.msg || 'Processing...';
    } else if (data.type === 'complete') {
      document.getElementById('rtPct').textContent = '100%';
      document.getElementById('rtBarFill').style.width = '100%';
      statusEl.textContent = 'Complete!';
      setTimeout(function() {
        busy.style.display = 'none';
        done.style.display = 'block';
        document.getElementById('rtDoneInfo').textContent = data.rotated + ' page(s) rotated • ' + fmtB(data.bytes.length);
        var blob = new Blob([data.bytes], {type: 'application/pdf'});
        var dl = document.getElementById('rtDl');
        dl.href = URL.createObjectURL(blob);
        dl.download = 'rotated-' + file.name;
        go.disabled = false;
      }, 300);
    } else if (data.type === 'error') {
      busy.style.display = 'none';
      work.style.display = 'block';
      go.disabled = false;
      alert('Error: ' + data.msg);
    }
  };
  
  busy.style.display='none';
  work.style.display='block';
  go.disabled=false;
};

document.getElementById('rtAgain').onclick=function(){
  file=null;doc=null;totalPages=0;rotations=[];
  done.style.display='none';work.style.display='none';pick.style.display='block';
};

})();
