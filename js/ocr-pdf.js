/* TronoPDF - OCR PDF v1 | Tesseract.js in-browser, eng+hin, progress, copy/txt */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
var TESS_SRC='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.0/dist/tesseract.min.js';
function loadJS(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(false);};s.onerror=function(){cb(true);};document.head.appendChild(s);}
loadJS(PDFJS_SRC,function(e){if(!e&&window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;}});
loadJS(TESS_SRC,function(){});
function waitLib(name){return new Promise(function(res){var t=0;(function w(){if(window[name]){res(true);return;}if(t>60){res(false);return;}t++;setTimeout(w,500);})();});}
var html='';
html+='<style>';
html+='.oc-wrap{max-width:1200px;margin:0 auto}';
html+='.oc-hero{text-align:center;padding:50px 16px 40px}';
html+='.oc-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.oc-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.oc-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.oc-big:hover{transform:translateY(-2px)}';
html+='.oc-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.oc-zone{border:2px dashed transparent;border-radius:18px}';
html+='.oc-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.oc-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden;padding:26px}';
html+='.oc-grid{display:grid;grid-template-columns:340px 1fr;gap:20px}';
html+='.oc-side{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px}';
html+='.oc-side h2{font-size:20px;font-weight:900;margin-bottom:6px}';
html+='.oc-sub{font-size:13px;color:#9a9aa5;margin-bottom:14px}';
html+='.oc-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}';
html+='.oc-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;background:#fff}';
html+='.oc-row{display:flex;gap:8px;align-items:center;margin-top:8px}';
html+='.oc-row input[type=number]{flex:1;padding:10px;border:1px solid #ddd;border-radius:10px;font-size:14px}';
html+='.oc-go{width:100%;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:17px;font-weight:800;padding:16px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:16px}';
html+='.oc-out{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px;display:flex;flex-direction:column}';
html+='.oc-out h3{font-size:16px;font-weight:900;margin-bottom:10px}';
html+='.oc-text{flex:1;min-height:380px;width:100%;border:1px solid #eceaf6;border-radius:10px;padding:14px;font-size:14px;line-height:1.6;resize:vertical;font-family:inherit;background:#fafbfe}';
html+='.oc-actions{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}';
html+='.oc-actions button{flex:1;border:none;border-radius:10px;padding:13px;font-size:14px;font-weight:800;cursor:pointer}';
html+='.oc-copy{background:#7c3aed;color:#fff}';
html+='.oc-txt{background:#16a34a;color:#fff}';
html+='.oc-busy{display:none;text-align:center;padding:40px 20px}';
html+='.oc-busy h2{font-size:24px;font-weight:900;margin-bottom:6px}';
html+='.oc-busy .st{color:#7a7a85;font-size:14px;margin-bottom:20px}';
html+='.oc-bar{max-width:560px;margin:0 auto 14px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.oc-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .2s}';
html+='.oc-pct{font-size:30px;font-weight:900}';
html+='@media(max-width:900px){.oc-grid{grid-template-columns:1fr}}';
html+='</style>';
html+='<div class="oc-wrap">';
html+='<div id="ocPick"><div class="oc-hero"><h1>OCR PDF</h1><p>Turn scanned PDFs into selectable, searchable text - English & Hindi.</p>';
html+='<div class="oc-zone" id="ocZone"><button class="oc-big" id="ocBtn" type="button">Select PDF file</button><p class="oc-drop-hint">or drop a scanned PDF here</p></div></div></div>';
html+='<div class="oc-work" id="ocWork"><div class="oc-grid">';
html+='<div class="oc-side"><h2>OCR settings</h2><p class="oc-sub">Runs fully in your browser</p>';
html+='<div class="oc-lbl">Language</div><select class="oc-inp" id="ocLang"><option value="eng">English</option><option value="hin">Hindi (हिन्दी)</option><option value="eng+hin">English + Hindi</option></select>';
html+='<div class="oc-lbl">Page range</div><div class="oc-row"><input type="number" id="ocFrom" min="1" value="1"/><span style="color:#9a9aa5">to</span><input type="number" id="ocTo" min="1" value="1"/></div>';
html+='<button class="oc-go" id="ocGo" type="button">Extract Text (OCR) →</button></div>';
html+='<div class="oc-out" id="ocOut"><h3>Extracted text</h3><textarea class="oc-text" id="ocText" placeholder="Your extracted text will appear here..."></textarea>';
html+='<div class="oc-actions"><button class="oc-copy" id="ocCopy" type="button">📋 Copy Text</button><button class="oc-txt" id="ocTxt" type="button">⬇ Download .txt</button></div></div>';
html+='</div>';
html+='<div class="oc-busy" id="ocBusy"><h2>Running OCR...</h2><p class="st" id="ocStatus">Loading engine...</p><div class="oc-bar"><div id="ocBarFill"></div></div><div class="oc-pct" id="ocPct">0%</div></div>';
html+='</div>';
html+='<input type="file" id="ocFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var file=null,doc=null,totalPages=0;
var pick=document.getElementById('ocPick'),work=document.getElementById('ocWork'),busy=document.getElementById('ocBusy');
var zone=document.getElementById('ocZone'),btn=document.getElementById('ocBtn'),inp=document.getElementById('ocFile');
var outBox=document.getElementById('ocOut'),textEl=document.getElementById('ocText');
var statusEl=document.getElementById('ocStatus');
function pct(p){document.getElementById('ocPct').textContent=Math.round(p)+'%';document.getElementById('ocBarFill').style.width=p+'%';}
function addFile(f){
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){alert('Please select a PDF file.');return;}
 file=f;pick.style.display='none';work.style.display='block';busy.style.display='none';
 waitLib('pdfjsLib').then(function(ok){
  if(!ok){alert('Could not load PDF engine.');return;}
  window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
  f.arrayBuffer().then(function(b){
   return window.pdfjsLib.getDocument({data:b}).promise.then(function(d){
    doc=d;totalPages=d.numPages;
    document.getElementById('ocTo').value=totalPages;
   });
  });
 });
}
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};
function renderPageCanvas(num){
 return doc.getPage(num).then(function(page){
  var vp1=page.getViewport({scale:1});
  var scale=Math.min(2.5,1600/vp1.width);
  var vp=page.getViewport({scale:scale});
  var cv=document.createElement('canvas');cv.width=Math.floor(vp.width);cv.height=Math.floor(vp.height);
  var cx=cv.getContext('2d');
  cx.fillStyle='#fff';cx.fillRect(0,0,cv.width,cv.height);
  return page.render({canvasContext:cx,viewport:vp}).promise.then(function(){return cv;});
 });
}
document.getElementById('ocGo').onclick=function(){
 if(!file||!doc){alert('Please select a PDF first.');return;}
 var lang=document.getElementById('ocLang').value;
 var from=Math.max(1,parseInt(document.getElementById('ocFrom').value)||1);
 var to=Math.min(totalPages,parseInt(document.getElementById('ocTo').value)||totalPages);
 if(from>to){alert('Invalid page range.');return;}
 work.style.display='none';busy.style.display='block';
 textEl.value='';
 pct(2);statusEl.textContent='Loading OCR engine (first time may take a moment)...';
 waitLib('Tesseract').then(function(ok){
  if(!ok){throw new Error('OCR engine failed to load. Check internet.');}
  var full='';
  var chain=Promise.resolve();
  var total=to-from+1;
  for(var i=from;i<=to;i++){
   (function(num){
    chain=chain.then(function(){
     statusEl.textContent='OCR page '+num+' of '+totalPages+'...';
     return renderPageCanvas(num).then(function(cv){
      return window.Tesseract.recognize(cv,lang,{
       logger:function(m){
        if(m.status==='recognizing text'){
         var base=(num-from);
         pct(((base+m.progress)/total)*95+2);
        }
       }
      }).then(function(r){
       full+='--- Page '+num+' ---\n'+r.data.text+'\n\n';
       textEl.value=full;
      });
     });
    });
   })(i);
  }
  return chain.then(function(){
   pct(100);statusEl.textContent='Done!';
   setTimeout(function(){
    busy.style.display='none';work.style.display='block';
   },300);
  });
 }).catch(function(err){
  busy.style.display='none';work.style.display='block';
  alert('OCR error: '+((err&&err.message)||err));
 });
};
document.getElementById('ocCopy').onclick=function(){
 if(!textEl.value){alert('No text yet. Run OCR first.');return;}
 textEl.select();
 try{document.execCommand('copy');}catch(e){}
 if(navigator.clipboard){navigator.clipboard.writeText(textEl.value);}
};
document.getElementById('ocTxt').onclick=function(){
 if(!textEl.value){alert('No text yet. Run OCR first.');return;}
 var blob=new Blob([textEl.value],{type:'text/plain'});
 var a=document.createElement('a');
 a.href=URL.createObjectURL(blob);
 a.download=(file?file.name.replace(/\.pdf$/i,''):'ocr')+'.txt';
 document.body.appendChild(a);a.click();document.body.removeChild(a);
};
})();
