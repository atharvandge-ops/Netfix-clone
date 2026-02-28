import React from 'react';

const Loading = ({ fullScreen = false }) => {
  const containerClass = fullScreen
    ? 'min-h-screen bg-black flex items-center justify-center'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
        <p className="text-white mt-4">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
