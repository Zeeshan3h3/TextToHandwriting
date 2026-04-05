import React, { useState, useEffect, useCallback } from 'react';
import DirectPaperEditor from './DirectPaperEditor';
import { getPaperConfig } from '../utils/paperGenerator';

function getLinesPerPage(paperType) {
    const cfg = getPaperConfig(paperType);
    const gap = cfg.lineGap || 32;
    const startY = cfg.firstLineY || 52;
    const usableHeight = 1123 - startY - 40;
    return Math.max(1, Math.floor(usableHeight / gap));
}

function splitTextIntoPages(fullText, paperType) {
    if (!fullText) return [''];
    const linesPerPage = getLinesPerPage(paperType);
    const allLines = fullText.split('\n');
    const pages = [];

    for (let i = 0; i < allLines.length; i += linesPerPage) {
        pages.push(allLines.slice(i, i + linesPerPage).join('\n'));
    }

    return pages.length > 0 ? pages : [''];
}

export default function MultiPagePaperEditor({ settings, paperRefs, onDrawSave, onTextUpdate }) {
    const [pages, setPages] = useState(['']);
    const [fullText, setFullText] = useState(settings.initialText || '');

    const handleTextChange = useCallback((newText) => {
        setFullText(newText);
        const split = splitTextIntoPages(newText, settings.paperType);
        setPages(split);
        if (onTextUpdate) {
            onTextUpdate(newText);
        }
        // Sync refs array size
        if (paperRefs) {
            paperRefs.current = paperRefs.current.slice(0, split.length);
        }
    }, [settings.paperType, paperRefs, onTextUpdate]);

    // Re-split when paper type changes
    useEffect(() => {
        if (fullText) {
            const split = splitTextIntoPages(fullText, settings.paperType);
            setPages(split);
        }
    }, [settings.paperType, fullText]);

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
            alignItems: 'center',
            width: '100%',
            overflowY: 'auto',
            padding: '32px 0 64px 0'
        }}>
            {pages.map((pageText, pageIndex) => (
                <div key={pageIndex} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {/* Page label */}
                    <div style={{
                        display: 'inline-block',
                        background: '#2a2a40', color: '#e0e0ff',
                        padding: '6px 14px', borderRadius: 20,
                        fontSize: 13, fontWeight: '600', fontFamily: 'system-ui',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        marginBottom: 16, zIndex: 10
                    }}>
                        Page {pageIndex + 1} of {pages.length}
                    </div>

                    <DirectPaperEditor
                        settings={{ ...settings, initialText: pageText }}
                        onTextChange={pageIndex === 0 ? handleTextChange : undefined}
                        paperRef={el => { if (paperRefs) paperRefs.current[pageIndex] = el; }}
                        pageIndex={pageIndex}
                        onDrawSave={onDrawSave}
                    />
                </div>
            ))}

            {/* Auto page creation hint */}
            {pages.length > 1 && (
                <div style={{
                    fontSize: 11, color: '#a0a0c0', fontFamily: 'system-ui',
                    padding: '8px 16px', background: '#1e1e2e',
                    borderRadius: 6, border: '1px solid #2a2a4a',
                    marginTop: -6, marginBottom: 20
                }}>
                    📄 {pages.length} pages auto-generated from your text
                </div>
            )}
        </div>
    );
}
