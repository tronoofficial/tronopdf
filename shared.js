/* TronoPDF - shared header/footer/icons + mobile drawer + related tools + how-to guides */
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

/* ===== HOW-TO GUIDES DATABASE ===== */
var GUIDES={
'compress-pdf':{title:'How to Compress PDF',steps:[{icon:'upload',text:'Click "Select PDF" button or drag & drop your file',tip:'Supports files up to 100MB'},{icon:'slider',text:'Adjust compression level (Quality vs Size)',tip:'Higher quality = larger file size'},{icon:'download',text:'Click "Download" to save compressed PDF',tip:'File size reduction shown in percentage'}]},
'merge-pdf':{title:'How to Merge PDF',steps:[{icon:'upload',text:'Click "Select PDFs" to upload multiple files',tip:'You can select 2 or more PDFs'},{icon:'reorder',text:'Drag & drop to reorder pages as needed',tip:'First file = first pages in output'},{icon:'download',text:'Click "Merge PDF" and download',tip:'All PDFs combined into one file'}]},
'split-pdf':{title:'How to Split PDF',steps:[{icon:'upload',text:'Upload your PDF file',tip:'Single PDF file only'},{icon:'select',text:'Select page ranges to extract',tip:'Use format: 1-3, 5, 7-10'},{icon:'download',text:'Download split PDF files',tip:'Each range becomes separate file'}]},
'pdf-to-word':{title:'How to Convert PDF to Word',steps:[{icon:'upload',text:'Upload your PDF file',tip:'Scanned PDFs will use OCR'},{icon:'process',text:'Wait for conversion (10-30 seconds)',tip:'Complex layouts may take longer'},{icon:'download',text:'Download your DOCX file',tip:'Edit in Microsoft Word or Google Docs'}]},
'jpg-to-pdf':{title:'How to Convert JPG to PDF',steps:[{icon:'upload',text:'Upload one or more images',tip:'Supports JPG, PNG, WEBP'},{icon:'settings',text:'Choose page size and orientation',tip:'A4 is standard for documents'},{icon:'download',text:'Click "Convert" and download PDF',tip:'All images combined into one PDF'}]},
'pdf-to-jpg':{title:'How to Convert PDF to JPG',steps:[{icon:'upload',text:'Upload your PDF file',tip:'All pages will be converted'},{icon:'quality',text:'Select image quality (Low/Medium/High)',tip:'High quality = larger file size'},{icon:'download',text:'Download all images as ZIP',tip:'Each page becomes separate JPG'}]},
'sign-pdf':{title:'How to Sign PDF',steps:[{icon:'upload',text:'Upload your PDF file',tip:'Document you want to sign'},{icon:'draw',text:'Draw your signature or uploading image',tip:'Use mouse or touch screen'},{icon:'place',text:'Click on PDF to place signature',tip:'You can move and resize it'},{icon:'download',text:'Download signed PDF',tip:'Signature is permanently embedded'}]},
'protect-pdf':{title:'How to Protect PDF',steps:[{icon:'upload',text:'Upload your PDF file',tip:'File you want to password protect'},{icon:'password',text:'Enter strong password (8+ characters)',tip:'Use letters, numbers, symbols'},{icon:'download',text:'Download protected PDF',tip:'Password required to open file'}]},
'unlock-pdf':{title:'How to Unlock PDF',steps:[{icon:'upload',text:'Upload password-protected PDF',tip:'You must know the password'},{icon:'password',text:'Enter the PDF password',tip:'Case-sensitive password'},{icon:'download',text:'Download unlocked PDF',tip:'No password needed to open'}]},
'watermark-pdf':{title:'How to Add Watermark',steps:[{icon:'upload',text:'Upload your PDF file',tip:'Document to watermark'},{icon:'text',text:'Type watermark text or uploading image',tip:'Example: "CONFIDENTIAL", "DRAFT"'},{icon:'settings',text:'Adjust position, size, and opacity',tip:'Lower opacity = less intrusive'},{icon:'download',text:'Download watermarked PDF',tip:'Watermark on all pages'}]},
'edit-pdf':{title:'How to Edit PDF',steps:[{icon:'upload',text:'Upload your PDF file',tip:'Document you want to edit'},{icon:'select',text:'Click on text or images to edit',tip:'Not all PDFs are editable'},{icon:'edit',text:'Make your changes',tip:'Add text, delete, or modify'},{icon:'download',text:'Download edited PDF',tip:'Changes are permanent'}]},
'rotate-pdf':{title:'How to Rotate PDF',steps:[{icon:'upload',text:'Upload your PDF file',tip:'Document with rotated pages'},{icon:'rotate',text:'Click pages to rotate (90° each click)',tip:'Or use "Rotate All" button'},{icon:'download',text:'Download rotated PDF',tip:'Pages now in correct orientation'}]},
'organize-pdf':{title:'How to Organize PDF',steps:[{icon:'upload',text:'Upload your PDF file',tip:'Document to reorganize'},{icon:'reorder',text:'Drag pages to reorder',tip:'Click X to delete pages'},{icon:'download',text:'Download organized PDF',tip:'Pages in new order'}]},
'crop-pdf':{title:'How to Crop PDF',steps:[{icon:'upload',text:'Upload your PDF file',tip:'Document to crop'},{icon:'crop',text:'Drag corners to select crop area',tip:'Remove unwanted margins'},{icon:'download',text:'Download cropped PDF',tip:'All pages cropped same way'}]},
'repair-pdf':{title:'How to Repair PDF',steps:[{icon:'upload',text:'Upload corrupted PDF file',tip:'File that won\'t open properly'},{icon:'process',text:'Click "Repair" and wait',tip:'Attempts to fix structure'},{icon:'download',text:'Download repaired PDF',tip:'Some data may be lost'}]},
'page-numbers':{title:'How to Add Page Numbers',steps:[{icon:'upload',text:'Upload your PDF file',tip:'Document to number'},{icon:'settings',text:'Choose position and format',tip:'Bottom-right is most common'},{icon:'download',text:'Download numbered PDF',tip:'Numbers on all pages'}]},
'ocr-pdf':{title:'How to OCR PDF',steps:[{icon:'upload',text:'Upload scanned PDF',tip:'Image-based PDF without text'},{icon:'process',text:'Wait for OCR processing',tip:'May take 1-5 minutes'},{icon:'download',text:'Download searchable PDF',tip:'Now you can select and copy text'}]},
'compare-pdf':{title:'How to Compare PDFs',steps:[{icon:'upload',text:'Upload two PDF files to compare',tip:'Original and modified version'},{icon:'view',text:'View differences highlighted',tip:'Red areas show changes'},{icon:'navigate',text:'Use arrows to navigate pages',tip:'See side-by-side comparison'}]},
'redact-pdf':{title:'How to Redact PDF',steps:[{icon:'upload',text:'Upload your PDF file',tip:'Document with sensitive info'},{icon:'draw',text:'Draw rectangles over sensitive text',tip:'Black boxes hide content'},{icon:'download',text:'Download redacted PDF',tip:'Content permanently removed'}]},
'pdf-forms':{title:'How to Fill PDF Forms',steps:[{icon:'upload',text:'Upload PDF form',tip:'Document with fillable fields'},{icon:'fill',text:'Click fields and type your info',tip:'Tab to move between fields'},{icon:'download',text:'Download filled form',tip:'Your data is saved in PDF'}]},
'scan-to-pdf':{title:'How to Scan to PDF',steps:[{icon:'camera',text:'Click "Open Camera" or upload photos',tip:'Allow camera access when prompted'},{icon:'capture',text:'Take photos of each page',tip:'Good lighting = better quality'},{icon:'filter',text:'Apply filters (Color/Gray/B&W)',tip:'B&W for text documents'},{icon:'download',text:'Download combined PDF',tip:'All pages in one file'}]},
'translate-pdf':{title:'How to Translate PDF',steps:[{icon:'upload',text:'Upload your PDF file',tip:'Document to translate'},{icon:'language',text:'Select source and target languages',tip:'Auto-detect works for source'},{icon:'process',text:'Wait for translation',tip:'May take 1-3 minutes'},{icon:'download',text:'Download translated PDF',tip:'Both original and translated text'}]},
'ai-summarizer':{title:'How to Use AI Summarizer',steps:[{icon:'upload',text:'Upload your PDF file',tip:'Long document to summarize'},{icon:'process',text:'AI analyzes and summarizes',tip:'Takes 10-30 seconds'},{icon:'view',text:'Read summary in text box',tip:'Key points extracted'},{icon:'copy',text:'Copy or download summary',tip:'Use for quick understanding'}]},
'image-compressor':{title:'How to Compress Images',steps:[{icon:'upload',text:'Upload one or more images',tip:'JPG, PNG, WEBP supported'},{icon:'target',text:'Set target file size (e.g., 50 KB)',tip:'For forms with size limits'},{icon:'download',text:'Download compressed images',tip:'Exact size achieved'}]},
'image-resizer':{title:'How to Resize Images',steps:[{icon:'upload',text:'Upload images to resize',tip:'Multiple files supported'},{icon:'dimensions',text:'Enter width and height',tip:'Lock aspect ratio to prevent stretching'},{icon:'download',text:'Download resized images',tip:'Exact dimensions achieved'}]},
'passport-photo':{title:'How to Make Passport Photo',steps:[{icon:'upload',text:'Upload your photo',tip:'Clear face, good lighting'},{icon:'crop',text:'Drag to position face in frame',tip:'Face should fill 70-80% of frame'},{icon:'settings',text:'Select country/document type',tip:'Auto-sets correct dimensions'},{icon:'download',text:'Download photo + print sheet',tip:'Print on 4x6 photo paper'}]},
'signature-resize':{title:'How to Resize Signature',steps:[{icon:'upload',text:'Upload signature photo',tip:'Clear signature on white paper'},{icon:'dimensions',text:'Set exact pixel dimensions',tip:'Check form requirements'},{icon:'target',text:'Set max file size (KB)',tip:'Many forms require <20 KB'},{icon:'download',text:'Download resized signature',tip:'Ready for form upload'}]},
'blur-photo':{title:'How to Blur Photo',steps:[{icon:'upload',text:'Upload your photo',tip:'Image to blur'},{icon:'slider',text:'Adjust blur strength',tip:'Higher = more blur'},{icon:'download',text:'Download blurred photo',tip:'Privacy protected'}]},
'image-crop':{title:'How to Crop Image',steps:[{icon:'upload',text:'Upload your image',tip:'Photo to crop'},{icon:'crop',text:'Drag corners to select area',tip:'Or choose preset ratio'},{icon:'download',text:'Download cropped image',tip:'Unwanted areas removed'}]},
'image-converter':{title:'How to Convert Images',steps:[{icon:'upload',text:'Upload images to convert',tip:'JPG, PNG, WEBP, BMP'},{icon:'format',text:'Select output format',tip:'JPG for photos, PNG for graphics'},{icon:'download',text:'Download converted images',tip:'Or download all as ZIP'}]},
'word-to-pdf':{title:'How to Convert Word to PDF',steps:[{icon:'upload',text:'Upload your DOCX file',tip:'Microsoft Word document'},{icon:'process',text:'Wait for conversion',tip:'Preserves formatting'},{icon:'download',text:'Download PDF file',tip:'Ready to share or print'}]},
'excel-to-pdf':{title:'How to Convert Excel to PDF',steps:[{icon:'upload',text:'Upload your XLSX file',tip:'Excel spreadsheet'},{icon:'preview',text:'Preview how it will look',tip:'Check formatting'},{icon:'download',text:'Download PDF file',tip:'Tables converted to PDF format'}]},
'powerpoint-to-pdf':{title:'How to Convert PowerPoint to PDF',steps:[{icon:'upload',text:'Upload your PPTX file',tip:'PowerPoint presentation'},{icon:'process',text:'Wait for conversion',tip:'Each slide becomes PDF page'},{icon:'download',text:'Download PDF file',tip:'Ready to share without PowerPoint'}]},
'html-to-pdf':{title:'How to Convert HTML to PDF',steps:[{icon:'code',text:'Paste HTML code or URL',tip:'Complete HTML with styling'},{icon:'preview',text:'See live preview',tip:'Adjust page size and margins'},{icon:'download',text:'Download PDF file',tip:'HTML rendered as PDF'}]},
'pdf-to-markdown':{title:'How to Convert PDF to Markdown',steps:[{icon:'upload',text:'Upload your PDF file',tip:'Document to convert'},{icon:'process',text:'Wait for conversion',tip:'Extracts text and structure'},{icon:'download',text:'Download Markdown file',tip:'Use in GitHub, Notion, etc.'}]},
'pdf-to-pdfa':{title:'How to Convert to PDF/A',steps:[{icon:'upload',text:'Upload your PDF file',tip:'Document to archive'},{icon:'process',text:'Convert to PDF/A standard',tip:'Ensures long-term preservation'},{icon:'download',text:'Download PDF/A file',tip:'Archive-ready format'}]}
};

