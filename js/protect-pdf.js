/* TronoPDF - Protect PDF v4 | Web Worker + Lazy Load + Cancel */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

var MUPDF_URLS=[
  'https://cdn.jsdelivr.net/npm/mupdf@0.3.0/dist/mupdf.js',
  'https://unpkg.com/mupdf@0.3.0/dist/mupdf.js',
  'https://cdn.jsdelivr.net/npm/mupdf@1.28.0/dist/mupdf.js'
];

/* Web Worker for PDF encryption */
var workerCode = `
var mupdfModule = null;
var mupdfLoading = null;

function loadMupdf() {
  if (mupdfModule) { return Promise.resolve(mupdfModule); }
  if (mupdfLoading) { return mupdfLoading; }
  
  var urls = [
    'https://cdn.jsdelivr.net/npm/mupdf@0.3.0/dist/mupdf.js',
    'https://unpkg.com/mupdf@0.3.0/dist/mupdf.js',
    'https://cdn.jsdelivr.net/npm/mupdf@1.28.0/dist/mupdf.js'
  ];
  
  mupdfLoading = new Promise(function(resolve, reject) {
    var i = 0;
    function tryNext() {
      if (i >= urls.length) {
        reject(new Error('Could not load security engine from any CDN'));
        return;
      }
      var url = urls[i++];
      self.postMessage({type: 'progress', percent: 15, msg: 'Loading security engine from CDN...'});
      
      import(url).then(function(m) {
        mupdfModule = m;
        resolve(m);
      }).catch(function() {
        tryNext();
      });
    }
    tryNext();
  });
  
  return mupdfLoading;
}

function buildOptionSets(pw, ow, permStr) {
  var sets = [];
  var encs = ['aes-256', 'aes-128'];
  for (var e = 0; e < encs.length; e++) {
    sets.push('encrypt=' + encs[e] + ',user-password=' + pw + ',owner-password=' + ow + ',permissions=' + permStr);
    sets.push('encrypt=' + encs[e] + ',user-password=' + pw + ',owner-password=' + ow);
  }
  return sets;
}

self.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'protect') {
    var buffer = data.buffer;
    var pw = data.password;
    var owner = data.ownerPassword || pw;
    var perms = data.permissions;
    
    self.postMessage({type: 'progress', percent: 5, msg: 'Starting encryption...'});
    
    loadMupdf().then(function(m) {
      self.postMessage({type: 'progress', percent: 25, msg: 'Loading PDF...'});
      
      var doc = m.Document.openDocument(new Uint8Array(buffer), 'application/pdf');
      
      self.postMessage({type: 'progress', percent: 35, msg: 'Applying encryption...'});
      
      var permStr = perms.length ? perms.join(',') : 'none';
      var sets = buildOptionSets(pw, owner, permStr);
      var outBytes = null;
      
      for (var i = 0; i < sets.length; i++) {
        try {
          var buf = doc.saveToBuffer(sets[i]);
          var bytes = buf.asUint8Array();
          if (bytes && bytes.length > 0) {
            outBytes = bytes;
            break;
          }
        } catch(e) {
          outBytes = null;
        }
      }
      
      if (!outBytes) {
        throw new Error('Encryption failed');
      }
      
      self.postMessage({type: 'progress', percent: 75, msg: 'Verifying encryption...'});
      
      var chk = m.Document.openDocument(outBytes, 'application/pdf');
      var locked = false;
      try {
        locked = chk.needsPassword();
      } catch(e) {}
      
      if (!locked) {
        throw new Error('Verification failed - password not applied');
      }
      
      self.postMessage({type: 'progress', percent: 95, msg: 'Finalizing...'});
      
      self.postMessage({
        type: 'complete',
        bytes: outBytes,
        pages: doc.countPages()
      });
    }).catch(function(err) {
      self.postMessage({
        type: 'error',
        msg: 'Could not protect PDF: ' + (err.message || err)
      });
    });
  }
};
`;

/* Create Worker */
var blob = new Blob([workerCode], {type: 'application/javascript'});
var workerUrl = URL.createObjectURL(blob);
var worker = new Worker(workerUrl);

function fmtB(n){return n<1024?n+' B':(n<1048576)?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}

