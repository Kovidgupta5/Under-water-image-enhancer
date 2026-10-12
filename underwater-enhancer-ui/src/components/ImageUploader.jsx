import React, { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

const ImageUploader = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const url = URL.createObjectURL(file);
    onUpload({ url, file });
  };

  return (
    <div 
      className={`glass-panel uploader-container ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        width: '100%',
        maxWidth: '700px',
        padding: '4rem 2rem',
        textAlign: 'center',
        borderStyle: isDragging ? 'solid' : 'dashed',
        borderColor: isDragging ? 'var(--accent-blue)' : 'var(--glass-border)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => document.getElementById('fileUpload').click()}
    >
      <input 
        type="file" 
        id="fileUpload" 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleFileInput}
      />
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(14, 165, 233, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-blue)',
          marginBottom: '1rem'
        }}>
          <Upload size={32} />
        </div>
        
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Drop your underwater photo here</h3>
        <p style={{ color: 'var(--text-muted)' }}>or click to browse your files</p>
        
        <button className="btn-secondary" style={{ marginTop: '1rem' }}>
          <ImageIcon size={18} /> Select Image
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
