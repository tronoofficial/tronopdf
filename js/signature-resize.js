/* TronoPDF - Signature Resize v3 | Web Worker + Cancel + Progress */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

/* Web Worker for signature processing */
var workerCode = `
function processSignature(blob, opts) {
  return createImageBitmap(blob).then(function(bitmap) {
    var W = opts.w, H = opts.h;
    
    var c = new OffscreenCanvas(W, H);
    var x = c.getContext('2d');
    
    if (opts.fmt === 'jpg') {
      x.fillStyle = '#fff';
      x.fillRect(0, 0, W, H);
    }
    
    x.imageSmoothingEnabled = true;
    x.imageSmoothingQuality = 'high';
    x.drawImage(bitmap, 0, 0, W, H);
    bitmap.close();
    
    /* Clean background / darken ink */
    if (opts.clean || opts.bold) {
      var d = x.getImageData(0, 0, W, H);
      var p = d.data;
      var thr = opts.threshold || 200;
      
      for (var i = 0; i < p.length; i += 4) {
        var lum = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2];
        if (opts.clean && lum > thr) {
          p[i] = 255; p[i + 1] = 255; p[i + 2] = 255;
        }
        if (opts.bold && lum < 120) {
          p[i] = Math.round(p[i] * 0.55);
          p[i + 1] = Math.round(p[i + 1] * 0.55);
          p[i + 2] = Math.round(p[i + 2] * 0.55);
        }
      }
      x.putImageData(d, 0, 0);
    }
    
    if (opts.useKb && opts.fmt === 'jpg') {
      /* Binary search for target KB */
      var target = opts.targetKb * 1024;
      var lo = 0.05, hi = 0.95, best = null;
      var chain = Promise.resolve();
      
      for (var i2 = 0; i2 < 9; i2++) {
        (function(idx) {
          chain = chain.then(function() {
            self.postMessage({
              type: 'progress',
              percent: 20 + ((idx + 1) / 9) * 60,
              msg: 'Optimizing file size (' + (idx + 1) + '/9)...'
            });
            
            var q = (lo + hi) / 2;
            return c.convertToBlob({type: 'image/jpeg', quality: q}).then(function(b) {
              return b.arrayBuffer().then(function(ab) {
                var bytes = new Uint8Array(ab);
                var binary = '';
                var chunkSize = 8192;
                for (var j = 0; j < bytes.length; j += chunkSize) {
                  var chunk = bytes.subarray(j, Math.min(j + chunkSize, bytes.length));
                  binary += String.fromCharCode.apply(null, chunk);
                }
                var dataURL = 'data:image/jpeg;base64,' + btoa(binary);
                var size = b.size;
                
                if (size <= target) {
                  best = {dataURL: dataURL, bytes: size};
                  lo = q;
                } else {
                  hi = q;
                }
                
                if (!best && idx === 8) {
                  return c.convertToBlob({type: 'image/jpeg', quality: 0.05}).then(function(b2) {
                    return b2.arrayBuffer().then(function(ab2) {
                      var bytes2 = new Uint8Array(ab2);
                      var binary2 = '';
                      for (var k = 0; k < bytes2.length; k += chunkSize) {
                        var chunk2 = bytes2.subarray(k, Math.min(k + chunkSize, bytes2.length));
                        binary2 += String.fromCharCode.apply(null, chunk2);
                      }
                      best = {dataURL: 'data:image/jpeg;base64,' + btoa(binary2), bytes: b2.size};
                    });
                  });
                }
              });
            });
          });
        })(i2);
      }
      
      return chain.then(function() {
        return best;
      });
    } else {
      var mime = opts.fmt === 'png' ? 'image/png' : 'image/jpeg';
      return c.convertToBlob({type: mime, quality: 0.92}).then(function(b) {
        return b.arrayBuffer().then(function(ab) {
          var bytes = new Uint8Array(ab);
          var binary = '';
          var chunkSize = 8192;
          for (var j2 = 0; j2 < bytes.length; j2 += chunkSize) {
            var chunk = bytes.subarray(j2, Math.min(j2 + chunkSize, bytes.length));
            binary += String.fromCharCode.apply(null, chunk);
          }
          return {dataURL: 'data:' + mime + ';base64,' + btoa(binary), bytes: b.size};
        });
      });
    }
  });
}

self.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'resize') {
    self.postMessage({type: 'progress', percent: 5, msg: 'Processing signature...'});
    
    processSignature(data.blob, data.opts).then(function(result) {
      self.postMessage({type: 'progress', percent: 95, msg: 'Finalizing...'});
      self.postMessage({
        type: 'complete',
        result: result
      });
    }).catch(function(err) {
      self.postMessage({
        type: 'error',
        msg: 'Resize failed: ' + (err.message || err)
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
html+='.sr-wrap{max-width:1400px;margin:0 auto}';
html+='.sr-hero{text-align:center;padding:50px 16px 40px}';
html+='.sr-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.sr-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.sr-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.sr-big:hover{transform:translateY(-2px)}';
html+='.sr-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.sr-zone{border:2px dashed transparent;border-radius:18px}';
html+='.sr-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.sr-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.sr-main{display:flex;min-height:560px}';
html+='.sr-prev{flex:1;padding:40px;display:flex;align-items:center;justify-content:center}';
html+='.sr-card{background:#fff;border:1px solid #eceaf6;border-radius:14px;padding:24px;text-align:center;box-shadow:0 4px 20px rgba(30,20,60,.06);width:420px;max-width:100%}';
html+='.sr-card canvas{width:100%;height:180px;object-fit:contain;background:#fff;border:1px solid #eceaf6;border-radius:8px}';
html+='.sr-nm{font-size:13px;font-weight:700;margin-top:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}';
html+='.sr-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.sr-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:6px}';
html+='.sr-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:16px}';
html+='.sr-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}';
html+='.sr-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;font-family:inherit;background:#fff}';
html+='.sr-row{display:flex;gap:10px;align-items:center}';
html+='.sr-row input[type=number]{flex:1;padding:10px;border:1px solid #ddd;border-radius:10px;font-size:14px;min-width:0}';
html+='.sr-chk{display:flex;gap:8px;align-items:center;margin:8px 0}';
html+='.sr-chk input{width:16px;height:16px;accent-color:#7c3aed}';
html+='.sr-chk label{font-size:13px;font-weight:600;cursor:pointer}';
html+='.sr-quick{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}';
html+='.sr-quick button{border:1px solid #eceaf6;background:#f7f6fc;color:#4b4b5a;font-size:11px;font-weight:800;padding:6px 12px;border-radius:999px;cursor:pointer}';
html+='.sr-quick button:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.sr-adv{margin-top:14px;border:1px solid #eceaf6;border-radius:10px;padding:10px 14px;background:#fafbfe}';
html+='.sr-adv summary{font-size:13px;font-weight:800;color:#7c3aed;cursor:pointer}';
html+='.sr-adv[open] summary{margin-bottom:6px}';
html+='.sr-adv .sr-row input[type=range]{flex:1;accent-color:#7c3aed}';
html+='.sr-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:16px}';
html+='.sr-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.sr-busy{display:none;text-align:center;padding:60px 20px}';
html+='.sr-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.sr-busy .st{color:#7a7a85;font-size:15px;margin-bottom:10px;min-height:20px}';
html+='.sr-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.sr-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .3s}';
html+='.sr-pct{font-size:36px;font-weight:900}';
html+='.sr-cancel{margin-top:16px;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;border:none;cursor:pointer}';
html+='.sr-cancel:hover{background:#e6e8f5}';
html+='.sr-done{display:none;text-align:center;padding:50px 20px}';
html+='.sr-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.sr-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.sr-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='@media(max-width:900px){.sr-main{flex-direction:column}.sr-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="sr-wrap">';
html+='<div id="srPick"><div class="sr-hero"><h1>Signature Resize</h1><p>Resize any signature to exact pixels and KB - for any form, anywhere in the world.</p>';
html+='<div class="sr-zone" id="srZone"><button class="sr-big" id="srBtn" type="button">Select Signature</button><p class="sr-drop-hint">or drop your signature photo here</p></div></div></div>';
html+='<div class="sr-work" id="srWork"><div class="sr-main"><div class="sr-prev"><div class="sr-card"><canvas id="srCanvas"></canvas><div class="sr-nm" id="srName"></div></div></div>';
html+='<aside class="sr-side"><h2>Signature settings</h2><p class="sr-sub">Set size → download. That\'s it.</p>';
html+='<div class="sr-lbl">Dimensions (px)</div><div class="sr-row"><input type="number" id="srW" min="10" value="300"/><span style="color:#9a9aa5;font-size:13px">×</span><input type="number" id="srH" min="10" value="100"/></div>';
html+='<div class="sr-chk"><input type="checkbox" id="srLock" checked/><label for="srLock">Keep aspect ratio</label></div>';
html+='<div class="sr-quick"><button type="button" data-d="300,100">300×100</button><button type="button" data-d="200,50">200×50</button><button type="button" data-d="140,60">140×60</button><button type="button" data-d="276,118">276×118</button></div>';
html+='<div class="sr-chk" style="margin-top:12px"><input type="checkbox" id="srKb" checked/><label for="srKb">Limit file size</label></div>';
html+='<div id="srKbBox"><div class="sr-row"><input type="number" id="srKbVal" value="20" min="3"/><span style="font-size:12px;color:#9a9aa5">KB max</span></div><div class="sr-quick"><button type="button" data-kb="10">10 KB</button><button type="button" data-kb="20">20 KB</button><button type="button" data-kb="50">50 KB</button><button type="button" data-kb="100">100 KB</button></div></div>';
html+='<details class="sr-adv"><summary>⚙️ Advanced options</summary>';
html+='<div class="sr-chk"><input type="checkbox" id="srClean"/><label for="srClean">Clean paper background (pure white)</label></div>';
html+='<div class="sr-lbl">Clean strength: <span id="srThrVal">200</span></div><div class="sr-row"><input type="range" id="srThr" min="120" max="250" value="200"/></div>';
html+='<div class="sr-chk"><input type="checkbox" id="srBold"/><label for="srBold">Make ink darker</label></div>';
html+='<div class="sr-lbl">Format</div><select class="sr-inp" id="srFmt"><option value="jpg">JPG (white background)</option><option value="png">PNG</option></select>';
html+='</details>';
html+='<button class="sr-go" id="srGo" type="button">Resize Signature →</button></aside></div></div>';
html+='<div class="sr-busy" id="srBusy"><h2>Resizing signature...</h2><p class="st" id="srStatus">Working...</p><div class="sr-bar"><div id="srBarFill"></div></div><div class="sr-pct" id="srPct">0%</div><button class="sr-cancel" id="srCancel" type="button">✕ Cancel</button></div>';
html+='<div class="sr-done" id="srDone"><div class="sr-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">Your signature is ready!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:24px" id="srDoneInfo"></p><a class="sr-dl" id="srDl" href="#">⬇ Download Signature</a><button class="sr-again" id="srAgain" type="button">Resize another</button></div>';
html+='<input type="file" id="srFile" accept="image/*,.jpg,.jpeg,.png,.webp" style="display:none"/>';
html+='</div>';
root.innerHTML=html;

var img=null;var file=null;var ratio=3;
var cancelRequested=false;

var pick=document.getElementById('srPick'),work=document.getElementById('srWork'),done=document.getElementById('srDone'),busy=document.getElementById('srBusy');
var zone=document.getElementById('srZone'),btn=document.getElementById('srBtn'),inp=document.getElementById('srFile');
var canvas=document.getElementById('srCanvas'),ctx=canvas.getContext('2d'),nameEl=document.getElementById('srName');
var elW=document.getElementById('srW'),elH=document.getElementById('srH'),elLock=document.getElementById('srLock');
var elKb=document.getElementById('srKb'),elKbBox=document.getElementById('srKbBox'),elKbVal=document.getElementById('srKbVal');
var elClean=document.getElementById('srClean'),elThr=document.getElementById('srThr'),elBold=document.getElementById('srBold'),elFmt=document.getElementById('srFmt');
var goBtn=document.getElementById('srGo');
var cancelBtn=document.getElementById('srCancel');
var statusEl=document.getElementById('srStatus');

canvas.width=420;canvas.height=180;

/* Worker message handler */
worker.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'progress') {
    document.getElementById('srPct').textContent = Math.round(data.percent) + '%';
    document.getElementById('srBarFill').style.width = data.percent + '%';
    statusEl.textContent = data.msg || 'Processing...';
  } else if (data.type === 'complete') {
    document.getElementById('srPct').textContent = '100%';
    document.getElementById('srBarFill').style.width = '100%';
    statusEl.textContent = 'Complete!';
    
    var W = Math.max(10, parseInt(elW.value) || 300);
    var H = Math.max(10, parseInt(elH.value) || 100);
    
    setTimeout(function() {
      busy.style.display = 'none';
      done.style.display = 'block';
      document.getElementById('srDoneInfo').textContent = W + '×' + H + ' px • ' + fmtB(data.result.bytes);
      
      var dl = document.getElementById('srDl');
      dl.href = data.result.dataURL;
      dl.download = 'signature-' + W + 'x' + H + '.' + elFmt.value;
      goBtn.disabled = false;
    }, 300);
  } else if (data.type === 'error') {
    busy.style.display = 'none';
    work.style.display = 'block';
    goBtn.disabled = false;
    alert('Error: ' + data.msg);
  }
};

elW.oninput=function(){if(elLock.checked&&ratio){elH.value=Math.max(10,Math.round(this.value/ratio));}};
elH.oninput=function(){if(elLock.checked&&ratio){elW.value=Math.max(10,Math.round(this.value*ratio));}};
elKb.onchange=function(){elKbBox.style.display=this.checked?'block':'none';};
elThr.oninput=function(){document.getElementById('srThrVal').textContent=this.value;drawPreview();};
[elClean,elBold].forEach(function(x){x.addEventListener('change',drawPreview);});

var dimBtns=document.querySelectorAll('[data-d]');
for(var di=0;di<dimBtns.length;di++){
  dimBtns[di].onclick=function(){
    var p=this.getAttribute('data-d').split(',');
    elLock.checked=false;
    elW.value=p[0];elH.value=p[1];
  };
}

var kbBtns=document.querySelectorAll('[data-kb]');
for(var ki=0;ki<kbBtns.length;ki++){
  kbBtns[ki].onclick=function(){elKbVal.value=this.getAttribute('data-kb');};
}

function cleanCanvas(c2,w,h){
  if(!elClean.checked&&!elBold.checked){return;}
  var x=c2.getContext('2d');
  var d=x.getImageData(0,0,w,h);var p=d.data;
  var thr=parseInt(elThr.value)||200;
  for(var i=0;i<p.length;i+=4){
    var lum=0.299*p[i]+0.587*p[i+1]+0.114*p[i+2];
    if(elClean.checked&&lum>thr){p[i]=255;p[i+1]=255;p[i+2]=255;}
    if(elBold.checked&&lum<120){p[i]=Math.round(p[i]*0.55);p[i+1]=Math.round(p[i+1]*0.55);p[i+2]=Math.round(p[i+2]*0.55);}
  }
  x.putImageData(d,0,0);
}

function drawPreview(){
  if(!img){return;}
  ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
  var sc=Math.min(canvas.width/img.width,canvas.height/img.height)*0.92;
  var w=img.width*sc,h=img.height*sc;
  ctx.drawImage(img,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
  cleanCanvas(canvas,canvas.width,canvas.height);
}

function addFile(f){
  if(f.type.indexOf('image/')!==0&&!/\.(jpg|jpeg|png|webp)$/i.test(f.name)){alert('Please select an image file.');return;}
  file=f;
  var u=URL.createObjectURL(f);
  var im=new Image();
  im.onload=function(){
    img=im;
    ratio=img.width/img.height;
    elW.value=img.width;elH.value=img.height;
    nameEl.textContent=f.name;
    pick.style.display='none';work.style.display='block';done.style.display='none';
    drawPreview();
  };
  im.src=u;
}

btn.onclick=function(){inp.click();};

inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};

zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};

goBtn.onclick=function(){
  if(!img||!file){return;}
  
  work.style.display='none';
  done.style.display='none';
  busy.style.display='block';
  
  document.getElementById('srPct').textContent='0%';
  document.getElementById('srBarFill').style.width='0%';
  statusEl.textContent='Starting...';
  cancelRequested=false;
  goBtn.disabled=true;
  
  var W=Math.max(10,parseInt(elW.value)||300);
  var H=Math.max(10,parseInt(elH.value)||100);
  
  var opts={
    w: W,
    h: H,
    fmt: elFmt.value,
    useKb: elKb.checked,
    targetKb: parseFloat(elKbVal.value)||20,
    clean: elClean.checked,
    bold: elBold.checked,
    threshold: parseInt(elThr.value)||200
  };
  
  /* Read file and send to worker */
  file.arrayBuffer().then(function(buf){
    if(cancelRequested){
      busy.style.display='none';
      work.style.display='block';
      goBtn.disabled=false;
      return;
    }
    
    worker.postMessage({
      type: 'resize',
      blob: new Blob([buf], {type: file.type || 'image/jpeg'}),
      opts: opts
    });
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
  
  /* Terminate and recreate worker */
  worker.terminate();
  var blob = new Blob([workerCode], {type: 'application/javascript'});
  var workerUrl = URL.createObjectURL(blob);
  worker = new Worker(workerUrl);
  
  /* Reattach message handler */
  worker.onmessage = function(e) {
    var data = e.data;
    if (data.type === 'progress') {
      document.getElementById('srPct').textContent = Math.round(data.percent) + '%';
      document.getElementById('srBarFill').style.width = data.percent + '%';
      statusEl.textContent = data.msg || 'Processing...';
    } else if (data.type === 'complete') {
      document.getElementById('srPct').textContent = '100%';
      document.getElementById('srBarFill').style.width = '100%';
      statusEl.textContent = 'Complete!';
      var W = Math.max(10, parseInt(elW.value) || 300);
      var H = Math.max(10, parseInt(elH.value) || 100);
      setTimeout(function() {
        busy.style.display = 'none';
        done.style.display = 'block';
        document.getElementById('srDoneInfo').textContent = W + '×' + H + ' px • ' + fmtB(data.result.bytes);
        var dl = document.getElementById('srDl');
        dl.href = data.result.dataURL;
        dl.download = 'signature-' + W + 'x' + H + '.' + elFmt.value;
        goBtn.disabled = false;
      }, 300);
    } else if (data.type === 'error') {
      busy.style.display = 'none';
      work.style.display = 'block';
      goBtn.disabled = false;
      alert('Error: ' + data.msg);
    }
  };
  
  busy.style.display='none';
  work.style.display='block';
  goBtn.disabled=false;
};

document.getElementById('srAgain').onclick=function(){
  done.style.display='none';pick.style.display='block';work.style.display='none';img=null;file=null;
};

})();
