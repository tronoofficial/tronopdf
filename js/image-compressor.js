/* TronoPDF - Image Compressor v7 | Bitmap Scope Fixed + Fast Base64 + EXIF */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

var hasOffscreen = typeof OffscreenCanvas !== 'undefined';

var workerCode = `
var hasOffscreen = typeof OffscreenCanvas !== 'undefined';

/* FAST chunked base64 (big images safe) */
function toDataURL(blob, mime) {
  return blob.arrayBuffer().then(function(ab) {
    var bytes = new Uint8Array(ab);
    var chunk = 8192, binary = '';
    for (var i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return 'data:' + mime + ';base64,' + btoa(binary);
  });
}

function drawToCanvas(img, maxD, isPng) {
  var sc = Math.min(1, maxD / Math.max(img.width, img.height));
  var w = Math.max(1, Math.round(img.width * sc));
  var h = Math.max(1, Math.round(img.height * sc));
  var c, x;
  if (hasOffscreen) {
    c = new OffscreenCanvas(w, h);
    x = c.getContext('2d');
  } else {
    c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    x = c.getContext('2d');
  }
  if (!isPng) { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); }
  try { x.imageSmoothingQuality = 'high'; } catch(e) {}
  x.drawImage(img, 0, 0, w, h);
  return c;
}

function compressOne(img, opts, progressCb) {
  var isPng = opts.format === 'png';
  var mimeType = isPng ? 'image/png' : 'image/jpeg';
  var base = drawToCanvas(img, 4096, isPng);

  if (opts.mode === 'quality') {
    return base.convertToBlob({type: mimeType, quality: opts.q}).then(function(b) {
      return toDataURL(b, mimeType).then(function(url) { return {dataURL: url, bytes: b.size}; });
    });
  }

  var smallest = null;
  var attempt = 0;

  function tryAt(w, h) {
    var c2, x;
    if (hasOffscreen) { c2 = new OffscreenCanvas(w, h); x = c2.getContext('2d'); }
    else { c2 = document.createElement('canvas'); c2.width = w; c2.height = h; x = c2.getContext('2d'); }
    if (!isPng) { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); }
    try { x.imageSmoothingQuality = 'high'; } catch(e) {}
    x.drawImage(base, 0, 0, w, h);

    var lo = 0.02, hi = 0.95, best = null;
    var chain = Promise.resolve();

    for (var i = 0; i < 9; i++) {
      (function(idx) {
        chain = chain.then(function() {
          var q = (lo + hi) / 2;
          return c2.convertToBlob({type: mimeType, quality: q}).then(function(b) {
            return toDataURL(b, mimeType).then(function(url) {
              var size = b.size;
              if (!smallest || size < smallest.bytes) smallest = {dataURL: url, bytes: size};
              if (size <= opts.target) { best = {dataURL: url, bytes: size}; lo = q; } else { hi = q; }
              if (progressCb) progressCb((idx + 1) / 9);
            });
          });
        });
      })(i);
    }

    return chain.then(function() {
      if (best) return best;
      if (w > 120 && attempt < 8) { attempt++; return tryAt(Math.round(w * 0.8), Math.round(h * 0.8)); }
      return smallest;
    });
  }

  return tryAt(base.width, base.height);
}

self.onmessage = function(e) {
  var data = e.data;
  if (data.type !== 'compress') return;

  var images = data.images, opts = data.options;
  var total = images.length;
  var results = [];
  var chain = Promise.resolve();

  images.forEach(function(imgData, idx) {
    chain = chain.then(function() {
      self.postMessage({type:'progress', percent:(idx/total)*90, msg:'Compressing image '+(idx+1)+' of '+total, current:idx, total:total});

      /* EXIF orientation fix (phone photos seedhe aayenge) */
      var bmpPromise;
      try {
        bmpPromise = createImageBitmap(imgData.blob, {imageOrientation:'from-image'}).catch(function(){ return createImageBitmap(imgData.blob); });
      } catch(err) {
        bmpPromise = createImageBitmap(imgData.blob);
      }

      return bmpPromise.then(function(bitmap) {
        var format = (imgData.name || '').toLowerCase().indexOf('.png') > -1 ? 'png' : 'jpeg';
        var o = {}; for (var k in opts) o[k] = opts[k]; o.format = format;

        /* bitmap.close() ABI ISI scope mein - bahar nahi */
        return compressOne(bitmap, o, function(p) {
          self.postMessage({type:'progress', percent:((idx+p)/total)*90, msg:'Compressing image '+(idx+1)+' of '+total+' ('+Math.round(p*100)+'%)', current:idx, total:total});
        }).then(function(result) {
          try { bitmap.close(); } catch(err) {}
          results.push({index: idx, result: result, error: false});
        });
      }).catch(function(err) {
        results.push({index: idx, result: null, error: true, errorMsg: 'Unsupported image format - use JPG, PNG or WEBP'});
      });
    });
  });

  chain.then(function() {
    self.postMessage({type:'progress', percent:95, msg:'Finalizing...'});
    self.postMessage({type:'complete', results: results});
  });
};
`;

