/* TronoPDF - Signature Resize v1 | exam presets, exact KB, clean white bg, bold ink */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
var EXAMS={custom:[0,0,0],ssc:[276,118,15],ibps:[276,118,15],sbi:[276,118,15],upsc:[300,100,30],rrb:[276,118,15]};
var html='';
html+='<style>';
html+='.sr-wrap{max-width:1400px;margin:0 auto}';
html+='.sr-hero{text-align:center;padding:50px 16px 40px}';
html+='.sr-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.sr-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.sr-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.sr-big:hover{transform:translateY(-2px)}';
html+='.sr-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.sr-zone{border:2px dashed transparent;border-radius:18px}';
html+='.sr-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.sr-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.sr-main{display:flex;min-height:560px}';
html+='.sr-prev{flex:1;padding:40px;display:flex;align-items:center;justify-content:center}';
html+='.sr-card{background:#fff;border:1px solid #eceaf6;border-radius:14px;padding:24px;text-align:center;box-shadow:0 4px 20px rgba(30,20,60,.06);width:420px;max-width:100%}';
html+='.sr-card canvas{width:100%;height:180px;object-fit:contain;background:#fff;border:1px solid #eceaf6;border-radius:8px}';
html+='.sr-nm{font-size:13px;font-weight:700;margin-top:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}';
html+='.sr-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.sr-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:6px}';
html+='.sr-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:16px}';
html+='.sr-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}';
html+='.sr-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;font-family:inherit;background:#fff}';
html+='.sr-row{display:flex;gap:10px;align-items:center}';
html+='.sr-row input[type=number]{flex:1;padding:10px;border:1px solid #ddd;border-radius:10px;font-size:14px;min-width:0}';
html+='.sr-chk{display:flex;gap:8px;align-items:center;margin:8px 0}';
html+='.sr-chk input{width:16px;height:16px;accent-color:#7c3aed}';
html+='.sr-chk label{font-size:13px;font-weight:600;cursor:pointer}';
html+='.sr-row input[type=range]{flex:1;accent-color:#7c3aed}';
html+='.sr-quick{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}';
html+='.sr-quick button{border:1px solid #eceaf6;background:#f7f6fc;color:#4b4b5a;font-size:11px;font-weight:800;padding:6px 12px;border-radius:999px;cursor:pointer}';
html+='.sr-quick button:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.sr-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:16px}';
html+='.sr-done{display:none;text-align:center;padding:50px 20px}';
html+='.sr-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.sr-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.sr-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='@media(max-width:900px){.sr-main{flex-direction:column}.sr-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="sr-wrap">';
html+='<div id="srPick"><div class="sr-hero"><h1>Signature Resize</h1><p>Perfect signature size for SSC, Bank, UPSC and every online form - exact KB, exact pixels.</p>';
html+='<div class="sr-zone" id="srZone"><button class="sr-big" id="srBtn" type="button">Select Signature</button><p class="sr-drop-hint">or drop your signature photo here</p></div></div></div>';
html+='<div class="sr-work" id="srWork"><div class="sr-main"><div class="sr-prev"><div class="sr-card"><canvas id="srCanvas"></canvas><div class="sr-nm" id="srName"></div></div></div>';
html+='<aside class="sr-side"><h2>Signature settings</h2><p class="sr-sub">Pick your exam - size set automatically</p>';
html+='<div class="sr-lbl">Exam / Form</div><select class="sr-inp" id="srExam"><option value="ssc">SSC (CGL, CHSL, MTS)</option><option value="ibps">IBPS (PO, Clerk)</option><option value="sbi">SBI / Bank / Insurance</option><option value="upsc">UPSC / Civil Services</option><option value="rrb">RRB (NTPC, Group D)</option><option value="custom">Custom</option></select>';
html+='<div class="sr-lbl">Dimensions (px)</div><div class="sr-row"><input type="number" id="srW" min="10" value="276"/><span style="color:#9a9aa5;font-size:13px">×</span><input type="number" id="srH" min="10" value="118"/></div>';
html+='<div class="sr-quick"><button type="button" data-d="276,118">276×118</button><button type="button" data-d="140,60">140×60</button><button type="button" data-d="354,118">354×118</button><button type="button" data-d="300,100">300×100</button></div>';
html+='<div class="sr-chk"><input type="checkbox" id="srClean" checked/><label for="srClean">Clean paper background (pure white)</label></div>';
html+='<div class="sr-lbl">Clean strength: <span id="srThrVal">200</span></div><div class="sr-row"><input type="range" id="srThr" min="120" max="250" value="200"/></div>';
html+='<div class="sr-chk"><input type="checkbox" id="srBold"/><label for="srBold">Make ink darker (bold signature)</label></div>';
html+='<div class="sr-chk"><input type="checkbox" id="srKb" checked/><label for="srKb">Exact file size</label></div>';
html+='<div id="srKbBox"><div class="sr-row"><input type="number" id="srKbVal" value="15" min="3"/><span style="font-size:12px;color:#9a9aa5">KB max</span></div><div class="sr-quick"><button type="button" data-kb="10">10 KB</button><button type="button" data-kb="15">15 KB</button><button type="button" data-kb="20">20 KB</button><button type="button" data-kb="50">50 KB</button></div></div>';
html+='<div class="sr-lbl">Format</div><select class="sr-inp" id="srFmt"><option value="jpg">JPG (white bg)</option><option value="png">PNG</option></select>';
html+='<button class="sr-go" id="srGo" type="button">Make My Signature →</button></aside></div></div>';
html+='<div class="sr-done" id="srDone"><div class="sr-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">Your signature is ready!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:24px" id="srDoneInfo"></p><a class="sr-dl" id="srDl" href="#">⬇ Download Signature</a><button class="sr-again" id="srAgain" type="button">Resize another</button></div>';
html+='<input type="file" id="srFile" accept="image/*,.jpg,.jpeg,.png,.webp" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var img=null;
var pick=document.getElementById('srPick'),work=document.getElementById('srWork'),done=document.getElementById('srDone');
var zone=document.getElementById('srZone'),btn=document.getElementById('srBtn'),inp=document.getElementById('srFile');
var canvas=document.getElementById('srCanvas'),ctx=canvas.getContext('2d'),nameEl=document.getElementById('srName');
var elExam=document.getElementById('srExam'),elW=document.getElementById('srW'),elH=document.getElementById('srH');
var elClean=document.getElementById('srClean'),elThr=document.getElementById('srThr'),elBold=document.getElementById('srBold');
var elKb=document.getElementById('srKb'),elKbBox=document.getElementById('srKbBox'),elKbVal=document.getElementById('srKbVal'),elFmt=document.getElementById('srFmt');
canvas.width=420;canvas.height=180;
elExam.onchange=function(){
 var e=EXAMS[this.value];
 if(e&&e[0]){elW.value=e[0];elH.value=e[1];elKbVal.value=e[2];elKb.checked=true;elKbBox.style.display='block';}
};
elKb.onchange=function(){elKbBox.style.display=this.checked?'block':'none';};
elThr.oninput=function(){document.getElementById('srThrVal').textContent=this.value;drawPreview();};
[elClean,elBold].forEach(function(x){x.addEventListener('change',drawPreview);});
var dimBtns=document.querySelectorAll('[data-d]');
for(var di=0;di<dimBtns.length;di++){
 dimBtns[di].onclick=function(){
  var p=this.getAttribute('data-d').split(',');
  elW.value=p[0];elH.value=p[1];
 };
}
var kbBtns=document.querySelectorAll('[data-kb]');
for(var ki=0;ki<kbBtns.length;ki++){
 kbBtns[ki].onclick=function(){elKbVal.value=this.getAttribute('data-kb');};
}
function cleanCanvas(c2,w,h){
 var x=c2.getContext('2d');
 var d=x.getImageData(0,0,w,h);var p=d.data;
 var thr=parseInt(elThr.value)||200;
 for(var i=0;i<p.length;i+=4){
  var lum=0.299*p[i]+0.587*p[i+1]+0.114*p[i+2];
  if(elClean.checked&&lum>thr){p[i]=255;p[i+1]=255;p[i+2]=255;}
  if(elBold.checked&&lum<120){p[i]=Math.round(p[i]*0.55);p[i+1]=Math.round(p[i+1]*0.55);p[i+2]=Math.round(p[i+2]*0.55);}
 }
 x.putImageData(d,0,0);
}
function drawPreview(){
 if(!img){return;}
 ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
 var sc=Math.min(canvas.width/img.width,canvas.height/img.height)*0.92;
 var w=img.width*sc,h=img.height*sc;
 var ox=(canvas.width-w)/2,oy=(canvas.height-h)/2;
 ctx.drawImage(img,ox,oy,w,h);
 cleanCanvas(canvas,canvas.width,canvas.height);
}
function addFile(f){
 if(f.type.indexOf('image/')!==0&&!/\.(jpg|jpeg|png|webp)$/i.test(f.name)){alert('Please select an image file.');return;}
 var u=URL.createObjectURL(f);
 var im=new Image();
 im.onload=function(){
  img=im;
  nameEl.textContent=f.name;
  pick.style.display='none';work.style.display='block';done.style.display='none';
  drawPreview();
 };
 im.src=u;
}
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};
document.getElementById('srGo').onclick=function(){
 if(!img){return;}
 var W=Math.max(10,parseInt(elW.value)||276),H=Math.max(10,parseInt(elH.value)||118);
 var c=document.createElement('canvas');c.width=W;c.height=H;
 var x=c.getContext('2d');
 x.fillStyle='#fff';x.fillRect(0,0,W,H);
 x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
 x.drawImage(img,0,0,W,H);
 cleanCanvas(c,W,H);
 function finish(dataURL,bytes){
  work.style.display='none';done.style.display='block';
  document.getElementById('srDoneInfo').textContent=W+'×'+H+' px • '+fmtB(bytes);
  var dl=document.getElementById('srDl');
  dl.href=dataURL;dl.download='signature-'+W+'x'+H+'.'+elFmt.value;
 }
 if(elKb.checked&&elFmt.value==='jpg'){
  var target=(parseFloat(elKbVal.value)||15)*1024;
  var lo=0.05,hi=0.95,best=null;
  for(var i=0;i<9;i++){
   var q=(lo+hi)/2;
   var d=c.toDataURL('image/jpeg',q);
   var b=atob(d.split(',')[1]).length;
   if(b<=target){best={d:d,b:b};lo=q;}else{hi=q;}
  }
  if(best){finish(best.d,best.b);}
  else{var d2=c.toDataURL('image/jpeg',0.05);finish(d2,atob(d2.split(',')[1]).length);}
 }else{
  var mime=elFmt.value==='png'?'image/png':'image/jpeg';
  var d3=c.toDataURL(mime,0.92);
  finish(d3,atob(d3.split(',')[1]).length);
 }
};
document.getElementById('srAgain').onclick=function(){
 done.style.display='none';pick.style.display='block';work.style.display='none';img=null;
};
})();
