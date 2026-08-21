/* TronoPDF - Unlock PDF v1 | simple password removal, browser-based, private */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}
var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
function loadJS(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(false);};s.onerror=function(){cb(true);};document.head.appendChild(s);}
loadJS(PDFLIB_SRC,function(){});
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
var html='';
html+='<style>';
html+='.ul-wrap{max-width:1400px;margin:0 auto}';
html+='.ul-hero{text-align:center;padding:50px 16px 40px}';
html+='.ul-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.ul-hero p{font-size:18px;color:#7a7a85;margin-bottom:36px}';
html+='.ul-big{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:20px;font-weight:800;padding:20px 70px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35)}';
html+='.ul-big:hover{transform:translateY(-2px)}';
html+='.ul-drop-hint{margin-top:16px;color:#9a9aa5;font-size:15px}';
html+='.ul-zone{border:2px dashed transparent;border-radius:18px}';
html+='.ul-zone.on{border-color:#7c3aed;background:#f3f0ff}';
html+='.ul-work{display:none;background:#f7f6fc;border-radius:14px;overflow:hidden}';
html+='.ul-main{display:flex;min-height:560px}';
html+='.ul-prev{flex:1;padding:40px;display:flex;align-items:center;justify-content:center}';
html+='.ul-card{background:#fff;border:1px solid #eceaf6;border-radius:14px;padding:28px;text-align:center;box-shadow:0 4px 20px rgba(30,20,60,.06);width:420px;max-width:100%}';
html+='.ul-icon{width:80px;height:80px;border-radius:50%;background:#fef3c7;color:#d97706;font-size:40px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}';
html+='.ul-nm{font-size:14px;font-weight:700;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}';
html+='.ul-mt{font-size:13px;color:#9a9aa5}';
html+='.ul-side{width:400px;background:#fff;border-left:1px solid #eceaf6;padding:26px;display:flex;flex-direction:column;overflow-y:auto}';
html+='.ul-side h2{font-size:22px;font-weight:900;text-align:center;margin-bottom:6px}';
html+='.ul-sub{text-align:center;font-size:13px;color:#9a9aa5;margin-bottom:18px}';
html+='.ul-lbl{font-size:12px;font-weight:800;color:#4b4b5a;margin:12px 0 6px}';
html+='.ul-inp{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;font-family:inherit;background:#fff}';
html+='.ul-err{display:none;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:12px 14px;font-size:13px;color:#dc2626;font-weight:600;margin-top:10px}';
html+='.ul-adv{margin-top:16px;border:1px solid #eceaf6;border-radius:10px;padding:10px 14px;background:#fafbfe}';
html+='.ul-adv summary{font-size:13px;font-weight:800;color:#7c3aed;cursor:pointer}';
html+='.ul-adv[open] summary{margin-bottom:8px}';
html+='.ul-chk{display:flex;gap:8px;align-items:center;margin:6px 0}';
html+='.ul-chk input{width:16px;height:16px;accent-color:#7c3aed}';
html+='.ul-chk label{font-size:13px;font-weight:600;cursor:pointer}';
html+='.ul-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:18px;font-weight:800;padding:17px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);margin-top:16px}';
html+='.ul-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.ul-busy{display:none;padding:60px 20px;text-align:center}';
html+='.ul-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.ul-busy .fn{color:#7a7a85;font-size:15px;margin-bottom:26px}';
html+='.ul-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.ul-bar div{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width .3s}';
html+='.ul-pct{font-size:36px;font-weight:900}';
html+='.ul-done{display:none;text-align:center;padding:50px 20px}';
html+='.ul-done-ic{width:80px;height:80px;border-radius:50%;background:#eafbef;color:#16a34a;font-size:38px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}';
html+='.ul-dl{display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:18px;padding:17px 50px;border-radius:12px;box-shadow:0 14px 34px rgba(22,163,74,.35)}';
html+='.ul-again{display:inline-block;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;margin-left:10px}';
html+='@media(max-width:900px){.ul-main{flex-direction:column}.ul-side{width:auto;border-left:none;border-top:1px solid #eceaf6}}';
html+='</style>';
html+='<div class="ul-wrap">';
html+='<div id="ulPick"><div class="ul-hero"><h1>Unlock PDF</h1><p>Remove password and restrictions from your PDF - fast, free and private.</p>';
html+='<div class="ul-zone" id="ulZone"><button class="ul-big" id="ulBtn" type="button">Select PDF file</button><p class="ul-drop-hint">or drop PDF here</p></div></div></div>';
html+='<div class="ul-work" id="ulWork"><div class="ul-main"><div class="ul-prev"><div class="ul-card"><div class="ul-icon">🔒</div><div class="ul-nm" id="ulName"></div><div class="ul-mt" id="ulMeta"></div></div></div>';
html+='<aside class="ul-side"><h2>Unlock settings</h2><p class="ul-sub">Enter the current password and unlock</p>';
html+='<div class="ul-lbl">Current PDF password</div><input class="ul-inp" type="password" id="ulPwd" placeholder="Enter the password you know" autocomplete="current-password"/>';
html+='<div class="ul-err" id="ulErr"></div>';
html+='<details class="ul-adv"><summary>⚙️ Advanced options</summary>';
html+='<div class="ul-chk"><input type="checkbox" id="ulRest" checked/><label for="ulRest">Remove restrictions (print / copy / edit)</label></div>';
html+='<div class="ul-lbl">Output filename</div><input class="ul-inp" type="text" id="ulOut" value="unlocked"/>';
html+='</details>';
html+='<button class="ul-go" id="ulGo" type="button">Unlock PDF →</button></aside></div></div>';
html+='<div class="ul-busy" id="ulBusy"><h2>Unlocking PDF...</h2><p class="fn" id="ulBusyName"></p><div class="ul-bar"><div id="ulBarFill"></div></div><div class="ul-pct" id="ulPct">0%</div></div>';
html+='<div class="ul-done" id="ulDone"><div class="ul-done-ic">🔓</div><h1 style="font-size:28px;font-weight:900;margin-bottom:8px">PDF unlocked successfully!</h1><p style="color:#7a7a85;font-size:15px;margin-bottom:28px" id="ulDoneInfo"></p><a class="ul-dl" id="ulDl" href="#">⬇ Download Unlocked PDF</a><button class="ul-again" id="ulAgain" type="button">Unlock another PDF</button></div>';
html+='<input type="file" id="ulFile" accept="application/pdf,.pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;
var file=null;var buf=null;var pages=0;
var pick=document.getElementById('ulPick'),work=document.getElementById('ulWork'),busy=document.getElementById('ulBusy'),done=document.getElementById('ulDone');
var zone=document.getElementById('ulZone'),btn=document.getElementById('ulBtn'),inp=document.getElementById('ulFile');
var nameEl=document.getElementById('ulName'),metaEl=document.getElementById('ulMeta'),errEl=document.getElementById('ulErr');
var elPwd=document.getElementById('ulPwd'),elRest=document.getElementById('ulRest'),elOut=document.getElementById('ulOut');
function showErr(msg){errEl.textContent=msg;errEl.style.display='block';}
function hideErr(){errEl.style.display='none';}
function addFile(f){
 if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){alert('Please select a PDF file.');return;}
 file=f;hideErr();pick.style.display='none';work.style.display='block';done.style.display='none';
 nameEl.textContent=f.name;metaEl.textContent=fmtB(f.size)+' • Reading...';
 elOut.value=f.name.replace(/\.pdf$/i,'')+'-unlocked';
 waitLib('PDFLib').then(function(ok){
  if(!ok){metaEl.textContent=fmtB(f.size);return;}
  f.arrayBuffer().then(function(b){
   buf=b;
   PDFLib.PDFDocument.load(b,{ignoreEncryption:false}).then(function(doc){
    pages=doc.getPageCount();
    metaEl.textContent=pages+' pages • '+fmtB(f.size);
   }).catch(function(){
    metaEl.textContent=fmtB(f.size);
   });
  });
 });
}
btn.onclick=function(){inp.click();};
inp.onchange=function(){if(inp.files[0]){addFile(inp.files[0]);}inp.value='';};
zone.ondragover=function(e){e.preventDefault();zone.classList.add('on');};
zone.ondragleave=function(){zone.classList.remove('on');};
zone.ondrop=function(e){e.preventDefault();zone.classList.remove('on');if(e.dataTransfer.files[0]){addFile(e.dataTransfer.files[0]);}};
function pct(p){document.getElementById('ulPct').textContent=Math.round(p)+'%';document.getElementById('ulBarFill').style.width=p+'%';}
document.getElementById('ulGo').onclick=function(){
 if(!file){return;}
 hideErr();
 var pwd=elPwd.value;
 work.style.display='none';busy.style.display='block';
 document.getElementById('ulBusyName').textContent=file.name;
 pct(5);
 waitLib('PDFLib').then(function(ok){
  if(!ok){busy.style.display='none';work.style.display='block';showErr('Failed to load library');return;}
  PDFLib.PDFDocument.load(buf,{password:pwd,ignoreEncryption:elRest.checked}).then(function(doc){
   pct(30);
   return doc.save({useObjectStreams:true}).then(function(bytes){
    pct(90);
    setTimeout(function(){
     busy.style.display='none';done.style.display='block';
     document.getElementById('ulDoneInfo').textContent=doc.getPageCount()+' pages • '+fmtB(bytes.length);
     var blob=new Blob([bytes],{type:'application/pdf'});
     var dl=document.getElementById('ulDl');
     dl.href=URL.createObjectURL(blob);
     dl.download=(elOut.value||'unlocked')+'.pdf';
    },200);
   });
  }).catch(function(err){
   busy.style.display='none';work.style.display='block';
   var msg=(err&&err.message)||'Failed to unlock';
   if(/password/i.test(msg)){showErr('Wrong password. Please check and try again.');}
   else if(/encrypt/i.test(msg)){showErr('This PDF has strong encryption. Try with restrictions removed checked.');}
   else{showErr('Could not unlock: '+msg);}
  });
 });
};
document.getElementById('ulAgain').onclick=function(){
 done.style.display='none';pick.style.display='block';work.style.display='none';
 file=null;buf=null;pages=0;elPwd.value='';hideErr();
};
})();