/* Main thread fallback (old browsers) */
function compressMainThread(imgData, opts, progressCb) {
  return new Promise(function(resolve, reject) {
    var img = new Image();
    var objUrl = URL.createObjectURL(imgData.blob);
    img.onload = function() {
      URL.revokeObjectURL(objUrl);
      try {
        var isPng = (imgData.name || '').toLowerCase().indexOf('.png') > -1;
        var mimeType = isPng ? 'image/png' : 'image/jpeg';
        var maxD = 4096;
        var sc = Math.min(1, maxD / Math.max(img.width, img.height));
        var w = Math.max(1, Math.round(img.width * sc));
        var h = Math.max(1, Math.round(img.height * sc));

        var c = document.createElement('canvas');
        c.width = w; c.height = h;
        var x = c.getContext('2d');
        if (!isPng) { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); }
        x.drawImage(img, 0, 0, w, h);

        if (opts.mode === 'quality') {
          c.toBlob(function(blob) {
            if (!blob) { reject(new Error('Encode failed')); return; }
            var reader = new FileReader();
            reader.onload = function() { resolve({dataURL: reader.result, bytes: blob.size}); };
            reader.onerror = function() { reject(new Error('Read failed')); };
            reader.readAsDataURL(blob);
          }, mimeType, opts.q);
        } else {
          var smallest = null, attempt = 0;
          (function tryAt(w2, h2) {
            var c2 = document.createElement('canvas');
            c2.width = w2; c2.height = h2;
            var x2 = c2.getContext('2d');
            if (!isPng) { x2.fillStyle = '#fff'; x2.fillRect(0, 0, w2, h2); }
            x2.drawImage(c, 0, 0, w2, h2);
            var lo = 0.02, hi = 0.95, best = null, i = 0;
            (function next() {
              if (i >= 9) {
                if (best) { resolve(best); return; }
                if (w2 > 120 && attempt < 8) { attempt++; tryAt(Math.round(w2*0.8), Math.round(h2*0.8)); }
                else { resolve(smallest); }
                return;
              }
              var q = (lo + hi) / 2;
              c2.toBlob(function(blob) {
                if (!blob) { i++; next(); return; }
                var reader = new FileReader();
                reader.onload = function() {
                  var size = blob.size;
                  if (!smallest || size < smallest.bytes) smallest = {dataURL: reader.result, bytes: size};
                  if (size <= opts.target) { best = {dataURL: reader.result, bytes: size}; lo = q; } else { hi = q; }
                  if (progressCb) progressCb((i+1)/9);
                  i++; next();
                };
                reader.readAsDataURL(blob);
              }, mimeType, q);
            })();
          })(w, h);
        }
      } catch (err) { reject(err); }
    };
    img.onerror = function() { URL.revokeObjectURL(objUrl); reject(new Error('Unsupported image format - use JPG, PNG or WEBP')); };
    img.src = objUrl;
  });
}

var worker = null;
if (hasOffscreen) {
  var blob = new Blob([workerCode], {type: 'application/javascript'});
  worker = new Worker(URL.createObjectURL(blob));
}

function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}

