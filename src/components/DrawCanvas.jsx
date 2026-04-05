import React, { useRef, useState, useCallback } from 'react';

export function DrawCanvas({ width, height, inkColor, onSave }) {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [tool, setTool] = useState('pen'); // 'pen' | 'eraser'
    const [brushSize, setBrushSize] = useState(2);
    const lastPos = useRef(null);

    const getPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const src = e.touches ? e.touches[0] : e;
        return {
            x: (src.clientX - rect.left) * scaleX,
            y: (src.clientY - rect.top) * scaleY,
        };
    };

    const startDraw = useCallback((e) => {
        e.preventDefault();
        setDrawing(true);
        lastPos.current = getPos(e);
    }, []);

    const draw = useCallback((e) => {
        e.preventDefault();
        if (!drawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pos = getPos(e);

        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.lineWidth = brushSize * 5;
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = inkColor;
            ctx.lineWidth = brushSize;
            ctx.globalAlpha = 0.85 + Math.random() * 0.15;
        }

        ctx.stroke();
        ctx.globalAlpha = 1;
        lastPos.current = pos;
    }, [drawing, tool, brushSize, inkColor]);

    const stopDraw = useCallback(() => {
        setDrawing(false);
        lastPos.current = null;
    }, []);

    const clearCanvas = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, width, height);
    };

    const handleSave = () => {
        onSave(canvasRef.current.toDataURL('image/png'));
    };

    const btnStyle = (active) => ({
        background: active ? '#6060ff' : 'transparent',
        color: active ? 'white' : '#aaaacc',
        border: 'none', borderRadius: 4,
        padding: '3px 8px', cursor: 'pointer', fontSize: 12,
    });

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Toolbar */}
            <div style={{
                position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', gap: 6, alignItems: 'center', zIndex: 20,
                background: 'rgba(20,20,40,0.88)', padding: '5px 10px', borderRadius: 8,
                boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}>
                <button onClick={() => setTool('pen')} style={btnStyle(tool === 'pen')}>✏️ Pen</button>
                <button onClick={() => setTool('eraser')} style={btnStyle(tool === 'eraser')}>⬜ Eraser</button>
                <input type="range" min={1} max={8} value={brushSize}
                    onChange={e => setBrushSize(Number(e.target.value))}
                    style={{ width: 56 }} title="Brush size" />
                <span style={{ color: '#666', fontSize: 10, width: 12 }}>{brushSize}</span>
                <button onClick={clearCanvas}
                    style={{ ...btnStyle(false), color: '#aa6868', marginLeft: 4 }}>Clear</button>
                <button onClick={handleSave}
                    style={{ ...btnStyle(false), background: '#1a4a1a', color: '#88ee88', marginLeft: 4, padding: '3px 10px' }}>
                    ✓ Done
                </button>
            </div>

            {/* Transparent drawing canvas overlaid on the paper */}
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
                style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%',
                    zIndex: 15,
                    cursor: tool === 'eraser' ? 'cell' : 'crosshair',
                    touchAction: 'none',
                }}
            />
        </div>
    );
}
