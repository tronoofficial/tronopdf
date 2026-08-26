/* TronoPDF - PDF to Excel v2 | Web Worker + Concurrent + Cancel */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
var XLSX_SRC='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';

/* Web Worker for table extraction and Excel generation */
var workerCode = `
var pdfjsLib = null;
var XLSX = null;

self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');

pdfjsLib = self.pdfjsLib;
XLSX = self.XLSX;
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

function extractPage(doc, pageNum, gap) {
  return doc.getPage(pageNum).then(function(page) {
    return page.getTextContent().then(function(tc) {
      var rows = {};
      tc.items.forEach(function(it) {
        if (!it.str || !it.str.trim()) return;
        var y = Math.round(it.transform[5]);
        var key = null;
        for (var k in rows) {
          if (Math.abs(parseInt(k) - y) <= 4) { key = k; break; }
        }
        if (key === null) { key = String(y); rows[key] = []; }
        rows[key].push({x: it.transform[4], w: it.width || it.str.length * 6, str: it.str});
      });
      
      var ys = Object.keys(rows).map(Number).sort(function(a, b) { return b - a; });
      var aoa = [];
      ys.forEach(function(y) {
        var items = rows[String(y)].sort(function(a, b) { return a.x - b.x; });
        var cells = [];
        var cur = '';
        var curEnd = null;
        items.forEach(function(it) {
          if (curEnd === null) {
            cur = it.str;
            curEnd = it.x + it.w;
          } else {
            var gapX = it.x - curEnd;
            if (gapX > gap) {
              cells.push(cur.trim());
              cur = it.str;
            } else {
              cur += ' ' + it.str;
            }
            curEnd = it.x + it.w;
          }
        });
        if (cur.trim()) cells.push(cur.trim());
        if (cells.length) aoa.push(cells);
      });
      return aoa;
    });
  });
}

self.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'convert') {
    var buffer = data.buffer;
    var layout = data.layout;
    var gap = data.gap;
    
    self.postMessage({type: 'progress', percent: 5, msg: 'Loading PDF...'});
    
    pdfjsLib.getDocument({data: buffer}).promise.then(function(doc) {
      var totalPages = doc.numPages;
      var wb = XLSX.utils.book_new();
      
      self.postMessage({type: 'progress', percent: 15, msg: 'Extracting tables...'});
      
      if (layout === 'single') {
        var combined = [];
        var chain = Promise.resolve();
        
        for (var i = 1; i <= totalPages; i++) {
          (function(pageNum) {
            chain = chain.then(function() {
              var percent = 15 + (pageNum / totalPages) * 70;
              self.postMessage({
                type: 'progress',
                percent: percent,
                msg: 'Extracting page ' + pageNum + ' of ' + totalPages
              });
              return extractPage(doc, pageNum, gap).then(function(aoa) {
                combined = combined.concat(aoa, [[]]);
              });
            });
          })(i);
        }
        
        return chain.then(function() {
          self.postMessage({type: 'progress', percent: 90, msg: 'Building Excel file...'});
          var ws = XLSX.utils.aoa_to_sheet(combined);
          XLSX.utils.book_append_sheet(wb, ws, 'Data');
          return wb;
        });
      } else {
        var chain = Promise.resolve();
        var results = [];
        
        for (var j = 1; j <= totalPages; j++) {
          (function(pageNum) {
            chain = chain.then(function() {
              var percent = 15 + (pageNum / totalPages) * 70;
              self.postMessage({
                type: 'progress',
                percent: percent,
                msg: 'Extracting page ' + pageNum + ' of ' + totalPages
              });
              return extractPage(doc, pageNum, gap).then(function(aoa) {
                if (aoa.length === 0) { aoa = [['(no text)']]; }
                results.push({pageNum: pageNum, aoa: aoa});
              });
            });
          })(j);
        }
        
        return chain.then(function() {
          self.postMessage({type: 'progress', percent: 90, msg: 'Building Excel file...'});
          results.forEach(function(r) {
            var ws = XLSX.utils.aoa_to_sheet(r.aoa);
            XLSX.utils.book_append_sheet(wb, ws, 'Page ' + r.pageNum);
          });
          return wb;
        });
      }
    }).then(function(wb) {
      self.postMessage({type: 'progress', percent: 95, msg: 'Writing Excel file...'});
      var wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
      
      self.postMessage({
        type: 'complete',
        bytes: wbout,
        totalPages: wb.SheetNames.length
      });
    }).catch(function(err) {
      self.postMessage({
        type: 'error',
        msg: 'Conversion failed: ' + (err.message || err)
      });
    });
  }
};
`;

/* Create Worker */
var blob = new Blob([workerCode], {type: 'application/javascript'});
var workerUrl = URL.createObjectURL(blob);
var worker = new Worker(workerUrl);

