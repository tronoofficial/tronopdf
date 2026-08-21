/* TronoPDF - Watermark PDF v1 | text+image, live preview, mosaic, opacity */
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
function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
function hexToRgb(h){
 var x=h.replace('#','');
 return {r:parseInt(x.substr(0,2),16)/255,g:parseInt(x.substr(2,2),16)/255,b:parseInt(x.substr(4,2),16)/255};
}
function dataURLtoBytes(d){var b=atob(d.split(',')[1]);var a=new Uint8Array(b.length);for(var i=0;i<b.length;i++){a[i]=b.charCodeAt(i);}return a;}
root.innerHTML='<style>'+
'.wm-wrap{max-width:1400px;margin:0 auto}'+
'.wm-hero{text-align:center;padding:50px 16px 40px}'+
'.wm-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}'+
'.wm-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}'+
'.wm-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}'+
'.wm-big:hover{transform:translateY(-2px)}'+
'.wm-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}'+
'.wm-zone{border:2px dashed transparent;border-radius:18px}'+
'.wm-zone.on{border-color:#7c3aed;background:#f3f0ff}'+
'.wm-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}'+
'.wm-main{display:flex;min-height:620px}'+
'.wm-preview{flex:1;padding:40px;display:flex;align-items:flex-start;justify-content:center;overflow:auto}'+
'.wm-card{background:#fff;border:1px solid #eceaf6;border-radius:14px;padding:20px;text-align:center;box-shadow:0 4px 20px rgba(30,20,60,.06);width:340px}'+
'.wm-thumb{height:400px;position:relative;background:#fafbfe;border-radius:8px;overflow:hidden}'+
'.wm-thumb img.bg{width:100%;height:100%;object-fit:contain}'+
'.wm-ov{position:absolute;inset:0;pointer-events:none;overflow:hidden}'+
'.wm-ov span,.wm-ov img{position:absolute;font-weight:700;white-space:nowrap}'+
'.wm-nm{font-size:13px;font-weight:700;margin-top:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
'.wm-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}'+
'.wm-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:18px}'+
'.wm-tabs{display:flex;gap:8px;margin-bottom:18px}'+
'.wm-tab{flex:1;border:2px solid #eceaf6;border-radius:10px;background:#fff;padding:12px;font-size:13px;font-weight:800;text-align:center;cursor:pointer;transition:.2s}'+
'.wm-tab:hover{border-color:#7c3aed}'+
'.wm-tab.active{border-color:#7c3aed;color:#7c3aed;background:#f3f0ff}'+
'.wm-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}'+
'.wm-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;font-family:inherit}'+
'.wm-row{display:flex;gap:10px;align-items:center}'+
'.wm-row input[type=range]{flex:1;accent-color:#7c3aed}'+
'.wm-row input[type=color]{width:44px;height:36px;border:1px solid #ddd;border-radius:8px;padding:2px;background:#fff;cursor:pointer}'+
'.wm-chk{display:flex;gap:8px;align-items:center;margin:4px 0}'+
'.wm-chk input{width:16px;height:16px;accent-color:#7c3aed}'+
'.wm-chk label{font-size:13px;font-weight:600;cursor:pointer}'+
'.wm-grid{display:grid;grid-template-columns:repeat(3,44px);gap:6px;justify-content:start}'+
'.wm-pos{width:44px;height:34px;border:2px solid #eceaf6;border-radius:8px;background:#fff;cursor:pointer;position:relative;transition:.2s}'+
'.wm-pos:hover{border-color:#7c3aed}'+
'.wm-pos.active{border-color:#7c3aed;background:#f3f0ff}'+
'.wm-pos.active::after{content:"";position:absolute;inset:0;margin:auto;width:10px;height:10px;border-radius:50%;background:#7c3aed}'+
'.wm-imgbtn{width:100%;border:2px dashed #c9cddd;border-radius:10px;background:#fff;padding:14px;font-size:13px;font-weight:800;color:#7c3aed;cursor:pointer}'+
'.wm-imgbtn:hover{border-color:#7c3aed;background:#f3f0ff}'+
'.wm-imgprev{max-height:70px;margin-top:8px;border-radius:6px}'+
'.wm-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:16px}'+
'.wm-go:disabled{opacity:.5;cursor:not-allowed}'+
'.wm-busy{display:none;padding:60px 20px;text-align:center}'+
'.wm-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}'+
'.wm-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:26px}'+
'.wm-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}'+
'.wm-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .3s}'+
'.wm-pct{font-size:36px;font-weight:900}'+
'.wm-done{display:none;text-align:center;padding:60px 20px}'+
'.wm-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}'+
'.wm-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}'+
'.wm-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}'+
'@media(max-width:900px){.wm-main{flex-direction:column}.wm-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}'+
'</style>'+
'<div class="wm-wrap">'+
'<div id="wmPick"><div class="wm-hero"><h1>Add Watermark to PDF</h1><p>Stamp text or image over your PDF pages. Free, private and unlimited.</p>'+
'<div class="wm-zone" id="wmZone"><button class="wm-big" id="wmBtn" type="button">Select PDF file</button><p class="wm-drop-hint">or drop PDF here</p></div></div></div>'+
'<div class="wm-work" id="wmWork"><div class="wm-main"><div class="wm-preview"><div class="wm-card"><div class="wm-thumb"><img class="bg" id="wmBg" alt=""/><div class="wm-ov" id="wmOv"></div></div><div class="wm-nm" id="wmName"></div></div></div>'+
'<aside class="wm-side"><h2>Watermark options</h2>'+
'<div class="wm-tabs"><div class="wm-tab active" id="wmTabText">A — Place text</div><div class="wm-tab" id="wmTabImg">🖼 — Place image</div></div>'+
'<div id="wmTextSec"><div class="wm-lbl">Text</div><input class="wm-inp" id="wmText" type="text" value="TronoPDF" placeholder="Your watermark text"/>'+
'<div class="wm-lbl">Text style</div><div class="wm-row"><input type="color" id="wmColor" value="#ef4444"/><div class="wm-chk"><input type="checkbox" id="wmBold"><label for="wmBold">Bold</label></div><div class="wm-chk"><input type="checkbox" id="wmItalic"><label for="wmItalic">Italic</label></div></div></div>'+
'<div id="wmImgSec" style="display:none"><div class="wm-lbl">Watermark image</div><button class="wm-imgbtn" id="wmImgBtn" type="button">+ Add image (logo)</button><img class="wm-imgprev" id="wmImgPrev" style="display:none" alt=""/></div>'+
'<div class="wm-lbl">Size: <span id="wmSizeVal">40</span>pt</div><div class="wm-row"><input type="range" id="wmSize" min="10" max="100" value="40"/></div>'+
'<div class="wm-lbl">Opacity: <span id="wmOpVal">50</span>%</div><div class="wm-row"><input type="range" id="wmOp" min="5" max="100" value="50"/></div>'+
'<div class="wm-lbl">Position</div><div class="wm-grid" id="wmGrid">'+
'<div class="wm-pos" data-p="tl"></div><div class="wm-pos" data-p="tc"></div><div class="wm-pos" data-p="tr"></div>'+
'<div class="wm-pos" data-p="ml"></div><div class="wm-pos active" data-p="mc"></div><div class="wm-pos" data-p="mr"></div>'+
'<div class="wm-pos" data-p="bl"></div><div class="wm-pos" data-p="bc"></div><div class="wm-pos" data-p="br"></div></div>'+
'<div class="wm-lbl">Rotation</div><select class="wm-inp" id="wmRot"><option value="0">Do not rotate</option><option value="45">45°</option><option value="90">90°</option><option value="180">180°</option><option value="270">270°</option></select>'+
'<div class="wm-chk" style="margin-top:10px"><input type="checkbox" id="wmMosaic"><label for="wmMosaic">Mosaic (repeat across page)</label></div>'+
'<div class="wm-lbl">Pages</div><div class="wm-chk"><input type="checkbox" id="wmAll" checked><label for="wmAll">All pages</label></div>'+
'<div class="wm-row" id="wmRangeRow" style="display:none"><input class="wm-inp" type="number" id="wmFrom" min="1" value="1"/><span>to</span><input class="wm-inp" type="number" id="wmTo" min="1" value="1"/></div>'+
'<button class="wm-go" id="wmGo" type="button">Add Watermark →</button></aside></div></div>'+
'<div class="wm-busy" id="wmBusy"><h2>Adding watermark...</h2><p class="fn" id="wmBusyName"></p><div class="wm-bar"><div id="wmBarFill"></div></div><div class="wm-pct" id="wmPct">0%</div></div>'+
'<div class="wm-done" id="wmDone"><div class="wm-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">Watermark added successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="wmDoneInfo"></p><a class="wm-dl" id="wmDl" href="#">⬇ Download watermarked PDF</a><button class="wm-again" id="wmAgain" type="button">Watermark another PDF</button></div>'+
'<input type="file" id="wmFile" accept="application/pdf,.pdf" style="display:none">'+
'<input type="file" id="wmImgFile" accept="image/*" style="display:none">'+
'</div>';
var file=null;var totalPages=0;
var mode='text',pos='mc',imgData=null,imgBytes=null,imgRatio=1;
var pick=document.getElementById('wmPick'),work=document.getElementById('wmWork'),busy=document.getElementById('wmBusy'),done=document.getElementById('wmDone');
var zone=document.getElementById('wmZone'),btn=document.getElementById('wmBtn'),inp=document.getElementById('wmFile');
var ov=document.getElementById('wmOv'),bg=document.getElementById('wmBg'),nameEl=document.getElementById('wmName');
var go=document.getElementById('wmGo');
var elText=document.getElementById('wmText'),elColor=document.getElementById('wmColor'),elBold=document.getElementById('wmBold'),elItalic=document.getElementById('wmItalic');
var elSize=document.getElementById('wmSize'),elOp=document.getElementById('wmOp'),elRot=document.getElementById('wmRot'),elMosaic=document.getElementById('wmMosaic');
var elAll=document.getElementById('wmAll'),elFrom=document.getElementById('wmFrom'),elTo=document.getElementById('wmTo'),elRangeRow=document.getElementById('wmRangeRow');
function cssPos(p){
 switch(p){
  case 'tl':return{top:'5%',left:'5%'};
  case 'tc':return{top:'5%',left:'50%',tx:1};
  case 'tr':return{top:'5%',right:'5%'};
  case 'ml':return{top:'50%',left:'5%',ty:1};
  case 'mc':return{top:'50%',left:'50%',tx:1,ty:1};
  case 'mr':return{top:'50%',right:'5%',ty:1};
  case 'bl':return{bottom:'5%',left:'5%'};
  case 'bc':return{bottom:'5%',left:'50%',tx:1};
  case 'br':return{bottom:'5%',right:'5%'};
 }
 return {};
}
function tf(){
 var t=[];var c=cssPos(pos);
 if(c.tx){t.push('translateX(-50%)');}
 if(c.ty){t.push('translateY(-50%)');}
 t.push('rotate('+elRot.value+'deg)');
 return t.join(' ');
}
function makeStamp(op,rot,mosaic){
 var el;
 if(mode==='text'){
  el=document.createElement('span');
  el.textContent=elText.value||'Watermark';
  el.style.color=elColor.value;
  el.style.fontSize=(mosaic?12:Math.max(10,elSize.value/3))+'px';
  if(elBold.checked){el.style.fontWeight='900';}
  if(elItalic.checked){el.style.fontStyle='italic';}
 }else{
  el=document.createElement('img');
  el.src=imgData||'';
  el.style.width=(mosaic?60:elSize.value*2)+'px';
 }
 el.style.opacity=op;
 return el;
}
function updatePreview(){
 ov.innerHTML='';
 var op=elOp.value/100;
 var rot=parseInt(elRot.value);
 if(elMosaic.checked){
  for(var r=0;r<4;r++){
   for(var c2=0;c2<3;c2++){
    var el=makeStamp(op,rot,true);
    el.style.left=(8+c2*33)+'%';el.style.top=(10+r*25)+'%';
    el.style.transform='translate(-50%,-50%) rotate('+(rot===0?45:rot)+'deg)';
    ov.appendChild(el);
   }
  }
 }else{
  var c=cssPos(pos);
  var el=makeStamp(op,rot,false);
  for(var k in c){if(k!=='tx'&&k!=='ty'){el.style[k]=c[k];}}
  el.style.transform=tf();
  ov.appendChild(el);
 }
 document.getElementById('wmSizeVal').textContent=elSize.value;
 document.getElementById('wmOpVal').textContent=elOp.value;
}
[elText,elColor,elSize,elOp,elRot].forEach(function(x){x.addEventListener('input',updatePreview);});
[elBold,elItalic,elMosaic].forEach(function(x){x.addEventListener('change',updatePreview);});
document.querySelectorAll('.wm-pos').forEach(function(p){
 p.onclick=function(){
  document.querySelectorAll('.wm-pos').forEach(function(x){x.classList.remove('active');});
  this.classList.add('active');
  pos=this.getAttribute('data-p');
  updatePreview();
 };
});
elAll.onchange=function(){elRangeRow.style.display=this.checked?'none':'flex';};
document.getElementById('wmTabText').onclick=function(){mode='text';this.classList.add('active');document.getElementById('wmTabImg').classList.remove('active');document.getElementById('wmTextSec').style.display='block';document.getElementById('wmImgSec').style.display='none';updatePreview();};
document.getElementById('wmTabImg').onclick=function(){mode='image';this.classList.add('active');document.getElementById('wmTabText').classList.remove('active');document.getElementById('wmTextSec').style.display='none';document.getElementById('wmImgSec').style.display='block';updatePreview();};
document.getElementById('wmImgBtn').onclick=function(){document.getElementById('wmImgFile').click();};
document.getElementById('wmImgFile').onchange=function(){
 var f=this.files[0];if(!f){return;}
 var rd=new FileReader();
 rd.onload=function(){
  var img=new Image();
  img.onload=function(){
   imgRatio=img.height/img.width;
   var c=document.createElement('canvas');c.width=600;c.height=Math.max(1,Math.round(600*imgRatio));
   var ctx=c.getContext('2d');ctx.drawImage(img,0,0,c.width,c.height);
   imgData=c.toDataURL('image/png');
   imgBytes=dataURLtoBytes(imgData);
   var prev=document.getElementById('wmImgPrev');prev.src=imgData;prev.style.display='block';
   updatePreview();
  };
  img.src=rd.result;
 };
 rd.readAsDataURL(f);
 this.value='';
};
function addFile(f){
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){alert('Please select a PDF file.');return;}
 file=f;pick.style.display='none';work.style.display='block';
 nameEl.textContent=f.name;
 waitLib('pdfjsLib').then(function(ok){
  if(!ok){return;}
  window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
  f.arrayBuffer().then(function(b){
   return window.pdfjsLib.getDocument({data:b}).promise.then(function(d){
    totalPages=d.numPages;
    elTo.value=totalPages;
    d.getPage(1).then(function(page){
     var vp=page.getViewport({scale:1});
     var scale=Math.min(2,400/vp.height);
     var vp2=page.getViewport({scale:scale});
     var canvas=document.createElement('canvas');
     canvas.width=Math.floor(vp2.width);canvas.height=Math.floor(vp2.height);
     page.render({canvasContext:canvas.getContext('2d'),viewport:vp2}).promise.then(function(){
            bg.src=canvas.toDataURL('image/png');
      updatePreview();
      d.destroy();
     });
    });
   });
  }).catch(function(){alert('Error reading PDF');});
 });
}
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};
function pct(p){document.getElementById('wmPct').textContent=Math.round(p)+'%';document.getElementById('wmBarFill').style.width=p+'%';}
go.onclick=function(){
 if(!file){return;}
 if(mode==='image'&&!imgBytes){alert('Please add a watermark image first.');return;}
 if(mode==='text'&&!elText.value.trim()){alert('Please enter watermark text.');return;}
 work.style.display='none';busy.style.display='block';
 document.getElementById('wmBusyName').textContent=file.name;
 pct(5);
 waitLib('PDFLib').then(function(ok){
  if(!ok){throw new Error('libs');}
  return file.arrayBuffer().then(function(buf){
   return PDFLib.PDFDocument.load(buf,{ignoreEncryption:true}).then(function(pdf){
    var fontName=elBold.checked?PDFLib.StandardFonts.HelveticaBold:(elItalic.checked?PDFLib.StandardFonts.HelveticaOblique:PDFLib.StandardFonts.Helvetica);
    return pdf.embedFont(fontName).then(function(stdFont){
     var pages=pdf.getPages();
     var from=elAll.checked?1:Math.max(1,parseInt(elFrom.value)||1);
     var to=elAll.checked?pages.length:Math.min(pages.length,parseInt(elTo.value)||pages.length);
     var rgb=hexToRgb(elColor.value);
     var op=elOp.value/100;
     var rot=parseInt(elRot.value);
     var size=parseInt(elSize.value);
     var chain=Promise.resolve();
     var embeddedImg=null;
     if(mode==='image'){chain=pdf.embedPng(imgBytes).then(function(ei){embeddedImg=ei;});}
     return chain.then(function(){
      for(var i=from-1;i<to;i++){
       var pg=pages[i];
       var w=pg.getWidth(),h=pg.getHeight();
       var m=40;
       pct(10+((i-from+1)/(to-from+1))*80);
       if(elMosaic.checked){
        var mrot=(rot===0?45:rot);
        for(var y=h*0.9;y>0;y-=h/4){
         for(var x=w*0.08;x<w;x+=w/2.5){
          if(mode==='text'){pg.drawText(elText.value,{x:x,y:y,size:size*0.6,font:stdFont,color:PDFLib.rgb(rgb.r,rgb.g,rgb.b),opacity:op,rotate:PDFLib.degrees(mrot)});}
          else{var iw=w*0.25;pg.drawImage(embeddedImg,{x:x,y:y,width:iw,height:iw*imgRatio,opacity:op,rotate:PDFLib.degrees(mrot)});}
         }
        }
       }else{
        if(mode==='text'){
         var textW=stdFont.widthOfTextAtSize(elText.value,size);
         var x,y;
         switch(pos){
          case 'tl':x=m;y=h-m-size;break;
          case 'tc':x=(w-textW)/2;y=h-m-size;break;
          case 'tr':x=w-m-textW;y=h-m-size;break;
          case 'ml':x=m;y=(h-size)/2;break;
          case 'mc':x=(w-textW)/2;y=(h-size)/2;break;
          case 'mr':x=w-m-textW;y=(h-size)/2;break;
          case 'bl':x=m;y=m;break;
          case 'bc':x=(w-textW)/2;y=m;break;
          case 'br':x=w-m-textW;y=m;break;
          default:x=(w-textW)/2;y=(h-size)/2;
         }
         pg.drawText(elText.value,{x:x,y:y,size:size,font:stdFont,color:PDFLib.rgb(rgb.r,rgb.g,rgb.b),opacity:op,rotate:PDFLib.degrees(rot)});
        }else{
         var iw2=w*(size/100)*0.6;var ih2=iw2*imgRatio;
         var x2,y2;
         switch(pos){
          case 'tl':x2=m;y2=h-m-ih2;break;
          case 'tc':x2=(w-iw2)/2;y2=h-m-ih2;break;
          case 'tr':x2=w-m-iw2;y2=h-m-ih2;break;
          case 'ml':x2=m;y2=(h-ih2)/2;break;
          case 'mc':x2=(w-iw2)/2;y2=(h-ih2)/2;break;
          case 'mr':x2=w-m-iw2;y2=(h-ih2)/2;break;
          case 'bl':x2=m;y2=m;break;
          case 'bc':x2=(w-iw2)/2;y2=m;break;
          case 'br':x2=w-m-iw2;y2=m;break;
          default:x2=(w-iw2)/2;y2=(h-ih2)/2;
         }
         pg.drawImage(embeddedImg,{x:x2,y:y2,width:iw2,height:ih2,opacity:op,rotate:PDFLib.degrees(rot)});
        }
       }
      }
      return pdf.save().then(function(bytes){
       pct(100);
       setTimeout(function(){
        busy.style.display='none';done.style.display='block';
        document.getElementById('wmDoneInfo').textContent=(to-from+1)+' page(s) watermarked • '+fmtB(bytes.length);
        var blob=new Blob([bytes],{type:'application/pdf'});
        var dl=document.getElementById('wmDl');dl.href=URL.createObjectURL(blob);dl.download='watermarked-'+file.name;
       },300);
      });
     });
    });
   });
  });
 }).catch(function(){
  busy.style.display='none';work.style.display='block';
  alert('Error adding watermark. Please try again.');
 });
};
document.getElementById('wmAgain').onclick=function(){
 file=null;totalPages=0;
 done.style.display='none';work.style.display='none';pick.style.display='block';
};
updatePreview();
})();
