import { mockStocks, mockSearchIndex } from '../mocks/stockMock';
import api from './api';
import { delay, formatRelativeTime, mapSentimentLabel, computeSentimentPercentages, deriveAIInsights, deriveTrend } from './utils';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

class StockService {
  /**
   * getStockDetail — Fetches comprehensive stock data for the Dashboard.
   *
   * In real API mode, orchestrates 4 parallel requests:
   *   1. GET /stocks/quote/:ticker    → price data
   *   2. GET /stocks/history/:ticker  → chart data (30-day OHLCV)
   *   3. GET /stocks/indicators/:ticker → RSI-14 & trend_status
   *   4. GET /news/:ticker            → news articles
   *
   * Results are merged into a single object matching the shape expected
   * by all Dashboard card components (StockChartCard, SentimentAnalysisCard,
   * MarketNewsCard, AIInsightCard, RiskAnalysisCard, WarningBanner).
   */
  async getStockDetail(ticker) {
    if (USE_MOCK) {
      await delay(800);
      const upperTicker = ticker.toUpperCase();
      const stock = mockStocks[upperTicker];
      
      if (!stock) {
        throw new Error(`Stock data for ${upperTicker} is not available for analysis.`);
      }
      return stock;
    }

    // ─── Real API Mode ──────────────────────────────────────────────────
    const upperTicker = ticker.toUpperCase();

    // Fire requests in parallel using Promise.allSettled for resilience.
    // NOTE: /stocks/history is fetched directly by StockChartCard via Zustand.
    // NOTE: /news is not available on this backend — news array stays empty.
    const [quoteResult, indicatorsResult] = await Promise.allSettled([
      api.get(`/stocks/quote/${upperTicker}`),
      api.get(`/stocks/indicators/${upperTicker}`),
    ]);

    // ── Quote (required — if this fails, we can't show anything meaningful) ──
    if (quoteResult.status === 'rejected') {
      const errMsg = quoteResult.reason?.response?.data?.message || quoteResult.reason?.message;
      throw new Error(errMsg || `Failed to fetch quote for ${upperTicker}.`);
    }

    const quote = quoteResult.value.data.data;

    // ── Indicators (optional — RSI cards will show "N/A" if unavailable) ────
    let rsi14 = null;
    let trendStatus = null;
    if (indicatorsResult.status === 'fulfilled' && indicatorsResult.value.data?.data) {
      const indicators = indicatorsResult.value.data.data;
      rsi14 = indicators.rsi_14;
      trendStatus = indicators.trend_status;
    }

    // ── News — endpoint not available, default to empty ────────────────────
    const news = [];

    // ── Compute aggregated sentiment from individual articles ────────────────
    const sentiment = computeSentimentPercentages(news);

    // ── Derive trend direction from changePercent and trendStatus ────────────
    const trend = deriveTrend(quote.changePercent, trendStatus);

    // ── Derive price change (absolute) from currentPrice and changePercent ───
    const priceChange = quote.currentPrice && quote.changePercent
      ? (quote.currentPrice * quote.changePercent) / (100 + quote.changePercent)
      : 0;

    // ── Build the unified stock data object ──────────────────────────────────
    return {
      ticker: quote.ticker || upperTicker,
      name: quote.companyName || upperTicker,
      currentPrice: quote.currentPrice ?? 0,
      priceChange: priceChange,
      percentChange: quote.changePercent ?? 0,
      trend: trend,
      chartData: [],   // StockChartCard now self-fetches via /stocks/history
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

  /**
   * searchStocks — Powers the Navbar autocomplete.
   *
   * In real API mode:
   *   GET /stocks/search?q=<query>
   *   Returns: { symbol, shortname } → mapped to { ticker, name }
   */
  async searchStocks(query) {
    if (USE_MOCK) {
      await delay(200);
      const lowerQuery = query.toLowerCase();
      return mockSearchIndex.filter(stock => 
        stock.ticker.toLowerCase().includes(lowerQuery) || 
        stock.name.toLowerCase().includes(lowerQuery)
      );
    }

    // ─── Real API Mode ──────────────────────────────────────────────────
    const response = await api.get('/stocks/search', { params: { q: query } });
    const results = response.data?.data || [];

    return results.map((item) => ({
      ticker: item.symbol,
      name: item.shortname || item.symbol,
    }));
  }
}

export const stockService = new StockService();