/* ===== HOW-TO SVG ICONS ===== */
var ICONS={
upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
slider:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
reorder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
select:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
process:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
draw:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
place:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
password:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
text:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
rotate:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
crop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"/><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"/></svg>',
quality:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
capture:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>',
filter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
language:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
view:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
navigate:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>',
fill:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
dimensions:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 3H3v18h18V3z"/><path d="M9 9h6v6H9z"/></svg>',
format:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
code:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
preview:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
};

/* ===== RENDER HOW-TO BUTTON ===== */
function renderHowToButton(){
  var current=getCurrentTool();
  if(!current||!GUIDES[current])return;

  var html='<button class="ht-btn" id="htBtn" aria-label="How to use this tool">';
  html+='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
  html+='<span>How to use</span>';
  html+='</button>';

  var style=document.createElement('style');
  style.textContent='.ht-btn{position:fixed;bottom:24px;right:24px;z-index:998;display:flex;align-items:center;gap:8px;padding:12px 20px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border:none;border-radius:999px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 8px 24px rgba(124,58,237,.4);transition:all .3s}.ht-btn:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(124,58,237,.5)}.ht-btn svg{width:20px;height:20px}@media(max-width:600px){.ht-btn{bottom:16px;right:16px;padding:10px 16px;font-size:13px}.ht-btn svg{width:18px;height:18px}}';
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('htBtn').addEventListener('click', function(){ openGuide(current); });
}

