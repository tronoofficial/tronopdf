/* TronoPDF - Image Resizer v1 | pixels, percent, presets, batch, ratio lock */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
var PRESETS={
 'custom':[0,0],
 'passport35':[413,531],
 'passport2':[600,600],
 'hd':[1280,720],
 'fhd':[1920,1080],
 'square':[1080,1080],
 'instaport':[1080,1350],
 'fbcover':[820,312],
 'a4':[2480,3508]
};
root.innerHTML='<style>'+
'.ir-wrap{max-width:1400px;margin:0 auto}'+
'.ir-hero{text-align:center;padding:50px 16px 40px}'+
'.ir-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}'+
'.ir-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}'+
'.ir-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}'+
'.ir-big:hover{transform:translateY(-2px)}'+
'.ir-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}'+
'.ir-zone{border:2px dashed transparent;border-radius:18px}'+
'.ir-zone.on{border-color:#7c3aed;background:#f3f0ff}'+
'.ir-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}'+
'.ir-main{display:flex;min-height:600px}'+
'.ir-list{flex:1;padding:40px;overflow-y:auto}'+
'.ir-note{background:#ede9fe;border-radius:10px;padding:12px 16px;font-size:13px;color:#5b21b6;margin-bottom:20px}'+
'.ir-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px}'+
'.ir-card{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:14px;text-align:center;position:relative}'+
'.ir-card img{width:100%;height:180px;object-fit:contain;border-radius:8px;background:#f3f4f8;margin-bottom:10px}'+
'.ir-nm{font-size:12.5px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:6px}'+
'.ir-dims{display:flex;justify-content:center;align-items:center;gap:8px;font-size:12px;margin-bottom:10px}'+
'.ir-old{color:#9a9aa5;text-decoration:line-through}'+
'.ir-new{color:#16a34a;font-weight:800}'+
'.ir-badge{position:absolute;top:8px;right:8px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:10px;font-weight:800;padding:3px 8px;border-radius:999px}'+
'.ir-dl{display:block;background:#7c3aed;color:#fff;font-weight:700;font-size:13px;padding:11px;border-radius:8px}'+
'.ir-dl:hover{background:#6d28d9}'+
'.ir-side{width:380px;background:#fff;border-left:1px solid #eceaf6;padding:28px;display:flex;flex-direction:column;overflow-y:auto}'+
'.ir-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:18px}'+
'.ir-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}'+
'.ir-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;font-family:inherit}'+
'.ir-row{display:flex;gap:10px;align-items:center}'+
'.ir-row input[type=number]{flex:1;padding:11px;border:1px solid #ddd;border-radius:10px;font-size:14px}'+
'.ir-lock{display:flex;align-items:center;gap:8px;margin-top:8px}'+
'.ir-lock input{width:16px;height:16px;accent-color:#7c3aed}'+
'.ir-lock label{font-size:13px;font-weight:600;cursor:pointer}'+
'.ir-row input[type=range]{flex:1;accent-color:#7c3aed}'+
'.ir-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:16px}'+
'.ir-go:disabled{opacity:.5;cursor:not-allowed}'+
'.ir-again{width:100%;background:#f4f5fa;color:#333;font-weight:700;font-size:13px;padding:12px;border-radius:10px;border:none;cursor:pointer;margin-top:10px}'+
'@media(max-width:900px){.ir-main{flex-direction:column}.ir-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}'+
'</style>'+
'<div class="ir-wrap">'+
'<div id="irPick"><div class="ir-hero"><h1>Image Resizer</h1><p>Resize images to exact pixels, percentage or presets. Free, private and unlimited.</p>'+
'<div class="ir-zone" id="irZone"><button class="ir-big" id="irBtn" type="button">Select images</button><p class="ir-drop-hint">or drop images here</p></div></div></div>'+
'<div class="ir-work" id="irWork"><div class="ir-main"><div class="ir-list"><div class="ir-note">💡 Aspect ratio lock keeps photos proportional - no stretching. Unlock for exact fixed dimensions.</div><div class="ir-grid" id="irGrid"></div></div>'+
'<aside class="ir-side"><h2>Resize settings</h2>'+
'<div class="ir-lbl">Size mode</div><select class="ir-inp" id="irMode"><option value="custom">Custom pixels</option><option value="percent">Percentage</option><option value="preset">Presets</option></select>'+
'<div id="irCustomSec"><div class="ir-lbl">Dimensions (px)</div><div class="ir-row"><input type="number" id="irW" min="1" placeholder="Width"/><span style="font-size:13px;color:#9a9aa5">×</span><input type="number" id="irH" min="1" placeholder="Height"/></div>'+
'<div class="ir-lock"><input type="checkbox" id="irLock" checked><label for="irLock">Lock aspect ratio</label></div></div>'+
'<div id="irPercentSec" style="display:none"><div class="ir-lbl">Scale: <span id="irPctVal">50</span>%</div><div class="ir-row"><input type="range" id="irPct" min="5" max="200" value="50"/></div></div>'+
'<div id="irPresetSec" style="display:none"><div class="ir-lbl">Choose a preset</div><select class="ir-inp" id="irPreset"><option value="passport35">Passport 35×45 mm (413×531)</option><option value="passport2">Passport 2×2 inch (600×600)</option><option value="hd">HD (1280×720)</option><option value="fhd">Full HD (1920×1080)</option><option value="square">Instagram Square (1080×1080)</option><option value="instaport">Instagram Portrait (1080×1350)</option><option value="fbcover">Facebook Cover (820×312)</option><option value="a4">A4 @300 DPI (2480×3508)</option></select></div>'+
'<div class="ir-lbl">Output quality</div><select class="ir-inp" id="irQ"><option value="0.92" selected>High</option><option value="0.8">Medium</option><option value="0.6">Low</option></select>'+
'<button class="ir-go" id="irGo" type="button">Resize Images →</button>'+
'<button class="ir-again" id="irAgain" type="button">Resize more images</button></aside></div></div>'+
'<input type="file" id="irFile" accept="image/*,.jpg,.jpeg,.png,.webp" multiple style="display:none">'+
'</div>';
var files=[];var ratio=1;var firstSet=false;
var pick=document.getElementById('irPick'),work=document.getElementById('irWork');
var zone=document.getElementById('irZone'),btn=document.getElementById('irBtn'),inp=document.getElementById('irFile'),grid=document.getElementById('irGrid');
var go=document.getElementById('irGo');
var elMode=document.getElementById('irMode'),elW=document.getElementById('irW'),elH=document.getElementById('irH'),elLock=document.getElementById('irLock');
var elPct=document.getElementById('irPct'),elPreset=document.getElementById('irPreset'),elQ=document.getElementById('irQ');
elMode.onchange=function(){
 document.getElementById('irCustomSec').style.display=this.value==='custom'?'block':'none';
 document.getElementById('irPercentSec').style.display=this.value==='percent'?'block':'none';
 document.getElementById('irPresetSec').style.display=this.value==='preset'?'block':'none';
};
elPct.oninput=function(){document.getElementById('irPctVal').textContent=this.value;};
elW.oninput=function(){if(elLock.checked&&ratio){elH.value=Math.max(1,Math.round(this.value/ratio));}};
elH.oninput=function(){if(elLock.checked&&ratio){elW.value=Math.max(1,Math.round(this.value*ratio));}};
function addFiles(fl){
 var added=0;
 for(var i=0;i<fl.length;i++){
  var f=fl[i];
  if(f.type.indexOf('image/')===0||/\.(jpg|jpeg|png|webp)$/i.test(f.name)){
   files.push({f:f,url:URL.createObjectURL(f),result:null,error:false,nw:0,nh:0});added++;
  }
 }
 if(!added){alert('Please select image files.');return;}
 pick.style.display='none';work.style.display='block';
 if(!firstSet&&files.length){
  var im=new Image();
  im.onload=function(){
   ratio=im.width/im.height;
   elW.value=im.width;elH.value=im.height;
   firstSet=true;
  };
  im.src=files[0].url;
 }
 render();
}
function render(){
 grid.innerHTML='';
 files.forEach(function(it){
  var c=document.createElement('div');c.className='ir-card';
  var body='<img src="'+(it.result?it.result.dataURL:it.url)+'" alt=""><div class="ir-nm">'+it.f.name+'</div>';
  if(it.error){
   body+='<div class="ir-dims" style="color:#dc2626;font-weight:700">Could not resize this image</div>';
  }else if(it.result){
   body+='<div class="ir-badge">'+it.nw+'×'+it.nh+'</div><div class="ir-dims"><span class="ic-old">'+fmtB(it.f.size)+'</span><span>→</span><span class="ir-new">'+fmtB(it.result.bytes)+'</span></div><a class="ir-dl" href="'+it.result.dataURL+'" download="resized-'+it.f.name.replace(/\.[^.]+$/,'')+'.jpg">⬇ Download</a>';
  }else{
   body+='<div class="ir-dims">'+fmtB(it.f.size)+'</div><div style="text-align:center;color:#9a9aa5;font-size:12px">Waiting to resize...</div>';
  }
  c.innerHTML=body;
  grid.appendChild(c);
 });
 go.disabled=files.length<1;
}
function targetDims(img){
 if(elMode.value==='percent'){
  var p=elPct.value/100;
  return [Math.max(1,Math.round(img.width*p)),Math.max(1,Math.round(img.height*p))];
 }
 if(elMode.value==='preset'){
  var pr=PRESETS[elPreset.value];
  return [pr[0],pr[1]];
 }
 var w=parseInt(elW.value)||img.width;
 var h=parseInt(elH.value)||img.height;
 return [Math.max(1,w),Math.max(1,h)];
}
function resizeOne(it,q,cb){
 var img=new Image();
 img.onload=function(){
  var t=targetDims(img);
  var c=document.createElement('canvas');c.width=t[0];c.height=t[1];
  var x=c.getContext('2d');
  x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
  x.fillStyle='#fff';x.fillRect(0,0,t[0],t[1]);
  x.drawImage(img,0,0,t[0],t[1]);
  var d=c.toDataURL('image/jpeg',q);
  cb({dataURL:d,bytes:atob(d.split(',')[1]).length},t);
 };
 img.onerror=function(){cb(null,null);};
 img.src=it.url;
}
btn.onclick=function(){inp.click();};
inp.onchange=function(){addFiles(inp.files);inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');addFiles(e.dataTransfer.files);};
go.onclick=function(){
 if(files.length<1){return;}
 var q=parseFloat(elQ.value);
 files.forEach(function(it){it.result=null;it.error=false;});
 render();
 files.forEach(function(it){
  resizeOne(it,q,function(res,t){
   if(res){it.result=res;it.nw=t[0];it.nh=t[1];}else{it.error=true;}
   render();
  });
 });
};
document.getElementById('irAgain').onclick=function(){
 files.forEach(function(it){URL.revokeObjectURL(it.url);});
 files=[];firstSet=false;
 work.style.display='none';pick.style.display='block';
};
})();
