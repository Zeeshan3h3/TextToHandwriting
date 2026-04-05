import React, { useState } from 'react';

export function CollapsibleSection({ title, defaultOpen = false, children, theme }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const borderColor = theme?.borderColor || '#2a2a4a';
    const labelColor = theme?.labelColor || '#a0a0c0';

    return (
        <div style={{
            borderBottom: `1px solid ${borderColor}`,
            marginBottom: 8,
        }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    padding: '12px 0',
                    cursor: 'pointer',
                    color: labelColor,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 1.2,
                    fontFamily: 'system-ui',
                }}
            >
                <span>{title}</span>
                <span style={{
                    transform: `rotate(${isOpen ? 180 : 0}deg)`,
                    transition: 'transform 0.2s',
                    fontSize: 14
                }}>
                    ▼
                </span>
            </button>

            {isOpen && (
                <div style={{ paddingBottom: 16, animation: 'fadeIn 0.2s ease-in' }}>
                    {children}
                </div>
            )}
        </div>
    );
}
