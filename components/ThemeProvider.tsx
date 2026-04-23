"use client";
import { useEffect } from "react";
import { useSiteSettings } from "@/lib/hooks";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    if (settings?.theme) {
      const root = document.documentElement;
      const { primary, secondary, accent, background, card } = settings.theme;
      if (primary) root.style.setProperty("--primary", primary);
      if (secondary) root.style.setProperty("--secondary", secondary);
      if (accent) root.style.setProperty("--accent", accent);
      if (background) root.style.setProperty("--background", background);
      if (card) root.style.setProperty("--card", card);
    }
  }, [settings]);

  return <>{children}</>;
}