/* ===== OPEN GUIDE MODAL ===== */
function openGuide(toolKey){
  var guide=GUIDES[toolKey];
  if(!guide)return;

  var html='<div class="ht-overlay" id="htOverlay">';
  html+='<div class="ht-modal">';
  html+='<div class="ht-header"><h2>'+guide.title+'</h2><button class="ht-close" id="htClose" aria-label="Close">✕</button></div>';
  html+='<div class="ht-body">';

  guide.steps.forEach(function(step,idx){
    html+='<div class="ht-step">';
    html+='<div class="ht-step-num">'+(idx+1)+'</div>';
    html+='<div class="ht-step-icon">'+(ICONS[step.icon]||ICONS.settings)+'</div>';
    html+='<div class="ht-step-content">';
    html+='<p class="ht-step-text">'+step.text+'</p>';
    if(step.tip){html+='<p class="ht-step-tip">💡 '+step.tip+'</p>';}
    html+='</div></div>';
  });

  html+='</div></div></div>';

  var style=document.createElement('style');
  style.textContent='.ht-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;animation:htFadeIn .3s}@keyframes htFadeIn{from{opacity:0}to{opacity:1}}.ht-modal{background:#fff;border-radius:16px;max-width:600px;width:100%;max-height:90vh;overflow-y:auto;animation:htSlideUp .3s}@keyframes htSlideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}.ht-header{display:flex;justify-content:space-between;align-items:center;padding:20px 24px;border-bottom:1px solid #eceaf6;position:sticky;top:0;background:#fff;z-index:1}.ht-header h2{font-size:20px;font-weight:900;color:#1e1e2e;margin:0}.ht-close{background:none;border:none;font-size:24px;color:#8a8a99;cursor:pointer;padding:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:8px;transition:all .2s}.ht-close:hover{background:#f3f0ff;color:#7c3aed}.ht-body{padding:24px}.ht-step{display:flex;gap:16px;margin-bottom:24px}.ht-step:last-child{margin-bottom:0}.ht-step-num{width:32px;height:32px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;flex-shrink:0}.ht-step-icon{width:48px;height:48px;background:#f3f0ff;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#7c3aed}.ht-step-icon svg{width:24px;height:24px}.ht-step-content{flex:1;min-width:0}.ht-step-text{font-size:15px;font-weight:600;color:#1e1e2e;margin:0 0 6px;line-height:1.5}.ht-step-tip{font-size:13px;color:#7c3aed;margin:0;background:#f3f0ff;padding:8px 12px;border-radius:8px;line-height:1.4}@media(max-width:600px){.ht-modal{max-height:95vh}.ht-header{padding:16px 20px}.ht-header h2{font-size:18px}.ht-body{padding:20px}.ht-step{gap:12px}.ht-step-num{width:28px;height:28px;font-size:13px}.ht-step-icon{width:40px;height:40px}.ht-step-icon svg{width:20px;height:20px}.ht-step-text{font-size:14px}.ht-step-tip{font-size:12px;padding:6px 10px}}';
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', html);
  document.body.style.overflow='hidden';

  document.getElementById('htClose').addEventListener('click', closeGuide);
  document.getElementById('htOverlay').addEventListener('click', function(e){
    if(e.target===this)closeGuide();
  });
  document.addEventListener('keydown', function escHandler(e){
    if(e.key==='Escape'){closeGuide();document.removeEventListener('keydown',escHandler);}
  });
}

/* ===== CLOSE GUIDE MODAL ===== */
function closeGuide(){
  var overlay=document.getElementById('htOverlay');
  if(overlay){
    overlay.style.animation='htFadeIn .3s reverse';
    setTimeout(function(){
      overlay.remove();
      document.body.style.overflow='';
    },280);
  }
}

/* ===== INIT ===== */
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){renderRelatedTools();renderHowToButton();});
}else{
  renderRelatedTools();
  renderHowToButton();
}
})();

