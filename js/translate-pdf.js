/* TronoPDF - Translate PDF v4 | Web Worker + Cancel + Progress */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

var PDFLIB_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

/* Web Worker for translation + PDF building */
var workerCode = `
importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');

function splitSentences(text) {
  var sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
  return sentences.map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
}

async function translateText(text, from, to) {
  if (!text.trim()) return '';
  var libreEndpoints = [
    'https://libretranslate.de/translate',
    'https://translate.argosopentech.com/translate',
    'https://translate.terraprint.co/translate'
  ];
  
  for (var i = 0; i < libreEndpoints.length; i++) {
    try {
      var r = await fetch(libreEndpoints[i], {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({q: text, source: from === 'auto' ? 'auto' : from, target: to, format: 'text'})
      });
      if (r.ok) {
        var j = await r.json();
        if (j.translatedText) return j.translatedText;
      }
    } catch(e) { continue; }
  }
  
  try {
    var url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=' + from + '|' + to;
    var r2 = await fetch(url);
    var j2 = await r2.json();
    if (j2.responseStatus === 200 && j2.responseData && j2.responseData.translatedText) {
      return j2.responseData.translatedText;
    }
  } catch(e) {}
  
  return text;
}

async function translateChunk(text, from, to, progressCb) {
  if (!text.trim()) return '';
  var sentences = splitSentences(text);
  var translated = [];
  
  for (var i = 0; i < sentences.length; i++) {
    var t = await translateText(sentences[i], from, to);
    translated.push(t);
    if (progressCb) progressCb((i + 1) / sentences.length);
  }
  
  return translated.join(' ');
}

function wrapText(text, maxW, size, font) {
  var words = text.split(/\\s+/);
  var lines = [];
  var cur = '';
  
  words.forEach(function(w) {
    var test = (cur ? cur + ' ' : '') + w;
    var tw = font.widthOfTextAtSize(test, size);
    if (tw > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  });
  
  if (cur) lines.push(cur);
  return lines;
}

function addTextPage(pdfDoc, text, title, font, bold) {
  var page = pdfDoc.addPage([595, 842]);
  var margin = 50;
  var y = 800;
  
  page.drawText(title, {x: margin, y: y, size: 16, font: bold});
  y -= 30;
  
  var lines = wrapText(text, 595 - margin * 2, 11, font);
  
  for (var i = 0; i < lines.length; i++) {
    if (y < margin) {
      page = pdfDoc.addPage([595, 842]);
      y = 800;
    }
    page.drawText(lines[i], {x: margin, y: y, size: 11, font: font});
    y -= 16;
  }
}

self.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'translate') {
    var buffer = data.buffer;
    var from = data.from;
    var to = data.to;
    var mode = data.mode;
    
    self.postMessage({type: 'progress', percent: 3, msg: 'Loading PDF...'});
    
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    pdfjsLib.getDocument({data: buffer}).promise.then(function(pdfDoc) {
      var totalPages = pdfDoc.numPages;
      var allText = [];
      var translated = [];
      
      self.postMessage({type: 'progress', percent: 8, msg: 'Extracting text...'});
      
      var extractChain = Promise.resolve();
      for (var i = 1; i <= totalPages; i++) {
        (function(pageNum) {
          extractChain = extractChain.then(function() {
            var percent = 8 + (pageNum / totalPages) * 15;
            self.postMessage({
              type: 'progress',
              percent: percent,
              msg: 'Extracting page ' + pageNum + ' of ' + totalPages
            });
            
            return pdfDoc.getPage(pageNum).then(function(pg) {
              return pg.getTextContent().then(function(tc) {
                var s = '';
                tc.items.forEach(function(it) {
                  s += it.str + (it.hasEOL ? '\\n' : ' ');
                });
                allText.push(s.trim());
              });
            });
          });
        })(i);
      }
      
      return extractChain.then(function() {
        self.postMessage({type: 'progress', percent: 25, msg: 'Translating (' + from + ' → ' + to + ')...'});
        
        var fullTranslated = '';
        var translateChain = Promise.resolve();
        
        for (var k = 0; k < allText.length; k++) {
          (function(pageIdx) {
            translateChain = translateChain.then(function() {
              var percent = 25 + ((pageIdx + 1) / totalPages) * 65;
              self.postMessage({
                type: 'progress',
                percent: percent,
                msg: 'Translating page ' + (pageIdx + 1) + ' of ' + totalPages
              });
              
              return translateChunk(allText[pageIdx], from, to, function(p) {
                var subPercent = percent + (p / totalPages) * 65;
                self.postMessage({
                  type: 'progress',
                  percent: subPercent,
                  msg: 'Translating page ' + (pageIdx + 1) + ' of ' + totalPages
                });
              }).then(function(t) {
                translated.push(t);
                fullTranslated += '--- Page ' + (pageIdx + 1) + ' ---\\n' + t + '\\n\\n';
                
                self.postMessage({
                  type: 'preview',
                  text: fullTranslated
                });
              });
            });
          })(k);
        }
        
        return translateChain.then(function() {
          self.postMessage({type: 'progress', percent: 90, msg: 'Building translated PDF...'});
          
          return PDFLib.PDFDocument.create().then(function(newPdf) {
            return Promise.all([
              newPdf.embedFont(PDFLib.StandardFonts.Helvetica),
              newPdf.embedFont(PDFLib.StandardFonts.HelveticaBold)
            ]).then(function(fonts) {
              var font = fonts[0];
              var bold = fonts[1];
              
              for (var m = 0; m < totalPages; m++) {
                if (mode === 'both') {
                  addTextPage(newPdf, allText[m], 'Original - Page ' + (m + 1), font, bold);
                  addTextPage(newPdf, translated[m], 'Translated (' + to + ') - Page ' + (m + 1), font, bold);
                } else {
                  addTextPage(newPdf, translated[m], 'Translated (' + to + ') - Page ' + (m + 1), font, bold);
                }
              }
              
              self.postMessage({type: 'progress', percent: 98, msg: 'Saving PDF...'});
              return newPdf.save();
            });
          });
        });
      });
    }).then(function(bytes) {
      self.postMessage({type: 'progress', percent: 100, msg: 'Complete!'});
      self.postMessage({
        type: 'complete',
        bytes: bytes
      });
    }).catch(function(err) {
      self.postMessage({
        type: 'error',
        msg: 'Translation failed: ' + (err.message || err)
      });
    });
  }
};
`;

