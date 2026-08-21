/* TronoPDF - Edit PDF v2 | text+draw+image+shapes, item list, zoom, all real */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
function loadJS(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(false);};s.onerror=function(){cb(true);};document.head.appendChild(s);}
loadJS(PDFLIB_SRC,function(){});
loadJS(PDFJS_SRC,function(e){if(!e&&window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;}});
function waitLib(name){return new Promise(function(res){var t=0;(function w(){if(window[name]){res(true);return;}if(t>40){res(false);return;}t++;setTimeout(w,500);})();});}
function fmtB(n){return n<1024?n+' B':(n/1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
function hexToRgb(h){var x=h.replace('#','');return{r:parseInt(x.substr(0,2),16)/255,g:parseInt(x.substr(2,2),16)/255,b:parseInt(x.substr(4,2),16)/255};}
var html='';
html+='<style>';
html+='.ed-wrap{max-width:1400px;margin:0 auto}';
html+='.ed-hero{text-align:center;padding:50px 16px 40px}';
html+='.ed-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.ed-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.ed-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.ed-zone{border:2px dashed transparent;border-radius:18px}';
html+='.ed-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.ed-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.ed-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.ed-main{display:flex;min-height:660px}';
html+='.ed-prev{flex:1;padding:26px;display:flex;flex-direction:column;align-items:center;gap:12px;overflow:auto}';
html+='.ed-pagebox{position:relative;border-radius:6px;overflow:hidden;box-shadow:0 10px 40px rgba(30,20,60,.18);background:#fff}';
html+='.ed-pagebox canvas{display:block}';
html+='.ed-pagebox.drawmode{cursor:crosshair}';
html+='.ed-pagebox.drawmode .ed-item{pointer-events:none}';
html+='.ed-item{position:absolute;cursor:move;touch-action:none;outline:1px dashed transparent}';
html+='.ed-item.sel{outline:2px dashed #7c3aed}';
html+='.ed-item .del{position:absolute;top:-10px;right:-10px;width:22px;height:22px;border-radius:50%;background:#dc2626;color:#fff;border:none;font-size:11px;cursor:pointer;display:none;z-index:5}';
html+='.ed-item.sel .del{display:block}';
html+='.ed-item .txt{white-space:pre;font-family:Inter,sans-serif;line-height:1.2}';
html+='.ed-item img{width:100%;height:100%}';
html+='.ed-bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center}';
html+='.ed-bar button{border:1px solid #eceaf6;background:#fff;border-radius:8px;padding:8px 14px;font-weight:800;cursor:pointer}';
html+='.ed-bar button:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.ed-bar .zoom{display:flex;gap:6px;align-items:center;font-size:12px;font-weight:800;color:#4b4b5a}';
html+='.ed-bar .zoom input{width:120px;accent-color:#7c3aed}';
html+='.ed-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:24px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.ed-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:6px}';
html+='.ed-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:14px}';
html+='.ed-tabs{display:flex;gap:6px;margin-bottom:12px}';
html+='.ed-tab{flex:1;border:2px solid #eceaf6;border-radius:10px;background:#fff;padding:10px 4px;font-size:12px;font-weight:800;text-align:center;cursor:pointer}';
html+='.ed-tab.active{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}';
html+='.ed-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:10px 0 6px}';
html+='.ed-inp{width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:10px;font-size:14px;font-family:inherit;background:#fff}';
html+='.ed-row{display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap}';
html+='.ed-row input[type=range]{flex:1;accent-color:#7c3aed}';
html+='.ed-row input[type=color]{width:40px;height:34px;border:1px solid #ddd;border-radius:8px;padding:2px;background:#fff;cursor:pointer}';
html+='.ed-row input[type=number]{width:64px;padding:8px;border:1px solid #ddd;border-radius:8px;font-size:13px}';
html+='.ed-mini{border:1px solid #eceaf6;background:#fff;border-radius:8px;padding:7px 10px;font-size:12px;font-weight:800;cursor:pointer}';
html+='.ed-mini.on{background:#7c3aed;color:#fff;border-color:#7c3aed}';
html+='.ed-add{width:100%;background:#7c3aed;color:#fff;font-weight:800;font-size:14px;padding:12px;border-radius:10px;border:none;cursor:pointer;margin-top:10px}';
html+='.ed-add:hover{background:#6d28d9}';
html+='.ed-list{margin-top:12px;border-top:1px solid #eceaf6;padding-top:10px;flex:1;overflow-y:auto}';
html+='.ed-list h4{font-size:12px;font-weight:800;color:#9a9aa5;margin-bottom:8px;display:flex;justify-content:space-between}';
html+='.ed-list h4 button{border:none;background:none;color:#dc2626;font-size:11px;font-weight:800;cursor:pointer}';
html+='.ed-li{display:flex;align-items:center;gap:8px;border:1px solid #eceaf6;border-radius:8px;padding:8px;margin-bottom:6px;cursor:pointer}';
html+='.ed-li.sel{border-color:#7c3aed;background:#f3f0ff}';
html+='.ed-li .ic{font-size:14px}';
html+='.ed-li .nm{flex:1;font-size:12px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}';
html+='.ed-li button{border:none;background:none;font-size:12px;font-weight:800;cursor:pointer;color:#4b4b5a;padding:2px 4px}';
html+='.ed-li button:hover{color:#7c3aed}';
html+='.ed-chk{display:flex;gap:8px;align-items:center;margin:8px 0}';
html+='.ed-chk input{width:16px;height:16px;accent-color:#7c3aed}';
html+='.ed-chk label{font-size:13px;font-weight:600;cursor:pointer}';
html+='.ed-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:17px;font-weight:800;padding:16px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:12px}';
html+='.ed-busy{display:none;padding:60px 20px;text-align:center}';
html+='.ed-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.ed-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:26px}';
html+='.ed-bar2{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.ed-bar2 div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .3s}';
html+='.ed-pct{font-size:36px;font-weight:900}';
html+='.ed-done{display:none;text-align:center;padding:50px 20px}';
html+='.ed-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.ed-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.ed-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='@media(max-width:900px){.ed-main{flex-direction:column}.ed-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="ed-wrap">';
html+='<div id="edPick"><div class="ed-hero"><h1>Edit PDF</h1><p>Add text, draw freehand, insert images & shapes - a full editor, free & private.</p>';
html+='<div class="ed-zone" id="edZone"><button class="ed-big" id="edBtn" type="button">Select PDF file</button><p class="ed-drop-hint">or drop PDF here</p></div></div></div>';
html+='<div class="ed-work" id="edWork"><div class="ed-main"><div class="ed-prev"><div class="ed-pagebox" id="edPageBox"><canvas id="edCanvas"></canvas><div id="edItems" style="position:absolute;inset:0"></div></div>';
html+='<div class="ed-bar"><button id="edPrev" type="button">←</button><span id="edPageLbl" style="font-weight:800"></span><button id="edNext" type="button">→</button><span class="zoom">🔍<input type="range" id="edZoom" min="50" max="160" value="100"/><span id="edZoomVal">100%</span></span></div></div>';
html+='<aside class="ed-side"><h2>Edit tools</h2><p class="ed-sub">Pick a tool, add it, drag to place</p>';
html+='<div class="ed-tabs"><div class="ed-tab active" id="edTabText">📝 Text</div><div class="ed-tab" id="edTabDraw">✏️ Draw</div><div class="ed-tab" id="edTabImg">🖼 Image</div><div class="ed-tab" id="edTabShape">⬛ Shape</div></div>';
html+='<div id="edTextSec"><div class="ed-lbl">Your text</div><input class="ed-inp" id="edText" placeholder="Type text to add"/><div class="ed-row"><input type="color" id="edTextColor" value="#1e293b"/><input type="number" id="edTextSize" value="16" min="6" max="72"/><button class="ed-mini" id="edB" type="button">B</button><button class="ed-mini" id="edI" type="button">I</button><button class="ed-mini" id="edU" type="button">U</button></div><button class="ed-add" id="edAddText" type="button">+ Add Text</button></div>';
html+='<div id="edDrawSec" style="display:none"><div class="ed-row"><input type="color" id="edDrawColor" value="#dc2626"/><input type="number" id="edDrawWidth" value="3" min="1" max="20"/><button class="ed-mini" id="edDrawToggle" type="button">Start Drawing</button></div><p style="font-size:12px;color:#9a9aa5;margin-top:6px">When drawing is ON, draw directly on the page with mouse/finger.</p></div>';
html+='<div id="edImgSec" style="display:none"><button class="ed-add" id="edAddImg" type="button">+ Upload Image</button></div>';
html+='<div id="edShapeSec" style="display:none"><div class="ed-row"><select class="ed-inp" id="edShapeKind" style="flex:1"><option value="rect">Rectangle</option><option value="ellipse">Ellipse</option><option value="line">Line</option></select><input type="color" id="edShapeColor" value="#7c3aed"/></div><button class="ed-add" id="edAddShape" type="button">+ Add Shape</button></div>';
html+='<div class="ed-lbl">Selected item</div><div class="ed-row"><span style="font-size:12px;font-weight:800">Size</span><input type="range" id="edSize" min="6" max="320" value="60"/><span style="font-size:12px;font-weight:800">Opacity</span><input type="range" id="edOp" min="10" max="100" value="100"/></div>';
html+='<div class="ed-list"><h4>Elements <button id="edRemoveAll" type="button">Remove all</button></h4><div id="edListBox"></div></div>';
html+='<div class="ed-chk"><input type="checkbox" id="edAll"/><label for="edAll">Apply edits to all pages</label></div>';
html+='<button class="ed-go" id="edGo" type="button">Apply & Download →</button></aside></div></div>';
html+='<div class="ed-busy" id="edBusy"><h2>Applying edits...</h2><p class="fn" id="edBusyName"></p><div class="ed-bar2"><div id="edBarFill"></div></div><div class="ed-pct" id="edPct">0%</div></div>';
html+='<div class="ed-done" id="edDone"><div class="ed-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF edited successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="edDoneInfo"></p><a class="ed-dl" id="edDl" href="#">⬇ Download Edited PDF</a><button class="ed-again" id="edAgain" type="button">Edit another PDF</button></div>';
html+='<input type="file" id="edFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='<input type="file" id="edImgFile" accept="image/*" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var file=null,doc=null,totalPages=0,curPage=1;
var fitScale=1,zoom=100,pdfScale=1;
var items=[],selIdx=-1,drawMode=false,drawing=null;
var pick=document.getElementById('edPick'),work=document.getElementById('edWork'),busy=document.getElementById('edBusy'),done=document.getElementById('edDone');
var zone=document.getElementById('edZone'),btn=document.getElementById('edBtn'),inp=document.getElementById('edFile');
var pageBox=document.getElementById('edPageBox'),canvas=document.getElementById('edCanvas'),ctx=canvas.getContext('2d');
var itemsBox=document.getElementById('edItems'),listBox=document.getElementById('edListBox'),pageLbl=document.getElementById('edPageLbl');
var elSize=document.getElementById('edSize'),elOp=document.getElementById('edOp');
var boldOn=false,italOn=false,undOn=false;
function sc(){return fitScale*zoom/100;}
function setTab(t){
 ['Text','Draw','Img','Shape'].forEach(function(k){document.getElementById('edTab'+k).classList.toggle('active',t===k.toLowerCase());});
 document.getElementById('edTextSec').style.display=t==='text'?'block':'none';
 document.getElementById('edDrawSec').style.display=t==='draw'?'block':'none';
 document.getElementById('edImgSec').style.display=t==='img'?'block':'none';
 document.getElementById('edShapeSec').style.display=t==='shape'?'block':'none';
 if(t!=='draw'){drawMode=false;pageBox.classList.remove('drawmode');document.getElementById('edDrawToggle').classList.remove('on');document.getElementById('edDrawToggle').textContent='Start Drawing';}
}
document.getElementById('edTabText').onclick=function(){setTab('text');};
document.getElementById('edTabDraw').onclick=function(){setTab('draw');};
document.getElementById('edTabImg').onclick=function(){setTab('img');};
document.getElementById('edTabShape').onclick=function(){setTab('shape');};
document.getElementById('edB').onclick=function(){boldOn=!boldOn;this.classList.toggle('on',boldOn);};
document.getElementById('edI').onclick=function(){italOn=!italOn;this.classList.toggle('on',italOn);};
document.getElementById('edU').onclick=function(){undOn=!undOn;this.classList.toggle('on',undOn);};
document.getElementById('edDrawToggle').onclick=function(){
 drawMode=!drawMode;
 this.classList.toggle('on',drawMode);
 this.textContent=drawMode?'Drawing ON (click to stop)':'Start Drawing';
 pageBox.classList.toggle('drawmode',drawMode);
};
document.getElementById('edAddText').onclick=function(){
 var txt=document.getElementById('edText').value;
 if(!txt.trim()){alert('Please type some text first.');return;}
 items.push({type:'text',x:60/sc(),y:60/sc(),text:txt,size:parseInt(document.getElementById('edTextSize').value)||16,color:document.getElementById('edTextColor').value,b:boldOn,i:italOn,u:undOn,op:1});
 selIdx=items.length-1;renderAll();
};
document.getElementById('edAddImg').onclick=function(){document.getElementById('edImgFile').click();};
document.getElementById('edImgFile').onchange=function(){
 var f=this.files[0];if(!f){return;}
 var rd=new FileReader();
 rd.onload=function(){
  var im=new Image();
  im.onload=function(){
   items.push({type:'img',x:60/sc(),y:60/sc(),w:150/sc(),h:150/sc()*(im.height/im.width),ratio:im.height/im.width,dataURL:rd.result,op:1});
   selIdx=items.length-1;renderAll();
  };
  im.src=rd.result;
 };
 rd.readAsDataURL(f);this.value='';
};
document.getElementById('edAddShape').onclick=function(){
 var kind=document.getElementById('edShapeKind').value;
 var w=kind==='line'?160:120,h=kind==='line'?6:80;
 items.push({type:'shape',kind:kind,x:60/sc(),y:60/sc(),w:w/sc(),h:h/sc(),ratio:h/w,color:document.getElementById('edShapeColor').value,op:0.8});
 selIdx=items.length-1;renderAll();
};
document.getElementById('edRemoveAll').onclick=function(){items=[];selIdx=-1;renderAll();};
elSize.oninput=function(){
 if(selIdx<0){return;}
 var it=items[selIdx];var v=parseInt(this.value);
 if(it.type==='text'){it.size=v;}else{it.w=v/sc();it.h=Math.max(2,it.w*(it.ratio||1));}
 renderAll();
};
elOp.oninput=function(){if(selIdx<0){return;}items[selIdx].op=this.value/100;renderAll();};
document.getElementById('edZoom').oninput=function(){zoom=parseInt(this.value);document.getElementById('edZoomVal').textContent=zoom+'%';renderAll();};
pageBox.addEventListener('pointerdown',function(e){
 if(!drawMode){return;}
 e.preventDefault();
 var r=pageBox.getBoundingClientRect();
 drawing={type:'draw',pts:[],color:document.getElementById('edDrawColor').value,width:parseInt(document.getElementById('edDrawWidth').value)||3,op:1};
 drawing.pts.push({x:(e.clientX-r.left)/sc(),y:(e.clientY-r.top)/sc()});
 pageBox.setPointerCapture(e.pointerId);
});
pageBox.addEventListener('pointermove',function(e){
 if(!drawMode||!drawing){return;}
 var r=pageBox.getBoundingClientRect();
 drawing.pts.push({x:(e.clientX-r.left)/sc(),y:(e.clientY-r.top)/sc()});
 renderItems();
});
pageBox.addEventListener('pointerup',function(){
 if(!drawing){return;}
 if(drawing.pts.length>1){finalizeDraw(drawing);items.push(drawing);selIdx=items.length-1;}
 drawing=null;renderAll();
});
function finalizeDraw(d){
 var xs=d.pts.map(function(p){return p.x;}),ys=d.pts.map(function(p){return p.y;});
 var minx=Math.min.apply(null,xs),miny=Math.min.apply(null,ys);
 var maxx=Math.max.apply(null,xs),maxy=Math.max.apply(null,ys);
 d.x=minx;d.y=miny;d.w=Math.max(4,maxx-minx);d.h=Math.max(4,maxy-miny);
 d.rel=d.pts.map(function(p){return{x:p.x-minx,y:p.y-miny};});
}
function renderItems(){
 itemsBox.innerHTML='';
 var s=sc();
 items.forEach(function(it,idx){
  var d=document.createElement('div');
  d.className='ed-item'+(idx===selIdx?' sel':'');
  d.style.left=(it.x*s)+'px';d.style.top=(it.y*s)+'px';
  d.style.opacity=it.op;
  if(it.type==='text'){
   var sp=document.createElement('span');sp.className='txt';
   sp.textContent=it.text;
   sp.style.fontSize=(it.size*s)+'px';
   sp.style.color=it.color;
   sp.style.fontWeight=it.b?'900':'500';
   sp.style.fontStyle=it.i?'italic':'normal';
   d.appendChild(sp);
   if(it.u){d.style.borderBottom=(Math.max(1,it.size*s*0.08))+'px solid '+it.color;}
  }else if(it.type==='img'){
   d.style.width=(it.w*s)+'px';d.style.height=(it.h*s)+'px';
   var im=document.createElement('img');im.src=it.dataURL;d.appendChild(im);
  }else if(it.type==='shape'){
   d.style.width=(it.w*s)+'px';d.style.height=(it.h*s)+'px';
   d.style.background=it.color;
   if(it.kind==='ellipse'){d.style.borderRadius='50%';}
   if(it.kind==='line'){d.style.height=Math.max(2,it.h*s)+'px';}
  }else if(it.type==='draw'){
   d.style.width=(it.w*s)+'px';d.style.height=(it.h*s)+'px';
   var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
   svg.setAttribute('width',it.w*s);svg.setAttribute('height',it.h*s);
   svg.style.overflow='visible';
   var pl=document.createElementNS('http://www.w3.org/2000/svg','polyline');
   pl.setAttribute('points',it.rel.map(function(p){return (p.x*s)+','+(p.y*s);}).join(' '));
   pl.setAttribute('fill','none');
   pl.setAttribute('stroke',it.color);
   pl.setAttribute('stroke-width',it.width*s);
   pl.setAttribute('stroke-linecap','round');
   pl.setAttribute('stroke-linejoin','round');
   svg.appendChild(pl);d.appendChild(svg);
  }
  var del=document.createElement('button');del.className='del';del.textContent='✕';
  del.onclick=function(e){e.stopPropagation();items.splice(idx,1);selIdx=-1;renderAll();};
  d.appendChild(del);
  d.addEventListener('pointerdown',function(e){
   if(drawMode){return;}
   e.stopPropagation();selIdx=idx;renderAll();
   var on=true,lx=e.clientX,ly=e.clientY;
   d.setPointerCapture(e.pointerId);
   function mv(ev){if(!on){return;}it.x+=(ev.clientX-lx)/sc();it.y+=(ev.clientY-ly)/sc();lx=ev.clientX;ly=ev.clientY;d.style.left=(it.x*sc())+'px';d.style.top=(it.y*sc())+'px';}
   function up(){on=false;d.removeEventListener('pointermove',mv);d.removeEventListener('pointerup',up);}
   d.addEventListener('pointermove',mv);d.addEventListener('pointerup',up);
  });
  itemsBox.appendChild(d);
 });
 if(drawing&&drawing.pts.length>0){
  var s2=sc();
  var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.style.position='absolute';svg.style.left='0';svg.style.top='0';svg.style.pointerEvents='none';
  svg.setAttribute('width',canvas.width);svg.setAttribute('height',canvas.height);
  var pl=document.createElementNS('http://www.w3.org/2000/svg','polyline');
  pl.setAttribute('points',drawing.pts.map(function(p){return p.x*s2+','+p.y*s2;}).join(' '));
  pl.setAttribute('fill','none');pl.setAttribute('stroke',drawing.color);pl.setAttribute('stroke-width',drawing.width*s2);pl.setAttribute('stroke-linecap','round');
  svg.appendChild(pl);itemsBox.appendChild(svg);
 }
}
function renderList(){
 listBox.innerHTML='';
 if(items.length===0){listBox.innerHTML='<p style="font-size:12px;color:#9a9aa5">No elements yet. Add text, drawing, image or shape.</p>';return;}
 var icons={text:'📝',img:'🖼',shape:'⬛',draw:'✏️'};
 items.forEach(function(it,idx){
  var d=document.createElement('div');d.className='ed-li'+(idx===selIdx?' sel':'');
  var nm=it.type==='text'?it.text:(it.type==='draw'?'Drawing':(it.type==='img'?'Image':it.kind));
  d.innerHTML='<span class="ic">'+icons[it.type]+'</span><span class="nm">'+(nm||'Item')+'</span>';
  var up=document.createElement('button');up.textContent='↑';up.onclick=function(e){e.stopPropagation();if(idx>0){items.splice(idx-1,0,items.splice(idx,1)[0]);selIdx=idx-1;renderAll();}};
  var dn=document.createElement('button');dn.textContent='↓';dn.onclick=function(e){e.stopPropagation();if(idx<items.length-1){items.splice(idx+1,0,items.splice(idx,1)[0]);selIdx=idx+1;renderAll();}};
  var dl2=document.createElement('button');dl2.textContent='✕';dl2.onclick=function(e){e.stopPropagation();items.splice(idx,1);selIdx=-1;renderAll();};
  d.appendChild(up);d.appendChild(dn);d.appendChild(dl2);
  d.onclick=function(){selIdx=idx;renderAll();};
  listBox.appendChild(d);
 });
}
function renderAll(){renderPage();}
function renderPage(){
 if(!doc){return;}
 doc.getPage(curPage).then(function(page){
  var vp1=page.getViewport({scale:1});
  fitScale=Math.min(1.4,560/vp1.width);
  pdfScale=sc();
  var vp=page.getViewport({scale:pdfScale});
  canvas.width=Math.floor(vp.width);canvas.height=Math.floor(vp.height);
  page.render({canvasContext:ctx,viewport:vp}).promise.then(function(){
   pageLbl.textContent='Page '+curPage+' / '+totalPages;
   renderItems();renderList();
  });
 });
}
document.getElementById('edPrev').onclick=function(){if(curPage>1){curPage--;renderPage();}};
document.getElementById('edNext').onclick=function(){if(curPage<totalPages){curPage++;renderPage();}};
function addFile(f){
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){alert('Please select a PDF file.');return;}
 file=f;items=[];selIdx=-1;
 pick.style.display='none';work.style.display='block';done.style.display='none';
 waitLib('pdfjsLib').then(function(ok){
  if(!ok){return;}
  window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
  f.arrayBuffer().then(function(b){
   return window.pdfjsLib.getDocument({data:b}).promise.then(function(d){
    doc=d;totalPages=d.numPages;curPage=1;renderPage();
   });
  });
 });
}
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};
function pct(p){document.getElementById('edPct').textContent=Math.round(p)+'%';document.getElementById('edBarFill').style.width=p+'%';}
document.getElementById('edGo').onclick=function(){
 if(!file){return;}
 if(items.length===0){alert('Add at least one element first.');return;}
 work.style.display='none';busy.style.display='block';
 document.getElementById('edBusyName').textContent=file.name;
 pct(5);
 waitLib('PDFLib').then(function(ok){
  if(!ok){throw new Error('libs');}
  return file.arrayBuffer();
 }).then(function(buf){
  return PDFLib.PDFDocument.load(buf,{ignoreEncryption:true}).then(function(pdf){
   return pdf.embedFont(PDFLib.StandardFonts.Helvetica).then(function(fN){
    return pdf.embedFont(PDFLib.StandardFonts.HelveticaBold).then(function(fB){
     return pdf.embedFont(PDFLib.StandardFonts.HelveticaOblique).then(function(fI){
      var pages=pdf.getPages();
      var targets=document.getElementById('edAll').checked?pages:[pages[curPage-1]];
      var imgCache={};
      var chain=Promise.resolve();
      targets.forEach(function(pg,t){
       chain=chain.then(function(){
        pct(10+(t/Math.max(1,targets.length))*70);
        var size=pg.getSize();
        var inner=Promise.resolve();
        items.forEach(function(it){
         inner=inner.then(function(){
          var xP=it.x,wP=it.w||0,hP=it.h||0,yTop=it.y;
          var yP=size.height-yTop-hP;
          var rgb=hexToRgb(it.color||'#000000');
          if(it.type==='text'){
           var fs=it.size;
           var font=it.b?fB:(it.i?fI:fN);
           pg.drawText(it.text,{x:xP,y:size.height-yTop-fs,size:fs,font:font,color:PDFLib.rgb(rgb.r,rgb.g,rgb.b),opacity:it.op});
           if(it.u){
            var tw=font.widthOfTextAtSize(it.text,fs);
            pg.drawLine({start:{x:xP,y:size.height-yTop-fs*0.15},end:{x:xP+tw,y:size.height-yTop-fs*0.15},thickness:Math.max(0.5,fs*0.06),color:PDFLib.rgb(rgb.r,rgb.g,rgb.b),opacity:it.op});
           }
           return null;
          }
          if(it.type==='shape'){
           if(it.kind==='rect'){pg.drawRectangle({x:xP,y:yP,width:wP,height:hP,color:PDFLib.rgb(rgb.r,rgb.g,rgb.b),opacity:it.op});}
           else if(it.kind==='ellipse'){pg.drawEllipse({x:xP+wP/2,y:yP+hP/2,xScale:wP/2,yScale:hP/2,color:PDFLib.rgb(rgb.r,rgb.g,rgb.b),opacity:it.op});}
           else{pg.drawLine({start:{x:xP,y:yP+hP/2},end:{x:xP+wP,y:yP+hP/2},thickness:Math.max(1,hP),color:PDFLib.rgb(rgb.r,rgb.g,rgb.b),opacity:it.op});}
           return null;
          }
          if(it.type==='draw'){
           var seg=Promise.resolve();
           for(var i2=0;i2<it.rel.length-1;i2++){
            (function(a,b2){
             seg=seg.then(function(){pg.drawLine({start:{x:it.x+a.x,y:size.height-(it.y+a.y)},end:{x:it.x+b2.x,y:size.height-(it.y+b2.y)},thickness:it.width,color:PDFLib.rgb(rgb.r,rgb.g,rgb.b),opacity:it.op});return null;});
            })(it.rel[i2],it.rel[i2+1]);
           }
           return seg;
          }
          if(it.type==='img'){
           var key=it.dataURL.length+'_'+it.dataURL.substr(30,16);
           if(imgCache[key]){pg.drawImage(imgCache[key],{x:xP,y:yP,width:wP,height:hP,opacity:it.op});return null;}
           var isPng=it.dataURL.indexOf('image/png')===0;
           return (isPng?pdf.embedPng(it.dataURL):pdf.embedJpg(it.dataURL)).then(function(ei){imgCache[key]=ei;pg.drawImage(ei,{x:xP,y:yP,width:wP,height:hP,opacity:it.op});});
          }
          return null;
         });
        });
        return inner;
       });
      });
      return chain.then(function(){return pdf.save();});
     });
    });
   });
  });
 }).then(function(bytes){
  pct(100);
  setTimeout(function(){
   busy.style.display='none';done.style.display='block';
   document.getElementById('edDoneInfo').textContent=items.length+' element(s) • '+fmtB(bytes.length);
   var blob=new Blob([bytes],{type:'application/pdf'});
   var dl=document.getElementById('edDl');
   dl.href=URL.createObjectURL(blob);
   dl.download='edited-'+(file.name||'document.pdf');
  },200);
 }).catch(function(){
  busy.style.display='none';work.style.display='block';
  alert('Error editing PDF. Please try again.');
 });
};
document.getElementById('edAgain').onclick=function(){
 done.style.display='none';pick.style.display='block';work.style.display='none';
 file=null;doc=null;items=[];selIdx=-1;renderList();
};
renderList();
})();
