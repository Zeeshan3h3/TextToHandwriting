import React, { useRef, useEffect } from 'react';
import { CharacterRandomizer, renderCharacter } from '../../utils/randomizer';

export function RealismControl({ realismLevel, onChange, theme, fontFamily }) {
  const previewCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    
    // Fill preview background
    ctx.fillStyle = theme?.previewBg || '#13131f';
    ctx.fillRect(0, 0, w, h);

    const randomizer = new CharacterRandomizer(12345); // fixed seed for preview
    const text = "Handwriting";
    let currentX = 20;
    const currentY = h / 2 + 6;
    const fontSize = 18;
    const inkColor = theme?.inputText || '#e0e0ff';

    ctx.textBaseline = 'alphabetic';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const transform = randomizer.getTransform(i, 0, realismLevel);
      const strokeWidth = randomizer.getStrokeWidth(0.5, i, 0, realismLevel);
      
      renderCharacter(ctx, char, currentX, currentY, fontSize, fontFamily, transform, strokeWidth, inkColor);
      currentX += ctx.measureText(char).width + transform.x + 1;
    }
  }, [realismLevel, theme, fontFamily]);

  return (
    <div style={{ background: theme?.inputBg || '#2a2a3e', borderRadius: 8, padding: 12, border: `1px solid ${theme?.borderColor || '#2a2a4a'}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <label style={{ color: theme?.textPrimary || '#fff', fontSize: 13, fontWeight: 500, fontFamily: 'system-ui' }}>Realism Level</label>
        <span style={{ color: '#6060ff', fontSize: 12, fontFamily: 'monospace' }}>{realismLevel}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={realismLevel}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', height: 6, cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: theme?.textSecondary || '#666688', fontFamily: 'system-ui' }}>
        <span>Typed</span>
        <span>Natural</span>
        <span>Handwritten</span>
      </div>
      <div style={{ marginTop: 12, padding: 8, background: theme?.panelBg || '#1e1e2e', borderRadius: 6, border: `1px solid ${theme?.borderColor || '#2a2a4a'}` }}>
        <canvas ref={previewCanvasRef} width={200} height={40} style={{ width: '100%', height: 40 }} />
      </div>
    </div>
  );
}

const PRESETS = [
  {
    id: 'engineering-assignment',
    name: 'Engineering Assignment',
    config: {
      advancedPaperType: 'ruled',
      pageSize: 'A4',
      leftMargin: 80,
      topMargin: 80,
      headerEnabled: true,
      realismLevel: 75,
      scannerEffectEnabled: true,
      scannerIntensity: 40
    }
  },
  {
    id: 'lab-report',
    name: 'Physics/Chem Lab Report',
    config: {
      advancedPaperType: 'blank',
      pageSize: 'A4',
      leftMargin: 60,
      topMargin: 60,
      headerEnabled: false,
      realismLevel: 65,
      scannerEffectEnabled: false
    }
  },
  {
    id: 'vintage-letter',
    name: 'Vintage Cursive Letter',
    config: {
      advancedPaperType: 'vintage',
      pageSize: 'Letter',
      leftMargin: 100,
      topMargin: 100,
      headerEnabled: false,
      realismLevel: 90,
      scannerEffectEnabled: true,
      scannerIntensity: 70
    }
  }
];

export function TemplateGallery({ theme, setExtendedConfig }) {
  const applyPreset = (presetConfig) => {
    setExtendedConfig(prev => ({ ...prev, ...presetConfig }));
  };

  return (
    <div style={{ background: theme?.inputBg || '#2a2a3e', borderRadius: 8, padding: 12, border: `1px solid ${theme?.borderColor || '#2a2a4a'}` }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: 14, color: theme?.textPrimary }}>Template Gallery</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {PRESETS.map(preset => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset.config)}
            style={{
              padding: '8px 12px',
              background: theme?.panelBg || '#1e1e2e',
              border: `1px solid ${theme?.borderColor || '#2a2a4a'}`,
              color: theme?.textPrimary || '#fff',
              borderRadius: '4px',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'background 0.2s'
            }}
            onMouseOver={e => e.target.style.background = '#6060ff'}
            onMouseOut={e => e.target.style.background = theme?.panelBg || '#1e1e2e'}
          >
            📄 {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AdvancedSettings({ 
  extendedConfig, 
  setExtendedConfig, 
  theme, 
  fontFamily, 
  onExport 
}) {
  const updateConfig = (key, value) => {
    setExtendedConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateHeader = (key, value) => {
    setExtendedConfig(prev => ({ 
      ...prev, 
      headerFields: { ...prev.headerFields, [key]: value } 
    }));
  };

  const inputStyle = {
    background: theme?.panelBg || '#1e1e2e',
    color: theme?.textPrimary || '#fff',
    border: `1px solid ${theme?.borderColor || '#2a2a4a'}`,
    padding: '6px 8px',
    borderRadius: 4,
    width: '100%',
    fontFamily: 'system-ui',
    fontSize: 13,
    marginBottom: 8,
    boxSizing: 'border-box'
  };
  const labelStyle = { display: 'block', fontSize: 12, marginBottom: 4, color: theme?.textSecondary || '#aaa' };

  return (
    <div className="control-section" style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TemplateGallery theme={theme} setExtendedConfig={setExtendedConfig} />

      <RealismControl 
        realismLevel={extendedConfig.realismLevel} 
        onChange={(val) => updateConfig('realismLevel', val)}
        theme={theme}
        fontFamily={fontFamily}
      />

      <div style={{ background: theme?.inputBg || '#2a2a3e', borderRadius: 8, padding: 12, border: `1px solid ${theme?.borderColor || '#2a2a4a'}` }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: 14, color: theme?.textPrimary }}>Paper & Layout (Advanced PDF)</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={labelStyle}>Page Size</label>
            <select style={inputStyle} value={extendedConfig.pageSize} onChange={e => updateConfig('pageSize', e.target.value)}>
              <option value="A4">A4 (India Standard)</option>
              <option value="A5">A5</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Paper Preset</label>
            <select style={inputStyle} value={extendedConfig.advancedPaperType} onChange={e => updateConfig('advancedPaperType', e.target.value)}>
              <option value="blank">Blank White</option>
              <option value="ruled">College Ruled</option>
              <option value="four-line">Four-Line (Cursive)</option>
              <option value="graph">Graph Paper</option>
              <option value="vintage">Aged Parchment</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: 8 }}>
          <div>
            <label style={labelStyle}>Left Margin</label>
            <input type="number" style={inputStyle} value={extendedConfig.leftMargin} onChange={e => updateConfig('leftMargin', Number(e.target.value))} />
          </div>
          <div>
            <label style={labelStyle}>Top Margin</label>
            <input type="number" style={inputStyle} value={extendedConfig.topMargin} onChange={e => updateConfig('topMargin', Number(e.target.value))} />
          </div>
          <div>
            <label style={labelStyle}>Bottom Margin</label>
            <input type="number" style={inputStyle} value={extendedConfig.bottomMargin} onChange={e => updateConfig('bottomMargin', Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div style={{ background: theme?.inputBg || '#2a2a3e', borderRadius: 8, padding: 12, border: `1px solid ${theme?.borderColor || '#2a2a4a'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h4 style={{ margin: 0, fontSize: 14, color: theme?.textPrimary }}>Assignment Header</h4>
          <input type="checkbox" checked={extendedConfig.headerEnabled} onChange={e => updateConfig('headerEnabled', e.target.checked)} />
        </div>
        
        {extendedConfig.headerEnabled && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <input placeholder="Name" style={inputStyle} value={extendedConfig.headerFields.name} onChange={e => updateHeader('name', e.target.value)} />
            <input placeholder="Date" style={inputStyle} value={extendedConfig.headerFields.date} onChange={e => updateHeader('date', e.target.value)} />
            <input placeholder="Reg No" style={inputStyle} value={extendedConfig.headerFields.regNo} onChange={e => updateHeader('regNo', e.target.value)} />
            <input placeholder="Assignment" style={inputStyle} value={extendedConfig.headerFields.assignment} onChange={e => updateHeader('assignment', e.target.value)} />
          </div>
        )}
      </div>

      <div style={{ background: theme?.inputBg || '#2a2a3e', borderRadius: 8, padding: 12, border: `1px solid ${theme?.borderColor || '#2a2a4a'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h4 style={{ margin: 0, fontSize: 14, color: theme?.textPrimary }}>CamScanner Effect</h4>
          <input type="checkbox" checked={extendedConfig.scannerEffectEnabled} onChange={e => updateConfig('scannerEffectEnabled', e.target.checked)} />
        </div>
        
        {extendedConfig.scannerEffectEnabled && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <label style={labelStyle}>Intensity</label>
              <span style={{ color: '#6060ff', fontSize: 12 }}>{extendedConfig.scannerIntensity}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={extendedConfig.scannerIntensity} 
              onChange={e => updateConfig('scannerIntensity', Number(e.target.value))}
              style={{ width: '100%', height: 6 }} 
            />
          </div>
        )}
      </div>

      <button 
        onClick={onExport}
        style={{
          background: '#6060ff',
          color: 'white',
          border: 'none',
          padding: '12px',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '8px',
          transition: 'background 0.2s'
        }}
        onMouseOver={e => e.target.style.background = '#7070ff'}
        onMouseOut={e => e.target.style.background = '#6060ff'}
      >
        Export Advanced PDF
      </button>
    </div>
  );
}
