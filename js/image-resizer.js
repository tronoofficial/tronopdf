/* TronoPDF - Image Resizer v3 | Web Worker + Cancel + Progress */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

/* Web Worker for image resizing */
var workerCode = `
function resizeOne(blob, opts) {
  return createImageBitmap(blob).then(function(bitmap) {
    var w = opts.w, h = opts.h;
    
    /* Use OffscreenCanvas for background work */
    var canvas = new OffscreenCanvas(w, h);
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    /* Fill background for JPG */
    if (opts.fmt === 'jpg') {
      ctx.fillStyle = opts.bg;
      ctx.fillRect(0, 0, w, h);
    }
    
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    
    var mime = opts.fmt === 'png' ? 'image/png' : 'image/jpeg';
    var quality = Math.min(1, opts.q / 100);
    
    return canvas.convertToBlob({type: mime, quality: quality}).then(function(b) {
      return b.arrayBuffer().then(function(ab) {
        var bytes = new Uint8Array(ab);
        var binary = '';
        var chunkSize = 8192;
        for (var i = 0; i < bytes.length; i += chunkSize) {
          var chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
          binary += String.fromCharCode.apply(null, chunk);
        }
        var dataURL = 'data:' + mime + ';base64,' + btoa(binary);
        return {
          dataURL: dataURL,
          bytes: b.size,
          w: w,
          h: h
        };
      });
    });
  });
}

self.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'resize') {
    var images = data.images;
    var opts = data.options;
    var total = images.length;
    var results = [];
    var chain = Promise.resolve();
    
    images.forEach(function(imgData, idx) {
      chain = chain.then(function() {
        var percent = ((idx + 1) / total) * 95;
        self.postMessage({
          type: 'progress',
          percent: percent,
          msg: 'Resizing image ' + (idx + 1) + ' of ' + total
        });
        
        return resizeOne(imgData.blob, opts).then(function(result) {
          results.push({index: idx, result: result, error: false});
        }).catch(function(err) {
          results.push({index: idx, result: null, error: true});
        });
      });
    });
    
    chain.then(function() {
      self.postMessage({type: 'progress', percent: 100, msg: 'Complete!'});
      self.postMessage({
        type: 'complete',
        results: results
      });
    });
  }
};
`;

/* Create Worker */
var blob = new Blob([workerCode], {type: 'application/javascript'});
var workerUrl = URL.createObjectURL(blob);
var worker = new Worker(workerUrl);

function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}

var PRESETS={
  '':[0,0],
  'passport35':[413,531],
  'passport2':[600,600],
  'hd':[1280,720],
  'fhd':[1920,1080],
  'square':[1080,1080],
  'a4':[2480,3508]
};

