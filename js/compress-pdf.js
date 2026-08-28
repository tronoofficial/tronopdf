/* TronoPDF - Compress PDF v4 | Main-thread (no crash) + Multi-file + Error-safe */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';

function loadJS(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(false);};s.onerror=function(){cb(true);};document.head.appendChild(s);}
loadJS(PDFJS_SRC,function(e){if(!e&&window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;}});
loadJS(PDFLIB_SRC,function(){});

function waitLibs(){
  return new Promise(function(res){
    var t=0;(function w(){
      if(window.pdfjsLib&&window.PDFLib){res(true);return;}
      if(t>60){res(false);return;}
      t++;setTimeout(w,500);
    })();
  });
}
function yieldUI(){return new Promise(function(r){setTimeout(r,0);});}
function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}

var LEVELS={extreme:{maxW:1000,q:0.5},recommended:{maxW:1400,q:0.7},less:{maxW:1800,q:0.85}};
var level='recommended';
var files=[];
var results=[];

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
'.cp-card{background:#fff;border:1px solid #eceaf6;border-radius:14px;padding:24px;box-shadow:0 4px 20px rgba(30,20,60,.06);max-width:360px;width:100%}'+
'.cp-thumb{height:220px;display:flex;align-items:center;justify-content:center;background:#fafbfe;border-radius:10px;margin-bottom:14px;overflow:hidden}'+
'.cp-thumb img{max-width:100%;max-height:100%;object-fit:contain}'+
'.cp-flist{max-height:120px;overflow:auto;margin-top:10px}'+
'.cp-frow{display:flex;justify-content:space-between;gap:8px;font-size:12.5px;color:#4b5563;padding:6px 8px;border-radius:8px;background:#fafbfe;margin-bottom:6px}'+
'.cp-frow b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:70%}'+
'.cp-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:30px;display:flex;flex-direction:column}'+
'.cp-side h2{font-size:24px;font-weight:900;text-align:center;margin-bottom:22px}'+
'.cp-level{border:2px solid #eceaf6;border-radius:12px;padding:16px;margin-bottom:10px;cursor:pointer;transition:.2s;display:flex;align-items:center;gap:12px}'+
'.cp-level:hover{border-color:#7c3aed}'+
'.cp-level.active{border-color:#7c3aed;background:#f3f0ff}'+
'.cp-level .radio{width:20px;height:20px;border-radius:50%;border:2px solid #d1d5db;flex:none;display:flex;align-items:center;justify-content:center}'+
'.cp-level.active .radio{border-color:#7c3aed}'+
'.cp-level.active .radio::after{content:"";width:10px;height:10px;border-radius:50%;background:#7c3aed}'+
'.cp-level .lt{font-size:13px;font-weight:800;text-transform:uppercase}'+
'.cp-level .ld{font-size:12px;color:#9a9aa5;margin-top:2px}'+
'.cp-level.extreme .lt{color:#dc2626}.cp-level.recommended .lt{color:#7c3aed}.cp-level.less .lt{color:#16a34a}'+
'.cp-target{border-top:1px solid #eceaf6;padding-top:18px;margin-top:6px}'+
'.cp-target-head{display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer}'+
'.cp-target-head input{width:18px;height:18px;accent-color:#7c3aed}'+
'.cp-target-head label{font-size:13px;font-weight:700;cursor:pointer}'+
'.cp-target-box{display:none}.cp-target-box.show{display:block}'+
'.cp-target-input{display:flex;gap:8px}'+
'.cp-target-input input{flex:1;padding:10px 14px;border:1px solid #ddd;border-radius:8px;font-size:14px}'+
'.cp-target-input select{padding:10px;border:1px solid #ddd;border-radius:8px}'+
'.cp-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:auto}'+
'.cp-go:disabled{opacity:.5;cursor:not-allowed}'+
'.cp-busy{display:none;padding:60px 20px;text-align:center}'+
'.cp-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}'+
'.cp-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:26px}'+
'.cp-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}'+
'.cp-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);border-radius:999px;transition:width .3s}'+
'.cp-pct{font-size:36px;font-weight:900}'+
'.cp-done{display:none;text-align:center;padding:50px 20px}'+
'.cp-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}'+
'.cp-results{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;max-width:1100px;margin:26px auto;text-align:left}'+
'.cp-rcard{background:#fff;border:1px solid #eceaf6;border-radius:14px;padding:22px}'+
'.cp-rcard .nm{font-weight:800;font-size:14px;margin-bottom:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
'.cp-rcard .sz{font-size:14px;color:#6b6b7a;margin-bottom:6px}'+
'.cp-rcard .sz b{color:#16a34a}'+
'.cp-badge{display:inline-block;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;font-size:12.5px;font-weight:800;padding:5px 14px;border-radius:999px;margin-bottom:12px}'+
'.cp-badge.bad{background:#f59e0b}'+
'.cp-rcard input{width:100%;padding:9px 12px;border:1px solid #ddd;border-radius:8px;font-size:13px;margin-bottom:12px}'+
'.cp-rcard .dl{display:block;text-align:center;background:#16a34a;color:#fff;font-weight:800;font-size:15px;padding:13px;border-radius:10px;text-decoration:none}'+
'.cp-err{background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;font-size:13px;border-radius:10px;padding:12px}'+
'.cp-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-top:10px}'+
'@media(max-width:900px){.cp-main{flex-direction:column}.cp-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}'+
'</style>'+
'<div class="cp-wrap">'+
'<div id="cpPick"><div class="cp-hero"><h1>Compress PDF files</h1><p>Reduce PDF file size without losing quality. Free, private and unlimited. Select multiple files at once.</p>'+
'<div class="cp-zone" id="cpZone"><button class="cp-big" id="cpBtn" type="button">Select PDF files</button><p class="cp-drop-hint">or drop PDFs here (multiple allowed)</p></div></div></div>'+
'<div class="cp-work" id="cpWork"><div class="cp-main"><div class="cp-preview"><div class="cp-card"><div class="cp-thumb" id="cpThumb"><span style="color:#c3c6d4;font-size:30px">📄</span></div><div class="cp-flist" id="cpList"></div></div></div>'+
'<aside class="cp-side"><h2>Compression level</h2>'+
'<div class="cp-level extreme" data-level="extreme"><div class="radio"></div><div><div class="lt">Extreme Compression</div><div class="ld">Less quality, high compression</div></div></div>'+
'<div class="cp-level recommended active" data-level="recommended"><div class="radio"></div><div><div class="lt">Recommended Compression</div><div class="ld">Good quality, good compression</div></div></div>'+
'<div class="cp-level less" data-level="less"><div class="radio"></div><div><div class="lt">Less Compression</div><div class="ld">High quality, less compression</div></div></div>'+
'<div class="cp-target"><div class="cp-target-head"><input type="checkbox" id="cpTargetCheck"><label for="cpTargetCheck">Set target file size</label></div>'+
'<div class="cp-target-box" id="cpTargetBox"><div class="cp-target-input"><input type="number" id="cpTargetVal" placeholder="100" min="1"><select id="cpTargetUnit"><option value="KB">KB</option><option value="MB">MB</option></select></div></div></div>'+
'<button class="cp-go" id="cpGo" type="button">Compress PDF →</button></aside></div></div>'+
'<div class="cp-busy" id="cpBusy"><h2>Compressing PDF...</h2><p class="fn" id="cpBusyName"></p><div class="cp-bar"><div id="cpBarFill"></div></div><div class="cp-pct" id="cpPct">0%</div></div>'+
'<div class="cp-done" id="cpDone"><div class="cp-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">Compression complete!</h1><div class="cp-results" id="cpResults"></div><button class="cp-again" id="cpAgain" type="button">Compress more files</button></div>'+
'<input type="file" id="cpFile" accept="application/pdf,.pdf" multiple style="display:none">'+
'</div>';

