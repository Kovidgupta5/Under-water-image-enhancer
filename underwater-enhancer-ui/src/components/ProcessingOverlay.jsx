import React, { useEffect, useState } from 'react';

const ProcessingOverlay = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Analyzing image depth...');

  const statuses = [
    'Analyzing image depth...',
    'Correcting color balance...',
    'Removing backscatter...',
    'Enhancing clarity...',
    'Finalizing details...'
  ];

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 2 + 1; // Increment by 1-3%
      if (currentProgress > 100) currentProgress = 100;
      
      setProgress(currentProgress);
      
      // Update text based on progress
      const statusIndex = Math.min(
        Math.floor((currentProgress / 100) * statuses.length),
        statuses.length - 1
      );
      setStatusText(statuses[statusIndex]);

      if (currentProgress === 100) {
        clearInterval(interval);
        setTimeout(onComplete, 800); // Wait a moment at 100% before completing
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="glass-panel" style={{
      width: '100%',
      maxWidth: '700px',
      padding: '4rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem'
    }}>
      
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        {/* Glowing ring effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '4px solid transparent',
          borderTopColor: 'var(--accent-blue)',
          borderRightColor: 'var(--accent-teal)',
          animation: 'spin 1.5s linear infinite',
          boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)'
        }} />
        
        {/* Inner percentage */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          fontWeight: '600',
          color: 'var(--accent-blue)'
        }}>
          {Math.floor(progress)}%
        </div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Enhancing Photo
        </h3>
        <p style={{ color: 'var(--text-muted)', minHeight: '1.5rem', transition: 'all 0.3s' }}>
          {statusText}
        </p>
      </div>

    </div>
  );
};

export default ProcessingOverlay;
