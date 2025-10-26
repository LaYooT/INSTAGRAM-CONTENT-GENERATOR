
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
import { Sparkles, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContentGeneratorProps {
  session: Session;
}

export function ContentGenerator({ session }: ContentGeneratorProps) {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "history" | "settings" | "profile">("create");
  const [budgetInfo, setBudgetInfo] = useState({ spent: 0, remaining: 20.0 });

  const INITIAL_BUDGET = 20.0;

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
      {/* Header - Minimal, clean */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-5 h-5 text-background" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">ReelGen AI</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Create Viral Content</p>
              </div>
            </div>

            {/* Desktop welcome message */}
            <div className="hidden md:flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {session.user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground">
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

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6 md:py-8 md:pl-24">
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
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* Left Column - Upload and Processing */}
                  <div className="space-y-6">
                    <div className="glass rounded-2xl p-6 border border-border">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-foreground">Create Content</h2>
                          <p className="text-sm text-muted-foreground">
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
                        className="glass rounded-2xl p-6 border border-border"
                      >
                        <ProcessingStatus
                          jobId={currentJobId}
                          onComplete={() => setIsProcessing(false)}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Right Column - Preview and Results */}
                  <div className="space-y-6">
                    <div className="glass rounded-2xl p-6 border border-border">
                      <h3 className="text-lg font-bold text-foreground mb-4">
                        Preview & Download
                      </h3>
                      {currentJobId ? (
                        <VideoPreview jobId={currentJobId} />
                      ) : (
                        <div className="aspect-[9/16] max-w-xs mx-auto bg-muted/30 rounded-2xl border-2 border-dashed border-border flex items-center justify-center">
                          <div className="text-center">
                            <Play className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                            <p className="text-muted-foreground text-sm px-6">
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
                <div className="glass rounded-2xl p-6 border border-border">
                  <JobHistory onJobSelect={setCurrentJobId} />
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
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Navigation (Mobile + Desktop) */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
