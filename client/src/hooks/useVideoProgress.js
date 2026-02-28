import { useEffect, useRef } from 'react';
import { analyticsService } from '../services/analyticsService';

const useVideoProgress = (videoId, currentTime, duration) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!videoId || !duration) return;

    intervalRef.current = setInterval(() => {
      const progress = (currentTime / duration) * 100;
      
      analyticsService.updateProgress(videoId, progress)
        .catch(err => console.error('Error updating progress:', err));
    }, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [videoId, currentTime, duration]);

  return null;
};

export default useVideoProgress;
