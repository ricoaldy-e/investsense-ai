import api from './api';

class WatchlistService {
  async getWatchlist() {
    const response = await api.get('/watchlist');
    return response.data?.data || [];
  }

  async addToWatchlist(ticker) {
    const response = await api.post('/watchlist', { ticker: ticker.toUpperCase() });
    return response.data?.data;
  }

  async removeFromWatchlist(ticker) {
    await api.delete(`/watchlist/${ticker.toUpperCase()}`);
  }
}

export const watchlistService = new WatchlistService();
