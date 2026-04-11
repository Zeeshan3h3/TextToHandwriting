import React, { useState, useEffect, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ControlPanel } from './components/ControlPanel';
import MultiPagePaperEditor from './components/MultiPagePaperEditor';
import LandingPage from './components/landing/LandingPage';
import ContactPage from './components/landing/ContactPage';
import { ExportModal } from './components/ExportModal';
import { StickyDownloadBar } from './components/StickyDownloadBar';
import { applyEffect } from './utils/effects';
import { getScale } from './constants/resolution';
import { HANDWRITING_FONTS } from './constants/fonts';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './styles/global.css';
import './App.css';

const BlogRoutes = React.lazy(() => import('./pages/blog'));

// ── Sample placeholder text ────────────────────────────────────────────────────
const SAMPLE_TEXT = `Start Writing from here.......`;

// ── Theme tokens ──────────────────────────────────────────────────────────────
const DARK_THEME = {
  appBg: '#0f0f1a',
  panelBg: '#1e1e2e',
  previewBg: '#13131f',
  labelColor: '#a0a0c0',
  inputBg: '#2a2a3e',
  inputText: '#e0e0ff',
  borderColor: '#2a2a4a',
  textPrimary: '#e0e0ff',
  textSecondary: '#666688',
};
const LIGHT_THEME = {
  appBg: '#f0f0f8',
  panelBg: '#ffffff',
  previewBg: '#e8e8f0',
  labelColor: '#444466',
  inputBg: '#f4f4fc',
  inputText: '#1a1a2e',
  borderColor: '#ccccdd',
  textPrimary: '#1a1a2e',
  textSecondary: '#888899',
};

