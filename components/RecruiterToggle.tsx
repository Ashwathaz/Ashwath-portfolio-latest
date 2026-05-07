"use client";

import { useRecruiter, type ViewMode } from "@/lib/recruiter-context";
import { cn } from "@/lib/utils";
import { User, Briefcase, Code } from "lucide-react";
import { motion } from "framer-motion";

interface RecruiterToggleProps {
  size?: "sm" | "md";
  dark?: boolean;
}

export default function RecruiterToggle({ size = "md", dark = false }: RecruiterToggleProps) {
  const { viewMode, setViewMode } = useRecruiter();

  const modes: { id: ViewMode; label: string; icon: React.ElementType }[] = [
    { id: "work", label: "Work", icon: Code },
    { id: "personal", label: "Personal", icon: User },
    { id: "recruiter", label: "Recruiter", icon: Briefcase },
  ];

  return (
    <div
      className={cn(
        "group relative flex items-center gap-1.5 overflow-hidden rounded-full border p-1.5 font-mono text-xs font-bold transition-all duration-300 backdrop-blur-xl",
        dark ? "bg-white/10 border-white/10" : "bg-white/80 border-border/50 shadow-smooth-sm"
      )}
      aria-label="Select View Mode"
    >
      {modes.map((mode) => {
        const isActive = viewMode === mode.id;
        const Icon = mode.icon;

        return (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id)}
            className={cn(
              "relative z-10 flex items-center gap-2 rounded-full transition-all duration-300",
              size === "sm" ? "px-3 py-1.5" : "px-4 py-2.5",
              isActive 
                ? (dark && mode.id !== "recruiter" ? "text-dark" : "text-white")
                : (dark ? "text-white/60 hover:text-white" : "text-text-muted hover:text-primary hover:bg-black/5")
            )}
          >
            {/* Sliding Pill Background */}
            {isActive && (
              <motion.div
                layoutId={`pill-indicator-${size}-${dark ? 'dark' : 'light'}`}
                className={cn(
                  "absolute inset-0 z-[-1] rounded-full shadow-md",
                  mode.id === "recruiter" 
                    ? "bg-violet-600 shadow-violet-200/30" 
                    : dark ? "bg-white" : "bg-primary"
                )}
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <div className={cn(
              "flex items-center justify-center transition-transform duration-300",
              isActive ? "scale-110" : ""
            )}>
              <Icon size={15} />
            </div>
            <span className="tracking-wide">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
