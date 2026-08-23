/* TronoPDF - PDF to Word v1 | pdf.js render -> HTML -> .doc, browser-only */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
function loadJS(src){return new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=function(){res(true);};s.onerror=function(){rej(new Error('load fail'));};document.head.appendChild(s);});}
var html='';
html+='<style>';
html+='.pw-wrap{max-width:1000px;margin:0 auto}';
html+='.pw-hero{text-align:center;padding:50px 16px 40px}';
html+='.pw-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.pw-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.pw-big{background:linear-gradient(135deg,#2b7cd3,#4a9be0);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(43,124,211,.35)}';
html+='.pw-big:hover{transform:translateY(-2px)}';
html+='.pw-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.pw-zone{border:2px dashed transparent;border-radius:18px}';
html+='.pw-zone.on{border-color:#2b7cd3;background:#eef6fd}';
html+='.pw-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden;padding:26px}';
html+='.pw-side{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px;margin-bottom:20px}';
html+='.pw-side h2{font-size:20px;font-weight:900;margin-bottom:6px}';
html+='.pw-sub{font-size:13px;color:#9a9aa5;margin-bottom:14px}';
html+='.pw-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}';
html+='.pw-row{display:flex;gap:8px;align-items:center}';
html+='.pw-row input[type=number]{flex:1;padding:11px;border:1px solid #ddd;border-radius:10px;font-size:14px;background:#fff}';
html+='.pw-go{width:100%;background:linear-gradient(135deg,#2b7cd3,#4a9be0);color:#fff;font-size:17px;font-weight:800;padding:16px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(43,124,211,.35);margin-top:16px}';
html+='.pw-go:active{transform:scale(.98)}';
html+='.pw-busy{display:none;text-align:center;padding:60px 20px}';
html+='.pw-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.pw-busy .st{color:#7a7a85;font-size:15px;margin-bottom:26px}';
html+='.pw-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.pw-bar div{height:100%;width:0;background:linear-gradient(90deg,#2b7cd3,#4a9be0);transition:width .3s}';
html+='.pw-pct{font-size:36px;font-weight:900}';
html+='.pw-done{display:none;text-align:center;padding:50px 20px}';
html+='.pw-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.pw-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.pw-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='.pw-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);background:#16a34a;color:#fff;font-weight:800;padding:14px 28px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:all .3s;z-index:999;font-size:14px}';
html+='.pw-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}';
html+='.pw-toast.err{background:#dc2626}';
html+='</style>';
html+='<div class="pw-wrap">';
html+='<div id="pwPick"><div class="pw-hero"><h1>PDF to Word</h1><p>Convert PDF to an editable Word document - fast, free and private.</p>';
html+='<div class="pw-zone" id="pwZone"><button class="pw-big" id="pwBtn" type="button">Select PDF file</button><p class="pw-drop-hint">or drop a PDF here</p></div></div></div>';
html+='<div class="pw-work" id="pwWork">';
html+='<div class="pw-side"><h2>Convert settings</h2><p class="pw-sub">Everything runs in your browser</p>';
html+='<div class="pw-lbl">Page range</div><div class="pw-row"><input type="number" id="pwFrom" min="1" value="1"/><span style="color:#9a9aa5">to</span><input type="number" id="pwTo" min="1" value="1"/></div>';
html+='<button class="pw-go" id="pwGo" type="button">Convert to Word →</button></div>';
html+='</div>';
html+='<div class="pw-busy" id="pwBusy"><h2>Converting to Word...</h2><p class="st" id="pwStatus">Working...</p><div class="pw-bar"><div id="pwBarFill"></div></div><div class="pw-pct" id="pwPct">0%</div></div>';
html+='<div class="pw-done" id="pwDone"><div class="pw-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">Word document ready!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="pwDoneInfo"></p><a class="pw-dl" id="pwDl" href="#">⬇ Download .doc</a><button class="pw-again" id="pwAgain" type="button">Convert another</button></div>';
html+='<div class="pw-toast" id="pwToast"></div>';
html+='<input type="file" id="pwFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var file=null,doc=null,totalPages=0;
var pick=document.getElementById('pwPick'),work=document.getElementById('pwWork'),busy=document.getElementById('pwBusy'),done=document.getElementById('pwDone');
var zone=document.getElementById('pwZone'),btn=document.getElementById('pwBtn'),inp=document.getElementById('pwFile');
var toastEl=document.getElementById('pwToast');
function toast(msg,err){toastEl.textContent=msg;toastEl.classList.toggle('err',!!err);toastEl.classList.add('show');clearTimeout(toastEl.__h);toastEl.__h=setTimeout(function(){toastEl.classList.remove('show');},2200);}
function pct(p){document.getElementById('pwPct').textContent=Math.round(p)+'%';document.getElementById('pwBarFill').style.width=p+'%';}
function setStatus(s){document.getElementById('pwStatus').textContent=s;}
btn.onclick=function(){inp.click();};
function loadFile(f){
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){toast('Please select a PDF file',true);return;}
 file=f;pick.style.display='none';done.style.display='none';work.style.display='block';busy.style.display='none';
 loadJS(PDFJS_SRC).then(function(){
  window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
  return f.arrayBuffer();
 }).then(function(b){
  return window.pdfjsLib.getDocument({data:b}).promise;
 }).then(function(d){
  doc=d;totalPages=d.numPages;
  document.getElementById('pwTo').value=totalPages;
  toast('✓ PDF loaded ('+totalPages+' pages)');
 }).catch(function(err){
  pick.style.display='block';work.style.display='none';
  toast('Could not read PDF: '+((err&&err.message)||err),true);
 });
}
inp.onchange=function(){if(inp.files[0]){loadFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){loadFile(e.dataTransfer.files[0]);}};
function renderPageToCanvas(num){
 return doc.getPage(num).then(function(page){
  var vp1=page.getViewport({scale:1});
  var scale=Math.min(2,1400/vp1.width);
  var vp=page.getViewport({scale:scale});
  var cv=document.createElement('canvas');cv.width=Math.floor(vp.width);cv.height=Math.floor(vp.height);
  var cx=cv.getContext('2d');
  cx.fillStyle='#fff';cx.fillRect(0,0,cv.width,cv.height);
  return page.render({canvasContext:cx,viewport:vp}).promise.then(function(){
   return {canvas:cv,originalWidth:vp1.width,originalHeight:vp1.height,scale:scale};
  });
 });
}
function getPageText(num){
 return doc.getPage(num).then(function(page){
  return page.getTextContent().then(function(tc){
   var lines=[];var curY=-1;var line='';
   tc.items.forEach(function(it){
    var y=Math.round(it.transform[5]);
    if(curY>=0&&Math.abs(y-curY)>5){lines.push(line);line='';}
    line+=it.str+(it.hasEOL?'\n':' ');
    curY=y;
   });
   if(line)lines.push(line);
   return lines.join('\n');
  });
 });
}
function buildDocHTML(pages){
 var html='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">';
 html+='<head><meta charset="utf-8"><title>Converted PDF</title>';
 html+='<style>body{font-family:Calibri,Arial,sans-serif;font-size:12pt;margin:1in}p{margin:0 0 10pt}img{max-width:100%;height:auto}@page{size:A4;margin:1in}</style></head><body>';
 pages.forEach(function(p,i){
  if(i>0){html+='<br clear="all" style="page-break-before:always;mso-break-type:section-break">';}
  html+='<div><p><b>--- Page '+(i+1)+' ---</b></p>';
  if(p.text&&p.text.trim()){
   var escaped=p.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
   html+='<p>'+escaped+'</p>';
  }
  if(p.image){
   html+='<p><img src="'+p.image+'" alt="Page '+(i+1)+'"/></p>';
  }
  html+='</div>';
 });
 html+='</body></html>';
 return html;
}
document.getElementById('pwGo').onclick=function(){
 if(!file||!doc){toast('Please select a PDF first',true);return;}
 var from=Math.max(1,parseInt(document.getElementById('pwFrom').value)||1);
 var to=Math.min(totalPages,parseInt(document.getElementById('pwTo').value)||totalPages);
 if(from>to){toast('Invalid page range',true);return;}
 work.style.display='none';done.style.display='none';busy.style.display='block';
 pct(5);setStatus('Reading pages...');
 var pages=[];
 var total=to-from+1;
 var chain=Promise.resolve();
 for(var i=from;i<=to;i++){
  (function(num,idx){
   chain=chain.then(function(){
    setStatus('Processing page '+num+' of '+totalPages+'...');
    return Promise.all([getPageText(num),renderPageToCanvas(num)]).then(function(res){
     var text=res[0];
     var rend=res[1];
     var img=rend.canvas.toDataURL('image/jpeg',0.92);
     pages.push({text:text,image:img,num:num});
     pct(5+((idx+1)/total)*85);
    });
   });
  })(i,i-from);
 }
 chain.then(function(){
  setStatus('Building Word document...');
  pct(95);
  var docHtml=buildDocHTML(pages);
  var blob=new Blob(['\ufeff'+docHtml],{type:'application/msword'});
  pct(100);setStatus('Done!');
  setTimeout(function(){
   busy.style.display='none';done.style.display='block';
   document.getElementById('pwDoneInfo').textContent=pages.length+' page(s) • '+(blob.size/1024).toFixed(1)+' KB';
   var dl=document.getElementById('pwDl');
   dl.href=URL.createObjectURL(blob);
   dl.download=file.name.replace(/\.pdf$/i,'')+'.doc';
   toast('✓ Word document ready!');
  },300);
 }).catch(function(err){
  busy.style.display='none';work.style.display='block';
  toast('Conversion failed: '+((err&&err.message)||err),true);
 });
};
document.getElementById('pwAgain').onclick=function(){
 done.style.display='none';pick.style.display='block';
};
})();
