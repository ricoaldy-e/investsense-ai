import api from './api';
import i18n from '../i18n/i18n';
import { delay, formatRelativeTime, mapSentimentLabel, computeSentimentPercentages, deriveAIInsights, deriveTrend } from './utils';

class StockService {
  async getStockDetail(ticker) {
    const upperTicker = ticker.toUpperCase();

    const [quoteResult, indicatorsResult] = await Promise.allSettled([
      api.get(`/stocks/quote/${upperTicker}`),
      api.get(`/stocks/indicators/${upperTicker}`),
    ]);

    if (quoteResult.status === 'rejected') {
      const errResponse = quoteResult.reason?.response;
      if (errResponse?.status === 404) {
        throw new Error('Saham tidak ditemukan atau belum didukung oleh sistem.');
      }
      const errMsg = errResponse?.data?.message || quoteResult.reason?.message;
      throw new Error(errMsg || i18n.t('service.failed_fetch_quote', { ticker: upperTicker }));
    }

    const quote = quoteResult.value.data.data;

    let rsi14 = null;
    let trendStatus = null;
    if (indicatorsResult.status === 'fulfilled' && indicatorsResult.value.data?.data) {
      const indicators = indicatorsResult.value.data.data;
      rsi14 = indicators.rsi_14;
      trendStatus = indicators.trend_status;
    }

    const news = [];
    const sentiment = computeSentimentPercentages(news);

    const currentPrice = quote.current_price ?? quote.currentPrice ?? 0;
    const changePercent = quote.change_percent ?? quote.changePercent ?? 0;
    const companyName = quote.company_name ?? quote.companyName ?? upperTicker;

    const trend = deriveTrend(changePercent, trendStatus);

    const priceChange = currentPrice && changePercent
      ? (currentPrice * changePercent) / (100 + changePercent)
      : 0;

    return {
      ticker: quote.ticker || upperTicker,
      name: companyName,
      currentPrice: currentPrice,
      priceChange: priceChange,
      percentChange: changePercent,
      trend: trend,
      chartData: [],
      metrics: {
        rsi14: rsi14,
        volatility: null,
        peRatio: null,
      },
      sentiment: sentiment,
      aiInsights: deriveAIInsights(rsi14, trendStatus, upperTicker),
      news: news,
      currency: quote.currency,
      marketState: quote.marketState,
    };
  }

  async searchStocks(query) {
    const response = await api.get('/stocks/search', { params: { q: query } });
    const results = response.data?.data || [];

    return results.map((item) => ({
      ticker: item.symbol,
      name: item.shortname || item.symbol,
    }));
  }
}

export const stockService = new StockService();
