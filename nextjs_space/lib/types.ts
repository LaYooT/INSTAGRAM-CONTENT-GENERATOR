export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type ProcessingStage = 'TRANSFORM' | 'ANIMATE' | 'FORMAT' | 'COMPLETED';

export interface ContentJob {
  id: string;
  userId: string;
  status: JobStatus;
  originalImageUrl: string;
  imagePrompt?: string | null;
  videoPrompt?: string | null;
  transformedImageUrl?: string | null;
  animatedVideoUrl?: string | null;
  finalVideoUrl?: string | null;
  progress: number;
  currentStage: ProcessingStage;
  errorMessage?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  completedAt?: Date | string | null;
}