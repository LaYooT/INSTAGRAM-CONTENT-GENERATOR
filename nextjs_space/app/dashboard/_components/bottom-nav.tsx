
"use client";

import { Home, History, Settings, User, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface BottomNavProps {
  activeTab: "create" | "history" | "settings" | "profile" | "admin";
  onTabChange: (tab: "create" | "history" | "settings" | "profile" | "admin") => void;
}

const baseNavItems = [
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

const adminNavItem = {
  id: "admin" as const,
  label: "Admin",
  icon: Shield,
};

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { data: session } = useSession() || {};
  const isAdmin = session?.user?.role === "ADMIN";
  
  const navItems = isAdmin ? [...baseNavItems, adminNavItem] : baseNavItems;
  const gridCols = isAdmin ? "grid-cols-5" : "grid-cols-4";

  return (
    <>
      {/* Mobile Bottom Navigation - Fluid responsive */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 pb-safe">
        <div className={cn("grid", gridCols)} style={{ height: 'clamp(3.5rem, 4vw + 3rem, 4.5rem)' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-fluid-xs transition-smooth",
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
                    className="absolute inset-0 bg-primary/10 rounded-fluid-md"
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
                  <Icon style={{ width: 'clamp(1.125rem, 1vw + 1rem, 1.375rem)', height: 'clamp(1.125rem, 1vw + 1rem, 1.375rem)' }} />
                </motion.div>

                {/* Label */}
                <span
                  className={cn(
                    "relative z-10 text-fluid-xs font-medium transition-smooth leading-fluid-tight",
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

      {/* Desktop Side Navigation (Tablet+) - Fluid responsive */}
      <nav className="hidden md:flex fixed z-50 flex-col gap-fluid-sm glass rounded-fluid-lg p-fluid-sm" 
           style={{ 
             left: 'clamp(0.5rem, 1vw, 1.5rem)',
             top: '50%',
             transform: 'translateY(-50%)'
           }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "relative flex items-center justify-center rounded-fluid-md transition-smooth",
                "min-h-[44px] min-w-[44px]", // Accessibility: 44x44px touch target
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              style={{
                width: 'clamp(2.75rem, 3vw + 2rem, 3.5rem)',
                height: 'clamp(2.75rem, 3vw + 2rem, 3.5rem)'
              }}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              title={item.label}
            >
              <Icon style={{ width: 'clamp(1.125rem, 1.2vw + 0.8rem, 1.5rem)', height: 'clamp(1.125rem, 1.2vw + 0.8rem, 1.5rem)' }} />

              {/* Desktop tooltip */}
              <div
                className={cn(
                  "absolute left-full ml-fluid-sm px-fluid-sm py-fluid-xs bg-card border border-border rounded-fluid-md",
                  "text-fluid-sm font-medium whitespace-nowrap pointer-events-none",
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
