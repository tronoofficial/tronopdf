/* TronoPDF - JPG to PDF v2 | Web Worker + Cancel + Progress */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';

/* Web Worker for image conversion and PDF building */
var workerCode = `
importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');

var SIZES = {a4: [595.28, 841.89], letter: [612, 792], legal: [612, 1008]};

function imageToJpeg(blob, quality) {
  return createImageBitmap(blob).then(function(bitmap) {
    var maxD = 3000;
    var sc = Math.min(1, maxD / Math.max(bitmap.width, bitmap.height));
    var w = Math.max(1, Math.round(bitmap.width * sc));
    var h = Math.max(1, Math.round(bitmap.height * sc));
    
    var canvas = new OffscreenCanvas(w, h);
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    
    return canvas.convertToBlob({type: 'image/jpeg', quality: quality}).then(function(jpegBlob) {
      return jpegBlob.arrayBuffer().then(function(ab) {
        return {bytes: new Uint8Array(ab), w: w, h: h};
      });
    });
  });
}

self.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'convert') {
    var files = data.files;
    var merge = data.merge;
    var size = data.size;
    var orient = data.orient;
    var margin = data.margin;
    var quality = data.quality;
    var total = files.length;
    
    self.postMessage({type: 'progress', percent: 5, msg: 'Starting conversion...'});
    
    var results = [];
    var skipped = 0;
    var mergedDoc = null;
    
    var chain = PDFLib.PDFDocument.create().then(function(d) {
      mergedDoc = d;
      return null;
    });
    
    files.forEach(function(fileData, idx) {
      chain = chain.then(function() {
        var percent = 5 + ((idx + 1) / total) * 75;
        self.postMessage({
          type: 'progress',
          percent: percent,
          msg: 'Processing image ' + (idx + 1) + ' of ' + total
        });
        
        var blob = new Blob([fileData.buffer], {type: fileData.type});
        
        return imageToJpeg(blob, quality).then(function(img) {
          function placeInto(doc) {
            var pw, ph;
            var iw = img.w * 0.75, ih = img.h * 0.75;
            if (size === 'fit') {
              pw = iw + margin * 2;
              ph = ih + margin * 2;
            } else {
              var d = SIZES[size];
              if (orient === 'portrait') { pw = d[0]; ph = d[1]; }
              else { pw = d[1]; ph = d[0]; }
            }
            var page = doc.addPage([pw, ph]);
            return doc.embedJpg(img.bytes).then(function(ej) {
              var cw = pw - margin * 2, ch = ph - margin * 2;
              var sc = Math.min(cw / iw, ch / ih);
              var dw = iw * sc, dh = ih * sc;
              page.drawImage(ej, {x: (pw - dw) / 2, y: (ph - dh) / 2, width: dw, height: dh});
              return null;
            });
          }
          
          if (merge) {
            return placeInto(mergedDoc);
          }
          return PDFLib.PDFDocument.create().then(function(d) {
            return placeInto(d).then(function() {
              return d.save().then(function(bytes) {
                results.push({name: fileData.name, bytes: bytes});
              });
            });
          });
        }).catch(function() {
          skipped++;
        });
      });
    });
    
    chain.then(function() {
      self.postMessage({type: 'progress', percent: 85, msg: 'Saving PDF...'});
      
      if (merge) {
        return mergedDoc.save().then(function(bytes) {
          results.push({name: 'tronopdf-images.pdf', bytes: bytes});
        });
      }
      return null;
    }).then(function() {
      self.postMessage({type: 'progress', percent: 95, msg: 'Finalizing...'});
      
      /* Transfer all result buffers */
      var buffers = results.map(function(r) { return r.bytes.buffer; });
      
      self.postMessage({
        type: 'complete',
        results: results.map(function(r) {
          return {name: r.name, bytes: r.bytes, byteLength: r.bytes.length};
        }),
        skipped: skipped
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
html+='.jp-wrap{max-width:1400px;margin:0 auto}';
html+='.jp-hero{text-align:center;padding:50px 16px 40px}';
html+='.jp-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.jp-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.jp-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.jp-big:hover{transform:translateY(-2px)}';
html+='.jp-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.jp-zone{border:2px dashed transparent;border-radius:18px}';
html+='.jp-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.jp-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.jp-main{display:flex;min-height:560px}';
html+='.jp-images{flex:1;padding:40px;overflow-y:auto}';
html+='.jp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px}';
html+='.jp-card{background:#fff;border:2px solid #eceaf6;border-radius:10px;padding:12px;text-align:center;cursor:grab;transition:.2s;position:relative}';
html+='.jp-card:hover{border-color:#7c3aed;transform:translateY(-2px)}';
html+='.jp-card.drag{opacity:.4}';
html+='.jp-card img{width:100%;height:150px;object-fit:cover;border-radius:6px;background:#fafbfe;margin-bottom:8px}';
html+='.jp-card .nm{font-size:11.5px;font-weight:600;color:#4b4b5a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}';
html+='.jp-card .x{position:absolute;top:6px;right:6px;width:24px;height:24px;border:none;border-radius:50%;background:rgba(255,255,255,.9);color:#dc2626;font-size:12px;cursor:pointer;opacity:0;transition:.15s;box-shadow:0 2px 8px rgba(0,0,0,.15)}';
html+='.jp-card:hover .x{opacity:1}';
html+='.jp-add{border:2px dashed #c9cddd;border-radius:10px;min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#8a8fa3;cursor:pointer;font-weight:700}';
html+='.jp-add:hover{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}';
html+='.jp-addcircle{width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:24px;border:none;cursor:pointer;box-shadow:0 8px 20px rgba(124,58,237,.4)}';
html+='.jp-side{width:380px;background:#fff;border-left:1px solid #eceaf6;padding:30px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.jp-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:22px}';
html+='.jp-lbl{font-size:13px;font-weight:800;color:#4b4b5a;margin-bottom:10px}';
html+='.jp-sec{margin-bottom:20px}';
html+='.jp-two{display:flex;gap:10px}';
html+='.jp-btn{flex:1;border:2px solid #eceaf6;border-radius:10px;background:#fff;padding:14px 10px;font-size:13px;font-weight:700;color:#6b6b7a;cursor:pointer;text-align:center;transition:.2s}';
html+='.jp-btn:hover{border-color:#7c3aed}';
html+='.jp-btn.active{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}';
html+='.jp-three{display:flex;gap:8px}';
html+='.jp-select{width:100%;padding:12px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;font-family:inherit;background:#fff}';
html+='.jp-merge{display:flex;align-items:center;gap:10px;margin-top:4px}';
html+='.jp-merge input{width:18px;height:18px;accent-color:#7c3aed}';
html+='.jp-merge label{font-size:13px;font-weight:600;color:#4b4b5a;cursor:pointer}';
html+='.jp-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:auto}';
html+='.jp-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.jp-busy{display:none;padding:60px 20px;text-align:center}';
html+='.jp-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.jp-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:10px}';
html+='.jp-busy .st{color:#7c3aed;font-size:13px;font-weight:700;margin-bottom:16px;min-height:18px}';
html+='.jp-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,.08)}';
html+='.jp-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);border-radius:999px;transition:width .3s}';
html+='.jp-pct{font-size:36px;font-weight:900}';
html+='.jp-cancel{margin-top:16px;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;border:none;cursor:pointer}';
html+='.jp-cancel:hover{background:#e6e8f5}';
html+='.jp-done{display:none;text-align:center;padding:60px 20px}';
html+='.jp-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.jp-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35);margin:6px;text-decoration:none}';
html+='.jp-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-top:14px}';
html+='@media(max-width:900px){.jp-main{flex-direction:column}.jp-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="jp-wrap">';
html+='<div id="jpPick"><div class="jp-hero"><h1>JPG to PDF</h1><p>Convert JPG, PNG and WEBP images to PDF. Free, private and unlimited.</p>';
html+='<div class="jp-zone" id="jpZone"><button class="jp-big" id="jpBtn" type="button">Select images</button><p class="jp-drop-hint">or drop images here</p></div></div></div>';
html+='<div class="jp-work" id="jpWork"><div class="jp-main"><div class="jp-images"><div class="jp-grid" id="jpGrid"></div></div>';
html+='<aside class="jp-side"><h2>Image to PDF options</h2>';
html+='<div class="jp-sec"><div class="jp-lbl">Page orientation</div><div class="jp-two"><button class="jp-btn active" id="jpPortrait" type="button">📄 Portrait</button><button class="jp-btn" id="jpLandscape" type="button">📄 Landscape</button></div></div>';
html+='<div class="jp-sec"><div class="jp-lbl">Page size</div><select class="jp-select" id="jpSize"><option value="a4">A4 (210x297 mm)</option><option value="letter">Letter (8.5x11 in)</option><option value="legal">Legal (8.5x14 in)</option><option value="fit">Fit to image</option></select></div>';
html+='<div class="jp-sec"><div class="jp-lbl">Margin</div><div class="jp-three"><button class="jp-btn active" data-m="0" type="button">No margin</button><button class="jp-btn" data-m="20" type="button">Small</button><button class="jp-btn" data-m="40" type="button">Big</button></div></div>';
html+='<div class="jp-sec"><div class="jp-lbl">Image quality</div><div class="jp-three"><button class="jp-btn" data-q="0.6" type="button">Low</button><button class="jp-btn active" data-q="0.8" type="button">Good</button><button class="jp-btn" data-q="0.92" type="button">Best</button></div></div>';
html+='<div class="jp-sec jp-merge"><input type="checkbox" id="jpMerge" checked><label for="jpMerge">Merge all images in one PDF file</label></div>';
html+='<button class="jp-go" id="jpGo" type="button">Convert to PDF →</button></aside></div></div>';
html+='<div class="jp-busy" id="jpBusy"><h2>Converting images...</h2><p class="fn" id="jpBusyName"></p><p class="st" id="jpStatus">Preparing...</p><div class="jp-bar"><div id="jpBarFill"></div></div><div class="jp-pct" id="jpPct">0%</div><button class="jp-cancel" id="jpCancel" type="button">✕ Cancel</button></div>';
html+='<div class="jp-done" id="jpDone"><div class="jp-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF created successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:24px" id="jpDoneInfo"></p><div id="jpDownloads"></div><br><button class="jp-again" id="jpAgain" type="button">Convert more images</button></div>';
html+='<input type="file" id="jpFile" accept="image/*,.jpg,.jpeg,.png,.webp" multiple style="display:none">';
html+='</div>';
root.innerHTML=html;

var files=[];var dragIdx=null;
var orient='portrait',margin=0,quality=0.8;
var cancelRequested=false;

var pick=document.getElementById('jpPick'),work=document.getElementById('jpWork'),busy=document.getElementById('jpBusy'),done=document.getElementById('jpDone');
var zone=document.getElementById('jpZone'),btn=document.getElementById('jpBtn'),inp=document.getElementById('jpFile'),grid=document.getElementById('jpGrid');
var go=document.getElementById('jpGo');
var cancelBtn=document.getElementById('jpCancel');
var statusEl=document.getElementById('jpStatus');

/* Worker message handler */
worker.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'progress') {
    document.getElementById('jpPct').textContent = Math.round(data.percent) + '%';
    document.getElementById('jpBarFill').style.width = data.percent + '%';
    statusEl.textContent = data.msg || 'Processing...';
  } else if (data.type === 'complete') {
    document.getElementById('jpPct').textContent = '100%';
    document.getElementById('jpBarFill').style.width = '100%';
    statusEl.textContent = 'Complete!';
    
    setTimeout(function() {
      busy.style.display = 'none';
      done.style.display = 'block';
      
      var total = data.results.reduce(function(a, r) { return a + r.byteLength; }, 0);
      document.getElementById('jpDoneInfo').textContent = data.results.length + ' PDF file(s) created • ' + fmtB(total) + (data.skipped ? ' • ' + data.skipped + ' image(s) skipped' : '');
      
      var dl = document.getElementById('jpDownloads');
      dl.innerHTML = '';
      data.results.forEach(function(r) {
        var blob = new Blob([r.bytes], {type: 'application/pdf'});
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = r.name;
        a.className = 'jp-dl';
        a.textContent = '⬇ ' + r.name;
        dl.appendChild(a);
      });
      
      go.disabled = false;
    }, 300);
  } else if (data.type === 'error') {
    busy.style.display = 'none';
    work.style.display = 'block';
    go.disabled = false;
    alert('Error: ' + data.msg);
  }
};

function addFiles(fl){
  var added=0;
  for(var i=0;i<fl.length;i++){
    var f=fl[i];
    if(f.type.indexOf('image/')===0||/\.(jpg|jpeg|png|webp)$/i.test(f.name)){
      files.push({f:f,url:URL.createObjectURL(f),name:f.name});
      added++;
    }
  }
  if(!added){alert('Please select image files (JPG, PNG, WEBP).');return;}
  pick.style.display='none';work.style.display='block';
  render();
}

function render(){
  grid.innerHTML='';
  files.forEach(function(it,i){
    var c=document.createElement('div');c.className='jp-card';c.draggable=true;
    c.innerHTML='<button class="x" type="button">✕</button><img src="'+it.url+'" alt=""><div class="nm">'+(i+1)+'. '+it.name+'</div>';
    c.querySelector('.x').onclick=function(){URL.revokeObjectURL(it.url);files.splice(i,1);render();};
    c.addEventListener('dragstart',function(){dragIdx=i;c.classList.add('drag');});
    c.addEventListener('dragend',function(){c.classList.remove('drag');dragIdx=null;});
    c.addEventListener('dragover',function(e){e.preventDefault();});
    c.addEventListener('drop',function(e){e.preventDefault();if(dragIdx===null||dragIdx===i){return;}files.splice(i,0,files.splice(dragIdx,1)[0]);dragIdx=null;render();});
    grid.appendChild(c);
  });
  var add=document.createElement('div');add.className='jp-add';
  add.innerHTML='<button class="jp-addcircle" type="button">+</button><span>Add more images</span>';
  add.onclick=function(){inp.click();};
  grid.appendChild(add);
  go.disabled=files.length<1;
}

document.getElementById('jpPortrait').onclick=function(){orient='portrait';this.classList.add('active');document.getElementById('jpLandscape').classList.remove('active');};
document.getElementById('jpLandscape').onclick=function(){orient='landscape';this.classList.add('active');document.getElementById('jpPortrait').classList.remove('active');};

document.querySelectorAll('[data-m]').forEach(function(b){
  b.onclick=function(){margin=parseInt(this.getAttribute('data-m'));document.querySelectorAll('[data-m]').forEach(function(x){x.classList.remove('active');});this.classList.add('active');};
});

document.querySelectorAll('[data-q]').forEach(function(b){
  b.onclick=function(){quality=parseFloat(this.getAttribute('data-q'));document.querySelectorAll('[data-q]').forEach(function(x){x.classList.remove('active');});this.classList.add('active');};
});

btn.onclick=function(){inp.click();};

inp.onchange=function(){addFiles(inp.files);inp.value='';};

zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');addFiles(e.dataTransfer.files);};

go.onclick=function(){
  if(files.length<1){return;}
  
  work.style.display='none';
  busy.style.display='block';
  document.getElementById('jpBusyName').textContent=files.length+' image(s)';
  document.getElementById('jpPct').textContent='0%';
  document.getElementById('jpBarFill').style.width='0%';
  statusEl.textContent='Reading images...';
  cancelRequested=false;
  go.disabled=true;
  
  var merge=document.getElementById('jpMerge').checked;
  var size=document.getElementById('jpSize').value;
  
  /* Read all files and send to worker */
  var readPromises = files.map(function(it) {
    return it.f.arrayBuffer().then(function(buf) {
      return {
        buffer: buf,
        type: it.f.type || 'image/jpeg',
        name: it.name.replace(/\.[^.]+$/, '') + '.pdf'
      };
    });
  });
  
  Promise.all(readPromises).then(function(fileData) {
    if(cancelRequested){
      busy.style.display='none';
      work.style.display='block';
      go.disabled=false;
      return;
    }
    
    worker.postMessage({
      type: 'convert',
      files: fileData,
      merge: merge,
      size: size,
      orient: orient,
      margin: margin,
      quality: quality
    });
  }).catch(function(err) {
    busy.style.display='none';
    work.style.display='block';
    go.disabled=false;
    alert('Error reading files: '+err.message);
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
      document.getElementById('jpPct').textContent = Math.round(data.percent) + '%';
      document.getElementById('jpBarFill').style.width = data.percent + '%';
      statusEl.textContent = data.msg || 'Processing...';
    } else if (data.type === 'complete') {
      document.getElementById('jpPct').textContent = '100%';
      document.getElementById('jpBarFill').style.width = '100%';
      statusEl.textContent = 'Complete!';
      setTimeout(function() {
        busy.style.display = 'none';
        done.style.display = 'block';
        var total = data.results.reduce(function(a, r) { return a + r.byteLength; }, 0);
        document.getElementById('jpDoneInfo').textContent = data.results.length + ' PDF file(s) created • ' + fmtB(total) + (data.skipped ? ' • ' + data.skipped + ' image(s) skipped' : '');
        var dl = document.getElementById('jpDownloads');
        dl.innerHTML = '';
        data.results.forEach(function(r) {
          var blob = new Blob([r.bytes], {type: 'application/pdf'});
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = r.name;
          a.className = 'jp-dl';
          a.textContent = '⬇ ' + r.name;
          dl.appendChild(a);
        });
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

document.getElementById('jpAgain').onclick=function(){
  files.forEach(function(it){URL.revokeObjectURL(it.url);});
  files=[];done.style.display='none';work.style.display='none';pick.style.display='block';
};

})();
