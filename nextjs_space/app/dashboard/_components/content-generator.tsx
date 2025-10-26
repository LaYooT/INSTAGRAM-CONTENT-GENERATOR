
"use client";

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { PhotoUpload } from "./photo-upload";
import { ProcessingStatus } from "./processing-status";
import { VideoPreview } from "./video-preview";
import { JobHistory } from "./job-history";
import { BottomNav } from "./bottom-nav";
import { SettingsPanel } from "./settings-panel";
import { UserProfile } from "./user-profile";
import { AdminPanel } from "./admin-panel";
import { Sparkles, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContentGeneratorProps {
  session: Session;
}

export function ContentGenerator({ session }: ContentGeneratorProps) {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "history" | "settings" | "profile" | "admin">("create");
  const [budgetInfo, setBudgetInfo] = useState({ spent: 0, remaining: 20.0 });

  const INITIAL_BUDGET = 20.0;

  // Handle job selection from history - switch to create tab and show preview
  const handleJobSelect = (jobId: string) => {
    setCurrentJobId(jobId);
    setActiveTab("create");
    setIsProcessing(false);
  };

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (response.ok) {
          const jobs = await response.json();
          const totalCost = jobs.reduce((sum: number, j: any) => sum + (j.cost || 0), 0);
          setBudgetInfo({
            spent: totalCost,
            remaining: INITIAL_BUDGET - totalCost,
          });
        }
      } catch (error) {
        console.error('Failed to fetch budget:', error);
      }
    };

    fetchBudget();
    
    // Refresh budget every 10 seconds
    const interval = setInterval(fetchBudget, 10000);
    return () => clearInterval(interval);
  }, []);

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.2,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Minimal, clean - Fluid responsive */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-fluid-container py-fluid-sm">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-fluid-sm">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-fluid-md flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-background" />
              </div>
              <div>
                <h1 className="text-fluid-lg font-bold text-foreground leading-fluid-tight">ReelGen AI</h1>
                <p className="text-fluid-xs text-muted-foreground hidden sm:block leading-fluid-tight">Create Viral Content</p>
              </div>
            </div>

            {/* Desktop welcome message */}
            <div className="hidden md:flex items-center gap-fluid-sm">
              <div className="text-right">
                <p className="text-fluid-sm font-medium text-foreground leading-fluid-tight">
                  {session.user?.name || "User"}
                </p>
                <p className="text-fluid-xs text-muted-foreground leading-fluid-tight">
                  Budget: <span className={`font-semibold ${
                    budgetInfo.remaining > 10 ? 'text-green-500' : 
                    budgetInfo.remaining > 5 ? 'text-yellow-500' : 
                    'text-red-500'
                  }`}>
                    €{budgetInfo.remaining.toFixed(2)}
                  </span>
                  {budgetInfo.spent > 0 && (
                    <span className="text-muted-foreground ml-1">
                      / €{INITIAL_BUDGET.toFixed(2)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Fluid responsive */}
      <main className="container mx-auto px-fluid-container py-fluid-md md:py-fluid-lg pb-24 md:pb-fluid-xl">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "create" && (
              <motion.div
                key="create"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-fluid-md lg:gap-fluid-lg">
                  {/* Left Column - Upload and Processing */}
                  <div className="space-y-fluid-md">
                    <div className="glass rounded-fluid-lg p-fluid-md border border-border">
                      <div className="flex items-center gap-fluid-sm mb-fluid-md">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 text-primary rounded-fluid-md flex items-center justify-center">
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                          <h2 className="text-fluid-xl font-bold text-foreground leading-fluid-tight">Create Content</h2>
                          <p className="text-fluid-sm text-muted-foreground leading-fluid-tight">
                            Transform photos into viral Reels
                          </p>
                        </div>
                      </div>

                      <PhotoUpload
                        onJobCreated={(jobId) => {
                          setCurrentJobId(jobId);
                          setIsProcessing(true);
                        }}
                        disabled={isProcessing}
                      />
                    </div>

                    {isProcessing && currentJobId && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass rounded-fluid-lg p-fluid-md border border-border"
                      >
                        <ProcessingStatus
                          jobId={currentJobId}
                          onComplete={() => setIsProcessing(false)}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Right Column - Preview and Results */}
                  <div className="space-y-fluid-md">
                    <div className="glass rounded-fluid-lg p-fluid-md border border-border">
                      <h3 className="text-fluid-lg font-bold text-foreground mb-fluid-md leading-fluid-tight">
                        Preview & Download
                      </h3>
                      {currentJobId ? (
                        <VideoPreview jobId={currentJobId} />
                      ) : (
                        <div className="aspect-[9/16] max-w-xs mx-auto bg-muted/30 rounded-fluid-lg border-2 border-dashed border-border flex items-center justify-center p-fluid-md">
                          <div className="text-center">
                            <Play className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/40 mx-auto mb-fluid-sm" />
                            <p className="text-muted-foreground text-fluid-sm px-fluid-sm leading-fluid-normal">
                              Your video will appear here
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div
                key="history"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <div className="glass rounded-fluid-lg p-fluid-md border border-border">
                  <JobHistory onJobSelect={handleJobSelect} />
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <SettingsPanel session={session} />
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key="profile"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <UserProfile session={session} />
              </motion.div>
            )}

            {activeTab === "admin" && (
              <motion.div
                key="admin"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <div className="glass rounded-fluid-lg p-fluid-md border border-border">
                  <AdminPanel session={session} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Navigation (Mobile + Desktop) */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
