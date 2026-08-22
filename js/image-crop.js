/* TronoPDF - Image Cropper v1 | pure canvas, no external libs, cannot break */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
var RATIOS={free:['Free',0],sq:['1:1',1],r43:['4:3',4/3],r169:['16:9',16/9],r34:['3:4',3/4],r916:['9:16',9/16],pass:['Passport',35/45]};
var html='';
html+='<style>';
html+='.ic-wrap{max-width:1400px;margin:0 auto}';
html+='.ic-hero{text-align:center;padding:50px 16px 40px}';
html+='.ic-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.ic-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.ic-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.ic-big:hover{transform:translateY(-2px)}';
html+='.ic-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.ic-zone{border:2px dashed transparent;border-radius:18px}';
html+='.ic-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.ic-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.ic-main{display:flex;min-height:640px}';
html+='.ic-prev{flex:1;padding:30px;display:flex;align-items:center;justify-content:center;overflow:auto}';
html+='.ic-canvaswrap{position:relative;border-radius:8px;overflow:hidden;box-shadow:0 10px 40px rgba(30,20,60,.18);background:#fff}';
html+='.ic-canvaswrap canvas{display:block}';
html+='.ic-cropbox{position:absolute;border:2px dashed #7c3aed;box-shadow:0 0 0 9999px rgba(0,0,0,.45);cursor:move;touch-action:none}';
html+='.ic-handle{position:absolute;width:14px;height:14px;background:#7c3aed;border:2px solid #fff;border-radius:50%}';
html+='.ic-handle.nw{top:-7px;left:-7px;cursor:nw-resize}';
html+='.ic-handle.ne{top:-7px;right:-7px;cursor:ne-resize}';
html+='.ic-handle.sw{bottom:-7px;left:-7px;cursor:sw-resize}';
html+='.ic-handle.se{bottom:-7px;right:-7px;cursor:se-resize}';
html+='.ic-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.ic-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:6px}';
html+='.ic-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:16px}';
html+='.ic-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:14px 0 6px}';
html+='.ic-ratiogrid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}';
html+='.ic-ratio{border:2px solid #eceaf6;border-radius:8px;padding:9px 2px;font-size:11px;font-weight:800;text-align:center;cursor:pointer;background:#fff;color:#4b4b5a}';
html+='.ic-ratio.active{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}';
html+='.ic-row{display:flex;gap:8px;align-items:center;margin-top:8px}';
html+='.ic-row select,.ic-row input[type=range]{flex:1}';
html+='.ic-row select{padding:10px;border:1px solid #ddd;border-radius:10px;font-size:14px;background:#fff}';
html+='.ic-row input[type=range]{accent-color:#7c3aed}';
html+='.ic-btnrow{display:flex;gap:8px;margin-top:10px}';
html+='.ic-btnrow button{flex:1;border:1px solid #eceaf6;background:#fff;border-radius:10px;padding:10px;font-size:13px;font-weight:800;cursor:pointer}';
html+='.ic-btnrow button:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.ic-dims{background:#ede9fe;border-radius:10px;padding:10px 14px;font-size:13px;color:#5b21b6;font-weight:700;text-align:center;margin-top:12px}';
html+='.ic-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:14px}';
html+='.ic-done{display:none;text-align:center;padding:50px 20px}';
html+='.ic-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.ic-previmg{max-width:320px;max-height:240px;border-radius:10px;border:1px solid #eceaf6;margin:0 auto 20px;display:block}';
html+='.ic-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.ic-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='@media(max-width:900px){.ic-main{flex-direction:column}.ic-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="ic-wrap">';
html+='<div id="icPick"><div class="ic-hero"><h1>Image Cropper</h1><p>Crop photos to any size or ratio - fast, free and private.</p>';
html+='<div class="ic-zone" id="icZone"><button class="ic-big" id="icBtn" type="button">Select Image</button><p class="ic-drop-hint">or drop an image here</p></div></div></div>';
html+='<div class="ic-work" id="icWork"><div class="ic-main"><div class="ic-prev"><div class="ic-canvaswrap" id="icCanvasWrap"><canvas id="icCanvas"></canvas><div class="ic-cropbox" id="icCropBox"><div class="ic-handle nw"></div><div class="ic-handle ne"></div><div class="ic-handle sw"></div><div class="ic-handle se"></div></div></div></div>';
html+='<aside class="ic-side"><h2>Crop settings</h2><p class="ic-sub">Drag the box or pick a ratio</p>';
html+='<div class="ic-lbl">Aspect ratio</div><div class="ic-ratiogrid" id="icRatios"></div>';
html+='<div class="ic-btnrow"><button id="icRotL" type="button">⟲ Rotate</button><button id="icReset" type="button">↺ Reset</button></div>';
html+='<div class="ic-lbl">Output format</div><div class="ic-row"><select id="icFmt"><option value="png">PNG (lossless)</option><option value="jpg">JPG (smaller)</option></select></div>';
html+='<div class="ic-lbl">Quality: <span id="icQVal">92</span>%</div><div class="ic-row"><input type="range" id="icQ" min="10" max="100" value="92"/></div>';
html+='<div class="ic-dims" id="icDims">—</div>';
html+='<button class="ic-go" id="icGo" type="button">Crop Image →</button></aside></div></div>';
html+='<div class="ic-done" id="icDone"><div class="ic-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">Image cropped!</h1><img class="ic-previmg" id="icDoneImg" alt=""/><p style="color:#7a7a85;font-size:15px;margin-bottom:24px" id="icDoneInfo"></p><a class="ic-dl" id="icDl" href="#">⬇ Download Cropped Image</a><button class="ic-again" id="icAgain" type="button">Crop another</button></div>';
html+='<input type="file" id="icFile" accept="image/*,.jpg,.jpeg,.png,.webp" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var base=null,scale=1,curRatio=0;
var crop={x:0,y:0,w:100,h:100};
var pick=document.getElementById('icPick'),work=document.getElementById('icWork'),done=document.getElementById('icDone');
var zone=document.getElementById('icZone'),btn=document.getElementById('icBtn'),inp=document.getElementById('icFile');
var canvas=document.getElementById('icCanvas'),ctx=canvas.getContext('2d');
var cropEl=document.getElementById('icCropBox'),dimsEl=document.getElementById('icDims');
var elFmt=document.getElementById('icFmt'),elQ=document.getElementById('icQ');
var ratioWrap=document.getElementById('icRatios');
Object.keys(RATIOS).forEach(function(k){
 var d=document.createElement('div');d.className='ic-ratio'+(k==='free'?' active':'');d.textContent=RATIOS[k][0];d.setAttribute('data-k',k);
 d.onclick=function(){
  ratioWrap.querySelectorAll('.ic-ratio').forEach(function(x){x.classList.remove('active');});
  d.classList.add('active');
  curRatio=RATIOS[k][1];
  if(curRatio>0){applyRatio();}
 };
 ratioWrap.appendChild(d);
});
elQ.oninput=function(){document.getElementById('icQVal').textContent=this.value;};
function applyRatio(){
 if(!base){return;}
 var bw=base.width,bh=base.height;
 var h=bh,w=h*curRatio;
 if(w>bw){w=bw;h=w/curRatio;}
 crop={x:(bw-w)/2,y:(bh-h)/2,w:w,h:h};
 syncUI();
}
function clampCrop(){
 if(!base){return;}
 crop.w=Math.max(10,Math.min(crop.w,base.width));
 crop.h=Math.max(10,Math.min(crop.h,base.height));
 crop.x=Math.max(0,Math.min(crop.x,base.width-crop.w));
 crop.y=Math.max(0,Math.min(crop.y,base.height-crop.h));
}
function syncUI(){
 clampCrop();
 cropEl.style.left=(crop.x*scale)+'px';
 cropEl.style.top=(crop.y*scale)+'px';
 cropEl.style.width=(crop.w*scale)+'px';
 cropEl.style.height=(crop.h*scale)+'px';
 dimsEl.textContent=Math.round(crop.w)+' × '+Math.round(crop.h)+' px';
}
var dragMode=null,sx=0,sy=0,sb=null;
cropEl.addEventListener('pointerdown',function(e){
 dragMode=e.target.classList.contains('ic-handle')?e.target.classList[1]:'move';
 sx=e.clientX;sy=e.clientY;sb={x:crop.x,y:crop.y,w:crop.w,h:crop.h};
 cropEl.setPointerCapture(e.pointerId);e.preventDefault();
});
cropEl.addEventListener('pointermove',function(e){
 if(!dragMode){return;}
 var dx=(e.clientX-sx)/scale,dy=(e.clientY-sy)/scale;
 if(dragMode==='move'){crop.x=sb.x+dx;crop.y=sb.y+dy;}
 else if(dragMode==='nw'){crop.x=sb.x+dx;crop.y=sb.y+dy;crop.w=sb.w-dx;crop.h=sb.h-dy;}
 else if(dragMode==='ne'){crop.y=sb.y+dy;crop.w=sb.w+dx;crop.h=sb.h-dy;}
 else if(dragMode==='sw'){crop.x=sb.x+dx;crop.w=sb.w-dx;crop.h=sb.h+dy;}
 else if(dragMode==='se'){crop.w=sb.w+dx;crop.h=sb.h+dy;}
 if(curRatio>0){
  if(dragMode==='se'||dragMode==='ne'){crop.h=crop.w/curRatio;}
  else if(dragMode==='nw'||dragMode==='sw'){crop.h=crop.w/curRatio;crop.y=sb.y+sb.h-crop.h;}
 }
 syncUI();
});
cropEl.addEventListener('pointerup',function(){dragMode=null;});
cropEl.addEventListener('pointercancel',function(){dragMode=null;});
function drawPreview(){
 if(!base){return;}
 var maxW=Math.min(640,(window.innerWidth-460));
 if(maxW<300){maxW=Math.min(640,window.innerWidth-60);}
 scale=maxW/base.width;
 if(scale>1){scale=1;}
 canvas.width=Math.floor(base.width*scale);
 canvas.height=Math.floor(base.height*scale);
 ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 ctx.drawImage(base,0,0,canvas.width,canvas.height);
 syncUI();
}
function addFile(f){
 if(f.type.indexOf('image/')!==0&&!/\.(jpg|jpeg|png|webp)$/i.test(f.name)){alert('Please select an image file.');return;}
 var rd=new FileReader();
 rd.onload=function(){
  var im=new Image();
  im.onload=function(){
   base=document.createElement('canvas');
   base.width=im.width;base.height=im.height;
   base.getContext('2d').drawImage(im,0,0);
   crop={x:0,y:0,w:base.width,h:base.height};
   pick.style.display='none';work.style.display='block';done.style.display='none';
   drawPreview();
  };
  im.src=rd.result;
 };
 rd.readAsDataURL(f);
}
document.getElementById('icRotL').onclick=function(){
 if(!base){return;}
 var nc=document.createElement('canvas');
 nc.width=base.height;nc.height=base.width;
 var nx=nc.getContext('2d');
 nx.translate(nc.width/2,nc.height/2);
 nx.rotate(-Math.PI/2);
 nx.drawImage(base,-base.width/2,-base.height/2);
 base=nc;
 crop={x:0,y:0,w:base.width,h:base.height};
 drawPreview();
};
document.getElementById('icReset').onclick=function(){
 if(!base){return;}
 crop={x:0,y:0,w:base.width,h:base.height};
 syncUI();
};
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};
document.getElementById('icGo').onclick=function(){
 if(!base){return;}
 clampCrop();
 var out=document.createElement('canvas');
 out.width=Math.max(1,Math.round(crop.w));
 out.height=Math.max(1,Math.round(crop.h));
 var octx=out.getContext('2d');
 var fmt=elFmt.value;
 if(fmt==='jpg'){octx.fillStyle='#fff';octx.fillRect(0,0,out.width,out.height);}
 octx.imageSmoothingEnabled=true;octx.imageSmoothingQuality='high';
 octx.drawImage(base,Math.round(crop.x),Math.round(crop.y),Math.round(crop.w),Math.round(crop.h),0,0,out.width,out.height);
 var mime=fmt==='png'?'image/png':'image/jpeg';
 var data=out.toDataURL(mime,(parseInt(elQ.value)||92)/100);
 var bytes=atob(data.split(',')[1]).length;
 work.style.display='none';done.style.display='block';
 document.getElementById('icDoneImg').src=data;
 document.getElementById('icDoneInfo').textContent=out.width+' × '+out.height+' px • '+fmtB(bytes);
 var dl=document.getElementById('icDl');
 dl.href=data;
 dl.download='cropped-image.'+fmt;
};
document.getElementById('icAgain').onclick=function(){
 done.style.display='none';pick.style.display='block';work.style.display='none';
 base=null;
};
})();
