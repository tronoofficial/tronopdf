/* TronoPDF - Image Converter v3 | Web Worker + Cancel + Progress + JSZip */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

var JSZIP_SRC='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
var jszipP=null;
function loadJSZip(){
 if(jszipP){return jszipP;}
 jszipP=new Promise(function(res,rej){
  var s=document.createElement('script');s.src=JSZIP_SRC;
  s.onload=function(){res(window.JSZip);};
  s.onerror=function(){rej(new Error('JSZip load fail'));};
  document.head.appendChild(s);
 });
 return jszipP;
}

/* Web Worker for image conversion */
var workerCode = `
function drawHQ(img, tw, th) {
  var canvas = new OffscreenCanvas(tw, th);
  var x = canvas.getContext('2d');
  x.imageSmoothingEnabled = true;
  x.imageSmoothingQuality = 'high';
  
  /* Progressive downscale for sharpness */
  if (tw < img.width * 0.5 || th < img.height * 0.5) {
    var temp = new OffscreenCanvas(img.width, img.height);
    var tctx = temp.getContext('2d');
    tctx.drawImage(img, 0, 0);
    var sw = img.width, sh = img.height;
    
    while (sw * 0.5 > tw && sh * 0.5 > th) {
      var nw = Math.max(tw, Math.floor(sw * 0.5));
      var nh = Math.max(th, Math.floor(sh * 0.5));
      var c2 = new OffscreenCanvas(nw, nh);
      var x2 = c2.getContext('2d');
      x2.imageSmoothingEnabled = true;
      x2.imageSmoothingQuality = 'high';
      x2.drawImage(temp, 0, 0, sw, sh, 0, 0, nw, nh);
      temp = c2;
      sw = nw;
      sh = nh;
    }
    x.drawImage(temp, 0, 0, sw, sh, 0, 0, tw, th);
  } else {
    x.drawImage(img, 0, 0, tw, th);
  }
  return canvas;
}

function canvasToBmpBlob(c) {
  var ctx = c.getContext('2d');
  var w = c.width, h = c.height;
  var p = ctx.getImageData(0, 0, w, h).data;
  var rowSize = Math.ceil((w * 3) / 4) * 4;
  var fileSize = 54 + rowSize * h;
  var buf = new ArrayBuffer(fileSize);
  var v = new DataView(buf);
  
  v.setUint8(0, 0x42); v.setUint8(1, 0x4D);
  v.setUint32(2, fileSize, true); v.setUint32(10, 54, true);
  v.setUint32(14, 40, true); v.setInt32(18, w, true); v.setInt32(22, -h, true);
  v.setUint16(26, 1, true); v.setUint16(28, 24, true); v.setUint32(34, 0, true);
  
  var off = 54;
  for (var y = 0; y < h; y++) {
    for (var xx = 0; xx < w; xx++) {
      var i = (y * w + xx) * 4;
      v.setUint8(off++, p[i + 2]);
      v.setUint8(off++, p[i + 1]);
      v.setUint8(off++, p[i]);
    }
    while ((off - 54) % rowSize) { v.setUint8(off++, 0); }
  }
  return new Blob([buf], {type: 'image/bmp'});
}

function convertOne(blob, fmt, q, bg, resize, w, h, progressCb) {
  return createImageBitmap(blob).then(function(img) {
    var tw = w || img.width;
    var th = h || img.height;
    if (resize && w && !h) { th = Math.max(1, Math.round(img.height * w / img.width)); }
    if (resize && !w && h) { tw = Math.max(1, Math.round(img.width * h / img.height)); }
    
    var c = drawHQ(img, tw, th);
    var x = c.getContext('2d');
    var realFmt = fmt;
    var mime = 'image/jpeg';
    
    if (fmt === 'jpg') {
      x.globalCompositeOperation = 'destination-over';
      x.fillStyle = bg;
      x.fillRect(0, 0, tw, th);
      mime = 'image/jpeg';
    } else if (fmt === 'png') {
      mime = 'image/png';
    } else if (fmt === 'webp') {
      mime = 'image/webp';
    } else if (fmt === 'bmp') {
      x.globalCompositeOperation = 'destination-over';
      x.fillStyle = bg;
      x.fillRect(0, 0, tw, th);
      var bmpBlob = canvasToBmpBlob(c);
      img.close();
      return {blob: bmpBlob, fmt: 'bmp', w: tw, h: th, bytes: bmpBlob.size};
    }
    
    if (progressCb) progressCb(0.5);
    
    return c.convertToBlob({type: mime, quality: q / 100}).then(function(b) {
      /* WebP fallback: if browser returns different type, use PNG */
      if (fmt === 'webp' && b.type !== 'image/webp') {
        realFmt = 'png';
      }
      img.close();
      return {blob: b, fmt: realFmt, w: tw, h: th, bytes: b.size};
    });
  });
}

self.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'convert') {
    var images = data.images;
    var opts = data.opts;
    var total = images.length;
    var results = [];
    var chain = Promise.resolve();
    
    images.forEach(function(imgData, idx) {
      chain = chain.then(function() {
        var basePercent = ((idx) / total) * 90;
        self.postMessage({
          type: 'progress',
          percent: basePercent,
          msg: 'Converting image ' + (idx + 1) + ' of ' + total
        });
        
        return convertOne(
          imgData.blob, opts.fmt, opts.q, opts.bg,
          opts.resize, opts.w, opts.h,
          function(p) {
            self.postMessage({
              type: 'progress',
              percent: basePercent + (p / total) * 90,
              msg: 'Converting image ' + (idx + 1) + ' of ' + total
            });
          }
        ).then(function(result) {
          return result.blob.arrayBuffer().then(function(ab) {
            results.push({
              index: idx,
              name: imgData.name,
              buffer: ab,
              fmt: result.fmt,
              w: result.w,
              h: result.h,
              bytes: result.bytes,
              error: false
            });
            return ab;
          });
        }).catch(function(err) {
          results.push({index: idx, name: imgData.name, error: true, msg: err.message || 'Unknown error'});
        });
      });
    });
    
    chain.then(function() {
      var buffers = results.map(function(r) { return r.buffer; }).filter(Boolean);
      self.postMessage({
        type: 'complete',
        results: results
      }, buffers);
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
html+='.ic-wrap{max-width:1400px;margin:0 auto}';
html+='.ic-hero{text-align:center;padding:50px 16px 40px}';
html+='.ic-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.ic-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.ic-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.ic-big:hover{transform:translateY(-2px)}';
html+='.ic-big:disabled{opacity:.5;cursor:not-allowed}';
html+='.ic-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.ic-zone{border:2px dashed transparent;border-radius:18px}';
html+='.ic-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.ic-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.ic-main{display:flex;min-height:600px}';
html+='.ic-list{flex:1;padding:40px;overflow-y:auto}';
html+='.ic-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px}';
html+='.ic-card{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:14px;text-align:center;position:relative}';
html+='.ic-card img{width:100%;height:170px;object-fit:contain;border-radius:8px;background:#f3f4f8;margin-bottom:10px}';
html+='.ic-nm{font-size:12.5px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:6px}';
html+='.ic-sizes{display:flex;justify-content:center;align-items:center;gap:8px;font-size:12px;margin-bottom:8px}';
html+='.ic-old{color:#9a9aa5;text-decoration:line-through}';
html+='.ic-new{color:#16a34a;font-weight:800}';
html+='.ic-dim{font-size:11px;color:#9a9aa5;margin-bottom:8px}';
html+='.ic-badge{position:absolute;top:8px;right:8px;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;font-size:10px;font-weight:800;padding:3px 8px;border-radius:999px}';
html+='.ic-dl{display:block;background:#7c3aed;color:#fff;font-weight:700;font-size:13px;padding:11px;border-radius:8px}';
html+='.ic-dl:hover{background:#6d28d9}';
html+='.ic-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.ic-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:6px}';
html+='.ic-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:16px}';
html+='.ic-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}';
html+='.ic-row{display:flex;gap:10px;align-items:center}';
html+='.ic-row input[type=range]{flex:1;accent-color:#7c3aed}';
html+='.ic-row input[type=number]{flex:1;padding:10px;border:1px solid #ddd;border-radius:10px;font-size:14px;min-width:0}';
html+='.ic-row input[type=color]{width:40px;height:34px;border:1px solid #ddd;border-radius:8px;padding:2px;background:#fff;cursor:pointer}';
html+='.ic-chk{display:flex;gap:8px;align-items:center;margin:8px 0}';
html+='.ic-chk input{width:16px;height:16px;accent-color:#7c3aed}';
html+='.ic-chk label{font-size:13px;font-weight:600;cursor:pointer}';
html+='.ic-fmtgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:8px}';
html+='.ic-fmt{border:2px solid #eceaf6;border-radius:10px;padding:10px;font-size:12px;font-weight:800;text-align:center;cursor:pointer;background:#fff;color:#4b4b5a}';
html+='.ic-fmt.active{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}';
html+='.ic-note{font-size:11px;color:#9a9aa5;margin-top:4px}';
html+='.ic-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:16px}';
html+='.ic-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.ic-zip{display:none;background:#16a34a;color:#fff;font-weight:800;font-size:15px;padding:14px;border-radius:12px;text-align:center;margin-top:12px;box-shadow:0 12px 28px rgba(22,163,74,.3);text-decoration:none}';
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
html+='<div id="icPick"><div class="ic-hero"><h1>Image Converter</h1><p>Convert JPG, PNG, WEBP and BMP - high quality, batch, 100% private.</p>';
html+='<div class="ic-zone" id="icZone"><button class="ic-big" id="icBtn" type="button">Select Images</button><p class="ic-drop-hint">or drop images here (multiple supported)</p></div></div></div>';
html+='<div class="ic-work" id="icWork"><div class="ic-main"><div class="ic-list"><div class="ic-grid" id="icGrid"></div></div>';
html+='<aside class="ic-side"><h2>Conversion settings</h2><p class="ic-sub">Pick output format → convert → download</p>';
html+='<div class="ic-lbl">Output format</div><div class="ic-fmtgrid">';
html+='<div class="ic-fmt active" data-fmt="jpg">JPG</div>';
html+='<div class="ic-fmt" data-fmt="png">PNG</div>';
html+='<div class="ic-fmt" data-fmt="webp">WEBP</div>';
html+='<div class="ic-fmt" data-fmt="bmp">BMP</div>';
html+='</div>';
html+='<div class="ic-lbl">Quality: <span id="icQVal">92</span>%</div><div class="ic-row"><input type="range" id="icQ" min="10" max="100" value="92"/></div>';
html+='<div class="ic-note">Quality applies to JPG & WEBP. PNG & BMP are lossless.</div>';
html+='<div class="ic-lbl">Background (for JPG/BMP)</div><div class="ic-row"><input type="color" id="icBg" value="#ffffff"/><span style="font-size:12px;color:#9a9aa5">Transparent areas become this color</span></div>';
html+='<div class="ic-chk"><input type="checkbox" id="icResize"/><label for="icResize">Resize images</label></div>';
html+='<div id="icResizeBox" style="display:none"><div class="ic-row"><input type="number" id="icW" min="10" placeholder="Width"/><span style="color:#9a9aa5;font-size:13px">×</span><input type="number" id="icH" min="10" placeholder="Height"/></div>';
html+='<div class="ic-chk" style="margin-top:6px"><input type="checkbox" id="icLock" checked/><label for="icLock">Keep aspect ratio</label></div></div>';
html+='<button class="ic-go" id="icGo" type="button">Convert Images →</button>';
html+='<a class="ic-zip" id="icZip" href="#">⬇ Download all as ZIP</a>';
html+='<button class="ic-again" id="icAgain" type="button">Convert more images</button></aside></div></div>';
html+='<div class="ic-busy" id="icBusy"><h2>Converting images...</h2><p class="st" id="icStatus">Working...</p><div class="ic-bar"><div id="icBarFill"></div></div><div class="ic-pct" id="icPct">0%</div><button class="ic-cancel" id="icCancel" type="button">✕ Cancel</button></div>';
html+='<input type="file" id="icFile" accept="image/*,.jpg,.jpeg,.png,.webp,.bmp" multiple style="display:none"/>';
html+='</div>';
root.innerHTML=html;

var files=[];var outFmt='jpg';var ratio=1;
var cancelRequested=false;

var pick=document.getElementById('icPick'),work=document.getElementById('icWork'),busy=document.getElementById('icBusy');
var zone=document.getElementById('icZone'),btn=document.getElementById('icBtn'),inp=document.getElementById('icFile'),grid=document.getElementById('icGrid');
var go=document.getElementById('icGo'),zipEl=document.getElementById('icZip');
var elQ=document.getElementById('icQ'),elW=document.getElementById('icW'),elH=document.getElementById('icH'),elLock=document.getElementById('icLock');
var elResize=document.getElementById('icResize'),elResizeBox=document.getElementById('icResizeBox'),elBg=document.getElementById('icBg');
var cancelBtn=document.getElementById('icCancel');
var statusEl=document.getElementById('icStatus');

/* Worker message handler */
worker.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'progress') {
    document.getElementById('icPct').textContent = Math.round(data.percent) + '%';
    document.getElementById('icBarFill').style.width = data.percent + '%';
    statusEl.textContent = data.msg || 'Processing...';
  } else if (data.type === 'complete') {
    document.getElementById('icPct').textContent = '100%';
    document.getElementById('icBarFill').style.width = '100%';
    statusEl.textContent = 'Complete!';
    
    /* Apply results to files */
    data.results.forEach(function(r) {
      if (r.index < files.length) {
        if (r.error) {
          files[r.index].error = true;
        } else {
          var blob = new Blob([r.buffer], {type: 'image/' + r.fmt});
          var dataURL = URL.createObjectURL(blob);
          files[r.index].result = {
            dataURL: dataURL,
            blob: blob,
            fmt: r.fmt,
            w: r.w,
            h: r.h,
            bytes: r.bytes
          };
        }
      }
    });
    
    setTimeout(function() {
      busy.style.display = 'none';
      work.style.display = 'block';
      go.disabled = false;
      render();
      
      /* Auto-build ZIP if multiple images */
      var ok = files.filter(function(f) { return f.result; });
      if (ok.length > 1) {
        loadJSZip().then(function(JSZip) {
          var zip = new JSZip();
          ok.forEach(function(f) {
            var name = f.f.name.replace(/\.[^.]+$/, '') + '.' + f.result.fmt;
            zip.file(name, f.result.blob);
          });
          zip.generateAsync({type: 'blob'}).then(function(blob) {
            zipEl.href = URL.createObjectURL(blob);
            zipEl.download = 'tronopdf-converted.zip';
            zipEl.style.display = 'block';
          });
        }).catch(function() {
          /* JSZip failed, ZIP button stays hidden */
        });
      }
    }, 300);
  }
};

elQ.oninput=function(){document.getElementById('icQVal').textContent=this.value;};
elResize.onchange=function(){elResizeBox.style.display=this.checked?'block':'none';};
elW.oninput=function(){if(elLock.checked&&ratio){elH.value=Math.max(10,Math.round(this.value/ratio));}};
elH.oninput=function(){if(elLock.checked&&ratio){elW.value=Math.max(10,Math.round(this.value*ratio));}};

var fmtBtns=document.querySelectorAll('.ic-fmt');
for(var fi=0;fi<fmtBtns.length;fi++){
 fmtBtns[fi].onclick=function(){
  for(var j=0;j<fmtBtns.length;j++){fmtBtns[j].classList.remove('active');}
  this.classList.add('active');
  outFmt=this.getAttribute('data-fmt');
 };
}

function addFiles(fl){
 var added=0;
 for(var i=0;i<fl.length;i++){
  var f=fl[i];
  if(f.type.indexOf('image/')===0||/\.(jpg|jpeg|png|webp|bmp)$/i.test(f.name)){
   files.push({f:f,url:URL.createObjectURL(f),result:null,error:false});added++;
  }
 }
 if(!added){alert('Please select image files.');return;}
 if(files.length===1){
  var im=new Image();
  im.onload=function(){ratio=im.width/im.height;elW.value=im.width;elH.value=im.height;};
  im.src=files[0].url;
 }
 pick.style.display='none';work.style.display='block';
 render();
}

function render(){
 grid.innerHTML='';
 files.forEach(function(it){
  var c=document.createElement('div');c.className='ic-card';
  var imgSrc = it.result ? it.result.dataURL : it.url;
  var body='<img src="'+imgSrc+'" alt=""/><div class="ic-nm">'+it.f.name+'</div>';
  if(it.error){
   body+='<div class="ic-sizes" style="color:#dc2626;font-weight:700">Could not convert</div>';
  }else if(it.result){
   body+='<div class="ic-badge">'+it.result.fmt.toUpperCase()+'</div>';
   body+='<div class="ic-sizes"><span class="ic-old">'+fmtB(it.f.size)+'</span><span>→</span><span class="ic-new">'+fmtB(it.result.bytes)+'</span></div>';
   body+='<div class="ic-dim">'+it.result.w+'×'+it.result.h+' px</div>';
   body+='<a class="ic-dl" href="'+it.result.dataURL+'" download="'+it.f.name.replace(/\.[^.]+$/,'')+'.'+it.result.fmt+'">⬇ Download</a>';
  }else{
   body+='<div class="ic-sizes">'+fmtB(it.f.size)+'</div><div style="text-align:center;color:#9a9aa5;font-size:12px">Ready to convert</div>';
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
 
 var q=parseInt(elQ.value)||92;
 var bg=elBg.value||'#ffffff';
 var resize=elResize.checked;
 var w=resize?parseInt(elW.value)||0:0;
 var h=resize?parseInt(elH.value)||0:0;
 
 zipEl.style.display='none';
 files.forEach(function(it){
  if(it.result){URL.revokeObjectURL(it.result.dataURL);}
  it.result=null;it.error=false;
 });
 render();
 
 work.style.display='none';
 busy.style.display='block';
 document.getElementById('icPct').textContent='0%';
 document.getElementById('icBarFill').style.width='0%';
 statusEl.textContent='Preparing images...';
 cancelRequested=false;
 go.disabled=true;
 
 /* Read all files and send to worker */
 var readPromises = files.map(function(it) {
  return it.f.arrayBuffer().then(function(buf) {
   return {
    blob: new Blob([buf], {type: it.f.type || 'image/jpeg'}),
    name: it.f.name
   };
  });
 });
 
 Promise.all(readPromises).then(function(imageData) {
  if(cancelRequested){
   busy.style.display='none';
   work.style.display='block';
   go.disabled=false;
   return;
  }
  
  worker.postMessage({
   type: 'convert',
   images: imageData,
   opts: {
    fmt: outFmt,
    q: q,
    bg: bg,
    resize: resize,
    w: w,
    h: h
   }
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
   document.getElementById('icPct').textContent = Math.round(data.percent) + '%';
   document.getElementById('icBarFill').style.width = data.percent + '%';
   statusEl.textContent = data.msg || 'Processing...';
  } else if (data.type === 'complete') {
   document.getElementById('icPct').textContent = '100%';
   document.getElementById('icBarFill').style.width = '100%';
   statusEl.textContent = 'Complete!';
   data.results.forEach(function(r) {
    if (r.index < files.length) {
     if (r.error) {
      files[r.index].error = true;
     } else {
      var blob = new Blob([r.buffer], {type: 'image/' + r.fmt});
      var dataURL = URL.createObjectURL(blob);
      files[r.index].result = {
       dataURL: dataURL, blob: blob, fmt: r.fmt,
       w: r.w, h: r.h, bytes: r.bytes
      };
     }
    }
   });
   setTimeout(function() {
    busy.style.display = 'none';
    work.style.display = 'block';
    go.disabled = false;
    render();
    var ok = files.filter(function(f) { return f.result; });
    if (ok.length > 1) {
     loadJSZip().then(function(JSZip) {
      var zip = new JSZip();
      ok.forEach(function(f) {
       zip.file(f.f.name.replace(/\.[^.]+$/, '') + '.' + f.result.fmt, f.result.blob);
      });
      zip.generateAsync({type: 'blob'}).then(function(blob) {
       zipEl.href = URL.createObjectURL(blob);
       zipEl.download = 'tronopdf-converted.zip';
       zipEl.style.display = 'block';
      });
     }).catch(function(){});
    }
   }, 300);
  }
 };
 
 busy.style.display='none';
 work.style.display='block';
 go.disabled=false;
 render();
};

document.getElementById('icAgain').onclick=function(){
 files.forEach(function(it){
  URL.revokeObjectURL(it.url);
  if(it.result){URL.revokeObjectURL(it.result.dataURL);}
 });
 files=[];zipEl.style.display='none';
 work.style.display='none';pick.style.display='block';
};

})();
