/* TronoPDF - Split PDF v1 | extract pages, split ranges */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
function loadJS(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(false);};s.onerror=function(){cb(true);};document.head.appendChild(s);}
loadJS(PDFJS_SRC,function(e){if(!e&&window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;}});
loadJS(PDFLIB_SRC,function(){});
var pdfjsReady=null;
function ensurePdfjs(){
 if(pdfjsReady){return pdfjsReady;}
 pdfjsReady=new Promise(function(res){
  var tries=0;
  (function wait(){
   if(window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;res(true);return;}
   if(tries>40){res(false);return;}
   tries++;setTimeout(wait,500);
  })();
 });
 return pdfjsReady;
}
root.innerHTML='<style>'+
'.sp-wrap{max-width:1000px;margin:0 auto;text-align:center}'+
'.sp-hero{padding:50px 16px 40px}'+
'.sp-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}'+
'.sp-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}'+
'.sp-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}'+
'.sp-big:hover{transform:translateY(-2px)}'+
'.sp-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}'+
'.sp-zone{border:2px dashed transparent;border-radius:18px}'+
'.sp-zone.on{border-color:#7c3aed;background:#f3f0ff}'+
'.sp-work{display:none;background:#f7f6fc;border-radius:14px;padding:40px;margin-top:20px}'+
'.sp-file{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:20px;display:flex;align-items:center;gap:16px;margin-bottom:20px}'+
'.sp-file .ic{width:50px;height:50px;border-radius:10px;background:#fdeaea;display:flex;align-items:center;justify-content:center;font-size:24px}'+
'.sp-file .info{flex:1;text-align:left}'+
'.sp-file .nm{font-size:14px;font-weight:700;margin-bottom:4px}'+
'.sp-file .mt{font-size:12px;color:#9a9aa5}'+
'.sp-options{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:24px;text-align:left;margin-bottom:20px}'+
'.sp-options h3{font-size:16px;font-weight:800;margin-bottom:12px}'+
'.sp-opt{display:flex;align-items:center;gap:10px;margin-bottom:10px;cursor:pointer}'+
'.sp-opt input{width:18px;height:18px;accent-color:#7c3aed}'+
'.sp-opt label{font-size:14px;font-weight:600;cursor:pointer}'+
'.sp-range{display:none;margin-top:12px}'+
'.sp-range.show{display:block}'+
'.sp-range input{width:100%;padding:10px 14px;border:1px solid #ddd;border-radius:8px;font-size:14px}'+
'.sp-range small{display:block;margin-top:6px;color:#9a9aa5;font-size:12px}'+
'.sp-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px 50px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}'+
'.sp-go:disabled{opacity:.5;cursor:not-allowed}'+
'.sp-busy{display:none;padding:60px 20px;text-align:center}'+
'.sp-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}'+
'.sp-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:26px}'+
'.sp-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,.08)}'+
'.sp-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);border-radius:999px;transition:width .3s}'+
'.sp-pct{font-size:36px;font-weight:900}'+
'.sp-done{display:none;text-align:center;padding:60px 20px}'+
'.sp-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}'+
'.sp-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35);margin:0 8px}'+
'.sp-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:17px 26px;border-radius:12px;border:none;cursor:pointer}'+
'</style>'+
'<div class="sp-wrap">'+
'<div id="spPick"><div class="sp-hero"><h1>Split PDF files</h1><p>Extract specific pages or split your PDF into multiple files. Free, private and unlimited.</p>'+
'<div class="sp-zone" id="spZone"><button class="sp-big" id="spBtn" type="button">Select PDF file</button><p class="sp-drop-hint">or drop PDF here</p></div></div></div>'+
'<div class="sp-work" id="spWork">'+
'<div class="sp-file"><div class="ic">📕</div><div class="info"><div class="nm" id="spName"></div><div class="mt" id="spMeta"></div></div></div>'+
'<div class="sp-options"><h3>Split options</h3>'+
'<div class="sp-opt"><input type="radio" name="spMode" id="spAll" value="all" checked><label for="spAll">Extract all pages (one PDF per page)</label></div>'+
'<div class="sp-opt"><input type="radio" name="spMode" id="spRange" value="range"><label for="spRange">Extract specific pages</label></div>'+
'<div class="sp-range" id="spRangeBox"><input type="text" id="spPages" placeholder="e.g. 1,3,5-8"><small>Enter page numbers separated by commas. Use dash for ranges (e.g. 1-5).</small></div>'+
'</div>'+
'<button class="sp-go" id="spGo" type="button">Split PDF →</button>'+
'</div>'+
'<div class="sp-busy" id="spBusy"><h2 id="spBusyTitle">Splitting PDF...</h2><p class="fn" id="spBusyName"></p><div class="sp-bar"><div id="spBarFill"></div></div><div class="sp-pct" id="spPct">0%</div></div>'+
'<div class="sp-done" id="spDone"><div class="sp-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF split successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="spDoneInfo"></p><div id="spDownloads"></div><button class="sp-again" id="spAgain" type="button">Split another PDF</button></div>'+
'<input type="file" id="spFile" accept="application/pdf,.pdf" style="display:none">'+
'</div>';
var file=null;var totalPages=0;
var pick=document.getElementById('spPick'),work=document.getElementById('spWork'),busy=document.getElementById('spBusy'),done=document.getElementById('spDone');
var zone=document.getElementById('spZone'),btn=document.getElementById('spBtn'),inp=document.getElementById('spFile');
var go=document.getElementById('spGo'),nameEl=document.getElementById('spName'),metaEl=document.getElementById('spMeta');
var rangeBox=document.getElementById('spRangeBox'),pagesInput=document.getElementById('spPages');
function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
function parsePages(str,max){
 var pages=[];var parts=str.split(',');
 for(var i=0;i<parts.length;i++){
  var p=parts[i].trim();
  if(p.indexOf('-')>-1){
   var r=p.split('-');var s=parseInt(r[0]),e=parseInt(r[1]);
   if(!isNaN(s)&&!isNaN(e)){for(var j=Math.max(1,s);j<=Math.min(max,e);j++){if(pages.indexOf(j)===-1){pages.push(j);}}}
  }else{
   var n=parseInt(p);if(!isNaN(n)&&n>=1&&n<=max&&pages.indexOf(n)===-1){pages.push(n);}
  }
 }
 return pages.sort(function(a,b){return a-b;});
}
function addFile(f){
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){alert('Please select a PDF file.');return;}
 file=f;pick.style.display='none';work.style.display='block';
 nameEl.textContent=f.name;metaEl.textContent='Loading...';
 ensurePdfjs().then(function(ok){
  if(!ok){metaEl.textContent='Error loading PDF library';return;}
  f.arrayBuffer().then(function(buf){
   return window.pdfjsLib.getDocument({data:buf}).promise.then(function(doc){
    totalPages=doc.numPages;
    metaEl.textContent=totalPages+' pages • '+fmtB(f.size);
    doc.destroy();
   });
  }).catch(function(){metaEl.textContent='Error reading PDF';});
 });
}
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};
document.querySelectorAll('input[name="spMode"]').forEach(function(r){
 r.onchange=function(){rangeBox.classList.toggle('show',this.value==='range');};
});
go.onclick=function(){
 if(!file){return;}
 var mode=document.querySelector('input[name="spMode"]:checked').value;
 var pages=[];
 if(mode==='all'){
  for(var i=1;i<=totalPages;i++){pages.push(i);}
 }else{
  pages=parsePages(pagesInput.value,totalPages);
  if(pages.length===0){alert('Please enter valid page numbers.');return;}
 }
 work.style.display='none';busy.style.display='block';
 document.getElementById('spBusyName').textContent=file.name;
 function pct(p){document.getElementById('spPct').textContent=Math.round(p)+'%';document.getElementById('spBarFill').style.width=p+'%';}
 pct(0);
 setTimeout(function(){
  file.arrayBuffer().then(function(buf){
   return PDFLib.PDFDocument.load(buf,{ignoreEncryption:true}).then(function(src){
    if(mode==='all'){
     var chain=Promise.resolve();var results=[];
     pages.forEach(function(pg,idx){
      chain=chain.then(function(){
       pct((idx/pages.length)*90);
       return PDFLib.PDFDocument.create().then(function(out){
        return out.copyPages(src,[pg-1]).then(function(copied){
         out.addPage(copied[0]);
         return out.save().then(function(bytes){
          results.push({name:'page-'+pg+'.pdf',bytes:bytes});
         });
        });
       });
      });
     });
     chain.then(function(){
      pct(100);
      setTimeout(function(){showResults(results);},400);
     });
    }else{
     PDFLib.PDFDocument.create().then(function(out){
      return out.copyPages(src,pages.map(function(p){return p-1;})).then(function(copied){
       copied.forEach(function(p){out.addPage(p);});
       return out.save().then(function(bytes){
        pct(100);
        setTimeout(function(){showResults([{name:'extracted-pages.pdf',bytes:bytes}]);},400);
       });
      });
     });
    }
   });
  }).catch(function(){
   busy.style.display='none';work.style.display='block';
   alert('Error splitting PDF. Please try again.');
  });
 },100);
};
function showResults(files){
 busy.style.display='none';done.style.display='block';
 document.getElementById('spDoneInfo').textContent=files.length+' file(s) created • '+fmtB(files.reduce(function(a,f){return a+f.bytes.length;},0));
 var dl=document.getElementById('spDownloads');dl.innerHTML='';
 files.forEach(function(f){
  var blob=new Blob([f.bytes],{type:'application/pdf'});
  var u=URL.createObjectURL(blob);
  var a=document.createElement('a');a.href=u;a.download=f.name;a.className='sp-dl';a.textContent='⬇ '+f.name;
  dl.appendChild(a);
 });
}
document.getElementById('spAgain').onclick=function(){
 file=null;totalPages=0;done.style.display='none';work.style.display='none';pick.style.display='block';
 pagesInput.value='';document.getElementById('spAll').checked=true;rangeBox.classList.remove('show');
};
})();
