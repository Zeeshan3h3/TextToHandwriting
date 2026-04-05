import React, { useRef, useState, useEffect, useCallback } from 'react';
import { generateBackground, getPaperConfig } from '../utils/paperGenerator';
import { DrawCanvas } from './DrawCanvas';

const PAPER_WIDTH = 794;   // A4 at 96dpi
const PAPER_HEIGHT = 1123;

export default function DirectPaperEditor({
    settings,
    onTextChange,
    paperRef,
    pageIndex = 0,
    onDrawSave
}) {
    const {
        paperType = 'college-ruled',
        fontFamily = "'Homemade Apple', cursive",
        inkColor = '#1a237e',
        fontSize = 20,
        showLines = true,
        showMargin = true,
        letterSpacing = 0,
        wordSpacing = 0,
        initialText = '',
        customPaperBg = null,
        verticalPosition = 0,
        drawMode = false,
    } = settings;

    const cfg = getPaperConfig(paperType);
    const gap = cfg.lineGap || 32;
    const startY = cfg.firstLineY || 52;
    const marginX = cfg.marginLeft || 92;

    const editorRef = useRef(null);
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [paperBg, setPaperBg] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const debounceTimer = useRef(null);

    // ── Generate paper background on relevant setting changes ────
    useEffect(() => {
        if (customPaperBg) {
            setPaperBg(customPaperBg);
        } else {
            setPaperBg(generateBackground(paperType, showLines, showMargin));
        }
    }, [paperType, showLines, showMargin, customPaperBg]);

    // ── Responsive scaling ───────────────────────────────────────
    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const available = containerRef.current.offsetWidth - 32; // match padding
                setScale(Math.min(1, available / PAPER_WIDTH));
            }
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        // Extra tick for dynamic layouts
        setTimeout(updateScale, 50);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    // ── Always sync innerText for read-only pages, OR run once for editable ────
    useEffect(() => {
        if (!editorRef.current) return;
        if (!onTextChange) { // Not editable page
            if (editorRef.current.innerText !== initialText) {
                editorRef.current.innerText = initialText;
            }
        } else { // Editable page (page 0)
            if (initialText && !editorRef.current.innerText) {
                editorRef.current.innerText = initialText;
            }
        }
    }, [initialText, onTextChange]);

    const adjustedStartY = startY + verticalPosition;

    // ── Keep caret at correct line height ───────────────────────
    useEffect(() => {
        const styleId = `paper-editor-style-${pageIndex}`;
        let style = document.getElementById(styleId);
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            document.head.appendChild(style);
        }
        style.textContent = `
      .paper-direct-editor-${pageIndex} {
        font-family: ${fontFamily};
        font-size: ${fontSize}px;
        color: ${inkColor};
        line-height: ${gap}px;
        letter-spacing: ${letterSpacing}px;
        word-spacing: ${wordSpacing}px;
        padding-top: ${adjustedStartY}px;
        padding-left: ${marginX + 8}px;
        padding-right: 40px;
        padding-bottom: 40px;
        caret-color: ${inkColor};
        outline: none;
        border: none;
        background: transparent;
        width: ${PAPER_WIDTH}px;
        min-height: ${PAPER_HEIGHT}px;
        position: absolute;
        top: 0;
        left: 0;
        box-sizing: border-box;
        white-space: pre-wrap;
        word-break: break-word;
        overflow-wrap: break-word;
        z-index: 10;
        resize: none;
        cursor: text;
        vertical-align: baseline;
      }

      .paper-direct-editor-${pageIndex}:focus {
        caret-color: ${inkColor};
      }

      .paper-direct-editor-${pageIndex}::selection {
        background: ${inkColor}33;
        color: ${inkColor};
      }

      .paper-direct-editor-${pageIndex}:empty::before {
        content: attr(data-placeholder);
        color: #b0b0c8;
        pointer-events: none;
        font-style: italic;
        font-family: system-ui, sans-serif;
        font-size: 16px;
        letter-spacing: 0;
      }
    `;

        return () => {
            // Cleanup optional since re-renders might rapidly destroy/create, we can keep the style tag and just update it.
        }
    }, [fontFamily, fontSize, inkColor, gap, adjustedStartY, marginX, letterSpacing, wordSpacing, pageIndex]);

    // ── Handle input: extract text and pass up ───────────────────
    const handleInput = useCallback(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            if (editorRef.current && onTextChange) {
                onTextChange(editorRef.current.innerText || '');
            }
        }, 300);
    }, [onTextChange]);

    // ── Prevent rich paste (only allow plain text) ──────────────
    const handlePaste = useCallback((e) => {
        e.preventDefault();
        const plain = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, plain);
    }, []);

    // ── Handle Tab key to indent ─────────────────────────────────
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertText', false, '    ');
        }
    }, []);

    const scaledHeight = PAPER_HEIGHT * scale;

    return (
        <div
            ref={containerRef}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}
        >
            {/* ── Focus hint ── */}
            {!isFocused && pageIndex === 0 && (
                <div style={{
                    fontSize: 11, color: '#a0a0c0', marginBottom: 8,
                    fontFamily: 'system-ui', letterSpacing: '0.5px',
                }}>
                    ✏️ Click anywhere on the paper to start typing
                </div>
            )}

            {/* ── Outer wrapper: reserves correct visual space ── */}
            <div style={{
                width: PAPER_WIDTH * scale,
                height: scaledHeight,
                position: 'relative',
                boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
                borderRadius: 2,
            }}>

                {/* ── The actual paper (captured by html2canvas via paperRef) ── */}
                <div
                    ref={paperRef}
                    style={{
                        width: PAPER_WIDTH,
                        height: PAPER_HEIGHT,
                        backgroundImage: paperBg ? `url(${paperBg})` : 'none',
                        backgroundColor: '#fafaf8',
                        backgroundSize: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        overflow: 'hidden',
                    }}
                >
                    {/* ── The contentEditable writing surface ── */}
                    <div
                        ref={editorRef}
                        className={`paper-direct-editor-${pageIndex}`}
                        contentEditable={!!onTextChange}
                        suppressContentEditableWarning
                        data-placeholder={pageIndex === 0 ? "Type/Paste text here" : ""}
                        onInput={handleInput}
                        onPaste={handlePaste}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        spellCheck={false}
                        autoCorrect="off"
                        autoCapitalize="off"
                    />

                    {/* Draw mode canvas integration */}
                    {drawMode && pageIndex === 0 && (
                        <DrawCanvas
                            width={PAPER_WIDTH}
                            height={PAPER_HEIGHT}
                            inkColor={inkColor}
                            onSave={onDrawSave}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
