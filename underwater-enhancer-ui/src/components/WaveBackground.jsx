import React from 'react';

const WaveBackground = () => {
  const wave1Path = "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";
  const wave2Path = "M0,160L48,149.3C96,139,192,117,288,138.7C384,160,480,224,576,245.3C672,267,768,245,864,229.3C960,213,1056,203,1152,213.3C1248,224,1344,256,1392,272L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";
  const wave3Path = "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";

  const renderWave = (path, colorVar) => (
    <>
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: '50%', height: '100%', display: 'block' }}>
        <path fill={`var(${colorVar})`} d={path}></path>
      </svg>
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: '50%', height: '100%', display: 'block' }}>
        <path fill={`var(${colorVar})`} d={path}></path>
      </svg>
    </>
  );

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '350px',
      overflow: 'hidden',
      zIndex: 0,
      pointerEvents: 'none'
    }}>
      <style>
        {`
          @keyframes slideWave {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes slideWaveReverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `}
      </style>

      {/* Wave 3 (Background) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '200%',
        height: '100%',
        display: 'flex',
        animation: 'slideWave 25s linear infinite'
      }}>
        {renderWave(wave3Path, '--wave-color-1')}
      </div>

      {/* Wave 2 (Middle) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '200%',
        height: '80%',
        display: 'flex',
        animation: 'slideWaveReverse 18s linear infinite'
      }}>
        {renderWave(wave2Path, '--wave-color-2')}
      </div>

      {/* Wave 1 (Foreground) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '200%',
        height: '60%',
        display: 'flex',
        animation: 'slideWave 12s linear infinite'
      }}>
        {renderWave(wave1Path, '--wave-color-1')}
      </div>

    </div>
  );
};

export default WaveBackground;
