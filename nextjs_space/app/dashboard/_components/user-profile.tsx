
"use client";

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Trophy, DollarSign, TrendingUp, Video, RefreshCw } from "lucide-react";

interface UserProfileProps {
  session: Session;
}

interface JobStats {
  totalJobs: number;
  completedJobs: number;
  totalCost: number;
  averageCost: number;
}

interface BudgetInfo {
  manualBudget: number | null;
  spent: number;
  remaining: number | null;
  hasManualBudget: boolean;
}

export function UserProfile({ session }: UserProfileProps) {
  const userName = session.user?.name || "User";
  const userEmail = session.user?.email || "";
  
  const [stats, setStats] = useState<JobStats>({
    totalJobs: 0,
    completedJobs: 0,
    totalCost: 0,
    averageCost: 0,
  });
  const [budgetInfo, setBudgetInfo] = useState<BudgetInfo | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingBudget, setIsLoadingBudget] = useState(true);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Fetch job statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const jobs = await response.json();
        const completed = jobs.filter((j: any) => j.status === 'COMPLETED');
        const totalCost = jobs.reduce((sum: number, j: any) => sum + (j.cost || 0), 0);
        
        setStats({
          totalJobs: jobs.length,
          completedJobs: completed.length,
          totalCost: totalCost,
          averageCost: jobs.length > 0 ? totalCost / jobs.length : 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Fetch budget information from API
  const fetchBudget = async () => {
    try {
      const response = await fetch('/api/budget');
      if (response.ok) {
        const data = await response.json();
        setBudgetInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch budget:', error);
    } finally {
      setIsLoadingBudget(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchBudget();
    
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchStats();
      fetchBudget();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate budget usage percentage
  const budgetUsedPercent = budgetInfo?.hasManualBudget && budgetInfo.manualBudget 
    ? (budgetInfo.spent / budgetInfo.manualBudget) * 100 
    : 0;

  return (
    <div className="space-y-fluid-lg pb-20 md:pb-6">
      {/* Header */}
      <div>
        <h2 className="text-fluid-2xl font-bold text-foreground mb-fluid-xs leading-fluid-tight">Profile</h2>
        <p className="text-fluid-sm text-muted-foreground leading-fluid-normal">Your content creation statistics</p>
      </div>

      {/* Profile Card */}
      <Card className="glass border-border">
        <CardHeader>
          <div className="flex items-center gap-fluid-md">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-primary">
              <AvatarImage src={session.user?.image || undefined} />
              <AvatarFallback className="bg-primary/20 text-primary text-fluid-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-fluid-xl leading-fluid-tight">{userName}</CardTitle>
              <CardDescription className="text-fluid-sm leading-fluid-normal mt-fluid-xs">{userEmail}</CardDescription>
              <div className="flex gap-fluid-xs mt-fluid-sm">
                <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30 text-fluid-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Creator
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Budget Card - Real-time Tracking */}
      <Card className="glass border-border bg-gradient-to-br from-green-500/10 to-emerald-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-fluid-xs text-fluid-lg leading-fluid-tight">
            <DollarSign className="w-5 h-5 text-green-500" />
            Budget & Usage
          </CardTitle>
          <CardDescription className="text-fluid-xs leading-fluid-normal">Real-time spending tracker</CardDescription>
        </CardHeader>
        <CardContent className="space-y-fluid-md">
          {isLoadingBudget ? (
            <div className="flex items-center justify-center py-fluid-lg">
              <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : budgetInfo?.hasManualBudget && budgetInfo.manualBudget !== null ? (
            <>
              {/* Budget Overview Grid */}
              <div className="grid grid-cols-2 gap-fluid-md sm:gap-fluid-lg">
                <div>
                  <div className="text-fluid-xs text-muted-foreground mb-fluid-xs leading-fluid-normal">Total Budget</div>
                  <div className="text-fluid-xl sm:text-fluid-2xl font-bold text-foreground leading-fluid-tight">
                    €{budgetInfo.manualBudget.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-fluid-xs text-muted-foreground mb-fluid-xs leading-fluid-normal">Remaining</div>
                  <div className={`text-fluid-xl sm:text-fluid-2xl font-bold leading-fluid-tight ${
                    budgetInfo.remaining && budgetInfo.remaining > budgetInfo.manualBudget * 0.5 
                      ? 'text-green-500' 
                      : budgetInfo.remaining && budgetInfo.remaining > budgetInfo.manualBudget * 0.25 
                      ? 'text-yellow-500' 
                      : 'text-red-500'
                  }`}>
                    €{budgetInfo.remaining?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>

              {/* Usage Details */}
              <div className="space-y-fluid-xs">
                <div className="flex justify-between text-fluid-xs sm:text-fluid-sm">
                  <span className="text-muted-foreground leading-fluid-normal">Spent (Estimated)</span>
                  <span className="text-foreground font-semibold leading-fluid-normal">
                    €{budgetInfo.spent.toFixed(2)} ({budgetUsedPercent.toFixed(1)}%)
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-fluid-md h-2.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      budgetUsedPercent < 50 ? 'bg-green-500' : 
                      budgetUsedPercent < 80 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(budgetUsedPercent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Average Cost */}
              {stats.totalJobs > 0 && (
                <div className="pt-fluid-sm border-t border-border">
                  <div className="flex items-center justify-between text-fluid-xs sm:text-fluid-sm">
                    <span className="text-muted-foreground leading-fluid-normal">Avg. Cost per Video</span>
                    <span className="text-foreground font-semibold leading-fluid-normal">€{stats.averageCost.toFixed(3)}</span>
                  </div>
                </div>
              )}

              {/* Low Budget Warning */}
              {budgetInfo.remaining && budgetInfo.remaining < budgetInfo.manualBudget * 0.25 && (
                <div className="p-fluid-sm bg-red-500/10 border border-red-500/20 rounded-fluid-md">
                  <p className="text-fluid-xs text-red-500 font-medium leading-fluid-normal">
                    ⚠️ Low budget! Consider adding more credits on fal.ai
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-fluid-lg">
              <p className="text-fluid-sm text-muted-foreground leading-fluid-normal">
                No budget set. Go to Settings to configure your budget.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-fluid-md">
        <Card className="glass border-border">
          <CardContent className="pt-fluid-lg">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-fluid-sm">
                <Video className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-fluid-2xl sm:text-fluid-3xl font-bold text-foreground leading-fluid-tight">
                {isLoadingStats ? '...' : stats.totalJobs}
              </div>
              <div className="text-fluid-xs sm:text-fluid-sm text-muted-foreground mt-fluid-xs leading-fluid-normal">Videos Created</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-fluid-lg">
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mx-auto mb-fluid-sm">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-fluid-2xl sm:text-fluid-3xl font-bold text-foreground leading-fluid-tight">
                {isLoadingStats ? '...' : stats.completedJobs}
              </div>
              <div className="text-fluid-xs sm:text-fluid-sm text-muted-foreground mt-fluid-xs leading-fluid-normal">Completed</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-fluid-lg">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-fluid-sm">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-fluid-2xl sm:text-fluid-3xl font-bold text-foreground leading-fluid-tight">
                {isLoadingStats ? '...' : stats.totalJobs > 0 ? ((stats.completedJobs / stats.totalJobs) * 100).toFixed(0) : 0}%
              </div>
              <div className="text-fluid-xs sm:text-fluid-sm text-muted-foreground mt-fluid-xs leading-fluid-normal">Success Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass border-border">
        <CardHeader>
          <CardTitle className="text-fluid-lg leading-fluid-tight">Recent Activity</CardTitle>
          <CardDescription className="text-fluid-xs leading-fluid-normal">Your latest content generations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-fluid-2xl">
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-fluid-sm" />
            <p className="text-fluid-sm text-muted-foreground leading-fluid-normal">No activity yet</p>
            <p className="text-fluid-xs text-muted-foreground mt-fluid-xs leading-fluid-normal">
              Start creating viral content to see your activity here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