var html='';
html+='<style>';
html+='.ic-wrap{max-width:1400px;margin:0 auto}';
html+='.ic-hero{text-align:center;padding:50px 16px 40px}';
html+='.ic-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.ic-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.ic-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.ic-big:hover{transform:translateY(-2px)}';
html+='.ic-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.ic-zone{border:2px dashed transparent;border-radius:18px}';
html+='.ic-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.ic-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.ic-main{display:flex;min-height:600px}';
html+='.ic-list{flex:1;padding:40px;overflow-y:auto}';
html+='.ic-note{background:#ede9fe;border-radius:10px;padding:12px 16px;font-size:13px;color:#5b21b6;margin-bottom:20px}';
html+='.ic-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px}';
html+='.ic-card{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:14px;text-align:center;position:relative}';
html+='.ic-card img{width:100%;height:190px;object-fit:contain;border-radius:8px;background:#f3f4f8;margin-bottom:10px}';
html+='.ic-nm{font-size:12.5px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:6px}';
html+='.ic-sizes{display:flex;justify-content:center;align-items:center;gap:8px;font-size:12px;margin-bottom:10px}';
html+='.ic-old{color:#9a9aa5;text-decoration:line-through}';
html+='.ic-new{color:#16a34a;font-weight:800}';
html+='.ic-badge{position:absolute;top:8px;right:8px;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;font-size:10px;font-weight:800;padding:3px 8px;border-radius:999px}';
html+='.ic-dl{display:block;background:#7c3aed;color:#fff;font-weight:700;font-size:13px;padding:11px;border-radius:8px;text-decoration:none}';
html+='.ic-dl:hover{background:#6d28d9}';
html+='.ic-side{width:380px;background:#fff;border-left:1px solid #eceaf6;padding:28px;display:flex;flex-direction:column}';
html+='.ic-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:18px}';
html+='.ic-tabs{display:flex;gap:8px;margin-bottom:18px}';
html+='.ic-tab{flex:1;border:2px solid #eceaf6;border-radius:10px;background:#fff;padding:12px;font-size:13px;font-weight:800;text-align:center;cursor:pointer;transition:.2s}';
html+='.ic-tab:hover{border-color:#7c3aed}';
html+='.ic-tab.active{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}';
html+='.ic-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:10px 0 6px}';
html+='.ic-row{display:flex;gap:8px;align-items:center}';
html+='.ic-row input[type=number]{flex:1;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px}';
html+='.ic-row select{padding:11px;border:1px solid #ddd;border-radius:10px;font-size:14px}';
html+='.ic-row input[type=range]{flex:1;accent-color:#7c3aed}';
html+='.ic-quick{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}';
html+='.ic-quick button{border:1px solid #eceaf6;background:#f7f6fc;color:#4b4b5a;font-size:11px;font-weight:800;padding:6px 12px;border-radius:999px;cursor:pointer}';
html+='.ic-quick button:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.ic-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:16px}';
html+='.ic-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.ic-again{width:100%;background:#f4f5fa;color:#333;font-weight:700;font-size:13px;padding:12px;border-radius:10px;border:none;cursor:pointer;margin-top:10px}';
html+='.ic-busy{display:none;padding:60px 20px;text-align:center}';
html+='.ic-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.ic-busy .st{color:#7a7a85;font-size:15px;margin-bottom:10px;min-height:20px}';
html+='.ic-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.ic-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .3s}';
html+='.ic-pct{font-size:36px;font-weight:900}';
html+='.ic-cancel{margin-top:16px;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;border:none;cursor:pointer}';
html+='.ic-cancel:hover{background:#e6e8f5}';
html+='@media(max-width:900px){.ic-main{flex-direction:column}.ic-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="ic-wrap">';
html+='<div id="icPick"><div class="ic-hero"><h1>Image Compressor</h1><p>Compress JPG, PNG & WEBP to an exact KB size. Perfect for job applications, exams, visas and online forms worldwide. Free & private.</p>';
html+='<div class="ic-zone" id="icZone"><button class="ic-big" id="icBtn" type="button">Select images</button><p class="ic-drop-hint">or drop images here</p></div></div></div>';
html+='<div class="ic-work" id="icWork"><div class="ic-main"><div class="ic-list"><div class="ic-note">💡 Each image has its own Download button - files save directly to your phone or PC. No ZIP needed!</div><div class="ic-grid" id="icGrid"></div></div>';
html+='<aside class="ic-side"><h2>Compression settings</h2>';
html+='<div class="ic-tabs"><div class="ic-tab active" id="icTabTarget">🎯 Target KB</div><div class="ic-tab" id="icTabQuality">⚙️ Quality</div></div>';
html+='<div id="icTargetSec"><div class="ic-lbl">Exact size target</div><div class="ic-row"><input type="number" id="icTarget" min="5" value="50"/><select id="icUnit"><option value="KB">KB</option><option value="MB">MB</option></select></div>';
html+='<div class="ic-quick"><button type="button" data-kb="20">20 KB</button><button type="button" data-kb="50">50 KB</button><button type="button" data-kb="100">100 KB</button><button type="button" data-kb="200">200 KB</button><button type="button" data-kb="500">500 KB</button></div></div>';
html+='<div id="icQualitySec" style="display:none"><div class="ic-lbl">Quality: <span id="icQVal">70</span>%</div><div class="ic-row"><input type="range" id="icQ" min="10" max="95" value="70"/></div></div>';
html+='<button class="ic-go" id="icGo" type="button">Compress Images →</button>';
html+='<button class="ic-again" id="icAgain" type="button">Compress more images</button></aside></div></div>';
html+='<div class="ic-busy" id="icBusy"><h2>Compressing images...</h2><p class="st" id="icStatus">Working...</p><div class="ic-bar"><div id="icBarFill"></div></div><div class="ic-pct" id="icPct">0%</div><button class="ic-cancel" id="icCancel" type="button">✕ Cancel</button></div>';
html+='<input type="file" id="icFile" accept="image/*,.jpg,.jpeg,.png,.webp" multiple style="display:none">';
html+='</div>';
root.innerHTML=html;