function loadJS(src){
  return new Promise(function(res,rej){
    var s=document.createElement('script');
    s.src=src;
    s.onload=function(){res(true);};
    s.onerror=function(){rej(new Error('load fail'));};
    document.head.appendChild(s);
  });
}

var html='';
html+='<style>';
html+='.pe-wrap{max-width:1400px;margin:0 auto}';
html+='.pe-hero{text-align:center;padding:50px 16px 40px}';
html+='.pe-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.pe-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.pe-big{background:linear-gradient(135deg,#217346,#2e9159);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(33,115,70,.35)}';
html+='.pe-big:hover{transform:translateY(-2px)}';
html+='.pe-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.pe-zone{border:2px dashed transparent;border-radius:18px}';
html+='.pe-zone.on{border-color:#217346;background:#eaf7ef}';
html+='.pe-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden;padding:22px}';
html+='.pe-grid{display:grid;grid-template-columns:340px 1fr;gap:20px}';
html+='.pe-side{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px}';
html+='.pe-side h2{font-size:20px;font-weight:900;margin-bottom:6px}';
html+='.pe-sub{font-size:13px;color:#9a9aa5;margin-bottom:14px}';
html+='.pe-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}';
html+='.pe-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;background:#fff}';
html+='.pe-go{width:100%;background:linear-gradient(135deg,#217346,#2e9159);color:#fff;font-size:17px;font-weight:800;padding:16px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(33,115,70,.35);margin-top:16px}';
html+='.pe-go:active{transform:scale(.98)}';
html+='.pe-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.pe-preview{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px;overflow:auto;max-height:760px}';
html+='.pe-preview h3{font-size:16px;font-weight:900;margin-bottom:12px}';
html+='.pe-table{border-collapse:collapse;width:100%;font-size:12px}';
html+='.pe-table th,.pe-table td{border:1px solid #d5d9e2;padding:6px 8px;text-align:left;white-space:nowrap;overflow:hidden;max-width:220px;text-overflow:ellipsis}';
html+='.pe-table th{background:#217346;color:#fff;font-weight:800}';
html+='.pe-table tr:nth-child(even) td{background:#f4f7f5}';
html+='.pe-busy{display:none;text-align:center;padding:60px 20px}';
html+='.pe-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.pe-busy .st{color:#7a7a85;font-size:15px;margin-bottom:10px;min-height:20px}';
html+='.pe-busy .st2{color:#217346;font-size:13px;font-weight:700;margin-bottom:16px;min-height:18px}';
html+='.pe-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.pe-bar div{height:100%;width:0;background:linear-gradient(90deg,#217346,#2e9159);transition:width .3s}';
html+='.pe-pct{font-size:36px;font-weight:900}';
html+='.pe-cancel{margin-top:16px;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;border:none;cursor:pointer}';
html+='.pe-cancel:hover{background:#e6e8f5}';
html+='.pe-done{display:none;text-align:center;padding:50px 20px}';
html+='.pe-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.pe-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.pe-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='.pe-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);background:#16a34a;color:#fff;font-weight:800;padding:14px 28px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:all .3s;z-index:999;font-size:14px}';
html+='.pe-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}';
html+='.pe-toast.err{background:#dc2626}';
html+='@media(max-width:900px){.pe-grid{grid-template-columns:1fr}}';
html+='</style>';
html+='<div class="pe-wrap">';
html+='<div id="pePick"><div class="pe-hero"><h1>PDF to Excel</h1><p>Turn PDF tables into editable Excel spreadsheets - free & private.</p>';
html+='<div class="pe-zone" id="peZone"><button class="pe-big" id="peBtn" type="button">Select PDF file</button><p class="pe-drop-hint">or drop a PDF here</p></div></div></div>';
html+='<div class="pe-work" id="peWork"><div class="pe-grid">';
html+='<div class="pe-side"><h2>Convert settings</h2><p class="pe-sub">Runs fully in your browser</p>';
html+='<div class="pe-lbl">Sheet layout</div><select class="pe-inp" id="peLayout"><option value="perpage">One sheet per page</option><option value="single">Single combined sheet</option></select>';
html+='<div class="pe-lbl">Column gap sensitivity</div><select class="pe-inp" id="peGap"><option value="12">Normal</option><option value="8">Tight (more columns)</option><option value="20">Loose (fewer columns)</option></select>';
html+='<button class="pe-go" id="peGo" type="button">Convert to Excel →</button></div>';
html+='<div class="pe-preview"><h3>Extracted preview (Page 1)</h3><div id="pePrev"><p style="color:#9a9aa5;font-size:13px">Upload a PDF to see the extracted table.</p></div></div>';
html+='</div></div>';
html+='<div class="pe-busy" id="peBusy"><h2>Extracting tables...</h2><p class="st" id="peStatus">Working...</p><p class="st2" id="peStatus2"></p><div class="pe-bar"><div id="peBarFill"></div></div><div class="pe-pct" id="pePct">0%</div><button class="pe-cancel" id="peCancel" type="button">✕ Cancel</button></div>';
html+='<div class="pe-done" id="peDone"><div class="pe-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">Excel ready!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="peDoneInfo"></p><a class="pe-dl" id="peDl" href="#">⬇ Download .xlsx</a><button class="pe-again" id="peAgain" type="button">Convert another</button></div>';
html+='<div class="pe-toast" id="peToast"></div>';
html+='<input type="file" id="peFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;