// ── Toast notification helper ─────────────────────────────────────────────────
function showToast(msg, duration = 3500) {
  const existing = document.getElementById('hv-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'hv-toast';
  toast.textContent = msg;
  toast.style.cssText = [
    'position:fixed', 'bottom:24px', 'left:50%', 'transform:translateX(-50%)',
    'background:#2a2a4a', 'color:#e0e0ff', 'padding:10px 22px', 'border-radius:8px',
    'font-size:14px', 'z-index:99999', 'box-shadow:0 4px 16px rgba(0,0,0,0.5)',
    'font-family:system-ui', 'pointer-events:none',
  ].join(';');
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

function App() {
  // ── Route state ────────────────────────────────────────────────────────────
  const navigate = useNavigate();

  // ── Settings state ────────────────────────────────────────────────────────
  const [settings, setSettings] = useState({
    initialText: SAMPLE_TEXT,
    font: 'homemade-apple',
    fontFamily: "'Homemade Apple', cursive",
    customFontLoaded: false,
    inkColor: '#1a237e',
    paperType: 'framed-ruled',
    customPaperBg: null,
    showLines: true,
    showMargin: true,
    fontSize: 20,
    effect: 'none',
    resolution: 'normal',
    verticalPosition: 0,
    wordSpacing: 0,
    letterSpacing: 0,
    messiness: 4,
    lineHeight: 1.6,
    inkOpacityBoost: 1.0,
  });

  // ── UI state ───────────────────────────────────────────────────────────────
  // BUG 6 FIX: Dark mode persisted via localStorage with system preference fallback
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('hv-theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    // Legacy key support
    const legacy = localStorage.getItem('tf_dark_mode');
    if (legacy !== null) return JSON.parse(legacy);
    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // BUG 6 FIX: Persist with canonical key 'hv-theme'
    localStorage.setItem('hv-theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.body.style.background = '#0f0f1a';
      document.body.style.color = '#e0e0ff';
    } else {
      document.body.style.background = '#f0f0f8';
      document.body.style.color = '#1a1a2e';
    }
  }, [darkMode]);

  const [drawMode, setDrawMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState('');
  const [textStats, setTextStats] = useState({ chars: 0, words: 0 });
  const [showExportModal, setShowExportModal] = useState(false);
  const [lastExportedUrl, setLastExportedUrl] = useState(null);

  const paperRefs = useRef([]);
  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  // ── Functional-form setters ───────────────────────────────────────────────
  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateSettings = useCallback((patch) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  // ── BUG 3 FIX: Custom font upload with race condition prevention ──────────
  const handleCustomFontUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const valid = ['.ttf', '.otf', '.woff', '.woff2'];
    if (!valid.some(ext => file.name.toLowerCase().endsWith(ext))) {
      alert('Please upload a valid font file (.ttf, .otf, .woff, .woff2)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      // BUG 3 FIX: Use FontFace API and wait for document.fonts.ready before applying
      const font = new FontFace('CustomHandwriting', ev.target.result);
      font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        document.fonts.ready.then(() => {
          updateSettings({ font: 'custom', fontFamily: 'CustomHandwriting, cursive', customFontLoaded: true });
          showToast('✅ Custom font loaded successfully!');
        });
      }).catch(() => {
        alert('Failed to load font. Please ensure the file is a valid font.');
      });
    };
    reader.readAsArrayBuffer(file);
  };

  // ── Custom paper background upload ────────────────────────────────────────
  const handlePaperImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateSetting('customPaperBg', ev.target.result);
    reader.readAsDataURL(file);
  };

  // Resolve current fontFamily from font id
  const resolvedFontFamily = React.useMemo(() => {
    const found = HANDWRITING_FONTS.find(f => f.id === settings.font);
    return found ? found.family : settings.fontFamily;
  }, [settings.font, settings.fontFamily]);

  const handleDrawSave = useCallback((dataUrl) => {
    console.log("Draw save triggered, data:", dataUrl.substring(0, 30) + '...');
  }, []);

  // ── PDF/PNG Export ──────────────────────────────────────────────
  const handleExport = async ({ format, quality }) => {
    setShowExportModal(false);

    // BUG 1 FIX: Empty input validation
    const currentText = paperRefs.current
      ?.map(el => el?.innerText || '')
      .join('')
      .trim();
    if (!currentText || currentText.length === 0) {
      alert('Please enter some text before downloading!');
      return;
    }

    setIsGenerating(true);
    setGenerateProgress('Initializing...');

    try {
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 400)); // wait for layout settling

      // Base scale based on resolution setting
      let scale = getScale(settings.resolution) ?? 1.5;

      // BUG 4 FIX: Cap resolution for long texts to prevent browser crash
      const totalTextLength = paperRefs.current
        ?.map(el => el?.innerText?.length || 0)
        .reduce((a, b) => a + b, 0) || 0;
      if (scale > 2 && totalTextLength > 500) {
        scale = 2;
        showToast('⚠️ Resolution capped to High for long texts to prevent browser crash.');
      }

      // Override if user selected High 300 DPI mode explicitly in modal
      if (quality === 'high') {
        // Still cap for very long texts even in high quality mode
        if (totalTextLength > 500) {
          scale = 2;
          showToast('⚠️ High DPI capped to 2x for long texts to prevent crash.');
        } else {
          scale = 3.125; // 300 DPI relative to 96
        }
      }

      const validRefs = (paperRefs.current || []).filter(el => el instanceof HTMLElement);

      if (validRefs.length === 0) throw new Error('No paper pages found. Please type something first.');

      let pdf;
      let firstCanvasDataUrl = null;

      if (format === 'pdf') {
        pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      }

      for (let i = 0; i < validRefs.length; i++) {
        setGenerateProgress(`Rendering page ${i + 1} of ${validRefs.length}…`);
        const el = validRefs[i];

        // Save bounds and transform to prevent html2canvas glitches on scaled elements
        const prevTransform = el.style.transform;
        el.style.transform = 'none';

        // BUG 5 FIX: Add bottom padding buffer to prevent last-line clipping
        const canvas = await html2canvas(el, {
          scale,
          useCORS: true,
          backgroundColor: '#fafaf8',
          logging: false,
          width: 794,
          height: 1123 + 40, // 40px bottom padding buffer
          windowWidth: 794,
          windowHeight: 1123 + 40,
        });

        // Restore original scale after capture
        el.style.transform = prevTransform;

        const effCanvas = applyEffect(canvas, settings.effect);

        if (format === 'pdf') {
          if (i > 0) pdf.addPage('a4', 'portrait');
          pdf.addImage(effCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
        } else {
          // Format PNG
          const dataUrl = effCanvas.toDataURL('image/png');
          if (i === 0) firstCanvasDataUrl = dataUrl;
          const link = document.createElement('a');
          link.download = `handwritten-page-${i + 1}.png`;
          link.href = dataUrl;
          link.click();
          await new Promise(r => setTimeout(r, 200)); // Stagger multiple downloads
        }
      }

      if (format === 'pdf') {
        setGenerateProgress('Saving PDF...');
        pdf.save('handwritten-notes.pdf');
      }

      // Store URL for share feature
      setLastExportedUrl(window.location.href);

      // BUG 2 FIX: Toast notification on successful export (loader was already handled via isGenerating)
      showToast(`✅ ${format.toUpperCase()} downloaded successfully!`);

    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed: ' + err.message);
    } finally {
      setIsGenerating(false);
      setGenerateProgress('');
    }
  };

  const handleGetStarted = () => {
    if (window.location.pathname !== '/') {
      navigate('/#live-demo');
      setTimeout(() => {
        document.getElementById('live-demo')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('live-demo')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTextUpdate = (text) => {
    const chars = text.length;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    setTextStats({ chars, words });
  };

  // ── VIRAL FEATURE 1: Web Share API ────────────────────────────────────────
  const handleShare = async () => {
    const shareData = {
      title: 'Free Text to Handwriting Converter',
      text: 'Convert any text into realistic handwriting — free, no watermark! 🖊️',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        showToast('🔗 Link copied to clipboard!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        await navigator.clipboard.writeText(window.location.href).catch(() => { });
        showToast('🔗 Link copied to clipboard!');
      }
    }
  };

  // ── VIRAL FEATURE 2: Copy link ────────────────────────────────────────────
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Link copied to clipboard!');
    } catch {
      showToast('Could not copy link. Please copy the URL manually.');
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const workspaceContent = (
    <div className="app-workspace" style={{ background: theme.appBg, height: '100vh' }}>
      <ControlPanel
        settings={settings}
        updateSetting={updateSetting}
        updateSettings={updateSettings}
        paperRefs={paperRefs}
        theme={theme}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
        drawMode={drawMode}
        onToggleDraw={() => setDrawMode(d => !d)}
        onCustomFontUpload={handleCustomFontUpload}
        onPaperImageUpload={handlePaperImageUpload}
        onGenerate={() => setShowExportModal(true)}
        isGenerating={isGenerating}
        generateProgress={generateProgress}
        textStats={textStats}
      />
      <div className="preview-area" style={{ background: theme.previewBg, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <MultiPagePaperEditor
          settings={{ ...settings, fontFamily: resolvedFontFamily, drawMode }}
          paperRefs={paperRefs}
          onDrawSave={handleDrawSave}
          onTextUpdate={handleTextUpdate}
        />
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
          theme={theme}
        />
        <StickyDownloadBar
          show={textStats.chars > 0 && !isGenerating}
          onDownload={() => setShowExportModal(true)}
          wordCount={textStats.words}
          onShare={handleShare}
          onCopyLink={handleCopyLink}
          lastExportedUrl={lastExportedUrl}
        />
      </div>
    </div>
  );

  return (
    <div className="app-root">
      <Routes>
        <Route path="/" element={
          <LandingPage onGetStarted={handleGetStarted}>
            {workspaceContent}
          </LandingPage>
        } />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog/*" element={
          <React.Suspense fallback={<div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>}>
            <BlogRoutes />
          </React.Suspense>
        } />
      </Routes>
    </div>
  );
}

export default App;
