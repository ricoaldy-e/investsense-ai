// src/mocks/stockMock.js

export const mockStocks = {
  "AAPL": {
    ticker: "AAPL",
    name: "Apple Inc.",
    currentPrice: 173.50,
    priceChange: 2.30,
    percentChange: 1.34,
    trend: "up",
    chartData: [
      { time: "09:30", price: 171.20 },
      { time: "10:30", price: 172.50 },
      { time: "11:30", price: 171.80 },
      { time: "12:30", price: 173.10 },
      { time: "13:30", price: 172.90 },
      { time: "14:30", price: 173.80 },
      { time: "15:30", price: 173.50 }
    ],
    metrics: {
      rsi14: 65.4,
      volatility: "Medium",
      peRatio: 28.5
    },
    sentiment: {
      positive: 65,
      neutral: 25,
      negative: 10
    },
    aiInsights: {
      observation: "AAPL is showing steady upward momentum driven by recent product announcements. RSI indicates it is approaching overbought territory but remains stable.",
      suggestedPlan: "Hold existing positions. Wait for a minor pullback before adding to the portfolio.",
      antiFomoWarning: "Do not buy simply because of the current green streak. The tech sector is highly sensitive to upcoming macroeconomic data."
    },
    news: [
      { id: 1, source: "Financial Times", title: "Apple's supply chain diversifies further into Southeast Asia", sentiment: "positive", time: "2 hours ago" },
      { id: 2, source: "Bloomberg", title: "Tech stocks rally as inflation fears ease slightly", sentiment: "neutral", time: "5 hours ago" },
      { id: 3, source: "Reuters", title: "Apple announces record services revenue amid hardware slowdown", sentiment: "positive", time: "8 hours ago" },
      { id: 4, source: "CNBC", title: "Analysts raise AAPL price targets following strong earnings beat", sentiment: "positive", time: "1 day ago" },
      { id: 5, source: "Wall Street Journal", title: "Regulatory pressure mounts on Big Tech in European markets", sentiment: "negative", time: "1 day ago" }
    ]
  },
  "TSLA": {
    ticker: "TSLA",
    name: "Tesla Inc.",
    currentPrice: 175.22,
    priceChange: -5.40,
    percentChange: -2.99,
    trend: "down",
    chartData: [
      { time: "09:30", price: 180.50 },
      { time: "10:30", price: 178.20 },
      { time: "11:30", price: 179.10 },
      { time: "12:30", price: 176.50 },
      { time: "13:30", price: 174.90 },
      { time: "14:30", price: 175.80 },
      { time: "15:30", price: 175.22 }
    ],
    metrics: {
      rsi14: 32.1,
      volatility: "High",
      peRatio: 42.1
    },
    sentiment: {
      positive: 20,
      neutral: 30,
      negative: 50
    },
    aiInsights: {
      observation: "TSLA is experiencing significant downward pressure due to lower delivery reports. RSI suggests the stock is currently oversold.",
      suggestedPlan: "Monitor closely. High volatility implies potential for quick rebounds, but fundamental risks remain.",
      antiFomoWarning: "Catching a falling knife is dangerous. Do not rush to 'buy the dip' without clear signs of a reversal pattern."
    },
    news: [
      { id: 1, source: "Reuters", title: "Tesla cuts vehicle prices in key European markets", sentiment: "negative", time: "1 hour ago" },
      { id: 2, source: "CNBC", title: "EV sector faces margin pressures amidst price war", sentiment: "negative", time: "3 hours ago" },
      { id: 3, source: "Bloomberg", title: "Tesla's Megapack energy storage business shows strong growth trajectory", sentiment: "positive", time: "6 hours ago" },
      { id: 4, source: "Financial Times", title: "Global EV adoption accelerates despite economic uncertainty", sentiment: "neutral", time: "12 hours ago" },
      { id: 5, source: "Wall Street Journal", title: "Autonomous driving regulation tightens across major markets", sentiment: "negative", time: "1 day ago" }
    ]
  }
};

/**
 * Search index — lightweight entries for stocks that appear in search
 * but may not have full dashboard analysis data yet.
 * 
 * stockService.searchStocks() uses this combined with mockStocks
 * to return autocomplete results.
 */
export const mockSearchIndex = [
  { ticker: "AAPL", name: "Apple Inc." },
  { ticker: "TSLA", name: "Tesla Inc." },
  { ticker: "MSFT", name: "Microsoft Corp." },
  { ticker: "BBCA.JK", name: "Bank Central Asia Tbk" },
  { ticker: "GOTO.JK", name: "GoTo Gojek Tokopedia" }
];

