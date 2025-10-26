
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
      {/* Video Player avec contrôles améliorés */}
      <div className="aspect-[9/16] max-w-xs mx-auto relative bg-black rounded-2xl overflow-hidden shadow-2xl ring-2 ring-primary/20">
        <video
          ref={videoRef}
          src={jobData.finalVideoUrl}
          className="w-full h-full object-cover"
          loop
          playsInline
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onClick={handlePlayPause}
        />
        
        {/* Bouton Play Central (affiché quand la vidéo est en pause) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity">
            <Button
              size="lg"
              onClick={handlePlayPause}
              className="w-20 h-20 rounded-full bg-white/90 hover:bg-white shadow-2xl"
            >
              <Play className="w-10 h-10 text-black fill-black ml-1" />
            </Button>
          </div>
        )}
        
        {/* Contrôles vidéo en bas */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 transition-opacity hover:opacity-100" 
             style={{ opacity: isPlaying ? 0.7 : 1 }}>
          <div className="flex items-center justify-center space-x-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={handlePlayPause}
              className="text-white hover:bg-white/20 backdrop-blur-sm"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRestart}
              className="text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleMuteToggle}
              className="text-white hover:bg-white/20 backdrop-blur-sm"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Badge Instagram Ready */}
        <div className="absolute top-4 right-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
            Instagram Ready
          </div>
        </div>
      </div>

      {/* Informations de la vidéo */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center space-x-3 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
          <span className="font-semibold">1080 × 1920</span>
          <span>•</span>
          <span>9:16</span>
          <span>•</span>
          <span>MP4</span>
        </div>
        
        <p className="text-foreground text-sm">
          Votre vidéo est optimisée pour Instagram Reels et prête à être publiée !
        </p>
      </div>

      {/* Bouton de téléchargement amélioré */}
      <div className="flex justify-center">
        <Button
          onClick={handleDownload}
          disabled={downloading}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 shadow-lg shadow-green-500/30"
        >
          {downloading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Téléchargement en cours...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Télécharger la vidéo
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
