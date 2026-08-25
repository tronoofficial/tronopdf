/* TronoPDF - AI Summarizer v2 | Web Worker + Progress + Lazy Load */
(function(){
var root=document.getElementById('toolRoot');
if(!root){return;}

var PDFJS_SRC='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
var PDFJS_WORKER='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

function loadJS(src,cb){
  var s=document.createElement('script');
  s.src=src;
  s.onload=function(){cb(false);};
  s.onerror=function(){cb(true);};
  document.head.appendChild(s);
}

var STOP={};
('a an the and or but if then else for nor so yet at by in of on to up as is am are was were be been being have has had do does did will would can could shall should may might must it its this that these those i you he she we they them his her their our your my me him us with without within from into over under again further once here there when where why how all any both each few more most other some such no not only own same than too very just because while during before after above below out off down also about against between through more other which what who whom').split(' ').forEach(function(w){STOP[w]=1;});

/* Web Worker code as string */
var workerCode = `
var STOP={};
('a an the and or but if then else for nor so yet at by in of on to up as is am are was were be been being have has had do does did will would can could shall should may might must it its this that these those i you he she we they them his her their our your my me him us with without within from into over under again further once here there when where why how all any both each few more most other some such no not only own same than too very just because while during before after above below out off down also about against between through more other which what who whom').split(' ').forEach(function(w){STOP[w]=1;});

function words(s){return s.toLowerCase().replace(/[^a-z0-9\\u0900-\\u097F\\s]/g,' ').split(/\\s+/).filter(function(w){return w&&!STOP[w];});}

function sentences(s){
  var m=s.replace(/\\s+/g,' ').match(/[^.!?\\n]+[.!?]*/g);
  return m?m.map(function(x){return x.trim();}).filter(function(x){return x.length>20;}):[];
}

function summarize(text,ratio){
  var sents=sentences(text);
  if(sents.length===0){return {sum:'',stats:null};}
  var freq={};
  sents.forEach(function(s){words(s).forEach(function(w){freq[w]=(freq[w]||0)+1;});});
  var max=1;Object.keys(freq).forEach(function(k){if(freq[k]>max)max=freq[k];});
  var scored=sents.map(function(s,idx){
    var ws=words(s);
    var score=0;ws.forEach(function(w){score+=freq[w]/max;});
    score=score/Math.sqrt(ws.length||1);
    if(idx===0)score*=1.2;
    return {s:s,idx:idx,score:score};
  });
  var count=Math.max(1,Math.round(sents.length*ratio));
  var top=scored.slice().sort(function(a,b){return b.score-a.score;}).slice(0,count);
  top.sort(function(a,b){return a.idx-b.idx;});
  var sum=top.map(function(t){return t.s;}).join(' ');
  var ow=text.split(/\\s+/).length,sw=sum.split(/\\s+/).length;
  return {sum:sum,stats:{orig:ow,sum:sw,red:Math.round((1-sw/ow)*100)}};
}

self.onmessage=function(e){
  var d=e.data;
  if(d.type==='summarize'){
    self.postMessage({type:'progress',percent:50,msg:'Analyzing text...'});
    var r=summarize(d.text,d.ratio);
    self.postMessage({type:'progress',percent:100,msg:'Summary ready!'});
    self.postMessage({type:'result',data:r});
  }
};
`;

/* Create Web Worker from Blob */
var blob = new Blob([workerCode], {type: 'application/javascript'});
var workerUrl = URL.createObjectURL(blob);
var worker = new Worker(workerUrl);

var html='';
html+='<style>';
html+='.sm-wrap{max-width:1200px;margin:0 auto}';
html+='.sm-hero{text-align:center;padding:50px 16px 40px}';
html+='.sm-hero h1{font-size:42px;font-weight:900;margin-bottom:12px;letter-spacing:-1px}';
html+='.sm-hero p{font-size:18px;color:#7a7a85;margin-bottom:30px}';
html+='.sm-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}';
html+='.sm-card{background:#fff;border:1px solid #eceaf6;border-radius:12px;padding:22px;display:flex;flex-direction:column}';
html+='.sm-card h3{font-size:16px;font-weight:900;margin-bottom:10px}';
html+='.sm-text{flex:1;min-height:300px;width:100%;border:1px solid #eceaf6;border-radius:10px;padding:14px;font-size:14px;line-height:1.6;resize:vertical;font-family:inherit;background:#fafbfe}';
html+='.sm-controls{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:16px 0}';
html+='.sm-controls select{padding:11px 14px;border:1px solid #ddd;border-radius:10px;font-size:14px;background:#fff}';
html+='.sm-file{border:1px solid #eceaf6;background:#fff;border-radius:10px;padding:11px 16px;font-size:13px;font-weight:800;cursor:pointer}';
html+='.sm-file:hover{border-color:#7c3aed;color:#7c3aed}';
html+='.sm-go{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:17px;font-weight:800;padding:14px 34px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 14px 34px rgba(124,58,237,.35);transition:all .2s}';
html+='.sm-go:hover{transform:translateY(-2px);box-shadow:0 18px 40px rgba(124,58,237,.4)}';
html+='.sm-go:active{transform:scale(.97)}';
html+='.sm-go:disabled{opacity:.6;cursor:not-allowed;transform:none}';
html+='.sm-stats{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px}';
html+='.sm-stat{background:#ede9fe;border-radius:10px;padding:8px 14px;font-size:12px;font-weight:800;color:#5b21b6}';
html+='.sm-actions{display:flex;gap:8px;margin-top:12px}';
html+='.sm-actions button{flex:1;border:none;border-radius:10px;padding:13px;font-size:14px;font-weight:800;cursor:pointer}';
html+='.sm-actions button:active{transform:scale(.96)}';
html+='.sm-copy{background:#7c3aed;color:#fff}';
html+='.sm-dl{background:#16a34a;color:#fff}';
html+='.sm-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);background:#16a34a;color:#fff;font-weight:800;padding:14px 28px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:all .3s;z-index:999;font-size:14px}';
html+='.sm-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}';
html+='.sm-toast.err{background:#dc2626}';
html+='.sm-progress{margin:16px 0;display:none}';
html+='.sm-progress.active{display:block}';
html+='.sm-progress-bar{height:8px;background:#eceaf6;border-radius:999px;overflow:hidden;margin-bottom:8px}';
html+='.sm-progress-fill{height:100%;background:linear-gradient(90deg,#7c3aed,#a855f7);border-radius:999px;transition:width .3s ease;width:0%}';
html+='.sm-progress-text{font-size:13px;font-weight:700;color:#7a7a85;text-align:center}';
html+='@media(max-width:900px){.sm-grid{grid-template-columns:1fr}}';
html+='</style>';
html+='<div class="sm-wrap">';
html+='<div class="sm-hero"><h1>AI Summarizer</h1><p>Turn long articles, essays & PDFs into concise summaries - instantly & privately.</p></div>';
html+='<div class="sm-controls" style="justify-content:center"><select id="smLen"><option value="0.1">Short</option><option value="0.2" selected>Medium</option><option value="0.3">Long</option></select><button class="sm-file" id="smFileBtn" type="button">📄 Upload PDF / TXT</button><button class="sm-go" id="smGo" type="button">✨ Summarize</button></div>';
html+='<div class="sm-progress" id="smProgress"><div class="sm-progress-bar"><div class="sm-progress-fill" id="smProgressFill"></div></div><div class="sm-progress-text" id="smProgressText">Processing...</div></div>';
html+='<div class="sm-grid">';
html+='<div class="sm-card"><h3>Your text</h3><textarea class="sm-text" id="smIn" placeholder="Paste your article, essay or paragraph here... or upload a PDF/TXT file."></textarea></div>';
html+='<div class="sm-card"><h3>Summary</h3><div class="sm-stats" id="smStats"></div><textarea class="sm-text" id="smOut" placeholder="Your summary will appear here..."></textarea><div class="sm-actions"><button class="sm-copy" id="smCopy" type="button">📋 Copy</button><button class="sm-dl" id="smDl" type="button">⬇ Download .txt</button></div></div>';
html+='</div>';
html+='<div class="sm-toast" id="smToast"></div>';
html+='<input type="file" id="smFile" accept=".pdf,.txt,text/plain,application/pdf" style="display:none"/>';
html+='</div>';
root.innerHTML=html;

var inEl=document.getElementById('smIn');
var outEl=document.getElementById('smOut');
var statsEl=document.getElementById('smStats');
var toastEl=document.getElementById('smToast');
var goBtn=document.getElementById('smGo');
var progressEl=document.getElementById('smProgress');
var progressFill=document.getElementById('smProgressFill');
var progressText=document.getElementById('smProgressText');

function toast(msg,err){
  toastEl.textContent=msg;
  toastEl.classList.toggle('err',!!err);
  toastEl.classList.add('show');
  clearTimeout(toastEl.__h);
  toastEl.__h=setTimeout(function(){toastEl.classList.remove('show');},2200);
}

function showProgress(percent,msg){
  progressEl.classList.add('active');
  progressFill.style.width=percent+'%';
  progressText.textContent=msg||'Processing...';
}

function hideProgress(){
  setTimeout(function(){
    progressEl.classList.remove('active');
    progressFill.style.width='0%';
  },500);
}

/* Worker message handler */
worker.onmessage=function(e){
  var d=e.data;
  if(d.type==='progress'){
    showProgress(d.percent,d.msg);
  }else if(d.type==='result'){
    hideProgress();
    goBtn.disabled=false;
    goBtn.textContent='✨ Summarize';
    if(!d.data.sum){
      toast('Could not summarize - text too short',true);
      return;
    }
    outEl.value=d.data.sum;
    statsEl.innerHTML='<span class="sm-stat">Original: '+d.data.stats.orig+' words</span><span class="sm-stat">Summary: '+d.data.stats.sum+' words</span><span class="sm-stat">Reduced: '+d.data.stats.red+'%</span>';
    toast('✓ Summary ready!');
  }
};

worker.onerror=function(e){
  hideProgress();
  goBtn.disabled=false;
  goBtn.textContent='✨ Summarize';
  toast('Error: '+e.message,true);
};

goBtn.onclick=function(){
  var text=inEl.value.trim();
  if(!text){
    toast('Please paste text or upload a file first',true);
    return;
  }
  var ratio=parseFloat(document.getElementById('smLen').value)||0.2;
  goBtn.disabled=true;
  goBtn.textContent='⏳ Processing...';
  showProgress(10,'Analyzing text...');
  worker.postMessage({type:'summarize',text:text,ratio:ratio});
};

document.getElementById('smFileBtn').onclick=function(){
  document.getElementById('smFile').click();
};

document.getElementById('smFile').onchange=function(){
  var f=this.files[0];
  if(!f){return;}
  
  if(/\.txt$|text\/plain/.test(f.name)||f.type==='text/plain'){
    showProgress(50,'Reading text file...');
    var rd=new FileReader();
    rd.onload=function(){
      inEl.value=rd.result;
      hideProgress();
      toast('✓ Text loaded!');
    };
    rd.onerror=function(){
      hideProgress();
      toast('Could not read file',true);
    };
    rd.readAsText(f);
  }else{
    showProgress(5,'Loading PDF engine...');
    loadJS(PDFJS_SRC,function(err){
      if(err||!window.pdfjsLib){
        hideProgress();
        toast('PDF engine failed',true);
        return;
      }
      window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
      showProgress(10,'Reading PDF...');
      f.arrayBuffer().then(function(b){
        return window.pdfjsLib.getDocument({data:b}).promise.then(function(d){
          var totalPages=d.numPages;
          var chain=Promise.resolve();
          var all='';
          for(var i=1;i<=totalPages;i++){
            (function(n){
              chain=chain.then(function(){
                var percent=10+Math.round((n/totalPages)*85);
                showProgress(percent,'Extracting page '+n+' of '+totalPages+'...');
                return d.getPage(n).then(function(p){
                  return p.getTextContent().then(function(tc){
                    tc.items.forEach(function(it){all+=it.str+' ';});
                    all+='\n';
                  });
                });
              });
            })(i);
          }
          return chain.then(function(){
            inEl.value=all;
            hideProgress();
            toast('✓ PDF text loaded! ('+totalPages+' pages)');
          });
        });
      }).catch(function(){
        hideProgress();
        toast('Could not read PDF',true);
      });
    });
  }
  this.value='';
};

document.getElementById('smCopy').onclick=function(){
  if(!outEl.value){
    toast('No summary yet',true);
    return;
  }
  if(navigator.clipboard){
    navigator.clipboard.writeText(outEl.value).then(function(){
      toast('✓ Copied!');
    });
  }else{
    outEl.select();
    try{
      document.execCommand('copy');
      toast('✓ Copied!');
    }catch(e){}
  }
};

document.getElementById('smDl').onclick=function(){
  if(!outEl.value){
    toast('No summary yet',true);
    return;
  }
  var blob=new Blob([outEl.value],{type:'text/plain'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='summary.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  toast('⬇ Download started!');
};

})();
