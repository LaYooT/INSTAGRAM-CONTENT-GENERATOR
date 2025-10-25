
"use client";

import { useState } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { PhotoUpload } from "./photo-upload";
import { ProcessingStatus } from "./processing-status";
import { VideoPreview } from "./video-preview";
import { JobHistory } from "./job-history";
import { LogOut, Play, History } from "lucide-react";

interface ContentGeneratorProps {
  session: Session;
}

export function ContentGenerator({ session }: ContentGeneratorProps) {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"create" | "history">("create");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Instagram Content Generator</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <p className="text-sm text-gray-300">Welcome back, {session.user?.name || 'User'}</p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={activeTab === "create" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("create")}
                  className={activeTab === "create" ? "bg-purple-600 hover:bg-purple-700" : "text-gray-300 hover:text-white"}
                >
                  Create
                </Button>
                <Button
                  variant={activeTab === "history" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("history")}
                  className={activeTab === "history" ? "bg-purple-600 hover:bg-purple-700" : "text-gray-300 hover:text-white"}
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-gray-300 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === "create" ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Upload and Processing */}
              <div className="space-y-6">
                <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Create Viral Content</h2>
                  <p className="text-gray-300 mb-6">
                    Upload your photo and watch as AI transforms it into an Instagram-ready Reel
                  </p>
                  
                  <PhotoUpload 
                    onJobCreated={setCurrentJobId}
                    disabled={!!currentJobId}
                  />
                </div>

                {currentJobId && (
                  <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                    <ProcessingStatus 
                      jobId={currentJobId}
                      onComplete={() => setCurrentJobId(null)}
                    />
                  </div>
                )}
              </div>

              {/* Right Column - Preview and Results */}
              <div className="space-y-6">
                <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Preview & Download</h3>
                  {currentJobId ? (
                    <VideoPreview jobId={currentJobId} />
                  ) : (
                    <div className="aspect-[9/16] max-w-xs mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-16 h-16 text-white/40 mx-auto mb-4" />
                        <p className="text-gray-400">Your video preview will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <JobHistory onJobSelect={setCurrentJobId} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
