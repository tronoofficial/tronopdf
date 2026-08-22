/* TronoPDF - Blur Photo v2 | simple whole-photo blur slider, works everywhere */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
var html='';
html+='<style>';
html+='.bp-wrap{max-width:1400px;margin:0 auto}';
html+='.bp-hero{text-align:center;padding:50px 16px 40px}';
html+='.bp-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.bp-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.bp-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.bp-big:hover{transform:translateY(-2px)}';
html+='.bp-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.bp-zone{border:2px dashed transparent;border-radius:18px}';
html+='.bp-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.bp-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.bp-main{display:flex;min-height:640px}';
html+='.bp-prev{flex:1;padding:30px;display:flex;align-items:center;justify-content:center;overflow:auto}';
html+='.bp-canvaswrap{border-radius:8px;overflow:hidden;box-shadow:0 10px 40px rgba(30,20,60,.18);background:#fff}';
html+='.bp-canvaswrap canvas{display:block}';
html+='.bp-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.bp-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:6px}';
html+='.bp-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:20px}';
html+='.bp-lbl{font-size:13px;font-weight:800;color:#4b4b5a;margin:14px 0 8px;display:flex;justify-content:space-between}';
html+='.bp-lbl span{color:#7c3aed}';
html+='.bp-slider{width:100%;accent-color:#7c3aed;height:8px}';
html+='.bp-scale{display:flex;justify-content:space-between;font-size:11px;color:#9a9aa5;margin-top:4px}';
html+='.bp-row{display:flex;gap:8px;align-items:center;margin-top:10px}';
html+='.bp-row select{flex:1;padding:11px;border:1px solid #ddd;border-radius:10px;font-size:14px;background:#fff}';
html+='.bp-dims{background:#ede9fe;border-radius:10px;padding:10px 14px;font-size:13px;color:#5b21b6;font-weight:700;text-align:center;margin-top:12px}';
html+='.bp-dl{display:block;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;font-weight:800;font-size:17px;padding:16px;border-radius:12px;text-align:center;cursor:pointer;border:none;box-shadow:0 12px 28px rgba(22,163,74,.3);margin-top:16px}';
html+='.bp-again{width:100%;background:#f4f5fa;color:#333;font-weight:700;font-size:13px;padding:12px;border-radius:10px;border:none;cursor:pointer;margin-top:10px}';
html+='@media(max-width:900px){.bp-main{flex-direction:column}.bp-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="bp-wrap">';
html+='<div id="bpPick"><div class="bp-hero"><h1>Blur Photo</h1><p>Smoothly blur your photo with a simple slider - fast, free and private.</p>';
html+='<div class="bp-zone" id="bpZone"><button class="bp-big" id="bpBtn" type="button">Select Image</button><p class="bp-drop-hint">or drop an image here</p></div></div></div>';
html+='<div class="bp-work" id="bpWork"><div class="bp-main"><div class="bp-prev"><div class="bp-canvaswrap"><canvas id="bpCanvas"></canvas></div></div>';
html+='<aside class="bp-side"><h2>Blur settings</h2><p class="bp-sub">Move the slider - preview updates live</p>';
html+='<div class="bp-lbl">Blur strength <span id="bpVal">0%</span></div>';
html+='<input class="bp-slider" type="range" id="bpSlider" min="0" max="100" value="0"/>';
html+='<div class="bp-scale"><span>0%</span><span>50%</span><span>100%</span></div>';
html+='<div class="bp-lbl" style="margin-top:18px">Output format</div><div class="bp-row"><select id="bpFmt"><option value="jpg">JPG (smaller)</option><option value="png">PNG (lossless)</option></select></div>';
html+='<div class="bp-dims" id="bpDims">—</div>';
html+='<button class="bp-dl" id="bpDl" type="button">⬇ Download Blurred Photo</button>';
html+='<button class="bp-again" id="bpAgain" type="button">Upload a different image</button></aside></div></div>';
html+='<input type="file" id="bpFile" accept="image/*,.jpg,.jpeg,.png,.webp" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var base=null,blurAmt=0,scale=1;
var pick=document.getElementById('bpPick'),work=document.getElementById('bpWork');
var zone=document.getElementById('bpZone'),btn=document.getElementById('bpBtn'),inp=document.getElementById('bpFile');
var canvas=document.getElementById('bpCanvas'),ctx=canvas.getContext('2d');
var slider=document.getElementById('bpSlider'),valLbl=document.getElementById('bpVal'),dimsEl=document.getElementById('bpDims');
var fmtSel=document.getElementById('bpFmt');
function blurCanvas(src,amount){
 var w=src.width,h=src.height;
 var out=document.createElement('canvas');out.width=w;out.height=h;
 var octx=out.getContext('2d');
 octx.imageSmoothingEnabled=true;octx.imageSmoothingQuality='high';
 if(amount<=0){octx.drawImage(src,0,0);return out;}
 if(typeof octx.filter==='string'){
  var px=(amount/100)*(Math.min(w,h)/10);
  var over=px*2;
  octx.save();
  octx.filter='blur('+px+'px)';
  octx.drawImage(src,-over,-over,w+over*2,h+over*2);
  octx.restore();
  octx.filter='none';
 }else{
  var f=Math.max(0.02,1-(amount/100)*0.97);
  var tw=Math.max(2,Math.round(w*f)),th=Math.max(2,Math.round(h*f));
  var t=document.createElement('canvas');t.width=tw;t.height=th;
  var tc=t.getContext('2d');tc.imageSmoothingEnabled=true;tc.imageSmoothingQuality='high';
  tc.drawImage(src,0,0,tw,th);
  octx.drawImage(t,0,0,tw,th,0,0,w,h);
 }
 return out;
}
function render(){
 if(!base){return;}
 var prev=document.createElement('canvas');
 prev.width=canvas.width;prev.height=canvas.height;
 prev.getContext('2d').drawImage(base,0,0,canvas.width,canvas.height);
 var blurred=blurCanvas(prev,blurAmt);
 ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.drawImage(blurred,0,0);
}
slider.oninput=function(){
 blurAmt=parseInt(this.value);
 valLbl.textContent=this.value+'%';
 render();
};
function addFile(f){
 if(f.type.indexOf('image/')!==0&&!/\.(jpg|jpeg|png|webp)$/i.test(f.name)){alert('Please select an image file.');return;}
 var rd=new FileReader();
 rd.onload=function(){
  var im=new Image();
  im.onload=function(){
   base=document.createElement('canvas');
   base.width=im.width;base.height=im.height;
   base.getContext('2d').drawImage(im,0,0);
   var maxW=Math.min(640,(window.innerWidth-460));
   if(maxW<300){maxW=Math.min(640,window.innerWidth-60);}
   scale=Math.min(1,maxW/base.width);
   canvas.width=Math.floor(base.width*scale);
   canvas.height=Math.floor(base.height*scale);
   blurAmt=0;slider.value=0;valLbl.textContent='0%';
   dimsEl.textContent=base.width+' × '+base.height+' px';
   pick.style.display='none';work.style.display='block';
   render();
  };
  im.src=rd.result;
 };
 rd.readAsDataURL(f);
}
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};
document.getElementById('bpDl').onclick=function(){
 if(!base){return;}
 var full=blurCanvas(base,blurAmt);
 var fmt=fmtSel.value;
 var data=full.toDataURL(fmt==='png'?'image/png':'image/jpeg',0.92);
 var a=document.createElement('a');
 a.href=data;
 a.download='blurred-photo.'+fmt;
 document.body.appendChild(a);a.click();document.body.removeChild(a);
};
document.getElementById('bpAgain').onclick=function(){
 work.style.display='none';pick.style.display='block';
 base=null;
};
})();