var html='';
html+='<style>';
html+='.ir-wrap{max-width:1400px;margin:0 auto}';
html+='.ir-hero{text-align:center;padding:50px 16px 40px}';
html+='.ir-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.ir-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.ir-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.ir-big:hover{transform:translateY(-2px)}';
html+='.ir-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.ir-zone{border:2px dashed transparent;border-radius:18px}';
html+='.ir-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.ir-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.ir-main{display:flex;min-height:600px}';
html+='.ir-list{flex:1;padding:40px;overflow-y:auto}';
html+='.ir-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px}';
html+='.ir-card{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:14px;text-align:center;position:relative}';
html+='.ir-card img{width:100%;height:180px;object-fit:contain;border-radius:8px;background:#f3f4f8;margin-bottom:10px}';
html+='.ir-nm{font-size:12.5px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:6px}';
html+='.ir-dims{display:flex;justify-content:center;align-items:center;gap:8px;font-size:12px;margin-bottom:10px}';
html+='.ir-old{color:#9a9aa5;text-decoration:line-through}';
html+='.ir-new{color:#16a34a;font-weight:800}';
html+='.ir-badge{position:absolute;top:8px;right:8px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:10px;font-weight:800;padding:3px 8px;border-radius:999px}';
html+='.ir-dl{display:block;background:#7c3aed;color:#fff;font-weight:700;font-size:13px;padding:11px;border-radius:8px}';
html+='.ir-dl:hover{background:#6d28d9}';
html+='.ir-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:28px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.ir-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:6px}';
html+='.ir-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:18px}';
html+='.ir-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}';
html+='.ir-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;font-family:inherit;background:#fff}';
html+='.ir-row{display:flex;gap:10px;align-items:center}';
html+='.ir-row input[type=number]{flex:1;padding:11px;border:1px solid #ddd;border-radius:10px;font-size:14px;min-width:0}';
html+='.ir-row select{padding:11px;border:1px solid #ddd;border-radius:10px;font-size:14px;background:#fff}';
html+='.ir-lock{display:flex;align-items:center;gap:8px;margin-top:8px}';
html+='.ir-lock input{width:16px;height:16px;accent-color:#7c3aed}';
html+='.ir-lock label{font-size:13px;font-weight:600;cursor:pointer}';
html+='.ir-3{display:flex;gap:10px}';
html+='.ir-3>div{flex:1}';
html+='.ir-bg{display:flex;gap:10px}';
html+='.ir-bg button{width:40px;height:40px;border-radius:50%;border:3px solid #eceaf6;cursor:pointer;transition:.2s}';
html+='.ir-bg button.active{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,.2)}';
html+='.ir-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:18px}';
html+='.ir-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.ir-again{width:100%;background:#f4f5fa;color:#333;font-weight:700;font-size:13px;padding:12px;border-radius:10px;border:none;cursor:pointer;margin-top:10px}';
html+='.ir-busy{display:none;padding:60px 20px;text-align:center}';
html+='.ir-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.ir-busy .st{color:#7a7a85;font-size:15px;margin-bottom:10px;min-height:20px}';
html+='.ir-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.ir-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .3s}';
html+='.ir-pct{font-size:36px;font-weight:900}';
html+='.ir-cancel{margin-top:16px;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;border:none;cursor:pointer}';
html+='.ir-cancel:hover{background:#e6e8f5}';
html+='@media(max-width:900px){.ir-main{flex-direction:column}.ir-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="ir-wrap">';
html+='<div id="irPick"><div class="ir-hero"><h1>Resize an Image</h1><p>Choose a new size and format - done in one click. Free, private and unlimited.</p>';
html+='<div class="ir-zone" id="irZone"><button class="ir-big" id="irBtn" type="button">Select Image</button><p class="ir-drop-hint">or drop images here</p></div></div></div>';
html+='<div class="ir-work" id="irWork"><div class="ir-main"><div class="ir-list"><div class="ir-grid" id="irGrid"></div></div>';
html+='<aside class="ir-side"><h2>Choose new size & format</h2><p class="ir-sub">Simple settings - works instantly</p>';
html+='<div class="ir-lbl">Quick preset (optional)</div><select class="ir-inp" id="irPreset"><option value="">Custom size</option><option value="passport35">Passport 35×45 mm</option><option value="passport2">Passport 2×2 inch</option><option value="hd">HD 1280×720</option><option value="fhd">Full HD 1920×1080</option><option value="square">Square 1080×1080</option><option value="a4">A4 @300 DPI</option></select>';
html+='<div class="ir-lbl">Width & Height</div><div class="ir-row"><input type="number" id="irW" min="1" placeholder="Width"/><span style="color:#9a9aa5;font-size:13px">×</span><input type="number" id="irH" min="1" placeholder="Height"/><select id="irUnit"><option value="px">Pixels</option><option value="pct">Percent</option><option value="cm">cm</option><option value="in">Inches</option></select></div>';
html+='<div class="ir-lock"><input type="checkbox" id="irLock" checked><label for="irLock">🔒 Lock aspect ratio (no stretching)</label></div>';
html+='<div class="ir-3"><div><div class="ir-lbl">Resolution</div><div class="ir-row"><input type="number" id="irDpi" min="72" max="600" value="300"/></div></div><div><div class="ir-lbl">Format</div><select class="ir-inp" id="irFmt"><option value="jpg">JPG</option><option value="png">PNG</option></select></div><div><div class="ir-lbl">Quality %</div><div class="ir-row"><input type="number" id="irQ" min="10" max="100" value="90"/></div></div></div>';
html+='<div class="ir-lbl">Background (for JPG)</div><div class="ir-bg"><button id="irBgW" class="active" style="background:#fff" type="button" title="White"></button><button id="irBgB" style="background:#000" type="button" title="Black"></button></div>';
html+='<button class="ir-go" id="irGo" type="button">Resize Image →</button>';
html+='<button class="ir-again" id="irAgain" type="button">Resize more images</button></aside></div></div>';
html+='<div class="ir-busy" id="irBusy"><h2>Resizing images...</h2><p class="st" id="irStatus">Working...</p><div class="ir-bar"><div id="irBarFill"></div></div><div class="ir-pct" id="irPct">0%</div><button class="ir-cancel" id="irCancel" type="button">✕ Cancel</button></div>';
html+='<input type="file" id="irFile" accept="image/*,.jpg,.jpeg,.png,.webp" multiple style="display:none">';
html+='</div>';
root.innerHTML=html;

var files=[];var ratio=1;var firstW=0,firstH=0;var bg='#ffffff';
var cancelRequested=false;

