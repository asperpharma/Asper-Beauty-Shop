import { useCallback, useEffect, useState } from "react";
import type { DigitalTrayResponse } from "@/types/digitalTray";
import type { TraySlot } from "@/lib/regimenToTrayProducts";
import { regimenToTrayProductsFromApi } from "@/lib/regimenToTrayProducts";

/** Maps concern slug (e.g. acne-blemishes) to concern_tag */
const SLUG_TO_CONCERN: Record<string, string> = {
  "acne-blemishes": "Concern_Acne",
  "anti-aging-wrinkles": "Concern_AntiAging",
  "dryness-hydration": "Concern_Dryness",
  "sensitivity-redness": "Concern_Sensitivity",
  "hyperpigmentation-dark-spots": "Concern_Hyperpigmentation",
};

export interface UseDigitalTrayResult {
  slots: TraySlot[];
  concernTag: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetches Digital Tray from API. Falls back to empty slots if API unavailable.
 * Caller can use static regimen when error or empty.
 */
export function useDigitalTray(
  concernSlug: string | undefined,
): UseDigitalTrayResult {
  const [slots, setSlots] = useState<TraySlot[]>([]);
  const [concernTag, setConcernTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTray = useCallback(async () => {
    if (!concernSlug) {
      setSlots([]);
      setConcernTag(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const tag = SLUG_TO_CONCERN[concernSlug] ?? concernSlug;
    setConcernTag(tag);
    setIsLoading(true);
    setError(null);

    const baseUrl = import.meta.env.VITE_SUPABASE_URL;
    const trayUrl = import.meta.env.VITE_TRAY_URL ??
      (baseUrl ? `${baseUrl}/functions/v1/tray` : "");

    if (!trayUrl) {
      setError("API not configured");
      setSlots([]);
      setIsLoading(false);
      return;
    }

    try {
      const url = `${trayUrl}?concern=${encodeURIComponent(tag)}`;
      // Primary: VITE_SUPABASE_PUBLISHABLE_KEY (Edge Function / Centralised Brain). Fallback: VITE_SUPABASE_ANON_KEY for compatibility.
      const anonKey =
        import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
        import.meta.env.VITE_SUPABASE_ANON_KEY;
      const res = await fetch(url, {
        headers: anonKey ? { Authorization: `Bearer ${anonKey}` } : {},
      });

      if (!res.ok) {
        throw new Error(
          res.status === 400 ? "Invalid concern" : `HTTP ${res.status}`,
        );
      }

      const data: DigitalTrayResponse = await res.json();
      const traySlots = regimenToTrayProductsFromApi(data);
      setSlots(traySlots);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load regimen");
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  }, [concernSlug]);

  useEffect(() => {
    fetchTray();
  }, [fetchTray]);

  return { slots, concernTag, isLoading, error, refetch: fetchTray };
}
