/* TronoPDF - Excel to PDF v1 | SheetJS read + pdf-lib vector tables, browser-only */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var XLSX_SRC='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
function loadJS(src){return new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=function(){res(true);};s.onerror=function(){rej(new Error('load fail'));};document.head.appendChild(s);});}
var html='';
html+='<style>';
html+='.xp-wrap{max-width:1400px;margin:0 auto}';
html+='.xp-hero{text-align:center;padding:50px 16px 40px}';
html+='.xp-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.xp-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.xp-big{background:linear-gradient(135deg,#217346,#2e9159);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(33,115,70,.35)}';
html+='.xp-big:hover{transform:translateY(-2px)}';
html+='.xp-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.xp-zone{border:2px dashed transparent;border-radius:18px}';
html+='.xp-zone.on{border-color:#217346;background:#eaf7ef}';
html+='.xp-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden;padding:22px}';
html+='.xp-grid{display:grid;grid-template-columns:340px 1fr;gap:20px}';
html+='.xp-side{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px}';
html+='.xp-side h2{font-size:20px;font-weight:900;margin-bottom:6px}';
html+='.xp-sub{font-size:13px;color:#9a9aa5;margin-bottom:14px}';
html+='.xp-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}';
html+='.xp-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;background:#fff}';
html+='.xp-chk{display:flex;gap:8px;align-items:center;margin:8px 0}';
html+='.xp-chk input{width:16px;height:16px;accent-color:#217346}';
html+='.xp-chk label{font-size:13px;font-weight:600;cursor:pointer}';
html+='.xp-sheets{display:flex;gap:6px;flex-wrap:wrap}';
html+='.xp-sheet{border:2px solid #eceaf6;border-radius:8px;padding:7px 12px;font-size:12px;font-weight:800;cursor:pointer;background:#fff;color:#4b4b5a}';
html+='.xp-sheet.active{border-color:#217346;color:#217346;background:#eaf7ef}';
html+='.xp-go{width:100%;background:linear-gradient(135deg,#217346,#2e9159);color:#fff;font-size:17px;font-weight:800;padding:16px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(33,115,70,.35);margin-top:16px}';
html+='.xp-go:active{transform:scale(.98)}';
html+='.xp-preview{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px;overflow:auto;max-height:760px}';
html+='.xp-preview h3{font-size:16px;font-weight:900;margin-bottom:12px}';
html+='.xp-table{border-collapse:collapse;width:100%;font-size:12px}';
html+='.xp-table th,.xp-table td{border:1px solid #d5d9e2;padding:6px 8px;text-align:left;white-space:nowrap;overflow:hidden;max-width:220px;text-overflow:ellipsis}';
html+='.xp-table th{background:#217346;color:#fff;font-weight:800}';
html+='.xp-table tr:nth-child(even) td{background:#f4f7f5}';
html+='.xp-busy{display:none;text-align:center;padding:60px 20px}';
html+='.xp-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.xp-busy .st{color:#7a7a85;font-size:15px;margin-bottom:26px}';
html+='.xp-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.xp-bar div{height:100%;width:0;background:linear-gradient(90deg,#217346,#2e9159);transition:width .3s}';
html+='.xp-pct{font-size:36px;font-weight:900}';
html+='.xp-done{display:none;text-align:center;padding:50px 20px}';
html+='.xp-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.xp-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.xp-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='.xp-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);background:#16a34a;color:#fff;font-weight:800;padding:14px 28px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:all .3s;z-index:999;font-size:14px}';
html+='.xp-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}';
html+='.xp-toast.err{background:#dc2626}';
html+='@media(max-width:900px){.xp-grid{grid-template-columns:1fr}}';
html+='</style>';
html+='<div class="xp-wrap">';
html+='<div id="xpPick"><div class="xp-hero"><h1>Excel to PDF</h1><p>Convert spreadsheets to crisp, professional PDFs - free & private.</p>';
html+='<div class="xp-zone" id="xpZone"><button class="xp-big" id="xpBtn" type="button">Select Excel file</button><p class="xp-drop-hint">.xlsx, .xls or .csv - or drop here</p></div></div></div>';
html+='<div class="xp-work" id="xpWork"><div class="xp-grid">';
html+='<div class="xp-side"><h2>Convert settings</h2><p class="xp-sub">Runs fully in your browser</p>';
html+='<div class="xp-lbl">Sheets</div><div class="xp-sheets" id="xpSheets"></div>';
html+='<div class="xp-lbl">Orientation</div><select class="xp-inp" id="xpOrient"><option value="auto">Auto (fit content)</option><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select>';
html+='<div class="xp-chk"><input type="checkbox" id="xpGrid" checked/><label for="xpGrid">Show grid lines</label></div>';
html+='<div class="xp-chk"><input type="checkbox" id="xpHeader" checked/><label for="xpHeader">Bold first row (header)</label></div>';
html+='<button class="xp-go" id="xpGo" type="button">Convert to PDF →</button></div>';
html+='<div class="xp-preview"><h3>Preview</h3><div id="xpPrev"></div></div>';
html+='</div></div>';
html+='<div class="xp-busy" id="xpBusy"><h2>Converting to PDF...</h2><p class="st" id="xpStatus">Working...</p><div class="xp-bar"><div id="xpBarFill"></div></div><div class="xp-pct" id="xpPct">0%</div></div>';
html+='<div class="xp-done" id="xpDone"><div class="xp-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF ready!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="xpDoneInfo"></p><a class="xp-dl" id="xpDl" href="#">⬇ Download PDF</a><button class="xp-again" id="xpAgain" type="button">Convert another</button></div>';
html+='<div class="xp-toast" id="xpToast"></div>';
html+='<input type="file" id="xpFile" accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var file=null,workbook=null,sheetNames=[],activeSheet=0;
var pick=document.getElementById('xpPick'),work=document.getElementById('xpWork'),busy=document.getElementById('xpBusy'),done=document.getElementById('xpDone');
var zone=document.getElementById('xpZone'),btn=document.getElementById('xpBtn'),inp=document.getElementById('xpFile');
var sheetsBox=document.getElementById('xpSheets'),prevBox=document.getElementById('xpPrev');
var toastEl=document.getElementById('xpToast');
function toast(m,e){toastEl.textContent=m;toastEl.classList.toggle('err',!!e);toastEl.classList.add('show');clearTimeout(toastEl.__h);toastEl.__h=setTimeout(function(){toastEl.classList.remove('show');},2200);}
function pct(p){document.getElementById('xpPct').textContent=Math.round(p)+'%';document.getElementById('xpBarFill').style.width=p+'%';}
function setStatus(s){document.getElementById('xpStatus').textContent=s;}
btn.onclick=function(){inp.click();};
function loadFile(f){
 var ok=/\.(xlsx|xls|csv)$/i.test(f.name)||f.type.indexOf('spreadsheet')>-1||f.type==='text/csv';
 if(!ok){toast('Please select an Excel/CSV file',true);return;}
 file=f;
 loadJS(XLSX_SRC).then(function(){
  var rd=new FileReader();
  rd.onload=function(e){
   try{
    workbook=XLSX.read(new Uint8Array(e.target.result),{type:'array'});
    sheetNames=workbook.SheetNames;
    activeSheet=0;
    pick.style.display='none';done.style.display='none';work.style.display='block';
    renderSheets();renderPreview();
    toast('✓ Loaded '+sheetNames.length+' sheet(s)');
   }catch(err){toast('Could not read file',true);}
  };
  rd.readAsArrayBuffer(f);
 });
}
inp.onchange=function(){if(inp.files[0]){loadFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){loadFile(e.dataTransfer.files[0]);}};
function renderSheets(){
 sheetsBox.innerHTML='';
 sheetNames.forEach(function(n,i){
  var d=document.createElement('div');d.className='xp-sheet'+(i===activeSheet?' active':'');d.textContent=n;
  d.onclick=function(){activeSheet=i;renderSheets();renderPreview();};
  sheetsBox.appendChild(d);
 });
}
function getAoa(name){
 var ws=workbook.Sheets[name];
 return XLSX.utils.sheet_to_json(ws,{header:1,defval:''});
}
function renderPreview(){
 var aoa=getAoa(sheetNames[activeSheet])||[];
 var rows=aoa.slice(0,30);
 var maxCols=0;rows.forEach(function(r){if(r.length>maxCols)maxCols=r.length;});
 maxCols=Math.min(maxCols,8);
 var t='<table class="xp-table"><thead><tr>';
 for(var c=0;c<maxCols;c++){t+='<th>'+esc(String((rows[0]&&rows[0][c])||'Col '+(c+1)))+'</th>';}
 t+='</tr></thead><tbody>';
 for(var r=1;r<rows.length;r++){
  t+='<tr>';
  for(var c2=0;c2<maxCols;c2++){t+='<td>'+esc(String(rows[r][c2]!==undefined?rows[r][c2]:''))+'</td>';}
  t+='</tr>';
 }
 t+='</tbody></table>';
 if(aoa.length>30){t+='<p style="font-size:12px;color:#9a9aa5;margin-top:8px">Showing first 30 of '+aoa.length+' rows.</p>';}
 prevBox.innerHTML=t;
}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
document.getElementById('xpGo').onclick=async function(){
 if(!workbook){toast('Select a file first',true);return;}
 work.style.display='none';done.style.display='none';busy.style.display='block';
 pct(5);setStatus('Loading engines...');
 try{
  await loadJS(PDFLIB_SRC);
  var PDFLib=window.PDFLib;
  var pdf=await PDFLib.PDFDocument.create();
  var font=await pdf.embedFont(PDFLib.StandardFonts.Helvetica);
  var bold=await pdf.embedFont(PDFLib.StandardFonts.HelveticaBold);
  var grid=document.getElementById('xpGrid').checked;
  var boldHeader=document.getElementById('xpHeader').checked;
  var orient=document.getElementById('xpOrient').value;
  var totalSheets=sheetNames.length;
  for(var s=0;s<totalSheets;s++){
   setStatus('Converting sheet '+(s+1)+' of '+totalSheets+'...');
   var aoa=getAoa(sheetNames[s])||[];
   if(aoa.length===0){aoa=[['(empty sheet)']];}
   var maxCols=0;aoa.forEach(function(r){if(r.length>maxCols)maxCols=r.length;});
   maxCols=Math.max(1,maxCols);
   // column widths by max content length
   var colLen=[];for(var c=0;c<maxCols;c++){colLen.push(4);}
   aoa.forEach(function(r){for(var c2=0;c2<maxCols;c2++){var len=String(r[c2]!==undefined?r[c2]:'').length;if(len>colLen[c2])colLen[c2]=Math.min(len,40);}});
   var totalLen=colLen.reduce(function(a,b){return a+b;},0);
   var landscape=(orient==='landscape')||(orient==='auto'&&maxCols>5);
   var pageW=landscape?842:595,pageH=landscape?595:842;
   var margin=40;var usableW=pageW-margin*2;
   var colW=colLen.map(function(l){return Math.max(30,usableW*l/totalLen);});
   var rowH=20;var fontSize=10;
   var y=pageH-margin;
   var page=pdf.addPage([pageW,pageH]);
   // sheet title
   page.drawText(sheetNames[s],{x:margin,y:y-14,size:14,font:bold,color:PDFLib.rgb(0.13,0.45,0.27)});
   y-=34;
   function newPage(){page=pdf.addPage([pageW,pageH]);y=pageH-margin;}
   for(var r=0;r<aoa.length;r++){
    if(y<margin+rowH){newPage();}
    var isHeader=(r===0&&boldHeader);
    var rowFont=isHeader?bold:font;
    if(isHeader){page.drawRectangle({x:margin,y:y-rowH+4,width:usableW,height:rowH,color:PDFLib.rgb(0.85,0.93,0.88)});}
    var x=margin;
    for(var c3=0;c3<maxCols;c3++){
     var cell=String(aoa[r][c3]!==undefined?aoa[r][c3]:'');
     var maxW=colW[c3]-6;
     var txt=cell;
     while(font.widthOfTextAtSize(txt,fontSize)>maxW&&txt.length>1){txt=txt.slice(0,-1);}
     if(txt!==cell)txt=txt+'…';
     try{page.drawText(txt,{x:x+3,y:y-rowH+9,size:fontSize,font:rowFont,color:PDFLib.rgb(0.1,0.1,0.1)});}catch(e){}
     x+=colW[c3];
    }
    if(grid){
     page.drawLine({start:{x:margin,y:y-rowH+4},end:{x:margin+usableW,y:y-rowH+4},thickness:0.6,color:PDFLib.rgb(0.8,0.82,0.86)});
     page.drawLine({start:{x:margin,y:y+4},end:{x:margin+usableW,y:y+4},thickness:0.6,color:PDFLib.rgb(0.8,0.82,0.86)});
     var vx=margin;
     for(var c4=0;c4<=maxCols;c4++){
      page.drawLine({start:{x:vx,y:y-rowH+4},end:{x:vx,y:y+4},thickness:0.6,color:PDFLib.rgb(0.8,0.82,0.86)});
      if(c4<maxCols)vx+=colW[c4];
     }
    }
    y-=rowH;
   }
   pct(5+((s+1)/totalSheets)*85);
  }
  setStatus('Saving PDF...');
  var bytes=await pdf.save();
  pct(100);setStatus('Done!');
  setTimeout(function(){
   busy.style.display='none';done.style.display='block';
   document.getElementById('xpDoneInfo').textContent=totalSheets+' sheet(s) • '+(bytes.length/1024).toFixed(1)+' KB';
   var blob=new Blob([bytes],{type:'application/pdf'});
   var dl=document.getElementById('xpDl');
   dl.href=URL.createObjectURL(blob);
   dl.download=file.name.replace(/\.(xlsx|xls|csv)$/i,'')+'.pdf';
   toast('✓ PDF ready!');
  },300);
 }catch(err){
  busy.style.display='none';work.style.display='block';
  toast('Conversion failed: '+((err&&err.message)||err),true);
 }
};
document.getElementById('xpAgain').onclick=function(){
 done.style.display='none';pick.style.display='block';
 workbook=null;file=null;
};
})();
