
"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LogOut, User, Bell, Palette, DollarSign } from "lucide-react";
import { useState } from "react";

interface SettingsPanelProps {
  session: Session;
}

export function SettingsPanel({ session }: SettingsPanelProps) {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Settings</h2>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Account Info */}
      <Card className="glass border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <CardTitle>{session.user?.name || "User"}</CardTitle>
              <CardDescription>{session.user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Notifications */}
      <Card className="glass border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="cursor-pointer">
              Push notifications
            </Label>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="autoSave" className="cursor-pointer">
              Auto-save drafts
            </Label>
            <Switch
              id="autoSave"
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="glass border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-secondary" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Theme is set to Dark Mode</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Dark mode is optimized for content creators and reduces eye strain.
          </p>
        </CardContent>
      </Card>

      {/* Budget */}
      <Card className="glass border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-green-500" />
            <CardTitle>Budget</CardTitle>
          </div>
          <CardDescription>Your monthly generation budget</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Remaining</span>
              <span className="font-semibold text-green-500">€19.87 / €20.00</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: "99%" }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
