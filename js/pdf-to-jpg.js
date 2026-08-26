/* TronoPDF - PDF to JPG v2 | Web Worker + Cancel + Progress + JSZip */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
var JSZIP_SRC='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';

var jszipP=null;
function loadJSZip(){
  if(jszipP){return jszipP;}
  jszipP=new Promise(function(res,rej){
    var s=document.createElement('script');
    s.src=JSZIP_SRC;
    s.onload=function(){res(window.JSZip);};
    s.onerror=function(){rej(new Error('JSZip load fail'));};
    document.head.appendChild(s);
  });
  return jszipP;
}

/* Web Worker for PDF page rendering */
var workerCode = `
importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

function renderPage(pdfData, pageNum, scale, fmt, quality) {
  return pdfjsLib.getDocument({data: pdfData}).promise.then(function(doc) {
    return doc.getPage(pageNum).then(function(page) {
      var vp = page.getViewport({scale: scale});
      var canvas = new OffscreenCanvas(Math.floor(vp.width), Math.floor(vp.height));
      var ctx = canvas.getContext('2d');
      
      return page.render({canvasContext: ctx, viewport: vp}).promise.then(function() {
        var mimeType = 'image/jpeg';
        var ext = 'jpg';
        if (fmt === 'png') { mimeType = 'image/png'; ext = 'png'; }
        else if (fmt === 'webp') { mimeType = 'image/webp'; ext = 'webp'; }
        
        return canvas.convertToBlob({type: mimeType, quality: quality}).then(function(blob) {
          return blob.arrayBuffer().then(function(ab) {
            return {
              pageNum: pageNum,
              buffer: ab,
              ext: ext,
              bytes: blob.size
            };
          });
        });
      });
    });
  });
}

self.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'convert') {
    var pdfData = data.pdfData;
    var pages = data.pages;
    var scale = data.scale;
    var fmt = data.fmt;
    var quality = data.quality;
    var total = pages.length;
    
    self.postMessage({type: 'progress', percent: 5, msg: 'Starting conversion...'});
    
    var results = [];
    var chain = Promise.resolve();
    
    pages.forEach(function(pg, idx) {
      chain = chain.then(function() {
        var percent = 5 + ((idx + 1) / total) * 85;
        self.postMessage({
          type: 'progress',
          percent: percent,
          msg: 'Converting page ' + (idx + 1) + ' of ' + total
        });
        
        return renderPage(pdfData, pg, scale, fmt, quality).then(function(result) {
          results.push(result);
          return result;
        });
      });
    });
    
    chain.then(function() {
      var buffers = results.map(function(r) { return r.buffer; });
      self.postMessage({type: 'progress', percent: 95, msg: 'Finalizing...'});
      self.postMessage({
        type: 'complete',
        results: results
      }, buffers);
    }).catch(function(err) {
      self.postMessage({
        type: 'error',
        msg: 'Conversion failed: ' + (err.message || err)
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

function parsePages(str,max){
  var pages=[];var parts=str.split(',');
  for(var i=0;i<parts.length;i++){
    var p=parts[i].trim();
    if(p.indexOf('-')>-1){
      var r=p.split('-');var s=parseInt(r[0]),e=parseInt(r[1]);
      if(!isNaN(s)&&!isNaN(e)){for(var j=Math.max(1,s);j<=Math.min(max,e);j++){if(pages.indexOf(j)===-1){pages.push(j);}}}
    }else{
      var n=parseInt(p);if(!isNaN(n)&&n>=1&&n<=max&&pages.indexOf(n)===-1){pages.push(n);}
    }
  }
  return pages.sort(function(a,b){return a-b;});
}

var html='';
html+='<style>';
html+='.pj-wrap{max-width:1400px;margin:0 auto}';
html+='.pj-hero{text-align:center;padding:50px 16px 40px}';
html+='.pj-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.pj-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.pj-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.pj-big:hover{transform:translateY(-2px)}';
html+='.pj-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.pj-zone{border:2px dashed transparent;border-radius:18px}';
html+='.pj-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.pj-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.pj-main{display:flex;min-height:560px}';
html+='.pj-pages{flex:1;padding:40px;overflow-y:auto}';
html+='.pj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px}';
html+='.pj-page{background:#fff;border:2px solid #eceaf6;border-radius:10px;padding:12px;text-align:center;cursor:pointer;transition:.2s;position:relative}';
html+='.pj-page:hover{border-color:#7c3aed;transform:translateY(-2px)}';
html+='.pj-page.selected{border-color:#7c3aed;background:#f3f0ff}';
html+='.pj-page .thumb{height:160px;display:flex;align-items:center;justify-content:center;background:#fafbfe;border-radius:6px;margin-bottom:8px;overflow:hidden}';
html+='.pj-page .thumb img{max-width:100%;max-height:100%;object-fit:contain}';
html+='.pj-page .num{font-size:12px;font-weight:700;color:#4b4b5a}';
html+='.pj-page .check{position:absolute;top:8px;right:8px;width:24px;height:24px;border-radius:50%;background:#7c3aed;color:#fff;display:none;align-items:center;justify-content:center;font-size:14px}';
html+='.pj-page.selected .check{display:flex}';
html+='.pj-side{width:380px;background:#fff;border-left:1px solid #eceaf6;padding:30px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.pj-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:22px}';
html+='.pj-lbl{font-size:13px;font-weight:800;color:#4b4b5a;margin-bottom:10px}';
html+='.pj-sec{margin-bottom:20px}';
html+='.pj-three{display:flex;gap:8px}';
html+='.pj-btn{flex:1;border:2px solid #eceaf6;border-radius:10px;background:#fff;padding:12px 8px;font-size:12px;font-weight:700;color:#6b6b7a;cursor:pointer;text-align:center;transition:.2s}';
html+='.pj-btn:hover{border-color:#7c3aed}';
html+='.pj-btn.active{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}';
html+='.pj-range{border-top:1px solid #eceaf6;padding-top:18px;margin-top:6px}';
html+='.pj-range-head{display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer}';
html+='.pj-range-head input{width:18px;height:18px;accent-color:#7c3aed}';
html+='.pj-range-head label{font-size:13px;font-weight:700;cursor:pointer}';
html+='.pj-range-box{display:none}';
html+='.pj-range-box.show{display:block}';
html+='.pj-range-box input{width:100%;padding:10px 14px;border:1px solid #ddd;border-radius:8px;font-size:14px;margin-bottom:6px}';
html+='.pj-range-box small{display:block;color:#9a9aa5;font-size:12px}';
html+='.pj-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:auto}';
html+='.pj-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.pj-busy{display:none;padding:60px 20px;text-align:center}';
html+='.pj-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.pj-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:10px}';
html+='.pj-busy .st{color:#7c3aed;font-size:13px;font-weight:700;margin-bottom:16px;min-height:18px}';
html+='.pj-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,.08)}';
html+='.pj-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);border-radius:999px;transition:width .3s}';
html+='.pj-pct{font-size:36px;font-weight:900}';
html+='.pj-cancel{margin-top:16px;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;border:none;cursor:pointer}';
html+='.pj-cancel:hover{background:#e6e8f5}';
html+='.pj-done{display:none;text-align:center;padding:60px 20px}';
html+='.pj-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.pj-dl-all{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35);margin-bottom:20px;text-decoration:none}';
html+='.pj-dl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;max-width:800px;margin:0 auto 20px}';
html+='.pj-dl-item{background:#f7f6fc;border:1px solid #eceaf6;border-radius:10px;padding:14px;text-align:center}';
html+='.pj-dl-item a{display:block;background:#7c3aed;color:#fff;font-weight:700;font-size:13px;padding:10px;border-radius:8px;text-decoration:none}';
html+='.pj-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer}';
html+='@media(max-width:900px){.pj-main{flex-direction:column}.pj-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="pj-wrap">';
html+='<div id="pjPick"><div class="pj-hero"><h1>PDF to JPG</h1><p>Convert PDF pages to JPG, PNG or WEBP images. Free, private and unlimited.</p>';
html+='<div class="pj-zone" id="pjZone"><button class="pj-big" id="pjBtn" type="button">Select PDF file</button><p class="pj-drop-hint">or drop PDF here</p></div></div></div>';
html+='<div class="pj-work" id="pjWork"><div class="pj-main"><div class="pj-pages"><div class="pj-grid" id="pjGrid"></div></div>';
html+='<aside class="pj-side"><h2>Conversion options</h2>';
html+='<div class="pj-sec"><div class="pj-lbl">Image format</div><div class="pj-three"><button class="pj-btn active" data-fmt="jpg" type="button">JPG</button><button class="pj-btn" data-fmt="png" type="button">PNG</button><button class="pj-btn" data-fmt="webp" type="button">WEBP</button></div></div>';
html+='<div class="pj-sec"><div class="pj-lbl">Image quality</div><div class="pj-three"><button class="pj-btn" data-q="0.6" type="button">Low</button><button class="pj-btn active" data-q="0.8" type="button">Medium</button><button class="pj-btn" data-q="0.95" type="button">High</button></div></div>';
html+='<div class="pj-range"><div class="pj-range-head"><input type="checkbox" id="pjRangeCheck"><label for="pjRangeCheck">Convert specific pages only</label></div>';
html+='<div class="pj-range-box" id="pjRangeBox"><input type="text" id="pjPages" placeholder="e.g. 1,3,5-8"><small>Enter page numbers separated by commas. Use dash for ranges.</small></div></div>';
html+='<button class="pj-go" id="pjGo" type="button">Convert to images →</button></aside></div></div>';
html+='<div class="pj-busy" id="pjBusy"><h2>Converting pages...</h2><p class="fn" id="pjBusyName"></p><p class="st" id="pjStatus">Preparing...</p><div class="pj-bar"><div id="pjBarFill"></div></div><div class="pj-pct" id="pjPct">0%</div><button class="pj-cancel" id="pjCancel" type="button">✕ Cancel</button></div>';
html+='<div class="pj-done" id="pjDone"><div class="pj-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">Conversion complete!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:24px" id="pjDoneInfo"></p><a class="pj-dl-all" id="pjDlAll" href="#">⬇ Download all as ZIP</a><div class="pj-dl-grid" id="pjDownloads"></div><button class="pj-again" id="pjAgain" type="button">Convert another PDF</button></div>';
html+='<input type="file" id="pjFile" accept="application/pdf,.pdf" style="display:none">';
html+='</div>';
root.innerHTML=html;

var file=null;var doc=null;var totalPages=0;
var fmt='jpg',quality=0.8;
var cancelRequested=false;

var pick=document.getElementById('pjPick'),work=document.getElementById('pjWork'),busy=document.getElementById('pjBusy'),done=document.getElementById('pjDone');
var zone=document.getElementById('pjZone'),btn=document.getElementById('pjBtn'),inp=document.getElementById('pjFile'),grid=document.getElementById('pjGrid');
var go=document.getElementById('pjGo');
var cancelBtn=document.getElementById('pjCancel');
var statusEl=document.getElementById('pjStatus');

/* Worker message handler */
worker.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'progress') {
    document.getElementById('pjPct').textContent = Math.round(data.percent) + '%';
    document.getElementById('pjBarFill').style.width = data.percent + '%';
    statusEl.textContent = data.msg || 'Processing...';
  } else if (data.type === 'complete') {
    document.getElementById('pjPct').textContent = '100%';
    document.getElementById('pjBarFill').style.width = '100%';
    statusEl.textContent = 'Building ZIP...';
    
    /* Build ZIP on main thread (lightweight) */
    loadJSZip().then(function(JSZip) {
      var zip = new JSZip();
      var results = [];
      var totalBytes = 0;
      
      data.results.forEach(function(r) {
        var blob = new Blob([r.buffer], {type: 'image/' + r.ext});
        var fileName = 'page-' + r.pageNum + '.' + r.ext;
        zip.file(fileName, blob);
        
        var dataURL = URL.createObjectURL(blob);
        results.push({name: fileName, dataURL: dataURL});
        totalBytes += r.bytes;
      });
      
      zip.generateAsync({type: 'blob'}).then(function(zipBlob) {
        setTimeout(function() {
          busy.style.display = 'none';
          done.style.display = 'block';
          document.getElementById('pjDoneInfo').textContent = results.length + ' image(s) created • ' + fmtB(zipBlob.size);
          
          var dlAll = document.getElementById('pjDlAll');
          dlAll.href = URL.createObjectURL(zipBlob);
          dlAll.download = 'tronopdf-images.zip';
          
          var dlGrid = document.getElementById('pjDownloads');
          dlGrid.innerHTML = '';
          results.forEach(function(r) {
            var div = document.createElement('div');
            div.className = 'pj-dl-item';
            div.innerHTML = '<a href="' + r.dataURL + '" download="' + r.name + '">⬇ ' + r.name + '</a>';
            dlGrid.appendChild(div);
          });
          
          go.disabled = false;
        }, 300);
      });
    }).catch(function() {
      busy.style.display = 'none';
      work.style.display = 'block';
      go.disabled = false;
      alert('Error building ZIP. Please try again.');
    });
  } else if (data.type === 'error') {
    busy.style.display = 'none';
    work.style.display = 'block';
    go.disabled = false;
    alert('Error: ' + data.msg);
  }
};

function renderPages(){
  grid.innerHTML='';
  for(var i=1;i<=totalPages;i++){
    (function(pg){
      var div=document.createElement('div');
      div.className='pj-page selected';
      div.setAttribute('data-page',pg);
      div.innerHTML='<div class="thumb"><span style="color:#c3c6d4;font-size:24px">📄</span></div><div class="num">Page '+pg+'</div><div class="check">✓</div>';
      div.onclick=function(){this.classList.toggle('selected');};
      grid.appendChild(div);
      doc.getPage(pg).then(function(page){
        var vp=page.getViewport({scale:1});
        var scale=Math.min(1,140/vp.width);
        var vp2=page.getViewport({scale:scale});
        var canvas=document.createElement('canvas');
        canvas.width=Math.floor(vp2.width);
        canvas.height=Math.floor(vp2.height);
        page.render({canvasContext:canvas.getContext('2d'),viewport:vp2}).promise.then(function(){
          var thumb=div.querySelector('.thumb');
          thumb.innerHTML='<img src="'+canvas.toDataURL('image/jpeg',0.5)+'" alt="Page '+pg+'">';
        });
      });
    })(i);
  }
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
    f.arrayBuffer().then(function(buf){
      return window.pdfjsLib.getDocument({data:buf}).promise.then(function(d){
        doc=d;
        totalPages=d.numPages;
        renderPages();
      });
    }).catch(function(){alert('Error reading PDF');});
  });
}

document.querySelectorAll('[data-fmt]').forEach(function(b){
  b.onclick=function(){
    fmt=this.getAttribute('data-fmt');
    document.querySelectorAll('[data-fmt]').forEach(function(x){x.classList.remove('active');});
    this.classList.add('active');
  };
});

document.querySelectorAll('[data-q]').forEach(function(b){
  b.onclick=function(){
    quality=parseFloat(this.getAttribute('data-q'));
    document.querySelectorAll('[data-q]').forEach(function(x){x.classList.remove('active');});
    this.classList.add('active');
  };
});

var rCheck=document.getElementById('pjRangeCheck'),rBox=document.getElementById('pjRangeBox');
rCheck.onchange=function(){rBox.classList.toggle('show',this.checked);};

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
  if(!file||!doc){return;}
  
  var useRange=rCheck.checked;
  var pages=[];
  
  if(useRange){
    pages=parsePages(document.getElementById('pjPages').value,totalPages);
    if(pages.length===0){alert('Please enter valid page numbers.');return;}
  }else{
    document.querySelectorAll('.pj-page.selected').forEach(function(p){
      pages.push(parseInt(p.getAttribute('data-page')));
    });
    if(pages.length===0){alert('Please select at least one page.');return;}
  }
  
  work.style.display='none';
  busy.style.display='block';
  document.getElementById('pjBusyName').textContent=pages.length+' page(s)';
  document.getElementById('pjPct').textContent='0%';
  document.getElementById('pjBarFill').style.width='0%';
  statusEl.textContent='Starting conversion...';
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
      type: 'convert',
      pdfData: buf,
      pages: pages,
      scale: 2,
      fmt: fmt,
      quality: quality
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
      document.getElementById('pjPct').textContent = Math.round(data.percent) + '%';
      document.getElementById('pjBarFill').style.width = data.percent + '%';
      statusEl.textContent = data.msg || 'Processing...';
    } else if (data.type === 'complete') {
      document.getElementById('pjPct').textContent = '100%';
      document.getElementById('pjBarFill').style.width = '100%';
      statusEl.textContent = 'Building ZIP...';
      loadJSZip().then(function(JSZip) {
        var zip = new JSZip();
        var results = [];
        data.results.forEach(function(r) {
          var blob = new Blob([r.buffer], {type: 'image/' + r.ext});
          var fileName = 'page-' + r.pageNum + '.' + r.ext;
          zip.file(fileName, blob);
          results.push({name: fileName, dataURL: URL.createObjectURL(blob)});
        });
        zip.generateAsync({type: 'blob'}).then(function(zipBlob) {
          setTimeout(function() {
            busy.style.display = 'none';
            done.style.display = 'block';
            document.getElementById('pjDoneInfo').textContent = results.length + ' image(s) created • ' + fmtB(zipBlob.size);
            var dlAll = document.getElementById('pjDlAll');
            dlAll.href = URL.createObjectURL(zipBlob);
            dlAll.download = 'tronopdf-images.zip';
            var dlGrid = document.getElementById('pjDownloads');
            dlGrid.innerHTML = '';
            results.forEach(function(r) {
              var div = document.createElement('div');
              div.className = 'pj-dl-item';
              div.innerHTML = '<a href="' + r.dataURL + '" download="' + r.name + '">⬇ ' + r.name + '</a>';
              dlGrid.appendChild(div);
            });
            go.disabled = false;
          }, 300);
        });
      }).catch(function() {
        busy.style.display = 'none';
        work.style.display = 'block';
        go.disabled = false;
        alert('Error building ZIP.');
      });
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

document.getElementById('pjAgain').onclick=function(){
  file=null;doc=null;totalPages=0;
  done.style.display='none';work.style.display='none';pick.style.display='block';
  rCheck.checked=false;rBox.classList.remove('show');
};

})();