function strength(p){
  if(!p){return{s:0,l:'—',c:'#9a9aa5'};}
  var score=0;
  if(p.length>=8)score++;
  if(p.length>=12)score++;
  if(/[a-z]/.test(p)&&/[A-Z]/.test(p))score++;
  if(/\d/.test(p))score++;
  if(/[^a-zA-Z0-9]/.test(p))score++;
  var levels=[{l:'Very weak',c:'#dc2626'},{l:'Weak',c:'#f59e0b'},{l:'Fair',c:'#f59e0b'},{l:'Strong',c:'#22c55e'},{l:'Very strong',c:'#16a34a'},{l:'Excellent',c:'#059669'}];
  return {s:score,l:levels[score].l,c:levels[score].c};
}

var html='';
html+='<style>';
html+='.pt-wrap{max-width:1400px;margin:0 auto}';
html+='.pt-hero{text-align:center;padding:50px 16px 40px}';
html+='.pt-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.pt-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.pt-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.pt-big:hover{transform:translateY(-2px)}';
html+='.pt-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.pt-zone{border:2px dashed transparent;border-radius:18px}';
html+='.pt-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.pt-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.pt-main{display:flex;min-height:560px}';
html+='.pt-prev{flex:1;padding:40px;display:flex;align-items:center;justify-content:center}';
html+='.pt-card{background:#fff;border:1px solid #eceaf6;border-radius:14px;padding:28px;text-align:center;box-shadow:0 4px 20px rgba(30,20,60,.06);width:420px;max-width:100%}';
html+='.pt-icon{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:40px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}';
html+='.pt-nm{font-size:14px;font-weight:700;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}';
html+='.pt-mt{font-size:13px;color:#9a9aa5}';
html+='.pt-side{width:420px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.pt-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:6px}';
html+='.pt-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:18px}';
html+='.pt-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}';
html+='.pt-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;font-family:inherit;background:#fff}';
html+='.pt-pw-wrap{position:relative}';
html+='.pt-pw-wrap input{padding-right:44px}';
html+='.pt-pw-toggle{position:absolute;right:10px;top:50%;transform:translateY(-50%);border:none;background:none;font-size:16px;cursor:pointer;color:#9a9aa5;padding:4px 6px}';
html+='.pt-meter{height:6px;border-radius:999px;background:#eceaf6;margin-top:6px;overflow:hidden}';
html+='.pt-meter div{height:100%;width:0;transition:width .3s,background .3s}';
html+='.pt-meter-lbl{font-size:11px;font-weight:800;margin-top:4px}';
html+='.pt-err{display:none;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:12px 14px;font-size:13px;color:#dc2626;font-weight:600;margin-top:10px}';
html+='.pt-adv{margin-top:14px;border:1px solid #eceaf6;border-radius:10px;padding:10px 14px;background:#fafbfe}';
html+='.pt-adv summary{font-size:13px;font-weight:800;color:#7c3aed;cursor:pointer}';
html+='.pt-adv[open] summary{margin-bottom:8px}';
html+='.pt-chk{display:flex;gap:8px;align-items:center;margin:6px 0}';
html+='.pt-chk input{width:16px;height:16px;accent-color:#7c3aed}';
html+='.pt-chk label{font-size:13px;font-weight:600;cursor:pointer;flex:1}';
html+='.pt-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:16px}';
html+='.pt-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.pt-busy{display:none;padding:60px 20px;text-align:center}';
html+='.pt-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.pt-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:10px}';
html+='.pt-busy .st{color:#7c3aed;font-size:13px;font-weight:700;margin-bottom:16px;min-height:18px}';
html+='.pt-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.pt-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .3s}';
html+='.pt-pct{font-size:36px;font-weight:900}';
html+='.pt-cancel{margin-top:16px;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;border:none;cursor:pointer}';
html+='.pt-cancel:hover{background:#e6e8f5}';
html+='.pt-done{display:none;text-align:center;padding:50px 20px}';
html+='.pt-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.pt-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.pt-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='@media(max-width:900px){.pt-main{flex-direction:column}.pt-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="pt-wrap">';
html+='<div id="ptPick"><div class="pt-hero"><h1>Protect PDF</h1><p>Add real password protection and permissions to your PDF - fast, free and private.</p>';
html+='<div class="pt-zone" id="ptZone"><button class="pt-big" id="ptBtn" type="button">Select PDF file</button><p class="pt-drop-hint">or drop PDF here</p></div></div></div>';
html+='<div class="pt-work" id="ptWork"><div class="pt-main"><div class="pt-prev"><div class="pt-card"><div class="pt-icon">🔒</div><div class="pt-nm" id="ptName"></div><div class="pt-mt" id="ptMeta"></div></div></div>';
html+='<aside class="pt-side"><h2>Security settings</h2><p class="pt-sub">Set a password to protect your document</p>';
html+='<div class="pt-lbl">Password to open PDF *</div><div class="pt-pw-wrap"><input class="pt-inp" type="password" id="ptPwd" placeholder="Enter a strong password" autocomplete="new-password"/><button class="pt-pw-toggle" id="ptTog1" type="button">👁</button></div>';
html+='<div class="pt-meter"><div id="ptMeterFill"></div></div><div class="pt-meter-lbl" id="ptMeterLbl" style="color:#9a9aa5">—</div>';
html+='<div class="pt-lbl">Confirm password</div><div class="pt-pw-wrap"><input class="pt-inp" type="password" id="ptPwd2" placeholder="Re-enter password" autocomplete="new-password"/><button class="pt-pw-toggle" id="ptTog2" type="button">👁</button></div>';
html+='<div class="pt-err" id="ptErr"></div>';
html+='<details class="pt-adv"><summary>⚙️ Advanced options</summary>';
html+='<div class="pt-lbl">Owner password (optional)</div><input class="pt-inp" type="password" id="ptOwner" placeholder="Required to change permissions"/>';
html+='<div class="pt-lbl" style="margin-top:12px">Allow users to:</div>';
html+='<div class="pt-chk"><input type="checkbox" id="ptPrint" checked/><label for="ptPrint">🖨 Print the document</label></div>';
html+='<div class="pt-chk"><input type="checkbox" id="ptCopy" checked/><label for="ptCopy">📋 Copy text and images</label></div>';
html+='<div class="pt-chk"><input type="checkbox" id="ptModify"/><label for="ptModify">✏️ Modify the document</label></div>';
html+='<div class="pt-chk"><input type="checkbox" id="ptAnnotate"/><label for="ptAnnotate">📝 Add annotations</label></div>';
html+='<div class="pt-chk"><input type="checkbox" id="ptFill" checked/><label for="ptFill">✍️ Fill existing form fields</label></div>';
html+='</details>';
html+='<button class="pt-go" id="ptGo" type="button">Protect PDF →</button></aside></div></div>';
html+='<div class="pt-busy" id="ptBusy"><h2 id="ptBusyTitle">Encrypting PDF...</h2><p class="fn" id="ptBusyName"></p><p class="st" id="ptStatus">Preparing...</p><div class="pt-bar"><div id="ptBarFill"></div></div><div class="pt-pct" id="ptPct">0%</div><button class="pt-cancel" id="ptCancel" type="button">✕ Cancel</button></div>';
html+='<div class="pt-done" id="ptDone"><div class="pt-done-ic">🔐</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF protected successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="ptDoneInfo"></p><a class="pt-dl" id="ptDl" href="#">⬇ Download Protected PDF</a><button class="pt-again" id="ptAgain" type="button">Protect another PDF</button></div>';
html+='<input type="file" id="ptFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;

var file=null;var fileBuf=null;var cancelRequested=false;
var pick=document.getElementById('ptPick'),work=document.getElementById('ptWork'),busy=document.getElementById('ptBusy'),done=document.getElementById('ptDone');
var zone=document.getElementById('ptZone'),btn=document.getElementById('ptBtn'),inp=document.getElementById('ptFile');
var nameEl=document.getElementById('ptName'),metaEl=document.getElementById('ptMeta'),errEl=document.getElementById('ptErr');
var elPwd=document.getElementById('ptPwd'),elPwd2=document.getElementById('ptPwd2'),elOwner=document.getElementById('ptOwner');
var meterFill=document.getElementById('ptMeterFill'),meterLbl=document.getElementById('ptMeterLbl');
var goBtn=document.getElementById('ptGo');
var cancelBtn=document.getElementById('ptCancel');
var statusEl=document.getElementById('ptStatus');

/* Worker message handler */
worker.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'progress') {
    document.getElementById('ptPct').textContent = Math.round(data.percent) + '%';
    document.getElementById('ptBarFill').style.width = data.percent + '%';
    statusEl.textContent = data.msg || 'Processing...';
  } else if (data.type === 'complete') {
    document.getElementById('ptPct').textContent = '100%';
    document.getElementById('ptBarFill').style.width = '100%';
    statusEl.textContent = 'Complete!';
    
    setTimeout(function() {
      busy.style.display = 'none';
      done.style.display = 'block';
      document.getElementById('ptDoneInfo').textContent = data.pages + ' pages • ' + fmtB(data.bytes.length) + ' • AES encrypted • Password verified ✓';
      
      var blob = new Blob([data.bytes], {type: 'application/pdf'});
      var dl = document.getElementById('ptDl');
      dl.href = URL.createObjectURL(blob);
      dl.download = 'protected-' + (file ? file.name : 'document.pdf');
      goBtn.disabled = false;
    }, 300);
  } else if (data.type === 'error') {
    busy.style.display = 'none';
    work.style.display = 'block';
    goBtn.disabled = false;
    showErr(data.msg || 'Could not protect PDF. Please try again.');
  }
};

