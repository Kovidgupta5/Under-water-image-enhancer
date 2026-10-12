import React from 'react';

const Hero = () => {
  return (
    <div className="hero-section" style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '1.5rem' }}>
      <h1>
        Underwater Image Enhancement <br />
        <span className="gradient-text">Using AI</span>
      </h1>
      <p className="subtitle" style={{ marginBottom: '1rem' }}>
        Restore vibrant colors and clarity to your underwater photography using our state-of-the-art AI enhancement model.
      </p>
    </div>
  );
};

export default Hero;