var file=null,doc=null,allPages=[],cancelRequested=false;
var pick=document.getElementById('pePick'),work=document.getElementById('peWork'),busy=document.getElementById('peBusy'),done=document.getElementById('peDone');
var zone=document.getElementById('peZone'),btn=document.getElementById('peBtn'),inp=document.getElementById('peFile');
var prevBox=document.getElementById('pePrev');
var toastEl=document.getElementById('peToast');
var goBtn=document.getElementById('peGo');
var cancelBtn=document.getElementById('peCancel');
var statusEl=document.getElementById('peStatus');
var status2El=document.getElementById('peStatus2');

/* Worker message handler */
worker.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'progress') {
    document.getElementById('pePct').textContent = Math.round(data.percent) + '%';
    document.getElementById('peBarFill').style.width = data.percent + '%';
    statusEl.textContent = data.msg || 'Processing...';
  } else if (data.type === 'complete') {
    document.getElementById('pePct').textContent = '100%';
    document.getElementById('peBarFill').style.width = '100%';
    statusEl.textContent = 'Complete!';
    status2El.textContent = '';
    
    setTimeout(function() {
      busy.style.display = 'none';
      done.style.display = 'block';
      
      var blob = new Blob([data.bytes], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      document.getElementById('peDoneInfo').textContent = data.totalPages + ' sheet(s) • ' + (blob.size / 1024).toFixed(1) + ' KB';
      
      var dl = document.getElementById('peDl');
      dl.href = URL.createObjectURL(blob);
      dl.download = file.name.replace(/\.pdf$/i, '') + '.xlsx';
      goBtn.disabled = false;
      toast('✓ Excel ready!');
    }, 300);
  } else if (data.type === 'error') {
    busy.style.display = 'none';
    work.style.display = 'block';
    goBtn.disabled = false;
    toast(data.msg || 'Conversion failed', true);
  }
};

function toast(m,e){
  toastEl.textContent=m;
  toastEl.classList.toggle('err',!!e);
  toastEl.classList.add('show');
  clearTimeout(toastEl.__h);
  toastEl.__h=setTimeout(function(){toastEl.classList.remove('show');},2200);
}

function pct(p){
  document.getElementById('pePct').textContent=Math.round(p)+'%';
  document.getElementById('peBarFill').style.width=p+'%';
}

function setStatus(s){statusEl.textContent=s;}
function setStatus2(s){status2El.textContent=s||'';}

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

btn.onclick=function(){inp.click();};

function loadFile(f){
  if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){
    toast('Please select a PDF file',true);
    return;
  }
  file=f;
  
  loadJS(PDFJS_SRC).then(function(){
    window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
    return f.arrayBuffer();
  }).then(function(b){
    return window.pdfjsLib.getDocument({data:b}).promise;
  }).then(function(d){
    doc=d;
    setStatus('Extracting preview...');
    setStatus2('Page 1 of ' + d.numPages);
    
    return doc.getPage(1).then(function(page){
      return page.getTextContent().then(function(tc){
        var gap=parseInt(document.getElementById('peGap').value)||12;
        var rows={};
        tc.items.forEach(function(it){
          if(!it.str||!it.str.trim())return;
          var y=Math.round(it.transform[5]);
          var key=null;
          for(var k in rows){if(Math.abs(parseInt(k)-y)<=4){key=k;break;}}
          if(key===null){key=String(y);rows[key]=[];}
          rows[key].push({x:it.transform[4],w:it.width||it.str.length*6,str:it.str});
        });
        
        var ys=Object.keys(rows).map(Number).sort(function(a,b){return b-a;});
        var aoa=[];
        ys.forEach(function(y){
          var items=rows[String(y)].sort(function(a,b){return a.x-b.x;});
          var cells=[];var cur='';var curEnd=null;
          items.forEach(function(it){
            if(curEnd===null){cur=it.str;curEnd=it.x+it.w;}
            else{
              var gapX=it.x-curEnd;
              if(gapX>gap){cells.push(cur.trim());cur=it.str;}
              else{cur+=' '+it.str;}
              curEnd=it.x+it.w;
            }
          });
          if(cur.trim())cells.push(cur.trim());
          if(cells.length)aoa.push(cells);
        });
        
        allPages=[aoa];
        pick.style.display='none';
        done.style.display='none';
        work.style.display='block';
        renderPreview(aoa);
        setStatus('');
        setStatus2('');
        toast('✓ PDF loaded ('+d.numPages+' pages)');
      });
    });
  }).catch(function(e){
    pick.style.display='block';
    toast('Could not read PDF',true);
  });
}