function showErr(msg){errEl.textContent=msg;errEl.style.display='block';}
function hideErr(){errEl.style.display='none';}

function updMeter(){
  var r=strength(elPwd.value);
  meterFill.style.width=(r.s*20)+'%';
  meterFill.style.background=r.c;
  meterLbl.textContent=r.l;
  meterLbl.style.color=r.c;
}

elPwd.addEventListener('input',updMeter);

function togPw(inpEl,btnEl){
  btnEl.onclick=function(){
    inpEl.type=inpEl.type==='password'?'text':'password';
    btnEl.textContent=inpEl.type==='password'?'👁':'';
  };
}

togPw(elPwd,document.getElementById('ptTog1'));
togPw(elPwd2,document.getElementById('ptTog2'));

function addFile(f){
  if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){
    alert('Please select a PDF file.');
    return;
  }
  file=f;hideErr();pick.style.display='none';work.style.display='block';done.style.display='none';
  nameEl.textContent=f.name;metaEl.textContent=fmtB(f.size)+' • Loading...';
  
  f.arrayBuffer().then(function(b){
    fileBuf=b;
    metaEl.textContent=fmtB(f.size)+' • Ready to protect';
  }).catch(function(){
    metaEl.textContent=fmtB(f.size)+' • ⚠️ Could not read file';
  });
}

