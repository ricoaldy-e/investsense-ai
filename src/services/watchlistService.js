import api from './api';

/**
 * watchlistService — Manages the user's stock watchlist.
 *
 * Integrates with BE endpoints:
 *   GET    /api/v1/watchlist           → fetch all watchlist items
 *   POST   /api/v1/watchlist           → add ticker to watchlist
 *   DELETE /api/v1/watchlist/:ticker   → remove ticker from watchlist
 *
 * All endpoints are protected (require Bearer token).
 */

class WatchlistService {
  /**
   * Fetch all tickers in the authenticated user's watchlist.
   *
   * BE Response: { success, source, data: [{ id, ticker, added_at }] }
   *
   * @returns {Promise<Array<{ id: string, ticker: string, added_at: string }>>}
   */
  async getWatchlist() {
    const response = await api.get('/watchlist');
    return response.data?.data || [];
  }

  /**
   * Add a ticker to the authenticated user's watchlist.
   *
   * BE Request: POST /watchlist  Body: { ticker: string }
   * BE Response: { success, data: { id, ticker, added_at } }
   *
   * @param {string} ticker - Stock ticker to add (e.g. "BBCA.JK", "AAPL")
   * @returns {Promise<{ id: string, ticker: string, added_at: string }>}
   */
  async addToWatchlist(ticker) {
    const response = await api.post('/watchlist', { ticker: ticker.toUpperCase() });
    return response.data?.data;
  }

  /**
   * Remove a specific ticker from the authenticated user's watchlist.
   *
   * BE Request: DELETE /watchlist/:ticker
   * BE Response: { success, message }
   *
   * @param {string} ticker - Stock ticker to remove
   * @returns {Promise<void>}
   */
  async removeFromWatchlist(ticker) {
    await api.delete(`/watchlist/${ticker.toUpperCase()}`);
  }
}

export const watchlistService = new WatchlistService();
