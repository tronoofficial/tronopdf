/* TronoPDF - Compress PDF v2 | real compression, target size, fast */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
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
root.innerHTML='<style>'+
'.cp-wrap{max-width:1400px;margin:0 auto}'+
'.cp-hero{text-align:center;padding:50px 16px 40px}'+
'.cp-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}'+
'.cp-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}'+
'.cp-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}'+
'.cp-big:hover{transform:translateY(-2px)}'+
'.cp-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}'+
'.cp-zone{border:2px dashed transparent;border-radius:18px}'+
'.cp-zone.on{border-color:#7c3aed;background:#f3f0ff}'+
'.cp-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}'+
'.cp-main{display:flex;min-height:560px}'+
'.cp-preview{flex:1;padding:40px;display:flex;align-items:center;justify-content:center}'+
'.cp-card{background:#fff;border:1px solid #eceaf6;border-radius:14px;padding:24px;text-align:center;box-shadow:0 4px 20px rgba(30,20,60,.06);max-width:320px;width:100%}'+
'.cp-thumb{height:280px;display:flex;align-items:center;justify-content:center;background:#fafbfe;border-radius:10px;margin-bottom:14px;overflow:hidden}'+
'.cp-thumb img{max-width:100%;max-height:100%;object-fit:contain}'+
'.cp-nm{font-size:14px;font-weight:700;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
'.cp-mt{font-size:12px;color:#9a9aa5}'+
'.cp-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:30px;display:flex;flex-direction:column}'+
'.cp-side h2{font-size:24px;font-weight:900;text-align:center;margin-bottom:22px}'+
'.cp-levels{margin-bottom:20px}'+
'.cp-level{border:2px solid #eceaf6;border-radius:12px;padding:16px;margin-bottom:10px;cursor:pointer;transition:.2s;display:flex;align-items:center;gap:12px}'+
'.cp-level:hover{border-color:#7c3aed}'+
'.cp-level.active{border-color:#7c3aed;background:#f3f0ff}'+
'.cp-level .radio{width:20px;height:20px;border-radius:50%;border:2px solid #d1d5db;flex:none;display:flex;align-items:center;justify-content:center}'+
'.cp-level.active .radio{border-color:#7c3aed}'+
'.cp-level.active .radio::after{content:"";width:10px;height:10px;border-radius:50%;background:#7c3aed}'+
'.cp-level .info{flex:1}'+
'.cp-level .lt{font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.3px}'+
'.cp-level .ld{font-size:12px;color:#9a9aa5;margin-top:2px}'+
'.cp-level.extreme .lt{color:#dc2626}'+
'.cp-level.recommended .lt{color:#7c3aed}'+
'.cp-level.less .lt{color:#16a34a}'+
'.cp-target{border-top:1px solid #eceaf6;padding-top:18px;margin-top:6px}'+
'.cp-target-head{display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer}'+
'.cp-target-head input{width:18px;height:18px;accent-color:#7c3aed}'+
'.cp-target-head label{font-size:13px;font-weight:700;cursor:pointer}'+
'.cp-target-box{display:none}'+
'.cp-target-box.show{display:block}'+
'.cp-target-input{display:flex;gap:8px;align-items:center}'+
'.cp-target-input input{flex:1;padding:10px 14px;border:1px solid #ddd;border-radius:8px;font-size:14px}'+
'.cp-target-input select{padding:10px;border:1px solid #ddd;border-radius:8px;font-size:14px}'+
'.cp-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:auto}'+
'.cp-go:disabled{opacity:.5;cursor:not-allowed}'+
'.cp-busy{display:none;padding:60px 20px;text-align:center}'+
'.cp-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}'+
'.cp-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:26px}'+
'.cp-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,.08)}'+
'.cp-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);border-radius:999px;transition:width .3s}'+
'.cp-pct{font-size:36px;font-weight:900}'+
'.cp-done{display:none;text-align:center;padding:50px 20px}'+
'.cp-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}'+
'.cp-compare{display:flex;justify-content:center;gap:20px;margin:24px 0;flex-wrap:wrap}'+
'.cp-stat{background:#f7f6fc;border:1px solid #eceaf6;border-radius:12px;padding:18px 28px;min-width:160px}'+
'.cp-stat .lbl{font-size:12px;color:#9a9aa5;font-weight:700;text-transform:uppercase;margin-bottom:4px}'+
'.cp-stat .val{font-size:22px;font-weight:900}'+
'.cp-stat.before .val{color:#6b6b7a}'+
'.cp-stat.after .val{color:#16a34a}'+
'.cp-badge{display:inline-block;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;font-size:14px;font-weight:800;padding:6px 16px;border-radius:999px;margin-bottom:20px}'+
'.cp-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}'+
'.cp-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}'+
'@media(max-width:900px){.cp-main{flex-direction:column}.cp-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}'+
'</style>'+
'<div class="cp-wrap">'+
'<div id="cpPick"><div class="cp-hero"><h1>Compress PDF files</h1><p>Reduce PDF file size without losing quality. Free, private and unlimited.</p>'+
'<div class="cp-zone" id="cpZone"><button class="cp-big" id="cpBtn" type="button">Select PDF file</button><p class="cp-drop-hint">or drop PDF here</p></div></div></div>'+
'<div class="cp-work" id="cpWork"><div class="cp-main"><div class="cp-preview"><div class="cp-card"><div class="cp-thumb" id="cpThumb"><span style="color:#c3c6d4;font-size:30px">📄</span></div><div class="cp-nm" id="cpName"></div><div class="cp-mt" id="cpMeta"></div></div></div>'+
'<aside class="cp-side"><h2>Compression level</h2>'+
'<div class="cp-levels">'+
'<div class="cp-level extreme" data-level="extreme"><div class="radio"></div><div class="info"><div class="lt">Extreme Compression</div><div class="ld">Less quality, high compression</div></div></div>'+
'<div class="cp-level recommended active" data-level="recommended"><div class="radio"></div><div class="info"><div class="lt">Recommended Compression</div><div class="ld">Good quality, good compression</div></div></div>'+
'<div class="cp-level less" data-level="less"><div class="radio"></div><div class="info"><div class="lt">Less Compression</div><div class="ld">High quality, less compression</div></div></div>'+
'</div>'+
'<div class="cp-target"><div class="cp-target-head"><input type="checkbox" id="cpTargetCheck"><label for="cpTargetCheck">Set target file size</label></div>'+
'<div class="cp-target-box" id="cpTargetBox"><div class="cp-target-input"><input type="number" id="cpTargetVal" placeholder="100" min="1"><select id="cpTargetUnit"><option value="KB">KB</option><option value="MB">MB</option></select></div></div></div>'+
'<button class="cp-go" id="cpGo" type="button">Compress PDF →</button></aside></div></div>'+
'<div class="cp-busy" id="cpBusy"><h2>Compressing PDF...</h2><p class="fn" id="cpBusyName"></p><div class="cp-bar"><div id="cpBarFill"></div></div><div class="cp-pct" id="cpPct">0%</div></div>'+
'<div class="cp-done" id="cpDone"><div class="cp-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF compressed successfully!</h1><div class="cp-badge" id="cpBadge"></div>'+
'<div class="cp-compare"><div class="cp-stat before"><div class="lbl">Before</div><div class="val" id="cpBefore"></div></div><div class="cp-stat after"><div class="lbl">After</div><div class="val" id="cpAfter"></div></div></div>'+
'<a class="cp-dl" id="cpDl" href="#">⬇ Download compressed PDF</a><button class="cp-again" id="cpAgain" type="button">Compress another</button></div>'+
'<input type="file" id="cpFile" accept="application/pdf,.pdf" style="display:none">'+
'</div>';
var file=null;var level='recommended';
var LEVELS={extreme:{maxW:1000,q:0.5},recommended:{maxW:1400,q:0.7},less:{maxW:1800,q:0.85}};
var pick=document.getElementById('cpPick'),work=document.getElementById('cpWork'),busy=document.getElementById('cpBusy'),done=document.getElementById('cpDone');
var zone=document.getElementById('cpZone'),btn=document.getElementById('cpBtn'),inp=document.getElementById('cpFile');
var go=document.getElementById('cpGo'),nameEl=document.getElementById('cpName'),metaEl=document.getElementById('cpMeta'),thumbEl=document.getElementById('cpThumb');
function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
function dataURLtoBytes(d){var b=atob(d.split(',')[1]);var a=new Uint8Array(b.length);for(var i=0;i<b.length;i++){a[i]=b.charCodeAt(i);}return a;}
function pct(p){document.getElementById('cpPct').textContent=Math.round(p)+'%';document.getElementById('cpBarFill').style.width=p+'%';}
function addFile(f){
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){alert('Please select a PDF file.');return;}
 file=f;pick.style.display='none';work.style.display='block';
 nameEl.textContent=f.name;metaEl.textContent='Loading...';
 waitLib('pdfjsLib').then(function(ok){
  if(!ok){metaEl.textContent=fmtB(f.size);return;}
  window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
  f.arrayBuffer().then(function(buf){
   return window.pdfjsLib.getDocument({data:buf}).promise.then(function(doc){
    metaEl.textContent=doc.numPages+' pages • '+fmtB(f.size);
    doc.getPage(1).then(function(page){
     var vp=page.getViewport({scale:1});
     var scale=Math.min(1.5,280/vp.width);
     var vp2=page.getViewport({scale:scale});
     var canvas=document.createElement('canvas');
     canvas.width=Math.floor(vp2.width);canvas.height=Math.floor(vp2.height);
     page.render({canvasContext:canvas.getContext('2d'),viewport:vp2}).promise.then(function(){
      thumbEl.innerHTML='<img src="'+canvas.toDataURL('image/png')+'" alt="Preview">';
     });
    });
    doc.destroy();
   });
  }).catch(function(){metaEl.textContent=fmtB(f.size);});
 });
}
document.querySelectorAll('.cp-level').forEach(function(lv){
 lv.onclick=function(){
  document.querySelectorAll('.cp-level').forEach(function(x){x.classList.remove('active');});
  this.classList.add('active');
  level=this.getAttribute('data-level');
 };
});
var tCheck=document.getElementById('cpTargetCheck'),tBox=document.getElementById('cpTargetBox');
tCheck.onchange=function(){tBox.classList.toggle('show',this.checked);};
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};
function runPass(c){
 return file.arrayBuffer().then(function(buf){
  return window.pdfjsLib.getDocument({data:buf}).promise.then(function(jsdoc){
   return PDFLib.PDFDocument.create().then(function(out){
    var n=jsdoc.numPages;var chain=Promise.resolve();
    for(var p=1;p<=n;p++){
     (function(pg){
      chain=chain.then(function(){
       pct(10+((pg-1)/n)*80);
       return jsdoc.getPage(pg).then(function(page){
        var vp1=page.getViewport({scale:1});
        var scale=Math.min(c.maxW/vp1.width,2);
        var vp2=page.getViewport({scale:scale});
        var canvas=document.createElement('canvas');
        canvas.width=Math.floor(vp2.width);canvas.height=Math.floor(vp2.height);
        return page.render({canvasContext:canvas.getContext('2d'),viewport:vp2}).promise.then(function(){
         var bytes=dataURLtoBytes(canvas.toDataURL('image/jpeg',c.q));
         return out.embedJpg(bytes).then(function(img){
          var np=out.addPage([vp1.width,vp1.height]);
          np.drawImage(img,{x:0,y:0,width:vp1.width,height:vp1.height});
         });
        });
       });
      });
     })(p);
    }
    return chain.then(function(){return out.save();});
   });
  });
 });
}
go.onclick=function(){
 if(!file){return;}
 work.style.display='none';busy.style.display='block';done.style.display='none';
 document.getElementById('cpBusyName').textContent=file.name;
 pct(5);
 var useTarget=tCheck.checked;var targetBytes=0;
 if(useTarget){
  var tv=parseFloat(document.getElementById('cpTargetVal').value)||100;
  var tu=document.getElementById('cpTargetUnit').value;
  targetBytes=tu==='MB'?tv*1048576:tv*1024;
 }
 var cfg={maxW:LEVELS[level].maxW,q:LEVELS[level].q};
 var attempt=1;
 Promise.all([waitLib('pdfjsLib'),waitLib('PDFLib')]).then(function(ok){
  if(ok[0]===false||ok[1]===false){throw new Error('libs');}
  window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
  function doIt(c){
   runPass(c).then(function(bytes){
    if(useTarget&&bytes.length>targetBytes&&attempt<3){
     attempt++;
     doIt({q:Math.max(0.15,c.q-0.15),maxW:Math.max(500,c.maxW*0.8)});
    }else{
     showResult(bytes);
    }
   }).catch(function(){
    busy.style.display='none';work.style.display='block';
    alert('Error compressing PDF. Please try again.');
   });
  }
  doIt(cfg);
 });
};
function showResult(bytes){
 pct(100);
 setTimeout(function(){
  busy.style.display='none';done.style.display='block';
  var origSize=file.size;var newSize=bytes.length;
  var saved=Math.max(0,((origSize-newSize)/origSize)*100);
  document.getElementById('cpBefore').textContent=fmtB(origSize);
  document.getElementById('cpAfter').textContent=fmtB(newSize);
  document.getElementById('cpBadge').textContent=newSize<origSize?'↓ '+saved.toFixed(1)+'% smaller':'Already optimized';
  var blob=new Blob([bytes],{type:'application/pdf'});
  var u=URL.createObjectURL(blob);
  var dl=document.getElementById('cpDl');dl.href=u;dl.download='compressed-'+file.name;
 },300);
}
document.getElementById('cpAgain').onclick=function(){
 file=null;done.style.display='none';work.style.display='none';pick.style.display='block';
 thumbEl.innerHTML='<span style="color:#c3c6d4;font-size:30px">📄</span>';
 tCheck.checked=false;tBox.classList.remove('show');
};
})();