var files=[];var mode='target';
var cancelRequested=false;

var pick=document.getElementById('icPick'),work=document.getElementById('icWork'),busy=document.getElementById('icBusy');
var zone=document.getElementById('icZone'),btn=document.getElementById('icBtn'),inp=document.getElementById('icFile'),grid=document.getElementById('icGrid');
var go=document.getElementById('icGo');
var cancelBtn=document.getElementById('icCancel');
var statusEl=document.getElementById('icStatus');
var elTarget=document.getElementById('icTarget'),elUnit=document.getElementById('icUnit'),elQ=document.getElementById('icQ');

function finish(results) {
  document.getElementById('icPct').textContent = '100%';
  document.getElementById('icBarFill').style.width = '100%';
  statusEl.textContent = 'Complete!';
  results.forEach(function(r) {
    if (r.index < files.length) {
      if (r.error) { files[r.index].error = true; files[r.index].errorMsg = r.errorMsg || 'Could not compress this image'; }
      else { files[r.index].result = r.result; }
    }
  });
  setTimeout(function() {
    busy.style.display = 'none';
    work.style.display = 'block';
    go.disabled = false;
    render();
  }, 300);
}

function attachWorker() {
  worker.onmessage = function(e) {
    var data = e.data;
    if (data.type === 'progress') {
      document.getElementById('icPct').textContent = Math.round(data.percent) + '%';
      document.getElementById('icBarFill').style.width = data.percent + '%';
      statusEl.textContent = data.msg || 'Processing...';
    } else if (data.type === 'complete') {
      finish(data.results);
    }
  };
}
if (worker) attachWorker();

document.getElementById('icTabTarget').onclick=function(){
  mode='target';
  this.classList.add('active');
  document.getElementById('icTabQuality').classList.remove('active');
  document.getElementById('icTargetSec').style.display='block';
  document.getElementById('icQualitySec').style.display='none';
};
document.getElementById('icTabQuality').onclick=function(){
  mode='quality';
  this.classList.add('active');
  document.getElementById('icTabTarget').classList.remove('active');
  document.getElementById('icTargetSec').style.display='none';
  document.getElementById('icQualitySec').style.display='block';
};
elQ.oninput=function(){document.getElementById('icQVal').textContent=this.value;};
document.querySelectorAll('.ic-quick button').forEach(function(b){
  b.onclick=function(){elTarget.value=this.getAttribute('data-kb');elUnit.value='KB';};
});

function addFiles(fl){
  var added=0;
  for(var i=0;i<fl.length;i++){
    var f=fl[i];
    if(f.type.indexOf('image/')===0||/\.(jpg|jpeg|png|webp)$/i.test(f.name)){
      files.push({f:f,url:URL.createObjectURL(f),result:null,error:false});
      added++;
    }
  }
  if(!added){alert('Please select image files (JPG, PNG or WEBP).');return;}
  pick.style.display='none';
  work.style.display='block';
  render();
}

