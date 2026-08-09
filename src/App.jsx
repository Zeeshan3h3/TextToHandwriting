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
import { generateAdvancedPDF } from './utils/canvasRenderer';
import { extractTextFromFile } from './utils/FileExtractor';
import { encodeStateToUrl, decodeStateFromUrl } from './utils/urlState';
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

  const [extendedConfig, setExtendedConfig] = useState({
    realismLevel: 65,
    advancedPaperType: 'ruled',
    pageSize: 'A4',
    leftMargin: 80,
    topMargin: 80,
    bottomMargin: 40,
    headerEnabled: false,
    headerFields: { name: '', date: '', assignment: '', regNo: '' },
    isDraft: false,
    compressionLevel: 0.9,
    scannerEffectEnabled: false,
    scannerIntensity: 50
  });

  // ── UI state ───────────────────────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('hv-theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    const legacy = localStorage.getItem('tf_dark_mode');
    if (legacy !== null) return JSON.parse(legacy);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('hv-theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.body.style.background = '#0f0f1a';
      document.body.style.color = '#e0e0ff';
    } else {
      document.body.style.background = '#f0f0f8';
      document.body.style.color = '#1a1a2e';
    }
  }, [darkMode]);

  // Load from URL on mount
  useEffect(() => {
    const sharedState = decodeStateFromUrl();
    if (sharedState) {
      setSettings(prev => ({ ...prev, ...sharedState.settings }));
      setExtendedConfig(prev => ({ ...prev, ...sharedState.extendedConfig }));
      
      // Clean up URL after loading to prevent link rot sharing
      const url = new URL(window.location.href);
      url.searchParams.delete('share');
      window.history.replaceState({}, '', url);
    }
  }, []);

  const [drawMode, setDrawMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [generateProgress, setGenerateProgress] = useState('');
  const [textStats, setTextStats] = useState({ chars: 0, words: 0 });
  const [showExportModal, setShowExportModal] = useState(false);
  const [lastExportedUrl, setLastExportedUrl] = useState(null);

  const paperRefs = useRef([]);
  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateSettings = useCallback((patch) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

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

  const handlePaperImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateSetting('customPaperBg', ev.target.result);
    reader.readAsDataURL(file);
  };

  const resolvedFontFamily = React.useMemo(() => {
    const found = HANDWRITING_FONTS.find(f => f.id === settings.font);
    return found ? found.family : settings.fontFamily;
  }, [settings.font, settings.fontFamily]);

  const handleDrawSave = useCallback((dataUrl) => {
    console.log("Draw save triggered, data:", dataUrl.substring(0, 30) + '...');
  }, []);

  const handleExport = async ({ format, quality }) => {
    setShowExportModal(false);

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
      await new Promise(r => setTimeout(r, 400)); 

      let scale = getScale(settings.resolution) ?? 1.5;

      const totalTextLength = paperRefs.current
        ?.map(el => el?.innerText?.length || 0)
        .reduce((a, b) => a + b, 0) || 0;
      if (scale > 2 && totalTextLength > 500) {
        scale = 2;
        showToast('⚠️ Resolution capped to High for long texts to prevent browser crash.');
      }

      if (quality === 'high') {
        if (totalTextLength > 500) {
          scale = 2;
          showToast('⚠️ High DPI capped to 2x for long texts to prevent crash.');
        } else {
          scale = 3.125;
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
        const prevTransform = el.style.transform;
        el.style.transform = 'none';

        const canvas = await html2canvas(el, {
          scale,
          useCORS: true,
          backgroundColor: '#fafaf8',
          logging: false,
          width: 794,
          height: 1123 + 40,
          windowWidth: 794,
          windowHeight: 1123 + 40,
        });

        el.style.transform = prevTransform;
        const effCanvas = applyEffect(canvas, settings.effect);

        if (format === 'pdf') {
          if (i > 0) pdf.addPage('a4', 'portrait');
          pdf.addImage(effCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
        } else {
          const dataUrl = effCanvas.toDataURL('image/png');
          if (i === 0) firstCanvasDataUrl = dataUrl;
          const link = document.createElement('a');
          link.download = `handwritten-page-${i + 1}.png`;
          link.href = dataUrl;
          link.click();
          await new Promise(r => setTimeout(r, 200));
        }
      }

      if (format === 'pdf') {
        setGenerateProgress('Saving PDF...');
        pdf.save('handwritten-notes.pdf');
      }

      setLastExportedUrl(window.location.href);
      showToast(`✅ ${format.toUpperCase()} downloaded successfully!`);

    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed: ' + err.message);
    } finally {
      setIsGenerating(false);
      setGenerateProgress('');
    }
  };

  const handleAdvancedExport = async () => {
    setIsExporting(true);
    const fullText = paperRefs.current?.map(el => el?.innerText || '').join('\n');
    try {
      await generateAdvancedPDF(fullText, settings, extendedConfig);
    } catch (err) {
      console.error(err);
      alert('Advanced Export failed. Check console for details.');
    }
    setIsExporting(false);
  };

  const handleExtractText = async (file) => {
    try {
      const text = await extractTextFromFile(file);
      updateSettings({ initialText: text, editorKey: Date.now() });
      showToast('📄 Text extracted successfully!');
    } catch (err) {
      showToast('❌ ' + err.message);
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

  const handleShare = async () => {
    const shareUrl = encodeStateToUrl(settings, extendedConfig);
    const shareData = {
      title: 'Free Text to Handwriting Converter',
      text: 'Convert any text into realistic handwriting — free, no watermark! 🖊️',
      url: shareUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showToast('🔗 Link copied to clipboard!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        await navigator.clipboard.writeText(shareUrl).catch(() => { });
        showToast('🔗 Link copied to clipboard!');
      }
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = encodeStateToUrl(settings, extendedConfig);
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('🔗 Link copied to clipboard!');
    } catch {
      showToast('Could not copy link. Please copy the URL manually.');
    }
  };

  const workspaceContent = (
    <div className="app-workspace" style={{ background: theme.appBg, height: '100vh' }}>
      <ControlPanel
        settings={settings}
        extendedConfig={extendedConfig}
        setExtendedConfig={setExtendedConfig}
        resolvedFontFamily={resolvedFontFamily}
        updateSetting={updateSetting}
        updateSettings={updateSettings}
        paperRefs={paperRefs}
        onExport={handleExport}
        onAdvancedExport={handleAdvancedExport}
        onExtractText={handleExtractText}
        isExporting={isExporting}
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
          key={settings.editorKey || 'editor'}
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