function renderPreview(aoa){
  var rows=aoa.slice(0,30);
  var maxCols=0;
  rows.forEach(function(r){if(r.length>maxCols)maxCols=r.length;});
  maxCols=Math.min(maxCols,8);
  
  var t='<table class="pe-table"><thead><tr>';
  for(var c=0;c<maxCols;c++){t+='<th>'+(rows[0]?esc(rows[0][c]||''):'')+'</th>';}
  t+='</tr></thead><tbody>';
  for(var r=1;r<rows.length;r++){
    t+='<tr>';
    for(var c2=0;c2<maxCols;c2++){t+='<td>'+esc(rows[r][c2]!==undefined?rows[r][c2]:'')+'</td>';}
    t+='</tr>';
  }
  t+='</tbody></table>';
  if(aoa.length>30){t+='<p style="font-size:12px;color:#9a9aa5;margin-top:8px">Showing first 30 of '+aoa.length+' rows.</p>';}
  prevBox.innerHTML=t;
}

inp.onchange=function(){if(inp.files[0]){loadFile(inp.files[0]);}inp.value='';};

zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){
  e.preventDefault();
  zone.classList.remove('on');
  if(e.dataTransfer.files[0]){loadFile(e.dataTransfer.files[0]);}
};

goBtn.onclick=function(){
  if(!file||!doc){toast('Select a PDF first',true);return;}
  
  work.style.display='none';
  done.style.display='none';
  busy.style.display='block';
  
  document.getElementById('pePct').textContent='0%';
  document.getElementById('peBarFill').style.width='0%';
  setStatus('Starting conversion...');
  setStatus2('');
  cancelRequested=false;
  goBtn.disabled=true;
  
  var layout=document.getElementById('peLayout').value;
  var gap=parseInt(document.getElementById('peGap').value)||12;
  
  file.arrayBuffer().then(function(buf){
    if(cancelRequested){
      busy.style.display='none';
      work.style.display='block';
      goBtn.disabled=false;
      return;
    }
    
    worker.postMessage({
      type: 'convert',
      buffer: buf,
      layout: layout,
      gap: gap
    }, [buf]); /* Transfer ArrayBuffer for zero-copy */
  }).catch(function(err){
    busy.style.display='none';
    work.style.display='block';
    goBtn.disabled=false;
    toast('Error reading file: '+err.message,true);
  });
};

cancelBtn.onclick=function(){
  cancelRequested=true;
  setStatus('Cancelling...');
  setStatus2('');
  worker.terminate();
  
  /* Recreate worker for next use */
  var blob = new Blob([workerCode], {type: 'application/javascript'});
  var workerUrl = URL.createObjectURL(blob);
  worker = new Worker(workerUrl);
  
  /* Reattach message handler */
  worker.onmessage = function(e) {
    var data = e.data;
    if (data.type === 'progress') {
      document.getElementById('pePct').textContent = Math.round(data.percent) + '%';
      document.getElementById('peBarFill').style.width = data.percent + '%';
      statusEl.textContent = data.msg || 'Processing...';
    } else if (data.type === 'complete') {
      document.getElementById('pePct').textContent = '100%';
      document.getElementById('peBarFill').style.width = '100%';
      statusEl.textContent = 'Complete!';
      status2El.textContent = '';
      setTimeout(function() {
        busy.style.display = 'none';
        done.style.display = 'block';
        var blob = new Blob([data.bytes], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        document.getElementById('peDoneInfo').textContent = data.totalPages + ' sheet(s) • ' + (blob.size / 1024).toFixed(1) + ' KB';
        var dl = document.getElementById('peDl');
        dl.href = URL.createObjectURL(blob);
        dl.download = file.name.replace(/\.pdf$/i, '') + '.xlsx';
        goBtn.disabled = false;
        toast('✓ Excel ready!');
      }, 300);
    } else if (data.type === 'error') {
      busy.style.display = 'none';
      work.style.display = 'block';
      goBtn.disabled = false;
      toast(data.msg || 'Conversion failed', true);
    }
  };
  
  busy.style.display='none';
  work.style.display='block';
  goBtn.disabled=false;
  toast('Conversion cancelled',true);
};

document.getElementById('peAgain').onclick=function(){
  done.style.display='none';
  pick.style.display='block';
  doc=null;
  file=null;
  allPages=[];
};

})();
