
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Loader2,
  RefreshCw,
  Sparkles,
  ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdvancedVideoPlayer } from "./advanced-video-player";
import { BeforeAfterComparison } from "./before-after-comparison";
import { VariationsGallery } from "./variations-gallery";

interface VideoPreviewProps {
  jobId: string;
}

interface JobData {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  finalVideoUrl?: string;
  originalImageUrl?: string;
  transformedImageUrl?: string;
  progress: number;
  currentStage: string;
}

interface Variation {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  isFavorite: boolean;
  createdAt: string;
}

export function VideoPreview({ jobId }: VideoPreviewProps) {
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [generatingVariations, setGeneratingVariations] = useState(false);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobData();
    fetchVariations();
    
    // Poll for updates if not completed
    const interval = setInterval(() => {
      if (jobData?.status !== 'COMPLETED' && jobData?.status !== 'FAILED') {
        fetchJobData();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId]);

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

  const fetchVariations = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/variations`);
      if (response.ok) {
        const data = await response.json();
        setVariations(data);
      }
    } catch (error) {
      console.error('Failed to fetch variations:', error);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const response = await fetch(`/api/jobs/${jobId}/regenerate`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Régénération réussie !",
          description: "Une nouvelle variation a été créée.",
        });
        // Refresh variations
        fetchVariations();
      } else {
        throw new Error('Regeneration failed');
      }
    } catch (error) {
      toast({
        title: "Échec de la régénération",
        description: "Impossible de régénérer la vidéo. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setRegenerating(false);
    }
  };

  const handleGenerateVariations = async () => {
    setGeneratingVariations(true);
    try {
      const response = await fetch(`/api/jobs/${jobId}/generate-variations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 3 }), // Generate 3 variations
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Variations créées !",
          description: `${data.count} nouvelles variations ont été générées.`,
        });
        // Refresh variations
        fetchVariations();
      } else {
        throw new Error('Variation generation failed');
      }
    } catch (error) {
      toast({
        title: "Échec de la génération",
        description: "Impossible de générer les variations. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setGeneratingVariations(false);
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
          title: "Téléchargement démarré",
          description: "Votre Instagram Reel est en cours de téléchargement.",
        });
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      toast({
        title: "Échec du téléchargement",
        description: "Impossible de télécharger la vidéo. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="aspect-[9/16] max-w-xs mx-auto bg-muted/30 rounded-2xl flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!jobData || jobData.status === 'FAILED') {
    return (
      <Alert className="border-destructive/50 bg-destructive/10">
        <AlertDescription className="text-destructive">
          Impossible de charger la prévisualisation. Veuillez créer un nouveau contenu.
        </AlertDescription>
      </Alert>
    );
  }

  if (jobData.status !== 'COMPLETED' || !jobData.finalVideoUrl) {
    return (
      <div className="aspect-[9/16] max-w-xs mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border-2 border-dashed border-border flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Traitement... {jobData.progress}%</p>
        </div>
      </div>
    );
  }

  // Get the current video URL (either selected variation or original)
  const currentVideoUrl = selectedVariationId 
    ? variations.find(v => v.id === selectedVariationId)?.videoUrl 
    : jobData.finalVideoUrl;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="player" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="player">Lecteur</TabsTrigger>
          <TabsTrigger value="compare">Comparer</TabsTrigger>
          <TabsTrigger value="variations">Variations ({variations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="player" className="space-y-6">
          {/* Advanced Video Player */}
          {currentVideoUrl && (
            <AdvancedVideoPlayer
              videoUrl={currentVideoUrl}
              originalImageUrl={jobData.originalImageUrl}
            />
          )}

          {/* Action Buttons - Professional Design */}
          <div className="flex flex-col gap-4">
            {/* Primary Action - Download */}
            <Button
              onClick={handleDownload}
              disabled={downloading}
              size="default"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all duration-300 font-medium"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Téléchargement en cours...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger la Vidéo
                </>
              )}
            </Button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleRegenerate}
                disabled={regenerating}
                variant="outline"
                size="default"
                className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-200"
              >
                {regenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    <span className="text-xs sm:text-sm">Régénération...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1.5" />
                    <span className="text-xs sm:text-sm">Régénérer</span>
                  </>
                )}
              </Button>

              <Button
                onClick={handleGenerateVariations}
                disabled={generatingVariations}
                variant="outline"
                size="default"
                className="border-2 border-secondary/30 hover:border-secondary hover:bg-secondary/5 transition-all duration-200"
              >
                {generatingVariations ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    <span className="text-xs sm:text-sm">Génération...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    <span className="text-xs sm:text-sm">3 Variations</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compare">
          {/* Before/After Comparison */}
          {jobData.originalImageUrl && jobData.finalVideoUrl && (
            <BeforeAfterComparison
              beforeImage={jobData.originalImageUrl}
              afterVideoUrl={jobData.finalVideoUrl}
            />
          )}
        </TabsContent>

        <TabsContent value="variations">
          {/* Variations Gallery */}
          {variations.length > 0 ? (
            <VariationsGallery
              jobId={jobId}
              variations={variations}
              onVariationSelect={setSelectedVariationId}
              onRegenerateVariations={handleGenerateVariations}
              regenerating={generatingVariations}
            />
          ) : (
            <div className="text-center py-12 space-y-4">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground">Aucune variation</h3>
              <p className="text-muted-foreground">
                Générez des variations pour explorer différentes versions de votre vidéo
              </p>
              <Button
                onClick={handleGenerateVariations}
                disabled={generatingVariations}
                size="lg"
                className="mt-4"
              >
                {generatingVariations ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Générer 3 Variations
                  </>
                )}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
