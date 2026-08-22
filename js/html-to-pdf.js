/* TronoPDF - HTML to PDF v1 | live preview, page sizes, orientation, margins */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
var PAGES={
 a4:{w:595.28,h:841.89,label:'A4 (210 × 297 mm)'},
 letter:{w:612,h:792,label:'Letter (8.5 × 11 in)'},
 legal:{w:612,h:1008,label:'Legal (8.5 × 14 in)'}
};
var SAMPLE='<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body{font-family:Arial,sans-serif;padding:40px;color:#1e293b;line-height:1.6}\n  h1{color:#7c3aed;border-bottom:3px solid #7c3aed;padding-bottom:10px}\n  .box{background:#f3f0ff;padding:20px;border-radius:10px;margin:20px 0}\n  .highlight{background:#fde047;padding:2px 6px}\n  table{width:100%;border-collapse:collapse;margin:20px 0}\n  th,td{border:1px solid #ddd;padding:10px;text-align:left}\n  th{background:#7c3aed;color:#fff}\n</style>\n</head>\n<body>\n  <h1>My Document Title</h1>\n  <p>Welcome to your <span class="highlight">HTML to PDF</span> conversion! Type any HTML code here and watch it come alive.</p>\n  <div class="box">\n    <h2>Features</h2>\n    <ul>\n      <li>✅ Live preview as you type</li>\n      <li>✅ Multiple page sizes (A4, Letter, Legal)</li>\n      <li>✅ Portrait or landscape</li>\n      <li>✅ Custom margins</li>\n    </ul>\n  </div>\n  <table>\n    <tr><th>Item</th><th>Quantity</th><th>Price</th></tr>\n    <tr><td>Product A</td><td>5</td><td>$25</td></tr>\n    <tr><td>Product B</td><td>3</td><td>$42</td></tr>\n    <tr><td>Product C</td><td>8</td><td>$15</td></tr>\n  </table>\n  <p>Footer note: Generated with TronoPDF.</p>\n</body>\n</html>';
var html='';
html+='<style>';
html+='.hp-wrap{max-width:1500px;margin:0 auto}';
html+='.hp-hero{text-align:center;padding:50px 16px 40px}';
html+='.hp-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.hp-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.hp-work{display:block;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.hp-main{display:flex;min-height:720px}';
html+='.hp-edit{flex:1;display:flex;flex-direction:column;background:#fff;border-right:1px solid #eceaf6}';
html+='.hp-edithead{padding:12px 16px;background:#f9fafb;border-bottom:1px solid #eceaf6;display:flex;justify-content:space-between;align-items:center}';
html+='.hp-edithead h3{font-size:13px;font-weight:800;color:#4b4b5a;margin:0}';
html+='.hp-edithead button{border:1px solid #eceaf6;background:#fff;border-radius:6px;padding:5px 10px;font-size:11px;font-weight:800;cursor:pointer}';
html+='.hp-edithead button:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.hp-code{flex:1;width:100%;border:none;outline:none;padding:16px;font-family:"SF Mono",Consolas,Monaco,monospace;font-size:13px;line-height:1.6;resize:none;background:#fff;color:#1e293b}';
html+='.hp-preview{flex:1;display:flex;flex-direction:column;overflow:auto;background:#e5e7eb}';
html+='.hp-prevhead{padding:12px 16px;background:#f9fafb;border-bottom:1px solid #eceaf6;display:flex;justify-content:space-between;align-items:center}';
html+='.hp-prevhead h3{font-size:13px;font-weight:800;color:#4b4b5a;margin:0}';
html+='.hp-prevbody{flex:1;padding:20px;overflow:auto;display:flex;flex-direction:column;align-items:center;gap:14px}';
html+='.hp-page{background:#fff;box-shadow:0 4px 20px rgba(0,0,0,.1);transform-origin:top center}';
html+='.hp-side{width:360px;background:#fff;border-left:1px solid #eceaf6;padding:24px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.hp-side h2{font-size:20px;font-weight:900;text-align:center;margin-bottom:6px}';
html+='.hp-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:16px}';
html+='.hp-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}';
html+='.hp-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;font-family:inherit;background:#fff}';
html+='.hp-row{display:flex;gap:8px}';
html+='.hp-row .hp-inp{flex:1}';
html+='.hp-chk{display:flex;gap:8px;align-items:center;margin:6px 0}';
html+='.hp-chk input{width:16px;height:16px;accent-color:#7c3aed}';
html+='.hp-chk label{font-size:13px;font-weight:600;cursor:pointer}';
html+='.hp-fmtgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}';
html+='.hp-fmt{border:2px solid #eceaf6;border-radius:8px;padding:8px;font-size:11px;font-weight:800;text-align:center;cursor:pointer;background:#fff;color:#4b4b5a}';
html+='.hp-fmt.active{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}';
html+='.hp-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:17px;font-weight:800;padding:16px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:14px}';
html+='.hp-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.hp-busy{display:none;padding:40px 20px;text-align:center;background:#f3f0ff;border-radius:10px;margin-top:10px}';
html+='.hp-spin{width:32px;height:32px;border:4px solid #e0e7ff;border-top-color:#7c3aed;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 12px}';
html+='@keyframes spin{to{transform:rotate(360deg)}}';
html+='@media(max-width:1000px){.hp-main{flex-direction:column}.hp-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="hp-wrap">';
html+='<div class="hp-hero"><h1>HTML to PDF</h1><p>Paste HTML code, preview it live, download as a beautiful PDF.</p></div>';
html+='<div class="hp-work"><div class="hp-main">';
html+='<div class="hp-edit"><div class="hp-edithead"><h3>HTML CODE</h3><button id="hpReset" type="button">↺ Load sample</button></div><textarea class="hp-code" id="hpCode" spellcheck="false"></textarea></div>';
html+='<div class="hp-preview"><div class="hp-prevhead"><h3>LIVE PREVIEW</h3><span id="hpPageInfo" style="font-size:11px;color:#9a9aa5;font-weight:700"></span></div><div class="hp-prevbody" id="hpPrevBody"></div></div>';
html+='<aside class="hp-side"><h2>PDF Settings</h2><p class="hp-sub">Your PDF will look exactly like the preview</p>';
html+='<div class="hp-lbl">Page size</div><div class="hp-fmtgrid">';
html+='<div class="hp-fmt active" data-s="a4">A4</div>';
html+='<div class="hp-fmt" data-s="letter">Letter</div>';
html+='<div class="hp-fmt" data-s="legal">Legal</div>';
html+='</div>';
html+='<div class="hp-lbl">Orientation</div><div class="hp-fmtgrid" style="grid-template-columns:1fr 1fr">';
html+='<div class="hp-fmt active" data-o="p">Portrait</div>';
html+='<div class="hp-fmt" data-o="l">Landscape</div>';
html+='</div>';
html+='<div class="hp-lbl">Margins (mm)</div><div class="hp-row"><input class="hp-inp" type="number" id="hpMTop" value="15" min="0"/><input class="hp-inp" type="number" id="hpMRight" value="15" min="0"/><input class="hp-inp" type="number" id="hpMBottom" value="15" min="0"/><input class="hp-inp" type="number" id="hpMLeft" value="15" min="0"/></div>';
html+='<div class="hp-lbl">Quality</div><select class="hp-inp" id="hpQ"><option value="2">High (sharp, larger)</option><option value="1.5" selected>Balanced</option><option value="1">Standard</option></select>';
html+='<div class="hp-chk"><input type="checkbox" id="hpGray"/><label for="hpGray">Convert to grayscale</label></div>';
html+='<button class="hp-go" id="hpGo" type="button">Convert to PDF →</button>';
html+='<div class="hp-busy" id="hpBusy"><div class="hp-spin"></div><p style="font-weight:800;color:#5b21b6">Rendering your PDF...</p></div>';
html+='</aside></div></div></div>';
root.innerHTML=html;
var pageSize='a4',orient='p';
var code=document.getElementById('hpCode');
var prevBody=document.getElementById('hpPrevBody'),pageInfo=document.getElementById('hpPageInfo');
code.value=SAMPLE;
var prevTimer=null;
function debouncedPreview(){clearTimeout(prevTimer);prevTimer=setTimeout(renderPreview,300);}
code.addEventListener('input',debouncedPreview);
document.getElementById('hpReset').onclick=function(){code.value=SAMPLE;renderPreview();};
var sizeBtns=document.querySelectorAll('[data-s]');
for(var i=0;i<sizeBtns.length;i++){
 sizeBtns[i].onclick=function(){
  for(var j=0;j<sizeBtns.length;j++){sizeBtns[j].classList.remove('active');}
  this.classList.add('active');
  pageSize=this.getAttribute('data-s');
  renderPreview();
 };
}
var orBtns=document.querySelectorAll('[data-o]');
for(var i=0;i<orBtns.length;i++){
 orBtns[i].onclick=function(){
  for(var j=0;j<orBtns.length;j++){orBtns[j].classList.remove('active');}
  this.classList.add('active');
  orient=this.getAttribute('data-o');
  renderPreview();
 };
}
['hpMTop','hpMRight','hpMBottom','hpMLeft'].forEach(function(id){document.getElementById(id).addEventListener('input',renderPreview);});
function renderPreview(){
 prevBody.innerHTML='';
 var src=code.value||'<p style="color:#9a9aa5;padding:40px;text-align:center">Type some HTML to see the preview</p>';
 var p=PAGES[pageSize];
 var w=orient==='l'?p.h:p.w,h=orient==='l'?p.w:p.h;
 var mTop=parseFloat(document.getElementById('hpMTop').value)||0;
 var mRight=parseFloat(document.getElementById('hpMRight').value)||0;
 var mBottom=parseFloat(document.getElementById('hpMBottom').value)||0;
 var mLeft=parseFloat(document.getElementById('hpMLeft').value)||0;
 // scale points to pixels (1pt = 1.333px at 96dpi)
 var pt2px=96/72;
 var pageW=w*pt2px,pageH=h*pt2px;
 var mt=mTop*pt2px*2.83,mr=mRight*pt2px*2.83,mb=mBottom*pt2px*2.83,ml=mLeft*pt2px*2.83;
 // fit preview in container
 var maxW=Math.min(640,prevBody.clientWidth-40);
 var scale=maxW/pageW;
 var frame=document.createElement('div');
 frame.className='hp-page';
 frame.style.width=pageW+'px';frame.style.height=pageH+'px';
 frame.style.transform='scale('+scale+')';
 frame.style.marginBottom=(pageH*scale-pageH)+'px';
 frame.style.position='relative';
 frame.style.overflow='hidden';
 var inner=document.createElement('div');
 inner.style.position='absolute';
 inner.style.top=mt+'px';inner.style.left=ml+'px';
 inner.style.right=mr+'px';inner.style.bottom=mb+'px';
 inner.style.overflow='hidden';
 // sandbox iframe for HTML
 var iframe=document.createElement('iframe');
 iframe.style.cssText='width:100%;height:100%;border:0;background:#fff';
 iframe.sandbox='allow-same-origin';
 inner.appendChild(iframe);
 frame.appendChild(inner);
 prevBody.appendChild(frame);
 var doc=iframe.contentDocument||iframe.contentWindow.document;
 doc.open();doc.write(src);doc.close();
 // count pages roughly
 setTimeout(function(){
  var contentH=doc.body?doc.body.scrollHeight:pageH;
  var usableH=pageH-mt-mb;
  var pages=Math.max(1,Math.ceil(contentH/usableH));
  pageInfo.textContent=pageSize.toUpperCase()+' • '+Math.round(pageW)+'×'+Math.round(pageH)+' px • ~'+pages+' page(s)';
 },100);
}
document.getElementById('hpGo').onclick=function(){
 var src=code.value.trim();
 if(!src){alert('Please enter some HTML code first.');return;}
 var goBtn=document.getElementById('hpGo');
 var busy=document.getElementById('hpBusy');
 goBtn.disabled=true;busy.style.display='block';
 setTimeout(function(){
  try{
   var p=PAGES[pageSize];
   var w=orient==='l'?p.h:p.w,h=orient==='l'?p.w:p.h;
   var mTop=parseFloat(document.getElementById('hpMTop').value)||0;
   var mRight=parseFloat(document.getElementById('hpMRight').value)||0;
   var mBottom=parseFloat(document.getElementById('hpMBottom').value)||0;
   var mLeft=parseFloat(document.getElementById('hpMLeft').value)||0;
   var q=parseFloat(document.getElementById('hpQ').value)||1.5;
   var gray=document.getElementById('hpGray').checked;
   var pt2px=96/72;
   var pageWpx=w*pt2px,pageHpx=h*pt2px;
   var mt=mTop*pt2px*2.83,mr=mRight*pt2px*2.83,mb=mBottom*pt2px*2.83,ml=mLeft*pt2px*2.83;
   var iframe=document.createElement('iframe');
   iframe.style.cssText='position:fixed;left:-99999px;top:0;width:'+pageWpx+'px;height:'+pageHpx+'px;border:0;background:#fff';
   iframe.sandbox='allow-same-origin';
   document.body.appendChild(iframe);
   var doc=iframe.contentDocument||iframe.contentWindow.document;
   doc.open();doc.write(src);doc.close();
   setTimeout(function(){
    var body=doc.body;
    var contentH=body.scrollHeight;
    var usableHpx=pageHpx-mt-mb;
    var usableWpx=pageWpx-ml-mr;
    var pages=Math.max(1,Math.ceil(contentH/usableHpx));
    var {jsPDF}=window.jspdf;
    var pdf=new jsPDF({orientation:orient==='l'?'landscape':'portrait',unit:'pt',format:[w,h]});
    var rendered=0;
    function renderNextPage(pg){
     if(pg>=pages){
      document.body.removeChild(iframe);
      var bytes=pdf.output('arraybuffer');
      var blob=new Blob([bytes],{type:'application/pdf'});
      var url=URL.createObjectURL(blob);
      var a=document.createElement('a');a.href=url;a.download='converted.pdf';
      document.body.appendChild(a);a.click();document.body.removeChild(a);
      URL.revokeObjectURL(url);
      goBtn.disabled=false;busy.style.display='none';
      return;
     }
     var wrap=document.createElement('div');
     wrap.style.cssText='position:absolute;top:0;left:0;width:'+pageWpx+'px;height:'+pageHpx+'px;background:#fff;overflow:hidden';
     var content=document.createElement('div');
     content.style.cssText='position:absolute;top:'+(-pg*usableHpx+mt)+'px;left:'+ml+'px;width:'+usableWpx+'px';
     content.innerHTML=body.innerHTML;
     // copy stylesheets
     var sheets=doc.querySelectorAll('style,link[rel="stylesheet"]');
     for(var i=0;i<sheets.length;i++){content.insertBefore(sheets[i].cloneNode(true),content.firstChild);}
     wrap.appendChild(content);
     doc.body.appendChild(wrap);
     var canvasOpts={scale:q,useCORS:true,logging:false,backgroundColor:'#ffffff',width:pageWpx,height:pageHpx,windowWidth:pageWpx};
     if(gray){canvasOpts.filter=function(c){c.style.filter='grayscale(1)';};}
     html2canvas(wrap,canvasOpts).then(function(canvas){
      doc.body.removeChild(wrap);
      if(pg>0){pdf.addPage([w,h],orient==='l'?'landscape':'portrait');}
      var imgData=canvas.toDataURL('image/jpeg',0.95);
      pdf.addImage(imgData,'JPEG',0,0,w,h);
      rendered++;
      renderNextPage(pg+1);
     }).catch(function(){
      doc.body.removeChild(wrap);
      if(pg>0){pdf.addPage();}
      renderNextPage(pg+1);
     });
    }
    renderNextPage(0);
   },300);
  }catch(e){
   goBtn.disabled=false;busy.style.display='none';
   alert('Error generating PDF: '+(e.message||e));
  }
 },50);
};
renderPreview();
})();
