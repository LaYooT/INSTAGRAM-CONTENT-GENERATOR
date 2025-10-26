
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play,
  Download,
  Star,
  Trash2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Variation {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  isFavorite: boolean;
  createdAt: string;
}

interface VariationsGalleryProps {
  jobId: string;
  variations: Variation[];
  onVariationSelect: (variationId: string) => void;
  onRegenerateVariations: () => void;
  regenerating: boolean;
}

export function VariationsGallery({ 
  jobId, 
  variations, 
  onVariationSelect,
  onRegenerateVariations,
  regenerating,
}: VariationsGalleryProps) {
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(
    variations[0]?.id || null
  );
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(variations.filter(v => v.isFavorite).map(v => v.id))
  );
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFavoriteToggle = async (variationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newFavorites = new Set(favorites);
    if (newFavorites.has(variationId)) {
      newFavorites.delete(variationId);
    } else {
      newFavorites.add(variationId);
    }
    setFavorites(newFavorites);

    // TODO: Persist favorite status to backend
    try {
      await fetch(`/api/jobs/${jobId}/variations/${variationId}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: newFavorites.has(variationId) }),
      });
    } catch (error) {
      console.error('Failed to update favorite:', error);
    }
  };

  const handleDownload = async (variationId: string, videoUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setDownloadingId(variationId);
    try {
      const response = await fetch(videoUrl);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `variation-${variationId.slice(0, 8)}-${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Téléchargement démarré",
          description: "La variation est en cours de téléchargement.",
        });
      }
    } catch (error) {
      toast({
        title: "Échec du téléchargement",
        description: "Impossible de télécharger la variation.",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSelectVariation = (variationId: string) => {
    setSelectedVariationId(variationId);
    onVariationSelect(variationId);
  };

  return (
    <div className="space-y-fluid-md">
      {/* Header with Regenerate Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-fluid-sm">
        <div>
          <h3 className="text-fluid-lg font-bold text-foreground leading-fluid-tight">
            Variations ({variations.length})
          </h3>
          <p className="text-fluid-sm text-muted-foreground mt-fluid-xs leading-fluid-normal">
            Cliquez pour lire, sélectionnez votre préférée
          </p>
        </div>
        <Button
          onClick={onRegenerateVariations}
          disabled={regenerating}
          variant="outline"
          className="border-primary/50 hover:bg-primary/10 w-full sm:w-auto"
        >
          {regenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span className="text-fluid-sm">Génération...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              <span className="text-fluid-sm">Régénérer</span>
            </>
          )}
        </Button>
      </div>

      {/* Gallery Grid - Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-fluid-xs sm:gap-fluid-sm">
        <AnimatePresence mode="popLayout">
          {variations.map((variation, index) => (
            <motion.div
              key={variation.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className={`relative group cursor-pointer rounded-fluid-md overflow-hidden border-2 transition-all ${
                selectedVariationId === variation.id
                  ? 'border-primary shadow-lg shadow-primary/20'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleSelectVariation(variation.id)}
            >
              {/* Video Preview */}
              <div className="aspect-[9/16] bg-black relative">
                <video
                  src={variation.videoUrl}
                  className="w-full h-full object-cover"
                  loop
                  muted
                  playsInline
                  onClick={(e) => {
                    e.stopPropagation();
                    if (e.currentTarget.paused) {
                      e.currentTarget.play();
                    } else {
                      e.currentTarget.pause();
                    }
                  }}
                  onMouseEnter={(e) => {
                    // On desktop, preview on hover
                    if (window.innerWidth >= 768) {
                      e.currentTarget.play();
                    }
                  }}
                  onMouseLeave={(e) => {
                    // On desktop, reset on hover out
                    if (window.innerWidth >= 768) {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }
                  }}
                />
                
                {/* Selected Badge */}
                {selectedVariationId === variation.id && (
                  <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-primary text-primary-foreground text-fluid-xs font-semibold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                    Sélectionnée
                  </div>
                )}

                {/* Play Icon Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white" />
                </div>

                {/* Action Buttons - Mobile & Desktop */}
                <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-2 sm:left-2 sm:right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleFavoriteToggle(variation.id, e)}
                    className={`bg-black/70 backdrop-blur-sm hover:bg-black/90 h-7 w-7 sm:h-8 sm:w-8 p-0 ${
                      favorites.has(variation.id) ? 'text-yellow-400' : 'text-white'
                    }`}
                  >
                    <Star className={`w-3 h-3 sm:w-4 sm:h-4 ${favorites.has(variation.id) ? 'fill-yellow-400' : ''}`} />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleDownload(variation.id, variation.videoUrl, e)}
                    disabled={downloadingId === variation.id}
                    className="bg-black/70 backdrop-blur-sm text-white hover:bg-black/90 h-7 w-7 sm:h-8 sm:w-8 p-0"
                  >
                    {downloadingId === variation.id ? (
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    ) : (
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Variation Number */}
              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-black/70 backdrop-blur-sm text-white text-fluid-xs font-semibold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                #{index + 1}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Info Text - Mobile Friendly */}
      <div className="glass rounded-fluid-md p-fluid-sm border border-border">
        <p className="text-fluid-xs text-muted-foreground leading-fluid-normal text-center">
          💡 <span className="hidden sm:inline">Survolez une variation pour la prévisualiser. </span>
          Cliquez<span className="hidden sm:inline"> sur une vidéo</span> pour la lire en plein écran dans l&apos;onglet Lecteur
        </p>
      </div>

      {/* Favorites Counter */}
      {favorites.size > 0 && (
        <div className="flex items-center justify-center gap-fluid-xs glass rounded-fluid-md p-fluid-xs border border-border">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-fluid-sm text-muted-foreground">
            {favorites.size} favori{favorites.size > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
