/* TronoPDF - Blur Photo v1 | rect/brush/pixelate, pure canvas, cannot break */
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
html+='.bp-canvaswrap{position:relative;border-radius:8px;overflow:hidden;box-shadow:0 10px 40px rgba(30,20,60,.18);background:#fff;touch-action:none;cursor:crosshair}';
html+='.bp-canvaswrap canvas{display:block}';
html+='.bp-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.bp-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:6px}';
html+='.bp-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:16px}';
html+='.bp-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:14px 0 6px}';
html+='.bp-toolgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}';
html+='.bp-tool{border:2px solid #eceaf6;border-radius:10px;padding:12px 4px;font-size:11px;font-weight:800;text-align:center;cursor:pointer;background:#fff;color:#4b4b5a}';
html+='.bp-tool.active{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}';
html+='.bp-tool .ico{font-size:20px;display:block;margin-bottom:3px}';
html+='.bp-row{display:flex;gap:8px;align-items:center;margin-top:8px}';
html+='.bp-row input[type=range]{flex:1;accent-color:#7c3aed}';
html+='.bp-row select{flex:1;padding:10px;border:1px solid #ddd;border-radius:10px;font-size:14px;background:#fff}';
html+='.bp-btnrow{display:flex;gap:8px;margin-top:10px}';
html+='.bp-btnrow button{flex:1;border:1px solid #eceaf6;background:#fff;border-radius:10px;padding:10px;font-size:13px;font-weight:800;cursor:pointer}';
html+='.bp-btnrow button:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.bp-btnrow .danger:hover{border-color:#dc2626;color:#dc2626}';
html+='.bp-count{background:#ede9fe;border-radius:10px;padding:10px 14px;font-size:13px;color:#5b21b6;font-weight:700;text-align:center;margin-top:12px}';
html+='.bp-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:14px}';
html+='.bp-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.bp-busy{display:none;padding:60px 20px;text-align:center}';
html+='.bp-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.bp-spin{width:40px;height:40px;border:4px solid #e0e7ff;border-top-color:#7c3aed;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 14px}';
html+='@keyframes spin{to{transform:rotate(360deg)}}';
html+='.bp-done{display:none;text-align:center;padding:50px 20px}';
html+='.bp-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.bp-previmg{max-width:360px;max-height:280px;border-radius:10px;border:1px solid #eceaf6;margin:0 auto 20px;display:block;box-shadow:0 4px 20px rgba(30,20,60,.08)}';
html+='.bp-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.bp-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='@media(max-width:900px){.bp-main{flex-direction:column}.bp-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="bp-wrap">';
html+='<div id="bpPick"><div class="bp-hero"><h1>Blur Photo</h1><p>Blur, pixelate or hide any part of a photo - faces, plates, sensitive info. Fast, free and private.</p>';
html+='<div class="bp-zone" id="bpZone"><button class="bp-big" id="bpBtn" type="button">Select Image</button><p class="bp-drop-hint">or drop an image here</p></div></div></div>';
html+='<div class="bp-work" id="bpWork"><div class="bp-main"><div class="bp-prev"><div class="bp-canvaswrap" id="bpWrap"><canvas id="bpCanvas"></canvas></div></div>';
html+='<aside class="bp-side"><h2>Blur tools</h2><p class="bp-sub">Pick a tool, then paint or drag on the image</p>';
html+='<div class="bp-toolgrid">';
html+='<div class="bp-tool active" data-tool="rect"><span class="ico">▭</span>Rectangle</div>';
html+='<div class="bp-tool" data-tool="brush"><span class="ico">🖌</span>Brush</div>';
html+='<div class="bp-tool" data-tool="pixel"><span class="ico">▦</span>Pixelate</div>';
html+='</div>';
html+='<div class="bp-lbl">Intensity / Block size: <span id="bpValVal">20</span></div><div class="bp-row"><input type="range" id="bpVal" min="5" max="60" value="20"/></div>';
html+='<div class="bp-lbl">Output format</div><div class="bp-row"><select id="bpFmt"><option value="png">PNG (lossless)</option><option value="jpg">JPG (smaller)</option></select></div>';
html+='<div class="bp-btnrow"><button id="bpUndo" type="button">↶ Undo last</button><button class="danger" id="bpClear" type="button">✕ Clear all</button></div>';
html+='<div class="bp-count" id="bpCount">0 regions added</div>';
html+='<button class="bp-go" id="bpGo" type="button">Apply & Download →</button></aside></div></div>';
html+='<div class="bp-busy" id="bpBusy"><div class="bp-spin"></div><h2>Applying blur...</h2></div>';
html+='<div class="bp-done" id="bpDone"><div class="bp-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">Photo blurred successfully!</h1><img class="bp-previmg" id="bpDoneImg" alt=""/><p style="color:#7a7a85;font-size:15px;margin-bottom:24px" id="bpDoneInfo"></p><a class="bp-dl" id="bpDl" href="#">⬇ Download Blurred Photo</a><button class="bp-again" id="bpAgain" type="button">Blur another</button></div>';
html+='<input type="file" id="bpFile" accept="image/*,.jpg,.jpeg,.png,.webp" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var base=null,scale=1,curTool='rect',curVal=20;
var regions=[];
var drawing=false,drawStart=null,drawPath=[];
var pick=document.getElementById('bpPick'),work=document.getElementById('bpWork'),busy=document.getElementById('bpBusy'),done=document.getElementById('bpDone');
var zone=document.getElementById('bpZone'),btn=document.getElementById('bpBtn'),inp=document.getElementById('bpFile');
var wrap=document.getElementById('bpWrap'),canvas=document.getElementById('bpCanvas'),ctx=canvas.getContext('2d');
var countEl=document.getElementById('bpCount');
var toolBtns=document.querySelectorAll('.bp-tool');
toolBtns.forEach(function(b){
 b.onclick=function(){
  toolBtns.forEach(function(x){x.classList.remove('active');});
  b.classList.add('active');
  curTool=b.getAttribute('data-tool');
 };
});
document.getElementById('bpVal').oninput=function(){
 curVal=parseInt(this.value);
 document.getElementById('bpValVal').textContent=this.value;
};
function redraw(){
 if(!base){return;}
 ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 ctx.drawImage(base,0,0,canvas.width,canvas.height);
 regions.forEach(function(r){drawRegionPreview(r);});
 if(drawing&&drawStart&&curTool==='rect'){
  ctx.strokeStyle='rgba(124,58,237,0.9)';
  ctx.lineWidth=2;
  ctx.setLineDash([5,5]);
  var x=Math.min(drawStart.x,drawStart.x2),y=Math.min(drawStart.y,drawStart.y2);
  var w=Math.abs(drawStart.x2-drawStart.x),h=Math.abs(drawStart.y2-drawStart.y);
  ctx.strokeRect(x,y,w,h);
  ctx.setLineDash([]);
 }
 if(drawing&&curTool==='brush'&&drawPath.length>1){
  ctx.strokeStyle='rgba(124,58,237,0.8)';
  ctx.lineWidth=curVal*2*scale;
  ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();
  ctx.moveTo(drawPath[0].x,drawPath[0].y);
  for(var i=1;i<drawPath.length;i++){ctx.lineTo(drawPath[i].x,drawPath[i].y);}
  ctx.stroke();
 }
 countEl.textContent=regions.length+' region'+(regions.length===1?'':'s')+' added';
}
function drawRegionPreview(r){
 if(r.type==='rect'){
  applyRectBlur(canvas,r.x/scale,r.y/scale,r.w/scale,r.h/scale,r.val,ctx);
  // re-draw on preview scale by extracting region and drawing it
  var rx=Math.floor(r.x),ry=Math.floor(r.y),rw=Math.ceil(r.w),rh=Math.ceil(r.h);
  if(rw<2||rh<2){return;}
  var regionSrc=document.createElement('canvas');
  regionSrc.width=rw;regionSrc.height=rh;
  var rsx=regionSrc.getContext('2d');
  rsx.drawImage(base,r.x/scale,r.y/scale,rw/scale,rh/scale,0,0,rw,rh);
  applyRectBlur(regionSrc,0,0,rw,rh,r.val,rsx);
  ctx.drawImage(regionSrc,rx,ry);
 }else if(r.type==='brush'){
  ctx.strokeStyle=r.color;
  ctx.lineWidth=r.size*scale;
  ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();
  ctx.moveTo(r.path[0].x,r.path[0].y);
  for(var i=1;i<r.path.length;i++){ctx.lineTo(r.path[i].x,r.path[i].y);}
  ctx.stroke();
 }else if(r.type==='pixel'){
  var rx=Math.floor(r.x),ry=Math.floor(r.y),rw=Math.ceil(r.w),rh=Math.ceil(r.h);
  if(rw<2||rh<2){return;}
  var regionSrc=document.createElement('canvas');
  regionSrc.width=rw;regionSrc.height=rh;
  var rsx=regionSrc.getContext('2d');
  rsx.drawImage(base,r.x/scale,r.y/scale,rw/scale,rh/scale,0,0,rw,rh);
  applyPixelate(regionSrc,0,0,rw,rh,r.val,rsx);
  ctx.drawImage(regionSrc,rx,ry);
 }
}
function applyRectBlur(cv,x,y,w,h,radius,c){
 if(w<2||h<2){return;}
 var smallW=Math.max(2,Math.floor(w/radius));
 var smallH=Math.max(2,Math.floor(h/radius));
 var tmp=document.createElement('canvas');tmp.width=smallW;tmp.height=smallH;
 var tc=tmp.getContext('2d');
 tc.imageSmoothingEnabled=true;tc.imageSmoothingQuality='high';
 tc.drawImage(cv,x,y,w,h,0,0,smallW,smallH);
 c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
 c.drawImage(tmp,0,0,smallW,smallH,x,y,w,h);
}
function applyPixelate(cv,x,y,w,h,blockSize,c){
 if(w<2||h<2){return;}
 var sw=Math.max(1,Math.floor(w/blockSize));
 var sh=Math.max(1,Math.floor(h/blockSize));
 var tmp=document.createElement('canvas');tmp.width=sw;tmp.height=sh;
 var tc=tmp.getContext('2d');
 tc.imageSmoothingEnabled=false;
 tc.drawImage(cv,x,y,w,h,0,0,sw,sh);
 c.imageSmoothingEnabled=false;
 c.drawImage(tmp,0,0,sw,sh,x,y,w,h);
 c.imageSmoothingEnabled=true;
}
function pointerPos(e){
 var r=canvas.getBoundingClientRect();
 return {x:e.clientX-r.left,y:e.clientY-r.top};
}
wrap.addEventListener('pointerdown',function(e){
 if(!base){return;}
 drawing=true;
 var p=pointerPos(e);
 if(curTool==='rect'){drawStart={x:p.x,y:p.y,x2:p.x,y2:p.y};}
 else if(curTool==='brush'||curTool==='pixel'){drawPath=[p];}
 wrap.setPointerCapture(e.pointerId);e.preventDefault();
});
wrap.addEventListener('pointermove',function(e){
 if(!drawing){return;}
 var p=pointerPos(e);
 if(curTool==='rect'&&drawStart){drawStart.x2=p.x;drawStart.y2=p.y;}
 else if((curTool==='brush'||curTool==='pixel')&&drawPath.length){drawPath.push(p);}
 redraw();
});
wrap.addEventListener('pointerup',function(e){
 if(!drawing){return;}
 var p=pointerPos(e);
 if(curTool==='rect'&&drawStart){
  var x=Math.min(drawStart.x,p.x),y=Math.min(drawStart.y,p.y);
  var w=Math.abs(p.x-drawStart.x),h=Math.abs(p.y-drawStart.y);
  if(w>5&&h>5){regions.push({type:'rect',x:x,y:y,w:w,h:h,val:curVal});}
 }else if(curTool==='brush'&&drawPath.length>1){
  regions.push({type:'brush',path:drawPath.slice(),size:curVal*2,color:'rgba(124,58,237,0.85)'});
 }else if(curTool==='pixel'&&drawPath.length>0){
  var xs=drawPath.map(function(pp){return pp.x;}),ys=drawPath.map(function(pp){return pp.y;});
  var x=Math.min.apply(null,xs),y=Math.min.apply(null,ys);
  var x2=Math.max.apply(null,xs),y2=Math.max.apply(null,ys);
  var w=x2-x,h=y2-y;
  if(w>5&&h>5){regions.push({type:'pixel',x:x,y:y,w:w,h:h,val:curVal});}
 }
 drawing=false;drawStart=null;drawPath=[];
 redraw();
});
wrap.addEventListener('pointercancel',function(){drawing=false;drawStart=null;drawPath=[];redraw();});
document.getElementById('bpUndo').onclick=function(){
 if(regions.length===0){return;}
 regions.pop();redraw();
};
document.getElementById('bpClear').onclick=function(){
 regions=[];redraw();
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
   regions=[];
   pick.style.display='none';work.style.display='block';done.style.display='none';
   redraw();
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
document.getElementById('bpGo').onclick=function(){
 if(!base){return;}
 work.style.display='none';busy.style.display='block';
 setTimeout(function(){
  var out=document.createElement('canvas');
  out.width=base.width;out.height=base.height;
  var octx=out.getContext('2d');
  octx.drawImage(base,0,0);
  regions.forEach(function(r){
   if(r.type==='rect'){
    applyRectBlur(out,r.x/scale,r.y/scale,r.w/scale,r.h/scale,r.val,octx);
   }else if(r.type==='brush'){
    octx.strokeStyle='rgba(124,58,237,0.85)';
    octx.lineWidth=r.size/scale*r.size*0.5;
    octx.lineCap='round';octx.lineJoin='round';
    octx.beginPath();
    octx.moveTo(r.path[0].x/scale,r.path[0].y/scale);
    for(var i=1;i<r.path.length;i++){octx.lineTo(r.path[i].x/scale,r.path[i].y/scale);}
    octx.stroke();
    // Re-draw over blur with actual brush region pixelate for stronger effect
    var xs=r.path.map(function(p){return p.x/scale;}),ys=r.path.map(function(p){return p.y/scale;});
    var minX=Math.max(0,Math.min.apply(null,xs)-r.size/2);
    var minY=Math.max(0,Math.min.apply(null,ys)-r.size/2);
    var maxX=Math.min(out.width,Math.max.apply(null,xs)+r.size/2);
    var maxY=Math.min(out.height,Math.max.apply(null,ys)+r.size/2);
    var bw=maxX-minX,bh=maxY-minY;
    if(bw>1&&bh>1){
     applyPixelate(out,minX,minY,bw,bh,Math.max(4,Math.floor(r.size*0.6)),octx);
    }
   }else if(r.type==='pixel'){
    applyPixelate(out,r.x/scale,r.y/scale,r.w/scale,r.h/scale,r.val,octx);
   }
  });
  var fmt=document.getElementById('bpFmt').value;
  var mime=fmt==='png'?'image/png':'image/jpeg';
  var data=out.toDataURL(mime,0.92);
  var bytes=atob(data.split(',')[1]).length;
  busy.style.display='none';done.style.display='block';
  document.getElementById('bpDoneImg').src=data;
  document.getElementById('bpDoneInfo').textContent=out.width+' × '+out.height+' px • '+fmtB(bytes)+' • '+regions.length+' region'+(regions.length===1?'':'s');
  var dl=document.getElementById('bpDl');
  dl.href=data;
  dl.download='blurred-photo.'+fmt;
 },50);
};
document.getElementById('bpAgain').onclick=function(){
 done.style.display='none';pick.style.display='block';work.style.display='none';
 base=null;regions=[];
};
})();
