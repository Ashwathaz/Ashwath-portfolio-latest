"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type ViewMode = "personal" | "work" | "recruiter";

interface RecruiterContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isRecruiterMode: boolean; // Computed: viewMode === "recruiter"
  isWorkMode: boolean;      // Computed: viewMode === "work"
  isPersonalMode: boolean;  // Computed: viewMode === "personal"
  hasSeenSplash: boolean;
  markSplashSeen: () => void;
}

const RecruiterContext = createContext<RecruiterContextType>({
  viewMode: "work",
  setViewMode: () => { },
  isRecruiterMode: false,
  isWorkMode: true,
  isPersonalMode: false,
  hasSeenSplash: false,
  markSplashSeen: () => { },
});

export function RecruiterProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("work");
  const [hasSeenSplash, setHasSeenSplash] = useState(false);

  const markSplashSeen = () => {
    setHasSeenSplash(true);
  };

  return (
    <RecruiterContext.Provider
      value={{
        viewMode,
        setViewMode,
        isRecruiterMode: viewMode === "recruiter",
        isWorkMode: viewMode === "work",
        isPersonalMode: viewMode === "personal",
        hasSeenSplash,
        markSplashSeen
      }}
    >
      {children}
    </RecruiterContext.Provider>
  );
}

export function useRecruiter() {
  return useContext(RecruiterContext);
}
