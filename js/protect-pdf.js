/* TronoPDF - Protect PDF v1 | password + permissions, browser-based, private */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
function loadJS(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(false);};s.onerror=function(){cb(true);};document.head.appendChild(s);}
loadJS(PDFLIB_SRC,function(){});
function waitLib(name){return new Promise(function(res){var t=0;(function w(){if(window[name]){res(true);return;}if(t>40){res(false);return;}t++;setTimeout(w,500);})();});}
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
html+='.pt-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:26px}';
html+='.pt-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.pt-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .3s}';
html+='.pt-pct{font-size:36px;font-weight:900}';
html+='.pt-done{display:none;text-align:center;padding:50px 20px}';
html+='.pt-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.pt-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.pt-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='@media(max-width:900px){.pt-main{flex-direction:column}.pt-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="pt-wrap">';
html+='<div id="ptPick"><div class="pt-hero"><h1>Protect PDF</h1><p>Add password protection and permissions to your PDF - fast, free and private.</p>';
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
html+='<div class="pt-chk"><input type="checkbox" id="ptAnnotate"/><label for="ptAnnotate">📝 Add annotations and form fields</label></div>';
html+='<div class="pt-chk"><input type="checkbox" id="ptFill" checked/><label for="ptFill">✍️ Fill existing form fields</label></div>';
html+='</details>';
html+='<button class="pt-go" id="ptGo" type="button">Protect PDF →</button></aside></div></div>';
html+='<div class="pt-busy" id="ptBusy"><h2>Encrypting PDF...</h2><p class="fn" id="ptBusyName"></p><div class="pt-bar"><div id="ptBarFill"></div></div><div class="pt-pct" id="ptPct">0%</div></div>';
html+='<div class="pt-done" id="ptDone"><div class="pt-done-ic">🔐</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF protected successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="ptDoneInfo"></p><a class="pt-dl" id="ptDl" href="#">⬇ Download Protected PDF</a><button class="pt-again" id="ptAgain" type="button">Protect another PDF</button></div>';
html+='<input type="file" id="ptFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var file=null;
var pick=document.getElementById('ptPick'),work=document.getElementById('ptWork'),busy=document.getElementById('ptBusy'),done=document.getElementById('ptDone');
var zone=document.getElementById('ptZone'),btn=document.getElementById('ptBtn'),inp=document.getElementById('ptFile');
var nameEl=document.getElementById('ptName'),metaEl=document.getElementById('ptMeta'),errEl=document.getElementById('ptErr');
var elPwd=document.getElementById('ptPwd'),elPwd2=document.getElementById('ptPwd2'),elOwner=document.getElementById('ptOwner');
var meterFill=document.getElementById('ptMeterFill'),meterLbl=document.getElementById('ptMeterLbl');
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
function togPw(inp,btn){
 btn.onclick=function(){
  inp.type=inp.type==='password'?'text':'password';
  btn.textContent=inp.type==='password'?'👁':'🙈';
 };
}
togPw(elPwd,document.getElementById('ptTog1'));
togPw(elPwd2,document.getElementById('ptTog2'));
togPw(elOwner,(function(){var b=document.createElement('button');b.className='pt-pw-toggle';return b;})()); // owner toggle not added to DOM, safe no-op
function addFile(f){
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){alert('Please select a PDF file.');return;}
 file=f;hideErr();pick.style.display='none';work.style.display='block';done.style.display='none';
 nameEl.textContent=f.name;metaEl.textContent=fmtB(f.size)+' • Reading...';
 waitLib('PDFLib').then(function(ok){
  if(!ok){metaEl.textContent=fmtB(f.size);return;}
  f.arrayBuffer().then(function(b){
   PDFLib.PDFDocument.load(b,{ignoreEncryption:false}).then(function(doc){
    metaEl.textContent=doc.getPageCount()+' pages • '+fmtB(f.size);
   }).catch(function(err){
    metaEl.textContent=fmtB(f.size);
    if(/password/i.test(err&&err.message||'')){showErr('This PDF is already password protected. Use Unlock PDF first.');}
   });
  });
 });
}
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};
function pct(p){document.getElementById('ptPct').textContent=Math.round(p)+'%';document.getElementById('ptBarFill').style.width=p+'%';}
document.getElementById('ptGo').onclick=function(){
 if(!file){return;}
 hideErr();
 var pw=elPwd.value;
 var pw2=elPwd2.value;
 var owner=elOwner.value;
 if(!pw){showErr('Please enter a password.');return;}
 if(pw.length<4){showErr('Password must be at least 4 characters.');return;}
 if(pw!==pw2){showErr('Passwords do not match.');return;}
 work.style.display='none';busy.style.display='block';
 document.getElementById('ptBusyName').textContent=file.name;
 pct(10);
 waitLib('PDFLib').then(function(ok){
  if(!ok){throw new Error('libs');}
  return file.arrayBuffer();
 }).then(function(buf){
  return PDFLib.PDFDocument.load(buf,{ignoreEncryption:true}).then(function(pdf){
   pct(40);
   var perms={
    printing:document.getElementById('ptPrint').checked?'high':false,
    modifying:document.getElementById('ptModify').checked,
    copying:document.getElementById('ptCopy').checked,
    annotating:document.getElementById('ptAnnotate').checked,
    fillingForms:document.getElementById('ptFill').checked,
    contentAccessibility:true,
    documentAssembly:false
   };
   var opts={userPassword:pw,permissions:perms};
   if(owner){opts.ownerPassword=owner;}
   return pdf.save(opts).then(function(bytes){
    pct(95);
    setTimeout(function(){
     busy.style.display='none';done.style.display='block';
     document.getElementById('ptDoneInfo').textContent=pdf.getPageCount()+' pages • '+fmtB(bytes.length)+' • Password protected';
     var blob=new Blob([bytes],{type:'application/pdf'});
     var dl=document.getElementById('ptDl');
     dl.href=URL.createObjectURL(blob);
     dl.download='protected-'+(file.name||'document.pdf');
    },200);
   });
  });
 }).catch(function(err){
  busy.style.display='none';work.style.display='block';
  var msg=(err&&err.message)||'Failed to protect';
  if(/password/i.test(msg)){showErr('This PDF is already protected. Use Unlock PDF first to remove existing password.');}
  else{showErr('Could not protect: '+msg);}
 });
};
document.getElementById('ptAgain').onclick=function(){
 done.style.display='none';pick.style.display='block';work.style.display='none';
 file=null;elPwd.value='';elPwd2.value='';elOwner.value='';hideErr();updMeter();
};
})();
