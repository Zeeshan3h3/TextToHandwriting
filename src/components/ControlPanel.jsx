import React from 'react';
import { PAPER_TYPES } from '../utils/paperGenerator';
import { HANDWRITING_FONTS } from '../constants/fonts';
import { EFFECTS } from '../utils/effects';
import { ColorPalette } from './ColorPalette';
import { RESOLUTIONS } from '../constants/resolution';
import { CollapsibleSection } from './controls/CollapsibleSection';
import './ControlPanel.css';

// ── Toggle switch sub-component ───────────────────────────────────────────────
function Toggle({ value, onChange, theme }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 22, borderRadius: 11, border: 'none',
        background: value ? '#6060ff' : (theme?.borderColor || '#2a2a4a'),
        cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: 'white',
        position: 'absolute', top: 2,
        left: value ? 24 : 2,
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />
    </button>
  );
}

export function ControlPanel({
  settings,
  updateSetting,
  updateSettings,
  paperRefs,
  theme,
  darkMode,
  onToggleDark,
  drawMode,
  onToggleDraw,
  onCustomFontUpload,
  onPaperImageUpload,
  onGenerate,
  isGenerating,
  generateProgress,
  textStats,
}) {
  const t = theme || {};
  const panelBg = t.panelBg || '#1e1e2e';
  const labelColor = t.labelColor || '#a0a0c0';
  const inputBg = t.inputBg || '#2a2a3e';
  const inputText = t.inputText || '#e0e0ff';
  const borderColor = t.borderColor || '#2a2a4a';
  const textSecondary = t.textSecondary || '#666688';

  const sliderRowStyle = { marginBottom: 14 };
  const sliderHeaderStyle = {
    display: 'flex', justifyContent: 'space-between', marginBottom: 4,
  };
  const sliderLabelStyle = { color: labelColor, fontSize: 11, fontFamily: 'system-ui' };
  const sliderValueStyle = { color: '#6060ff', fontSize: 11, fontFamily: 'monospace' };

  return (
    <div
      className="control-panel"
      style={{ background: panelBg, borderRight: `1px solid ${borderColor}` }}
    >
      {/* ── App header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${borderColor}`,
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: inputText, margin: 0 }}>
          ✒️ Settings
        </h1>
        <button
          onClick={onToggleDark}
          title={darkMode ? 'Light mode' : 'Dark mode'}
          style={{
            background: 'none', border: `1px solid ${borderColor}`,
            borderRadius: 20, padding: '4px 10px', cursor: 'pointer',
            fontSize: 16, color: inputText,
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
        {/* ── 2. DRAW BETA TOGGLE ── */}
        <div className="control-section" style={{ marginBottom: 16 }}>
          <button
            onClick={onToggleDraw}
            style={{
              width: '100%', padding: '8px 0', borderRadius: 6, cursor: 'pointer',
              border: `1.5px solid ${drawMode ? '#60ff60' : borderColor}`,
              background: drawMode ? '#103010' : 'transparent',
              color: drawMode ? '#60ff60' : textSecondary,
              fontSize: 12, fontFamily: 'system-ui',
            }}
          >
            ✏️ Draw {drawMode ? '(ON — click paper to draw)' : '(Beta)'}
          </button>
        </div>

        {/* ── Document Stats ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          background: inputBg, padding: '10px 12px', borderRadius: 8,
          marginBottom: 16, border: `1px solid ${borderColor}`,
          fontFamily: 'system-ui'
        }}>
          <div>
            <div style={{ fontSize: 10, color: textSecondary, textTransform: 'uppercase', letterSpacing: 1 }}>Characters</div>
            <div style={{ fontSize: 16, color: '#e0e0ff', fontWeight: 600 }}>{textStats?.chars || 0}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: textSecondary, textTransform: 'uppercase', letterSpacing: 1 }}>Words</div>
            <div style={{ fontSize: 16, color: '#e0e0ff', fontWeight: 600 }}>{textStats?.words || 0}</div>
          </div>
        </div>

        <CollapsibleSection title="Typography & Ink" defaultOpen={true} theme={theme}>
          {/* ── 3. HANDWRITING STYLE ── */}
          <div className="control-section">
            <div className="font-picker">
              {HANDWRITING_FONTS.filter(f => !f.isCustom).map((font, index) => (
                <button
                  key={font.id}
                  className={`font-card ${settings.font === font.id ? 'active' : ''}`}
                  onClick={() => updateSettings({ font: font.id, fontFamily: font.family })}
                  style={{ fontFamily: font.family, position: 'relative' }}
                >
                  {font.sampleText}
                </button>
              ))}
            </div>
            {/* BUG 9 FIX: Hindi font tooltip when Kruti-dev is selected */}
            {settings.font === 'kruti-dev' && (
              <div style={{
                marginTop: 8, padding: '8px 10px', borderRadius: 6,
                background: '#2a1a0a', border: '1px solid #6a4010',
                color: '#ddaa66', fontSize: 11, fontFamily: 'system-ui', lineHeight: 1.5,
              }}>
                ℹ️ <strong>Kruti-dev (Hindi):</strong> For best results, type in phonetic transliteration or use Kruti-dev keyboard layout. Standard Unicode Devanagari may not render correctly.
              </div>
            )}
          </div>

          {/* ── 4. CUSTOM FONT UPLOAD ── */}
          <div className="control-section">
            <label
              htmlFor="custom-font-upload"
              style={{
                display: 'block', padding: '8px 12px', borderRadius: 6,
                border: `1.5px dashed ${borderColor}`, color: textSecondary,
                fontSize: 12, cursor: 'pointer', textAlign: 'center',
                background: inputBg, fontFamily: 'system-ui',
                ...(settings.font === 'custom' ? { borderColor: '#6060ff', color: '#a0a0ff' } : {}),
              }}
            >
              {settings.font === 'custom' ? '✅ Custom font active' : '📁 Upload .ttf / .otf / .woff'}
              <input id="custom-font-upload" type="file"
                accept=".ttf,.otf,.woff,.woff2" style={{ display: 'none' }}
                onChange={onCustomFontUpload} />
            </label>
          </div>

          {/* ── 5. FONT SIZE ── */}
          <div className="control-section">
            <div className="range-header">
              <label className="control-label" style={{ color: labelColor }}>Font Size</label>
              <span className="range-value">{settings.fontSize}px</span>
            </div>
            <input type="range" className="control-range"
              min="14" max="32" value={settings.fontSize}
              onChange={e => updateSetting('fontSize', parseInt(e.target.value))} />
          </div>

          {/* ── 6. INK COLOR & PRESETS ── */}
          <div className="control-section">
            <ColorPalette
              inkColor={settings.inkColor}
              onColorChange={c => updateSetting('inkColor', c)}
              onPresetSelect={(color, opacityBoost) => updateSettings({ inkColor: color, inkOpacityBoost: opacityBoost })}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Paper & Layout" defaultOpen={true} theme={theme}>
          {/* ── 8. PAPER TYPE ── */}
          <div className="control-section">
            <div className="paper-type-grid">
              {PAPER_TYPES.map(paper => (
                <button
                  key={paper.id}
                  className={`paper-type-card ${settings.paperType === paper.id ? 'active' : ''}`}
                  onClick={() => updateSetting('paperType', paper.id)}
                  title={paper.label}
                >
                  <span className="paper-type-icon">{paper.icon}</span>
                  <span className="paper-type-label">{paper.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Margin & Line Options ── */}
          <div className="control-section" style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: labelColor, fontSize: 12, fontFamily: 'system-ui' }}>Show Custom Margin</span>
              <Toggle value={settings.showMargin}
                onChange={v => updateSetting('showMargin', v)} theme={theme} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: labelColor, fontSize: 12, fontFamily: 'system-ui' }}>Show Ruled Lines</span>
              <Toggle value={settings.showLines}
                onChange={v => updateSetting('showLines', v)} theme={theme} />
            </div>
          </div>

          {/* ── Custom Paper Background Upload ── */}
          <div className="control-section">
            <label
              htmlFor="paper-bg-upload"
              style={{
                display: 'block', padding: '9px 12px', borderRadius: 6, cursor: 'pointer',
                border: `1.5px dashed ${borderColor}`, color: textSecondary,
                fontSize: 12, textAlign: 'center', background: inputBg, fontFamily: 'system-ui',
              }}
            >
              📄 Upload Paper Background
              <input id="paper-bg-upload" type="file" accept="image/*"
                style={{ display: 'none' }} onChange={onPaperImageUpload} />
            </label>
            {settings.customPaperBg && (
              <button
                onClick={() => updateSetting('customPaperBg', null)}
                style={{
                  marginTop: 6, width: '100%', padding: '5px 0',
                  background: 'none', border: `1px solid #3a2a2a`,
                  color: '#aa6868', borderRadius: 4, fontSize: 11, cursor: 'pointer',
                  fontFamily: 'system-ui',
                }}
              >
                ✕ Remove custom background
              </button>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Spacing & Effects" defaultOpen={false} theme={theme}>
          {/* ── 9. EFFECTS ── */}
          <div className="control-section">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {EFFECTS.map(eff => {
                const active = settings.effect === eff.id;
                return (
                  <button
                    key={eff.id}
                    onClick={() => updateSetting('effect', eff.id)}
                    style={{
                      padding: '8px 4px', borderRadius: 6, cursor: 'pointer',
                      border: `1.5px solid ${active ? '#6060ff' : borderColor}`,
                      background: active ? '#6060ff22' : inputBg,
                      color: active ? '#a0a0ff' : textSecondary,
                      fontSize: 11, fontFamily: 'system-ui', transition: 'all 0.15s',
                    }}
                  >
                    {eff.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="control-section" style={{ marginTop: 16 }}>
            <div style={sliderRowStyle}>
              <div style={sliderHeaderStyle}>
                <span style={sliderLabelStyle}>Vertical Shift</span>
                <span style={sliderValueStyle}>
                  {settings.verticalPosition > 0 ? '+' : ''}{settings.verticalPosition}px
                </span>
              </div>
              <input type="range" className="control-range"
                min="-10" max="10" step="1" value={settings.verticalPosition}
                onChange={e => updateSetting('verticalPosition', Number(e.target.value))} />
            </div>

            <div style={sliderRowStyle}>
              <div style={sliderHeaderStyle}>
                <span style={sliderLabelStyle}>Word Spacing</span>
                <span style={sliderValueStyle}>{settings.wordSpacing}px</span>
              </div>
              <input type="range" className="control-range"
                min="-5" max="30" step="1" value={settings.wordSpacing}
                onChange={e => updateSetting('wordSpacing', Number(e.target.value))} />
            </div>

            <div style={sliderRowStyle}>
              <div style={sliderHeaderStyle}>
                <span style={sliderLabelStyle}>Letter Spacing</span>
                <span style={sliderValueStyle}>{settings.letterSpacing}px</span>
              </div>
              <input type="range" className="control-range"
                min="-5" max="10" step="0.5" value={settings.letterSpacing}
                onChange={e => updateSetting('letterSpacing', Number(e.target.value))} />
            </div>

            <div style={sliderRowStyle}>
              <div style={sliderHeaderStyle}>
                <span className="control-label" style={{ color: labelColor }}>Messiness / Jitter</span>
                <span className="range-value">{settings.messiness}/10</span>
              </div>
              <input type="range" className="control-range"
                min="0" max="10" value={settings.messiness}
                onChange={e => updateSetting('messiness', parseInt(e.target.value))} />
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Export Settings" defaultOpen={false} theme={theme}>
          {/* ── 10. RESOLUTION ── */}
          <div className="control-section">
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {RESOLUTIONS.map(res => {
                const active = settings.resolution === res.id;
                return (
                  <button
                    key={res.id}
                    onClick={() => updateSetting('resolution', res.id)}
                    title={res.dpiNote}
                    style={{
                      padding: '5px 8px', borderRadius: 4, cursor: 'pointer', fontFamily: 'system-ui',
                      border: `1px solid ${active ? '#6060ff' : borderColor}`,
                      background: active ? '#6060ff' : 'transparent',
                      color: active ? 'white' : textSecondary,
                      fontSize: 10, whiteSpace: 'nowrap',
                    }}
                  >
                    {res.label}
                  </button>
                );
              })}
            </div>
            <span style={{ fontSize: 10, color: textSecondary, marginTop: 4, display: 'block', fontFamily: 'system-ui' }}>
              300 DPI (High) recommended for printing
            </span>
          </div>

        </CollapsibleSection>
      </div>

      {/* ── GENERATE IMAGE BUTTON ── */}
      <div style={{ paddingTop: 16, borderTop: `1px solid ${borderColor}`, marginTop: 'auto' }}>
        {/* BUG 10 FIX: Preview vs output mismatch note */}
        <p style={{
          fontSize: 11, color: textSecondary, marginBottom: 10,
          fontFamily: 'system-ui', lineHeight: 1.4, textAlign: 'center',
        }}>
          ⚠️ The preview is approximate. The downloaded file is the accurate final output.
        </p>
        <button
          className={`generate-button generate-button--${isGenerating ? 'loading' : 'idle'}`}
          onClick={onGenerate}
          disabled={isGenerating}
          style={{ marginTop: 0 }}
        >
          {isGenerating ? (
            <><span className="spinner" />{generateProgress || 'Exporting…'}</>
          ) : (
            '📥 Download Document'
          )}
        </button>
      </div>
    </div>
  );
}