/* ===== LOGO v1 PRO (refined Crowned Page) ===== */
(function(){
  var V1PRO = '<svg class="lsvg" viewBox="0 0 48 48" aria-label="TronoPDF">' +
    '<defs>' +
    '<linearGradient id="bgT" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6d28d9"/><stop offset=".5" stop-color="#7c3aed"/><stop offset="1" stop-color="#a855f7"/></linearGradient>' +
    '<linearGradient id="pgT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ede9fe"/></linearGradient>' +
    '<radialGradient id="gdT" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#fef9c3"/><stop offset=".5" stop-color="#fcd34d"/><stop offset="1" stop-color="#f59e0b"/></radialGradient>' +
    '<linearGradient id="fdT" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c4b5fd"/><stop offset="1" stop-color="#ddd6fe"/></linearGradient>' +
    '</defs>' +
    '<rect width="48" height="48" rx="12" fill="url(#bgT)"/>' +
    '<ellipse cx="24" cy="20" rx="16" ry="12" fill="#ffffff" opacity=".08"/>' +
    '<path d="M14.5 15.5 L19.5 20 L24 11.5 L28.5 20 L33.5 15.5 L33.5 31.5 L27.5 37.5 L17 37.5 Q14.5 37.5 14.5 35 Z" fill="url(#pgT)"/>' +
    '<path d="M33.5 31.5 L27.5 37.5 L27.5 31.5 Z" fill="url(#fdT)"/>' +
    '<circle cx="14.5" cy="12.8" r="2.4" fill="url(#gdT)"/>' +
    '<circle cx="24" cy="8.8" r="2.6" fill="url(#gdT)"/>' +
    '<circle cx="33.5" cy="12.8" r="2.4" fill="url(#gdT)"/>' +
    '<circle cx="13.8" cy="12" r=".7" fill="#fffbeb" opacity=".9"/>' +
    '<circle cx="23.2" cy="7.9" r=".8" fill="#fffbeb" opacity=".9"/>' +
    '<circle cx="32.8" cy="12" r=".7" fill="#fffbeb" opacity=".9"/>' +
    '</svg>';
  function apply(){
    var old=document.querySelector('.logo .lsvg')||document.querySelector('.lsvg');
    if(old) old.outerHTML=V1PRO;
    var fav=document.querySelector('link[rel="icon"][type="image/svg+xml"]');
    if(fav) fav.href='data:image/svg+xml,'+encodeURIComponent(V1PRO.replace(' class="lsvg"','').replace(' aria-label="TronoPDF"',''));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();

/* ===== BRANDING EVERYWHERE (favicon+apple+theme+OG+twitter) ===== */
(function(){
  var LOGO = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">' +
    '<defs>' +
    '<linearGradient id="bgT" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6d28d9"/><stop offset=".5" stop-color="#7c3aed"/><stop offset="1" stop-color="#a855f7"/></linearGradient>' +
    '<linearGradient id="pgT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ede9fe"/></linearGradient>' +
    '<radialGradient id="gdT" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#fef9c3"/><stop offset=".5" stop-color="#fcd34d"/><stop offset="1" stop-color="#f59e0b"/></radialGradient>' +
    '<linearGradient id="fdT" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c4b5fd"/><stop offset="1" stop-color="#ddd6fe"/></linearGradient>' +
    '</defs>' +
    '<rect width="48" height="48" rx="12" fill="url(#bgT)"/>' +
    '<ellipse cx="24" cy="20" rx="16" ry="12" fill="#ffffff" opacity=".08"/>' +
    '<path d="M14.5 15.5 L19.5 20 L24 11.5 L28.5 20 L33.5 15.5 L33.5 31.5 L27.5 37.5 L17 37.5 Q14.5 37.5 14.5 35 Z" fill="url(#pgT)"/>' +
    '<path d="M33.5 31.5 L27.5 37.5 L27.5 31.5 Z" fill="url(#fdT)"/>' +
    '<circle cx="14.5" cy="12.8" r="2.4" fill="url(#gdT)"/>' +
    '<circle cx="24" cy="8.8" r="2.6" fill="url(#gdT)"/>' +
    '<circle cx="33.5" cy="12.8" r="2.4" fill="url(#gdT)"/>' +
    '<circle cx="13.8" cy="12" r=".7" fill="#fffbeb" opacity=".9"/>' +
    '<circle cx="23.2" cy="7.9" r=".8" fill="#fffbeb" opacity=".9"/>' +
    '<circle cx="32.8" cy="12" r=".7" fill="#fffbeb" opacity=".9"/>' +
    '</svg>';
  var dataUri = 'data:image/svg+xml,' + encodeURIComponent(LOGO);

  function setMeta(attr, val, isName){
    var sel = (isName?'meta[name="':'meta[property="') + attr + '"]';
    var m = document.querySelector(sel);
    if(!m){ m=document.createElement('meta'); if(isName)m.name=attr; else m.setAttribute('property',attr); document.head.appendChild(m); }
    m.content = val;
  }

  function apply(){
    document.querySelectorAll('link[rel~="icon"],link[rel="shortcut icon"],link[rel="apple-touch-icon"]').forEach(function(l){ l.remove(); });
    var fav=document.createElement('link'); fav.rel='icon'; fav.type='image/svg+xml'; fav.href=dataUri; document.head.appendChild(fav);
    var fav2=document.createElement('link'); fav2.rel='shortcut icon'; fav2.href=dataUri; document.head.appendChild(fav2);
    var apple=document.createElement('link'); apple.rel='apple-touch-icon'; apple.href=dataUri; document.head.appendChild(apple);
    setMeta('theme-color','#7c3aed',true);
    setMeta('og:title', document.title, false);
    setMeta('og:description','Every PDF tool you need - free, fast and private. Rule Your PDFs.', false);
    setMeta('og:type','website', false);
    setMeta('og:url', location.href, false);
    setMeta('og:site_name','TronoPDF', false);
    setMeta('og:image', dataUri, false);
    setMeta('twitter:card','summary',true);
    setMeta('twitter:title', document.title, true);
    setMeta('twitter:description','Rule Your PDFs - free, fast, private PDF tools.',true);
    setMeta('twitter:image', dataUri, true);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();

/* ===== TASK 10 v2: PWA (real manifest + SW) ===== */
(function(){
  document.querySelectorAll('link[rel="manifest"]').forEach(function(l){ l.remove(); });
  var m=document.createElement('link'); m.rel='manifest'; m.href='/manifest.json'; document.head.appendChild(m);
  if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('/sw.js').catch(function(){});
    });
  }
})();

/* ===== TASK 11 v2: DARK MODE FINAL (mega-menu + logo fix) ===== */
(function(){
  var KEY='tronopdf-theme';

  var DARK_CSS = '' +
  'html[data-theme="dark"]{color-scheme:dark}' +
  'html[data-theme="dark"] body{background:#0f0f17!important;color:#e8e8f0!important}' +
  'html[data-theme="dark"] h1,html[data-theme="dark"] h2,html[data-theme="dark"] h3,html[data-theme="dark"] h4{color:#f4f4fa!important}' +
  'html[data-theme="dark"] p{color:#b9b9cc!important}' +
  'html[data-theme="dark"] a{color:#c9b8ff}' +
  'html[data-theme="dark"] [class*="hero"]{background:linear-gradient(180deg,#171725,#0f0f17)!important}' +
  'html[data-theme="dark"] .hwrap{background:rgba(15,15,23,.97)!important;border-color:#26263a!important}' +
  'html[data-theme="dark"] .lword{color:#f4f4fa!important}' +
  'html[data-theme="dark"] .hlink{color:#e8e8f0!important}' +
  'html[data-theme="dark"] .mnav .ni{color:#e8e8f0!important}' +
  'html[data-theme="dark"] .mnav .ni:hover,html[data-theme="dark"] .mnav .ni.active{background:#232336!important;color:#c9b8ff!important}' +
  'html[data-theme="dark"] .panel,html[data-theme="dark"] .pinner,html[data-theme="dark"] .pcol{background:#171725!important;border-color:#26263a!important;box-shadow:0 20px 50px rgba(0,0,0,.55)!important}' +
  'html[data-theme="dark"] .pcol h5{color:#9a9ab5!important}' +
  'html[data-theme="dark"] .pcol a{color:#d8d8e8!important}' +
  'html[data-theme="dark"] .pcol a:hover{color:#c9b8ff!important}' +
  'html[data-theme="dark"] [class*="card"]{background:#1b1b2b!important;border-color:#2a2a40!important}' +
  'html[data-theme="dark"] [class*="side"],html[data-theme="dark"] [class*="work"],html[data-theme="dark"] [class*="wrap"]{background:#12121d!important}' +
  'html[data-theme="dark"] input,html[data-theme="dark"] select,html[data-theme="dark"] textarea{background:#1e1e30!important;color:#e8e8f0!important;border-color:#32324a!important}' +
  'html[data-theme="dark"] table,html[data-theme="dark"] th,html[data-theme="dark"] td{border-color:#32324a!important}' +
  'html[data-theme="dark"] th{background:#26263a!important;color:#fff!important}' +
  'html[data-theme="dark"] [class*="drawer"]{background:#151522!important}' +
  'html[data-theme="dark"] [class*="modal"],html[data-theme="dark"] [class*="overlay"]{background:#171725!important}' +
  'html[data-theme="dark"] [class*="tab"],html[data-theme="dark"] [class*="chip"],html[data-theme="dark"] [class*="preset"]{background:#232336!important;color:#c9c9dd!important;border-color:#32324a!important}' +
  'html[data-theme="dark"] [class*="toast"]{background:#232336!important;color:#e8e8f0!important}' +
  'html[data-theme="dark"] [class*="info"],html[data-theme="dark"] [class*="note"],html[data-theme="dark"] [class*="tip"]{background:#1e1e30!important;color:#c9c9dd!important;border-color:#32324a!important}' +
  'html[data-theme="dark"] ::-webkit-scrollbar{width:10px}html[data-theme="dark"] ::-webkit-scrollbar-thumb{background:#32324a}html[data-theme="dark"] ::-webkit-scrollbar-track{background:#12121d}' +
  'body{transition:background .3s,color .3s}';

  var st=document.createElement('style');
  st.id='darkThemeCss';
  st.textContent=DARK_CSS;
  document.head.appendChild(st);

  function getTheme(){ try{ return localStorage.getItem(KEY)||'light'; }catch(e){ return 'light'; } }
  function setTheme(t){
    document.documentElement.setAttribute('data-theme',t);
    try{ localStorage.setItem(KEY,t); }catch(e){}
    var meta=document.querySelector('meta[name="theme-color"]');
    if(meta) meta.content=(t==='dark')?'#0f0f17':'#7c3aed';
    updateIcons(t);
  }
  function updateIcons(t){
    document.querySelectorAll('.theme-toggle').forEach(function(b){
      b.textContent=(t==='dark')?'☀️':'🌙';
      b.title=(t==='dark')?'Light mode':'Dark mode';
    });
  }
  function addToggles(){
    var mk=function(){
      var b=document.createElement('button');
      b.className='theme-toggle';b.type='button';
      b.style.cssText='border:none;background:transparent;font-size:18px;cursor:pointer;padding:6px 8px;border-radius:8px;line-height:1';
      b.onclick=function(){ setTheme(getTheme()==='dark'?'light':'dark'); };
      return b;
    };
    var hr=document.querySelector('.hright');
    if(hr && !hr.querySelector('.theme-toggle')) hr.insertBefore(mk(), hr.firstChild);
    var dh=document.querySelector('.drawer-header');
    if(dh && !dh.querySelector('.theme-toggle')) dh.insertBefore(mk(), dh.querySelector('.drawer-close'));
    updateIcons(getTheme());
  }

  setTheme(getTheme());
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addToggles);
  else addToggles();
})();

/* ===== TASK 11 v4: AUTO-DARK FINAL (solid + gradient + pseudo) ===== */
(function(){
  var st=document.createElement('style');
  st.textContent='html[data-theme="dark"] [data-dkp]::before,html[data-theme="dark"] [data-dkp]::after{background:none!important;background-image:none!important;background-color:transparent!important}';
  document.head.appendChild(st);

  function lum(c){ if(!c)return null; var m=c.match(/[\d.]+/g); if(!m||m.length<3)return null; var a=m.length>3?+m[3]:1; if(a<0.15)return null; return 0.299*+m[0]+0.587*+m[1]+0.114*+m[2]; }

  function gradLum(s){ if(!s||s==='none')return null; var cols=[]; var re=/rgba?\(([^)]+)\)/g,m; while((m=re.exec(s))){var p=m[1].split(',').map(parseFloat); if(p.length>=3)cols.push([p[0],p[1],p[2],p.length>3?p[3]:1]);} var rh=/#([0-9a-f]{6})/gi,h; while((h=rh.exec(s))){var x=h[1]; cols.push([parseInt(x.substr(0,2),16),parseInt(x.substr(2,2),16),parseInt(x.substr(4,2),16),1]);} if(!cols.length)return null; var sum=0,n=0; cols.forEach(function(c){if((c[3]||1)<0.15)return; sum+=0.299*c[0]+0.587*c[1]+0.114*c[2]; n++;}); return n?sum/n:null; }

  function isLight(el){
    var cs=getComputedStyle(el);
    if(lum(cs.backgroundColor)>150) return true;
    if(gradLum(cs.backgroundImage)>150) return true;
    if(lum(getComputedStyle(el,'::before').backgroundColor)>150) return 'pseudo';
    if(lum(getComputedStyle(el,'::after').backgroundColor)>150) return 'pseudo';
    return false;
  }

  function autoDark(){
    var skip=/^(IMG|VIDEO|CANVAS|SVG|IFRAME|INPUT|SELECT|TEXTAREA|BUTTON|A)$/;
    var all=document.querySelectorAll('body *');
    for(var i=0;i<all.length;i++){
      var el=all[i]; if(skip.test(el.tagName))continue;
      var r=isLight(el);
      if(r===true){
        el.style.setProperty('background-image','none','important');
        el.style.setProperty('background-color','#1b1b2b','important');
        el.setAttribute('data-dkg','1');
      }else if(r==='pseudo'){
        el.style.setProperty('background-color','#1b1b2b','important');
        el.setAttribute('data-dkp','1');
      }
    }
  }

  function clearDark(){
    document.querySelectorAll('[data-dkg]').forEach(function(el){ el.style.removeProperty('background-image'); el.style.removeProperty('background-color'); el.removeAttribute('data-dkg'); });
    document.querySelectorAll('[data-dkp]').forEach(function(el){ el.style.removeProperty('background-color'); el.removeAttribute('data-dkp'); });
  }

  function apply(){ if(document.documentElement.getAttribute('data-theme')==='dark') autoDark(); else clearDark(); }

  var mo=new MutationObserver(apply);
  mo.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  window.addEventListener('load',function(){setTimeout(apply,120);});
  document.addEventListener('DOMContentLoaded',function(){setTimeout(apply,120);});
})();

/* ===== TASK 12: SEO (canonical + schema JSON-LD + meta) ===== */
(function(){
  var origin=location.origin, path=location.pathname;

  document.querySelectorAll('link[rel="canonical"]').forEach(function(l){l.remove();});
  var can=document.createElement('link'); can.rel='canonical'; can.href=origin+path; document.head.appendChild(can);

  if(!document.querySelector('meta[name="description"]')){
    var md=document.createElement('meta'); md.name='description';
    md.content='TronoPDF - free, fast & private online PDF tools. Merge, split, compress, convert, sign & edit PDFs. Rule Your PDFs!';
    document.head.appendChild(md);
  }

  var file=path.split('/').pop().replace('.html','').replace('/','');
  var isHome=(!file||file==='index');

  var ld={"@context":"https://schema.org","@graph":[]};
  ld["@graph"].push({
    "@type":"WebSite","@id":origin+"/#website","url":origin+"/",
    "name":"TronoPDF","description":"Every PDF tool you need - free, fast and private.",
    "publisher":{"@type":"Organization","name":"TronoPDF","logo":{"@type":"ImageObject","url":origin+"/icon.svg"}}
  });

  if(!isHome){
    ld["@graph"].push({
      "@type":"SoftwareApplication","@id":origin+path+"#app",
      "name":document.title.split('-')[0].trim()||document.title,
      "url":origin+path,
      "applicationCategory":"UtilitiesApplication",
      "operatingSystem":"Any (Web)",
      "description":"Free online tool - "+(document.title.split('-')[0]||"")+". No signup, no watermark, 100% private.",
      "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}
    });
    ld["@graph"].push({
      "@type":"BreadcrumbList",
      "itemListElement":[
        {"@type":"ListItem","position":1,"name":"Home","item":origin+"/"},
        {"@type":"ListItem","position":2,"name":document.title.split('-')[0].trim(),"item":origin+path}
      ]
    });
  }

  var s=document.createElement('script');
  s.type='application/ld+json';
  s.textContent=JSON.stringify(ld);
  document.head.appendChild(s);
})();

/* ===== TASK 13: USER RATING / FEEDBACK WIDGET (English) ===== */
(function(){
  var path=location.pathname;
  var tool=path.split('/').pop().replace('.html','').replace('/','');
  if(!tool||tool==='index')return;
  var skip=['about','contact','privacy','terms','disclaimer','all-tools','faq','status'];
  if(skip.indexOf(tool)>-1)return;

  var KEY='tronopdf-rating-'+tool;

  var st=document.createElement('style');
  st.textContent='.fb-wrap{max-width:1200px;margin:30px auto;padding:0 20px}.fb-box{display:flex;align-items:center;gap:14px;flex-wrap:wrap;background:#fff;border:1px solid #eceaf6;border-radius:14px;padding:14px 18px}.fb-q{font-weight:700;color:#4b4b5a;font-size:14px}.fb-star{border:none;background:none;font-size:22px;color:#d5d5e0;cursor:pointer;transition:transform .15s,color .15s;padding:2px}.fb-star:hover{transform:scale(1.25)}.fb-star.on{color:#f59e0b}.fb-thanks{font-weight:700;color:#16a34a;font-size:14px}html[data-theme="dark"] .fb-box{background:#1b1b2b;border-color:#2a2a40}html[data-theme="dark"] .fb-q{color:#e8e8f0}';
  document.head.appendChild(st);

  var wrap=document.createElement('div');
  wrap.className='fb-wrap';
  wrap.innerHTML='<div class="fb-box">'+
    '<span class="fb-q">Did this tool help you? Rate it:</span>'+
    '<div class="fb-stars">'+
      '<button class="fb-star" data-v="1">★</button>'+
      '<button class="fb-star" data-v="2">★</button>'+
      '<button class="fb-star" data-v="3">★</button>'+
      '<button class="fb-star" data-v="4">★</button>'+
      '<button class="fb-star" data-v="5">★</button>'+
    '</div>'+
    '<span class="fb-thanks" style="display:none">🙏 Thank you! Your feedback has been saved.</span>'+
    '</div>';

  var footer=document.querySelector('footer')||document.getElementById('siteFooter');
  if(footer)footer.parentNode.insertBefore(wrap,footer);
  else document.body.appendChild(wrap);

  var stars=wrap.querySelectorAll('.fb-star');
  function paint(n){stars.forEach(function(b){b.classList.toggle('on',(+b.dataset.v)<=n);});}

  stars.forEach(function(b){
    b.addEventListener('mouseenter',function(){paint(+b.dataset.v);});
    b.addEventListener('click',function(){
      var v=+b.dataset.v;
      try{localStorage.setItem(KEY,String(v));}catch(e){}
      if(window.trackEvent)trackEvent('tool_rating',{tool:tool,rating:v});
      wrap.querySelector('.fb-stars').style.display='none';
      wrap.querySelector('.fb-q').style.display='none';
      wrap.querySelector('.fb-thanks').style.display='inline';
    });
  });
  wrap.querySelector('.fb-stars').addEventListener('mouseleave',function(){
    var s=0;try{s=+localStorage.getItem(KEY)||0;}catch(e){}
    paint(s);
  });

  var saved=0;try{saved=+localStorage.getItem(KEY)||0;}catch(e){}
  if(saved)paint(saved);
})();

/* ===== TASK 16: HAMBURGER + HEADER FIX (3-line menu) ===== */
(function(){
  var st=document.createElement('style');
  st.textContent=
  '.hamburger{display:none;flex-direction:column;justify-content:center;align-items:center;gap:5px;width:44px;height:44px;background:#f3f0ff;border:none;border-radius:12px;cursor:pointer;padding:0}' +
  '.hamburger span{display:block!important;width:22px!important;height:3px!important;background:#1e1e2e!important;border-radius:3px;transition:all .3s ease;margin:0!important}' +
  '.hamburger:hover{background:#e9e2fd}' +
  '.hamburger.active span:nth-child(1){transform:translateY(8px) rotate(45deg)}' +
  '.hamburger.active span:nth-child(2){opacity:0;transform:scaleX(0)}' +
  '.hamburger.active span:nth-child(3){transform:translateY(-8px) rotate(-45deg)}' +
  '@media(max-width:900px){.hamburger{display:flex!important}.mnav{display:none!important}}' +
  '@media(min-width:901px){.hamburger{display:none!important}}' +
  'html[data-theme="dark"] .hamburger{background:#232336}html[data-theme="dark"] .hamburger span{background:#e8e8f0!important}';
  document.head.appendChild(st);
})();

/* ===== TASK 17 v2: PREMIUM FOOTER FINAL (logo fixed + clickable status) ===== */
(function(){
  var old=document.getElementById('pfCss'); if(old)old.remove();
  var st=document.createElement('style'); st.id='pfCss';
  st.textContent=
  '.pf{background:linear-gradient(180deg,#14141f,#0d0d15);color:#9a9ab0;padding:70px 24px 0;position:relative;overflow:hidden}' +
  '.pf-top{position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#7c3aed,#a855f7,#fcd34d)}' +
  '.pf-grid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr 1fr;gap:40px}' +
  '.pf-brand .pf-logo{display:flex;align-items:center;gap:10px;margin-bottom:16px}' +
  '.pf-brand .lsvg{width:38px;height:38px}' +
  '.pf-brand b{color:#fff;font-size:19px;font-weight:900}' +
  '.pf-brand p{font-size:13.5px;line-height:1.7;color:#8a8aa0;margin-bottom:18px}' +
  '.pf-badges{display:flex;flex-wrap:wrap;gap:8px}' +
  '.pf-badges span{background:rgba(124,58,237,.12);border:1px solid rgba(124,58,237,.3);color:#c9b8ff;font-size:11.5px;font-weight:700;padding:6px 12px;border-radius:999px}' +
  '.pf-col h4{font-size:12px;letter-spacing:1.5px;color:#fff;text-transform:uppercase;margin-bottom:18px;font-weight:800}' +
  '.pf-col a{display:block;color:#9a9ab0;font-size:14px;margin-bottom:12px;text-decoration:none;transition:all .2s}' +
  '.pf-col a:hover{color:#c9b8ff;transform:translateX(4px)}' +
  '.pf-status{display:inline-flex;align-items:center;gap:7px;margin-top:8px;font-size:12px;color:#4ade80;background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.25);padding:6px 12px;border-radius:999px;text-decoration:none;transition:all .2s;cursor:pointer}' +
  '.pf-status:hover{background:rgba(74,222,128,.15)!important;border-color:rgba(74,222,128,.5)!important;transform:translateX(2px)}' +
  '.pf-status i{width:7px;height:7px;background:#4ade80;border-radius:50%;animation:pfPulse 2s infinite;display:inline-block}' +
  '@keyframes pfPulse{0%,100%{opacity:1}50%{opacity:.4}}' +
  '.pf-bottom{max-width:1200px;margin:50px auto 0;border-top:1px solid rgba(255,255,255,.08);padding:22px 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;font-size:13px;color:#6a6a80}' +
  '.pf-top-btn{width:42px;height:42px;border-radius:12px;border:1px solid rgba(124,58,237,.4);background:rgba(124,58,237,.15);color:#c9b8ff;font-size:18px;cursor:pointer;transition:all .2s}' +
  '.pf-top-btn:hover{background:#7c3aed;color:#fff;transform:translateY(-3px)}' +
  '@media(max-width:1000px){.pf-grid{grid-template-columns:1fr 1fr}}' +
  '@media(max-width:560px){.pf-grid{grid-template-columns:1fr}}';
  document.head.appendChild(st);

  var FALLBACK='<svg class="lsvg" viewBox="0 0 48 48"><defs><linearGradient id="fbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6d28d9"/><stop offset="1" stop-color="#a855f7"/></linearGradient></defs><rect width="48" height="48" rx="12" fill="url(#fbg)"/><path d="M14.5 15.5 L19.5 20 L24 11.5 L28.5 20 L33.5 15.5 L33.5 31.5 L27.5 37.5 L17 37.5 Q14.5 37.5 14.5 35 Z" fill="#fff"/><path d="M33.5 31.5 L27.5 37.5 L27.5 31.5 Z" fill="#ddd6fe"/><circle cx="14.5" cy="12.8" r="2.4" fill="#fcd34d"/><circle cx="24" cy="8.8" r="2.6" fill="#fcd34d"/><circle cx="33.5" cy="12.8" r="2.4" fill="#fcd34d"/></svg>';

  function build(){
    var f=document.getElementById('siteFooter'); if(!f)return;
    f.style.cssText='background:#0d0d15;padding:0';
    var src=document.querySelector('.logo .lsvg')||document.querySelector('.lsvg');
    var logo=src?src.outerHTML:FALLBACK;
    f.innerHTML='<div class="pf"><div class="pf-top"></div><div class="pf-grid">'+
    '<div class="pf-brand"><div class="pf-logo">'+logo+'<b>Trono<span style="color:#a855f7">PDF</span></b></div>'+
    '<p>Every PDF tool you need - free, fast and private. Files never leave your device. Powered by open-source libraries (pdf-lib, pdf.js).</p>'+
    '<div class="pf-badges"><span>🔒 100% Private</span><span>⚡ No Uploads</span><span>💯 Free Forever</span></div></div>'+
    '<div class="pf-col"><h4>Product</h4><a href="/">Home</a><a href="/all-tools.html">All Tools</a><a href="/about.html">About Us</a><a href="/contact.html">Contact</a></div>'+
    '<div class="pf-col"><h4>Popular Tools</h4><a href="/merge-pdf.html">Merge PDF</a><a href="/split-pdf.html">Split PDF</a><a href="/compress-pdf.html">Compress PDF</a><a href="/jpg-to-pdf.html">JPG to PDF</a><a href="/pdf-to-word.html">PDF to Word</a><a href="/pdf-to-jpg.html">PDF to JPG</a></div>'+
    '<div class="pf-col"><h4>Image Tools</h4><a href="/image-compressor.html">Image Compressor</a><a href="/image-resizer.html">Image Resizer</a><a href="/passport-photo.html">Passport Photo</a><a href="/signature-resize.html">Signature Resize</a><a href="/blur-photo.html">Blur Photo</a><a href="/image-converter.html">Image Converter</a></div>'+
    '<div class="pf-col"><h4>Legal</h4><a href="/privacy.html">Privacy Policy</a><a href="/terms.html">Terms & Conditions</a><a href="/disclaimer.html">Disclaimer</a><a class="pf-status" href="/status.html"><i></i>All systems operational</a></div>'+
    '</div>'+
    '<div class="pf-bottom"><span>© 2026 TronoPDF — All Rights Reserved.</span><span>Made with 💜 for everyone • Rule Your PDFs 👑</span><button class="pf-top-btn" title="Back to top">↑</button></div>'+
    '</div>';
    var tb=f.querySelector('.pf-top-btn');
    if(tb)tb.onclick=function(){window.scrollTo({top:0,behavior:'smooth'});};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);
  else build();
})();

/* ===== TASK 18: LANGUAGE SELECTOR (26 languages) ===== */
(function(){
  var LANGS=[['en','English'],['es','Español'],['fr','Français'],['de','Deutsch'],['it','Italiano'],['pt','Português'],['ja','日本語'],['ru','Русский'],['ko','한국어'],['zh-CN','中文 (简体)'],['zh-TW','中文 (繁體)'],['ar','العربية'],['bg','Български'],['ca','Català'],['nl','Nederlands'],['el','Ελληνικά'],['hi','हिन्दी'],['id','Bahasa Indonesia'],['ms','Bahasa Melayu'],['pl','Polski'],['sv','Svenska'],['th','ภาษาไทย'],['tr','Türkçe'],['uk','Українська'],['vi','Tiếng Việt'],['sw','Kiswahili']];

  var st=document.createElement('style');
  st.textContent='#google_translate_element{display:none}.skiptranslate,.goog-te-banner-frame,.goog-tooltip,#goog-gt-tt{display:none!important}body{top:0!important}'+
  '.lang-btn{display:inline-flex;align-items:center;gap:8px;background:transparent;border:1px solid #3a3a46;color:#c9c9dd;border-radius:10px;padding:9px 14px;font-size:13px;font-weight:700;cursor:pointer}'+
  '.lang-btn:hover{border-color:#7c3aed;color:#fff}'+
  '.lang-panel{position:fixed;bottom:80px;left:24px;background:#fff;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.3);padding:16px;display:none;grid-template-columns:repeat(3,1fr);gap:2px 16px;max-width:600px;z-index:99999;max-height:60vh;overflow:auto}'+
  '.lang-panel.open{display:grid}'+
  '.lang-opt{background:none;border:none;text-align:left;padding:8px 10px;font-size:13.5px;color:#1e1e2e;cursor:pointer;border-radius:8px;font-weight:600}'+
  '.lang-opt:hover{background:#f3f0ff;color:#7c3aed}'+
  '@media(max-width:640px){.lang-panel{left:12px;right:12px;grid-template-columns:1fr 1fr}}';
  document.head.appendChild(st);

  var gt=document.createElement('div'); gt.id='google_translate_element'; document.body.appendChild(gt);
  var pending=null;

  window.googleTranslateElementInit=function(){
    new google.translate.TranslateElement({pageLanguage:'en',includedLanguages:LANGS.map(function(l){return l[0];}).join(','),layout:google.translate.TranslateElement.InlineLayout.SIMPLE,autoDisplay:false},'google_translate_element');
    waitSelect();
  };
  var g=document.createElement('script');
  g.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.head.appendChild(g);

  function waitSelect(){
    var t=0;
    (function w(){
      var sel=document.querySelector('.goog-te-combo');
      if(sel){ if(pending){sel.value=pending;sel.dispatchEvent(new Event('change'));} return; }
      if(t>50)return; t++; setTimeout(w,200);
    })();
  }
  function applyCode(code){
    var sel=document.querySelector('.goog-te-combo');
    if(sel){ sel.value=code; sel.dispatchEvent(new Event('change')); }
    else pending=code;
  }

  function buildUI(){
    var btn=document.createElement('button'); btn.type='button'; btn.className='lang-btn';
    var cur='English';
    try{ cur=localStorage.getItem('tronopdf-lang-name')||'English'; }catch(e){}
    btn.innerHTML='🌐 <span>'+cur+'</span> ▾';
    var panel=document.createElement('div'); panel.className='lang-panel';
    var h='';
    LANGS.forEach(function(l){ h+='<button class="lang-opt" data-code="'+l[0]+'">'+l[1]+'</button>'; });
    panel.innerHTML=h;
    var fb=document.querySelector('.pf-bottom');
    if(fb) fb.insertBefore(btn, fb.firstChild); else document.body.appendChild(btn);
    document.body.appendChild(panel);
    btn.addEventListener('click',function(e){ e.stopPropagation(); panel.classList.toggle('open'); });
    document.addEventListener('click',function(e){ if(!panel.contains(e.target)&&!btn.contains(e.target)) panel.classList.remove('open'); });
    panel.querySelectorAll('.lang-opt').forEach(function(o){
      o.addEventListener('click',function(){
        var code=o.getAttribute('data-code'), name=o.textContent;
        btn.querySelector('span').textContent=name;
        try{ localStorage.setItem('tronopdf-lang-name',name); }catch(e){}
        applyCode(code);
        panel.classList.remove('open');
      });
    });
  }
  window.addEventListener('load', function(){ setTimeout(buildUI, 200); });
})();

/* ===== TASK 19: COOKIE CONSENT BANNER (GDPR) ===== */
(function(){
  var KEY='tronopdf-cookie-consent';
  function get(){ try{ return localStorage.getItem(KEY); }catch(e){ return null; } }
  function set(v){ try{ localStorage.setItem(KEY,v); }catch(e){} }
  if(get()) return;

  var st=document.createElement('style');
  st.textContent='.cc-banner{position:fixed;left:0;right:0;bottom:0;z-index:99998;background:#14141f;color:#e8e8f0;padding:18px 20px;display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;box-shadow:0 -10px 40px rgba(0,0,0,.4);transform:translateY(100%);transition:transform .4s ease;border-top:1px solid #2a2a40}'+
  '.cc-banner.show{transform:translateY(0)}'+
  '.cc-text{font-size:13.5px;color:#c9c9dd;max-width:640px}'+
  '.cc-text a{color:#c9b8ff;font-weight:700;text-decoration:underline}'+
  '.cc-actions{display:flex;gap:10px}'+
  '.cc-accept{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border:none;font-weight:800;font-size:13.5px;padding:11px 22px;border-radius:10px;cursor:pointer}'+
  '.cc-accept:hover{transform:translateY(-1px)}'+
  '.cc-decline{background:transparent;color:#c9c9dd;border:1px solid #3a3a46;font-weight:700;font-size:13.5px;padding:11px 22px;border-radius:10px;cursor:pointer}'+
  '.cc-decline:hover{border-color:#7c3aed;color:#fff}';
  document.head.appendChild(st);

  function build(){
    var b=document.createElement('div');
    b.className='cc-banner';
    b.innerHTML='<div class="cc-text">🍪 We use cookies & local storage to improve your experience and analyze traffic. No personal data is sold. Read our <a href="/privacy.html">Privacy Policy</a>.</div>'+
    '<div class="cc-actions"><button class="cc-accept" id="ccAccept">Accept</button><button class="cc-decline" id="ccDecline">Decline</button></div>';
    document.body.appendChild(b);
    setTimeout(function(){ b.classList.add('show'); }, 600);
    document.getElementById('ccAccept').onclick=function(){ set('accepted'); b.classList.remove('show'); setTimeout(function(){b.remove();},400); };
    document.getElementById('ccDecline').onclick=function(){ set('declined'); b.classList.remove('show'); setTimeout(function(){b.remove();},400); };
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);
  else build();
})();
/* ===== TASK 20: FOOTER BLOG + FAQ LINKS PATCH ===== */
(function(){
  function patchFooterLinks(){
    var cols=document.querySelectorAll('.pf-col');
    if(!cols || !cols.length) return;
    var productCol=null;
    cols.forEach(function(c){
      var h=c.querySelector('h4');
      if(h && h.textContent.trim().toLowerCase()==='product') productCol=c;
    });
    if(!productCol) return;
    if(!productCol.querySelector('a[href="/blog.html"]')){
      var blog=document.createElement('a');
      blog.href='/blog.html';
      blog.textContent='Blog';
      var about=productCol.querySelector('a[href="/about.html"]');
      if(about) productCol.insertBefore(blog, about);
      else productCol.appendChild(blog);
    }
    if(!productCol.querySelector('a[href="/faq.html"]')){
      var faq=document.createElement('a');
      faq.href='/faq.html';
      faq.textContent='FAQ';
      var contact=productCol.querySelector('a[href="/contact.html"]');
      if(contact) productCol.insertBefore(faq, contact);
      else productCol.appendChild(faq);
    }
  }
  window.addEventListener('load', function(){
    setTimeout(patchFooterLinks, 500);
  });
})();
