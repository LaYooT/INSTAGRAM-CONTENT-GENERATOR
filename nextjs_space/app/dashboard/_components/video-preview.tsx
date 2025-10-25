
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Download, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoPreviewProps {
  jobId: string;
}

interface JobData {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  finalVideoUrl?: string;
  progress: number;
  currentStage: string;
}

export function VideoPreview({ jobId }: VideoPreviewProps) {
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setJobData(data);
        }
      } catch (error) {
        console.error('Failed to fetch job data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
    
    // Poll for updates if not completed
    const interval = setInterval(() => {
      if (jobData?.status !== 'COMPLETED' && jobData?.status !== 'FAILED') {
        fetchJobData();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId, jobData?.status]);

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

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleDownload = async () => {
    if (!jobData?.finalVideoUrl) return;

    setDownloading(true);
    try {
      const response = await fetch(`/api/download/${jobId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `instagram-reel-${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Download started",
          description: "Your Instagram Reel is being downloaded.",
        });
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="aspect-[9/16] max-w-xs mx-auto bg-black/20 rounded-lg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!jobData || jobData.status === 'FAILED') {
    return (
      <Alert className="border-red-500/50 bg-red-500/10">
        <AlertDescription className="text-red-400">
          Unable to load video preview. Please try creating new content.
        </AlertDescription>
      </Alert>
    );
  }

  if (jobData.status !== 'COMPLETED' || !jobData.finalVideoUrl) {
    return (
      <div className="aspect-[9/16] max-w-xs mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white/40 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Processing... {jobData.progress}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="aspect-[9/16] max-w-xs mx-auto relative bg-black rounded-lg overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          src={jobData.finalVideoUrl}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
        
        {/* Video Controls Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={handlePlayPause}
                className="bg-black/50 hover:bg-black/70 border-none"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                size="sm"
                variant="secondary"
                onClick={handleRestart}
                className="bg-black/50 hover:bg-black/70 border-none"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="secondary"
                onClick={handleMuteToggle}
                className="bg-black/50 hover:bg-black/70 border-none"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
          <span>1080x1920</span>
          <span>•</span>
          <span>9:16</span>
          <span>•</span>
          <span>Instagram Ready</span>
        </div>
        
        <p className="text-gray-300">
          Your video is optimized for Instagram Reels and ready to post!
        </p>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Video
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
