
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
    <div className="space-y-6">
      {/* Header with Regenerate Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Variations ({variations.length})</h3>
          <p className="text-sm text-muted-foreground">
            Sélectionnez votre version préférée ou générez de nouvelles variations
          </p>
        </div>
        <Button
          onClick={onRegenerateVariations}
          disabled={regenerating}
          variant="outline"
          className="border-primary/50 hover:bg-primary/10"
        >
          {regenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Régénérer
            </>
          )}
        </Button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {variations.map((variation, index) => (
            <motion.div
              key={variation.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
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
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                
                {/* Selected Badge */}
                {selectedVariationId === variation.id && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                    Sélectionnée
                  </div>
                )}

                {/* Play Icon Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>

                {/* Action Buttons */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleFavoriteToggle(variation.id, e)}
                    className={`bg-black/70 backdrop-blur-sm hover:bg-black/90 ${
                      favorites.has(variation.id) ? 'text-yellow-400' : 'text-white'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${favorites.has(variation.id) ? 'fill-yellow-400' : ''}`} />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleDownload(variation.id, variation.videoUrl, e)}
                    disabled={downloadingId === variation.id}
                    className="bg-black/70 backdrop-blur-sm text-white hover:bg-black/90"
                  >
                    {downloadingId === variation.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Variation Number */}
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full">
                #{index + 1}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Favorites Filter */}
      {favorites.size > 0 && (
        <div className="flex items-center justify-center gap-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm text-muted-foreground">
            {favorites.size} favori{favorites.size > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
