
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Image, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  onJobCreated: (jobId: string) => void;
  disabled?: boolean;
}

export function PhotoUpload({ onJobCreated, disabled }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled || acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError(null);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, or WebP)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);
      
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload file');
      }

      onJobCreated(data.jobId);
      
      toast({
        title: "Upload successful",
        description: "Your photo has been uploaded and processing has started.",
      });

    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload file');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }, [disabled, onJobCreated, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    multiple: false,
    disabled: disabled || uploading
  });

  return (
    <div className="space-y-4">
      {error && (
        <Alert className="border-red-500/50 bg-red-500/10">
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-purple-400 bg-purple-500/10' 
            : 'border-white/20 hover:border-purple-400/50'
          }
          ${disabled || uploading ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-purple-400 mx-auto animate-spin" />
            <div>
              <p className="text-lg font-medium text-white">Uploading...</p>
              <p className="text-gray-400">Please wait while we process your image</p>
            </div>
          </div>
        ) : preview ? (
          <div className="space-y-4">
            <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-lg font-medium text-white">Image Ready</p>
              <p className="text-gray-400">Processing will begin shortly</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-purple-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-white">
                {isDragActive ? 'Drop your photo here' : 'Upload your photo'}
              </p>
              <p className="text-gray-400">
                Drag and drop or click to browse • JPG, PNG, WebP up to 10MB
              </p>
            </div>
            <Button 
              type="button"
              variant="outline"
              disabled={disabled || uploading}
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                input?.click();
              }}
            >
              <Image className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-400">
        <p>💡 Tips for best results:</p>
        <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
          <li>Use high-quality images (minimum 720px)</li>
          <li>Clear subjects work best for AI transformation</li>
          <li>Avoid blurry or heavily filtered images</li>
        </ul>
      </div>
    </div>
  );
}
