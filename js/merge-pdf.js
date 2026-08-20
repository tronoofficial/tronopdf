/* TronoPDF - Split PDF v2 | visual selector, multiple ranges, thumbnails */
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
'.sp-wrap{max-width:1400px;margin:0 auto}'+
'.sp-hero{text-align:center;padding:50px 16px 40px}'+
'.sp-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}'+
'.sp-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}'+
'.sp-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}'+
'.sp-big:hover{transform:translateY(-2px)}'+
'.sp-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}'+
'.sp-zone{border:2px dashed transparent;border-radius:18px}'+
'.sp-zone.on{border-color:#7c3aed;background:#f3f0ff}'+
'.sp-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}'+
'.sp-main{display:flex;min-height:600px}'+
'.sp-pages{flex:1;padding:40px;overflow-y:auto}'+
'.sp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px}'+
'.sp-page{background:#fff;border:2px solid #eceaf6;border-radius:10px;padding:12px;text-align:center;cursor:pointer;transition:.2s;position:relative}'+
'.sp-page:hover{border-color:#7c3aed;transform:translateY(-2px)}'+
'.sp-page.selected{border-color:#7c3aed;background:#f3f0ff}'+
'.sp-page .thumb{height:160px;display:flex;align-items:center;justify-content:center;background:#fafbfe;border-radius:6px;margin-bottom:8px;overflow:hidden}'+
'.sp-page .thumb img{max-width:100%;max-height:100%;object-fit:contain}'+
'.sp-page .num{font-size:12px;font-weight:700;color:#4b4b5a}'+
'.sp-page .check{position:absolute;top:8px;right:8px;width:24px;height:24px;border-radius:50%;background:#7c3aed;color:#fff;display:none;align-items:center;justify-content:center;font-size:14px}'+
'.sp-page.selected .check{display:flex}'+
'.sp-side{width:380px;background:#fff;border-left:1px solid #eceaf6;padding:30px;display:flex;flex-direction:column}'+
'.sp-side h2{font-size:24px;font-weight:900;text-align:center;margin-bottom:20px}'+
'.sp-tabs{display:flex;gap:8px;margin-bottom:20px}'+
'.sp-tab{flex:1;padding:12px;border:1px solid #eceaf6;border-radius:10px;background:#fff;font-size:13px;font-weight:700;text-align:center;cursor:pointer;transition:.2s}'+
'.sp-tab:hover{border-color:#7c3aed}'+
'.sp-tab.active{background:#7c3aed;color:#fff;border-color:#7c3aed}'+
'.sp-ranges{flex:1;overflow-y:auto}'+
'.sp-range{background:#f7f6fc;border:1px solid #eceaf6;border-radius:10px;padding:16px;margin-bottom:12px}'+
'.sp-range-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}'+
'.sp-range-title{font-size:13px;font-weight:700;color:#4b4b5a}'+
'.sp-range-del{background:none;border:none;color:#dc2626;font-size:18px;cursor:pointer}'+
'.sp-range-inputs{display:flex;gap:8px;align-items:center}'+
'.sp-range-inputs input{flex:1;padding:8px 12px;border:1px solid #ddd;border-radius:8px;font-size:13px;text-align:center}'+
'.sp-range-inputs span{color:#9a9aa5;font-size:13px}'+
'.sp-add-range{background:#f3f0ff;border:1px dashed #7c3aed;color:#7c3aed;font-size:13px;font-weight:700;padding:10px;border-radius:8px;cursor:pointer;width:100%;margin-top:8px}'+
'.sp-add-range:hover{background:#ede9fe}'+
'.sp-merge-opt{display:flex;align-items:center;gap:8px;margin-top:16px;padding-top:16px;border-top:1px solid #eceaf6}'+
'.sp-merge-opt input{width:18px;height:18px;accent-color:#7c3aed}'+
'.sp-merge-opt label{font-size:13px;color:#4b4b5a;cursor:pointer}'+
'.sp-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:auto}'+
'.sp-go:disabled{opacity:.5;cursor:not-allowed}'+
'.sp-busy{display:none;padding:60px 20px;text-align:center}'+
'.sp-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}'+
'.sp-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:26px}'+
'.sp-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,.08)}'+
'.sp-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);border-radius:999px;transition:width .3s}'+
'.sp-pct{font-size:36px;font-weight:900}'+
'.sp-done{display:none;text-align:center;padding:60px 20px}'+
'.sp-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}'+
'.sp-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:16px;padding:15px 40px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35);margin:8px}'+
'.sp-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-top:16px}'+
'@media(max-width:900px){.sp-main{flex-direction:column}.sp-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}'+
'</style>'+
'<div class="sp-wrap">'+
'<div id="spPick"><div class="sp-hero"><h1>Split PDF files</h1><p>Extract specific pages or split your PDF into multiple files. Free, private and unlimited.</p>'+
'<div class="sp-zone" id="spZone"><button class="sp-big" id="spBtn" type="button">Select PDF file</button><p class="sp-drop-hint">or drop PDF here</p></div></div></div>'+
'<div class="sp-work" id="spWork"><div class="sp-main"><div class="sp-pages"><div class="sp-grid" id="spGrid"></div></div>'+
'<aside class="sp-side"><h2>Split</h2>'+
'<div class="sp-tabs"><div class="sp-tab active" data-mode="range">Range</div><div class="sp-tab" data-mode="pages">Pages</div></div>'+
'<div class="sp-ranges" id="spRanges"></div>'+
'<button class="sp-add-range" id="spAddRange" type="button">+ Add Range</button>'+
'<div class="sp-merge-opt"><input type="checkbox" id="spMerge"><label for="spMerge">Merge all ranges in one PDF file</label></div>'+
'<button class="sp-go" id="spGo" type="button">Split PDF →</button></aside></div></div>'+
'<div class="sp-busy" id="spBusy"><h2 id="spBusyTitle">Splitting PDF...</h2><p class="fn" id="spBusyName"></p><div class="sp-bar"><div id="spBarFill"></div></div><div class="sp-pct" id="spPct">0%</div></div>'+
'<div class="sp-done" id="spDone"><div class="sp-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF split successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="spDoneInfo"></p><div id="spDownloads"></div><button class="sp-again" id="spAgain" type="button">Split another PDF</button></div>'+
'<input type="file" id="spFile" accept="application/pdf,.pdf" style="display:none">'+
'</div>';
var file=null;var totalPages=0;var doc=null;var ranges=[{from:1,to:1}];var mode='range';
var pick=document.getElementById('spPick'),work=document.getElementById('spWork'),busy=document.getElementById('spBusy'),done=document.getElementById('spDone');
var zone=document.getElementById('spZone'),btn=document.getElementById('spBtn'),inp=document.getElementById('spFile');
var go=document.getElementById('spGo'),grid=document.getElementById('spGrid'),rangesEl=document.getElementById('spRanges');
function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
function addFile(f){
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){alert('Please select a PDF file.');return;}
 file=f;pick.style.display='none';work.style.display='block';
 ensurePdfjs().then(function(ok){
  if(!ok){alert('Error loading PDF library');return;}
  f.arrayBuffer().then(function(buf){
   return window.pdfjsLib.getDocument({data:buf}).promise.then(function(d){
    doc=d;totalPages=d.numPages;
    ranges=[{from:1,to:totalPages}];
    renderPages();renderRanges();
   });
  }).catch(function(){alert('Error reading PDF');});
 });
}
function renderPages(){
 grid.innerHTML='';
 for(var i=1;i<=totalPages;i++){
  (function(pg){
   var div=document.createElement('div');div.className='sp-page';div.setAttribute('data-page',pg);
   div.innerHTML='<div class="thumb"><span style="color:#c3c6d4;font-size:24px">📄</span></div><div class="num">Page '+pg+'</div><div class="check">✓</div>';
   div.onclick=function(){this.classList.toggle('selected');updateRangesFromSelection();};
   grid.appendChild(div);
   doc.getPage(pg).then(function(page){
    var vp=page.getViewport({scale:1});
    var scale=Math.min(1,140/vp.width);
    var vp2=page.getViewport({scale:scale});
    var canvas=document.createElement('canvas');
    canvas.width=Math.floor(vp2.width);canvas.height=Math.floor(vp2.height);
    page.render({canvasContext:canvas.getContext('2d'),viewport:vp2}).promise.then(function(){
     var thumb=div.querySelector('.thumb');
     thumb.innerHTML='<img src="'+canvas.toDataURL('image/png')+'" alt="Page '+pg+'">';
    });
   });
  })(i);
 }
}
function renderRanges(){
 rangesEl.innerHTML='';
 ranges.forEach(function(r,idx){
  var div=document.createElement('div');div.className='sp-range';
  div.innerHTML='<div class="sp-range-head"><span class="sp-range-title">Range '+(idx+1)+'</span>'+(ranges.length>1?'<button class="sp-range-del" type="button">×</button>':'')+'</div>'+
   '<div class="sp-range-inputs"><input type="number" min="1" max="'+totalPages+'" value="'+r.from+'" data-idx="'+idx+'" data-field="from"><span>to</span><input type="number" min="1" max="'+totalPages+'" value="'+r.to+'" data-idx="'+idx+'" data-field="to"></div>';
  if(ranges.length>1){
   div.querySelector('.sp-range-del').onclick=function(){ranges.splice(idx,1);renderRanges();};
  }
  div.querySelectorAll('input').forEach(function(inp){
   inp.onchange=function(){
    var i=parseInt(this.getAttribute('data-idx'));
    var f=this.getAttribute('data-field');
    var v=parseInt(this.value)||1;
    v=Math.max(1,Math.min(totalPages,v));
    ranges[i][f]=v;
    if(ranges[i].from>ranges[i].to){ranges[i].to=ranges[i].from;}
    renderRanges();
   };
  });
  rangesEl.appendChild(div);
 });
}
function updateRangesFromSelection(){
 var selected=[];
 document.querySelectorAll('.sp-page.selected').forEach(function(p){selected.push(parseInt(p.getAttribute('data-page')));});
 if(selected.length>0){
  selected.sort(function(a,b){return a-b;});
  ranges=[];var start=selected[0],end=selected[0];
  for(var i=1;i<selected.length;i++){
   if(selected[i]===end+1){end=selected[i];}
   else{ranges.push({from:start,to:end});start=end=selected[i];}
  }
  ranges.push({from:start,to:end});
  renderRanges();
 }
}
document.getElementById('spAddRange').onclick=function(){
 ranges.push({from:1,to:Math.min(totalPages,ranges[ranges.length-1].to+1)});
 renderRanges();
};
document.querySelectorAll('.sp-tab').forEach(function(tab){
 tab.onclick=function(){
  document.querySelectorAll('.sp-tab').forEach(function(t){t.classList.remove('active');});
  this.classList.add('active');
  mode=this.getAttribute('data-mode');
  if(mode==='pages'){
   document.querySelectorAll('.sp-page').forEach(function(p){p.classList.remove('selected');});
   ranges=[{from:1,to:1}];
   renderRanges();
  }
 };
});
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};
go.onclick=function(){
 if(!file||!doc){return;}
 var mergeAll=document.getElementById('spMerge').checked;
 var allPages=[];
 ranges.forEach(function(r){
  for(var i=r.from;i<=r.to;i++){if(allPages.indexOf(i)===-1){allPages.push(i);}}
 });
 allPages.sort(function(a,b){return a-b;});
 if(allPages.length===0){alert('Please select at least one page.');return;}
 work.style.display='none';busy.style.display='block';
 document.getElementById('spBusyName').textContent=file.name;
 function pct(p){document.getElementById('spPct').textContent=Math.round(p)+'%';document.getElementById('spBarFill').style.width=p+'%';}
 pct(0);
 setTimeout(function(){
  file.arrayBuffer().then(function(buf){
   return PDFLib.PDFDocument.load(buf,{ignoreEncryption:true}).then(function(src){
    if(mergeAll){
     PDFLib.PDFDocument.create().then(function(out){
      return out.copyPages(src,allPages.map(function(p){return p-1;})).then(function(copied){
       copied.forEach(function(p){out.addPage(p);});
       return out.save().then(function(bytes){
        pct(100);
        setTimeout(function(){showResults([{name:'extracted-pages.pdf',bytes:bytes}]);},400);
       });
      });
     });
    }else{
     var chain=Promise.resolve();var results=[];
     ranges.forEach(function(r,idx){
      chain=chain.then(function(){
       pct((idx/ranges.length)*90);
       var pages=[];for(var i=r.from;i<=r.to;i++){pages.push(i-1);}
       return PDFLib.PDFDocument.create().then(function(out){
        return out.copyPages(src,pages).then(function(copied){
         copied.forEach(function(p){out.addPage(p);});
         return out.save().then(function(bytes){
          results.push({name:'pages-'+r.from+'-'+r.to+'.pdf',bytes:bytes});
         });
        });
       });
      });
     });
     chain.then(function(){
      pct(100);
      setTimeout(function(){showResults(results);},400);
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
 file=null;totalPages=0;doc=null;ranges=[{from:1,to:1}];
 done.style.display='none';work.style.display='none';pick.style.display='block';
};
})();
