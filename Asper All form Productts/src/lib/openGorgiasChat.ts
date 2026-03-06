/**
 * Opens the Gorgias chat widget when user clicks "Consult Pharmacist" fallback card.
 * Supports common Gorgias embed patterns.
 */

declare global {
  interface Window {
    GorgiasChat?: { open: () => void };
    gorgias?: { open: () => void };
  }
}

/** Custom event name for app-level Gorgias open handlers */
export const GORGIAS_OPEN_EVENT = "asper:open-gorgias-chat";

/**
 * Opens the Digital Concierge chat.
 * Tries: Gorgias embed → custom event → fallback URL.
 */
export function openGorgiasChat(): void {
  // 1. Gorgias embedded widget (common embed)
  if (typeof window !== "undefined" && window.GorgiasChat?.open) {
    window.GorgiasChat.open();
    return;
  }
  if (typeof window !== "undefined" && window.gorgias?.open) {
    window.gorgias.open();
    return;
  }

  // 2. Dispatch custom event — parent/embed can listen and open chat
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(GORGIAS_OPEN_EVENT));
  }

  // 3. Fallback: open contact page or mailto
  const contactPath = "/contact";
  if (
    typeof window !== "undefined" && window.location?.pathname !== contactPath
  ) {
    window.location.href = contactPath;
  }
}
