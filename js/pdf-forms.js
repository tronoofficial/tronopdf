/* TronoPDF - PDF Forms v1 | create fillable PDFs + fill existing forms, browser-only */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
function loadJS(src){return new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=function(){res(true);};s.onerror=function(){rej(new Error('load fail'));};document.head.appendChild(s);});}
var html='';
html+='<style>';
html+='.fm-wrap{max-width:1400px;margin:0 auto}';
html+='.fm-hero{text-align:center;padding:50px 16px 40px}';
html+='.fm-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.fm-hero p{font-size:18px;color:#7a7a85;margin-bottom:30px}';
html+='.fm-modes{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;max-width:900px;margin:0 auto 30px}';
html+='.fm-mode{flex:1;min-width:280px;background:#fff;border:2px solid #eceaf6;border-radius:14px;padding:28px;cursor:pointer;transition:.2s;text-align:center}';
html+='.fm-mode:hover{border-color:#7c3aed;transform:translateY(-3px);box-shadow:0 12px 30px rgba(124,58,237,.15)}';
html+='.fm-mode .ic{font-size:44px;display:block;margin-bottom:10px}';
html+='.fm-mode h3{font-size:18px;font-weight:900;margin-bottom:6px}';
html+='.fm-mode p{font-size:13px;color:#7a7a85;margin:0}';
html+='.fm-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.fm-main{display:flex;min-height:680px}';
html+='.fm-prev{flex:1;padding:26px;display:flex;flex-direction:column;align-items:center;gap:12px;overflow:auto}';
html+='.fm-canvaswrap{position:relative;border-radius:6px;overflow:hidden;box-shadow:0 10px 40px rgba(30,20,60,.18);background:#fff;touch-action:none}';
html+='.fm-canvaswrap canvas{display:block}';
html+='.fm-field{position:absolute;border:2px dashed #7c3aed;background:rgba(124,58,237,.08);cursor:move;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#7c3aed;padding:2px}';
html+='.fm-field input,.fm-field select{width:100%;height:100%;border:none;background:#fff;font-size:12px;padding:4px}';
html+='.fm-field .del{position:absolute;top:-8px;right:-8px;width:20px;height:20px;border-radius:50%;background:#dc2626;color:#fff;border:2px solid #fff;font-size:10px;cursor:pointer;display:none}';
html+='.fm-field.sel .del{display:block}';
html+='.fm-pagenav{display:flex;gap:10px;align-items:center}';
html+='.fm-pagenav button{border:1px solid #eceaf6;background:#fff;border-radius:8px;padding:8px 14px;font-weight:800;cursor:pointer}';
html+='.fm-pagenav button:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.fm-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.fm-side h2{font-size:20px;font-weight:900;margin-bottom:4px}';
html+='.fm-sub{font-size:13px;color:#9a9aa5;margin-bottom:14px}';
html+='.fm-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}';
html+='.fm-fields{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}';
html+='.fm-fields button{border:2px solid #eceaf6;border-radius:8px;padding:10px 4px;font-size:11px;font-weight:800;cursor:pointer;background:#fff;color:#4b4b5a}';
html+='.fm-fields button:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.fm-fields .ic{font-size:18px;display:block;margin-bottom:2px}';
html+='.fm-list{flex:1;overflow-y:auto;border-top:1px solid #eceaf6;padding-top:10px;min-height:60px;margin-top:14px}';
html+='.fm-list h4{font-size:12px;font-weight:800;color:#9a9aa5;margin-bottom:8px}';
html+='.fm-li{display:flex;align-items:center;gap:8px;border:1px solid #eceaf6;border-radius:8px;padding:8px;margin-bottom:6px;font-size:12px;font-weight:700;cursor:pointer}';
html+='.fm-li.sel{border-color:#7c3aed;background:#f3f0ff}';
html+='.fm-li .nm{flex:1}';
html+='.fm-li button{border:none;background:none;color:#dc2626;font-weight:800;cursor:pointer;padding:2px 6px;font-size:14px}';
html+='.fm-btnrow{display:flex;gap:8px;margin-top:10px}';
html+='.fm-btnrow button{flex:1;border:1px solid #eceaf6;background:#fff;border-radius:10px;padding:11px;font-size:13px;font-weight:800;cursor:pointer}';
html+='.fm-btnrow button:hover{border-color:#dc2626;color:#dc2626}';
html+='.fm-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:17px;font-weight:800;padding:16px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:12px}';
html+='.fm-busy{display:none;text-align:center;padding:60px 20px}';
html+='.fm-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.fm-busy .st{color:#7a7a85;font-size:15px;margin-bottom:26px}';
html+='.fm-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.fm-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .3s}';
html+='.fm-done{display:none;text-align:center;padding:50px 20px}';
html+='.fm-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.fm-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.fm-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='.fm-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);background:#16a34a;color:#fff;font-weight:800;padding:14px 28px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:all .3s;z-index:999;font-size:14px}';
html+='.fm-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}';
html+='.fm-toast.err{background:#dc2626}';
html+='@media(max-width:900px){.fm-main{flex-direction:column}.fm-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="fm-wrap">';
html+='<div id="fmPick"><div class="fm-hero"><h1>PDF Forms</h1><p>Create fillable PDFs or fill existing ones - free, private, unlimited.</p>';
html+='<div class="fm-modes">';
html+='<div class="fm-mode" id="fmModeCreate"><span class="ic">✨</span><h3>Create new form</h3><p>Start blank or from a PDF, add text/checkbox/radio/dropdown fields.</p></div>';
html+='<div class="fm-mode" id="fmModeFill"><span class="ic">✍️</span><h3>Fill existing form</h3><p>Upload a PDF with form fields - fill values and download.</p></div>';
html+='</div></div></div>';
html+='<div class="fm-work" id="fmWork"><div class="fm-main"><div class="fm-prev"><div class="fm-canvaswrap" id="fmWrap"><canvas id="fmCanvas"></canvas><div id="fmFields"></div></div>';
html+='<div class="fm-pagenav"><button id="fmPrev" type="button">←</button><span id="fmPageLbl" style="font-weight:800"></span><button id="fmNext" type="button">→</button></div></div>';
html+='<aside class="fm-side" id="fmSide"></aside></div></div>';
html+='<div class="fm-busy" id="fmBusy"><h2>Processing...</h2><p class="st" id="fmStatus">Working...</p><div class="fm-bar"><div id="fmBarFill"></div></div></div>';
html+='<div class="fm-done" id="fmDone"><div class="fm-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF ready!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="fmDoneInfo"></p><a class="fm-dl" id="fmDl" href="#">⬇ Download PDF</a><button class="fm-again" id="fmAgain" type="button">Start over</button></div>';
html+='<div class="fm-toast" id="fmToast"></div>';
html+='<input type="file" id="fmFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var mode=null,file=null,doc=null,totalPages=0,curPage=1;
var pageW=595,pageH=842,scale=1;
var fields={},selField=null; // fields[pageNum] = [{type,x,y,w,h,name,value,options}]
var pick=document.getElementById('fmPick'),work=document.getElementById('fmWork'),busy=document.getElementById('fmBusy'),done=document.getElementById('fmDone');
var wrap=document.getElementById('fmWrap'),canvas=document.getElementById('fmCanvas'),ctx=canvas.getContext('2d');
var fieldsBox=document.getElementById('fmFields'),side=document.getElementById('fmSide');
var pageLbl=document.getElementById('fmPageLbl');
var toastEl=document.getElementById('fmToast');
function toast(m,e){toastEl.textContent=m;toastEl.classList.toggle('err',!!e);toastEl.classList.add('show');clearTimeout(toastEl.__h);toastEl.__h=setTimeout(function(){toastEl.classList.remove('show');},2200);}
function fmtB(n){return n<1024?n+' B':(n/1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
function currentFields(){if(!fields[curPage])fields[curPage]=[];return fields[curPage];}
document.getElementById('fmModeCreate').onclick=function(){mode='create';document.getElementById('fmFile').click();};
document.getElementById('fmModeFill').onclick=function(){mode='fill';document.getElementById('fmFile').click();};
document.getElementById('fmFile').onchange=function(){
 var f=this.files[0];if(!f){return;}
 file=f;
 Promise.all([loadJS(PDFLIB_SRC),loadJS(PDFJS_SRC)]).then(function(){
  window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
  return f.arrayBuffer();
 }).then(function(b){
  return window.pdfjsLib.getDocument({data:b}).promise;
 }).then(function(d){
  doc=d;totalPages=d.numPages;curPage=1;fields={};
  pick.style.display='none';work.style.display='block';done.style.display='none';
  buildSidebar();renderPage();
  if(mode==='fill'){detectExistingFields();}
  toast('✓ PDF loaded ('+totalPages+' pages)');
 }).catch(function(e){pick.style.display='block';toast('Could not read PDF: '+((e&&e.message)||e),true);});
 this.value='';
};
function buildSidebar(){
 var h='<h2>'+(mode==='create'?'Add form fields':'Fill form fields')+'</h2>';
 h+='<p class="fm-sub">'+(mode==='create'?'Click a field type, then drag on the page':'Edit values in detected fields')+'</p>';
 if(mode==='create'){
  h+='<div class="fm-lbl">Add a field</div><div class="fm-fields">';
  h+='<button data-t="text"><span class="ic">📝</span>Text</button>';
  h+='<button data-t="checkbox"><span class="ic">☑</span>Checkbox</button>';
  h+='<button data-t="radio"><span class="ic">⦿</span>Radio</button>';
  h+='<button data-t="dropdown"><span class="ic">▾</span>Dropdown</button>';
  h+='<button data-t="date"><span class="ic">📅</span>Date</button>';
  h+='<button data-t="signature"><span class="ic">✍️</span>Signature</button>';
  h+='</div>';
  h+='<div class="fm-btnrow"><button id="fmClear" type="button">Clear all fields</button></div>';
 }
 h+='<div class="fm-list"><h4>Fields on this page (<span id="fmCount">0</span>)</h4><div id="fmList"></div></div>';
 h+='<button class="fm-go" id="fmGo" type="button">'+(mode==='create'?'Download Fillable PDF →':'Download Filled PDF →')+'</button>';
 side.innerHTML=h;
 if(mode==='create'){
  side.querySelectorAll('.fm-fields button').forEach(function(b){
   b.onclick=function(){addField(b.getAttribute('data-t'));};
  });
  document.getElementById('fmClear').onclick=function(){fields[curPage]=[];selField=null;syncUI();};
 }
 document.getElementById('fmGo').onclick=generate;
}
function addField(type){
 var name='field_'+(Date.now()%100000);
 var f={type:type,x:50,y:100,w:type==='checkbox'||type==='radio'?20:180,h:type==='checkbox'||type==='radio'?20:28,name:name,value:''};
 if(type==='dropdown'){f.options=['Option 1','Option 2','Option 3'];}
 if(type==='radio'){f.group='group_'+(Object.keys(fields).length+1);}
 if(!fields[curPage])fields[curPage]=[];
 fields[curPage].push(f);
 selField=f;
 syncUI();
 toast('✓ '+type+' field added');
}
function syncUI(){
 var list=currentFields();
 document.getElementById('fmCount').textContent=list.length;
 fieldsBox.innerHTML='';
 var listBox=document.getElementById('fmList');listBox.innerHTML='';
 list.forEach(function(f){
  var d=document.createElement('div');d.className='fm-field'+(selField===f?' sel':'');
  d.style.left=(f.x*scale)+'px';d.style.top=(f.y*scale)+'px';
  d.style.width=(f.w*scale)+'px';d.style.height=(f.h*scale)+'px';
  if(f.type==='text'){d.innerHTML='<input type="text" placeholder="Text field" value="'+(f.value||'')+'"/>';}
  else if(f.type==='checkbox'){d.innerHTML='<input type="checkbox" '+(f.value?'checked':'')+'/>';}
  else if(f.type==='radio'){d.innerHTML='<input type="radio" name="'+f.group+'" '+(f.value?'checked':'')+'/>';}
  else if(f.type==='dropdown'){var sel='<select>';f.options.forEach(function(o){sel+='<option '+(o===f.value?'selected':'')+'>'+o+'</option>';});sel+='</select>';d.innerHTML=sel;}
  else if(f.type==='date'){d.innerHTML='<input type="date" value="'+(f.value||'')+'"/>';}
  else if(f.type==='signature'){d.style.border='2px dashed #7c3aed';d.style.background='rgba(124,58,237,.05)';d.textContent='✍️ Signature';}
  var del=document.createElement('button');del.className='del';del.textContent='✕';
  del.onclick=function(e){e.stopPropagation();var idx=list.indexOf(f);list.splice(idx,1);selField=null;syncUI();};
  d.appendChild(del);
  // capture input values
  var inp=d.querySelector('input,select');
  if(inp){inp.oninput=inp.onchange=function(){f.value=inp.type==='checkbox'||inp.type==='radio'?inp.checked:inp.value;};}
  // drag
  d.addEventListener('pointerdown',function(e){
   if(e.target===inp||e.target===del){return;}
   e.stopPropagation();selField=f;syncUI();
   var on=true,lx=e.clientX,ly=e.clientY;
   d.setPointerCapture(e.pointerId);
   function mv(ev){if(!on)return;f.x+=(ev.clientX-lx)/scale;f.y+=(ev.clientY-ly)/scale;lx=ev.clientX;ly=ev.clientY;d.style.left=(f.x*scale)+'px';d.style.top=(f.y*scale)+'px';}
   function up(){on=false;d.removeEventListener('pointermove',mv);d.removeEventListener('pointerup',up);}
   d.addEventListener('pointermove',mv);d.addEventListener('pointerup',up);
  });
  fieldsBox.appendChild(d);
  var li=document.createElement('div');li.className='fm-li'+(selField===f?' sel':'');
  var label=f.type.charAt(0).toUpperCase()+f.type.slice(1)+' ('+f.name+')';
  li.innerHTML='<span>'+label+'</span>';
  var del2=document.createElement('button');del2.textContent='✕';
  del2.onclick=function(e){e.stopPropagation();var idx=list.indexOf(f);list.splice(idx,1);selField=null;syncUI();};
  li.appendChild(del2);
  li.onclick=function(){selField=f;syncUI();};
  listBox.appendChild(li);
 });
}
function detectExistingFields(){
 if(!doc){return;}
 var chain=Promise.resolve();
 for(var i=1;i<=totalPages;i++){
  (function(n){chain=chain.then(function(){
   return doc.getPage(n).then(function(p){
    if(p.getAnnotations){
     return p.getAnnotations().then(function(annots){
      if(!fields[n])fields[n]=[];
      annots.forEach(function(a){
       if(a.subtype==='Widget'&&a.fieldType){
        var type='text';
        if(a.fieldType==='Btn'){type=a.radioButton?'radio':'checkbox';}
        else if(a.fieldType==='Ch'){type='dropdown';}
        var rect=a.rect||[0,0,100,30];
        fields[n].push({type:type,x:rect[0],y:pageH-rect[3],w:rect[2]-rect[0],h:rect[3]-rect[1],name:a.fieldName||'f',value:a.fieldValue||''});
       }
      });
     });
    }
   });
  });})(i);
 }
 chain.then(function(){syncUI();var total=0;Object.keys(fields).forEach(function(k){total+=fields[k].length;});if(total>0)toast('✓ Detected '+total+' existing fields');});
}
function renderPage(){
 if(!doc){return;}
 doc.getPage(curPage).then(function(page){
  var vp1=page.getViewport({scale:1});
  pageW=vp1.width;pageH=vp1.height;
  scale=Math.min(1.4,560/pageW);
  var vp=page.getViewport({scale:scale});
  canvas.width=Math.floor(vp.width);canvas.height=Math.floor(vp.height);
  page.render({canvasContext:ctx,viewport:vp}).promise.then(function(){
   pageLbl.textContent='Page '+curPage+' / '+totalPages;
   syncUI();
  });
 });
}
document.getElementById('fmPrev').onclick=function(){if(curPage>1){curPage--;renderPage();}};
document.getElementById('fmNext').onclick=function(){if(curPage<totalPages){curPage++;renderPage();}};
function generate(){
 work.style.display='none';busy.style.display='block';
 document.getElementById('fmStatus').textContent='Loading libraries...';
 loadJS(PDFLIB_SRC).then(function(){
  return file.arrayBuffer();
 }).then(function(buf){
  return window.PDFLib.PDFDocument.load(buf,{ignoreEncryption:true});
 }).then(function(pdf){
  var form=null;
  try{form=pdf.getForm();}catch(e){}
  var pages=pdf.getPages();
  var chain=Promise.resolve();
  for(var n=1;n<=pages.length;n++){
   (function(num){
    chain=chain.then(function(){
     document.getElementById('fmStatus').textContent='Building page '+num+'...';
     var pg=pages[num-1];
     var pw=pg.getWidth(),ph=pg.getHeight();
     var list=fields[num]||[];
     list.forEach(function(f,idx){
      var pdfY=ph-f.y-f.h;
      var name=f.name+'_'+num+'_'+idx;
      try{
       if(mode==='create'){
        if(f.type==='text'){var t=form.createTextField(name);t.setText(f.value||'');t.addToPage(pg,{x:f.x,y:pdfY,width:f.w,height:f.h});}
        else if(f.type==='checkbox'){var c=form.createCheckBox(name);if(f.value)c.check();c.addToPage(pg,{x:f.x,y:pdfY,width:f.w,height:f.h});}
        else if(f.type==='radio'){var g=form.createRadioGroup(name);f.options||[{x:f.x,y:pdfY,width:f.w,height:f.h}];g.addOptionToPage('opt',{page:pg,x:f.x,y:pdfY,width:f.w,height:f.h});}
        else if(f.type==='dropdown'){var d=form.createDropdown(name);f.options.forEach(function(o){d.addOptions(o);});if(f.value)d.select(f.value);d.addToPage(pg,{x:f.x,y:pdfY,width:f.w,height:f.h});}
        else if(f.type==='date'){var dt=form.createTextField(name);dt.setText(f.value||'YYYY-MM-DD');dt.addToPage(pg,{x:f.x,y:pdfY,width:f.w,height:f.h});}
        else if(f.type==='signature'){var s=form.createTextField(name);s.setText('');s.addToPage(pg,{x:f.x,y:pdfY,width:f.w,height:f.h});}
       }else if(form){
        // fill mode: try to match existing fields
        var existing=null;
        try{existing=form.getField(f.name);}catch(e){}
        if(existing){
         try{
          if(f.type==='checkbox'){if(f.value)existing.check();else existing.uncheck();}
          else if(f.type==='radio'){existing.select(f.value||'');}
          else if(f.type==='dropdown'){existing.select(f.value||'');}
          else{existing.setText(f.value||'');}
         }catch(e){}
        }
       }
      }catch(e){/* skip bad field */}
     });
     return null;
    });
   })(n);
  }
  return chain.then(function(){return pdf.save();});
 }).then(function(bytes){
  busy.style.display='none';done.style.display='block';
  var total=0;Object.keys(fields).forEach(function(k){total+=fields[k].length;});
  document.getElementById('fmDoneInfo').textContent=(mode==='create'?'Created ':'Filled ')+total+' field(s) • '+fmtB(bytes.length);
  var blob=new Blob([bytes],{type:'application/pdf'});
  var dl=document.getElementById('fmDl');
  dl.href=URL.createObjectURL(blob);
  dl.download=(mode==='create'?'form-':'filled-')+(file?file.name.replace(/\.pdf$/i,''):'document')+'.pdf';
  toast('✓ PDF ready!');
 }).catch(function(e){
  busy.style.display='none';work.style.display='block';
  toast('Error: '+((e&&e.message)||e),true);
 });
}
document.getElementById('fmAgain').onclick=function(){
 done.style.display='none';pick.style.display='block';
 file=null;doc=null;fields={};selField=null;
};
})();