/* Create Worker */
var blob = new Blob([workerCode], {type: 'application/javascript'});
var workerUrl = URL.createObjectURL(blob);
var worker = new Worker(workerUrl);

function loadJS(src){return new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=function(){res(true);};s.onerror=function(){rej(new Error('load fail'));};document.head.appendChild(s);});}

var LANGS=[
['auto','Auto-detect (source)'],['en','English'],['hi','Hindi (हिन्दी)'],['es','Spanish (Español)'],['fr','French (Français)'],['de','German (Deutsch)'],['it','Italian (Italiano)'],['pt','Portuguese (Português)'],['nl','Dutch (Nederlands)'],['ru','Russian (Русский)'],['uk','Ukrainian (Українська)'],['pl','Polish (Polski)'],['tr','Turkish (Türkçe)'],['ar','Arabic (العربية)'],['he','Hebrew (עברית)'],['fa','Persian (فارسی)'],['ur','Urdu (اردو)'],['bn','Bengali (বাংলা)'],['ta','Tamil (தமிழ்)'],['te','Telugu (తెలుగు)'],['kn','Kannada (ಕನ್ನಡ)'],['ml','Malayalam (മലയാളം)'],['mr','Marathi (मराठी)'],['gu','Gujarati (ગુજરાતી)'],['pa','Punjabi (ਪੰਜਾਬੀ)'],['ne','Nepali (नेपाली)'],['si','Sinhala (සිංහල)'],['th','Thai (ไทย)'],['vi','Vietnamese (Tiếng Việt)'],['id','Indonesian (Bahasa)'],['ms','Malay (Bahasa Melayu)'],['zh','Chinese (中文)'],['ja','Japanese (日本語)'],['ko','Korean (한국어)'],['sv','Swedish (Svenska)'],['no','Norwegian (Norsk)'],['da','Danish (Dansk)'],['fi','Finnish (Suomi)'],['el','Greek (Ελληνικά)'],['cs','Czech (Čeština)'],['ro','Romanian (Română)'],['hu','Hungarian (Magyar)'],['bg','Bulgarian (Български)'],['hr','Croatian (Hrvatski)'],['sr','Serbian (Српски)'],['sk','Slovak (Slovenčina)'],['sl','Slovenian (Slovenščina)'],['lt','Lithuanian (Lietuvių)'],['lv','Latvian (Latviešu)'],['et','Estonian (Eesti)'],['sw','Swahili (Kiswahili)'],['ca','Catalan (Català)'],['af','Afrikaans'],['tl','Tagalog (Filipino)'],['my','Burmese (မြန်မာ)'],['km','Khmer (ខ្មែរ)']
];

