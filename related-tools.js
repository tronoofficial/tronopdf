/* TronoPDF - Related Tools Section v1 | Auto-detect + SEO Internal Linking */
(function(){

/* ===== TOOL DATABASE ===== */
var TOOLS = {
  'compress-pdf': {name:'Compress PDF', icon:'🗜️', desc:'Reduce PDF file size', color:'#22c55e',
    related:['merge-pdf','split-pdf','protect-pdf','pdf-to-jpg']},
  'merge-pdf': {name:'Merge PDF', icon:'📑', desc:'Combine multiple PDFs', color:'#e11d48',
    related:['split-pdf','compress-pdf','organize-pdf','rotate-pdf']},
  'split-pdf': {name:'Split PDF', icon:'✂️', desc:'Extract pages from PDF', color:'#f97316',
    related:['merge-pdf','compress-pdf','organize-pdf','pdf-to-jpg']},
  'protect-pdf': {name:'Protect PDF', icon:'🔒', desc:'Add password to PDF', color:'#16a34a',
    related:['unlock-pdf','sign-pdf','compress-pdf','watermark-pdf']},
  'unlock-pdf': {name:'Unlock PDF', icon:'🔓', desc:'Remove PDF password', color:'#f59e0b',
    related:['protect-pdf','split-pdf','merge-pdf','compress-pdf']},
  'sign-pdf': {name:'Sign PDF', icon:'✍️', desc:'Add signature to PDF', color:'#ec4899',
    related:['protect-pdf','watermark-pdf','edit-pdf','pdf-forms']},
  'watermark-pdf': {name:'Watermark PDF', icon:'💧', desc:'Add watermark to PDF', color:'#3b82f6',
    related:['sign-pdf','protect-pdf','edit-pdf','compress-pdf']},
  'edit-pdf': {name:'Edit PDF', icon:'✏️', desc:'Edit text & images in PDF', color:'#a855f7',
    related:['sign-pdf','watermark-pdf','redact-pdf','crop-pdf']},
  'organize-pdf': {name:'Organize PDF', icon:'📂', desc:'Reorder & delete pages', color:'#84cc16',
    related:['merge-pdf','split-pdf','rotate-pdf','compress-pdf']},
  'crop-pdf': {name:'Crop PDF', icon:'🔲', desc:'Crop PDF pages', color:'#a855f7',
    related:['edit-pdf','rotate-pdf','compress-pdf','resize-pdf']},
  'rotate-pdf': {name:'Rotate PDF', icon:'🔄', desc:'Rotate PDF pages', color:'#14b8a6',
    related:['organize-pdf','merge-pdf','split-pdf','compress-pdf']},
  'repair-pdf': {name:'Repair PDF', icon:'🔧', desc:'Fix corrupted PDF', color:'#ef4444',
    related:['compress-pdf','merge-pdf','split-pdf','protect-pdf']},
  'compare-pdf': {name:'Compare PDF', icon:'🔍', desc:'Compare two PDFs', color:'#0891b2',
    related:['merge-pdf','split-pdf','edit-pdf','redact-pdf']},
  'redact-pdf': {name:'Redact PDF', icon:'⬛', desc:'Black out sensitive text', color:'#1e293b',
    related:['edit-pdf','protect-pdf','compare-pdf','sign-pdf']},
  'pdf-forms': {name:'PDF Forms', icon:'📋', desc:'Fill & create PDF forms', color:'#4f46e5',
    related:['sign-pdf','edit-pdf','protect-pdf','pdf-to-word']},
  'page-numbers': {name:'Page Numbers', icon:'🔢', desc:'Add page numbers', color:'#f59e0b',
    related:['watermark-pdf','edit-pdf','merge-pdf','pdf-forms']},
  'scan-to-pdf': {name:'Scan to PDF', icon:'📷', desc:'Camera to PDF', color:'#0ea5e9',
    related:['jpg-to-pdf','compress-pdf','image-resizer','ocr-pdf']},
  'pdf-to-word': {name:'PDF to Word', icon:'📝', desc:'Convert PDF to DOCX', color:'#2b7cd3',
    related:['word-to-pdf','pdf-to-excel','pdf-to-jpg','ocr-pdf']},
  'word-to-pdf': {name:'Word to PDF', icon:'📄', desc:'Convert DOCX to PDF', color:'#2b7cd3',
    related:['pdf-to-word','excel-to-pdf','powerpoint-to-pdf','html-to-pdf']},
  'pdf-to-excel': {name:'PDF to Excel', icon:'📊', desc:'Convert PDF to XLSX', color:'#217346',
    related:['excel-to-pdf','pdf-to-word','pdf-to-jpg','ocr-pdf']},
  'excel-to-pdf': {name:'Excel to PDF', icon:'📈', desc:'Convert XLSX to PDF', color:'#217346',
    related:['pdf-to-excel','word-to-pdf','powerpoint-to-pdf','pdf-to-word']},
  'pdf-to-powerpoint': {name:'PDF to PPT', icon:'📽️', desc:'Convert PDF to PPTX', color:'#d35230',
    related:['powerpoint-to-pdf','pdf-to-jpg','pdf-to-word','edit-pdf']},
  'powerpoint-to-pdf': {name:'PPT to PDF', icon:'🎬', desc:'Convert PPTX to PDF', color:'#d35230',
    related:['pdf-to-powerpoint','word-to-pdf','excel-to-pdf','pdf-to-word']},
  'pdf-to-jpg': {name:'PDF to JPG', icon:'🖼️', desc:'Convert PDF to images', color:'#eab308',
    related:['jpg-to-pdf','pdf-to-word','pdf-to-excel','image-converter']},
  'jpg-to-pdf': {name:'JPG to PDF', icon:'📸', desc:'Convert images to PDF', color:'#7c3aed',
    related:['pdf-to-jpg','image-converter','compress-pdf','scan-to-pdf']},
  'html-to-pdf': {name:'HTML to PDF', icon:'🌐', desc:'Convert HTML to PDF', color:'#0ea5e9',
    related:['pdf-to-word','word-to-pdf','edit-pdf','compress-pdf']},
  'pdf-to-markdown': {name:'PDF to Markdown', icon:'📑', desc:'Convert PDF to MD', color:'#334155',
    related:['pdf-to-word','ocr-pdf','translate-pdf','ai-summarizer']},
  'pdf-to-pdfa': {name:'PDF to PDF/A', icon:'🏛️', desc:'Archive-ready PDF', color:'#64748b',
    related:['protect-pdf','compress-pdf','repair-pdf','sign-pdf']},
  'ocr-pdf': {name:'OCR PDF', icon:'🔎', desc:'Extract text from scanned PDF', color:'#7c3aed',
    related:['pdf-to-word','translate-pdf','ai-summarizer','scan-to-pdf']},
  'ai-summarizer': {name:'AI Summarizer', icon:'🤖', desc:'Summarize PDF with AI', color:'#d946ef',
    related:['translate-pdf','ocr-pdf','pdf-to-markdown','pdf-to-word']},
  'translate-pdf': {name:'Translate PDF', icon:'🌍', desc:'Translate PDF to 50+ languages', color:'#0d9488',
    related:['ocr-pdf','ai-summarizer','pdf-to-word','pdf-to-markdown']},
  'image-compressor': {name:'Image Compressor', icon:'📦', desc:'Compress images to exact KB', color:'#3b82f6',
    related:['image-resizer','image-converter','blur-photo','jpg-to-pdf']},
  'image-resizer': {name:'Image Resizer', icon:'📐', desc:'Resize images to exact px', color:'#f59e0b',
    related:['image-compressor','passport-photo','image-crop','image-converter']},
  'passport-photo': {name:'Passport Photo', icon:'🛂', desc:'Make passport-size photos', color:'#ec4899',
    related:['image-resizer','image-crop','signature-resize','image-compressor']},
  'signature-resize': {name:'Signature Resize', icon:'✒️', desc:'Resize signature for forms', color:'#6366f1',
    related:['sign-pdf','image-resizer','passport-photo','image-crop']},
  'blur-photo': {name:'Blur Photo', icon:'🌫️', desc:'Blur photos for privacy', color:'#84cc16',
    related:['image-compressor','image-resizer','image-converter','redact-pdf']},
  'image-crop': {name:'Image Crop', icon:'✂️', desc:'Crop images to any ratio', color:'#a855f7',
    related:['image-resizer','passport-photo','image-converter','image-compressor']},
  'image-converter': {name:'Image Converter', icon:'🔀', desc:'Convert JPG/PNG/WEBP/BMP', color:'#0ea5e9',
    related:['image-compressor','image-resizer','jpg-to-pdf','pdf-to-jpg']},
  'resize-pdf': {name:'Resize PDF', icon:'📏', desc:'Resize PDF pages', color:'#8b5cf6',
    related:['crop-pdf','compress-pdf','rotate-pdf','organize-pdf']}
};

/* ===== DETECT CURRENT PAGE ===== */
function getCurrentTool() {
  var path = window.location.pathname;
  var file = path.split('/').pop().replace('.html', '');
  if (!file || file === 'index' || file === '') file = 'home';
  return file;
}

/* ===== RENDER RELATED TOOLS ===== */
function renderRelatedTools() {
  var current = getCurrentTool();
  var tool = TOOLS[current];
  
  if (!tool) return; /* No related tools for this page */
  
  var related = tool.related || [];
  if (related.length === 0) return;
  
  /* Build HTML */
  var html = '<div class="rt-section">';
  html += '<h2 class="rt-title">🔗 Related Tools</h2>';
  html += '<p class="rt-subtitle">You might also need these tools</p>';
  html += '<div class="rt-grid">';
  
  related.forEach(function(key) {
    var t = TOOLS[key];
    if (!t) return;
    html += '<a href="/' + key + '.html" class="rt-card" title="' + t.desc + '">';
    html += '<div class="rt-icon" style="background:' + t.color + '20;color:' + t.color + '">' + t.icon + '</div>';
    html += '<div class="rt-info">';
    html += '<div class="rt-name">' + t.name + '</div>';
    html += '<div class="rt-desc">' + t.desc + '</div>';
    html += '</div>';
    html += '<div class="rt-arrow">→</div>';
    html += '</a>';
  });
  
  html += '</div></div>';
  
  /* Inject CSS + HTML */
  var style = document.createElement('style');
  style.textContent = [
    '.rt-section{max-width:1200px;margin:40px auto;padding:0 20px}',
    '.rt-title{font-size:26px;font-weight:900;color:#1e1e2e;margin-bottom:6px}',
    '.rt-subtitle{font-size:14px;color:#8a8a99;margin-bottom:20px}',
    '.rt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}',
    '.rt-card{display:flex;align-items:center;gap:14px;padding:16px 18px;background:#fff;border:1px solid #eceaf6;border-radius:14px;text-decoration:none;color:inherit;transition:all .25s ease}',
    '.rt-card:hover{border-color:#7c3aed;box-shadow:0 8px 24px rgba(124,58,237,.12);transform:translateY(-3px)}',
    '.rt-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}',
    '.rt-info{flex:1;min-width:0}',
    '.rt-name{font-size:14px;font-weight:800;color:#1e1e2e;margin-bottom:2px}',
    '.rt-desc{font-size:12px;color:#8a8a99;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.rt-arrow{font-size:16px;color:#c4c4d4;transition:transform .2s}',
    '.rt-card:hover .rt-arrow{transform:translateX(4px);color:#7c3aed}',
    '@media(max-width:600px){.rt-grid{grid-template-columns:1fr}.rt-section{padding:0 16px;margin:30px auto}}'
  ].join('\n');
  document.head.appendChild(style);
  
  /* Insert before footer or at end of body */
  var footer = document.querySelector('footer') || document.getElementById('siteFooter');
  if (footer) {
    footer.insertAdjacentHTML('beforebegin', html);
  } else {
    document.body.insertAdjacentHTML('beforeend', html);
  }
}

/* ===== RUN ON DOM READY ===== */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderRelatedTools);
} else {
  renderRelatedTools();
}

})();
