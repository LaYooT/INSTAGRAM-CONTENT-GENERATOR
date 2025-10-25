
"use client";

import { Home, History, Settings, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: "create" | "history" | "settings" | "profile";
  onTabChange: (tab: "create" | "history" | "settings" | "profile") => void;
}

const navItems = [
  {
    id: "create" as const,
    label: "Create",
    icon: Home,
  },
  {
    id: "history" as const,
    label: "History",
    icon: History,
  },
  {
    id: "settings" as const,
    label: "Settings",
    icon: Settings,
  },
  {
    id: "profile" as const,
    label: "Profile",
    icon: User,
  },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 pb-safe">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 transition-smooth",
                  "touch-manipulation min-h-[44px] min-w-[44px]", // Accessibility: 44x44px touch target
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative z-10"
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Label */}
                <span
                  className={cn(
                    "relative z-10 text-xs font-medium transition-smooth",
                    isActive && "font-semibold"
                  )}
                >
                  {item.label}
                </span>

                {/* Active dot indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute top-1 w-1 h-1 bg-primary rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Side Navigation (Tablet+) */}
      <nav className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-50 flex-col gap-2 glass rounded-2xl p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "relative flex items-center justify-center w-12 h-12 rounded-xl transition-smooth",
                "min-h-[44px] min-w-[44px]", // Accessibility: 44x44px touch target
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              title={item.label}
            >
              <Icon className="w-5 h-5" />

              {/* Desktop tooltip */}
              <div
                className={cn(
                  "absolute left-full ml-3 px-3 py-1.5 bg-card border border-border rounded-lg",
                  "text-sm font-medium whitespace-nowrap pointer-events-none",
                  "opacity-0 group-hover:opacity-100 transition-opacity"
                )}
              >
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>
    </>
  );
}
