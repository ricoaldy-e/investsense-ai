import { mockStocks } from './mockData';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

class StockService {
  async getStockDetail(ticker) {
    if (USE_MOCK) {
      await delay(800); // Simulasi koneksi lambat agar loading skeleton terlihat
      const upperTicker = ticker.toUpperCase();
      const stock = mockStocks[upperTicker];
      
      if (!stock) {
        throw new Error(`Stock data for ${upperTicker} not found.`);
      }
      return stock;
    } else {
      // Future integration with Real API
      // const response = await api.get(`/stocks/${ticker}`);
      // return response.data;
      throw new Error("Real API not implemented yet");
    }
  }

  async searchStocks(query) {
    if (USE_MOCK) {
      await delay(400); // Simulasi pencarian cepat
      const lowerQuery = query.toLowerCase();
      // Filter mockStocks based on ticker or name
      const results = Object.values(mockStocks).filter(stock => 
        stock.ticker.toLowerCase().includes(lowerQuery) || 
        stock.name.toLowerCase().includes(lowerQuery)
      );
      return results;
    } else {
      throw new Error("Real API not implemented yet");
    }
  }
}

export const stockService = new StockService();
