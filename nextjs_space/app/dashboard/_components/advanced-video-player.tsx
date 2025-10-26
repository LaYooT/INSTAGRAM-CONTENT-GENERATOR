
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdvancedVideoPlayerProps {
  videoUrl: string;
  originalImageUrl?: string;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

export function AdvancedVideoPlayer({ 
  videoUrl, 
  originalImageUrl,
  onFullscreenChange 
}: AdvancedVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
  const [fileSize, setFileSize] = useState<number | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch video file size
  useEffect(() => {
    const fetchFileSize = async () => {
      try {
        const response = await fetch(videoUrl, { method: 'HEAD' });
        const size = response.headers.get('Content-Length');
        if (size) {
          setFileSize(parseInt(size));
        }
      } catch (error) {
        console.error('Failed to fetch file size:', error);
      }
    };
    fetchFileSize();
  }, [videoUrl]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'f':
          e.preventDefault();
          handleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          handleMuteToggle();
          break;
        case 'j':
          e.preventDefault();
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
          break;
        case 'l':
          e.preventDefault();
          videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
          break;
        case 'arrowleft':
          e.preventDefault();
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
          break;
        case 'arrowright':
          e.preventDefault();
          videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [duration]);

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (isPlaying && isFullscreen) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, isFullscreen]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeChange = (value: number[]) => {
    const newTime = value[0];
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
        onFullscreenChange?.(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        onFullscreenChange?.(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-fluid-lg overflow-hidden group ${isFullscreen ? 'w-screen h-screen rounded-none' : 'aspect-[9/16] max-w-xs mx-auto'}`}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        loop
        playsInline
        muted={isMuted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          setVideoDimensions({
            width: e.currentTarget.videoWidth,
            height: e.currentTarget.videoHeight,
          });
        }}
        onClick={handlePlayPause}
      />

      {/* Central Play Button - Responsive */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity">
          <Button
            size="lg"
            onClick={handlePlayPause}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 hover:bg-white shadow-2xl"
          >
            <Play className="w-8 h-8 sm:w-10 sm:h-10 text-black fill-black ml-1" />
          </Button>
        </div>
      )}

      {/* Video Controls - Responsive */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2 sm:p-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Timeline */}
        <div className="mb-2 sm:mb-3">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleTimeChange}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-fluid-xs text-white/70 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons - Responsive */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handlePlayPause}
              className="text-white hover:bg-white/20 h-8 w-8 sm:h-9 sm:w-9 p-0"
            >
              {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}
              className="text-white hover:bg-white/20 h-8 w-8 sm:h-9 sm:w-9 p-0 hidden xs:flex"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => videoRef.current && (videoRef.current.currentTime += 10)}
              className="text-white hover:bg-white/20 h-8 w-8 sm:h-9 sm:w-9 p-0 hidden xs:flex"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            {/* Volume Control */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMuteToggle}
                className="text-white hover:bg-white/20 h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
              </Button>
              <div className="w-16 sm:w-20 hidden md:block">
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Playback Speed - Hidden on small mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-8 sm:h-9 px-2 sm:px-3 hidden xs:flex"
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="ml-1 text-fluid-xs">{playbackRate}x</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <DropdownMenuItem
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className={playbackRate === rate ? 'bg-primary/20' : ''}
                  >
                    {rate}x {rate === 1 && '(Normal)'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Fullscreen */}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleFullscreen}
              className="text-white hover:bg-white/20 h-8 w-8 sm:h-9 sm:w-9 p-0"
            >
              {isFullscreen ? <Minimize className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Video Info Badge - Responsive */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity gap-2">
        <div className="bg-black/70 backdrop-blur-sm text-white text-fluid-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
          <span className="hidden sm:inline">{videoDimensions.width} × {videoDimensions.height}</span>
          <span className="sm:hidden">{videoDimensions.width}×{videoDimensions.height}</span>
          {fileSize && (
            <>
              <span className="hidden sm:inline"> • {formatFileSize(fileSize)}</span>
            </>
          )}
        </div>
        <div className="bg-gradient-to-r from-primary to-secondary text-white text-fluid-xs font-semibold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg">
          <span className="hidden sm:inline">Instagram Ready</span>
          <span className="sm:hidden">IG ✓</span>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint - Desktop only */}
      {!isFullscreen && (
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
          <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg">
            <p className="font-semibold mb-1">Raccourcis:</p>
            <p>Space: Play/Pause</p>
            <p>F: Plein écran</p>
            <p>M: Muet</p>
            <p>J/L: -10s/+10s</p>
          </div>
        </div>
      )}
    </div>
  );
}
