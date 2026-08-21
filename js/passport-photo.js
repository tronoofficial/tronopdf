/* TronoPDF - Passport Photo Maker v1 | presets, crop+zoom, bg replace, exact KB, print sheet */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
var PRESETS={
 in_passport:[35,45],in_pan:[25,35],us:[51,51],uk:[35,45],schengen:[35,45],canada:[50,70],china:[33,48],custom:[35,45]
};
var COLORS={white:[255,255,255],blue:[59,130,246],red:[220,38,38]};
root.innerHTML='<style>'+
'.pp-wrap{max-width:1400px;margin:0 auto}'+
'.pp-hero{text-align:center;padding:50px 16px 40px}'+
'.pp-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}'+
'.pp-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}'+
'.pp-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}'+
'.pp-big:hover{transform:translateY(-2px)}'+
'.pp-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}'+
'.pp-zone{border:2px dashed transparent;border-radius:18px}'+
'.pp-zone.on{border-color:#7c3aed;background:#f3f0ff}'+
'.pp-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}'+
'.pp-main{display:flex;min-height:640px}'+
'.pp-crop{flex:1;padding:40px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px}'+
'.pp-frame{position:relative;border-radius:10px;overflow:hidden;box-shadow:0 10px 40px rgba(30,20,60,.18);cursor:move;touch-action:none;background:#e5e7eb}'+
'.pp-frame canvas{display:block}'+
'.pp-hint{font-size:13px;color:#9a9aa5}'+
'.pp-zoom{display:flex;align-items:center;gap:12px;width:320px}'+
'.pp-zoom input{flex:1;accent-color:#7c3aed}'+
'.pp-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}'+
'.pp-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:6px}'+
'.pp-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:16px}'+
'.pp-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}'+
'.pp-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;font-family:inherit;background:#fff}'+
'.pp-info{background:#ede9fe;border-radius:10px;padding:10px 14px;font-size:13px;color:#5b21b6;font-weight:700;text-align:center;margin-top:8px}'+
'.pp-row{display:flex;gap:10px;align-items:center}'+
'.pp-row input[type=number]{flex:1;padding:10px;border:1px solid #ddd;border-radius:10px;font-size:14px;min-width:0}'+
'.pp-bg{display:flex;gap:10px}'+
'.pp-bg button{flex:1;padding:10px;border:2px solid #eceaf6;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;background:#fff;color:#4b4b5a}'+
'.pp-bg button.active{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}'+
'.pp-row input[type=range]{flex:1;accent-color:#7c3aed}'+
'.pp-chk{display:flex;gap:8px;align-items:center;margin:8px 0}'+
'.pp-chk input{width:16px;height:16px;accent-color:#7c3aed}'+
'.pp-chk label{font-size:13px;font-weight:600;cursor:pointer}'+
'.pp-quick{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}'+
'.pp-quick button{border:1px solid #eceaf6;background:#f7f6fc;color:#4b4b5a;font-size:11px;font-weight:800;padding:6px 12px;border-radius:999px;cursor:pointer}'+
'.pp-quick button:hover{border-color:#7c3aed;color:#7c3aed}'+
'.pp-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:16px}'+
'.pp-done{display:none;text-align:center;padding:50px 20px}'+
'.pp-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}'+
'.pp-dls{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:16px}'+
'.pp-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:15px;padding:15px 34px;border-radius:12px;box-shadow:0 12px 28px rgba(22,163,74,.3)}'+
'.pp-dl.sheet{background:#7c3aed;box-shadow:0 12px 28px rgba(124,58,237,.3)}'+
'.pp-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:14px 26px;border-radius:12px;border:none;cursor:pointer}'+
'@media(max-width:900px){.pp-main{flex-direction:column}.pp-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}'+
'</style>'+
'<div class="pp-wrap">'+
'<div id="ppPick"><div class="pp-hero"><h1>Passport Photo Maker</h1><p>Perfect ID photos in seconds - correct size, clean background, print-ready sheet.</p>'+
'<div class="pp-zone" id="ppZone"><button class="pp-big" id="ppBtn" type="button">Select Photo</button><p class="pp-drop-hint">or drop a photo here</p></div></div></div>'+
'<div class="pp-work" id="ppWork"><div class="pp-main"><div class="pp-crop"><div class="pp-frame" id="ppFrame"><canvas id="ppCanvas"></canvas></div><div class="pp-zoom"><span style="font-size:12px;font-weight:800">🔍</span><input type="range" id="ppZoom" min="50" max="300" value="100"/></div><p class="pp-hint">Drag photo to position • Zoom to adjust • Face should fill the frame</p></div>'+
'<aside class="pp-side"><h2>Photo settings</h2><p class="pp-sub">Everything set automatically for your document</p>'+
'<div class="pp-lbl">Document type</div><select class="pp-inp" id="ppPreset"><option value="in_passport">India Passport / Visa (35×45 mm)</option><option value="in_pan">India PAN Card (25×35 mm)</option><option value="us">US Passport / Visa (2×2 inch)</option><option value="uk">UK Passport (35×45 mm)</option><option value="schengen">Schengen Visa (35×45 mm)</option><option value="canada">Canada Passport (50×70 mm)</option><option value="china">China Passport (33×48 mm)</option><option value="custom">Custom size (mm)</option></select>'+
'<div class="pp-row" id="ppCustomRow" style="display:none;margin-top:8px"><input type="number" id="ppMmW" value="35" min="10" max="100"/><span style="font-size:12px;color:#9a9aa5">×</span><input type="number" id="ppMmH" value="45" min="10" max="100"/><span style="font-size:12px;color:#9a9aa5">mm</span></div>'+
'<div class="pp-info" id="ppInfo"></div>'+
'<div class="pp-lbl">Background</div><div class="pp-bg"><button class="active" data-bg="orig" type="button">Original</button><button data-bg="white" type="button">White</button><button data-bg="blue" type="button">Blue</button><button data-bg="red" type="button">Red</button></div>'+
'<div class="pp-lbl">Background match: <span id="ppTolVal">45</span></div><div class="pp-row"><input type="range" id="ppTol" min="5" max="100" value="45"/></div>'+
'<div class="pp-chk"><input type="checkbox" id="ppKb"><label for="ppKb">Set exact file size (for forms)</label></div>'+
'<div id="ppKbBox" style="display:none"><div class="pp-row"><input type="number" id="ppKbVal" value="50" min="5"/><select id="ppKbUnit"><option value="KB">KB</option></select></div><div class="pp-quick"><button type="button" data-kb="20">20 KB</button><button type="button" data-kb="50">50 KB</button><button type="button" data-kb="100">100 KB</button></div></div>'+
'<div class="pp-chk"><input type="checkbox" id="ppSheet" checked><label for="ppSheet">Also make 4×6 inch print sheet</label></div>'+
'<button class="pp-go" id="ppGo" type="button">Make My Photo →</button></aside></div></div>'+
'<div class="pp-done" id="ppDone"><div class="pp-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">Your photo is ready!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:24px" id="ppDoneInfo"></p><div class="pp-dls"><a class="pp-dl" id="ppDlPhoto" href="#">⬇ Download Photo</a><a class="pp-dl sheet" id="ppDlSheet" href="#">⬇ Download Print Sheet</a></div><button class="pp-again" id="ppAgain" type="button">Make another photo</button></div>'+
'<input type="file" id="ppFile" accept="image/*,.jpg,.jpeg,.png,.webp" style="display:none">'+
'</div>';
var img=null;var frameW=300,frameH=386;var base=1,scale=1,zoom=1,ox=0,oy=0;var bgMode='orig';
var pick=document.getElementById('ppPick'),work=document.getElementById('ppWork'),done=document.getElementById('ppDone');
var zone=document.getElementById('ppZone'),btn=document.getElementById('ppBtn'),inp=document.getElementById('ppFile');
var frame=document.getElementById('ppFrame'),canvas=document.getElementById('ppCanvas'),ctx=canvas.getContext('2d');
var elZoom=document.getElementById('ppZoom'),elPreset=document.getElementById('ppPreset'),elInfo=document.getElementById('ppInfo');
var elTol=document.getElementById('ppTol'),elKb=document.getElementById('ppKb'),elKbBox=document.getElementById('ppKbBox'),elKbVal=document.getElementById('ppKbVal');
var elSheet=document.getElementById('ppSheet');
var elMmW=document.getElementById('ppMmW'),elMmH=document.getElementById('ppMmH'),elCustomRow=document.getElementById('ppCustomRow');
function mm(){
 if(elPreset.value==='custom'){return [parseFloat(elMmW.value)||35,parseFloat(elMmH.value)||45];}
 return PRESETS[elPreset.value];
}
function targetPx(){
 var m=mm();
 return [Math.round(m[0]/25.4*300),Math.round(m[1]/25.4*300)];
}
function updateInfo(){
 var m=mm();var t=targetPx();
 elInfo.textContent=m[0]+'×'+m[1]+' mm • '+t[0]+'×'+t[1]+' px @300 DPI';
}
function setupFrame(){
 var m=mm();
 frameH=Math.round(frameW*m[1]/m[0]);
 canvas.width=frameW;canvas.height=frameH;
 frame.style.width=frameW+'px';frame.style.height=frameH+'px';
 if(img){resetCrop();}
 updateInfo();drawPreview(false);
}
function resetCrop(){
 base=Math.max(frameW/img.width,frameH/img.height);
 zoom=1;elZoom.value=100;
 scale=base;
 ox=(frameW-img.width*scale)/2;
 oy=(frameH-img.height*scale)/2;
}
function replaceBg(c2,w,h){
 if(bgMode==='orig'){return;}
 var x=c2.getContext('2d');
 var d=x.getImageData(0,0,w,h);var p=d.data;
 var pts=[[2,2],[w-3,2],[2,h-3],[w-3,h-3]];
 var r=0,g=0,b=0;
 for(var k=0;k<pts.length;k++){var i=(pts[k][1]*w+pts[k][0])*4;r+=p[i];g+=p[i+1];b+=p[i+2];}
 r/=4;g/=4;b/=4;
 var tc=COLORS[bgMode];var tol=parseInt(elTol.value)||45;var t2=tol*tol*3;
 for(var i2=0;i2<p.length;i2+=4){
  var dr=p[i2]-r,dg=p[i2+1]-g,db=p[i2+2]-b;
  if(dr*dr+dg*dg+db*db<t2){p[i2]=tc[0];p[i2+1]=tc[1];p[i2+2]=tc[2];}
 }
 x.putImageData(d,0,0);
}
function drawPreview(withBg){
 if(!img){return;}
 ctx.fillStyle='#e5e7eb';ctx.fillRect(0,0,frameW,frameH);
 ctx.drawImage(img,ox,oy,img.width*scale,img.height*scale);
 if(withBg&&bgMode!=='orig'){replaceBg(canvas,frameW,frameH);}
}
elPreset.onchange=function(){elCustomRow.style.display=this.value==='custom'?'flex':'none';setupFrame();};
elMmW.oninput=setupFrame;elMmH.oninput=setupFrame;
elZoom.oninput=function(){
 var nz=this.value/100;
 var ns=base*nz;
 var cx=(frameW/2-ox)/scale,cy=(frameH/2-oy)/scale;
 scale=ns;
 ox=frameW/2-cx*scale;oy=frameH/2-cy*scale;
 zoom=nz;
 drawPreview(false);
};
elTol.oninput=function(){document.getElementById('ppTolVal').textContent=this.value;drawPreview(true);};
document.querySelectorAll('.pp-bg button').forEach(function(b){
 b.onclick=function(){
  document.querySelectorAll('.pp-bg button').forEach(function(x){x.classList.remove('active');});
  this.classList.add('active');
  bgMode=this.getAttribute('data-bg');
  drawPreview(true);
 };
});
elKb.onchange=function(){elKbBox.style.display=this.checked?'block':'none';};
document.querySelectorAll('.pp-quick button').forEach(function(b){
 b.onclick=function(){elKbVal.value=this.getAttribute('data-kb');};
});
var dragging=false,lx=0,ly=0;
frame.addEventListener('pointerdown',function(e){dragging=true;lx=e.clientX;ly=e.clientY;frame.setPointerCapture(e.pointerId);});
frame.addEventListener('pointermove',function(e){
 if(!dragging){return;}
 ox+=e.clientX-lx;oy+=e.clientY-ly;lx=e.clientX;ly=e.clientY;
 drawPreview(false);
});
frame.addEventListener('pointerup',function(){dragging=false;drawPreview(true);});
frame.addEventListener('pointercancel',function(){dragging=false;});
function addFile(f){
 if(f.type.indexOf('image/')!==0&&!/\.(jpg|jpeg|png|webp)$/i.test(f.name)){alert('Please select an image file.');return;}
 var u=URL.createObjectURL(f);
 var im=new Image();
 im.onload=function(){
  img=im;
  pick.style.display='none';work.style.display='block';done.style.display='none';
  setupFrame();resetCrop();drawPreview(true);
 };
 im.src=u;
}
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};
document.getElementById('ppGo').onclick=function(){
 if(!img){return;}
 var t=targetPx();
 var f=t[0]/frameW;
 var c=document.createElement('canvas');c.width=t[0];c.height=t[1];
 var x=c.getContext('2d');
 x.fillStyle='#fff';x.fillRect(0,0,t[0],t[1]);
 x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
 x.drawImage(img,ox*f,oy*f,img.width*scale*f,img.height*scale*f);
 if(bgMode!=='orig'){replaceBg(c,t[0],t[1]);}
 var finalCanvas=c;
 function finish(dataURL,bytes){
  work.style.display='none';done.style.display='block';
  document.getElementById('ppDoneInfo').textContent=t[0]+'×'+t[1]+' px • '+fmtB(bytes);
  var dl=document.getElementById('ppDlPhoto');dl.href=dataURL;dl.download='passport-photo-'+t[0]+'x'+t[1]+'.jpg';
  var dlS=document.getElementById('ppDlSheet');
  if(elSheet.checked){
   var sheet=document.createElement('canvas');sheet.width=1800;sheet.height=1200;
   var sx=sheet.getContext('2d');sx.fillStyle='#fff';sx.fillRect(0,0,1800,1200);
   var pw=t[0],ph=t[1],gap=24;
   var cols=Math.floor((1800-gap)/(pw+gap)),rows=Math.floor((1200-gap)/(ph+gap));
   var gw=cols*(pw+gap)+gap,gh=rows*(ph+gap)+gap;
   var startX=(1800-gw)/2+gap,startY=(1200-gh)/2+gap;
   for(var r2=0;r2<rows;r2++){
    for(var c2=0;c2<cols;c2++){
     sx.drawImage(finalCanvas,startX+c2*(pw+gap),startY+r2*(ph+gap),pw,ph);
    }
   }
   var sd=sheet.toDataURL('image/jpeg',0.92);
   dlS.href=sd;dlS.download='print-sheet-4x6.jpg';dlS.style.display='inline-block';
  }else{dlS.style.display='none';}
 },300;
 if(elKb.checked){
  var target=(parseFloat(elKbVal.value)||50)*1024;
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
  var d3=c.toDataURL('image/jpeg',0.92);
  finish(d3,atob(d3.split(',')[1]).length);
 }
};
document.getElementById('ppAgain').onclick=function(){
 done.style.display='none';pick.style.display='block';work.style.display='none';img=null;
};
updateInfo();
})();