var html='';
html+='<style>';
html+='.tr-wrap{max-width:1300px;margin:0 auto}';
html+='.tr-hero{text-align:center;padding:50px 16px 40px}';
html+='.tr-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.tr-hero p{font-size:18px;color:#7a7a85;margin-bottom:30px}';
html+='.tr-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}';
html+='.tr-card{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px}';
html+='.tr-card h3{font-size:15px;font-weight:900;margin-bottom:8px;color:#4b4b5a}';
html+='.tr-inp,.tr-sel{width:100%;padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;background:#fff}';
html+='.tr-row{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;margin-bottom:16px}';
html+='.tr-swap{background:#7c3aed;color:#fff;border:none;border-radius:50%;width:42px;height:42px;font-size:18px;cursor:pointer;box-shadow:0 6px 16px rgba(124,58,237,.3)}';
html+='.tr-swap:active{transform:scale(.95)}';
html+='.tr-go{width:100%;background:linear-gradient(135deg,#0d9488,#14b8a6);color:#fff;font-size:17px;font-weight:800;padding:16px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(13,148,136,.35)}';
html+='.tr-go:active{transform:scale(.98)}';
html+='.tr-go:disabled{opacity:.5;cursor:not-allowed}';
html+='.tr-out{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px;display:flex;flex-direction:column;min-height:300px}';
html+='.tr-out h3{font-size:16px;font-weight:900;margin-bottom:10px}';
html+='.tr-text{flex:1;min-height:240px;width:100%;border:1px solid #eceaf6;border-radius:10px;padding:14px;font-size:14px;line-height:1.6;resize:vertical;font-family:inherit;background:#fafbfe;white-space:pre-wrap}';
html+='.tr-actions{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}';
html+='.tr-actions button,.tr-actions a{flex:1;border:none;border-radius:10px;padding:13px;font-size:14px;font-weight:800;cursor:pointer;text-align:center;text-decoration:none}';
html+='.tr-actions button:active,.tr-actions a:active{transform:scale(.96)}';
html+='.tr-copy{background:#7c3aed;color:#fff}';
html+='.tr-dl{background:#16a34a;color:#fff}';
html+='.tr-busy{display:none;text-align:center;padding:60px 20px}';
html+='.tr-busy h2{font-size:28px;font-weight:900;margin-bottom:8px}';
html+='.tr-busy .st{color:#7a7a85;font-size:15px;margin-bottom:10px;min-height:20px}';
html+='.tr-bar{max-width:600px;margin:0 auto 18px;height:14px;background:#fff;border-radius:999px;overflow:hidden}';
html+='.tr-bar div{height:100%;width:0;background:linear-gradient(90deg,#0d9488,#14b8a6);transition:width .3s}';
html+='.tr-pct{font-size:36px;font-weight:900}';
html+='.tr-cancel{margin-top:16px;background:#f4f5fa;color:#333;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;border:none;cursor:pointer}';
html+='.tr-cancel:hover{background:#e6e8f5}';
html+='.tr-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);background:#16a34a;color:#fff;font-weight:800;padding:14px 28px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:all .3s;z-index:999;font-size:14px}';
html+='.tr-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}';
html+='.tr-toast.err{background:#dc2626}';
html+='.tr-info{background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:10px 14px;font-size:12px;color:#92400e;font-weight:600;margin-bottom:12px;line-height:1.5;text-align:center}';
html+='@media(max-width:900px){.tr-grid{grid-template-columns:1fr}.tr-row{grid-template-columns:1fr}.tr-swap{justify-self:center}}';
html+='</style>';
html+='<div class="tr-wrap">';
html+='<div id="trInput">';
html+='<div class="tr-hero"><h1>Translate PDF</h1><p>Translate entire PDFs into 50+ languages - free, fast & private.</p></div>';
html+='<div class="tr-info">💡 Your document is translated securely. Output is a new PDF with both original and translated text.</div>';
html+='<div class="tr-row"><select class="tr-sel" id="trFrom"></select><button class="tr-swap" id="trSwap" type="button" title="Swap languages">⇄</button><select class="tr-sel" id="trTo"></select></div>';
html+='<div class="tr-grid">';
html+='<div class="tr-card"><h3>📄 Upload PDF</h3><input type="file" id="trFile" class="tr-inp" accept="application/pdf,.pdf"/></div>';
html+='<div class="tr-card"><h3>⚙️ Options</h3><div class="tr-row" style="grid-template-columns:1fr;gap:6px;margin:0"><label style="font-size:12px;font-weight:800">Output mode</label><select class="tr-sel" id="trMode"><option value="both">Original + Translated (recommended)</option><option value="translated">Translated only</option></select></div></div>';
html+='</div>';
html+='<button class="tr-go" id="trGo" type="button">🌍 Translate PDF →</button>';
html+='<div class="tr-out" style="margin-top:20px"><h3>Translated text preview</h3><textarea class="tr-text" id="trText" placeholder="Translated text will appear here after you click Translate..."></textarea><div class="tr-actions"><button class="tr-copy" id="trCopy" type="button">📋 Copy Text</button><a class="tr-dl" id="trDl" href="#" style="display:none">⬇ Download PDF</a></div></div>';
html+='</div>';
html+='<div class="tr-busy" id="trBusy"><h2>Translating...</h2><p class="st" id="trStatus">Working...</p><div class="tr-bar"><div id="trBarFill"></div></div><div class="tr-pct" id="trPct">0%</div><button class="tr-cancel" id="trCancel" type="button">✕ Cancel</button></div>';
html+='<div class="tr-toast" id="trToast"></div>';
html+='</div>';
root.innerHTML=html;

