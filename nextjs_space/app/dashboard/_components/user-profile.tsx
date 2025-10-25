
"use client";

import { Session } from "next-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Trophy, Zap } from "lucide-react";

interface UserProfileProps {
  session: Session;
}

export function UserProfile({ session }: UserProfileProps) {
  const userName = session.user?.name || "User";
  const userEmail = session.user?.email || "";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-foreground">0</div>
              <div className="text-sm text-muted-foreground mt-1">Videos Created</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-foreground">0</div>
              <div className="text-sm text-muted-foreground mt-1">Total Views</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-foreground">€19.87</div>
              <div className="text-sm text-muted-foreground mt-1">Budget Left</div>
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
