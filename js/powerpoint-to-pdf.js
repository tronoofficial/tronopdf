/* TronoPDF - PowerPoint to PDF v1 | PPTXjs render + html2canvas + jsPDF, browser-only */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var JQ='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js';
var JSZIP='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
var PPTXJS='https://cdn.jsdelivr.net/gh/meshesha/PPTXjs@master/js/pptxjs.js';
var PPTXCSS='https://cdn.jsdelivr.net/gh/meshesha/PPTXjs@master/css/pptxjs.css';
var H2C='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
var JSPDF='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
function loadJS(src){return new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=function(){res(true);};s.onerror=function(){rej(new Error('load fail'));};document.head.appendChild(s);});}
function loadCSS(href){var l=document.createElement('link');l.rel='stylesheet';l.href=href;document.head.appendChild(l);}
var html='';
html+='<style>';
html+='.pp-wrap{max-width:1400px;margin:0 auto}';
html+='.pp-hero{text-align:center;padding:50px 16px 40px}';
html+='.pp-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.pp-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.pp-big{background:linear-gradient(135deg,#d35230,#e06a48);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(211,82,48,.35)}';
html+='.pp-big:hover{transform:translateY(-2px)}';
html+='.pp-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.pp-zone{border:2px dashed transparent;border-radius:18px}';
html+='.pp-zone.on{border-color:#d35230;background:#fdeee9}';
html+='.pp-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden;padding:22px}';
html+='.pp-grid{display:grid;grid-template-columns:340px 1fr;gap:20px}';
html+='.pp-side{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px}';
html+='.pp-side h2{font-size:20px;font-weight:900;margin-bottom:6px}';
html+='.pp-sub{font-size:13px;color:#9a9aa5;margin-bottom:14px}';
html+='.pp-count{background:#fdeee9;border:1px solid #f6c9bc;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:800;color:#b3401f;margin-bottom:12px}';
html+='.pp-go{width:100%;background:linear-gradient(135deg,#d35230,#e06a48);color:#fff;font-size:17px;font-weight:800;padding:16px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(211,82,48,.35);margin-top:12px}';
html+='.pp-go:active{transform:scale(.98)}';
html+='.pp-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.pp-preview{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px;overflow:auto;max-height:760px}';
html+='.pp-preview h3{font-size:16px;font-weight:900;margin-bottom:12px}';
html+='.pp-render{width:100%}';
html+='.pp-render .slide{margin:0 auto 16px;box-shadow:0 4px 20px rgba(30,20,60,.12);border-radius:4px}';
html+='.pp-busy{display:none;text-align:center;padding:60px 20px}';
html+='.pp-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.pp-busy .st{color:#7a7a85;font-size:15px;margin-bottom:26px}';
html+='.pp-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.pp-bar div{height:100%;width:0;background:linear-gradient(90deg,#d35230,#e06a48);transition:width .3s}';
html+='.pp-pct{font-size:36px;font-weight:900}';
html+='.pp-done{display:none;text-align:center;padding:50px 20px}';
html+='.pp-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.pp-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.pp-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='.pp-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);background:#16a34a;color:#fff;font-weight:800;padding:14px 28px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:all .3s;z-index:999;font-size:14px}';
html+='.pp-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}';
html+='.pp-toast.err{background:#dc2626}';
html+='@media(max-width:900px){.pp-grid{grid-template-columns:1fr}}';
html+='</style>';
html+='<div class="pp-wrap">';
html+='<div id="ppPick"><div class="pp-hero"><h1>PowerPoint to PDF</h1><p>Convert presentations to professional PDFs - free & private.</p>';
html+='<div class="pp-zone" id="ppZone"><button class="pp-big" id="ppBtn" type="button">Select PowerPoint file</button><p class="pp-drop-hint">.pptx or .ppt - or drop here</p></div></div></div>';
html+='<div class="pp-work" id="ppWork"><div class="pp-grid">';
html+='<div class="pp-side"><h2>Convert settings</h2><p class="pp-sub">Runs fully in your browser</p>';
html+='<div class="pp-count" id="ppCount">0 slides detected</div>';
html+='<button class="pp-go" id="ppGo" type="button" disabled>Convert to PDF →</button></div>';
html+='<div class="pp-preview"><h3>Slide preview</h3><div class="pp-render" id="ppRender"></div></div>';
html+='</div></div>';
html+='<div class="pp-busy" id="ppBusy"><h2>Converting to PDF...</h2><p class="st" id="ppStatus">Working...</p><div class="pp-bar"><div id="ppBarFill"></div></div><div class="pp-pct" id="ppPct">0%</div></div>';
html+='<div class="pp-done" id="ppDone"><div class="pp-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF ready!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="ppDoneInfo"></p><a class="pp-dl" id="ppDl" href="#">⬇ Download PDF</a><button class="pp-again" id="ppAgain" type="button">Convert another</button></div>';
html+='<div class="pp-toast" id="ppToast"></div>';
html+='<input type="file" id="ppFile" accept=".pptx,.ppt,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var file=null,slideCount=0;
var pick=document.getElementById('ppPick'),work=document.getElementById('ppWork'),busy=document.getElementById('ppBusy'),done=document.getElementById('ppDone');
var zone=document.getElementById('ppZone'),btn=document.getElementById('ppBtn'),inp=document.getElementById('ppFile');
var renderBox=document.getElementById('ppRender'),countEl=document.getElementById('ppCount'),goBtn=document.getElementById('ppGo');
var toastEl=document.getElementById('ppToast');
function toast(m,e){toastEl.textContent=m;toastEl.classList.toggle('err',!!e);toastEl.classList.add('show');clearTimeout(toastEl.__h);toastEl.__h=setTimeout(function(){toastEl.classList.remove('show');},2200);}
function pct(p){document.getElementById('ppPct').textContent=Math.round(p)+'%';document.getElementById('ppBarFill').style.width=p+'%';}
function setStatus(s){document.getElementById('ppStatus').textContent=s;}
btn.onclick=function(){inp.click();};
function loadFile(f){
 var ok=/\.(pptx|ppt)$/i.test(f.name)||f.type.indexOf('presentation')>-1;
 if(!ok){toast('Please select a PowerPoint file',true);return;}
 file=f;
 pick.style.display='none';done.style.display='none';work.style.display='block';
 goBtn.disabled=true;countEl.textContent='Rendering slides...';
 renderBox.innerHTML='';
 loadCSS(PPTXCSS);
 Promise.all([loadJS(JQ),loadJS(JSZIP),loadJS(H2C),loadJS(JSPDF)]).then(function(){
  return loadJS(PPTXJS);
 }).then(function(){
  return new Promise(function(res){var t=0;(function w(){if(window.jQuery&&jQuery.fn.pptxToHtml){res(true);}else if(t>20){res(false);}else{t++;setTimeout(w,500);}})();});
 }).then(function(hasPlugin){
  if(!hasPlugin){toast('Renderer failed to load',true);return;}
  jQuery(renderBox).pptxToHtml(f,{width:'100%'});
  // poll for slides
  var tries=0;
  (function poll(){
   var slides=renderBox.querySelectorAll('.slide');
   if(slides.length>0){
    slideCount=slides.length;
    countEl.textContent=slideCount+' slide(s) detected';
    goBtn.disabled=false;
    toast('✓ '+slideCount+' slides rendered');
   }else if(tries<30){
    tries++;setTimeout(poll,500);
   }else{
    countEl.textContent='Could not render slides';
    toast('Could not render this file',true);
   }
  })();
 }).catch(function(e){
  countEl.textContent='Render failed';
  toast('Could not load renderer',true);
 });
}
inp.onchange=function(){if(inp.files[0]){loadFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){loadFile(e.dataTransfer.files[0]);}};
goBtn.onclick=async function(){
 if(!file||slideCount===0){toast('Render slides first',true);return;}
 work.style.display='none';done.style.display='none';busy.style.display='block';
 pct(5);setStatus('Capturing slides...');
 try{
  var slides=renderBox.querySelectorAll('.slide');
  var jsPDF=window.jspdf.jsPDF;
  var pdf=null;
  for(var i=0;i<slides.length;i++){
   setStatus('Capturing slide '+(i+1)+' of '+slides.length+'...');
   var el=slides[i];
   var canvas=await window.html2canvas(el,{scale:2,backgroundColor:'#ffffff',useCORS:true,logging:false});
   var wPt=canvas.width*0.75,hPt=canvas.height*0.75;
   if(i===0){pdf=new jsPDF({orientation:wPt>hPt?'landscape':'portrait',unit:'pt',format:[Math.max(wPt,hPt),Math.min(wPt,hPt)]});}
   else{pdf.addPage([Math.max(wPt,hPt),Math.min(wPt,hPt)],wPt>hPt?'landscape':'portrait');}
   var img=canvas.toDataURL('image/jpeg',0.92);
   pdf.addImage(img,'JPEG',0,0,wPt,hPt);
   pct(5+((i+1)/slides.length)*85);
  }
  setStatus('Saving PDF...');
  var bytes=pdf.output('arraybuffer');
  pct(100);setStatus('Done!');
  setTimeout(function(){
   busy.style.display='none';done.style.display='block';
   document.getElementById('ppDoneInfo').textContent=slides.length+' slide(s) • '+(bytes.length/1024).toFixed(1)+' KB';
   var blob=new Blob([bytes],{type:'application/pdf'});
   var dl=document.getElementById('ppDl');
   dl.href=URL.createObjectURL(blob);
   dl.download=file.name.replace(/\.(pptx|ppt)$/i,'')+'.pdf';
   toast('✓ PDF ready!');
  },300);
 }catch(err){
  busy.style.display='none';work.style.display='block';
  toast('Conversion failed: '+((err&&err.message)||err),true);
 }
};
document.getElementById('ppAgain').onclick=function(){
 done.style.display='none';pick.style.display='block';
 file=null;slideCount=0;renderBox.innerHTML='';
};
})();
