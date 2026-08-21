/* TronoPDF - Edit PDF v1 | add text/image/shapes, drag+resize, browser-based */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
function loadJS(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(false);};s.onerror=function(){cb(true);};document.head.appendChild(s);}
loadJS(PDFLIB_SRC,function(){});
loadJS(PDFJS_SRC,function(e){if(!e&&window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;}});
function waitLib(name){
 return new Promise(function(res){
  var tries=0;
  (function w(){
   if(window[name]){res(true);return;}
   if(tries>40){res(false);return;}
   tries++;setTimeout(w,500);
  })();
 });
}
function fmtB(n){return n<1024?n+' B':(n/1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
function hexToRgb(h){var x=h.replace('#','');return {r:parseInt(x.substr(0,2),16)/255,g:parseInt(x.substr(2,2),16)/255,b:parseInt(x.substr(4,2),16)/255};}
var html='';
html+='<style>';
html+='.ed-wrap{max-width:1400px;margin:0 auto}';
html+='.ed-hero{text-align:center;padding:50px 16px 40px}';
html+='.ed-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.ed-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.ed-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.ed-big:hover{transform:translateY(-2px)}';
html+='.ed-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.ed-zone{border:2px dashed transparent;border-radius:18px}';
html+='.ed-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.ed-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.ed-main{display:flex;min-height:640px}';
html+='.ed-prev{flex:1;padding:30px;display:flex;flex-direction:column;align-items:center;gap:14px;overflow:auto}';
html+='.ed-pagebox{position:relative;border-radius:8px;overflow:hidden;box-shadow:0 10px 40px rgba(30,20,60,.18);background:#fff}';
html+='.ed-pagebox canvas{display:block}';
html+='.ed-item{position:absolute;cursor:move;touch-action:none;outline:1px dashed transparent}';
html+='.ed-item.sel{outline:2px dashed #7c3aed}';
html+='.ed-item .del{position:absolute;top:-10px;right:-10px;width:22px;height:22px;border-radius:50%;background:#dc2626;color:#fff;border:none;font-size:11px;cursor:pointer;display:none}';
html+='.ed-item.sel .del{display:block}';
html+='.ed-item .txt{white-space:pre;font-family:Inter,sans-serif}';
html+='.ed-item img{width:100%;height:100%}';
html+='.ed-pagenav{display:flex;gap:10px;align-items:center}';
html+='.ed-pagenav button{border:1px solid #eceaf6;background:#fff;border-radius:8px;padding:8px 14px;font-weight:800;cursor:pointer}';
html+='.ed-pagenav button:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.ed-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.ed-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:6px}';
html+='.ed-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:16px}';
html+='.ed-tabs{display:flex;gap:8px;margin-bottom:14px}';
html+='.ed-tab{flex:1;border:2px solid #eceaf6;border-radius:10px;background:#fff;padding:11px;font-size:13px;font-weight:800;text-align:center;cursor:pointer}';
html+='.ed-tab.active{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}';
html+='.ed-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:10px 0 6px}';
html+='.ed-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;font-family:inherit;background:#fff}';
html+='.ed-row{display:flex;gap:8px;align-items:center;margin-top:8px}';
html+='.ed-row input[type=range]{flex:1;accent-color:#7c3aed}';
html+='.ed-row input[type=color]{width:44px;height:36px;border:1px solid #ddd;border-radius:8px;padding:2px;background:#fff;cursor:pointer}';
html+='.ed-row select{padding:9px;border:1px solid #ddd;border-radius:8px;font-size:13px;background:#fff}';
html+='.ed-add{width:100%;background:#7c3aed;color:#fff;font-weight:800;font-size:14px;padding:12px;border-radius:10px;border:none;cursor:pointer;margin-top:10px}';
html+='.ed-add:hover{background:#6d28d9}';
html+='.ed-chk{display:flex;gap:8px;align-items:center;margin:8px 0}';
html+='.ed-chk input{width:16px;height:16px;accent-color:#7c3aed}';
html+='.ed-chk label{font-size:13px;font-weight:600;cursor:pointer}';
html+='.ed-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:14px}';
html+='.ed-busy{display:none;padding:60px 20px;text-align:center}';
html+='.ed-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.ed-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:26px}';
html+='.ed-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.ed-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .3s}';
html+='.ed-pct{font-size:36px;font-weight:900}';
html+='.ed-done{display:none;text-align:center;padding:50px 20px}';
html+='.ed-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.ed-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.ed-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='@media(max-width:900px){.ed-main{flex-direction:column}.ed-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="ed-wrap">';
html+='<div id="edPick"><div class="ed-hero"><h1>Edit PDF</h1><p>Add text, images and shapes to any PDF page - free, unlimited and private.</p>';
html+='<div class="ed-zone" id="edZone"><button class="ed-big" id="edBtn" type="button">Select PDF file</button><p class="ed-drop-hint">or drop PDF here</p></div></div></div>';
html+='<div class="ed-work" id="edWork"><div class="ed-main"><div class="ed-prev"><div class="ed-pagebox" id="edPageBox"><canvas id="edCanvas"></canvas><div id="edItems" style="position:absolute;inset:0"></div></div>';
html+='<div class="ed-pagenav"><button id="edPrev" type="button">←</button><span id="edPageLbl" style="font-weight:800"></span><button id="edNext" type="button">→</button></div></div>';
html+='<aside class="ed-side"><h2>Add elements</h2><p class="ed-sub">Pick a tool, add it, drag to place</p>';
html+='<div class="ed-tabs"><div class="ed-tab active" id="edTabText">📝 Text</div><div class="ed-tab" id="edTabImg">🖼 Image</div><div class="ed-tab" id="edTabShape">⬛ Shape</div></div>';
html+='<div id="edTextSec"><div class="ed-lbl">Your text</div><input class="ed-inp" id="edText" placeholder="Type text to add"/><div class="ed-row"><input type="color" id="edTextColor" value="#1e293b"/><select id="edTextStyle"><option value="n">Normal</option><option value="b">Bold</option><option value="i">Italic</option></select></div><button class="ed-add" id="edAddText" type="button">+ Add Text</button></div>';
html+='<div id="edImgSec" style="display:none"><button class="ed-add" id="edAddImg" type="button">+ Upload Image</button></div>';
html+='<div id="edShapeSec" style="display:none"><div class="ed-row"><select id="edShapeKind"><option value="rect">Rectangle</option><option value="ellipse">Ellipse</option><option value="line">Line</option></select><input type="color" id="edShapeColor" value="#7c3aed"/></div><button class="ed-add" id="edAddShape" type="button">+ Add Shape</button></div>';
html+='<div class="ed-lbl">Selected item size</div><div class="ed-row"><input type="range" id="edSize" min="8" max="320" value="60"/></div>';
html+='<div class="ed-lbl">Opacity: <span id="edOpVal">100</span>%</div><div class="ed-row"><input type="range" id="edOp" min="10" max="100" value="100"/></div>';
html+='<div class="ed-chk"><input type="checkbox" id="edAll"/><label for="edAll">Apply edits to all pages</label></div>';
html+='<button class="ed-go" id="edGo" type="button">Apply & Download →</button></aside></div></div>';
html+='<div class="ed-busy" id="edBusy"><h2>Applying edits...</h2><p class="fn" id="edBusyName"></p><div class="ed-bar"><div id="edBarFill"></div></div><div class="ed-pct" id="edPct">0%</div></div>';
html+='<div class="ed-done" id="edDone"><div class="ed-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF edited successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="edDoneInfo"></p><a class="ed-dl" id="edDl" href="#">⬇ Download Edited PDF</a><button class="ed-again" id="edAgain" type="button">Edit another PDF</button></div>';
html+='<input type="file" id="edFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='<input type="file" id="edImgFile" accept="image/*" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var file=null;var doc=null;var totalPages=0;var curPage=1;var pdfScale=1;
var items=[];var selIdx=-1;
var pick=document.getElementById('edPick'),work=document.getElementById('edWork'),busy=document.getElementById('edBusy'),done=document.getElementById('edDone');
var zone=document.getElementById('edZone'),btn=document.getElementById('edBtn'),inp=document.getElementById('edFile');
var canvas=document.getElementById('edCanvas'),ctx=canvas.getContext('2d');
var itemsBox=document.getElementById('edItems'),pageLbl=document.getElementById('edPageLbl');
var elSize=document.getElementById('edSize'),elOp=document.getElementById('edOp');
function setTab(t){
 document.getElementById('edTabText').classList.toggle('active',t==='text');
 document.getElementById('edTabImg').classList.toggle('active',t==='img');
 document.getElementById('edTabShape').classList.toggle('active',t==='shape');
 document.getElementById('edTextSec').style.display=t==='text'?'block':'none';
 document.getElementById('edImgSec').style.display=t==='img'?'block':'none';
 document.getElementById('edShapeSec').style.display=t==='shape'?'block':'none';
}
document.getElementById('edTabText').onclick=function(){setTab('text');};
document.getElementById('edTabImg').onclick=function(){setTab('img');};
document.getElementById('edTabShape').onclick=function(){setTab('shape');};
document.getElementById('edAddText').onclick=function(){
 var txt=document.getElementById('edText').value;
 if(!txt.trim()){alert('Please type some text first.');return;}
 items.push({type:'text',x:60,y:60,w:150,h:30,text:txt,size:24,color:document.getElementById('edTextColor').value,style:document.getElementById('edTextStyle').value,op:1,ratio:1});
 selIdx=items.length-1;renderItems();
};
document.getElementById('edAddImg').onclick=function(){document.getElementById('edImgFile').click();};
document.getElementById('edImgFile').onchange=function(){
 var f=this.files[0];if(!f){return;}
 var rd=new FileReader();
 rd.onload=function(){
  var im=new Image();
  im.onload=function(){
   items.push({type:'img',x:60,y:60,w:150,h:150*(im.height/im.width),ratio:im.height/im.width,dataURL:rd.result,op:1});
   selIdx=items.length-1;renderItems();
  };
  im.src=rd.result;
 };
 rd.readAsDataURL(f);
 this.value='';
};
document.getElementById('edAddShape').onclick=function(){
 var kind=document.getElementById('edShapeKind').value;
 var w=kind==='line'?160:120;
 var h=kind==='line'?6:80;
 items.push({type:'shape',kind:kind,x:60,y:60,w:w,h:h,ratio:h/w,color:document.getElementById('edShapeColor').value,op:0.8});
 selIdx=items.length-1;renderItems();
};
elSize.oninput=function(){
 if(selIdx<0){return;}
 var it=items[selIdx];
 if(it.type==='text'){it.size=parseInt(this.value);}
 else{it.w=parseInt(this.value);it.h=Math.max(4,Math.round(it.w*it.ratio));}
 renderItems();
};
elOp.oninput=function(){
 document.getElementById('edOpVal').textContent=this.value;
 if(selIdx<0){return;}
 items[selIdx].op=this.value/100;
 renderItems();
};
function renderItems(){
 itemsBox.innerHTML='';
 items.forEach(function(it,idx){
  var d=document.createElement('div');
  d.className='ed-item'+(idx===selIdx?' sel':'');
  d.style.left=it.x+'px';d.style.top=it.y+'px';
  d.style.width=it.w+'px';d.style.height=it.h+'px';
  d.style.opacity=it.op;
  if(it.type==='text'){
   d.style.width='auto';d.style.height='auto';
   var s=document.createElement('span');s.className='txt';
   s.textContent=it.text;
   s.style.fontSize=it.size+'px';
   s.style.color=it.color;
   s.style.fontWeight=it.style==='b'?'900':'500';
   s.style.fontStyle=it.style==='i'?'italic':'normal';
   d.appendChild(s);
  }else if(it.type==='img'){
   var im=document.createElement('img');im.src=it.dataURL;d.appendChild(im);
  }else{
   if(it.kind==='rect'){d.style.background=it.color;}
   else if(it.kind==='ellipse'){d.style.background=it.color;d.style.borderRadius='50%';}
   else{d.style.background=it.color;}
  }
  var del=document.createElement('button');del.className='del';del.textContent='✕';
  del.onclick=function(e){e.stopPropagation();items.splice(idx,1);selIdx=-1;renderItems();};
  d.appendChild(del);
  d.onclick=function(e){e.stopPropagation();selIdx=idx;renderItems();};
  var on=false,lx=0,ly=0;
  d.addEventListener('pointerdown',function(e){on=true;lx=e.clientX;ly=e.clientY;d.setPointerCapture(e.pointerId);selIdx=idx;renderItems();e.preventDefault();});
  d.addEventListener('pointermove',function(e){
   if(!on){return;}
   it.x+=e.clientX-lx;it.y+=e.clientY-ly;lx=e.clientX;ly=e.clientY;
   d.style.left=it.x+'px';d.style.top=it.y+'px';
  });
  d.addEventListener('pointerup',function(){on=false;});
  itemsBox.appendChild(d);
 });
}
function addFile(f){
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){alert('Please select a PDF file.');return;}
 file=f;items=[];selIdx=-1;renderItems();
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
function renderPage(){
 doc.getPage(curPage).then(function(page){
  var vp1=page.getViewport({scale:1});
  pdfScale=Math.min(1.6,520/vp1.width);
  var vp=page.getViewport({scale:pdfScale});
  canvas.width=Math.floor(vp.width);canvas.height=Math.floor(vp.height);
  page.render({canvasContext:ctx,viewport:vp}).promise.then(function(){
   pageLbl.textContent='Page '+curPage+' / '+totalPages;
  });
 });
}
document.getElementById('edPrev').onclick=function(){if(curPage>1){curPage--;renderPage();}};
document.getElementById('edNext').onclick=function(){if(curPage<totalPages){curPage++;renderPage();}};
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};
function pct(p){document.getElementById('edPct').textContent=Math.round(p)+'%';document.getElementById('edBarFill').style.width=p+'%';}
document.getElementById('edGo').onclick=function(){
 if(!file){return;}
 if(items.length===0){alert('Add at least one element (text, image or shape) first.');return;}
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
      function drawAll(){
       var chain=Promise.resolve();
       targets.forEach(function(pg,t){
        chain=chain.then(function(){
         pct(10+(t/Math.max(1,targets.length))*70);
         var size=pg.getSize();
         var inner=Promise.resolve();
         items.forEach(function(it){
          inner=inner.then(function(){
           var xP=it.x/pdfScale,wP=it.w/pdfScale,hP=it.h/pdfScale,yTop=it.y/pdfScale;
           var yP=size.height-yTop-hP;
           var rgb=hexToRgb(it.color||'#000000');
           if(it.type==='text'){
            var fs=it.size/pdfScale;
            var font=it.style==='b'?fB:(it.style==='i'?fI:fN);
            pg.drawText(it.text,{x:xP,y:size.height-yTop-fs,size:fs,font:font,color:PDFLib.rgb(rgb.r,rgb.g,rgb.b),opacity:it.op});
            return null;
           }
           if(it.type==='shape'){
            if(it.kind==='rect'){pg.drawRectangle({x:xP,y:yP,width:wP,height:hP,color:PDFLib.rgb(rgb.r,rgb.g,rgb.b),opacity:it.op});}
            else if(it.kind==='ellipse'){pg.drawEllipse({x:xP+wP/2,y:yP+hP/2,xScale:wP/2,yScale:hP/2,color:PDFLib.rgb(rgb.r,rgb.g,rgb.b),opacity:it.op});}
            else{pg.drawLine({start:{x:xP,y:yP+hP/2},end:{x:xP+wP,y:yP+hP/2},thickness:Math.max(1,hP),color:PDFLib.rgb(rgb.r,rgb.g,rgb.b),opacity:it.op});}
            return null;
           }
           if(it.type==='img'){
            var key=it.dataURL.length+'_'+it.dataURL.substr(30,20);
            if(imgCache[key]){
             pg.drawImage(imgCache[key],{x:xP,y:yP,width:wP,height:hP,opacity:it.op});
             return null;
            }
            var isPng=it.dataURL.indexOf('image/png')===0;
            var emb=isPng?pdf.embedPng(it.dataURL):pdf.embedJpg(it.dataURL);
            return emb.then(function(ei){imgCache[key]=ei;pg.drawImage(ei,{x:xP,y:yP,width:wP,height:hP,opacity:it.op});});
           }
           return null;
          });
         });
         return inner;
        });
       });
       return chain;
      }
      return drawAll().then(function(){return pdf.save();});
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
 file=null;doc=null;items=[];selIdx=-1;renderItems();
};
})();
