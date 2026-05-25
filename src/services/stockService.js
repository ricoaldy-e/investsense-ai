import { mockStocks, mockSearchIndex } from '../mocks/stockMock';
import api from './api';
import { delay } from './utils';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

class StockService {
  async getStockDetail(ticker) {
    if (USE_MOCK) {
      await delay(800); // Simulasi koneksi lambat agar loading skeleton terlihat
      const upperTicker = ticker.toUpperCase();
      const stock = mockStocks[upperTicker];
      
      if (!stock) {
        throw new Error(`Stock data for ${upperTicker} is not available for analysis.`);
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
      await delay(200); // Simulasi pencarian cepat
      const lowerQuery = query.toLowerCase();
      return mockSearchIndex.filter(stock => 
        stock.ticker.toLowerCase().includes(lowerQuery) || 
        stock.name.toLowerCase().includes(lowerQuery)
      );
    } else {
      // Future integration with Real API
      // const response = await api.get(`/stocks/search?q=${query}`);
      // return response.data;
      throw new Error("Real API not implemented yet");
    }
  }
}

export const stockService = new StockService();
