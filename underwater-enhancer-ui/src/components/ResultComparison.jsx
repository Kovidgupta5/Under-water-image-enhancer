import React, { useState, useRef, useEffect } from 'react';
import { Download, RotateCcw, SlidersHorizontal, LayoutTemplate } from 'lucide-react';

const ResultComparison = ({ originalImage, enhancedImage, onReset }) => {
  const [viewMode, setViewMode] = useState('split'); // 'split' or 'slider'
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current || viewMode !== 'slider') return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleInteractionStart = (clientX) => {
    setIsDragging(true);
    handleMove(clientX);
  };

  const handleInteractionEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleInteractionEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleInteractionEnd);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleInteractionEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleInteractionEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleInteractionEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [isDragging]);

  const handleDownload = () => {
    if (!enhancedImage) return;
    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = 'underwater_enhanced.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Controls Header */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
        <button 
          className={viewMode === 'split' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setViewMode('split')}
        >
          <LayoutTemplate size={18} /> Split View
        </button>
        <button 
          className={viewMode === 'slider' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setViewMode('slider')}
        >
          <SlidersHorizontal size={18} /> Interactive Slider
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Main Image Area */}
        <div style={{ flex: '1 1 100%' }}>
          {viewMode === 'split' ? (
            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'row' }}>
              <div className="glass-panel" style={{ flex: 1, padding: '1rem', textAlign: 'center' }}>
                <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Original</div>
                <img src={originalImage} alt="Original" style={{ width: '100%', height: 'auto', borderRadius: '12px', objectFit: 'contain', maxHeight: '500px' }} />
              </div>
              <div className="glass-panel" style={{ flex: 1, padding: '1rem', textAlign: 'center' }}>
                <div style={{ marginBottom: '1rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>Enhanced</div>
                <img src={enhancedImage} alt="Enhanced" style={{ width: '100%', height: 'auto', borderRadius: '12px', objectFit: 'contain', maxHeight: '500px' }} />
              </div>
            </div>
          ) : (
            <div 
              ref={containerRef}
              className="glass-panel"
              style={{
                position: 'relative',
                width: '100%',
                height: '600px',
                overflow: 'hidden',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                padding: '0', 
                borderRadius: '24px'
              }}
              onMouseDown={(e) => handleInteractionStart(e.clientX)}
              onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX)}
            >
              {/* Underlay: After Image (Enhanced) */}
              <img 
                src={enhancedImage}
                alt="Enhanced"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none'
                }} 
              />

              {/* Overlay: Before Image (Original) */}
              <img 
                src={originalImage}
                alt="Original"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                }} 
              />

              {/* Slider Handle */}
              <div style={{
                position: 'absolute',
                top: '0',
                bottom: '0',
                left: `${sliderPosition}%`,
                width: '4px',
                backgroundColor: 'white',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                pointerEvents: 'none'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  color: 'black'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'scaleX(-1)' }}>
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </div>
              </div>
              
              {/* Labels */}
              <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '20px', color: 'white', fontSize: '0.875rem', backdropFilter: 'blur(4px)', pointerEvents: 'none' }}>
                Original
              </div>
              <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '20px', color: 'white', fontSize: '0.875rem', backdropFilter: 'blur(4px)', pointerEvents: 'none' }}>
                Enhanced
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <button className="btn-secondary" onClick={onReset}>
          <RotateCcw size={18} /> Enhance Another
        </button>
        <button className="btn-primary" onClick={handleDownload}>
          <Download size={18} /> Download High-Res
        </button>
      </div>

    </div>
  );
};

export default ResultComparison;
