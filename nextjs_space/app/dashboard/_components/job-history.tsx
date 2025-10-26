
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play, 
  Download,
  Trash2,
  Eye,
  Loader2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  currentStage: string;
  createdAt: string;
  completedAt?: string;
  originalImageUrl: string;
  finalVideoUrl?: string;
  cost?: number;
}

interface JobHistoryProps {
  onJobSelect: (jobId: string) => void;
}

export function JobHistory({ onJobSelect }: JobHistoryProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingJobId, setDownloadingJobId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setDownloadingJobId(jobId);
    try {
      const response = await fetch(`/api/download/${jobId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `instagram-reel-${jobId.slice(0, 8)}-${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Téléchargement démarré",
          description: "Votre vidéo Instagram Reel est en cours de téléchargement.",
        });
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      toast({
        title: "Échec du téléchargement",
        description: "Impossible de télécharger la vidéo. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setDownloadingJobId(null);
    }
  };

  const handleDeleteJob = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce job ?')) return;

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setJobs(jobs.filter(job => job.id !== jobId));
        toast({
          title: "Job supprimé",
          description: "Le job a été supprimé avec succès.",
        });
      }
    } catch (error) {
      console.error('Failed to delete job:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le job.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'PROCESSING':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'FAILED':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'PROCESSING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading your content history...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Content Yet</h3>
        <p className="text-gray-400">
          Start creating your first Instagram Reel to see your content history here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-fluid-md">
      <div>
        <h2 className="text-fluid-xl font-bold text-foreground mb-fluid-xs leading-fluid-tight">Historique</h2>
        <p className="text-fluid-sm text-muted-foreground leading-fluid-normal">
          Visualisez et gérez vos Reels Instagram générés
        </p>
      </div>

      <div className="grid gap-fluid-sm">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="glass border border-border rounded-fluid-lg p-fluid-sm hover:bg-muted/5 transition-all cursor-pointer group"
            onClick={() => onJobSelect(job.id)}
          >
            <div className="flex items-start gap-fluid-sm">
              {/* Thumbnail */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-fluid-md flex-shrink-0 overflow-hidden relative">
                {job.originalImageUrl ? (
                  <img 
                    src={job.originalImageUrl} 
                    alt="Aperçu" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-4 h-4 sm:w-6 sm:h-6 text-muted-foreground" />
                  </div>
                )}
                {job.status === 'COMPLETED' && job.finalVideoUrl && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
                  </div>
                )}
              </div>

              {/* Job Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-fluid-xs mb-fluid-xs">
                  {getStatusIcon(job.status)}
                  <Badge 
                    variant="outline" 
                    className={`text-fluid-xs ${getStatusColor(job.status)}`}
                  >
                    {job.status}
                  </Badge>
                  {job.status === 'PROCESSING' && (
                    <span className="text-fluid-xs text-muted-foreground hidden sm:inline">
                      {job.progress}% • {job.currentStage}
                    </span>
                  )}
                </div>
                
                <p className="text-fluid-sm text-foreground/80 mb-fluid-xs leading-fluid-tight">
                  Créé {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale: fr })}
                </p>
                
                <div className="flex flex-wrap items-center gap-fluid-xs text-fluid-xs text-muted-foreground">
                  {job.completedAt && (
                    <span className="hidden sm:inline">
                      Terminé {formatDistanceToNow(new Date(job.completedAt), { addSuffix: true, locale: fr })}
                    </span>
                  )}
                  {job.cost && job.cost > 0 && (
                    <>
                      {job.completedAt && <span className="hidden sm:inline">•</span>}
                      <span className="text-green-500 font-semibold">
                        €{job.cost.toFixed(3)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions - Mobile & Desktop Responsive */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-fluid-xs flex-shrink-0">
                {job.status === 'COMPLETED' && job.finalVideoUrl && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onJobSelect(job.id);
                      }}
                      className="text-primary hover:text-primary hover:bg-primary/10 h-8 w-8 sm:h-9 sm:w-9 p-0"
                      title="Voir la vidéo"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleDownload(job.id, e)}
                      disabled={downloadingJobId === job.id}
                      className="text-green-500 hover:text-green-400 hover:bg-green-500/10 h-8 w-8 sm:h-9 sm:w-9 p-0"
                      title="Télécharger"
                    >
                      {downloadingJobId === job.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </Button>
                  </>
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => handleDeleteJob(job.id, e)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 sm:h-9 sm:w-9 p-0"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
