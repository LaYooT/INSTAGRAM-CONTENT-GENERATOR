
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  placeholder: string;
  type: "image" | "video";
  onSubmit: (prompt: string) => void;
}

export function PromptDialog({
  open,
  onOpenChange,
  title,
  description,
  placeholder,
  type,
  onSubmit,
}: PromptDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!prompt.trim()) {
      toast.error("Veuillez entrer un prompt d'abord");
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type }),
      });

      if (!response.ok) throw new Error("Failed to enhance");

      const data = await response.json();
      setPrompt(data.enhancedPrompt);
      toast.success("✨ Prompt amélioré avec succès !");
    } catch (error) {
      toast.error("Échec de l'amélioration du prompt");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = () => {
    if (!prompt.trim()) {
      toast.error("Veuillez entrer un prompt");
      return;
    }
    onSubmit(prompt.trim());
    setPrompt("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Textarea
            placeholder={placeholder}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[150px] bg-gray-800 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              💡 Astuce: Plus votre description est détaillée, meilleur sera le résultat
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEnhance}
              disabled={isEnhancing || !prompt.trim()}
              className="bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-300"
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Amélioration...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Améliorer avec IA
                </>
              )}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              setPrompt("");
              onOpenChange(false);
            }}
            className="text-gray-400 hover:text-white"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!prompt.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Continuer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
