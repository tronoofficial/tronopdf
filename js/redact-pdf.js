/* TronoPDF - Redact PDF v5 | Web Worker + Cancel + Progress */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

/* Web Worker for PDF redaction */
var workerCode = `
importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

function hexToRgba(h, a) {
  var x = h.replace('#', '');
  var r = parseInt(x.substr(0, 2), 16);
  var g = parseInt(x.substr(2, 2), 16);
  var b = parseInt(x.substr(4, 2), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

function drawShape(ctx, r, s) {
  ctx.fillStyle = r.color;
  ctx.globalAlpha = r.op / 100;
  var x = r.x * s, y = r.y * s, w = r.w * s, h = r.h * s;
  
  if (r.shape === 'ellipse') {
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (r.shape === 'line') {
    ctx.fillRect(x, y + h / 2 - Math.max(1, h / 2), w, Math.max(2, h));
  } else {
    ctx.fillRect(x, y, w, h);
  }
  ctx.globalAlpha = 1;
}

function renderPageWithRedactions(pdfData, pageNum, rectsOnPage, scale) {
  return pdfjsLib.getDocument({data: pdfData}).promise.then(function(doc) {
    return doc.getPage(pageNum).then(function(page) {
      var vp = page.getViewport({scale: scale});
      var canvas = new OffscreenCanvas(Math.floor(vp.width), Math.floor(vp.height));
      var ctx = canvas.getContext('2d');
      
      return page.render({canvasContext: ctx, viewport: vp}).promise.then(function() {
        /* Draw redaction shapes */
        rectsOnPage.forEach(function(r) {
          drawShape(ctx, r, scale);
        });
        
        return canvas.convertToBlob({type: 'image/png'}).then(function(blob) {
          return blob.arrayBuffer();
        });
      });
    });
  });
}

self.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'redact') {
    var pdfBuffer = data.pdfBuffer;
    var perPageRects = data.perPageRects;
    var applyAll = data.applyAll;
    var curPage = data.curPage;
    var scale = 2;
    
    self.postMessage({type: 'progress', percent: 5, msg: 'Loading PDF...'});
    
    PDFLib.PDFDocument.load(pdfBuffer, {ignoreEncryption: true}).then(function(srcPdf) {
      self.postMessage({type: 'progress', percent: 10, msg: 'Creating output PDF...'});
      
      return PDFLib.PDFDocument.create().then(function(newPdf) {
        var n = srcPdf.getPageCount();
        var chain = Promise.resolve();
        
        for (var i = 1; i <= n; i++) {
          (function(num) {
            chain = chain.then(function() {
              var percent = 10 + ((num - 1) / n) * 80;
              self.postMessage({
                type: 'progress',
                percent: percent,
                msg: 'Processing page ' + num + ' of ' + n
              });
              
              var rectsOnPage = perPageRects[num] || [];
              var doRedact = rectsOnPage.length > 0 && (applyAll || num === curPage);
              
              if (doRedact) {
                return renderPageWithRedactions(pdfBuffer, num, rectsOnPage, scale).then(function(pngBuffer) {
                  return newPdf.embedPng(new Uint8Array(pngBuffer)).then(function(img) {
                    var sp = srcPdf.getPage(num - 1);
                    var pw = sp.getWidth(), ph = sp.getHeight();
                    var pg = newPdf.addPage([pw, ph]);
                    pg.drawImage(img, {x: 0, y: 0, width: pw, height: ph});
                  });
                });
              } else {
                return newPdf.copyPages(srcPdf, [num - 1]).then(function(cp) {
                  newPdf.addPage(cp[0]);
                });
              }
            });
          })(i);
        }
        
        return chain.then(function() {
          self.postMessage({type: 'progress', percent: 95, msg: 'Saving PDF...'});
          return newPdf.save();
        });
      });
    }).then(function(bytes) {
      self.postMessage({type: 'progress', percent: 100, msg: 'Complete!'});
      self.postMessage({
        type: 'complete',
        bytes: bytes
      });
    }).catch(function(err) {
      self.postMessage({
        type: 'error',
        msg: 'Redaction failed: ' + (err.message || err)
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
loadJS(PDFJS_SRC,function(e){if(!e&&window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;}});

function waitLib(name){return new Promise(function(res){var t=0;(function w(){if(window[name]){res(true);return;}if(t>40){res(false);return;}t++;setTimeout(w,500);})();});}

function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}

function hexToRgba(h,a){var x=h.replace('#','');var r=parseInt(x.substr(0,2),16),g=parseInt(x.substr(2,2),16),b=parseInt(x.substr(4,2),16);return 'rgba('+r+','+g+','+b+','+a+')';}

var html='';
html+='<style>';
html+='.rd-wrap{max-width:1400px;margin:0 auto}';
html+='.rd-hero{text-align:center;padding:50px 16px 40px}';
html+='.rd-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.rd-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.rd-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.rd-big:hover{transform:translateY(-2px)}';
html+='.rd-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.rd-zone{border:2px dashed transparent;border-radius:18px}';
html+='.rd-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.rd-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.rd-main{display:flex;min-height:680px}';
html+='.rd-prev{flex:1;padding:26px;display:flex;flex-direction:column;align-items:center;gap:12px;overflow:auto}';
html+='.rd-canvaswrap{position:relative;border-radius:6px;overflow:hidden;box-shadow:0 10px 40px rgba(30,20,60,.18);background:#fff;cursor:crosshair;touch-action:none}';
html+='.rd-canvaswrap canvas{display:block}';
html+='.rd-rect{position:absolute;border:2px solid rgba(0,0,0,.4);cursor:move;touch-action:none}';
html+='.rd-rect .del{position:absolute;top:-10px;right:-10px;width:22px;height:22px;border-radius:50%;background:#dc2626;color:#fff;border:2px solid #fff;font-size:11px;cursor:pointer;display:none;z-index:5}';
html+='.rd-rect.sel .del{display:block}';
html+='.rd-rect.sel{outline:2px dashed #7c3aed}';
html+='.rd-pagenav{display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center}';
html+='.rd-pagenav button{border:1px solid #eceaf6;background:#fff;border-radius:8px;padding:8px 14px;font-weight:800;cursor:pointer}';
html+='.rd-pagenav button:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.rd-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.rd-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:6px}';
html+='.rd-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:14px}';
html+='.rd-help{background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:10px 14px;font-size:12px;color:#92400e;font-weight:600;margin-bottom:12px;line-height:1.5}';
html+='.rd-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:10px 0 6px}';
html+='.rd-shapes{display:flex;gap:6px}';
html+='.rd-shapes button{flex:1;border:2px solid #eceaf6;border-radius:8px;padding:9px 2px;font-size:12px;font-weight:800;cursor:pointer;background:#fff;color:#4b4b5a}';
html+='.rd-shapes button.active{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}';
html+='.rd-colors{display:flex;gap:8px;align-items:center}';
html+='.rd-colors .sw{width:26px;height:26px;border-radius:50%;cursor:pointer;border:2px solid #fff;box-shadow:0 0 0 1px #ddd}';
html+='.rd-colors .sw.active{box-shadow:0 0 0 2px #7c3aed}';
html+='.rd-colors input[type=color]{width:30px;height:28px;border:1px solid #ddd;border-radius:6px;padding:1px;background:#fff;cursor:pointer}';
html+='.rd-op{width:100%;accent-color:#7c3aed}';
html+='.rd-btnrow{display:flex;gap:8px;margin:12px 0 10px}';
html+='.rd-btnrow button{flex:1;border:1px solid #eceaf6;background:#fff;border-radius:10px;padding:11px;font-size:13px;font-weight:800;cursor:pointer}';
html+='.rd-btnrow button:hover{border-color:#dc2626;color:#dc2626}';
html+='.rd-list{flex:1;overflow-y:auto;border-top:1px solid #eceaf6;padding-top:10px;min-height:50px}';
html+='.rd-list h4{font-size:12px;font-weight:800;color:#9a9aa5;margin-bottom:8px}';
html+='.rd-li{display:flex;align-items:center;gap:8px;border:1px solid #eceaf6;border-radius:8px;padding:8px;margin-bottom:6px;font-size:12px;font-weight:700;color:#4b4b5a;cursor:pointer}';
html+='.rd-li.sel{border-color:#7c3aed;background:#f3f0ff}';
html+='.rd-li .nm{flex:1}';
html+='.rd-li button{border:none;background:none;color:#dc2626;font-weight:800;cursor:pointer;padding:2px 6px;font-size:14px}';
html+='.rd-chk{display:flex;gap:8px;align-items:center;margin:10px 0}';
html+='.rd-chk input{width:16px;height:16px;accent-color:#7c3aed}';
html+='.rd-chk label{font-size:13px;font-weight:600;cursor:pointer}';
html+='.rd-go{background:linear-gradient(135deg,#1e293b,#334155);color:#fff;font-size:17px;font-weight:800;padding:16px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(30,41,59,.35);margin-top:12px}';
html+='.rd-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.rd-busy{display:none;padding:60px 20px;text-align:center}';
html+='.rd-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.rd-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:10px}';
html+='.rd-busy .st{color:#7c3aed;font-size:13px;font-weight:700;margin-bottom:16px;min-height:18px}';
html+='.rd-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.rd-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .3s}';
html+='.rd-pct{font-size:36px;font-weight:900}';
html+='.rd-cancel{margin-top:16px;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;border:none;cursor:pointer}';
html+='.rd-cancel:hover{background:#e6e8f5}';
html+='.rd-done{display:none;text-align:center;padding:50px 20px}';
html+='.rd-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.rd-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.rd-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='@media(max-width:900px){.rd-main{flex-direction:column}.rd-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="rd-wrap">';
html+='<div id="rdPick"><div class="rd-hero"><h1>Redact PDF</h1><p>Black out sensitive text permanently - shapes, colors & opacity.</p>';
html+='<div class="rd-zone" id="rdZone"><button class="rd-big" id="rdBtn" type="button">Select PDF file</button><p class="rd-drop-hint">or drop PDF here</p></div></div></div>';
html+='<div class="rd-work" id="rdWork"><div class="rd-main"><div class="rd-prev"><div class="rd-canvaswrap" id="rdWrap"><canvas id="rdCanvas"></canvas><div id="rdItems"></div></div>';
html+='<div class="rd-pagenav"><button id="rdPrev" type="button">←</button><span id="rdPageLbl" style="font-weight:800"></span><button id="rdNext" type="button">→</button></div></div>';
html+='<aside class="rd-side"><h2>Redact settings</h2><p class="rd-sub">Drag on the page to add a shape</p>';
html+='<div class="rd-help">💡 Pick a shape & color, drag on the page. Drag any shape to move it. Content is permanently removed on apply.</div>';
html+='<div class="rd-lbl">Shape</div><div class="rd-shapes"><button data-sh="rect" class="active">▭ Rect</button><button data-sh="ellipse">◯ Ellipse</button><button data-sh="line">— Line</button></div>';
html+='<div class="rd-lbl">Color</div><div class="rd-colors" id="rdColors"><span class="sw active" data-c="#000000" style="background:#000000"></span><span class="sw" data-c="#ffffff" style="background:#ffffff"></span><span class="sw" data-c="#dc2626" style="background:#dc2626"></span><span class="sw" data-c="#2563eb" style="background:#2563eb"></span><span class="sw" data-c="#facc15" style="background:#facc15"></span><input type="color" id="rdColorPick" value="#000000"/></div>';
html+='<div class="rd-lbl">Opacity: <span id="rdOpVal">100%</span></div><input class="rd-op" type="range" id="rdOp" min="10" max="100" value="100"/>';
html+='<div class="rd-btnrow"><button id="rdClearPage" type="button">Clear this page</button><button id="rdClearAll" type="button">Clear all pages</button></div>';
html+='<div class="rd-list"><h4>Shapes on this page (<span id="rdCount">0</span>)</h4><div id="rdList"></div></div>';
html+='<div class="rd-chk"><input type="checkbox" id="rdAll" checked/><label for="rdAll">Apply redaction to all pages</label></div>';
html+='<button class="rd-go" id="rdGo" type="button">Apply Redaction →</button></aside></div></div>';
html+='<div class="rd-busy" id="rdBusy"><h2>Applying redaction...</h2><p class="fn" id="rdBusyName"></p><p class="st" id="rdStatus">Working...</p><div class="rd-bar"><div id="rdBarFill"></div></div><div class="rd-pct" id="rdPct">0%</div><button class="rd-cancel" id="rdCancel" type="button">✕ Cancel</button></div>';
html+='<div class="rd-done" id="rdDone"><div class="rd-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF redacted successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="rdDoneInfo"></p><a class="rd-dl" id="rdDl" href="#">⬇ Download Redacted PDF</a><button class="rd-again" id="rdAgain" type="button">Redact another PDF</button></div>';
html+='<input type="file" id="rdFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;

var file=null,doc=null,totalPages=0,curPage=1;
var pageW=595,pageH=842,scale=1;
var perPageRects={};
var curShape='rect',curColor='#000000',curOp=100;
var cancelRequested=false;

var pick=document.getElementById('rdPick'),work=document.getElementById('rdWork'),busy=document.getElementById('rdBusy'),done=document.getElementById('rdDone');
var zone=document.getElementById('rdZone'),btn=document.getElementById('rdBtn'),inp=document.getElementById('rdFile');
var wrap=document.getElementById('rdWrap'),canvas=document.getElementById('rdCanvas'),ctx=canvas.getContext('2d');
var itemsBox=document.getElementById('rdItems'),listBox=document.getElementById('rdList'),countEl=document.getElementById('rdCount');
var pageLbl=document.getElementById('rdPageLbl');
var elAll=document.getElementById('rdAll');
var selIdx=-1;
var cancelBtn=document.getElementById('rdCancel');
var statusEl=document.getElementById('rdStatus');
var goBtn=document.getElementById('rdGo');

/* Worker message handler */
worker.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'progress') {
    document.getElementById('rdPct').textContent = Math.round(data.percent) + '%';
    document.getElementById('rdBarFill').style.width = data.percent + '%';
    statusEl.textContent = data.msg || 'Processing...';
  } else if (data.type === 'complete') {
    document.getElementById('rdPct').textContent = '100%';
    document.getElementById('rdBarFill').style.width = '100%';
    statusEl.textContent = 'Complete!';
    
    var total = totalRects();
    
    setTimeout(function() {
      busy.style.display = 'none';
      done.style.display = 'block';
      document.getElementById('rdDoneInfo').textContent = total + ' redaction(s) applied • ' + fmtB(data.bytes.length) + ' • Text permanently removed';
      
      var blob = new Blob([data.bytes], {type: 'application/pdf'});
      var dl = document.getElementById('rdDl');
      dl.href = URL.createObjectURL(blob);
      dl.download = 'redacted-' + (file ? file.name : 'document.pdf');
      goBtn.disabled = false;
    }, 300);
  } else if (data.type === 'error') {
    busy.style.display = 'none';
    work.style.display = 'block';
    goBtn.disabled = false;
    alert('Error: ' + data.msg);
  }
};

var shapeBtns=document.querySelectorAll('.rd-shapes button');
shapeBtns.forEach(function(b){b.onclick=function(){shapeBtns.forEach(function(x){x.classList.remove('active');});b.classList.add('active');curShape=b.getAttribute('data-sh');};});

var swatches=document.querySelectorAll('.rd-colors .sw');
swatches.forEach(function(s){s.onclick=function(){swatches.forEach(function(x){x.classList.remove('active');});s.classList.add('active');curColor=s.getAttribute('data-c');document.getElementById('rdColorPick').value=curColor;};});

document.getElementById('rdColorPick').oninput=function(){curColor=this.value;swatches.forEach(function(x){x.classList.remove('active');});};
document.getElementById('rdOp').oninput=function(){curOp=parseInt(this.value);document.getElementById('rdOpVal').textContent=this.value+'%';};

function rects(){if(!perPageRects[curPage]){perPageRects[curPage]=[];}return perPageRects[curPage];}
function totalRects(){var t=0;Object.keys(perPageRects).forEach(function(p){t+=perPageRects[p].length;});return t;}
function shapeName(s){return s==='rect'?'Rect':(s==='ellipse'?'Ellipse':'Line');}

function markSel(){
  var kids=itemsBox.children;
  for(var i=0;i<kids.length;i++){kids[i].classList.toggle('sel',i===selIdx);}
  var lis=listBox.children;
  for(var j=0;j<lis.length;j++){lis[j].classList.toggle('sel',j===selIdx);}
}

function syncUI(){
  var list=rects();
  countEl.textContent=list.length;
  itemsBox.innerHTML='';listBox.innerHTML='';
  list.forEach(function(r,i){
    var d=document.createElement('div');d.className='rd-rect'+(i===selIdx?' sel':'');
    d.style.left=(r.x*scale)+'px';d.style.top=(r.y*scale)+'px';
    d.style.width=(r.w*scale)+'px';d.style.height=(r.h*scale)+'px';
    d.style.background=hexToRgba(r.color,(r.op/100));
    if(r.shape==='ellipse'){d.style.borderRadius='50%';}
    var del=document.createElement('button');del.className='del';del.textContent='✕';
    del.onclick=function(e){e.stopPropagation();list.splice(i,1);selIdx=-1;syncUI();};
    d.appendChild(del);
    d.addEventListener('pointerdown',function(e){
      if(e.target===del){return;}
      e.stopPropagation();
      selIdx=i;markSel();
      var on=true,lx=e.clientX,ly=e.clientY;
      d.setPointerCapture(e.pointerId);
      function mv(ev){
        if(!on){return;}
        r.x+=(ev.clientX-lx)/scale;r.y+=(ev.clientY-ly)/scale;
        lx=ev.clientX;ly=ev.clientY;
        d.style.left=(r.x*scale)+'px';d.style.top=(r.y*scale)+'px';
      }
      function up(){on=false;d.removeEventListener('pointermove',mv);d.removeEventListener('pointerup',up);syncUI();}
      d.addEventListener('pointermove',mv);d.addEventListener('pointerup',up);
    });
    itemsBox.appendChild(d);
    var li=document.createElement('div');li.className='rd-li'+(i===selIdx?' sel':'');
    li.innerHTML='<span style="color:'+r.color+'">⬛</span><span class="nm">'+shapeName(r.shape)+' '+(i+1)+' ('+Math.round(r.w)+'×'+Math.round(r.h)+')</span>';
    var del2=document.createElement('button');del2.textContent='✕';
    del2.onclick=function(e){e.stopPropagation();list.splice(i,1);selIdx=-1;syncUI();};
    li.appendChild(del2);
    li.onclick=function(){selIdx=i;markSel();};
    listBox.appendChild(li);
  });
}

var drawing=false,sx=0,sy=0;

wrap.addEventListener('pointerdown',function(e){
  if(e.target.closest('.rd-rect')){return;}
  drawing=true;
  var r=wrap.getBoundingClientRect();
  sx=e.clientX-r.left;sy=e.clientY-r.top;
  wrap.setPointerCapture(e.pointerId);
  e.preventDefault();
});

wrap.addEventListener('pointermove',function(e){
  if(!drawing){return;}
  var r=wrap.getBoundingClientRect();
  var cx=e.clientX-r.left,cy=e.clientY-r.top;
  var x=Math.min(sx,cx)/scale,y=Math.min(sy,cy)/scale;
  var w=Math.abs(cx-sx)/scale,h=Math.abs(cy-sy)/scale;
  var list=rects();
  if(!list.__drag__){list.__drag__={x:x,y:y,w:w,h:h,shape:curShape,color:curColor,op:curOp};list.push(list.__drag__);selIdx=list.length-1;syncUI();}
  else{list.__drag__.x=x;list.__drag__.y=y;list.__drag__.w=w;list.__drag__.h=h;syncUI();}
});

wrap.addEventListener('pointerup',function(){
  if(!drawing){return;}
  drawing=false;
  var list=rects();
  if(list.__drag__){
    if(list.__drag__.w<5||list.__drag__.h<5){
      var idx=list.indexOf(list.__drag__);
      if(idx>-1){list.splice(idx,1);}
      selIdx=-1;
    }
    delete list.__drag__;
    syncUI();
  }
});

wrap.addEventListener('pointercancel',function(){drawing=false;var list=rects();if(list.__drag__){var idx=list.indexOf(list.__drag__);if(idx>-1){list.splice(idx,1);}delete list.__drag__;}selIdx=-1;syncUI();});

document.getElementById('rdClearPage').onclick=function(){perPageRects[curPage]=[];selIdx=-1;syncUI();};
document.getElementById('rdClearAll').onclick=function(){perPageRects={};selIdx=-1;syncUI();};

function addFile(f){
  if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){alert('Please select a PDF file.');return;}
  file=f;pick.style.display='none';work.style.display='block';done.style.display='none';
  perPageRects={};selIdx=-1;
  waitLib('pdfjsLib').then(function(ok){
    if(!ok){return;}
    window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
    f.arrayBuffer().then(function(b){
      return window.pdfjsLib.getDocument({data:b}).promise.then(function(d){
        doc=d;totalPages=d.numPages;curPage=1;renderPage();
      });
    });
  });
}

function renderPage(){
  if(!doc){return;}
  doc.getPage(curPage).then(function(page){
    var vp1=page.getViewport({scale:1});
    pageW=vp1.width;pageH=vp1.height;
    scale=Math.min(1.4,560/pageW);
    var vp=page.getViewport({scale:scale});
    canvas.width=Math.floor(vp.width);canvas.height=Math.floor(vp.height);
    page.render({canvasContext:ctx,viewport:vp}).promise.then(function(){
      pageLbl.textContent='Page '+curPage+' / '+totalPages;
      syncUI();
    });
  });
}

document.getElementById('rdPrev').onclick=function(){if(curPage>1){curPage--;renderPage();}};
document.getElementById('rdNext').onclick=function(){if(curPage<totalPages){curPage++;renderPage();}};

btn.onclick=function(){inp.click();};

inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};

zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};

goBtn.onclick=function(){
  if(!file||!doc){return;}
  var total=totalRects();
  if(total===0){alert('Please draw at least one shape first.');return;}
  
  work.style.display='none';
  busy.style.display='block';
  document.getElementById('rdBusyName').textContent=file.name;
  document.getElementById('rdPct').textContent='0%';
  document.getElementById('rdBarFill').style.width='0%';
  statusEl.textContent='Starting redaction...';
  cancelRequested=false;
  goBtn.disabled=true;
  
  var applyAll=elAll.checked;
  
  /* Read file and send to worker */
  file.arrayBuffer().then(function(buf){
    if(cancelRequested){
      busy.style.display='none';
      work.style.display='block';
      goBtn.disabled=false;
      return;
    }
    
    worker.postMessage({
      type: 'redact',
      pdfBuffer: buf,
      perPageRects: perPageRects,
      applyAll: applyAll,
      curPage: curPage
    }, [buf]);
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
      document.getElementById('rdPct').textContent = Math.round(data.percent) + '%';
      document.getElementById('rdBarFill').style.width = data.percent + '%';
      statusEl.textContent = data.msg || 'Processing...';
    } else if (data.type === 'complete') {
      document.getElementById('rdPct').textContent = '100%';
      document.getElementById('rdBarFill').style.width = '100%';
      statusEl.textContent = 'Complete!';
      var total = totalRects();
      setTimeout(function() {
        busy.style.display = 'none';
        done.style.display = 'block';
        document.getElementById('rdDoneInfo').textContent = total + ' redaction(s) applied • ' + fmtB(data.bytes.length) + ' • Text permanently removed';
        var blob = new Blob([data.bytes], {type: 'application/pdf'});
        var dl = document.getElementById('rdDl');
        dl.href = URL.createObjectURL(blob);
        dl.download = 'redacted-' + (file ? file.name : 'document.pdf');
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

document.getElementById('rdAgain').onclick=function(){
  done.style.display='none';pick.style.display='block';work.style.display='none';
  file=null;doc=null;totalPages=0;perPageRects={};
};

})();
