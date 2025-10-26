
"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { LogOut, User, Bell, Palette, DollarSign, ExternalLink, Save, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ModelPreferencesPanel } from "./model-preferences-panel";

interface SettingsPanelProps {
  session: Session;
}

export function SettingsPanel({ session }: SettingsPanelProps) {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [budgetInput, setBudgetInput] = useState("");
  const [budgetInfo, setBudgetInfo] = useState<{
    manualBudget: number | null;
    spent: number;
    remaining: number | null;
    hasManualBudget: boolean;
  } | null>(null);
  const [isLoadingBudget, setIsLoadingBudget] = useState(true);
  const [isSavingBudget, setIsSavingBudget] = useState(false);

  // Fetch budget info
  const fetchBudgetInfo = async () => {
    try {
      setIsLoadingBudget(true);
      const response = await fetch('/api/budget');
      if (response.ok) {
        const data = await response.json();
        setBudgetInfo(data);
        if (data.manualBudget !== null) {
          setBudgetInput(data.manualBudget.toFixed(2));
        }
      }
    } catch (error) {
      console.error('Failed to fetch budget:', error);
      toast.error('Failed to load budget information');
    } finally {
      setIsLoadingBudget(false);
    }
  };

  useEffect(() => {
    fetchBudgetInfo();
  }, []);

  const handleSaveBudget = async () => {
    try {
      setIsSavingBudget(true);
      const budgetValue = budgetInput.trim() === "" ? null : parseFloat(budgetInput);

      if (budgetValue !== null && (isNaN(budgetValue) || budgetValue < 0)) {
        toast.error('Please enter a valid budget amount');
        return;
      }

      const response = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget: budgetValue })
      });

      if (response.ok) {
        toast.success(budgetValue === null ? 'Budget removed' : 'Budget updated successfully');
        await fetchBudgetInfo();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update budget');
      }
    } catch (error) {
      console.error('Failed to save budget:', error);
      toast.error('Failed to save budget');
    } finally {
      setIsSavingBudget(false);
    }
  };

  const openFalDashboard = () => {
    window.open('https://fal.ai/dashboard/keys', '_blank');
  };

  return (
    <div className="space-y-fluid-lg pb-20 md:pb-6">
      <div>
        <h2 className="text-fluid-2xl font-bold text-foreground mb-fluid-xs">Settings</h2>
        <p className="text-fluid-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Account Info */}
      <Card className="glass border-border">
        <CardHeader>
          <div className="flex items-center gap-fluid-sm">
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-fluid-base">{session.user?.name || "User"}</CardTitle>
              <CardDescription className="text-fluid-xs">{session.user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Notifications */}
      <Card className="glass border-border">
        <CardHeader>
          <div className="flex items-center gap-fluid-sm">
            <Bell className="w-5 h-5 text-primary" />
            <CardTitle className="text-fluid-base">Notifications</CardTitle>
          </div>
          <CardDescription className="text-fluid-xs">Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-fluid-md">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="cursor-pointer text-fluid-sm">
              Push notifications
            </Label>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="autoSave" className="cursor-pointer text-fluid-sm">
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
          <div className="flex items-center gap-fluid-sm">
            <Palette className="w-5 h-5 text-secondary" />
            <CardTitle className="text-fluid-base">Appearance</CardTitle>
          </div>
          <CardDescription className="text-fluid-xs">Theme is set to Dark Mode</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-fluid-xs text-muted-foreground">
            Dark mode is optimized for content creators and reduces eye strain.
          </p>
        </CardContent>
      </Card>

      {/* Model Preferences */}
      <ModelPreferencesPanel />

      {/* Budget Management */}
      <Card className="glass border-border">
        <CardHeader>
          <div className="flex items-center gap-fluid-sm">
            <DollarSign className="w-5 h-5 text-green-500" />
            <CardTitle className="text-fluid-base">Budget Management</CardTitle>
          </div>
          <CardDescription className="text-fluid-xs">
            Track your fal.ai API consumption and budget
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-fluid-md">
          {/* Link to fal.ai Dashboard */}
          <div className="p-fluid-sm bg-primary/5 border border-primary/20 rounded-fluid-md">
            <div className="flex items-start gap-fluid-sm">
              <ExternalLink className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-fluid-xs font-medium text-foreground mb-fluid-2xs">
                  Check your real balance on fal.ai
                </p>
                <p className="text-fluid-2xs text-muted-foreground mb-fluid-xs">
                  View your actual credit balance, transaction history, and billing details
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-fluid-2xs h-8"
                  onClick={openFalDashboard}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Open fal.ai Dashboard
                </Button>
              </div>
            </div>
          </div>

          {/* Manual Budget Input */}
          <div className="space-y-fluid-xs">
            <Label htmlFor="budget-input" className="text-fluid-sm">
              Set Your Current Budget (€)
            </Label>
            <p className="text-fluid-2xs text-muted-foreground">
              After checking your fal.ai dashboard, enter your current credit balance here to track consumption
            </p>
            <div className="flex gap-fluid-xs">
              <Input
                id="budget-input"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g., 10.00"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="flex-1 text-fluid-sm"
                disabled={isSavingBudget}
              />
              <Button
                size="sm"
                onClick={handleSaveBudget}
                disabled={isSavingBudget || isLoadingBudget}
                className="text-fluid-xs"
              >
                {isSavingBudget ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Budget Display */}
          {!isLoadingBudget && budgetInfo && (
            <div className="space-y-fluid-xs pt-fluid-sm border-t border-border">
              <div className="flex justify-between text-fluid-xs">
                <span className="text-muted-foreground">Total Spent (Estimated)</span>
                <span className="font-semibold text-foreground">
                  €{budgetInfo.spent.toFixed(2)}
                </span>
              </div>
              
              {budgetInfo.hasManualBudget && budgetInfo.manualBudget !== null && budgetInfo.remaining !== null ? (
                <>
                  <div className="flex justify-between text-fluid-sm">
                    <span className="text-muted-foreground">Remaining Budget</span>
                    <span className={`font-semibold ${
                      budgetInfo.remaining > budgetInfo.manualBudget * 0.5 ? 'text-green-500' : 
                      budgetInfo.remaining > budgetInfo.manualBudget * 0.25 ? 'text-yellow-500' : 
                      'text-red-500'
                    }`}>
                      €{budgetInfo.remaining.toFixed(2)} / €{budgetInfo.manualBudget.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        budgetInfo.remaining > budgetInfo.manualBudget * 0.5 ? 'bg-green-500' : 
                        budgetInfo.remaining > budgetInfo.manualBudget * 0.25 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.max(0, Math.min(100, (budgetInfo.remaining / budgetInfo.manualBudget) * 100))}%` 
                      }}
                    />
                  </div>
                  {budgetInfo.remaining < budgetInfo.manualBudget * 0.25 && (
                    <p className="text-fluid-2xs text-red-500 font-medium">
                      ⚠️ Low budget! Consider adding more credits on fal.ai
                    </p>
                  )}
                </>
              ) : (
                <p className="text-fluid-2xs text-muted-foreground italic">
                  Set a budget above to track your remaining credits
                </p>
              )}
            </div>
          )}

          {isLoadingBudget && (
            <div className="flex items-center justify-center py-fluid-md">
              <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Button
        variant="destructive"
        className="w-full text-fluid-sm"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
