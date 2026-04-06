import React, { useState } from 'react';
import './ColorPalette.css';

const INK_PRESETS = [
    { label: '🖊️ Blue Pen', color: '#1a237e', opacityBoost: 1.0 },
    { label: '🖊️ Black Pen', color: '#0d0d0d', opacityBoost: 1.0 },
    { label: '🖊️ Red Pen', color: '#c62828', opacityBoost: 1.0 },
    { label: '✏️ Pencil', color: '#78909c', opacityBoost: 0.72 },
    { label: '🪶 Fountain', color: '#0d47a1', opacityBoost: 1.0 },
];

const FULL_PALETTE = [
    '#0d47a1', '#1565c0', '#1976d2', '#1e88e5', '#42a5f5', '#90caf9',
    '#1b5e20', '#2e7d32', '#388e3c', '#43a047', '#66bb6a', '#a5d6a7',
    '#b71c1c', '#c62828', '#d32f2f', '#e53935', '#ef5350', '#ef9a9a',
    '#4a148c', '#6a1b9a', '#7b1fa2', '#8e24aa', '#ab47bc', '#ce93d8',
    '#0d0d0d', '#212121', '#424242', '#616161', '#757575', '#9e9e9e',
    '#e65100', '#ef6c00', '#f57c00', '#fb8c00', '#ffa726', '#ffcc02',
];


export function ColorPalette({ inkColor, onColorChange, onPresetSelect }) {
    const [paletteOpen, setPaletteOpen] = useState(false);

    return (
        <div className="color-palette">

            {/* ── Selected color preview row ── */}
            <div className="color-preview-row">
                <div
                    className="color-preview-swatch"
                    style={{ backgroundColor: inkColor }}
                />
                <span className="color-preview-hex">{inkColor}</span>
                <input
                    type="color"
                    value={inkColor}
                    onChange={e => onColorChange(e.target.value)}
                    className="color-native-input"
                    title="Custom color"
                />
            </div>

            {/* ── Pen preset pills ── */}
            <div className="pen-preset-row">
                {INK_PRESETS.map(preset => (
                    <button
                        key={preset.color}
                        className={`pen-pill ${inkColor === preset.color ? 'active' : ''}`}
                        // Call onPresetSelect (atomic) — NOT two separate handlers
                        onClick={() => onPresetSelect(preset.color, preset.opacityBoost)}
                        title={preset.label}
                        style={{ '--pill-color': preset.color }}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            {/* ── Palette toggle ── */}
            <button
                className="palette-toggle"
                onClick={() => setPaletteOpen(o => !o)}
            >
                {paletteOpen ? '▲ Hide full palette' : '▼ Show full palette (36 colors)'}
            </button>

            {/* ── Full 36-color grid ── */}
            {paletteOpen && (
                <div className="full-palette-grid">
                    {FULL_PALETTE.map(color => (
                        <button
                            key={color}
                            className={`palette-dot ${inkColor === color ? 'selected' : ''}`}
                            onClick={() => onColorChange(color)}
                            style={{ backgroundColor: color }}
                            title={color}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
