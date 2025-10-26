
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ModelSelector } from './model-selector';
import { Loader2, Settings2, DollarSign, Zap, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ModelPreferences {
  id: string;
  imageModel: string;
  imageToVideoModel: string;
  prioritizeSpeed: boolean;
  prioritizeCost: boolean;
  prioritizeQuality: boolean;
}

interface CostEstimate {
  totalCost: number;
  imageCost: number;
  videoCost: number;
  breakdown: {
    image: { model: string; cost: number };
    video: { model: string; cost: number; count: number };
  };
}

export function ModelPreferencesPanel() {
  const [preferences, setPreferences] = useState<ModelPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [estimate, setEstimate] = useState<CostEstimate | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  useEffect(() => {
    if (preferences) {
      fetchEstimate();
    }
  }, [preferences?.imageModel, preferences?.imageToVideoModel]);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/models/preferences');
      if (!response.ok) throw new Error('Failed to fetch preferences');
      const data = await response.json();
      setPreferences(data.preferences);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Impossible de charger les préférences');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEstimate = async () => {
    if (!preferences) return;
    
    setIsEstimating(true);
    try {
      const response = await fetch('/api/models/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageModel: preferences.imageModel,
          videoModel: preferences.imageToVideoModel,
          variations: 3
        })
      });
      
      if (!response.ok) throw new Error('Failed to estimate cost');
      const data = await response.json();
      setEstimate(data.estimate);
    } catch (error) {
      console.error('Error estimating cost:', error);
    } finally {
      setIsEstimating(false);
    }
  };

  const handleSave = async () => {
    if (!preferences) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/models/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) throw new Error('Failed to save preferences');
      
      toast.success('Préférences enregistrées avec succès');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePriorityChange = (priority: 'quality' | 'cost' | 'speed') => {
    if (!preferences) return;

    setPreferences({
      ...preferences,
      prioritizeQuality: priority === 'quality',
      prioritizeCost: priority === 'cost',
      prioritizeSpeed: priority === 'speed'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!preferences) return null;

  const currentPriority = preferences.prioritizeQuality ? 'quality' 
    : preferences.prioritizeCost ? 'cost' 
    : preferences.prioritizeSpeed ? 'speed' 
    : 'quality';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          <CardTitle>Paramètres des Modèles AI</CardTitle>
        </div>
        <CardDescription>
          Personnalisez les modèles utilisés pour la génération de contenu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Priorités */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Priorité</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={currentPriority === 'quality' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePriorityChange('quality')}
              className="flex-1"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Qualité
            </Button>
            <Button
              type="button"
              variant={currentPriority === 'cost' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePriorityChange('cost')}
              className="flex-1"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Économie
            </Button>
            <Button
              type="button"
              variant={currentPriority === 'speed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePriorityChange('speed')}
              className="flex-1"
            >
              <Zap className="h-4 w-4 mr-2" />
              Vitesse
            </Button>
          </div>
        </div>

        {/* Sélecteur de modèle image */}
        <ModelSelector
          category="image"
          value={preferences.imageModel}
          onChange={(value) => setPreferences({ ...preferences, imageModel: value })}
          sortBy={currentPriority}
        />

        {/* Sélecteur de modèle vidéo */}
        <ModelSelector
          category="video"
          value={preferences.imageToVideoModel}
          onChange={(value) => setPreferences({ ...preferences, imageToVideoModel: value })}
          sortBy={currentPriority}
        />

        {/* Estimation de coût */}
        {estimate && (
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Coût estimé par génération</span>
              {isEstimating && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Image (1x)</span>
                <span className="font-mono">${estimate.imageCost.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vidéos (3x)</span>
                <span className="font-mono">${estimate.videoCost.toFixed(3)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-medium">
                <span>Total</span>
                <span className="font-mono">${estimate.totalCost.toFixed(3)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button 
            type="button"
            variant="outline" 
            onClick={fetchPreferences}
            disabled={isSaving}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              'Enregistrer'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
