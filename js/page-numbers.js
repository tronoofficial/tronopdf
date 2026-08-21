/* TronoPDF - Page Numbers v1 | position grid, formats, range, live preview */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
function loadJS(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(false);};s.onerror=function(){cb(true);};document.head.appendChild(s);}
loadJS(PDFLIB_SRC,function(){});
loadJS(PDFJS_SRC,function(e){if(!e&&window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;}});
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
function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
function hexToRgb(h){
 var x=h.replace('#','');
 return {r:parseInt(x.substr(0,2),16)/255,g:parseInt(x.substr(2,2),16)/255,b:parseInt(x.substr(4,2),16)/255};
}
root.innerHTML='<style>'+
'.pn-wrap{max-width:1400px;margin:0 auto}'+
'.pn-hero{text-align:center;padding:50px 16px 40px}'+
'.pn-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}'+
'.pn-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}'+
'.pn-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}'+
'.pn-big:hover{transform:translateY(-2px)}'+
'.pn-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}'+
'.pn-zone{border:2px dashed transparent;border-radius:18px}'+
'.pn-zone.on{border-color:#7c3aed;background:#f3f0ff}'+
'.pn-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}'+
'.pn-main{display:flex;min-height:620px}'+
'.pn-preview{flex:1;padding:40px;display:flex;align-items:flex-start;justify-content:center;overflow:auto}'+
'.pn-card{background:#fff;border:1px solid #eceaf6;border-radius:14px;padding:20px;text-align:center;box-shadow:0 4px 20px rgba(30,20,60,.06);width:340px}'+
'.pn-thumb{height:400px;position:relative;background:#fafbfe;border-radius:8px;overflow:hidden}'+
'.pn-thumb img.bg{width:100%;height:100%;object-fit:contain}'+
'.pn-ov{position:absolute;inset:0;pointer-events:none}'+
'.pn-dot{position:absolute;width:14px;height:14px;border-radius:50%;background:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,.25)}'+
'.pn-sample{position:absolute;font-weight:700;background:rgba(124,58,237,.1);padding:1px 6px;border-radius:4px}'+
'.pn-nm{font-size:13px;font-weight:700;margin-top:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
'.pn-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}'+
'.pn-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:18px}'+
'.pn-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}'+
'.pn-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;font-family:inherit}'+
'.pn-row{display:flex;gap:10px;align-items:center}'+
'.pn-row input[type=number]{width:80px;padding:10px;border:1px solid #ddd;border-radius:8px;font-size:14px}'+
'.pn-row input[type=color]{width:44px;height:36px;border:1px solid #ddd;border-radius:8px;padding:2px;background:#fff;cursor:pointer}'+
'.pn-chk{display:flex;gap:8px;align-items:center;margin:6px 0}'+
'.pn-chk input{width:16px;height:16px;accent-color:#7c3aed}'+
'.pn-chk label{font-size:13px;font-weight:600;cursor:pointer}'+
'.pn-grid{display:grid;grid-template-columns:repeat(3,44px);gap:6px;justify-content:start}'+
'.pn-pos{width:44px;height:34px;border:2px solid #eceaf6;border-radius:8px;background:#fff;cursor:pointer;position:relative;transition:.2s}'+
'.pn-pos:hover{border-color:#7c3aed}'+
'.pn-pos.active{border-color:#7c3aed;background:#f3f0ff}'+
'.pn-pos.active::after{content:"";position:absolute;inset:0;margin:auto;width:10px;height:10px;border-radius:50%;background:#7c3aed}'+
'.pn-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:16px}'+
'.pn-busy{display:none;padding:60px 20px;text-align:center}'+
'.pn-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}'+
'.pn-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:26px}'+
'.pn-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}'+
'.pn-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .3s}'+
'.pn-pct{font-size:36px;font-weight:900}'+
'.pn-done{display:none;text-align:center;padding:60px 20px}'+
'.pn-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}'+
'.pn-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}'+
'.pn-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}'+
'@media(max-width:900px){.pn-main{flex-direction:column}.pn-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}'+
'</style>'+
'<div class="pn-wrap">'+
'<div id="pnPick"><div class="pn-hero"><h1>Add Page Numbers</h1><p>Number your PDF pages with custom position and format. Free, private and unlimited.</p>'+
'<div class="pn-zone" id="pnZone"><button class="pn-big" id="pnBtn" type="button">Select PDF file</button><p class="pn-drop-hint">or drop PDF here</p></div></div></div>'+
'<div class="pn-work" id="pnWork"><div class="pn-main"><div class="pn-preview"><div class="pn-card"><div class="pn-thumb"><img class="bg" id="pnBg" alt=""/><div class="pn-ov" id="pnOv"></div></div><div class="pn-nm" id="pnName"></div></div></div>'+
'<aside class="pn-side"><h2>Page Number options</h2>'+
'<div class="pn-lbl">Position</div><div class="pn-grid" id="pnGrid">'+
'<div class="pn-pos" data-p="tl"></div><div class="pn-pos" data-p="tc"></div><div class="pn-pos" data-p="tr"></div>'+
'<div class="pn-pos" data-p="ml"></div><div class="pn-pos" data-p="mc"></div><div class="pn-pos" data-p="mr"></div>'+
'<div class="pn-pos" data-p="bl"></div><div class="pn-pos" data-p="bc"></div><div class="pn-pos active" data-p="br"></div></div>'+
'<div class="pn-lbl">Margin</div><select class="pn-inp" id="pnMargin"><option value="24">Small</option><option value="40" selected>Recommended</option><option value="60">Big</option></select>'+
'<div class="pn-lbl">Number format</div><select class="pn-inp" id="pnFmt"><option value="n" selected>1 (only number)</option><option value="pageN">Page 1</option><option value="pageNofM">Page 1 of 10</option><option value="NofM">1 / 10</option></select>'+
'<div class="pn-lbl">First number</div><div class="pn-row"><input type="number" id="pnStart" min="0" value="1"/></div>'+
'<div class="pn-lbl">Which pages to number?</div><div class="pn-row"><span style="font-size:13px">from</span><input type="number" id="pnFrom" min="1" value="1"/><span style="font-size:13px">to</span><input type="number" id="pnTo" min="1" value="1"/></div>'+
'<div class="pn-chk"><input type="checkbox" id="pnCover"><label for="pnCover">Skip first page (cover page)</label></div>'+
'<div class="pn-lbl">Text style</div><div class="pn-row"><input type="color" id="pnColor" value="#000000"/><input type="number" id="pnSize" min="8" max="36" value="12" title="Font size"/><div class="pn-chk"><input type="checkbox" id="pnBold"><label for="pnBold">Bold</label></div></div>'+
'<button class="pn-go" id="pnGo" type="button">Add Page Numbers →</button></aside></div></div>'+
'<div class="pn-busy" id="pnBusy"><h2>Adding page numbers...</h2><p class="fn" id="pnBusyName"></p><div class="pn-bar"><div id="pnBarFill"></div></div><div class="pn-pct" id="pnPct">0%</div></div>'+
'<div class="pn-done" id="pnDone"><div class="pn-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">Page numbers added!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="pnDoneInfo"></p><a class="pn-dl" id="pnDl" href="#">⬇ Download numbered PDF</a><button class="pn-again" id="pnAgain" type="button">Number another PDF</button></div>'+
'<input type="file" id="pnFile" accept="application/pdf,.pdf" style="display:none">'+
'</div>';
var file=null;var totalPages=0;
var pos='br';
var pick=document.getElementById('pnPick'),work=document.getElementById('pnWork'),busy=document.getElementById('pnBusy'),done=document.getElementById('pnDone');
var zone=document.getElementById('pnZone'),btn=document.getElementById('pnBtn'),inp=document.getElementById('pnFile');
var ov=document.getElementById('pnOv'),bg=document.getElementById('pnBg'),nameEl=document.getElementById('pnName');
var go=document.getElementById('pnGo');
var elMargin=document.getElementById('pnMargin'),elFmt=document.getElementById('pnFmt'),elStart=document.getElementById('pnStart');
var elFrom=document.getElementById('pnFrom'),elTo=document.getElementById('pnTo'),elCover=document.getElementById('pnCover');
var elColor=document.getElementById('pnColor'),elSize=document.getElementById('pnSize'),elBold=document.getElementById('pnBold');
function sampleText(){
 var start=parseInt(elStart.value)||1;
 var from=parseInt(elFrom.value)||1;
 var to=parseInt(elTo.value)||totalPages||1;
 var total=to-from+1;
 var num=start;
 switch(elFmt.value){
  case 'n':return String(num);
  case 'pageN':return 'Page '+num;
  case 'pageNofM':return 'Page '+num+' of '+(start+total-1);
  case 'NofM':return num+' / '+(start+total-1);
 }
 return String(num);
}
function updatePreview(){
 ov.innerHTML='';
 var dot=document.createElement('div');dot.className='pn-dot';
 var s=document.createElement('div');s.className='pn-sample';s.textContent=sampleText();
 s.style.color=elColor.value;s.style.fontSize=Math.max(9,elSize.value/2)+'px';
 var mPct=8;
 function setBoth(el){
  switch(pos){
   case 'tl':el.style.top=mPct+'%';el.style.left=mPct+'%';break;
   case 'tc':el.style.top=mPct+'%';el.style.left='50%';el.style.transform='translateX(-50%)';break;
   case 'tr':el.style.top=mPct+'%';el.style.right=mPct+'%';break;
   case 'ml':el.style.top='50%';el.style.left=mPct+'%';break;
   case 'mc':el.style.top='50%';el.style.left='50%';el.style.transform='translate(-50%,-50%)';break;
   case 'mr':el.style.top='50%';el.style.right=mPct+'%';break;
   case 'bl':el.style.bottom=mPct+'%';el.style.left=mPct+'%';break;
   case 'mc':break;
   case 'bc':el.style.bottom=mPct+'%';el.style.left='50%';el.style.transform='translateX(-50%)';break;
   case 'br':el.style.bottom=mPct+'%';el.style.right=mPct+'%';break;
  }
 }
 setBoth(dot);setBoth(s);
 ov.appendChild(dot);ov.appendChild(s);
}
[elMargin,elFmt,elStart,elFrom,elTo,elColor,elSize].forEach(function(x){x.addEventListener('input',updatePreview);});
elBold.addEventListener('change',updatePreview);
document.querySelectorAll('.pn-pos').forEach(function(p){
 p.onclick=function(){
  document.querySelectorAll('.pn-pos').forEach(function(x){x.classList.remove('active');});
  this.classList.add('active');
  pos=this.getAttribute('data-p');
  updatePreview();
 };
});
function addFile(f){
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){alert('Please select a PDF file.');return;}
 file=f;pick.style.display='none';work.style.display='block';
 nameEl.textContent=f.name;
 waitLib('pdfjsLib').then(function(ok){
  if(!ok){return;}
  window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
  f.arrayBuffer().then(function(b){
   return window.pdfjsLib.getDocument({data:b}).promise.then(function(d){
    totalPages=d.numPages;
    elTo.value=totalPages;
    d.getPage(1).then(function(page){
     var vp=page.getViewport({scale:1});
     var scale=Math.min(2,400/vp.height);
     var vp2=page.getViewport({scale:scale});
     var canvas=document.createElement('canvas');
     canvas.width=Math.floor(vp2.width);canvas.height=Math.floor(vp2.height);
     page.render({canvasContext:canvas.getContext('2d'),viewport:vp2}).promise.then(function(){
      bg.src=canvas.toDataURL('image/png');
      updatePreview();
     });
    });
    d.destroy();
   });
  }).catch(function(){alert('Error reading PDF');});
 });
}
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};
function pct(p){document.getElementById('pnPct').textContent=Math.round(p)+'%';document.getElementById('pnBarFill').style.width=p+'%';}
go.onclick=function(){
 if(!file){return;}
 work.style.display='none';busy.style.display='block';
 document.getElementById('pnBusyName').textContent=file.name;
 pct(5);
 waitLib('PDFLib').then(function(ok){
  if(!ok){throw new Error('libs');}
  return file.arrayBuffer().then(function(buf){
   return PDFLib.PDFDocument.load(buf,{ignoreEncryption:true}).then(function(pdf){
    var fontName=elBold.checked?PDFLib.StandardFonts.HelveticaBold:PDFLib.StandardFonts.Helvetica;
    return pdf.embedFont(fontName).then(function(stdFont){
     var pages=pdf.getPages();
     var from=parseInt(elFrom.value)||1;
     var to=Math.min(pages.length,parseInt(elTo.value)||pages.length);
     if(elCover.checked&&from===1){from=2;}
     var start=parseInt(elStart.value)||1;
     var size=parseInt(elSize.value)||12;
     var m=parseInt(elMargin.value)||40;
     var rgb=hexToRgb(elColor.value);
     var totalLogical=start+(to-from);
     var count=0;
     for(var i=from-1;i<to;i++){
      var num=start+(i-(from-1));
      var text;
      switch(elFmt.value){
       case 'n':text=String(num);break;
       case 'pageN':text='Page '+num;break;
       case 'pageNofM':text='Page '+num+' of '+totalLogical;break;
       case 'NofM':text=num+' / '+totalLogical;break;
       default:text=String(num);
      }
      var pg=pages[i];
      var w=pg.getWidth(),h=pg.getHeight();
      var tw=stdFont.widthOfTextAtSize(text,size);
      var x,y;
      var row=pos.charAt(0),col=pos.charAt(1);
      if(row==='t'){y=h-m-size;}else if(row==='m'){y=(h-size)/2;}else{y=m;}
      if(col==='l'){x=m;}else if(col==='c'){x=(w-tw)/2;}else{x=w-m-tw;}
      pg.drawText(text,{x:x,y:y,size:size,font:stdFont,color:PDFLib.rgb(rgb.r,rgb.g,rgb.b)});
      count++;
      pct(10+(count/(to-from+1))*80);
     }
     return pdf.save().then(function(bytes){
      pct(100);
      setTimeout(function(){
       busy.style.display='none';done.style.display='block';
       document.getElementById('pnDoneInfo').textContent=count+' page(s) numbered • '+fmtB(bytes.length);
       var blob=new Blob([bytes],{type:'application/pdf'});
       var dl=document.getElementById('pnDl');dl.href=URL.createObjectURL(blob);dl.download='numbered-'+file.name;
      },300);
     });
    });
   });
  });
 }).catch(function(){
  busy.style.display='none';work.style.display='block';
  alert('Error adding page numbers. Please try again.');
 });
};
document.getElementById('pnAgain').onclick=function(){
 file=null;totalPages=0;
 done.style.display='none';work.style.display='none';pick.style.display='block';
};
updatePreview();
})();