var pick=document.getElementById('irPick'),work=document.getElementById('irWork'),busy=document.getElementById('irBusy');
var zone=document.getElementById('irZone'),btn=document.getElementById('irBtn'),inp=document.getElementById('irFile'),grid=document.getElementById('irGrid');
var go=document.getElementById('irGo');
var cancelBtn=document.getElementById('irCancel');
var statusEl=document.getElementById('irStatus');
var elW=document.getElementById('irW'),elH=document.getElementById('irH'),elUnit=document.getElementById('irUnit'),elLock=document.getElementById('irLock');
var elDpi=document.getElementById('irDpi'),elFmt=document.getElementById('irFmt'),elQ=document.getElementById('irQ'),elPreset=document.getElementById('irPreset');

/* Worker message handler */
worker.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'progress') {
    document.getElementById('irPct').textContent = Math.round(data.percent) + '%';
    document.getElementById('irBarFill').style.width = data.percent + '%';
    statusEl.textContent = data.msg || 'Processing...';
  } else if (data.type === 'complete') {
    document.getElementById('irPct').textContent = '100%';
    document.getElementById('irBarFill').style.width = '100%';
    statusEl.textContent = 'Complete!';
    
    /* Apply results to files */
    data.results.forEach(function(r) {
      if (r.index < files.length) {
        if (r.error) {
          files[r.index].error = true;
        } else {
          files[r.index].result = r.result;
          files[r.index].nw = r.result.w;
          files[r.index].nh = r.result.h;
        }
      }
    });
    
    setTimeout(function() {
      busy.style.display = 'none';
      work.style.display = 'block';
      go.disabled = false;
      render();
    }, 300);
  }
};

document.getElementById('irBgW').onclick=function(){bg='#ffffff';this.classList.add('active');document.getElementById('irBgB').classList.remove('active');};
document.getElementById('irBgB').onclick=function(){bg='#000000';this.classList.add('active');document.getElementById('irBgW').classList.remove('active');};

function fillInputs(){
  var u=elUnit.value;var dpi=parseInt(elDpi.value)||300;
  if(!firstW){return;}
  if(u==='px'){elW.value=firstW;elH.value=firstH;}
  else if(u==='pct'){elW.value=100;elH.value=100;}
  else if(u==='cm'){elW.value=(firstW/dpi*2.54).toFixed(1);elH.value=(firstH/dpi*2.54).toFixed(1);}
  else{elW.value=(firstW/dpi).toFixed(2);elH.value=(firstH/dpi).toFixed(2);}
}

elUnit.onchange=fillInputs;

elPreset.onchange=function(){
  var p=PRESETS[this.value];
  if(p&&p[0]){elUnit.value='px';elW.value=p[0];elH.value=p[1];}
};

elW.oninput=function(){if(elLock.checked&&ratio){elH.value=+(this.value/ratio).toFixed(2);}};
elH.oninput=function(){if(elLock.checked&&ratio){elW.value=+(this.value*ratio).toFixed(2);}};

function addFiles(fl){
  var added=0;
  for(var i=0;i<fl.length;i++){
    var f=fl[i];
    if(f.type.indexOf('image/')===0||/\.(jpg|jpeg|png|webp)$/i.test(f.name)){
      files.push({f:f,url:URL.createObjectURL(f),result:null,error:false,nw:0,nh:0});
      added++;
    }
  }
  if(!added){alert('Please select image files.');return;}
  pick.style.display='none';
  work.style.display='block';
  
  if(!firstW&&files.length){
    var im=new Image();
    im.onload=function(){
      firstW=im.width;firstH=im.height;ratio=im.width/im.height;
      fillInputs();
    };
    im.src=files[0].url;
  }
  render();
}

function render(){
  grid.innerHTML='';
  files.forEach(function(it){
    var c=document.createElement('div');c.className='ir-card';
    var body='<img src="'+(it.result?it.result.dataURL:it.url)+'" alt=""><div class="ir-nm">'+it.f.name+'</div>';
    if(it.error){
      body+='<div class="ir-dims" style="color:#dc2626;font-weight:700">Could not resize this image</div>';
    }else if(it.result){
      body+='<div class="ir-badge">'+it.nw+'×'+it.nh+'</div><div class="ir-dims"><span class="ir-old">'+fmtB(it.f.size)+'</span><span>→</span><span class="ir-new">'+fmtB(it.result.bytes)+'</span></div><a class="ir-dl" href="'+it.result.dataURL+'" download="resized-'+it.f.name.replace(/\.[^.]+$/,'')+'.'+elFmt.value+'">⬇ Download</a>';
    }else{
      body+='<div class="ir-dims">'+fmtB(it.f.size)+'</div><div style="text-align:center;color:#9a9aa5;font-size:12px">Ready to resize</div>';
    }
    c.innerHTML=body;
    grid.appendChild(c);
  });
  go.disabled=files.length<1;
}