var inputBox=document.getElementById('trInput'),busyBox=document.getElementById('trBusy');
var fromSel=document.getElementById('trFrom'),toSel=document.getElementById('trTo');
var goBtn=document.getElementById('trGo');
var cancelBtn=document.getElementById('trCancel');
var statusEl=document.getElementById('trStatus');
var cancelRequested=false;

LANGS.forEach(function(L){var o1=document.createElement('option');o1.value=L[0];o1.textContent=L[1];fromSel.appendChild(o1);var o2=document.createElement('option');o2.value=L[0];o2.textContent=L[1];if(L[0]==='auto'){o2.disabled=true;}toSel.appendChild(o2);});
fromSel.value='auto';toSel.value='en';

/* Worker message handler */
worker.onmessage = function(e) {
  var data = e.data;
  
  if (data.type === 'progress') {
    document.getElementById('trPct').textContent = Math.round(data.percent) + '%';
    document.getElementById('trBarFill').style.width = data.percent + '%';
    statusEl.textContent = data.msg || 'Processing...';
  } else if (data.type === 'preview') {
    document.getElementById('trText').value = data.text;
  } else if (data.type === 'complete') {
    document.getElementById('trPct').textContent = '100%';
    document.getElementById('trBarFill').style.width = '100%';
    statusEl.textContent = 'Complete!';
    
    setTimeout(function() {
      busyBox.style.display = 'none';
      inputBox.style.display = 'block';
      
      var blob = new Blob([data.bytes], {type: 'application/pdf'});
      var dl = document.getElementById('trDl');
      dl.href = URL.createObjectURL(blob);
      dl.download = 'translated-' + currentFileName;
      dl.style.display = 'block';
      
      goBtn.disabled = false;
      toast('✓ Translation complete!');
    }, 300);
  } else if (data.type === 'error') {
    busyBox.style.display = 'none';
    inputBox.style.display = 'block';
    goBtn.disabled = false;
    toast('Translation failed: ' + data.msg, true);
  }
};

