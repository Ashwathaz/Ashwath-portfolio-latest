"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  SITE as DEFAULT_SITE,
  TIMELINE as DEFAULT_TIMELINE,
  ABOUT_TEXT as DEFAULT_ABOUT,
  PROJECTS as DEFAULT_PROJECTS,
  PERSONAL as DEFAULT_PERSONAL,
} from "./constants";
import type { TimelineItem } from "@/types";

type SiteContent = {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  location: string;
  resumeUrl: string;
  photoUrl?: string;
};

export type PortfolioProject = {
  id?: string;
  title: string;
  tech: string;
  description: string;
  date?: string;
  image?: string;
  link?: string;
  points?: string[];
};

type PersonalContent = {
  heroTitle?: string;
  heroHeadingBefore?: string;
  heroHeadingAccent?: string;
  heroHeadingAfter?: string;
  heroText?: string;
  heroImage?: string;
  instagram?: string;
  gaming?: Array<{ name: string; rank: string; desc?: string }>;
  sports?: Array<{ name: string; rank: string; desc?: string }>;
  foodie?: Array<string | { name: string; type?: string }>;
  ambitions?: Array<{ name: string; desc: string }>;
  galleryNotes?: Array<{ title: string; desc: string }>;
  gallery?: string[];
};

export interface PortfolioContent {
  SITE: SiteContent;
  ABOUT_TEXT: string[];
  TIMELINE: TimelineItem[];
  PROJECTS?: PortfolioProject[];
  PERSONAL?: PersonalContent;
}

interface ContentContextType {
  content: PortfolioContent;
  isLoading: boolean;
  previewContent: (newContent: PortfolioContent) => void;
  updateContent: (newContent: PortfolioContent, password: string) => Promise<boolean>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const DEFAULT_CONTENT: PortfolioContent = {
  SITE: DEFAULT_SITE,
  ABOUT_TEXT: DEFAULT_ABOUT,
  TIMELINE: DEFAULT_TIMELINE,
  PROJECTS: DEFAULT_PROJECTS,
  PERSONAL: DEFAULT_PERSONAL,
};

function mergeContent(data?: Partial<PortfolioContent> | null): PortfolioContent {
  return {
    ...DEFAULT_CONTENT,
    ...data,
    SITE: {
      ...DEFAULT_CONTENT.SITE,
      ...(data?.SITE || {}),
    },
    ABOUT_TEXT: data?.ABOUT_TEXT || DEFAULT_CONTENT.ABOUT_TEXT,
    TIMELINE: data?.TIMELINE || DEFAULT_CONTENT.TIMELINE,
    PROJECTS: data?.PROJECTS || DEFAULT_CONTENT.PROJECTS,
    PERSONAL: {
      ...DEFAULT_CONTENT.PERSONAL,
      ...(data?.PERSONAL || {}),
    },
  };
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<PortfolioContent>(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const previewContent = useCallback((newContent: PortfolioContent) => {
    setContent(mergeContent(newContent));
  }, []);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Content request failed with ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.SITE) {
          setContent(mergeContent(data));
        }
      })
      .catch(() => {
        // Keep the bundled portfolio content if the editable content API is unavailable.
      })
      .finally(() => setIsLoading(false));
  }, []);

  const updateContent = async (newContent: PortfolioContent, password: string) => {
    const mergedContent = mergeContent(newContent);

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": password,
        },
        body: JSON.stringify(mergedContent),
      });

      if (res.ok) {
        setContent(mergedContent);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Update failed:", err);
      return false;
    }
  };

  return (
    <ContentContext.Provider value={{ content, isLoading, previewContent, updateContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
