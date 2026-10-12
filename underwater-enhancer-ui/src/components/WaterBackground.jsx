import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'jquery.ripples';

const WaterBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Initialize the WebGL water ripple effect
    if (containerRef.current) {
      try {
        $(containerRef.current).ripples({
          resolution: 512,
          dropRadius: 25,     // Size of the water drop effect
          perturbance: 0.05,  // How much the water refracts the image
          imageUrl: '/water_surface.png'
        });
      } catch (e) {
        console.error("Ripples failed to initialize", e);
      }
    }

    return () => {
      // Cleanup to prevent memory leaks
      if (containerRef.current) {
        try {
          $(containerRef.current).ripples('destroy');
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        backgroundImage: 'url(/water_surface.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        pointerEvents: 'auto' // Important so it can detect mouse movements
      }} 
    />
  );
};

export default WaterBackground;