btn.onclick=function(){inp.click();};

inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};

zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){
  e.preventDefault();zone.classList.remove('on');
  if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}
};

goBtn.onclick=function(){
  if(!file||!fileBuf){return;}
  hideErr();
  
  var pw=elPwd.value;
  var pw2=elPwd2.value;
  var owner=elOwner.value;
  
  if(!pw){showErr('Please enter a password.');return;}
  if(pw.length<4){showErr('Password must be at least 4 characters.');return;}
  if(pw.indexOf(',')>-1||(owner&&owner.indexOf(',')>-1)){showErr('Password cannot contain commas (,).');return;}
  if(pw!==pw2){showErr('Passwords do not match.');return;}
  
  work.style.display='none';busy.style.display='block';
  document.getElementById('ptBusyName').textContent=file.name;
  document.getElementById('ptBusyTitle').textContent='Encrypting PDF...';
  document.getElementById('ptPct').textContent='0%';
  document.getElementById('ptBarFill').style.width='0%';
  statusEl.textContent='Starting encryption...';
  cancelRequested=false;
  goBtn.disabled=true;
  
  /* Collect permissions */
  var perms=[];
  if(document.getElementById('ptPrint').checked){perms.push('print');}
  if(document.getElementById('ptModify').checked){perms.push('modify');}
  if(document.getElementById('ptCopy').checked){perms.push('copy');}
  if(document.getElementById('ptAnnotate').checked){perms.push('annotate');}
  if(document.getElementById('ptFill').checked){perms.push('form');}
  
  /* Send to worker */
  worker.postMessage({
    type: 'protect',
    buffer: fileBuf,
    password: pw,
    ownerPassword: owner,
    permissions: perms
  }, [fileBuf]); /* Transfer ArrayBuffer for zero-copy */
};

cancelBtn.onclick=function(){
  cancelRequested=true;
  statusEl.textContent='Cancelling...';
  busy.style.display='none';
  work.style.display='block';
  goBtn.disabled=false;
};

document.getElementById('ptAgain').onclick=function(){
  done.style.display='none';pick.style.display='block';work.style.display='none';
  file=null;fileBuf=null;elPwd.value='';elPwd2.value='';elOwner.value='';hideErr();updMeter();
};

})();
