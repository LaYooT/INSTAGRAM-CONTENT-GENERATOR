
"use client";

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Trophy, Zap, DollarSign, TrendingUp, Video } from "lucide-react";

interface UserProfileProps {
  session: Session;
}

interface JobStats {
  totalJobs: number;
  completedJobs: number;
  totalCost: number;
  averageCost: number;
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
  const [loading, setLoading] = useState(true);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Budget initial en euros
  const INITIAL_BUDGET = 20.0;
  const budgetLeft = INITIAL_BUDGET - stats.totalCost;
  const budgetUsedPercent = (stats.totalCost / INITIAL_BUDGET) * 100;

  useEffect(() => {
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
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Profile</h2>
        <p className="text-muted-foreground">Your content creation stats</p>
      </div>

      {/* Profile Card */}
      <Card className="glass border-border">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-2 border-primary">
              <AvatarImage src={session.user?.image || undefined} />
              <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{userName}</CardTitle>
              <CardDescription className="text-base">{userEmail}</CardDescription>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Creator
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Budget Card - Highlighted */}
      <Card className="glass border-border bg-gradient-to-br from-green-500/10 to-emerald-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Budget & Consommation
          </CardTitle>
          <CardDescription>Suivi de vos dépenses réelles en temps réel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Budget Initial</div>
              <div className="text-2xl font-bold text-foreground">€{INITIAL_BUDGET.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Budget Restant</div>
              <div className={`text-2xl font-bold ${
                budgetLeft > 10 ? 'text-green-500' : budgetLeft > 5 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                €{budgetLeft.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Consommé</span>
              <span className="text-foreground font-semibold">
                €{stats.totalCost.toFixed(2)} ({budgetUsedPercent.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
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

          {stats.totalJobs > 0 && (
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Coût moyen par vidéo</span>
                <span className="text-foreground font-semibold">€{stats.averageCost.toFixed(3)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.totalJobs}</div>
              <div className="text-sm text-muted-foreground mt-1">Vidéos Créées</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.completedJobs}</div>
              <div className="text-sm text-muted-foreground mt-1">Complétées</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                {stats.totalJobs > 0 ? ((stats.completedJobs / stats.totalJobs) * 100).toFixed(0) : 0}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">Taux de Succès</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass border-border">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest content generations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No activity yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start creating viral content to see your activity here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
