import React, { useEffect, useState } from 'react';

export function StickyDownloadBar({ show, onDownload, wordCount }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [show]);

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#6060ff',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: 100,
            boxShadow: '0 12px 32px rgba(96, 96, 255, 0.4), 0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            zIndex: 900,
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            fontFamily: 'system-ui'
        }}>
            <style>
                {`
          @keyframes slideUp {
            from { transform: translate(-50%, 100%); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
          }
        `}
            </style>

            <div style={{ display: 'flex', flexDirection: 'column', fontSize: 13 }}>
                <span style={{ fontWeight: 600 }}>Ready to download?</span>
                <span style={{ opacity: 0.8, fontSize: 11 }}>{wordCount} words written</span>
            </div>

            <button
                onClick={onDownload}
                style={{
                    background: '#fff',
                    color: '#6060ff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 100,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.1s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            >
                Export 📥
            </button>
        </div>
    );
}
