import { create } from 'zustand';

/**
 * Global Dashboard Store
 *
 * Manages the active stock ticker that is shared between the
 * Center Panel (chart/data) and the Right Panel (AI Chatbot).
 * This single source of truth replaces the need for prop-drilling
 * or custom events between sibling panels.
 */
const useDashboardStore = create((set) => ({
  // ─── State ────────────────────────────────────────────────────────────────
  /** The currently active stock ticker symbol (e.g. "AAPL", "TSLA"). */
  activeTicker: null,

  // ─── Actions ──────────────────────────────────────────────────────────────
  /**
   * Set the active ticker. Normalizes to uppercase before storing.
   * @param {string} ticker - The stock ticker symbol to activate.
   */
  setActiveTicker: (ticker) =>
    set({ activeTicker: ticker ? ticker.toUpperCase() : null }),
}));

export default useDashboardStore;
