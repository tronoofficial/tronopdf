/* TronoPDF - PDF to Markdown v1 | heading/list detection via font-size heuristics */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
function loadJS(src){return new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=function(){res(true);};s.onerror=function(){rej(new Error('load fail'));};document.head.appendChild(s);});}
var html='';
html+='<style>';
html+='.md-wrap{max-width:1300px;margin:0 auto}';
html+='.md-hero{text-align:center;padding:50px 16px 40px}';
html+='.md-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.md-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.md-big{background:linear-gradient(135deg,#334155,#475569);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(51,65,85,.35)}';
html+='.md-big:hover{transform:translateY(-2px)}';
html+='.md-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.md-zone{border:2px dashed transparent;border-radius:18px}';
html+='.md-zone.on{border-color:#334155;background:#eef2f7}';
html+='.md-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden;padding:22px}';
html+='.md-grid{display:grid;grid-template-columns:340px 1fr;gap:20px}';
html+='.md-side{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px}';
html+='.md-side h2{font-size:20px;font-weight:900;margin-bottom:6px}';
html+='.md-sub{font-size:13px;color:#9a9aa5;margin-bottom:14px}';
html+='.md-chk{display:flex;gap:8px;align-items:center;margin:8px 0}';
html+='.md-chk input{width:16px;height:16px;accent-color:#334155}';
html+='.md-chk label{font-size:13px;font-weight:600;cursor:pointer}';
html+='.md-go{width:100%;background:linear-gradient(135deg,#334155,#475569);color:#fff;font-size:17px;font-weight:800;padding:16px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(51,65,85,.35);margin-top:14px}';
html+='.md-go:active{transform:scale(.98)}';
html+='.md-out{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px;display:flex;flex-direction:column;min-height:400px}';
html+='.md-out h3{font-size:16px;font-weight:900;margin-bottom:10px}';
html+='.md-text{flex:1;min-height:340px;width:100%;border:1px solid #eceaf6;border-radius:10px;padding:14px;font-size:13px;line-height:1.6;resize:vertical;font-family:Consolas,Monaco,monospace;background:#0f172a;color:#e2e8f0;white-space:pre-wrap}';
html+='.md-actions{display:flex;gap:8px;margin-top:12px}';
html+='.md-actions button{flex:1;border:none;border-radius:10px;padding:13px;font-size:14px;font-weight:800;cursor:pointer}';
html+='.md-actions button:active{transform:scale(.96)}';
html+='.md-copy{background:#7c3aed;color:#fff}';
html+='.md-dl{background:#16a34a;color:#fff}';
html+='.md-busy{display:none;text-align:center;padding:60px 20px}';
html+='.md-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.md-busy .st{color:#7a7a85;font-size:15px;margin-bottom:26px}';
html+='.md-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.md-bar div{height:100%;width:0;background:linear-gradient(90deg,#334155,#475569);transition:width .3s}';
html+='.md-pct{font-size:36px;font-weight:900}';
html+='.md-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);background:#16a34a;color:#fff;font-weight:800;padding:14px 28px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:all .3s;z-index:999;font-size:14px}';
html+='.md-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}';
html+='.md-toast.err{background:#dc2626}';
html+='@media(max-width:900px){.md-grid{grid-template-columns:1fr}}';
html+='</style>';
html+='<div class="md-wrap">';
html+='<div id="mdPick"><div class="md-hero"><h1>PDF to Markdown</h1><p>Clean Markdown from any PDF - headings, lists & structure preserved.</p>';
html+='<div class="md-zone" id="mdZone"><button class="md-big" id="mdBtn" type="button">Select PDF file</button><p class="md-drop-hint">or drop a PDF here</p></div></div></div>';
html+='<div class="md-work" id="mdWork"><div class="md-grid">';
html+='<div class="md-side"><h2>Convert settings</h2><p class="md-sub">Runs fully in your browser</p>';
html+='<div class="md-chk"><input type="checkbox" id="mdHeadings" checked/><label for="mdHeadings">Detect headings (#, ##, ###)</label></div>';
html+='<div class="md-chk"><input type="checkbox" id="mdLists" checked/><label for="mdLists">Detect bullet & numbered lists</label></div>';
html+='<div class="md-chk"><input type="checkbox" id="mdPages" checked/><label for="mdPages">Add page separators</label></div>';
html+='<button class="md-go" id="mdGo" type="button">Convert to Markdown →</button></div>';
html+='<div class="md-out"><h3>Markdown output</h3><textarea class="md-text" id="mdText" placeholder="# Your Markdown will appear here..."></textarea><div class="md-actions"><button class="md-copy" id="mdCopy" type="button">📋 Copy</button><button class="md-dl" id="mdDl" type="button">⬇ Download .md</button></div></div>';
html+='</div></div>';
html+='<div class="md-busy" id="mdBusy"><h2>Converting to Markdown...</h2><p class="st" id="mdStatus">Working...</p><div class="md-bar"><div id="mdBarFill"></div></div><div class="md-pct" id="mdPct">0%</div></div>';
html+='<div class="md-toast" id="mdToast"></div>';
html+='<input type="file" id="mdFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var file=null,doc=null;
var pick=document.getElementById('mdPick'),work=document.getElementById('mdWork'),busy=document.getElementById('mdBusy');
var zone=document.getElementById('mdZone'),btn=document.getElementById('mdBtn'),inp=document.getElementById('mdFile');
var outEl=document.getElementById('mdText');
var toastEl=document.getElementById('mdToast');
function toast(m,e){toastEl.textContent=m;toastEl.classList.toggle('err',!!e);toastEl.classList.add('show');clearTimeout(toastEl.__h);toastEl.__h=setTimeout(function(){toastEl.classList.remove('show');},2200);}
function pct(p){document.getElementById('mdPct').textContent=Math.round(p)+'%';document.getElementById('mdBarFill').style.width=p+'%';}
function setStatus(s){document.getElementById('mdStatus').textContent=s;}
btn.onclick=function(){inp.click();};
function loadFile(f){
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){toast('Please select a PDF file',true);return;}
 file=f;
 loadJS(PDFJS_SRC).then(function(){
  window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
  return f.arrayBuffer();
 }).then(function(b){return window.pdfjsLib.getDocument({data:b}).promise;}).then(function(d){
  doc=d;
  pick.style.display='none';work.style.display='block';busy.style.display='none';
  toast('✓ PDF loaded ('+d.numPages+' pages)');
 }).catch(function(){pick.style.display='block';toast('Could not read PDF',true);});
}
inp.onchange=function(){if(inp.files[0]){loadFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){loadFile(e.dataTransfer.files[0]);}};
function pageToLines(tc){
 var rows={};
 tc.items.forEach(function(it){
  if(!it.str||!it.str.trim())return;
  var y=Math.round(it.transform[5]);
  var h=Math.round(it.height||12);
  var key=null;
  for(var k in rows){if(Math.abs(parseInt(k)-y)<=4){key=k;break;}}
  if(key===null){key=String(y);rows[key]={items:[],h:h};}
  rows[key].items.push({x:it.transform[4],str:it.str});
  if(h>rows[key].h)rows[key].h=h;
 });
 var ys=Object.keys(rows).map(Number).sort(function(a,b){return b-a;});
 var lines=[];
 ys.forEach(function(y){
  var r=rows[String(y)];
  var text=r.items.sort(function(a,b){return a.x-b.x;}).map(function(i){return i.str;}).join(' ').replace(/\s+/g,' ').trim();
  if(text)lines.push({text:text,h:r.h});
 });
 return lines;
}
function toMarkdown(lines,opts){
 // body size = most common height
 var freq={};lines.forEach(function(l){freq[l.h]=(freq[l.h]||0)+1;});
 var body=12,max=0;for(var k in freq){if(freq[k]>max){max=freq[k];body=parseInt(k);}}
 var md=[];
 lines.forEach(function(l){
  var t=l.text;
  var isBullet=/^[•▪◦‣]\s*/.test(t)||/^[-–—]\s+/.test(t);
  var isNum=/^\d+[.)]\s+/.test(t);
  if(opts.lists&&isBullet){md.push('- '+t.replace(/^[•▪◦‣]\s*/,'').replace(/^[-–—]\s+/,''));return;}
  if(opts.lists&&isNum){md.push(t);return;}
  if(opts.headings){
   if(l.h>=body*1.6){md.push('\n# '+t+'\n');return;}
   if(l.h>=body*1.35){md.push('\n## '+t+'\n');return;}
   if(l.h>=body*1.15&&t.length<80){md.push('\n### '+t+'\n');return;}
  }
  md.push(t+'\n');
 });
 return md.join('');
}
document.getElementById('mdGo').onclick=async function(){
 if(!file||!doc){toast('Select a PDF first',true);return;}
 work.style.display='none';busy.style.display='block';
 outEl.value='';
 pct(3);setStatus('Loading engine...');
 var opts={
  headings:document.getElementById('mdHeadings').checked,
  lists:document.getElementById('mdLists').checked,
  pages:document.getElementById('mdPages').checked
 };
 try{
  var totalPages=doc.numPages;
  var full='';
  for(var i=1;i<=totalPages;i++){
   setStatus('Converting page '+i+' of '+totalPages+'...');
   var pg=await doc.getPage(i);
   var tc=await pg.getTextContent();
   var lines=pageToLines(tc);
   var md=toMarkdown(lines,opts);
   if(opts.pages){full+='\n\n---\n<!-- Page '+i+' -->\n\n';}
   full+=md;
   outEl.value=full;
   pct(5+(i/totalPages)*90);
  }
  pct(100);setStatus('Done!');
  setTimeout(function(){
   busy.style.display='none';work.style.display='block';
   toast('✓ Markdown ready!');
  },300);
 }catch(err){
  busy.style.display='none';work.style.display='block';
  toast('Conversion failed: '+((err&&err.message)||err),true);
 }
};
document.getElementById('mdCopy').onclick=function(){
 var t=outEl.value;
 if(!t){toast('No Markdown yet',true);return;}
 if(navigator.clipboard){navigator.clipboard.writeText(t).then(function(){toast('✓ Copied!');});}
 else{outEl.select();try{document.execCommand('copy');toast('✓ Copied!');}catch(e){}}
};
document.getElementById('mdDl').onclick=function(){
 var t=outEl.value;
 if(!t){toast('No Markdown yet',true);return;}
 var blob=new Blob([t],{type:'text/markdown'});
 var a=document.createElement('a');a.href=URL.createObjectURL(blob);
 a.download=(file?file.name.replace(/\.pdf$/i,''):'document')+'.md';
 document.body.appendChild(a);a.click();document.body.removeChild(a);
 toast('⬇ Download started!');
};
})();
