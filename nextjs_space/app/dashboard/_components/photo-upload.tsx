
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { PromptDialog } from "./prompt-dialog";

interface PhotoUploadProps {
  onJobCreated: (jobId: string) => void;
  disabled?: boolean;
}

export function PhotoUpload({ onJobCreated, disabled }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const [showVideoPrompt, setShowVideoPrompt] = useState(false);
  const [imagePrompt, setImagePrompt] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner un fichier image");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux (max 10MB)");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Show first prompt dialog for image transformation
    setShowImagePrompt(true);
  };

  const handleImagePromptSubmit = (prompt: string) => {
    setImagePrompt(prompt);
    // After image prompt, show video prompt dialog
    setShowVideoPrompt(true);
  };

  const handleVideoPromptSubmit = async (videoPrompt: string) => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("imagePrompt", imagePrompt);
      formData.append("videoPrompt", videoPrompt);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      toast.success("✅ Photo téléchargée ! Génération en cours...");
      onJobCreated(data.jobId);

      // Reset
      setSelectedFile(null);
      setPreview(null);
      setImagePrompt("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Échec du téléchargement"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner un fichier image");
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Le fichier est trop volumineux (max 10MB)");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // Show first prompt dialog for image transformation
      setShowImagePrompt(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="space-y-4">
        {preview ? (
          <div className="relative aspect-square max-w-sm mx-auto rounded-lg overflow-hidden border-2 border-purple-500/50">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center hover:border-purple-500/50 transition-colors cursor-pointer"
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">
              Glissez-déposez votre photo ici
            </p>
            <p className="text-gray-400 text-sm mb-4">ou cliquez pour parcourir</p>
            <p className="text-gray-500 text-xs">
              PNG, JPG, WEBP jusqu'à 10MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || uploading}
        />

        {preview && !uploading && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setPreview(null);
                setSelectedFile(null);
                setImagePrompt("");
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="flex-1 border-white/10 text-gray-300 hover:text-white"
            >
              Annuler
            </Button>
            <Button
              onClick={() => setShowImagePrompt(true)}
              disabled={disabled}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Upload className="w-4 h-4 mr-2" />
              Modifier les prompts
            </Button>
          </div>
        )}
      </div>

      <PromptDialog
        open={showImagePrompt}
        onOpenChange={setShowImagePrompt}
        title="🎨 Décrivez la transformation souhaitée"
        description="Comment voulez-vous transformer votre image ? Soyez créatif !"
        placeholder="Exemple : Transformez cette photo en style cartoon coloré avec des effets néon, ambiance cyberpunk futuriste, couleurs vibrantes rose et bleu, haute qualité 8k..."
        type="image"
        onSubmit={handleImagePromptSubmit}
      />

      <PromptDialog
        open={showVideoPrompt}
        onOpenChange={setShowVideoPrompt}
        title="🎬 Décrivez l'animation vidéo"
        description="Comment voulez-vous animer cette image en vidéo ?"
        placeholder="Exemple : Créez une animation dynamique avec zoom progressif, rotation fluide, particules brillantes qui flottent, transitions cinématiques, mouvement de caméra dramatique, durée 15 secondes..."
        type="video"
        onSubmit={handleVideoPromptSubmit}
      />
    </>
  );
}
