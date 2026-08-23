/* TronoPDF - Word to PDF v1 | mammoth(docx->html) + html2canvas + jsPDF, browser-only */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var MAMMOTH_SRC='https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
var H2C_SRC='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
var JSPDF_SRC='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
function loadJS(src){return new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=function(){res(true);};s.onerror=function(){rej(new Error('load fail '+src));};document.head.appendChild(s);});}
var html='';
html+='<style>';
html+='.wp-wrap{max-width:1000px;margin:0 auto}';
html+='.wp-hero{text-align:center;padding:50px 16px 40px}';
html+='.wp-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.wp-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.wp-big{background:linear-gradient(135deg,#2b7cd3,#4a9be0);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(43,124,211,.35)}';
html+='.wp-big:hover{transform:translateY(-2px)}';
html+='.wp-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.wp-zone{border:2px dashed transparent;border-radius:18px}';
html+='.wp-zone.on{border-color:#2b7cd3;background:#eef6fd}';
html+='.wp-busy{display:none;text-align:center;padding:60px 20px}';
html+='.wp-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.wp-busy .st{color:#7a7a85;font-size:15px;margin-bottom:26px}';
html+='.wp-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.wp-bar div{height:100%;width:0;background:linear-gradient(90deg,#2b7cd3,#4a9be0);transition:width .3s}';
html+='.wp-pct{font-size:36px;font-weight:900}';
html+='.wp-done{display:none;text-align:center;padding:50px 20px}';
html+='.wp-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.wp-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.wp-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='.wp-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);background:#16a34a;color:#fff;font-weight:800;padding:14px 28px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:all .3s;z-index:999;font-size:14px}';
html+='.wp-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}';
html+='.wp-toast.err{background:#dc2626}';
html+='</style>';
html+='<div class="wp-wrap">';
html+='<div id="wpPick"><div class="wp-hero"><h1>Word to PDF</h1><p>Convert DOCX to a clean multi-page PDF - fast, free and private.</p>';
html+='<div class="wp-zone" id="wpZone"><button class="wp-big" id="wpBtn" type="button">Select Word file (.docx)</button><p class="wp-drop-hint">or drop a .docx here</p></div></div></div>';
html+='<div class="wp-busy" id="wpBusy"><h2>Converting to PDF...</h2><p class="st" id="wpStatus">Working...</p><div class="wp-bar"><div id="wpBarFill"></div></div><div class="wp-pct" id="wpPct">0%</div></div>';
html+='<div class="wp-done" id="wpDone"><div class="wp-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF ready!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="wpDoneInfo"></p><a class="wp-dl" id="wpDl" href="#">⬇ Download PDF</a><button class="wp-again" id="wpAgain" type="button">Convert another</button></div>';
html+='<div class="wp-toast" id="wpToast"></div>';
html+='<input type="file" id="wpFile" accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var pick=document.getElementById('wpPick'),busy=document.getElementById('wpBusy'),done=document.getElementById('wpDone');
var zone=document.getElementById('wpZone'),btn=document.getElementById('wpBtn'),inp=document.getElementById('wpFile');
var toastEl=document.getElementById('wpToast');
function toast(msg,err){toastEl.textContent=msg;toastEl.classList.toggle('err',!!err);toastEl.classList.add('show');clearTimeout(toastEl.__h);toastEl.__h=setTimeout(function(){toastEl.classList.remove('show');},2200);}
function pct(p){document.getElementById('wpPct').textContent=Math.round(p)+'%';document.getElementById('wpBarFill').style.width=p+'%';}
function setStatus(s){document.getElementById('wpStatus').textContent=s;}
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){convert(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){convert(e.dataTransfer.files[0]);}};
function convert(f){
 if(!/\.docx?$/.test(f.name)&&f.type.indexOf('word')<0){toast('Please select a .docx Word file',true);return;}
 pick.style.display='none';done.style.display='none';busy.style.display='block';
 pct(5);setStatus('Loading converters...');
 Promise.all([loadJS(MAMMOTH_SRC),loadJS(H2C_SRC),loadJS(JSPDF_SRC)]).then(function(){
  pct(15);setStatus('Reading Word document...');
  return f.arrayBuffer();
 }).then(function(buf){
  return window.mammoth.convertToHtml({arrayBuffer:buf});
 }).then(function(res){
  pct(40);setStatus('Rendering pages...');
  var holder=document.createElement('div');
  holder.style.cssText='position:fixed;left:-99999px;top:0;width:794px;background:#fff;color:#111;padding:40px;box-sizing:border-box;font-family:Georgia,serif;font-size:15px;line-height:1.6;z-index:-1';
  holder.innerHTML='<style>h1{font-size:26px}h2{font-size:21px}h3{font-size:18px}p{margin:0 0 12px}img{max-width:100%;height:auto}table{border-collapse:collapse}td,th{border:1px solid #999;padding:6px}</style>'+res.value;
  document.body.appendChild(holder);
  return window.html2canvas(holder,{scale:2,backgroundColor:'#ffffff',useCORS:true,logging:false}).then(function(canvas){
   document.body.removeChild(holder);
   pct(75);setStatus('Building PDF...');
   var jsPDF=window.jspdf.jsPDF;
   var pdf=new jsPDF({unit:'pt',format:'a4'});
   var pageWpt=595,pageHpt=842;
   var scale=2;
   var pageHpx=pageHpt*scale;
   var totalH=canvas.height;
   var pages=Math.max(1,Math.ceil(totalH/pageHpx));
   for(var i=0;i<pages;i++){
    var sliceH=Math.min(pageHpx,totalH-i*pageHpx);
    var tmp=document.createElement('canvas');
    tmp.width=canvas.width;tmp.height=sliceH;
    var tc=tmp.getContext('2d');
    tc.fillStyle='#fff';tc.fillRect(0,0,tmp.width,tmp.height);
    tc.drawImage(canvas,0,i*pageHpx,canvas.width,sliceH,0,0,canvas.width,sliceH);
    var img=tmp.toDataURL('image/jpeg',0.92);
    if(i>0){pdf.addPage('a4');}
    var hPt=pageHpt*(sliceH/pageHpx);
    pdf.addImage(img,'JPEG',0,0,pageWpt,hPt);
    pct(75+((i+1)/pages)*20);
   }
   var bytes=pdf.output('arraybuffer');
   pct(100);setStatus('Done!');
   var blob=new Blob([bytes],{type:'application/pdf'});
   setTimeout(function(){
    busy.style.display='none';done.style.display='block';
    document.getElementById('wpDoneInfo').textContent=pages+' page(s) • '+(bytes.length/1024).toFixed(1)+' KB';
    var dl=document.getElementById('wpDl');
    dl.href=URL.createObjectURL(blob);
    dl.download=f.name.replace(/\.docx?$/i,'')+'.pdf';
    toast('✓ PDF ready!');
   },300);
  });
 }).catch(function(err){
  busy.style.display='none';pick.style.display='block';
  toast('Conversion failed: '+((err&&err.message)||err),true);
 });
}
document.getElementById('wpAgain').onclick=function(){
 done.style.display='none';pick.style.display='block';
};
})();
