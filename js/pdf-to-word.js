/* TronoPDF - PDF to Word v2 | live preview + garbled OCR fix + content modes */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
var TESS_SRC='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.0/dist/tesseract.min.js';
function loadJS(src){return new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=function(){res(true);};s.onerror=function(){rej(new Error('load fail'));};document.head.appendChild(s);});}
var tessLoading=null;
function loadTesseract(){
 if(window.Tesseract){return Promise.resolve(true);}
 if(!tessLoading){tessLoading=new Promise(function(res){loadJS(TESS_SRC,function(err){res(!err&&!!window.Tesseract);});});}
 return tessLoading;
}
function tessLang(c){if(c==='zho')return 'chi_sim';if(c==='zh2')return 'chi_tra';return c;}
function isGarbled(s){
 var clean=s.replace(/[\s0-9.,;:!?'"()\-–—/\\|+=%#*&@<>[\]{}]/g,'');
 if(clean.length<20)return false;
 var bad=0;
 for(var i=0;i<clean.length;i++){var c=clean.charCodeAt(i);
  if(c>=0xE000&&c<=0xF8FF)bad++;else if(c===0xFFFD)bad++;else if(c>=0x2500&&c<=0x259F)bad++;else if(c>=0x25A0&&c<=0x25FF)bad++;}
 return (bad/clean.length)>0.04;
}
var html='';
html+='<style>';
html+='.pw-wrap{max-width:1400px;margin:0 auto}';
html+='.pw-hero{text-align:center;padding:50px 16px 40px}';
html+='.pw-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.pw-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.pw-big{background:linear-gradient(135deg,#2b7cd3,#4a9be0);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(43,124,211,.35)}';
html+='.pw-big:hover{transform:translateY(-2px)}';
html+='.pw-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.pw-zone{border:2px dashed transparent;border-radius:18px}';
html+='.pw-zone.on{border-color:#2b7cd3;background:#eef6fd}';
html+='.pw-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden;padding:22px}';
html+='.pw-grid{display:grid;grid-template-columns:340px 1fr;gap:20px}';
html+='.pw-side{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px}';
html+='.pw-side h2{font-size:20px;font-weight:900;margin-bottom:6px}';
html+='.pw-sub{font-size:13px;color:#9a9aa5;margin-bottom:14px}';
html+='.pw-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}';
html+='.pw-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;background:#fff}';
html+='.pw-row{display:flex;gap:8px;align-items:center;margin-top:8px}';
html+='.pw-row input[type=number]{flex:1;min-width:0;padding:10px;border:1px solid #ddd;border-radius:10px;font-size:14px}';
html+='.pw-go{width:100%;background:linear-gradient(135deg,#2b7cd3,#4a9be0);color:#fff;font-size:17px;font-weight:800;padding:16px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(43,124,211,.35);margin-top:16px}';
html+='.pw-go:active{transform:scale(.98)}';
html+='.pw-dlrow{display:flex;gap:8px;margin-top:10px}';
html+='.pw-dl{flex:1;display:block;text-align:center;background:#16a34a;color:#fff;font-weight:800;font-size:15px;padding:14px;border-radius:12px;box-shadow:0 10px 24px rgba(22,163,74,.3)}';
html+='.pw-preview{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px;overflow:auto;max-height:760px}';
html+='.pw-preview h3{font-size:16px;font-weight:900;margin-bottom:12px}';
html+='.pw-empty{color:#9a9aa5;font-size:14px;text-align:center;padding:60px 20px}';
html+='.pw-page{border:1px solid #eceaf6;border-radius:10px;padding:14px;margin-bottom:14px;background:#fafbfe}';
html+='.pw-page h4{font-size:13px;font-weight:800;color:#2b7cd3;margin-bottom:8px}';
html+='.pw-page img{max-width:100%;border-radius:6px;border:1px solid #eceaf6;margin-bottom:8px}';
html+='.pw-page .txt{font-size:12px;line-height:1.6;color:#333;white-space:pre-wrap;max-height:180px;overflow:auto;background:#fff;border:1px solid #eceaf6;border-radius:6px;padding:10px}';
html+='.pw-busy{display:none;text-align:center;padding:60px 20px}';
html+='.pw-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.pw-busy .st{color:#7a7a85;font-size:15px;margin-bottom:26px}';
html+='.pw-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.pw-bar div{height:100%;width:0;background:linear-gradient(90deg,#2b7cd3,#4a9be0);transition:width .3s}';
html+='.pw-pct{font-size:36px;font-weight:900}';
html+='.pw-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);background:#16a34a;color:#fff;font-weight:800;padding:14px 28px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:all .3s;z-index:999;font-size:14px}';
html+='.pw-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}';
html+='.pw-toast.err{background:#dc2626}';
html+='@media(max-width:900px){.pw-grid{grid-template-columns:1fr}}';
html+='</style>';
html+='<div class="pw-wrap">';
html+='<div id="pwPick"><div class="pw-hero"><h1>PDF to Word</h1><p>Convert PDF to an editable Word document - with live preview, fast, free and private.</p>';
html+='<div class="pw-zone" id="pwZone"><button class="pw-big" id="pwBtn" type="button">Select PDF file</button><p class="pw-drop-hint">or drop a PDF here</p></div></div></div>';
html+='<div class="pw-work" id="pwWork"><div class="pw-grid">';
html+='<div class="pw-side"><h2>Convert settings</h2><p class="pw-sub">Runs fully in your browser</p>';
html+='<div class="pw-lbl">Content mode</div><select class="pw-inp" id="pwMode"><option value="both">Text + Page Image (best)</option><option value="text">Text only (editable)</option><option value="image">Page Image only (perfect look)</option></select>';
html+='<div class="pw-lbl">Language (fixes broken text)</div><select class="pw-inp" id="pwLang"><option value="eng">English</option><option value="hin">Hindi (हिन्दी)</option><option value="eng+hin">English + Hindi</option></select>';
html+='<div class="pw-lbl">Page range</div><div class="pw-row"><input type="number" id="pwFrom" min="1" value="1"/><span style="color:#9a9aa5">to</span><input type="number" id="pwTo" min="1" value="1"/></div>';
html+='<button class="pw-go" id="pwGo" type="button">Convert to Word →</button>';
html+='<div class="pw-dlrow"><a class="pw-dl" id="pwDl" href="#" style="display:none">⬇ Download .doc</a></div></div>';
html+='<div class="pw-preview"><h3>Live Preview</h3><div id="pwPages"><div class="pw-empty">Your converted pages will appear here after converting.</div></div></div>';
html+='</div></div>';
html+='<div class="pw-busy" id="pwBusy"><h2>Converting to Word...</h2><p class="st" id="pwStatus">Working...</p><div class="pw-bar"><div id="pwBarFill"></div></div><div class="pw-pct" id="pwPct">0%</div></div>';
html+='<div class="pw-toast" id="pwToast"></div>';
html+='<input type="file" id="pwFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var file=null,doc=null,totalPages=0,converted=[];
var pick=document.getElementById('pwPick'),work=document.getElementById('pwWork'),busy=document.getElementById('pwBusy');
var zone=document.getElementById('pwZone'),btn=document.getElementById('pwBtn'),inp=document.getElementById('pwFile');
var pagesBox=document.getElementById('pwPages'),dlEl=document.getElementById('pwDl');
var toastEl=document.getElementById('pwToast');
function toast(m,e){toastEl.textContent=m;toastEl.classList.toggle('err',!!e);toastEl.classList.add('show');clearTimeout(toastEl.__h);toastEl.__h=setTimeout(function(){toastEl.classList.remove('show');},2200);}
function pct(p){document.getElementById('pwPct').textContent=Math.round(p)+'%';document.getElementById('pwBarFill').style.width=p+'%';}
function setStatus(s){document.getElementById('pwStatus').textContent=s;}
btn.onclick=function(){inp.click();};
function loadFile(f){
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){toast('Please select a PDF file',true);return;}
 file=f;pick.style.display='none';work.style.display='block';busy.style.display='none';
 loadJS(PDFJS_SRC).then(function(){
  window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
  return f.arrayBuffer();
 }).then(function(b){return window.pdfjsLib.getDocument({data:b}).promise;}).then(function(d){
  doc=d;totalPages=d.numPages;
  document.getElementById('pwTo').value=totalPages;
  toast('✓ PDF loaded ('+totalPages+' pages)');
 }).catch(function(e){pick.style.display='block';work.style.display='none';toast('Could not read PDF',true);});
}
inp.onchange=function(){if(inp.files[0]){loadFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){loadFile(e.dataTransfer.files[0]);}};
function pageText(n){return doc.getPage(n).then(function(p){return p.getTextContent().then(function(tc){var s='';tc.items.forEach(function(it){s+=it.str+(it.hasEOL?'\n':' ');});return s;});});}
function pageCanvas(n){return doc.getPage(n).then(function(p){var v1=p.getViewport({scale:1});var s=Math.min(2,1400/v1.width);var vp=p.getViewport({scale:s});var cv=document.createElement('canvas');cv.width=Math.floor(vp.width);cv.height=Math.floor(vp.height);var cx=cv.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,cv.width,cv.height);return p.render({canvasContext:cx,viewport:vp}).promise.then(function(){return cv;});});}
function ocrCanvas(cv,lang){return window.Tesseract.recognize(cv,lang).then(function(r){return r.data.text;});}
document.getElementById('pwGo').onclick=function(){
 if(!file||!doc){toast('Select a PDF first',true);return;}
 var mode=document.getElementById('pwMode').value;
 var lang=tessLang(document.getElementById('pwLang').value);
 var from=Math.max(1,parseInt(document.getElementById('pwFrom').value)||1);
 var to=Math.min(totalPages,parseInt(document.getElementById('pwTo').value)||totalPages);
 if(from>to){toast('Invalid range',true);return;}
 work.style.display='none';busy.style.display='block';
 converted=[];pagesBox.innerHTML='';dlEl.style.display='none';
 pct(5);setStatus('Reading pages...');
 var total=to-from+1;var chain=Promise.resolve();
 for(var i=from;i<=to;i++){
  (function(num,idx){
   chain=chain.then(function(){
    setStatus('Processing page '+num+'...');
    return pageCanvas(num).then(function(cv){
     var img=cv.toDataURL('image/jpeg',0.92);
     var textP=(mode==='image')?Promise.resolve(''):pageText(num);
     return textP.then(function(txt){
      var useOcr=(mode!=='image')&&(txt.replace(/\s/g,'').length<20||isGarbled(txt));
      var textPromise=useOcr?loadTesseract().then(function(ok){if(!ok)return txt;return ocrCanvas(cv,lang);}):Promise.resolve(txt);
      return textPromise.then(function(finalText){
       converted.push({num:num,text:(mode==='image')?'':finalText,image:(mode==='text')?'':img});
       pct(5+((idx+1)/total)*90);
      });
     });
    });
   });
  })(i,i-from);
 }
 chain.then(function(){
  pct(100);setStatus('Done!');
  renderPreview();
  buildDownload();
  setTimeout(function(){busy.style.display='none';work.style.display='block';toast('✓ Word document ready!');},300);
 }).catch(function(e){busy.style.display='none';work.style.display='block';toast('Conversion failed: '+((e&&e.message)||e),true);});
};
function renderPreview(){
 pagesBox.innerHTML='';
 converted.forEach(function(p){
  var d=document.createElement('div');d.className='pw-page';
  d.innerHTML='<h4>Page '+p.num+'</h4>';
  if(p.image){var im=document.createElement('img');im.src=p.image;d.appendChild(im);}
  if(p.text){var t=document.createElement('div');t.className='txt';t.textContent=p.text;d.appendChild(t);}
  pagesBox.appendChild(d);
 });
}
function buildDocHTML(){
 var h='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Converted PDF</title><style>body{font-family:Calibri,Arial,sans-serif;font-size:12pt;margin:1in}p{margin:0 0 10pt}img{max-width:100%;height:auto}@page{size:A4;margin:1in}</style></head><body>';
 converted.forEach(function(p,i){
  if(i>0)h+='<br clear="all" style="page-break-before:always;mso-break-type:section-break">';
  h+='<div>';
  if(p.text){var esc=p.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');h+='<p>'+esc+'</p>';}
  if(p.image){h+='<p><img src="'+p.image+'"/></p>';}
  h+='</div>';
 });
 h+='</body></html>';
 return h;
}
function buildDownload(){
 var blob=new Blob(['\ufeff'+buildDocHTML()],{type:'application/msword'});
 dlEl.href=URL.createObjectURL(blob);
 dlEl.download=file.name.replace(/\.pdf$/i,'')+'.doc';
 dlEl.style.display='block';
}
})();
