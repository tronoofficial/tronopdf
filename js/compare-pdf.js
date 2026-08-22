/* TronoPDF - Compare PDF v1 | side-by-side + pixel diff, pdf.js only */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
function loadJS(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(false);};s.onerror=function(){cb(true);};document.head.appendChild(s);}
loadJS(PDFJS_SRC,function(e){if(!e&&window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;}});
function waitLib(name){return new Promise(function(res){var t=0;(function w(){if(window[name]){res(true);return;}if(t>40){res(false);return;}t++;setTimeout(w,500);})();});}
var html='';
html+='<style>';
html+='.cm-wrap{max-width:1500px;margin:0 auto}';
html+='.cm-hero{text-align:center;padding:50px 16px 40px}';
html+='.cm-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.cm-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.cm-zones{display:flex;gap:20px;justify-content:center;flex-wrap:wrap}';
html+='.cm-zone{border:2px dashed #c9cddd;border-radius:14px;padding:30px 40px;cursor:pointer;background:#fff;transition:.2s;text-align:center}';
html+='.cm-zone:hover{border-color:#7c3aed;background:#f3f0ff}';
html+='.cm-zone.loaded{border-color:#16a34a;background:#eafbef}';
html+='.cm-zone .ico{font-size:36px;display:block;margin-bottom:8px}';
html+='.cm-zone .t{font-weight:800;font-size:15px;color:#4b4b5a}';
html+='.cm-zone .s{font-size:12px;color:#9a9aa5;margin-top:4px}';
html+='.cm-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden;padding:20px}';
html+='.cm-top{display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;margin-bottom:16px}';
html+='.cm-top button{border:1px solid #eceaf6;background:#fff;border-radius:8px;padding:8px 14px;font-weight:800;cursor:pointer}';
html+='.cm-top button:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.cm-diff{background:#ede9fe;border-radius:10px;padding:8px 16px;font-size:13px;font-weight:800;color:#5b21b6}';
html+='.cm-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}';
html+='.cm-col{background:#fff;border:1px solid #eceaf6;border-radius:10px;padding:10px;text-align:center}';
html+='.cm-col h4{font-size:12px;font-weight:800;color:#9a9aa5;margin:0 0 8px}';
html+='.cm-col canvas{max-width:100%;border-radius:6px;background:#fafbfe}';
html+='@media(max-width:900px){.cm-grid{grid-template-columns:1fr}}';
html+='</style>';
html+='<div class="cm-wrap">';
html+='<div id="cmPick"><div class="cm-hero"><h1>Compare PDF</h1><p>Spot every difference between two PDFs - side-by-side with automatic highlighting.</p>';
html+='<div class="cm-zones">';
html+='<div class="cm-zone" id="cmZoneA"><span class="ico">📄</span><span class="t">First PDF</span><span class="s" id="cmNameA">Click to upload</span></div>';
html+='<div class="cm-zone" id="cmZoneB"><span class="ico">📑</span><span class="t">Second PDF</span><span class="s" id="cmNameB">Click to upload</span></div>';
html+='</div></div></div>';
html+='<div class="cm-work" id="cmWork">';
html+='<div class="cm-top"><button id="cmPrev" type="button">←</button><span id="cmPageLbl" style="font-weight:800"></span><button id="cmNext" type="button">→</button><span class="cm-diff" id="cmDiff">—</span><button id="cmRestart" type="button">↺ Start over</button></div>';
html+='<div class="cm-grid"><div class="cm-col"><h4>FIRST PDF</h4><canvas id="cmA"></canvas></div><div class="cm-col"><h4>SECOND PDF</h4><canvas id="cmB"></canvas></div><div class="cm-col"><h4>DIFFERENCES (red)</h4><canvas id="cmD"></canvas></div></div>';
html+='</div>';
html+='<input type="file" id="cmFileA" accept="application/pdf,.pdf" style="display:none"/>';
html+='<input type="file" id="cmFileB" accept="application/pdf,.pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var docA=null,docB=null,curPage=1,maxPages=0;
var pick=document.getElementById('cmPick'),work=document.getElementById('cmWork');
var cA=document.getElementById('cmA'),cB=document.getElementById('cmB'),cD=document.getElementById('cmD');
var pageLbl=document.getElementById('cmPageLbl'),diffLbl=document.getElementById('cmDiff');
var zoneA=document.getElementById('cmZoneA'),zoneB=document.getElementById('cmZoneB');
var fileInA=document.getElementById('cmFileA'),fileInB=document.getElementById('cmFileB');
function loadDoc(f,cb){
 f.arrayBuffer().then(function(b){
  window.pdfjsLib.getDocument({data:b}).promise.then(cb);
 });
}
function tryStart(){
 if(docA&&docB){
  maxPages=Math.min(docA.numPages,docB.numPages);
  curPage=1;
  pick.style.display='none';work.style.display='block';
  render();
 }
}
zoneA.onclick=function(){fileInA.click();};
zoneB.onclick=function(){fileInB.click();};
fileInA.onchange=function(){var f=this.files[0];if(!f){return;}
 waitLib('pdfjsLib').then(function(){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
  loadDoc(f,function(d){docA=d;zoneA.classList.add('loaded');document.getElementById('cmNameA').textContent=f.name;tryStart();});
 });this.value='';};
