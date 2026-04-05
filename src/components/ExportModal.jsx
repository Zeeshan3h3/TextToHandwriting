import React, { useState } from 'react';

export function ExportModal({ isOpen, onClose, onExport, theme }) {
    const [format, setFormat] = useState('pdf');
    const [quality, setQuality] = useState('standard');

    if (!isOpen) return null;

    const handleDownload = () => {
        onExport({ format, quality });
    };

    const modalBg = theme?.panelBg || '#1e1e2e';
    const textPrimary = theme?.inputText || '#fff';
    const textSecondary = theme?.textSecondary || '#a0a0c0';
    const borderColor = theme?.borderColor || '#2a2a4a';
    const inputBg = theme?.inputBg || '#2a2a3e';

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, fontFamily: 'system-ui'
        }}>
            <div style={{
                background: modalBg, width: 400, borderRadius: 16,
                boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
                border: `1px solid ${borderColor}`,
                overflow: 'hidden', animation: 'fadeIn 0.2s ease-out'
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px', borderBottom: `1px solid ${borderColor}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <h2 style={{ margin: 0, fontSize: 20, color: textPrimary }}>Download Export</h2>
                    <button onClick={onClose} style={{
                        background: 'none', border: 'none', color: textSecondary,
                        fontSize: 24, cursor: 'pointer', lineHeight: 1
                    }}>×</button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px' }}>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', marginBottom: 12, fontSize: 12, fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: 1 }}>
                            File Format
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <button
                                onClick={() => setFormat('pdf')}
                                style={{
                                    padding: '16px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                                    border: `2px solid ${format === 'pdf' ? '#6060ff' : borderColor}`,
                                    background: format === 'pdf' ? '#6060ff15' : inputBg,
                                    color: textPrimary
                                }}
                            >
                                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>PDF Document</div>
                                <div style={{ fontSize: 12, color: textSecondary }}>Best for multiple pages and printing</div>
                            </button>
                            <button
                                onClick={() => setFormat('png')}
                                style={{
                                    padding: '16px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                                    border: `2px solid ${format === 'png' ? '#6060ff' : borderColor}`,
                                    background: format === 'png' ? '#6060ff15' : inputBg,
                                    color: textPrimary
                                }}
                            >
                                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>PNG Images</div>
                                <div style={{ fontSize: 12, color: textSecondary }}>Best for sharing single pages online</div>
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: 32 }}>
                        <label style={{ display: 'block', marginBottom: 12, fontSize: 12, fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Export Quality
                        </label>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: textPrimary }}>
                                <input
                                    type="radio" name="quality" value="standard"
                                    checked={quality === 'standard'}
                                    onChange={() => setQuality('standard')}
                                />
                                Standard (Fast)
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: textPrimary }}>
                                <input
                                    type="radio" name="quality" value="high"
                                    checked={quality === 'high'}
                                    onChange={() => setQuality('high')}
                                />
                                High (300 DPI)
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={handleDownload}
                        style={{
                            width: '100%', padding: '16px', borderRadius: 8,
                            background: '#6060ff', color: '#fff', border: 'none',
                            fontSize: 16, fontWeight: 600, cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(96, 96, 255, 0.3)'
                        }}
                    >
                        Start Download 📥
                    </button>
                </div>
            </div>
        </div>
    );
}