var pick=document.getElementById('cpPick'),work=document.getElementById('cpWork'),busy=document.getElementById('cpBusy'),done=document.getElementById('cpDone'),
zone=document.getElementById('cpZone'),btn=document.getElementById('cpBtn'),inp=document.getElementById('cpFile'),go=document.getElementById('cpGo'),
listEl=document.getElementById('cpList'),thumbEl=document.getElementById('cpThumb'),
tCheck=document.getElementById('cpTargetCheck'),tBox=document.getElementById('cpTargetBox');

function pct(p){document.getElementById('cpPct').textContent=Math.round(p)+'%';document.getElementById('cpBarFill').style.width=p+'%';}

async function pass(file,cfg,onProg){
  var data=await file.arrayBuffer();
  var jsdoc=await window.pdfjsLib.getDocument({data:data}).promise;
  var out=await window.PDFLib.PDFDocument.create();
  var n=jsdoc.numPages;
  for(var p=1;p<=n;p++){
    var page=await jsdoc.getPage(p);
    var vp1=page.getViewport({scale:1});
    var scale=Math.min(cfg.maxW/vp1.width,2);
    var vp2=page.getViewport({scale:scale});
    var canvas=document.createElement('canvas');
    canvas.width=Math.floor(vp2.width);canvas.height=Math.floor(vp2.height);
    await page.render({canvasContext:canvas.getContext('2d'),viewport:vp2}).promise;
    var jpg=canvas.toDataURL('image/jpeg',cfg.q);
    var img=await out.embedJpg(jpg);
    var np=out.addPage([vp1.width,vp1.height]);
    np.drawImage(img,{x:0,y:0,width:vp1.width,height:vp1.height});
    canvas.width=0;canvas.height=0;
    onProg(8+((p-1)/n)*80,'Processing page '+p+' of '+n+' — '+file.name);
    await yieldUI();
  }
  var bytes=await out.save();
  try{await jsdoc.destroy();}catch(e){}
  return bytes;
}
async function compressOne(file,cfg,targetBytes,onProg){
  var c={q:cfg.q,maxW:cfg.maxW};
  var bytes=await pass(file,c,onProg);
  var attempt=1;
  while(targetBytes>0&&bytes.length>targetBytes&&attempt<3){
    attempt++;
    c={q:Math.max(0.15,c.q-0.15),maxW:Math.max(500,c.maxW*0.8)};
    onProg(88,'Adjusting quality (attempt '+attempt+') — '+file.name);
    bytes=await pass(file,c,onProg);
  }
  return bytes;
}