fileInB.onchange=function(){var f=this.files[0];if(!f){return;}
 waitLib('pdfjsLib').then(function(){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
  loadDoc(f,function(d){docB=d;zoneB.classList.add('loaded');document.getElementById('cmNameB').textContent=f.name;tryStart();});
 });this.value='';};
document.getElementById('cmPrev').onclick=function(){if(curPage>1){curPage--;render();}};
document.getElementById('cmNext').onclick=function(){if(curPage<maxPages){curPage++;render();}};
document.getElementById('cmRestart').onclick=function(){
 docA=null;docB=null;zoneA.classList.remove('loaded');zoneB.classList.remove('loaded');
 document.getElementById('cmNameA').textContent='Click to upload';
 document.getElementById('cmNameB').textContent='Click to upload';
 work.style.display='none';pick.style.display='block';
};
function renderPageTo(doc,canvas,cb){
 doc.getPage(curPage).then(function(page){
  var vp1=page.getViewport({scale:1});
  var scale=Math.min(1.2,420/vp1.width);
  var vp=page.getViewport({scale:scale});
  canvas.width=Math.floor(vp.width);canvas.height=Math.floor(vp.height);
  page.render({canvasContext:canvas.getContext('2d'),viewport:vp}).promise.then(function(){cb(canvas);});
 });
}
function computeDiff(){
 var w=cA.width,h=cA.height;
 cD.width=w;cD.height=h;
 var dctx=cD.getContext('2d');
 dctx.drawImage(cA,0,0);
 var base=dctx.getImageData(0,0,w,h);
 var tmp=document.createElement('canvas');tmp.width=w;tmp.height=h;
 tmp.getContext('2d').drawImage(cB,0,0,w,h);
 var other=tmp.getContext('2d').getImageData(0,0,w,h);
 var out=dctx.createImageData(w,h);
 var diffCount=0,total=w*h;
 for(var i=0;i<base.data.length;i+=4){
  var dr=Math.abs(base.data[i]-other.data[i]);
  var dg=Math.abs(base.data[i+1]-other.data[i+1]);
  var db=Math.abs(base.data[i+2]-other.data[i+2]);
  if(dr>40||dg>40||db>40){
   out.data[i]=220;out.data[i+1]=38;out.data[i+2]=38;out.data[i+3]=255;
   diffCount++;
  }else{
   out.data[i]=base.data[i];out.data[i+1]=base.data[i+1];out.data[i+2]=base.data[i+2];out.data[i+3]=60;
  }
 }
 dctx.putImageData(out,0,0);
 var pctDiff=((diffCount/total)*100);
 diffLbl.textContent=pctDiff<0.01?'✓ Identical page':pctDiff.toFixed(2)+'% different';
}
function render(){
 pageLbl.textContent='Page '+curPage+' / '+maxPages;
 renderPageTo(docA,cA,function(){
  renderPageTo(docB,cB,function(){
   computeDiff();
  });
 });
}
})();
