import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import Hero from './components/Hero';
import ImageUploader from './components/ImageUploader';
import ProcessingOverlay from './components/ProcessingOverlay';
import ResultComparison from './components/ResultComparison';
import WaterBackground from './components/WaterBackground';
import './index.css';

function App() {
  const [appState, setAppState] = useState('upload'); // 'upload', 'processing', 'result'
  const theme = 'dark'; // Hardcoded to dark mode
  
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const handleUpload = async ({ url, file }) => {
    setOriginalImage(url);
    setAppState('processing');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/enhance', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        let errorMsg = 'Error enhancing image. Make sure the backend is running.';
        try {
          const errorData = await response.json();
          if (errorData.error) errorMsg = errorData.error;
        } catch (e) {}
        throw new Error(errorMsg);
      }
      
      const blob = await response.blob();
      const enhancedUrl = URL.createObjectURL(blob);
      setEnhancedImage(enhancedUrl);
      setAppState('result');
    } catch (error) {
      console.error('Error enhancing image:', error);
      alert(error.message);
      setAppState('upload');
    }
  };

  const handleProcessingComplete = () => {
    // No longer needed, as we transition to result directly from API response
  };

  const handleReset = () => {
    setOriginalImage(null);
    setEnhancedImage(null);
    setAppState('upload');
  };

  return (
    <>
      {/* The interactive water background layer */}
      <WaterBackground />

      {/* Dimmer overlay to prevent background from overpowering */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1, // Above water, below content (z-index: 10)
          backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: theme === 'light' ? 'blur(8px)' : 'none', // Strong blur in light mode for a clean frosted glass look
          pointerEvents: 'none' // Allow mouse events to pass through to WaterBackground
        }}
      />

      <div className="app-container" style={{ pointerEvents: 'none' }}>
        


        {/* Main Content Area */}
        <main style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '100%',
          maxWidth: '1200px',
          flex: 1,
          position: 'relative',
          zIndex: 10,
          pointerEvents: 'auto'
        }}>
          
          {appState === 'upload' && (
            <>
              <Hero />
              <ImageUploader onUpload={handleUpload} />
            </>
          )}

          {appState === 'processing' && (
            <ProcessingOverlay onComplete={handleProcessingComplete} />
          )}

          {appState === 'result' && (
            <ResultComparison 
              originalImage={originalImage} 
              enhancedImage={enhancedImage} 
              onReset={handleReset} 
            />
          )}

        </main>
        
        {/* Footer */}
        <footer style={{ 
          marginTop: 'auto', 
          paddingTop: '4rem', 
          paddingBottom: '1rem',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          pointerEvents: 'auto'
        }}>
          Made by Kovid Gupta (N212) and Shashank Srivastava (N236)
        </footer>
      </div>
    </>
  );
}

export default App;