function addFiles(list){
  for(var i=0;i<list.length;i++){
    var f=list[i];
    if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){continue;}
    files.push(f);
  }
  if(!files.length){showErr('Please select PDF files only.');return;}
  pick.style.display='none';work.style.display='block';
  renderList();
  renderThumb(files[0]);
}
function renderList(){
  var h='';
  for(var i=0;i<files.length;i++){h+='<div class="cp-frow"><b>'+esc(files[i].name)+'</b><span>'+fmtB(files[i].size)+'</span></div>';}
  listEl.innerHTML=h;
}
function esc(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function renderThumb(f){
  waitLibs().then(function(ok){
    if(!ok||!window.pdfjsLib){return;}
    f.arrayBuffer().then(function(buf){
      return window.pdfjsLib.getDocument({data:buf}).promise;
    }).then(function(doc){
      return doc.getPage(1).then(function(page){
        var vp=page.getViewport({scale:1});
        var s=Math.min(1.5,220/vp.width);
        var vp2=page.getViewport({scale:s});
        var c=document.createElement('canvas');c.width=Math.floor(vp2.width);c.height=Math.floor(vp2.height);
        return page.render({canvasContext:c.getContext('2d'),viewport:vp2}).promise.then(function(){
          thumbEl.innerHTML='<img src="'+c.toDataURL('image/png')+'" alt="Preview">';
          doc.destroy();
        });
      });
    }).catch(function(){});
  });
}
function showErr(m){
  var t=document.createElement('div');
  t.textContent=m;
  t.style.cssText='position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#b91c1c;color:#fff;padding:12px 24px;border-radius:999px;font-size:14px;font-weight:600;z-index:9999';
  document.body.appendChild(t);setTimeout(function(){t.remove();},2600);
}

async function start(){
  if(!files.length){return;}
  var ok=await waitLibs();
  if(!ok){showErr('Libraries failed to load. Check internet & retry.');return;}
  work.style.display='none';busy.style.display='block';done.style.display='none';
  results=[];
  var targetBytes=0;
  if(tCheck.checked){
    var tv=parseFloat(document.getElementById('cpTargetVal').value)||100;
    var tu=document.getElementById('cpTargetUnit').value;
    targetBytes=tu==='MB'?tv*1048576:tv*1024;
  }
  var cfg=LEVELS[level];
  for(var i=0;i<files.length;i++){
    var f=files[i];
    document.getElementById('cpBusyName').textContent=f.name;
    try{
      var bytes=await compressOne(f,cfg,targetBytes,function(p,m){pct(((i+ (p/100)) /files.length)*100);document.getElementById('cpBusyName').textContent=m;});
      results.push({name:f.name,orig:f.size,bytes:bytes});
    }catch(err){
      var msg=(err&&err.name==='PasswordException')?'Password-protected PDF':('Could not compress');
      results.push({name:f.name,orig:f.size,error:msg});
    }
  }
  pct(100);
  setTimeout(showResults,300);
}
function showResults(){
  busy.style.display='none';done.style.display='block';
  var box=document.getElementById('cpResults');box.innerHTML='';
  results.forEach(function(r){
    var card=document.createElement('div');card.className='cp-rcard';
    if(r.error){
      card.innerHTML='<div class="nm">'+esc(r.name)+'</div><div class="cp-err">⚠ '+r.error+'</div>';
    }else{
      var saved=Math.max(0,((r.orig-r.bytes.length)/r.orig)*100);
      var blob=new Blob([r.bytes],{type:'application/pdf'});
      var url=URL.createObjectURL(blob);
      var base='compressed-'+r.name.replace(/\.pdf$/i,'');
      card.innerHTML='<div class="nm">'+esc(r.name)+'</div>'+
        '<div class="sz">'+fmtB(r.orig)+' → <b>'+fmtB(r.bytes.length)+'</b></div>'+
        '<span class="cp-badge'+(r.bytes.length<r.orig?'':' bad')+'">'+(r.bytes.length<r.orig?('↓ '+saved.toFixed(1)+'% smaller'):'Already optimized')+'</span>'+
        '<input type="text" value="'+esc(base)+'" data-rename>'+
        '<a class="dl" href="'+url+'" download="'+esc(base)+'.pdf">⬇ Download PDF</a>';
      var inpR=card.querySelector('[data-rename]');
      var dlR=card.querySelector('.dl');
      inpR.oninput=function(){dlR.setAttribute('download',inpR.value+'.pdf');};
    }
    box.appendChild(card);
  });
}

document.querySelectorAll('.cp-level').forEach(function(lv){
  lv.onclick=function(){
    document.querySelectorAll('.cp-level').forEach(function(x){x.classList.remove('active');});
    this.classList.add('active');level=this.getAttribute('data-level');
  };
});
tCheck.onchange=function(){tBox.classList.toggle('show',this.checked);};
btn.onclick=function(){inp.click();};
inp.onchange=function(){addFiles(inp.files);inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');addFiles(e.dataTransfer.files);};
go.onclick=start;
document.getElementById('cpAgain').onclick=function(){
  files=[];results=[];
  done.style.display='none';work.style.display='none';pick.style.display='block';
  thumbEl.innerHTML='<span style="color:#c3c6d4;font-size:30px">📄</span>';
  tCheck.checked=false;tBox.classList.remove('show');
};
})();
