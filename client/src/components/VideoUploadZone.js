import React, { useCallback } from 'react';

const VideoUploadZone = ({ onVideoSelect, disabled }) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        onVideoSelect(file);
      } else {
        alert('Please drop a video file');
      }
    }
  }, [disabled, onVideoSelect]);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      onVideoSelect(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
        isDragging
          ? 'border-red-600 bg-red-600 bg-opacity-10'
          : 'border-gray-600 hover:border-gray-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input
        type="file"
        accept="video/*"
        onChange={handleFileInput}
        disabled={disabled}
        className="hidden"
        id="video-file-input"
      />
      
      <label
        htmlFor="video-file-input"
        className={`cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        <div className="text-6xl mb-4">🎬</div>
        <p className="text-white text-lg font-semibold mb-2">
          Drop your video here or click to browse
        </p>
        <p className="text-gray-400 text-sm">
          Supports: MP4, MOV, AVI, WebM (Max 500MB)
        </p>
      </label>
    </div>
  );
};

export default VideoUploadZone;
