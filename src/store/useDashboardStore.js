import { create } from 'zustand';

const useDashboardStore = create((set) => ({
  activeTicker: null,
  setActiveTicker: (ticker) =>
    set({ activeTicker: ticker ? ticker.toUpperCase() : null }),
}));

export default useDashboardStore;
