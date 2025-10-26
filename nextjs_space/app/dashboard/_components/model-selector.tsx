
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface Model {
  id: string;
  endpoint: string;
  name: string;
  category: string;
  provider: string;
  pricePerUnit: number;
  priceUnit: string;
  maxResolution?: string;
  hasAudio: boolean;
  avgSpeed?: number;
  qualityRating: number;
  description?: string;
}

interface ModelSelectorProps {
  category: 'image' | 'video';
  value: string;
  onChange: (value: string) => void;
  sortBy?: 'cost' | 'quality' | 'speed';
}

export function ModelSelector({ category, value, onChange, sortBy = 'quality' }: ModelSelectorProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(`/api/models?category=${category}`);
        if (!response.ok) throw new Error('Failed to fetch models');
        const data = await response.json();
        setModels(data.models || []);
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [category]);

  const sortedModels = useMemo(() => {
    if (!models.length) return [];
    
    return [...models].sort((a, b) => {
      switch (sortBy) {
        case 'cost':
          return a.pricePerUnit - b.pricePerUnit;
        case 'quality':
          return b.qualityRating - a.qualityRating;
        case 'speed':
          return (a.avgSpeed || 999) - (b.avgSpeed || 999);
        default:
          return 0;
      }
    });
  }, [models, sortBy]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Chargement des modèles...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-base font-medium">
        Modèle {category === 'image' ? 'Image' : 'Vidéo'}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Sélectionner un modèle ${category}`} />
        </SelectTrigger>
        <SelectContent>
          {sortedModels.map((model) => (
            <SelectItem key={model.id} value={model.endpoint}>
              <div className="flex items-center justify-between w-full gap-4">
                <div className="flex flex-col items-start">
                  <span className="font-medium">{model.name}</span>
                  {model.description && (
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {model.description}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Badge 
                    variant={model.qualityRating >= 4 ? 'default' : 'secondary'}
                    className="shrink-0"
                  >
                    {'⭐'.repeat(model.qualityRating)}
                  </Badge>
                  <span className="font-mono text-muted-foreground shrink-0">
                    ${model.pricePerUnit.toFixed(3)}/{model.priceUnit}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
