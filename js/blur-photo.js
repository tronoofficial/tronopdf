/* TronoPDF - Blur Photo v3 | Web Worker + Debounced Preview + Progress */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

/* Web Worker for blur generation */
var workerCode = `
function blurCanvas(src, amount) {
  var w = src.width, h = src.height;
  var out = new OffscreenCanvas(w, h);
  var octx = out.getContext('2d');
  octx.imageSmoothingEnabled = true;
  octx.imageSmoothingQuality = 'high';
  
  if (amount <= 0) {
    octx.drawImage(src, 0, 0);
    return out;
  }
  
  /* Use filter API if available */
  if (typeof octx.filter === 'string') {
    var px = (amount / 100) * (Math.min(w, h) / 10);
    var over = px * 2;
    octx.save();
    octx.filter = 'blur(' + px + 'px)';
    octx.drawImage(src, -over, -over, w + over * 2, h + over * 2);
    octx.restore();
    octx.filter = 'none';
  } else {
    /* Fallback: downscale-upscale technique */
    var f = Math.max(0.02, 1 - (amount / 100) * 0.97);
    var tw = Math.max(2, Math.round(w * f));
    var th = Math.max(2, Math.round(h * f));
    var t = new OffscreenCanvas(tw, th);
    var tc = t.getContext('2d');
    tc.imageSmoothingEnabled = true;
    tc.imageSmoothingQuality = 'high';
    tc.drawImage(src, 0, 0, tw, th);
    octx.drawImage(t, 0, 0, tw, th, 0, 0, w, h);
  }
  
  return out;
}

self.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'blur') {
    self.postMessage({type: 'progress', percent: 10, msg: 'Loading image...'});
    
    createImageBitmap(data.blob).then(function(bitmap) {
      self.postMessage({type: 'progress', percent: 30, msg: 'Applying blur...'});
      
      var blurred = blurCanvas(bitmap, data.amount);
      bitmap.close();
      
      self.postMessage({type: 'progress', percent: 60, msg: 'Encoding image...'});
      
      var mime = data.fmt === 'png' ? 'image/png' : 'image/jpeg';
      return blurred.convertToBlob({type: mime, quality: 0.92}).then(function(b) {
        self.postMessage({type: 'progress', percent: 90, msg: 'Finalizing...'});
        
        return b.arrayBuffer().then(function(ab) {
          var bytes = new Uint8Array(ab);
          var binary = '';
          var chunkSize = 8192;
          for (var j = 0; j < bytes.length; j += chunkSize) {
            var chunk = bytes.subarray(j, Math.min(j + chunkSize, bytes.length));
            binary += String.fromCharCode.apply(null, chunk);
          }
          
          self.postMessage({type: 'progress', percent: 100, msg: 'Complete!'});
          self.postMessage({
            type: 'complete',
            dataURL: 'data:' + mime + ';base64,' + btoa(binary),
            bytes: b.size
          });
        });
      });
    }).catch(function(err) {
      self.postMessage({
        type: 'error',
        msg: 'Blur failed: ' + (err.message || err)
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

var html='';
html+='<style>';
html+='.bp-wrap{max-width:1400px;margin:0 auto}';
html+='.bp-hero{text-align:center;padding:50px 16px 40px}';
html+='.bp-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.bp-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.bp-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.bp-big:hover{transform:translateY(-2px)}';
html+='.bp-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.bp-zone{border:2px dashed transparent;border-radius:18px}';
html+='.bp-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.bp-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.bp-main{display:flex;min-height:640px}';
html+='.bp-prev{flex:1;padding:30px;display:flex;align-items:center;justify-content:center;overflow:auto}';
html+='.bp-canvaswrap{border-radius:8px;overflow:hidden;box-shadow:0 10px 40px rgba(30,20,60,.18);background:#fff}';
html+='.bp-canvaswrap canvas{display:block}';
html+='.bp-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.bp-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:6px}';
html+='.bp-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:20px}';
html+='.bp-lbl{font-size:13px;font-weight:800;color:#4b4b5a;margin:14px 0 8px;display:flex;justify-content:space-between}';
html+='.bp-lbl span{color:#7c3aed}';
html+='.bp-slider{width:100%;accent-color:#7c3aed;height:8px}';
html+='.bp-scale{display:flex;justify-content:space-between;font-size:11px;color:#9a9aa5;margin-top:4px}';
html+='.bp-row{display:flex;gap:8px;align-items:center;margin-top:10px}';
html+='.bp-row select{flex:1;padding:11px;border:1px solid #ddd;border-radius:10px;font-size:14px;background:#fff}';
html+='.bp-dims{background:#ede9fe;border-radius:10px;padding:10px 14px;font-size:13px;color:#5b21b6;font-weight:700;text-align:center;margin-top:12px}';
html+='.bp-dl{display:block;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;font-weight:800;font-size:17px;padding:16px;border-radius:12px;text-align:center;cursor:pointer;border:none;box-shadow:0 12px 28px rgba(22,163,74,.3);margin-top:16px}';
html+='.bp-dl:disabled{opacity:.5;cursor:not-allowed}';
html+='.bp-again{width:100%;background:#f4f5fa;color:#333;font-weight:700;font-size:13px;padding:12px;border-radius:10px;border:none;cursor:pointer;margin-top:10px}';
html+='.bp-busy{display:none;text-align:center;padding:60px 20px}';
html+='.bp-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.bp-busy .st{color:#7a7a85;font-size:15px;margin-bottom:10px;min-height:20px}';
html+='.bp-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.bp-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .3s}';
html+='.bp-pct{font-size:36px;font-weight:900}';
html+='.bp-cancel{margin-top:16px;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;border:none;cursor:pointer}';
html+='.bp-cancel:hover{background:#e6e8f5}';
html+='@media(max-width:900px){.bp-main{flex-direction:column}.bp-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="bp-wrap">';
html+='<div id="bpPick"><div class="bp-hero"><h1>Blur Photo</h1><p>Smoothly blur your photo with a simple slider - fast, free and private.</p>';
html+='<div class="bp-zone" id="bpZone"><button class="bp-big" id="bpBtn" type="button">Select Image</button><p class="bp-drop-hint">or drop an image here</p></div></div></div>';
html+='<div class="bp-work" id="bpWork"><div class="bp-main"><div class="bp-prev"><div class="bp-canvaswrap"><canvas id="bpCanvas"></canvas></div></div>';
html+='<aside class="bp-side"><h2>Blur settings</h2><p class="bp-sub">Move the slider - preview updates live</p>';
html+='<div class="bp-lbl">Blur strength <span id="bpVal">0%</span></div>';
html+='<input class="bp-slider" type="range" id="bpSlider" min="0" max="100" value="0"/>';
html+='<div class="bp-scale"><span>0%</span><span>50%</span><span>100%</span></div>';
html+='<div class="bp-lbl" style="margin-top:18px">Output format</div><div class="bp-row"><select id="bpFmt"><option value="jpg">JPG (smaller)</option><option value="png">PNG (lossless)</option></select></div>';
html+='<div class="bp-dims" id="bpDims">—</div>';
html+='<button class="bp-dl" id="bpDl" type="button">⬇ Download Blurred Photo</button>';
html+='<button class="bp-again" id="bpAgain" type="button">Upload a different image</button></aside></div></div>';
html+='<div class="bp-busy" id="bpBusy"><h2>Generating blurred photo...</h2><p class="st" id="bpStatus">Working...</p><div class="bp-bar"><div id="bpBarFill"></div></div><div class="bp-pct" id="bpPct">0%</div><button class="bp-cancel" id="bpCancel" type="button">✕ Cancel</button></div>';
html+='<input type="file" id="bpFile" accept="image/*,.jpg,.jpeg,.png,.webp" style="display:none"/>';
html+='</div>';
root.innerHTML=html;

var base=null,blurAmt=0,scale=1;
var file=null;
var cancelRequested=false;
var renderTimer=null;

var pick=document.getElementById('bpPick'),work=document.getElementById('bpWork'),busy=document.getElementById('bpBusy');
var zone=document.getElementById('bpZone'),btn=document.getElementById('bpBtn'),inp=document.getElementById('bpFile');
var canvas=document.getElementById('bpCanvas'),ctx=canvas.getContext('2d');
var slider=document.getElementById('bpSlider'),valLbl=document.getElementById('bpVal'),dimsEl=document.getElementById('bpDims');
var fmtSel=document.getElementById('bpFmt');
var dlBtn=document.getElementById('bpDl');
var cancelBtn=document.getElementById('bpCancel');
var statusEl=document.getElementById('bpStatus');

/* Worker message handler */
worker.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'progress') {
    document.getElementById('bpPct').textContent = Math.round(data.percent) + '%';
    document.getElementById('bpBarFill').style.width = data.percent + '%';
    statusEl.textContent = data.msg || 'Processing...';
  } else if (data.type === 'complete') {
    document.getElementById('bpPct').textContent = '100%';
    document.getElementById('bpBarFill').style.width = '100%';
    statusEl.textContent = 'Complete!';
    
    setTimeout(function() {
      busy.style.display = 'none';
      work.style.display = 'block';
      dlBtn.disabled = false;
      
      var a = document.createElement('a');
      a.href = data.dataURL;
      a.download = 'blurred-photo.' + fmtSel.value;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 300);
  } else if (data.type === 'error') {
    busy.style.display = 'none';
    work.style.display = 'block';
    dlBtn.disabled = false;
    alert('Error: ' + data.msg);
  }
};

function blurCanvas(src,amount){
  var w=src.width,h=src.height;
  var out=document.createElement('canvas');out.width=w;out.height=h;
  var octx=out.getContext('2d');
  octx.imageSmoothingEnabled=true;octx.imageSmoothingQuality='high';
  if(amount<=0){octx.drawImage(src,0,0);return out;}
  if(typeof octx.filter==='string'){
    var px=(amount/100)*(Math.min(w,h)/10);
    var over=px*2;
    octx.save();
    octx.filter='blur('+px+'px)';
    octx.drawImage(src,-over,-over,w+over*2,h+over*2);
    octx.restore();
    octx.filter='none';
  }else{
    var f=Math.max(0.02,1-(amount/100)*0.97);
    var tw=Math.max(2,Math.round(w*f)),th=Math.max(2,Math.round(h*f));
    var t=document.createElement('canvas');t.width=tw;t.height=th;
    var tc=t.getContext('2d');tc.imageSmoothingEnabled=true;tc.imageSmoothingQuality='high';
    tc.drawImage(src,0,0,tw,th);
    octx.drawImage(t,0,0,tw,th,0,0,w,h);
  }
  return out;
}

function render(){
  if(!base){return;}
  var prev=document.createElement('canvas');
  prev.width=canvas.width;prev.height=canvas.height;
  prev.getContext('2d').drawImage(base,0,0,canvas.width,canvas.height);
  var blurred=blurCanvas(prev,blurAmt);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(blurred,0,0);
}

/* Debounced render for slider */
slider.oninput=function(){
  blurAmt=parseInt(this.value);
  valLbl.textContent=this.value+'%';
  
  /* Debounce: cancel previous render, schedule new one */
  if(renderTimer){clearTimeout(renderTimer);}
  renderTimer=setTimeout(function(){
    render();
    renderTimer=null;
  },16); /* ~60fps */
};

function addFile(f){
  if(f.type.indexOf('image/')!==0&&!/\.(jpg|jpeg|png|webp)$/i.test(f.name)){alert('Please select an image file.');return;}
  file=f;
  var rd=new FileReader();
  rd.onload=function(){
    var im=new Image();
    im.onload=function(){
      base=document.createElement('canvas');
      base.width=im.width;base.height=im.height;
      base.getContext('2d').drawImage(im,0,0);
      var maxW=Math.min(640,(window.innerWidth-460));
      if(maxW<300){maxW=Math.min(640,window.innerWidth-60);}
      scale=Math.min(1,maxW/base.width);
      canvas.width=Math.floor(base.width*scale);
      canvas.height=Math.floor(base.height*scale);
      blurAmt=0;slider.value=0;valLbl.textContent='0%';
      dimsEl.textContent=base.width+' × '+base.height+' px';
      pick.style.display='none';work.style.display='block';
      render();
    };
    im.src=rd.result;
  };
  rd.readAsDataURL(f);
}

btn.onclick=function(){inp.click();};

inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};

zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};

dlBtn.onclick=function(){
  if(!base||!file){return;}
  
  work.style.display='none';
  busy.style.display='block';
  
  document.getElementById('bpPct').textContent='0%';
  document.getElementById('bpBarFill').style.width='0%';
  statusEl.textContent='Starting...';
  cancelRequested=false;
  dlBtn.disabled=true;
  
  file.arrayBuffer().then(function(buf){
    if(cancelRequested){
      busy.style.display='none';
      work.style.display='block';
      dlBtn.disabled=false;
      return;
    }
    
    worker.postMessage({
      type: 'blur',
      blob: new Blob([buf], {type: file.type || 'image/jpeg'}),
      amount: blurAmt,
      fmt: fmtSel.value
    });
  }).catch(function(err){
    busy.style.display='none';
    work.style.display='block';
    dlBtn.disabled=false;
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
      document.getElementById('bpPct').textContent = Math.round(data.percent) + '%';
      document.getElementById('bpBarFill').style.width = data.percent + '%';
      statusEl.textContent = data.msg || 'Processing...';
    } else if (data.type === 'complete') {
      document.getElementById('bpPct').textContent = '100%';
      document.getElementById('bpBarFill').style.width = '100%';
      statusEl.textContent = 'Complete!';
      setTimeout(function() {
        busy.style.display = 'none';
        work.style.display = 'block';
        dlBtn.disabled = false;
        var a = document.createElement('a');
        a.href = data.dataURL;
        a.download = 'blurred-photo.' + fmtSel.value;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, 300);
    } else if (data.type === 'error') {
      busy.style.display = 'none';
      work.style.display = 'block';
      dlBtn.disabled = false;
      alert('Error: ' + data.msg);
    }
  };
  
  busy.style.display='none';
  work.style.display='block';
  dlBtn.disabled=false;
};

document.getElementById('bpAgain').onclick=function(){
  work.style.display='none';pick.style.display='block';
  base=null;file=null;
};

})();
