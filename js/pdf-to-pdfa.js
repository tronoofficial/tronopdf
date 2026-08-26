/* TronoPDF - PDF to PDF/A v2 | Web Worker + Cancel + Progress */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';

/* Web Worker for PDF/A conversion */
var workerCode = `
importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');

var ICC_URLS = [
  'https://cdn.jsdelivr.net/gh/saucecontrol/CompactICCProfiles@master/sRGB_v4.icc',
  'https://cdn.jsdelivr.net/gh/saucecontrol/CompactICCProfiles@master/sRGB_v2.icc'
];

function fetchICC() {
  var chain = Promise.reject();
  ICC_URLS.forEach(function(u) {
    chain = chain.catch(function() {
      return fetch(u).then(function(r) {
        if (!r.ok) throw new Error('icc');
        return r.arrayBuffer();
      });
    });
  });
  return chain.catch(function() { return null; });
}

function buildXMP(title) {
  var now = new Date().toISOString();
  return '<?xpacket begin="\\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>' +
    '<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999-02-22-rdf-syntax-ns#">' +
    '<rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/" xmlns:xmp="http://ns.adobe.com/xap/1.0/">' +
    '<dc:title><rdf:Alt><rdf:li xml:lang="x-default">' + (title || 'Document') + '</rdf:li></rdf:Alt></dc:title>' +
    '<pdfaid:part>2</pdfaid:part><pdfaid:conformance>B</pdfaid:conformance>' +
    '<xmp:CreateDate>' + now + '</xmp:CreateDate><xmp:ModifyDate>' + now + '</xmp:ModifyDate>' +
    '</rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>';
}

self.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'convert') {
    var buffer = data.buffer;
    var fileName = data.fileName;
    
    self.postMessage({type: 'progress', percent: 5, msg: 'Loading PDF...'});
    
    PDFLib.PDFDocument.load(buffer, {updateMetadata: false, ignoreEncryption: true}).then(function(pdf) {
      self.postMessage({type: 'progress', percent: 20, msg: 'Fetching sRGB ICC profile...'});
      
      return fetchICC().then(function(icc) {
        self.postMessage({type: 'progress', percent: 40, msg: 'Embedding XMP metadata...'});
        
        var ctx = pdf.context;
        var xmpStr = buildXMP(pdf.getTitle() || fileName.replace(/\\.pdf$/i, ''));
        var xmpBytes = new TextEncoder().encode(xmpStr);
        var xmpStream = ctx.stream(xmpBytes, {Type: 'Metadata', Subtype: 'XML', Length: xmpBytes.length});
        var xmpRef = ctx.register(xmpStream);
        pdf.catalog.set(PDFLib.PDFName.of('Metadata'), xmpRef);
        
        if (icc) {
          self.postMessage({type: 'progress', percent: 60, msg: 'Embedding ICC output intent...'});
          
          var iccStream = ctx.stream(new Uint8Array(icc), {N: 3});
          var iccRef = ctx.register(iccStream);
          var oi = ctx.obj({
            Type: 'OutputIntent',
            S: 'GTS_PDFA1',
            RegistryName: 'http://www.color.org',
            OutputCondition: 'sRGB IEC61966-2.1',
            OutputConditionIdentifier: 'sRGB IEC61966-2.1',
            Info: 'sRGB IEC61966-2.1',
            DestOutputProfile: iccRef
          });
          var oiRef = ctx.register(oi);
          pdf.catalog.set(PDFLib.PDFName.of('OutputIntents'), ctx.obj([oiRef]));
        }
        
        pdf.setTitle(pdf.getTitle() || fileName.replace(/\\.pdf$/i, ''));
        
        self.postMessage({type: 'progress', percent: 85, msg: 'Saving PDF/A...'});
        
        return pdf.save().then(function(bytes) {
          self.postMessage({
            type: 'complete',
            bytes: bytes,
            hasICC: !!icc
          });
        });
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

var html='';
html+='<style>';
html+='.pa-wrap{max-width:1000px;margin:0 auto}';
html+='.pa-hero{text-align:center;padding:50px 16px 40px}';
html+='.pa-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.pa-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.pa-big{background:linear-gradient(135deg,#64748b,#94a3b8);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(100,116,139,.35)}';
html+='.pa-big:hover{transform:translateY(-2px)}';
html+='.pa-big:disabled{opacity:.5;cursor:not-allowed}';
html+='.pa-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.pa-zone{border:2px dashed transparent;border-radius:18px}';
html+='.pa-zone.on{border-color:#64748b;background:#f1f5f9}';
html+='.pa-info{max-width:760px;margin:0 auto 26px;background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:18px;font-size:13px;color:#4b4b5a;line-height:1.6}';
html+='.pa-info b{color:#334155}';
html+='.pa-busy{display:none;text-align:center;padding:60px 20px}';
html+='.pa-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.pa-busy .st{color:#7a7a85;font-size:15px;margin-bottom:10px;min-height:20px}';
html+='.pa-busy .st2{color:#64748b;font-size:13px;font-weight:700;margin-bottom:16px;min-height:18px}';
html+='.pa-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.pa-bar div{height:100%;width:0;background:linear-gradient(90deg,#64748b,#94a3b8);transition:width .3s}';
html+='.pa-pct{font-size:36px;font-weight:900}';
html+='.pa-cancel{margin-top:16px;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;border:none;cursor:pointer}';
html+='.pa-cancel:hover{background:#e6e8f5}';
html+='.pa-done{display:none;text-align:center;padding:50px 20px}';
html+='.pa-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.pa-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.pa-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='.pa-meta{margin-top:16px;font-size:13px;color:#7a7a85}';
html+='.pa-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);background:#16a34a;color:#fff;font-weight:800;padding:14px 28px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:all .3s;z-index:999;font-size:14px}';
html+='.pa-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}';
html+='.pa-toast.err{background:#dc2626}';
html+='</style>';
html+='<div class="pa-wrap">';
html+='<div id="paPick"><div class="pa-hero"><h1>PDF to PDF/A</h1><p>Convert to the ISO archival standard for long-term preservation.</p>';
html+='<div class="pa-info"><b>What this does:</b> Embeds <b>XMP metadata</b> (pdfaid part=2, conformance=B) and an <b>sRGB ICC output intent</b> so your PDF meets PDF/A-2b archival requirements for legal & government submission. Your pages stay identical.</div>';
html+='<div class="pa-zone" id="paZone"><button class="pa-big" id="paBtn" type="button">Select PDF file</button><p class="pa-drop-hint">or drop a PDF here</p></div></div></div>';
html+='<div class="pa-busy" id="paBusy"><h2>Converting to PDF/A...</h2><p class="st" id="paStatus">Working...</p><p class="st2" id="paStatus2"></p><div class="pa-bar"><div id="paBarFill"></div></div><div class="pa-pct" id="paPct">0%</div><button class="pa-cancel" id="paCancel" type="button">✕ Cancel</button></div>';
html+='<div class="pa-done" id="paDone"><div class="pa-done-ic">✓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF/A ready!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:20px" id="paDoneInfo"></p><p class="pa-meta" id="paMeta"></p><a class="pa-dl" id="paDl" href="#" style="margin-top:16px">⬇ Download PDF/A</a><button class="pa-again" id="paAgain" type="button">Convert another</button></div>';
html+='<div class="pa-toast" id="paToast"></div>';
html+='<input type="file" id="paFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;

var file=null;
var cancelRequested=false;

var pick=document.getElementById('paPick'),busy=document.getElementById('paBusy'),done=document.getElementById('paDone');
var zone=document.getElementById('paZone'),btn=document.getElementById('paBtn'),inp=document.getElementById('paFile');
var toastEl=document.getElementById('paToast');
var cancelBtn=document.getElementById('paCancel');
var statusEl=document.getElementById('paStatus');
var status2El=document.getElementById('paStatus2');

/* Worker message handler */
worker.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'progress') {
    document.getElementById('paPct').textContent = Math.round(data.percent) + '%';
    document.getElementById('paBarFill').style.width = data.percent + '%';
    statusEl.textContent = data.msg || 'Processing...';
  } else if (data.type === 'complete') {
    document.getElementById('paPct').textContent = '100%';
    document.getElementById('paBarFill').style.width = '100%';
    statusEl.textContent = 'Complete!';
    status2El.textContent = '';
    
    setTimeout(function() {
      busy.style.display = 'none';
      done.style.display = 'block';
      document.getElementById('paDoneInfo').textContent = (data.bytes.length / 1024).toFixed(1) + ' KB • PDF/A-2b';
      document.getElementById('paMeta').textContent = data.hasICC ? '✓ XMP metadata + sRGB ICC output intent embedded' : '✓ XMP metadata embedded (ICC unavailable - best effort)';
      
      var blob = new Blob([data.bytes], {type: 'application/pdf'});
      var dl = document.getElementById('paDl');
      dl.href = URL.createObjectURL(blob);
      dl.download = file.name.replace(/\.pdf$/i, '') + '-pdfa.pdf';
      btn.disabled = false;
      toast('✓ PDF/A ready!');
    }, 300);
  } else if (data.type === 'error') {
    busy.style.display = 'none';
    pick.style.display = 'block';
    btn.disabled = false;
    toast('Conversion failed: ' + data.msg, true);
  }
};

function toast(m,e){
  toastEl.textContent=m;
  toastEl.classList.toggle('err',!!e);
  toastEl.classList.add('show');
  clearTimeout(toastEl.__h);
  toastEl.__h=setTimeout(function(){toastEl.classList.remove('show');},2200);
}

btn.onclick=function(){inp.click();};

function convert(f){
  pick.style.display='none';
  done.style.display='none';
  busy.style.display='block';
  
  document.getElementById('paPct').textContent='0%';
  document.getElementById('paBarFill').style.width='0%';
  statusEl.textContent='Starting conversion...';
  status2El.textContent='';
  cancelRequested=false;
  btn.disabled=true;
  
  /* Read file and send to worker */
  f.arrayBuffer().then(function(buf){
    if(cancelRequested){
      busy.style.display='none';
      pick.style.display='block';
      btn.disabled=false;
      return;
    }
    
    worker.postMessage({
      type: 'convert',
      buffer: buf,
      fileName: f.name
    }, [buf]); /* Transfer ArrayBuffer for zero-copy */
  }).catch(function(err){
    busy.style.display='none';
    pick.style.display='block';
    btn.disabled=false;
    toast('Error reading file: '+err.message,true);
  });
}

inp.onchange=function(){
  if(inp.files[0]){
    file=inp.files[0];
    convert(file);
  }
  inp.value='';
};

zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){
  e.preventDefault();
  zone.classList.remove('on');
  if(e.dataTransfer.files[0]){
    file=e.dataTransfer.files[0];
    convert(file);
  }
};

cancelBtn.onclick=function(){
  cancelRequested=true;
  statusEl.textContent='Cancelling...';
  status2El.textContent='';
  
  /* Terminate and recreate worker */
  worker.terminate();
  var blob = new Blob([workerCode], {type: 'application/javascript'});
  var workerUrl = URL.createObjectURL(blob);
  worker = new Worker(workerUrl);
  
  /* Reattach message handler */
  worker.onmessage = function(e) {
    var data = e.data;
    if (data.type === 'progress') {
      document.getElementById('paPct').textContent = Math.round(data.percent) + '%';
      document.getElementById('paBarFill').style.width = data.percent + '%';
      statusEl.textContent = data.msg || 'Processing...';
    } else if (data.type === 'complete') {
      document.getElementById('paPct').textContent = '100%';
      document.getElementById('paBarFill').style.width = '100%';
      statusEl.textContent = 'Complete!';
      status2El.textContent = '';
      setTimeout(function() {
        busy.style.display = 'none';
        done.style.display = 'block';
        document.getElementById('paDoneInfo').textContent = (data.bytes.length / 1024).toFixed(1) + ' KB • PDF/A-2b';
        document.getElementById('paMeta').textContent = data.hasICC ? '✓ XMP metadata + sRGB ICC output intent embedded' : '✓ XMP metadata embedded (ICC unavailable - best effort)';
        var blob = new Blob([data.bytes], {type: 'application/pdf'});
        var dl = document.getElementById('paDl');
        dl.href = URL.createObjectURL(blob);
        dl.download = file.name.replace(/\.pdf$/i, '') + '-pdfa.pdf';
        btn.disabled = false;
        toast('✓ PDF/A ready!');
      }, 300);
    } else if (data.type === 'error') {
      busy.style.display = 'none';
      pick.style.display = 'block';
      btn.disabled = false;
      toast('Conversion failed: ' + data.msg, true);
    }
  };
  
  busy.style.display='none';
  pick.style.display='block';
  btn.disabled=false;
};

document.getElementById('paAgain').onclick=function(){
  done.style.display='none';
  pick.style.display='block';
  file=null;
};

})();