function targetDims(origW,origH){
  var u=elUnit.value;var dpi=parseInt(elDpi.value)||300;
  var w=parseFloat(elW.value)||0,h=parseFloat(elH.value)||0;
  if(u==='pct'){return [Math.max(1,Math.round(origW*w/100)),Math.max(1,Math.round(origH*h/100))];}
  if(u==='cm'){return [Math.max(1,Math.round(w/2.54*dpi)),Math.max(1,Math.round(h/2.54*dpi))];}
  if(u==='in'){return [Math.max(1,Math.round(w*dpi)),Math.max(1,Math.round(h*dpi))];}
  return [Math.max(1,Math.round(w)),Math.max(1,Math.round(h))];
}

btn.onclick=function(){inp.click();};

inp.onchange=function(){addFiles(inp.files);inp.value='';};

zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');addFiles(e.dataTransfer.files);};

go.onclick=function(){
  if(files.length<1){return;}
  
  files.forEach(function(it){it.result=null;it.error=false;});
  
  work.style.display='none';
  busy.style.display='block';
  document.getElementById('irPct').textContent='0%';
  document.getElementById('irBarFill').style.width='0%';
  statusEl.textContent='Preparing images...';
  cancelRequested=false;
  go.disabled=true;
  
  /* We need to get original dimensions for each image to calculate target dims */
  var prepPromises = files.map(function(it) {
    return new Promise(function(resolve) {
      var img = new Image();
      img.onload = function() {
        var dims = targetDims(img.width, img.height);
        resolve({
          blob: it.f,
          w: dims[0],
          h: dims[1]
        });
      };
      img.onerror = function() {
        resolve(null);
      };
      img.src = it.url;
    });
  });
  
  Promise.all(prepPromises).then(function(imageData) {
    if(cancelRequested){
      busy.style.display='none';
      work.style.display='block';
      go.disabled=false;
      return;
    }
    
    /* Filter out failed loads */
    var validData = [];
    var validIndices = [];
    imageData.forEach(function(d, i) {
      if (d) {
        validData.push(d);
        validIndices.push(i);
      } else {
        files[i].error = true;
      }
    });
    
    /* Use first image's dimensions as options (all use same settings) */
    var opts = {
      w: validData[0] ? validData[0].w : 100,
      h: validData[0] ? validData[0].h : 100,
      fmt: elFmt.value,
      q: parseInt(elQ.value) || 90,
      bg: bg
    };
    
    /* Send each image with its own dimensions */
    var chain = Promise.resolve();
    var results = [];
    
    validData.forEach(function(imgData, idx) {
      chain = chain.then(function() {
        if (cancelRequested) return;
        
        var percent = ((idx + 1) / validData.length) * 95;
        document.getElementById('irPct').textContent = Math.round(percent) + '%';
        document.getElementById('irBarFill').style.width = percent + '%';
        statusEl.textContent = 'Resizing image ' + (idx + 1) + ' of ' + validData.length;
        
        return new Promise(function(resolve) {
          var tempWorker = new Worker(workerUrl);
          tempWorker.onmessage = function(e) {
            if (e.data.type === 'complete') {
              if (e.data.results && e.data.results[0]) {
                results.push({
                  origIndex: validIndices[idx],
                  result: e.data.results[0].result
                });
              }
              tempWorker.terminate();
              resolve();
            }
          };
          tempWorker.onerror = function() {
            tempWorker.terminate();
            resolve();
          };
          tempWorker.postMessage({
            type: 'resize',
            images: [{blob: imgData.blob}],
            options: {
              w: imgData.w,
              h: imgData.h,
              fmt: opts.fmt,
              q: opts.q,
              bg: opts.bg
            }
          });
        });
      });
    });
    
    chain.then(function() {
      if (cancelRequested) return;
      
      results.forEach(function(r) {
        if (r.origIndex < files.length && r.result) {
          files[r.origIndex].result = r.result;
          files[r.origIndex].nw = r.result.w;
          files[r.origIndex].nh = r.result.h;
        }
      });
      
      document.getElementById('irPct').textContent = '100%';
      document.getElementById('irBarFill').style.width = '100%';
      statusEl.textContent = 'Complete!';
      
      setTimeout(function() {
        busy.style.display = 'none';
        work.style.display = 'block';
        go.disabled = false;
        render();
      }, 300);
    });
  });
};

cancelBtn.onclick=function(){
  cancelRequested=true;
  statusEl.textContent='Cancelling...';
  busy.style.display='none';
  work.style.display='block';
  go.disabled=false;
  render();
};

document.getElementById('irAgain').onclick=function(){
  files.forEach(function(it){URL.revokeObjectURL(it.url);});
  files=[];firstW=0;firstH=0;
  work.style.display='none';pick.style.display='block';
};

})();
