
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
          <div className="relative aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden border-2 border-primary/50 shadow-lg shadow-primary/20">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="group relative border-2 border-dashed border-border rounded-2xl p-12 text-center 
                     hover:border-primary/50 hover:bg-primary/5 
                     transition-smooth cursor-pointer
                     focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
            onClick={() => !disabled && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload photo"
          >
            <div className="transition-smooth group-hover:scale-105">
              <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                <ImageIcon className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-smooth" />
              </div>
              <p className="text-foreground font-semibold mb-2">
                Drag & drop your photo here
              </p>
              <p className="text-muted-foreground text-sm mb-4">or click to browse</p>
              <div className="flex items-center justify-center gap-2">
                <span className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">PNG</span>
                <span className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">JPG</span>
                <span className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">WEBP</span>
              </div>
              <p className="text-muted-foreground text-xs mt-2">
                Max 10MB
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || uploading}
          aria-label="File input"
        />

        {preview && !uploading && (
          <div className="flex gap-3">
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
              className="flex-1 hover-scale"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setShowImagePrompt(true)}
              disabled={disabled}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground hover-scale shadow-lg shadow-primary/20"
            >
              <Upload className="w-4 h-4 mr-2" />
              Edit Prompts
            </Button>
          </div>
        )}
      </div>

      <PromptDialog
        open={showImagePrompt}
        onOpenChange={setShowImagePrompt}
        title="🎨 Describe the Image Transformation"
        description="How do you want to transform your image? Be creative!"
        placeholder="Example: Transform this photo into colorful cartoon style with neon effects, cyberpunk futuristic vibe, vibrant pink and blue colors, 8k high quality..."
        type="image"
        onSubmit={handleImagePromptSubmit}
      />

      <PromptDialog
        open={showVideoPrompt}
        onOpenChange={setShowVideoPrompt}
        title="🎬 Describe the Video Animation"
        description="How do you want to animate this image into a video?"
        placeholder="Example: Create dynamic animation with progressive zoom, smooth rotation, floating sparkle particles, cinematic transitions, dramatic camera movement, 15 second duration..."
        type="video"
        onSubmit={handleVideoPromptSubmit}
      />
    </>
  );
}
