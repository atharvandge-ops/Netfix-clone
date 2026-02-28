import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { analyticsService } from '../services/analyticsService';

const VideoPlayer = ({ videoId, videoUrl, onEnded }) => {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    if (videoId) {
      analyticsService.trackEvent(videoId, 'view', {
        deviceType: getDeviceType(),
        browser: getBrowser()
      });
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [videoId]);

  useEffect(() => {
    if (playing) {
      progressIntervalRef.current = setInterval(() => {
        const currentProgress = (progress / duration) * 100;
        analyticsService.updateProgress(videoId, currentProgress);
      }, 10000);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [playing, progress, duration, videoId]);

  const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  };

  const getBrowser = () => {
    const ua = navigator.userAgent;
    if (ua.indexOf('Firefox') > -1) return 'Firefox';
    if (ua.indexOf('Chrome') > -1) return 'Chrome';
    if (ua.indexOf('Safari') > -1) return 'Safari';
    if (ua.indexOf('Edge') > -1) return 'Edge';
    return 'Unknown';
  };

  const handleProgress = (state) => {
    setProgress(state.playedSeconds);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleEnded = () => {
    analyticsService.trackEvent(videoId, 'complete', {
      watchDuration: duration
    });
    if (onEnded) {
      onEnded();
    }
  };

  const handlePause = () => {
    setPlaying(false);
    analyticsService.trackEvent(videoId, 'pause', {
      watchDuration: progress
    });
  };

  const handlePlay = () => {
    setPlaying(true);
    analyticsService.trackEvent(videoId, 'resume', {
      watchDuration: progress
    });
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative bg-black w-full" style={{ paddingTop: '56.25%' }}>
      <div className="absolute top-0 left-0 w-full h-full">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={playing}
          volume={volume}
          muted={muted}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={handleEnded}
          onPause={handlePause}
          onPlay={handlePlay}
          width="100%"
          height="100%"
          controls
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload'
              }
            }
          }}
        />
      </div>

      <div className="absolute bottom-4 left-4 right-4 text-white text-sm">
        <div className="flex justify-between items-center">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
