/* TronoPDF - shared header/footer/icons with mobile drawer + related tools */
(function(){
document.body.insertAdjacentHTML('afterbegin','<svg style="display:none" xmlns="http://www.w3.org/2000/svg"><symbol id="i-merge" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#e11d48"/><rect x="11" y="9" width="17" height="21" rx="2.5" fill="#fff" opacity=".75"/><rect x="20" y="17" width="17" height="21" rx="2.5" fill="#fff"/><path d="M28.5 24.5v6M25.5 27.5h6" stroke="#e11d48" stroke-width="2.6" stroke-linecap="round"/></symbol><symbol id="i-split" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#f97316"/><rect x="17" y="8" width="14" height="18" rx="2.5" fill="#fff"/><path d="M20 34h-8M28 34h8" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M16 31l-4 3 4 3M32 31l4 3-4 3" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></symbol><symbol id="i-compress" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#22c55e"/><path d="M14 14l8 8M34 14l-8 8M14 34l8-8M34 34l-8-8" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/><circle cx="24" cy="24" r="2.5" fill="#fff"/></symbol><symbol id="i-pdf2word" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#2b7cd3"/><path d="M14 8h13l8 8v24H14z" fill="#fff" opacity=".92"/><text x="24" y="31" font-family="Inter,Arial" font-size="15" font-weight="800" fill="#2b7cd3" text-anchor="middle">W</text></symbol><symbol id="i-pdf2ppt" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#d35230"/><path d="M14 8h13l8 8v24H14z" fill="#fff" opacity=".92"/><text x="24" y="31" font-family="Inter,Arial" font-size="15" font-weight="800" fill="#d35230" text-anchor="middle">P</text></symbol><symbol id="i-pdf2excel" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#217346"/><path d="M14 8h13l8 8v24H14z" fill="#fff" opacity=".92"/><text x="24" y="31" font-family="Inter,Arial" font-size="15" font-weight="800" fill="#217346" text-anchor="middle">X</text></symbol><symbol id="i-word2pdf" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#2b7cd3"/><rect x="10" y="10" width="16" height="16" rx="3" fill="#fff"/><text x="18" y="22" font-family="Inter,Arial" font-size="11" font-weight="800" fill="#2b7cd3" text-anchor="middle">W</text><path d="M21 22h13l6 6v12H21z" fill="#fff" opacity=".92"/></symbol><symbol id="i-ppt2pdf" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#d35230"/><rect x="10" y="10" width="16" height="16" rx="3" fill="#fff"/><text x="18" y="22" font-family="Inter,Arial" font-size="11" font-weight="800" fill="#d35230" text-anchor="middle">P</text><path d="M21 22h13l6 6v12H21z" fill="#fff" opacity=".92"/></symbol><symbol id="i-excel2pdf" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#217346"/><rect x="10" y="10" width="16" height="16" rx="3" fill="#fff"/><text x="18" y="22" font-family="Inter,Arial" font-size="11" font-weight="800" fill="#217346" text-anchor="middle">X</text><path d="M21 22h13l6 6v12H21z" fill="#fff" opacity=".92"/></symbol><symbol id="i-edit" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#a855f7"/><path d="M14 8h13l8 8v24H14z" fill="#fff" opacity=".9"/><path d="M31 15l6 6-13 13-7 1 1-7z" fill="#a855f7" stroke="#fff" stroke-width="1.5"/></symbol><symbol id="i-pdf2jpg" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#eab308"/><path d="M13 8h13l8 8v18H13z" fill="#fff" opacity=".9"/><rect x="20" y="24" width="17" height="14" rx="2.5" fill="#fff"/><circle cx="25" cy="29" r="2" fill="#eab308"/><path d="M22 36l5-5 3 3 3-4 4 6z" fill="#eab308"/></symbol><symbol id="i-jpg2pdf" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#7c3aed"/><rect x="11" y="10" width="16" height="13" rx="2.5" fill="#fff" opacity=".85"/><circle cx="15.5" cy="14" r="1.8" fill="#7c3aed"/><path d="M13 21l4-4 3 3 3-3 4 4z" fill="#7c3aed"/><path d="M21 20h13l6 6v12H21z" fill="#fff"/></symbol><symbol id="i-sign" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#ec4899"/><path d="M14 8h13l8 8v24H14z" fill="#fff" opacity=".9"/><path d="M18 30c2-4 4 2 6-2s4 2 6-2" fill="none" stroke="#ec4899" stroke-width="2.6" stroke-linecap="round"/></symbol><symbol id="i-watermark" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#3b82f6"/><path d="M15 8h12l8 8v24H15z" fill="#fff" opacity=".9"/><path d="M24 17c4 5.5 7 8.6 7 12a7 7 0 1 1-14 0c0-3.4 3-6.5 7-12z" fill="#3b82f6"/></symbol><symbol id="i-rotate" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#14b8a6"/><path d="M33 20a11 11 0 1 0 3 8" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/><path d="M33 12v8h-8" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></symbol><symbol id="i-html" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#0ea5e9"/><circle cx="24" cy="24" r="12" fill="none" stroke="#fff" stroke-width="3"/><path d="M12 24h24M24 12c-7 8-7 16 0 24M24 12c7 8 7 16 0 24" fill="none" stroke="#fff" stroke-width="2.4"/></symbol><symbol id="i-unlock" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#f59e0b"/><rect x="14" y="22" width="20" height="15" rx="3" fill="#fff"/><path d="M19 22v-6a5 5 0 0 1 9.5-2" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></symbol><symbol id="i-protect" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#16a34a"/><rect x="14" y="22" width="20" height="15" rx="3" fill="#fff"/><path d="M19 22v-5a5 5 0 0 1 10 0v5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></symbol><symbol id="i-organize" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#84cc16"/><rect x="21" y="12" width="15" height="19" rx="2" fill="#fff"/><path d="M12 20l4-5 4 5zM12 28l4 5 4-5z" fill="#fff"/></symbol><symbol id="i-pdfa" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#64748b"/><path d="M14 8h13l8 8v24H14z" fill="#fff" opacity=".92"/><text x="24" y="31" font-family="Inter,Arial" font-size="15" font-weight="800" fill="#64748b" text-anchor="middle">A</text></symbol><symbol id="i-repair" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#ef4444"/><path d="M30 12a7 7 0 0 0-9 9L13 29l6 6 8-8a7 7 0 0 0 9-9l-4.5 4.5-4-1-1-4z" fill="#fff"/></symbol><symbol id="i-pagenum" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#f59e0b"/><path d="M15 8h12l8 8v24H15z" fill="#fff"/><text x="24" y="31" font-family="Inter,Arial" font-size="17" font-weight="800" fill="#f59e0b" text-anchor="middle">#</text></symbol><symbol id="i-scan" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#0ea5e9"/><path d="M12 16v-4h4M36 16v-4h-4M12 32v4h4M36 32v4h-4" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M12 24h24" stroke="#fff" stroke-width="3" stroke-linecap="round"/></symbol><symbol id="i-ocr" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#7c3aed"/><path d="M13 8h13l8 8v24H13z" fill="#fff" opacity=".92"/><circle cx="22" cy="24" r="5" fill="none" stroke="#7c3aed" stroke-width="2.6"/><path d="M26 28l5 5" stroke="#7c3aed" stroke-width="2.6" stroke-linecap="round"/></symbol><symbol id="i-compare" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#0891b2"/><rect x="10" y="12" width="12" height="24" rx="2" fill="#fff"/><rect x="26" y="12" width="12" height="24" rx="2" fill="#fff" opacity=".6"/><path d="M24 8v32" stroke="#fff" stroke-width="2.4" stroke-dasharray="4 3"/></symbol><symbol id="i-redact" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#1e293b"/><path d="M15 8h12l8 8v24H15z" fill="#fff" opacity=".92"/><path d="M19 20h10M19 26h10M19 32h6" stroke="#1e293b" stroke-width="3.4" stroke-linecap="round"/></symbol><symbol id="i-crop" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#a855f7"/><path d="M16 10v22h22M10 16h22v22" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></symbol><symbol id="i-forms" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#4f46e5"/><path d="M14 8h13l8 8v24H14z" fill="#fff" opacity=".92"/><rect x="18" y="18" width="5" height="5" rx="1" fill="#4f46e5"/><path d="M26 20.5h7M18 28h5M26 28h7" stroke="#4f46e5" stroke-width="2.2" stroke-linecap="round"/></symbol><symbol id="i-summarize" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#d946ef"/><path d="M24 10l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#fff"/><circle cx="34" cy="34" r="3" fill="#fff" opacity=".7"/></symbol><symbol id="i-translate" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#0d9488"/><text x="16" y="26" font-family="Inter,Arial" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">A</text><text x="32" y="34" font-family="Inter,Arial" font-size="14" font-weight="800" fill="#fff" opacity=".8" text-anchor="middle">अ</text></symbol><symbol id="i-markdown" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#334155"/><text x="24" y="30" font-family="Inter,Arial" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">MD</text></symbol><symbol id="i-imgcomp" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#3b82f6"/><rect x="12" y="9" width="24" height="19" rx="3" fill="#fff"/><circle cx="18" cy="15" r="2.4" fill="#3b82f6"/><path d="M15 25l6-6 4 4 4-5 5 7z" fill="#3b82f6"/><path d="M24 31v8m0 0l-3.5-3.5M24 39l3.5-3.5" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></symbol><symbol id="i-imgres" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#f59e0b"/><rect x="15" y="15" width="18" height="18" rx="3" fill="#fff"/><circle cx="20" cy="20" r="2.2" fill="#f59e0b"/><path d="M10 16v-6h6M38 16v-6h-6M10 32v6h6M38 32v6h-6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></symbol><symbol id="i-passport" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#ec4899"/><rect x="10" y="13" width="28" height="22" rx="3" fill="#fff"/><circle cx="18" cy="21" r="3.5" fill="#ec4899"/><path d="M13 30c1-3.5 9-3.5 10 0z" fill="#ec4899"/><path d="M26 19h8M26 24h8M26 29h5" stroke="#ec4899" stroke-width="2.2" stroke-linecap="round"/></symbol><symbol id="i-signres" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#6366f1"/><path d="M30 10l8 8-14 14-9 1 1-9z" fill="#fff"/><path d="M12 38h24" stroke="#fff" stroke-width="3" stroke-linecap="round"/></symbol><symbol id="i-convert" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#0ea5e9"/><rect x="15" y="15" width="18" height="18" rx="3" fill="#fff"/><circle cx="20" cy="20" r="2" fill="#0ea5e9"/><path d="M34 16a12 12 0 0 0-20-2M14 32a12 12 0 0 0 20 2" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M34 10v6h-6M14 38v-6h6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></symbol><symbol id="i-blur" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#84cc16"/><rect x="12" y="12" width="24" height="24" rx="4" fill="#fff"/><circle cx="20" cy="20" r="4" fill="#84cc16"/><circle cx="28" cy="26" r="5" fill="#84cc16" opacity=".55"/><circle cx="19" cy="28" r="3" fill="#84cc16" opacity=".35"/></symbol></svg>');

var h=document.getElementById('siteHeader');
if(h){
  h.innerHTML=`<div class="hwrap">
    <a class="logo" href="/">
      <svg class="lsvg" viewBox="0 0 48 48">
        <defs>
          <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#7c3aed"/>
            <stop offset="1" stop-color="#f59e0b"/>
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="12" fill="url(#lg1)"/>
        <path d="M10 30l4-12 7 7 3-9 3 9 7-7 4 12z" fill="#fff"/>
        <rect x="12" y="32" width="24" height="4" rx="2" fill="#fff"/>
      </svg>
      <span class="lword">Trono<b>PDF</b></span>
    </a>
    <nav class="mnav">
      <a class="ni" href="/merge-pdf">Merge PDF</a>
      <a class="ni" href="/split-pdf">Split PDF</a>
      <a class="ni" href="/compress-pdf">Compress PDF</a>
      <div class="dd">
        <span class="ni">Convert PDF <span class="caret">▾</span></span>
        <div class="panel p2">
          <div class="pinner">
            <div class="pcol">
              <h5>Convert to PDF</h5>
              <a href="/jpg-to-pdf"><svg viewBox="0 0 48 48"><use href="#i-jpg2pdf"/></svg>JPG to PDF</a>
              <a href="/word-to-pdf"><svg viewBox="0 0 48 48"><use href="#i-word2pdf"/></svg>Word to PDF</a>
              <a href="/powerpoint-to-pdf"><svg viewBox="0 0 48 48"><use href="#i-ppt2pdf"/></svg>PowerPoint to PDF</a>
              <a href="/excel-to-pdf"><svg viewBox="0 0 48 48"><use href="#i-excel2pdf"/></svg>Excel to PDF</a>
              <a href="/html-to-pdf"><svg viewBox="0 0 48 48"><use href="#i-html"/></svg>HTML to PDF</a>
            </div>
            <div class="pcol">
              <h5>Convert from PDF</h5>
              <a href="/pdf-to-jpg"><svg viewBox="0 0 48 48"><use href="#i-pdf2jpg"/></svg>PDF to JPG</a>
              <a href="/pdf-to-word"><svg viewBox="0 0 48 48"><use href="#i-pdf2word"/></svg>PDF to Word</a>
              <a href="/pdf-to-powerpoint"><svg viewBox="0 0 48 48"><use href="#i-pdf2ppt"/></svg>PDF to PowerPoint</a>
              <a href="/pdf-to-excel"><svg viewBox="0 0 48 48"><use href="#i-pdf2excel"/></svg>PDF to Excel</a>
              <a href="/pdf-to-pdfa"><svg viewBox="0 0 48 48"><use href="#i-pdfa"/></svg>PDF to PDF/A</a>
            </div>
          </div>
        </div>
      </div>
      <div class="dd">
        <span class="ni">All PDF Tools <span class="caret">▾</span></span>
        <div class="panel mega">
          <div class="pinner">
            <div class="pcol">
              <h5>Organize PDF</h5>
              <a href="/merge-pdf"><svg viewBox="0 0 48 48"><use href="#i-merge"/></svg>Merge PDF</a>
              <a href="/split-pdf"><svg viewBox="0 0 48 48"><use href="#i-split"/></svg>Split PDF</a>
              <a href="/organize-pdf"><svg viewBox="0 0 48 48"><use href="#i-organize"/></svg>Organize PDF</a>
              <a href="/rotate-pdf"><svg viewBox="0 0 48 48"><use href="#i-rotate"/></svg>Rotate PDF</a>
              <a href="/crop-pdf"><svg viewBox="0 0 48 48"><use href="#i-crop"/></svg>Crop PDF</a>
              <h5 style="margin-top:18px">Optimize PDF</h5>
              <a href="/compress-pdf"><svg viewBox="0 0 48 48"><use href="#i-compress"/></svg>Compress PDF</a>
              <a href="/repair-pdf"><svg viewBox="0 0 48 48"><use href="#i-repair"/></svg>Repair PDF</a>
            </div>
            <div class="pcol">
              <h5>Convert to PDF</h5>
              <a href="/jpg-to-pdf"><svg viewBox="0 0 48 48"><use href="#i-jpg2pdf"/></svg>JPG to PDF</a>
              <a href="/word-to-pdf"><svg viewBox="0 0 48 48"><use href="#i-word2pdf"/></svg>Word to PDF</a>
              <a href="/excel-to-pdf"><svg viewBox="0 0 48 48"><use href="#i-excel2pdf"/></svg>Excel to PDF</a>
              <a href="/powerpoint-to-pdf"><svg viewBox="0 0 48 48"><use href="#i-ppt2pdf"/></svg>PowerPoint to PDF</a>
              <a href="/html-to-pdf"><svg viewBox="0 0 48 48"><use href="#i-html"/></svg>HTML to PDF</a>
              <h5 style="margin-top:18px">Convert from PDF</h5>
              <a href="/pdf-to-jpg"><svg viewBox="0 0 48 48"><use href="#i-pdf2jpg"/></svg>PDF to JPG</a>
              <a href="/pdf-to-word"><svg viewBox="0 0 48 48"><use href="#i-pdf2word"/></svg>PDF to Word</a>
              <a href="/pdf-to-excel"><svg viewBox="0 0 48 48"><use href="#i-pdf2excel"/></svg>PDF to Excel</a>
            </div>
            <div class="pcol">
              <h5>Edit PDF</h5>
              <a href="/edit-pdf"><svg viewBox="0 0 48 48"><use href="#i-edit"/></svg>Edit PDF</a>
              <a href="/pdf-forms"><svg viewBox="0 0 48 48"><use href="#i-forms"/></svg>PDF Forms</a>
              <a href="/page-numbers"><svg viewBox="0 0 48 48"><use href="#i-pagenum"/></svg>Page numbers</a>
              <a href="/watermark-pdf"><svg viewBox="0 0 48 48"><use href="#i-watermark"/></svg>Watermark</a>
              <a href="/sign-pdf"><svg viewBox="0 0 48 48"><use href="#i-sign"/></svg>Sign PDF</a>
              <a href="/scan-to-pdf"><svg viewBox="0 0 48 48"><use href="#i-scan"/></svg>Scan to PDF</a>
              <a href="/compare-pdf"><svg viewBox="0 0 48 48"><use href="#i-compare"/></svg>Compare PDF</a>
              <a href="/redact-pdf"><svg viewBox="0 0 48 48"><use href="#i-redact"/></svg>Redact PDF</a>
            </div>
            <div class="pcol">
              <h5>PDF Security</h5>
              <a href="/unlock-pdf"><svg viewBox="0 0 48 48"><use href="#i-unlock"/></svg>Unlock PDF</a>
              <a href="/protect-pdf"><svg viewBox="0 0 48 48"><use href="#i-protect"/></svg>Protect PDF</a>
              <h5 style="margin-top:18px">PDF Intelligence</h5>
              <a href="/ocr-pdf"><svg viewBox="0 0 48 48"><use href="#i-ocr"/></svg>OCR PDF</a>
              <a href="/ai-summarizer"><svg viewBox="0 0 48 48"><use href="#i-summarize"/></svg>AI Summarizer</a>
              <a href="/translate-pdf"><svg viewBox="0 0 48 48"><use href="#i-translate"/></svg>Translate PDF</a>
              <a href="/pdf-to-markdown"><svg viewBox="0 0 48 48"><use href="#i-markdown"/></svg>PDF to Markdown</a>
              <h5 style="margin-top:18px">Image Tools</h5>
              <a href="/image-compressor"><svg viewBox="0 0 48 48"><use href="#i-imgcomp"/></svg>Image Compressor</a>
              <a href="/image-resizer"><svg viewBox="0 0 48 48"><use href="#i-imgres"/></svg>Image Resizer</a>
              <a href="/passport-photo"><svg viewBox="0 0 48 48"><use href="#i-passport"/></svg>Passport Photo</a>
              <a href="/signature-resize"><svg viewBox="0 0 48 48"><use href="#i-signres"/></svg>Signature Resize</a>
              <a href="/image-converter"><svg viewBox="0 0 48 48"><use href="#i-convert"/></svg>Image Converter</a>
              <a href="/blur-photo"><svg viewBox="0 0 48 48"><use href="#i-blur"/></svg>Blur Photo</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div class="hright">
      <a class="hlink" href="/about">About</a>
      <a class="hbtn" href="/contact">Contact</a>
      <button class="hamburger" id="hamburgerBtn" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>`;
}

/* Mobile drawer */
document.body.insertAdjacentHTML('beforeend', `
  <div class="drawer-overlay" id="drawerOverlay"></div>
  <div class="drawer" id="drawer">
    <div class="drawer-header">
      <h3>TronoPDF 👑</h3>
      <button class="drawer-close" id="drawerClose" aria-label="Close menu">✕</button>
    </div>
    <div class="drawer-body">
      <a class="drawer-link" href="/merge-pdf"><svg viewBox="0 0 48 48"><use href="#i-merge"/></svg>Merge PDF</a>
      <a class="drawer-link" href="/split-pdf"><svg viewBox="0 0 48 48"><use href="#i-split"/></svg>Split PDF</a>
      <a class="drawer-link" href="/compress-pdf"><svg viewBox="0 0 48 48"><use href="#i-compress"/></svg>Compress PDF</a>
      
      <div class="drawer-acc">
        <div class="drawer-acc-head">Convert to PDF <span class="arr">▾</span></div>
        <div class="drawer-acc-body">
          <a class="drawer-link" href="/jpg-to-pdf"><svg viewBox="0 0 48 48"><use href="#i-jpg2pdf"/></svg>JPG to PDF</a>
          <a class="drawer-link" href="/word-to-pdf"><svg viewBox="0 0 48 48"><use href="#i-word2pdf"/></svg>Word to PDF</a>
          <a class="drawer-link" href="/powerpoint-to-pdf"><svg viewBox="0 0 48 48"><use href="#i-ppt2pdf"/></svg>PPT to PDF</a>
          <a class="drawer-link" href="/excel-to-pdf"><svg viewBox="0 0 48 48"><use href="#i-excel2pdf"/></svg>Excel to PDF</a>
          <a class="drawer-link" href="/html-to-pdf"><svg viewBox="0 0 48 48"><use href="#i-html"/></svg>HTML to PDF</a>
        </div>
      </div>
      
      <div class="drawer-acc">
        <div class="drawer-acc-head">Convert from PDF <span class="arr">▾</span></div>
        <div class="drawer-acc-body">
          <a class="drawer-link" href="/pdf-to-jpg"><svg viewBox="0 0 48 48"><use href="#i-pdf2jpg"/></svg>PDF to JPG</a>
          <a class="drawer-link" href="/pdf-to-word"><svg viewBox="0 0 48 48"><use href="#i-pdf2word"/></svg>PDF to Word</a>
          <a class="drawer-link" href="/pdf-to-powerpoint"><svg viewBox="0 0 48 48"><use href="#i-pdf2ppt"/></svg>PDF to PPT</a>
          <a class="drawer-link" href="/pdf-to-excel"><svg viewBox="0 0 48 48"><use href="#i-pdf2excel"/></svg>PDF to Excel</a>
          <a class="drawer-link" href="/pdf-to-markdown"><svg viewBox="0 0 48 48"><use href="#i-markdown"/></svg>PDF to Markdown</a>
          <a class="drawer-link" href="/pdf-to-pdfa"><svg viewBox="0 0 48 48"><use href="#i-pdfa"/></svg>PDF to PDF/A</a>
        </div>
      </div>
      
      <div class="drawer-acc">
        <div class="drawer-acc-head">Organize PDF <span class="arr">▾</span></div>
        <div class="drawer-acc-body">
          <a class="drawer-link" href="/organize-pdf"><svg viewBox="0 0 48 48"><use href="#i-organize"/></svg>Organize PDF</a>
          <a class="drawer-link" href="/rotate-pdf"><svg viewBox="0 0 48 48"><use href="#i-rotate"/></svg>Rotate PDF</a>
          <a class="drawer-link" href="/crop-pdf"><svg viewBox="0 0 48 48"><use href="#i-crop"/></svg>Crop PDF</a>
          <a class="drawer-link" href="/page-numbers"><svg viewBox="0 0 48 48"><use href="#i-pagenum"/></svg>Page Numbers</a>
          <a class="drawer-link" href="/repair-pdf"><svg viewBox="0 0 48 48"><use href="#i-repair"/></svg>Repair PDF</a>
        </div>
      </div>
      
      <div class="drawer-acc">
        <div class="drawer-acc-head">Edit PDF <span class="arr">▾</span></div>
        <div class="drawer-acc-body">
          <a class="drawer-link" href="/edit-pdf"><svg viewBox="0 0 48 48"><use href="#i-edit"/></svg>Edit PDF</a>
          <a class="drawer-link" href="/pdf-forms"><svg viewBox="0 0 48 48"><use href="#i-forms"/></svg>PDF Forms</a>
          <a class="drawer-link" href="/watermark-pdf"><svg viewBox="0 0 48 48"><use href="#i-watermark"/></svg>Watermark</a>
          <a class="drawer-link" href="/sign-pdf"><svg viewBox="0 0 48 48"><use href="#i-sign"/></svg>Sign PDF</a>
          <a class="drawer-link" href="/compare-pdf"><svg viewBox="0 0 48 48"><use href="#i-compare"/></svg>Compare PDF</a>
          <a class="drawer-link" href="/redact-pdf"><svg viewBox="0 0 48 48"><use href="#i-redact"/></svg>Redact PDF</a>
          <a class="drawer-link" href="/scan-to-pdf"><svg viewBox="0 0 48 48"><use href="#i-scan"/></svg>Scan to PDF</a>
        </div>
      </div>
      
      <div class="drawer-acc">
        <div class="drawer-acc-head">Security <span class="arr">▾</span></div>
        <div class="drawer-acc-body">
          <a class="drawer-link" href="/unlock-pdf"><svg viewBox="0 0 48 48"><use href="#i-unlock"/></svg>Unlock PDF</a>
          <a class="drawer-link" href="/protect-pdf"><svg viewBox="0 0 48 48"><use href="#i-protect"/></svg>Protect PDF</a>
        </div>
      </div>
      
      <div class="drawer-acc">
        <div class="drawer-acc-head">AI Tools <span class="arr">▾</span></div>
        <div class="drawer-acc-body">
          <a class="drawer-link" href="/ocr-pdf"><svg viewBox="0 0 48 48"><use href="#i-ocr"/></svg>OCR PDF</a>
          <a class="drawer-link" href="/ai-summarizer"><svg viewBox="0 0 48 48"><use href="#i-summarize"/></svg>AI Summarizer</a>
          <a class="drawer-link" href="/translate-pdf"><svg viewBox="0 0 48 48"><use href="#i-translate"/></svg>Translate PDF</a>
        </div>
      </div>
      
      <div class="drawer-acc">
        <div class="drawer-acc-head">Image Tools <span class="arr">▾</span></div>
        <div class="drawer-acc-body">
          <a class="drawer-link" href="/image-compressor"><svg viewBox="0 0 48 48"><use href="#i-imgcomp"/></svg>Image Compressor</a>
          <a class="drawer-link" href="/image-resizer"><svg viewBox="0 0 48 48"><use href="#i-imgres"/></svg>Image Resizer</a>
          <a class="drawer-link" href="/image-crop"><svg viewBox="0 0 48 48"><use href="#i-crop"/></svg>Image Crop</a>
          <a class="drawer-link" href="/image-converter"><svg viewBox="0 0 48 48"><use href="#i-convert"/></svg>Image Converter</a>
          <a class="drawer-link" href="/passport-photo"><svg viewBox="0 0 48 48"><use href="#i-passport"/></svg>Passport Photo</a>
          <a class="drawer-link" href="/signature-resize"><svg viewBox="0 0 48 48"><use href="#i-signres"/></svg>Signature Resize</a>
          <a class="drawer-link" href="/blur-photo"><svg viewBox="0 0 48 48"><use href="#i-blur"/></svg>Blur Photo</a>
        </div>
      </div>
      
      <div style="padding:16px 0;border-top:1px solid #eceaf6;margin-top:16px;display:flex;gap:10px;flex-direction:column">
        <a class="drawer-link" href="/about"><svg viewBox="0 0 48 48" style="background:#7c3aed"><circle cx="24" cy="24" r="12" fill="#fff" opacity=".3"/><text x="24" y="29" font-family="Arial" font-size="14" font-weight="800" fill="#fff" text-anchor="middle">i</text></svg>About</a>
        <a class="drawer-link" href="/contact"><svg viewBox="0 0 48 48" style="background:#f59e0b"><path d="M14 16h20v16H14z" fill="#fff" opacity=".3"/><path d="M14 16l10 8 10-8" stroke="#fff" stroke-width="2" fill="none"/></svg>Contact</a>
      </div>
    </div>
  </div>
`);

/* Drawer logic */
var hamburger = document.getElementById('hamburgerBtn');
var drawer = document.getElementById('drawer');
var overlay = document.getElementById('drawerOverlay');
var closeBtn = document.getElementById('drawerClose');

function openDrawer(){
  drawer.classList.add('active');
  overlay.classList.add('active');
  hamburger.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeDrawer(){
  drawer.classList.remove('active');
  overlay.classList.remove('active');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
}

if(hamburger) hamburger.addEventListener('click', openDrawer);
if(closeBtn) closeBtn.addEventListener('click', closeDrawer);
if(overlay) overlay.addEventListener('click', closeDrawer);

document.querySelectorAll('.drawer-acc-head').forEach(function(head){
  head.addEventListener('click', function(){
    var acc = head.parentElement;
    acc.classList.toggle('open');
  });
});

document.querySelectorAll('.drawer-link').forEach(function(link){
  link.addEventListener('click', function(){
    setTimeout(closeDrawer, 100);
  });
});

document.addEventListener('keydown', function(e){
  if(e.key === 'Escape' && drawer.classList.contains('active')){
    closeDrawer();
  }
});

document.querySelectorAll('.tcard.soon, .drawer-link.soon').forEach(function(el){
  el.addEventListener('click', function(e){
    e.preventDefault();
    var toast = document.createElement('div');
    toast.textContent = '🚧 Coming Soon! This tool will be available shortly.';
    toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#1e1e2e;color:#fff;padding:12px 24px;border-radius:999px;font-size:14px;font-weight:600;z-index:9999;box-shadow:0 10px 30px rgba(0,0,0,.3);animation:fadeInUp .3s';
    document.body.appendChild(toast);
    setTimeout(function(){ toast.remove(); }, 2500);
  });
});

if(!document.querySelector('meta[name="theme-color"]')){
  var meta = document.createElement('meta');
  meta.name = 'theme-color';
  meta.content = '#7c3aed';
  document.head.appendChild(meta);
}

/* ===== RELATED TOOLS DATABASE ===== */
var TOOLS={
'compress-pdf':{name:'Compress PDF',icon:'🗜️',desc:'Reduce PDF file size',color:'#22c55e',related:['merge-pdf','split-pdf','protect-pdf','pdf-to-jpg']},
'merge-pdf':{name:'Merge PDF',icon:'📑',desc:'Combine multiple PDFs',color:'#e11d48',related:['split-pdf','compress-pdf','organize-pdf','rotate-pdf']},
'split-pdf':{name:'Split PDF',icon:'✂️',desc:'Extract pages from PDF',color:'#f97316',related:['merge-pdf','compress-pdf','organize-pdf','pdf-to-jpg']},
'protect-pdf':{name:'Protect PDF',icon:'🔒',desc:'Add password to PDF',color:'#16a34a',related:['unlock-pdf','sign-pdf','compress-pdf','watermark-pdf']},
'unlock-pdf':{name:'Unlock PDF',icon:'🔓',desc:'Remove PDF password',color:'#f59e0b',related:['protect-pdf','split-pdf','merge-pdf','compress-pdf']},
'sign-pdf':{name:'Sign PDF',icon:'✍️',desc:'Add signature to PDF',color:'#ec4899',related:['protect-pdf','watermark-pdf','edit-pdf','pdf-forms']},
'watermark-pdf':{name:'Watermark PDF',icon:'💧',desc:'Add watermark to PDF',color:'#3b82f6',related:['sign-pdf','protect-pdf','edit-pdf','compress-pdf']},
'edit-pdf':{name:'Edit PDF',icon:'✏️',desc:'Edit text & images in PDF',color:'#a855f7',related:['sign-pdf','watermark-pdf','redact-pdf','crop-pdf']},
'organize-pdf':{name:'Organize PDF',icon:'📂',desc:'Reorder & delete pages',color:'#84cc16',related:['merge-pdf','split-pdf','rotate-pdf','compress-pdf']},
'crop-pdf':{name:'Crop PDF',icon:'🔲',desc:'Crop PDF pages',color:'#a855f7',related:['edit-pdf','rotate-pdf','compress-pdf','split-pdf']},
'rotate-pdf':{name:'Rotate PDF',icon:'🔄',desc:'Rotate PDF pages',color:'#14b8a6',related:['organize-pdf','merge-pdf','split-pdf','compress-pdf']},
'repair-pdf':{name:'Repair PDF',icon:'🔧',desc:'Fix corrupted PDF',color:'#ef4444',related:['compress-pdf','merge-pdf','split-pdf','protect-pdf']},
'compare-pdf':{name:'Compare PDF',icon:'🔍',desc:'Compare two PDFs',color:'#0891b2',related:['merge-pdf','split-pdf','edit-pdf','redact-pdf']},
'redact-pdf':{name:'Redact PDF',icon:'⬛',desc:'Black out sensitive text',color:'#1e293b',related:['edit-pdf','protect-pdf','compare-pdf','sign-pdf']},
'pdf-forms':{name:'PDF Forms',icon:'📋',desc:'Fill & create PDF forms',color:'#4f46e5',related:['sign-pdf','edit-pdf','protect-pdf','pdf-to-word']},
'page-numbers':{name:'Page Numbers',icon:'🔢',desc:'Add page numbers',color:'#f59e0b',related:['watermark-pdf','edit-pdf','merge-pdf','pdf-forms']},
'scan-to-pdf':{name:'Scan to PDF',icon:'📷',desc:'Camera to PDF',color:'#0ea5e9',related:['jpg-to-pdf','compress-pdf','image-resizer','ocr-pdf']},
'pdf-to-word':{name:'PDF to Word',icon:'📝',desc:'Convert PDF to DOCX',color:'#2b7cd3',related:['word-to-pdf','pdf-to-excel','pdf-to-jpg','ocr-pdf']},
'word-to-pdf':{name:'Word to PDF',icon:'📄',desc:'Convert DOCX to PDF',color:'#2b7cd3',related:['pdf-to-word','excel-to-pdf','powerpoint-to-pdf','html-to-pdf']},
'pdf-to-excel':{name:'PDF to Excel',icon:'📊',desc:'Convert PDF to XLSX',color:'#217346',related:['excel-to-pdf','pdf-to-word','pdf-to-jpg','ocr-pdf']},
'excel-to-pdf':{name:'Excel to PDF',icon:'📈',desc:'Convert XLSX to PDF',color:'#217346',related:['pdf-to-excel','word-to-pdf','powerpoint-to-pdf','pdf-to-word']},
'pdf-to-powerpoint':{name:'PDF to PPT',icon:'📽️',desc:'Convert PDF to PPTX',color:'#d35230',related:['powerpoint-to-pdf','pdf-to-jpg','pdf-to-word','edit-pdf']},
'powerpoint-to-pdf':{name:'PPT to PDF',icon:'🎬',desc:'Convert PPTX to PDF',color:'#d35230',related:['pdf-to-powerpoint','word-to-pdf','excel-to-pdf','pdf-to-word']},
'pdf-to-jpg':{name:'PDF to JPG',icon:'🖼️',desc:'Convert PDF to images',color:'#eab308',related:['jpg-to-pdf','pdf-to-word','pdf-to-excel','image-converter']},
'jpg-to-pdf':{name:'JPG to PDF',icon:'📸',desc:'Convert images to PDF',color:'#7c3aed',related:['pdf-to-jpg','image-converter','compress-pdf','scan-to-pdf']},
'html-to-pdf':{name:'HTML to PDF',icon:'🌐',desc:'Convert HTML to PDF',color:'#0ea5e9',related:['pdf-to-word','word-to-pdf','edit-pdf','compress-pdf']},
'pdf-to-markdown':{name:'PDF to Markdown',icon:'📑',desc:'Convert PDF to MD',color:'#334155',related:['pdf-to-word','ocr-pdf','translate-pdf','ai-summarizer']},
'pdf-to-pdfa':{name:'PDF to PDF/A',icon:'🏛️',desc:'Archive-ready PDF',color:'#64748b',related:['protect-pdf','compress-pdf','repair-pdf','sign-pdf']},
'ocr-pdf':{name:'OCR PDF',icon:'🔎',desc:'Extract text from scanned PDF',color:'#7c3aed',related:['pdf-to-word','translate-pdf','ai-summarizer','scan-to-pdf']},
'ai-summarizer':{name:'AI Summarizer',icon:'🤖',desc:'Summarize PDF with AI',color:'#d946ef',related:['translate-pdf','ocr-pdf','pdf-to-markdown','pdf-to-word']},
'translate-pdf':{name:'Translate PDF',icon:'🌍',desc:'Translate PDF to 50+ languages',color:'#0d9488',related:['ocr-pdf','ai-summarizer','pdf-to-word','pdf-to-markdown']},
'image-compressor':{name:'Image Compressor',icon:'📦',desc:'Compress images to exact KB',color:'#3b82f6',related:['image-resizer','image-converter','blur-photo','jpg-to-pdf']},
'image-resizer':{name:'Image Resizer',icon:'📐',desc:'Resize images to exact px',color:'#f59e0b',related:['image-compressor','passport-photo','image-crop','image-converter']},
'passport-photo':{name:'Passport Photo',icon:'🛂',desc:'Make passport-size photos',color:'#ec4899',related:['image-resizer','image-crop','signature-resize','image-compressor']},
'signature-resize':{name:'Signature Resize',icon:'✒️',desc:'Resize signature for forms',color:'#6366f1',related:['sign-pdf','image-resizer','passport-photo','image-crop']},
'blur-photo':{name:'Blur Photo',icon:'🌫️',desc:'Blur photos for privacy',color:'#84cc16',related:['image-compressor','image-resizer','image-converter','redact-pdf']},
'image-crop':{name:'Image Crop',icon:'✂️',desc:'Crop images to any ratio',color:'#a855f7',related:['image-resizer','passport-photo','image-converter','image-compressor']},
'image-converter':{name:'Image Converter',icon:'🔀',desc:'Convert JPG/PNG/WEBP/BMP',color:'#0ea5e9',related:['image-compressor','image-resizer','jpg-to-pdf','pdf-to-jpg']},
'resize-pdf':{name:'Resize PDF',icon:'📏',desc:'Resize PDF pages',color:'#8b5cf6',related:['crop-pdf','compress-pdf','rotate-pdf','organize-pdf']}
};

/* ===== DETECT CURRENT PAGE ===== */
function getCurrentTool(){
  var path=window.location.pathname;
  var file=path.split('/').pop().replace('.html','').replace('/','');
  if(!file||file==='index'||file==='')return null;
  return file;
}

/* ===== RENDER RELATED TOOLS ===== */
function renderRelatedTools(){
  var current=getCurrentTool();
  if(!current||!TOOLS[current])return;
  var tool=TOOLS[current];
  var related=tool.related||[];
  if(related.length===0)return;

  var html='<div class="rt-section">';
  html+='<h2 class="rt-title">🔗 Related Tools</h2>';
  html+='<p class="rt-subtitle">You might also need these tools</p>';
  html+='<div class="rt-grid">';
  related.forEach(function(key){
    var t=TOOLS[key];
    if(!t)return;
    html+='<a href="/'+key+'.html" class="rt-card" title="'+t.desc+'">';
    html+='<div class="rt-icon" style="background:'+t.color+'20;color:'+t.color+'">'+t.icon+'</div>';
    html+='<div class="rt-info"><div class="rt-name">'+t.name+'</div><div class="rt-desc">'+t.desc+'</div></div>';
    html+='<div class="rt-arrow">→</div></a>';
  });
  html+='</div></div>';

  var style=document.createElement('style');
  style.textContent='.rt-section{max-width:1200px;margin:40px auto;padding:0 20px}.rt-title{font-size:26px;font-weight:900;color:#1e1e2e;margin-bottom:6px}.rt-subtitle{font-size:14px;color:#8a8a99;margin-bottom:20px}.rt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}.rt-card{display:flex;align-items:center;gap:14px;padding:16px 18px;background:#fff;border:1px solid #eceaf6;border-radius:14px;text-decoration:none;color:inherit;transition:all .25s ease}.rt-card:hover{border-color:#7c3aed;box-shadow:0 8px 24px rgba(124,58,237,.12);transform:translateY(-3px)}.rt-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}.rt-info{flex:1;min-width:0}.rt-name{font-size:14px;font-weight:800;color:#1e1e2e;margin-bottom:2px}.rt-desc{font-size:12px;color:#8a8a99;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rt-arrow{font-size:16px;color:#c4c4d4;transition:transform .2s}.rt-card:hover .rt-arrow{transform:translateX(4px);color:#7c3aed}@media(max-width:600px){.rt-grid{grid-template-columns:1fr}.rt-section{padding:0 16px;margin:30px auto}}';
  document.head.appendChild(style);

  var footer=document.querySelector('footer')||document.getElementById('siteFooter');
  if(footer){footer.insertAdjacentHTML('beforebegin',html);}
  else{document.body.insertAdjacentHTML('beforeend',html);}
}

/* ===== FOOTER ===== */
var f=document.getElementById('siteFooter');
if(f){f.innerHTML='<div class="container"><div class="fgrid"><div class="fcol"><h4>TronoPDF 👑</h4><p>Every PDF tool you need - free, fast and private. Files never leave your device. Powered by open-source libraries (pdf-lib, pdf.js).</p></div><div class="fcol"><h4>Product</h4><a href="/">Home</a><a href="/all-tools.html">All Tools</a><a href="/about.html">About</a><a href="/contact.html">Contact</a></div><div class="fcol"><h4>Popular Tools</h4><a href="/merge-pdf">Merge PDF</a><a href="/split-pdf">Split PDF</a><a href="/compress-pdf">Compress PDF</a><a href="/jpg-to-pdf">JPG to PDF</a><a href="/pdf-to-jpg">PDF to JPG</a><a href="/image-compressor">Image Compressor</a><a href="/signature-resize">Signature Resize</a><a href="/image-converter">Image Converter</a><a href="/blur-photo">Blur Photo</a><a href="/html-to-pdf">HTML to PDF</a></div><div class="fcol"><h4>Legal</h4><a href="/privacy.html">Privacy Policy</a><a href="/terms.html">Terms</a><a href="/disclaimer.html">Disclaimer</a></div></div><div class="fbottom">© TronoPDF - All Rights Reserved.</div></div>';}

/* ===== INJECT RELATED TOOLS ===== */
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',renderRelatedTools);}
else{renderRelatedTools();}
})();
