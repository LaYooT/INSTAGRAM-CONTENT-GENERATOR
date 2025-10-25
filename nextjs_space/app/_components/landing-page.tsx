
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, Upload, Sparkles, Download } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Play className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Create Viral
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
                Instagram Reels
              </span>
              with AI
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your photos into engaging vertical videos optimized for Instagram. 
              Upload, transform, animate, and download ready-to-post content.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 text-lg">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-black/30 transition-colors">
              <Upload className="w-8 h-8 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">Easy Upload</h3>
              <p className="text-gray-300">Drag and drop your photos or click to upload. Support for JPG, PNG, and WebP formats.</p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-black/30 transition-colors">
              <Sparkles className="w-8 h-8 text-pink-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">AI Transformation</h3>
              <p className="text-gray-300">Advanced AI transforms your images and creates engaging animated videos automatically.</p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-black/30 transition-colors">
              <Download className="w-8 h-8 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">Instagram Ready</h3>
              <p className="text-gray-300">Perfect 1080x1920 resolution and 9:16 aspect ratio for Instagram Reels.</p>
            </div>
          </div>
          
          {/* Process Steps */}
          <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Transform</h3>
                <p className="text-gray-300">AI enhances and transforms your photo</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Animate</h3>
                <p className="text-gray-300">Creates engaging video animation</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Format</h3>
                <p className="text-gray-300">Optimizes for Instagram Reels</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 mb-4">Ready to create viral content?</p>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4">
                Start Creating Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