document.getElementById('trSwap').onclick=function(){
  if(fromSel.value==='auto'){return;}
  var t=fromSel.value;fromSel.value=toSel.value;toSel.value=t;
};

var toastEl=document.getElementById('trToast');

function toast(m,e){toastEl.textContent=m;toastEl.classList.toggle('err',!!e);toastEl.classList.add('show');clearTimeout(toastEl.__h);toastEl.__h=setTimeout(function(){toastEl.classList.remove('show');},2200);}

var currentFileName = '';

goBtn.onclick=function(){
  var fileIn=document.getElementById('trFile');
  if(!fileIn.files||!fileIn.files[0]){toast('Please select a PDF file',true);return;}
  var f=fileIn.files[0];
  if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){toast('Please select a PDF file',true);return;}
  
  var from=fromSel.value;
  var to=toSel.value;
  if(to==='auto'){toast('Target language cannot be auto',true);return;}
  
  var mode=document.getElementById('trMode').value;
  currentFileName = f.name;
  
  inputBox.style.display='none';
  busyBox.style.display='block';
  
  document.getElementById('trText').value='';
  document.getElementById('trDl').style.display='none';
  document.getElementById('trPct').textContent='0%';
  document.getElementById('trBarFill').style.width='0%';
  statusEl.textContent='Starting...';
  cancelRequested=false;
  goBtn.disabled=true;
  
  /* Read file and send to worker */
  f.arrayBuffer().then(function(buf){
    if(cancelRequested){
      busyBox.style.display='none';
      inputBox.style.display='block';
      goBtn.disabled=false;
      return;
    }
    
    worker.postMessage({
      type: 'translate',
      buffer: buf,
      from: from,
      to: to,
      mode: mode
    }, [buf]);
  }).catch(function(err){
    busyBox.style.display='none';
    inputBox.style.display='block';
    goBtn.disabled=false;
    toast('Error reading file: '+err.message,true);
  });
};

cancelBtn.onclick=function(){
  cancelRequested=true;
  statusEl.textContent='Cancelling...';
  
  /* Terminate and recreate worker */
  worker.terminate();
  var blob = new Blob([workerCode], {type: 'application/javascript'});
  var workerUrl = URL.createObjectURL(blob);
  worker = new Worker(workerUrl);
  
  /* Reattach message handler */
  worker.onmessage = function(e) {
    var data = e.data;
    if (data.type === 'progress') {
      document.getElementById('trPct').textContent = Math.round(data.percent) + '%';
      document.getElementById('trBarFill').style.width = data.percent + '%';
      statusEl.textContent = data.msg || 'Processing...';
    } else if (data.type === 'preview') {
      document.getElementById('trText').value = data.text;
    } else if (data.type === 'complete') {
      document.getElementById('trPct').textContent = '100%';
      document.getElementById('trBarFill').style.width = '100%';
      statusEl.textContent = 'Complete!';
      setTimeout(function() {
        busyBox.style.display = 'none';
        inputBox.style.display = 'block';
        var blob = new Blob([data.bytes], {type: 'application/pdf'});
        var dl = document.getElementById('trDl');
        dl.href = URL.createObjectURL(blob);
        dl.download = 'translated-' + currentFileName;
        dl.style.display = 'block';
        goBtn.disabled = false;
        toast('✓ Translation complete!');
      }, 300);
    } else if (data.type === 'error') {
      busyBox.style.display = 'none';
      inputBox.style.display = 'block';
      goBtn.disabled = false;
      toast('Translation failed: ' + data.msg, true);
    }
  };
  
  busyBox.style.display='none';
  inputBox.style.display='block';
  goBtn.disabled=false;
};

document.getElementById('trCopy').onclick=function(){
  var t=document.getElementById('trText').value;
  if(!t){toast('No text yet',true);return;}
  if(navigator.clipboard){navigator.clipboard.writeText(t).then(function(){toast('✓ Copied!');});}
  else{document.getElementById('trText').select();try{document.execCommand('copy');toast('✓ Copied!');}catch(e){}}
};

})();
