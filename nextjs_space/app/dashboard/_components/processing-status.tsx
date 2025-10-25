
"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Sparkles, 
  Play, 
  Settings, 
  CheckCircle, 
  XCircle,
  Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProcessingStatusProps {
  jobId: string;
  onComplete: () => void;
}

interface JobStatus {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  currentStage: 'TRANSFORM' | 'ANIMATE' | 'FORMAT' | 'COMPLETED';
  errorMessage?: string;
}

const stages = [
  { 
    key: 'TRANSFORM' as const, 
    label: 'Transform', 
    icon: Sparkles, 
    description: 'AI is enhancing your image...',
    color: 'text-purple-400'
  },
  { 
    key: 'ANIMATE' as const, 
    label: 'Animate', 
    icon: Play, 
    description: 'Creating video animation...',
    color: 'text-pink-400'
  },
  { 
    key: 'FORMAT' as const, 
    label: 'Format', 
    icon: Settings, 
    description: 'Optimizing for Instagram...',
    color: 'text-blue-400'
  },
];

export function ProcessingStatus({ jobId, onComplete }: ProcessingStatusProps) {
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setJobStatus(data);
          
          if (data.status === 'COMPLETED' || data.status === 'FAILED') {
            setLoading(false);
            if (data.status === 'COMPLETED') {
              setTimeout(onComplete, 2000); // Show completion for 2 seconds
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch job status:', error);
      }
    };

    // Initial fetch
    pollStatus();
    setLoading(false);

    // Poll every 2 seconds
    const interval = setInterval(pollStatus, 2000);

    return () => clearInterval(interval);
  }, [jobId, onComplete]);

  if (loading || !jobStatus) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 text-purple-400 mx-auto animate-spin mb-4" />
        <p className="text-gray-300">Loading status...</p>
      </div>
    );
  }

  if (jobStatus.status === 'FAILED') {
    return (
      <Alert className="border-red-500/50 bg-red-500/10">
        <XCircle className="h-4 w-4 text-red-400" />
        <AlertDescription className="text-red-400">
          Processing failed: {jobStatus.errorMessage || 'Unknown error occurred'}
        </AlertDescription>
      </Alert>
    );
  }

  const currentStageIndex = stages.findIndex(stage => stage.key === jobStatus.currentStage);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Processing Your Content</h3>
        <p className="text-gray-400">This usually takes 30-60 seconds</p>
      </div>

      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Overall Progress</span>
          <span className="text-white">{jobStatus.progress}%</span>
        </div>
        <Progress 
          value={jobStatus.progress} 
          className="h-2 bg-white/10" 
        />
      </div>

      {/* Stage Progress */}
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const isActive = index === currentStageIndex;
          const isCompleted = index < currentStageIndex || jobStatus.status === 'COMPLETED';
          const Icon = stage.icon;

          return (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`
                flex items-center space-x-4 p-4 rounded-xl border transition-colors
                ${isActive 
                  ? 'bg-white/10 border-purple-500/50' 
                  : isCompleted 
                    ? 'bg-green-500/10 border-green-500/50' 
                    : 'bg-white/5 border-white/10'
                }
              `}
            >
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                ${isCompleted 
                  ? 'bg-green-500/20 text-green-400' 
                  : isActive 
                    ? `bg-purple-500/20 ${stage.color}` 
                    : 'bg-white/10 text-gray-400'
                }
              `}>
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : isActive ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              
              <div className="flex-1">
                <h4 className={`font-medium ${
                  isCompleted ? 'text-green-400' : isActive ? 'text-white' : 'text-gray-400'
                }`}>
                  {stage.label}
                </h4>
                <p className="text-sm text-gray-400">
                  {isCompleted ? 'Completed' : isActive ? stage.description : stage.description}
                </p>
              </div>
              
              {isActive && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-purple-400 rounded-full"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {jobStatus.status === 'COMPLETED' && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 border border-green-500/50 rounded-xl p-4 text-center"
          >
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-400 font-medium">Content Ready!</p>
            <p className="text-sm text-gray-300">Your Instagram Reel is ready to download</p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
