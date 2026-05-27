import { mockStocks, mockSearchIndex } from '../mocks/stockMock';
import api from './api';
import i18n from '../i18n/i18n';
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
        throw new Error(i18n.t('service.stock_not_available', { ticker: upperTicker }));
      }
      return stock;
    }

    // ─── Real API Mode ──────────────────────────────────────────────────
    const upperTicker = ticker.toUpperCase();

    // Fire all 4 requests in parallel using Promise.allSettled for resilience.
    // If one endpoint fails (e.g. no news yet), we still show what we have.
    const [quoteResult, historyResult, indicatorsResult, newsResult] = await Promise.allSettled([
      api.get(`/stocks/quote/${upperTicker}`),
      api.get(`/stocks/history/${upperTicker}`),
      api.get(`/stocks/indicators/${upperTicker}`),
      api.get(`/news/${upperTicker}`),
    ]);

    // ── Quote (required — if this fails, we can't show anything meaningful) ──
    if (quoteResult.status === 'rejected') {
      const errMsg = quoteResult.reason?.response?.data?.message || quoteResult.reason?.message;
      throw new Error(errMsg || i18n.t('service.failed_fetch_quote', { ticker: upperTicker }));
    }

    const quote = quoteResult.value.data.data;

    // ── History (optional — chart will be empty if unavailable) ──────────────
    let chartData = [];
    if (historyResult.status === 'fulfilled' && historyResult.value.data?.data) {
      chartData = historyResult.value.data.data.map((point) => ({
        time: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: point.close,
        // Preserve full OHLCV for Pro mode tooltip
        open: point.open,
        high: point.high,
        low: point.low,
        volume: point.volume,
        rawDate: point.date,
      }));
    }

    // ── Indicators (optional — RSI cards will show "N/A" if unavailable) ────
    let rsi14 = null;
    let trendStatus = null;
    if (indicatorsResult.status === 'fulfilled' && indicatorsResult.value.data?.data) {
      const indicators = indicatorsResult.value.data.data;
      rsi14 = indicators.rsi_14;
      trendStatus = indicators.trend_status;
    }

    // ── News (optional — news card will show "No news available") ────────────
    let news = [];
    if (newsResult.status === 'fulfilled' && newsResult.value.data?.data) {
      news = newsResult.value.data.data.map((article) => ({
        id: article.id,
        source: article.source_name || 'Unknown',
        title: article.title,
        sentiment: mapSentimentLabel(article.sentiment_label),
        time: formatRelativeTime(article.published_at),
        url: article.url,
        description: article.description,
      }));
    }

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
      chartData: chartData,
      metrics: {
        rsi14: rsi14,
        volatility: null,  // Not available from BE — skipped per plan
        peRatio: null,     // Not available from BE — skipped per plan
      },
      sentiment: sentiment,
      aiInsights: deriveAIInsights(rsi14, trendStatus, upperTicker),
      news: news,
      // Extra metadata from BE
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
