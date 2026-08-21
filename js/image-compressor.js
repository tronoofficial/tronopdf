/* TronoPDF - Image Compressor v2 | no ZIP, full photo preview, exact KB */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
root.innerHTML='<style>'+
'.ic-wrap{max-width:1400px;margin:0 auto}'+
'.ic-hero{text-align:center;padding:50px 16px 40px}'+
'.ic-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}'+
'.ic-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}'+
'.ic-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}'+
'.ic-big:hover{transform:translateY(-2px)}'+
'.ic-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}'+
'.ic-zone{border:2px dashed transparent;border-radius:18px}'+
'.ic-zone.on{border-color:#7c3aed;background:#f3f0ff}'+
'.ic-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}'+
'.ic-main{display:flex;min-height:600px}'+
'.ic-list{flex:1;padding:40px;overflow-y:auto}'+
'.ic-note{background:#ede9fe;border-radius:10px;padding:12px 16px;font-size:13px;color:#5b21b6;margin-bottom:20px}'+
'.ic-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px}'+
'.ic-card{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:14px;text-align:center;position:relative}'+
'.ic-card img{width:100%;height:190px;object-fit:contain;border-radius:8px;background:#f3f4f8;margin-bottom:10px}'+
'.ic-nm{font-size:12.5px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:6px}'+
'.ic-sizes{display:flex;justify-content:center;align-items:center;gap:8px;font-size:12px;margin-bottom:10px}'+
'.ic-old{color:#9a9aa5;text-decoration:line-through}'+
'.ic-new{color:#16a34a;font-weight:800}'+
'.ic-badge{position:absolute;top:8px;right:8px;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;font-size:10px;font-weight:800;padding:3px 8px;border-radius:999px}'+
'.ic-dl{display:block;background:#7c3aed;color:#fff;font-weight:700;font-size:13px;padding:11px;border-radius:8px}'+
'.ic-dl:hover{background:#6d28d9}'+
'.ic-side{width:380px;background:#fff;border-left:1px solid #eceaf6;padding:28px;display:flex;flex-direction:column}'+
'.ic-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:18px}'+
'.ic-tabs{display:flex;gap:8px;margin-bottom:18px}'+
'.ic-tab{flex:1;border:2px solid #eceaf6;border-radius:10px;background:#fff;padding:12px;font-size:13px;font-weight:800;text-align:center;cursor:pointer;transition:.2s}'+
'.ic-tab:hover{border-color:#7c3aed}'+
'.ic-tab.active{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}'+
'.ic-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:10px 0 6px}'+
'.ic-row{display:flex;gap:8px;align-items:center}'+
'.ic-row input[type=number]{flex:1;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px}'+
'.ic-row select{padding:11px;border:1px solid #ddd;border-radius:10px;font-size:14px}'+
'.ic-row input[type=range]{flex:1;accent-color:#7c3aed}'+
'.ic-quick{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}'+
'.ic-quick button{border:1px solid #eceaf6;background:#f7f6fc;color:#4b4b5a;font-size:11px;font-weight:800;padding:6px 12px;border-radius:999px;cursor:pointer}'+
'.ic-quick button:hover{border-color:#7c3aed;color:#7c3aed}'+
'.ic-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:16px}'+
'.ic-go:disabled{opacity:.5;cursor:not-allowed}'+
'.ic-again{width:100%;background:#f4f5fa;color:#333;font-weight:700;font-size:13px;padding:12px;border-radius:10px;border:none;cursor:pointer;margin-top:10px}'+
'@media(max-width:900px){.ic-main{flex-direction:column}.ic-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}'+
'</style>'+
'<div class="ic-wrap">'+
'<div id="icPick"><div class="ic-hero"><h1>Image Compressor</h1><p>Compress JPG & PNG to exact KB. Perfect for SSC, Bank, UPSC forms. Free & private.</p>'+
'<div class="ic-zone" id="icZone"><button class="ic-big" id="icBtn" type="button">Select images</button><p class="ic-drop-hint">or drop images here</p></div></div></div>'+
'<div class="ic-work" id="icWork"><div class="ic-main"><div class="ic-list"><div class="ic-note">💡 Har image ke neeche apna Download button hai — seedha phone/PC me save hogi, koi ZIP nahi!</div><div class="ic-grid" id="icGrid"></div></div>'+
'<aside class="ic-side"><h2>Compression settings</h2>'+
'<div class="ic-tabs"><div class="ic-tab active" id="icTabTarget">🎯 Target KB</div><div class="ic-tab" id="icTabQuality">⚙️ Quality</div></div>'+
'<div id="icTargetSec"><div class="ic-lbl">Exact size target</div><div class="ic-row"><input type="number" id="icTarget" min="5" value="50"/><select id="icUnit"><option value="KB">KB</option><option value="MB">MB</option></select></div>'+
'<div class="ic-quick"><button type="button" data-kb="20">20 KB</button><button type="button" data-kb="50">50 KB</button><button type="button" data-kb="100">100 KB</button><button type="button" data-kb="200">200 KB</button><button type="button" data-kb="500">500 KB</button></div></div>'+
'<div id="icQualitySec" style="display:none"><div class="ic-lbl">Quality: <span id="icQVal">70</span>%</div><div class="ic-row"><input type="range" id="icQ" min="10" max="95" value="70"/></div></div>'+
'<button class="ic-go" id="icGo" type="button">Compress Images →</button>'+
'<button class="ic-again" id="icAgain" type="button">Compress more images</button></aside></div></div>'+
'<input type="file" id="icFile" accept="image/*,.jpg,.jpeg,.png,.webp" multiple style="display:none">'+
'</div>';
var files=[];var mode='target';
var pick=document.getElementById('icPick'),work=document.getElementById('icWork');
var zone=document.getElementById('icZone'),btn=document.getElementById('icBtn'),inp=document.getElementById('icFile'),grid=document.getElementById('icGrid');
var go=document.getElementById('icGo');
var elTarget=document.getElementById('icTarget'),elUnit=document.getElementById('icUnit'),elQ=document.getElementById('icQ');
document.getElementById('icTabTarget').onclick=function(){mode='target';this.classList.add('active');document.getElementById('icTabQuality').classList.remove('active');document.getElementById('icTargetSec').style.display='block';document.getElementById('icQualitySec').style.display='none';};
document.getElementById('icTabQuality').onclick=function(){mode='quality';this.classList.add('active');document.getElementById('icTabTarget').classList.remove('active');document.getElementById('icTargetSec').style.display='none';document.getElementById('icQualitySec').style.display='block';};
elQ.oninput=function(){document.getElementById('icQVal').textContent=this.value;};
document.querySelectorAll('.ic-quick button').forEach(function(b){
 b.onclick=function(){elTarget.value=this.getAttribute('data-kb');elUnit.value='KB';};
});
function addFiles(fl){
 var added=0;
 for(var i=0;i<fl.length;i++){
  var f=fl[i];
  if(f.type.indexOf('image/')===0||/\.(jpg|jpeg|png|webp)$/i.test(f.name)){
   files.push({f:f,url:URL.createObjectURL(f),result:null});added++;
  }
 }
 if(!added){alert('Please select image files.');return;}
 pick.style.display='none';work.style.display='block';
 render();
}
function render(){
 grid.innerHTML='';
 files.forEach(function(it){
  var c=document.createElement('div');c.className='ic-card';
  var body='<img src="'+(it.result?it.result.dataURL:it.url)+'" alt=""><div class="ic-nm">'+it.f.name+'</div>';
  if(it.result){
   var saved=Math.max(0,(1-it.result.bytes/it.f.size)*100);
   body+='<div class="ic-badge">↓ '+saved.toFixed(0)+'%</div><div class="ic-sizes"><span class="ic-old">'+fmtB(it.f.size)+'</span><span>→</span><span class="ic-new">'+fmtB(it.result.bytes)+'</span></div><a class="ic-dl" href="'+it.result.dataURL+'" download="compressed-'+it.f.name.replace(/\.[^.]+$/,'')+'.jpg">⬇ Download</a>';
  }else{
   body+='<div class="ic-sizes">'+fmtB(it.f.size)+'</div><div style="text-align:center;color:#9a9aa5;font-size:12px">Waiting to compress...</div>';
  }
  c.innerHTML=body;
  grid.appendChild(c);
 });
 go.disabled=files.length<1;
}
function drawCanvas(img,maxD){
 var sc=Math.min(1,maxD/Math.max(img.width,img.height));
 var w=Math.max(1,Math.round(img.width*sc)),h=Math.max(1,Math.round(img.height*sc));
 var c=document.createElement('canvas');c.width=w;c.height=h;
 var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,w,h);x.drawImage(img,0,0,w,h);
 return c;
}
function bytesOf(d){return atob(d.split(',')[1]).length;}
function compressOne(it,opts,cb){
 var img=new Image();
 img.onload=function(){
  var base=drawCanvas(img,4096);
  if(opts.mode==='quality'){
   var d=base.toDataURL('image/jpeg',opts.q);
   cb({dataURL:d,bytes:bytesOf(d)});
   return;
  }
  var attempt=0;
  (function tryAt(w,h){
   var c2=document.createElement('canvas');c2.width=w;c2.height=h;
   var x=c2.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,w,h);x.drawImage(base,0,0,w,h);
   var lo=0.05,hi=0.95,best=null;
   for(var i=0;i<7;i++){
    var q=(lo+hi)/2;
    var d=c2.toDataURL('image/jpeg',q);
    var b=bytesOf(d);
    if(b<=opts.target){best={dataURL:d,bytes:b};lo=q;}else{hi=q;}
   }
   if(best){cb(best);}
   else if(w>150&&attempt<6){attempt++;tryAt(Math.round(w*0.85),Math.round(h*0.85));}
   else{var d2=c2.toDataURL('image/jpeg',0.05);cb({dataURL:d2,bytes:bytesOf(d2)});}
  })(base.width,base.height);
 };
 img.onerror=function(){cb(null);};
 img.src=it.url;
}
btn.onclick=function(){inp.click();};
inp.onchange=function(){addFiles(inp.files);inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');addFiles(e.dataTransfer.files);};
go.onclick=function(){
 if(files.length<1){return;}
 var opts;
 if(mode==='target'){
  var tv=parseFloat(elTarget.value)||50;
  opts={mode:'target',target:elUnit.value==='MB'?tv*1048576:tv*1024};
 }else{
  opts={mode:'quality',q:elQ.value/100};
 }
 var doneCount=0;
 files.forEach(function(it){it.result=null;});
 render();
 files.forEach(function(it){
  compressOne(it,opts,function(res){
   it.result=res;
   doneCount++;
   render();
  });
 });
};
document.getElementById('icAgain').onclick=function(){
 files.forEach(function(it){URL.revokeObjectURL(it.url);});
 files=[];
 work.style.display='none';pick.style.display='block';
};
})();