function render(){
  grid.innerHTML='';
  files.forEach(function(it){
    var c=document.createElement('div');
    c.className='ic-card';
    var body='<img src="'+(it.result?it.result.dataURL:it.url)+'" alt=""><div class="ic-nm">'+it.f.name+'</div>';
    if(it.error){
      body+='<div class="ic-sizes" style="color:#dc2626;font-weight:700">'+(it.errorMsg||'Could not compress this image')+'</div>';
    }else if(it.result){
      var saved=Math.max(0,(1-it.result.bytes/it.f.size)*100);
      var ext=it.f.name.toLowerCase().indexOf('.png')>-1?'.png':'.jpg';
      body+='<div class="ic-badge">↓ '+saved.toFixed(0)+'%</div><div class="ic-sizes"><span class="ic-old">'+fmtB(it.f.size)+'</span><span>→</span><span class="ic-new">'+fmtB(it.result.bytes)+'</span></div><a class="ic-dl" href="'+it.result.dataURL+'" download="compressed-'+it.f.name.replace(/\.[^.]+$/,'')+ext+'">⬇ Download</a>';
    }else{
      body+='<div class="ic-sizes">'+fmtB(it.f.size)+'</div><div style="text-align:center;color:#9a9aa5;font-size:12px">Waiting to compress...</div>';
    }
    c.innerHTML=body;
    grid.appendChild(c);
  });
  go.disabled=files.length<1;
}

btn.onclick=function(){inp.click();};
inp.onchange=function(){addFiles(inp.files);inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');addFiles(e.dataTransfer.files);};

go.onclick=function(){
  if(files.length<1){return;}

  var opts;
  if(mode==='target'){
    var tv=parseFloat(elTarget.value)||50;
    opts={mode:'target',target:elUnit.value==='MB'?tv*1048576:tv*1024};
  }else{
    opts={mode:'quality',q:elQ.value/100};
  }

  files.forEach(function(it){it.result=null;it.error=false;it.errorMsg=null;});

  work.style.display='none';
  busy.style.display='block';
  document.getElementById('icPct').textContent='0%';
  document.getElementById('icBarFill').style.width='0%';
  statusEl.textContent='Preparing images...';
  cancelRequested=false;
  go.disabled=true;

  var readPromises = files.map(function(it) {
    return it.f.arrayBuffer().then(function(buf) {
      return {blob: new Blob([buf], {type: it.f.type || 'image/jpeg'}), name: it.f.name};
    });
  });

  Promise.all(readPromises).then(function(imageData) {
    if(cancelRequested){ busy.style.display='none'; work.style.display='block'; go.disabled=false; return; }

    if (worker) {
      worker.postMessage({type:'compress', images:imageData, options:opts});
    } else {
      var total=imageData.length, results=[], chain=Promise.resolve();
      imageData.forEach(function(imgData, idx) {
        chain = chain.then(function() {
          if (cancelRequested) return;
          statusEl.textContent='Compressing image '+(idx+1)+' of '+total;
          return compressMainThread(imgData, opts, function(p) {
            var op=((idx+p)/total)*90;
            document.getElementById('icPct').textContent=Math.round(op)+'%';
            document.getElementById('icBarFill').style.width=op+'%';
          }).then(function(result) {
            results.push({index:idx, result:result, error:false});
          }).catch(function(err) {
            results.push({index:idx, result:null, error:true, errorMsg:err.message||'Could not compress this image'});
          });
        });
      });
      chain.then(function(){ if(!cancelRequested) finish(results); });
    }
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
  if (worker) {
    worker.terminate();
    var wb=new Blob([workerCode],{type:'application/javascript'});
    worker=new Worker(URL.createObjectURL(wb));
    attachWorker();
  }
  busy.style.display='none';
  work.style.display='block';
  go.disabled=false;
  render();
};

document.getElementById('icAgain').onclick=function(){
  files.forEach(function(it){URL.revokeObjectURL(it.url);});
  files=[];
  work.style.display='none';
  pick.style.display='block';
};

})();
