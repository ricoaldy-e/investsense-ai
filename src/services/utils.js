// src/services/utils.js
// Shared utilities for service layer — mock simulation and data transformation.

/**
 * Simulate network delay for mock API mode.
 * Will become unused once real backend is fully connected.
 * @param {number} ms - Milliseconds to delay
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Convert an ISO timestamp (or date string) into a human-readable relative time.
 * Examples: "2 hours ago", "1 day ago", "just now"
 *
 * @param {string} isoString - ISO 8601 timestamp from BE (e.g. "2026-05-24T10:00:00Z")
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (isoString) => {
  if (!isoString) return 'Unknown';

  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now - then;

  if (diffMs < 0) return 'just now'; // Future date edge case

  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Map BE sentiment label (Indonesian) to FE sentiment key (English lowercase).
 *
 * BE returns: "Positif" | "Negatif" | "Netral" | null
 * FE expects: "positive" | "negative" | "neutral"
 *
 * @param {string|null} label - Sentiment label from BE
 * @returns {string} Mapped sentiment string
 */
export const mapSentimentLabel = (label) => {
  if (!label) return 'neutral';
  const normalized = label.toLowerCase().trim();
  if (normalized === 'positif') return 'positive';
  if (normalized === 'negatif') return 'negative';
  return 'neutral';
};

/**
 * Compute aggregated sentiment percentages from an array of news articles.
 *
 * BE provides per-article sentiment. FE SentimentAnalysisCard expects:
 *   { positive: number, neutral: number, negative: number }
 * where values are percentages summing to 100.
 *
 * @param {Array<{sentiment: string}>} newsItems - News items with mapped sentiment
 * @returns {{ positive: number, neutral: number, negative: number }}
 */
export const computeSentimentPercentages = (newsItems) => {
  if (!newsItems || newsItems.length === 0) {
    return { positive: 0, neutral: 100, negative: 0 };
  }

  let pos = 0, neu = 0, neg = 0;
  for (const item of newsItems) {
    if (item.sentiment === 'positive') pos++;
    else if (item.sentiment === 'negative') neg++;
    else neu++;
  }

  const total = newsItems.length;
  return {
    positive: Math.round((pos / total) * 100),
    neutral: Math.round((neu / total) * 100),
    negative: Math.round((neg / total) * 100),
  };
};

/**
 * Derive a trend direction string from changePercent and BE trend_status.
 *
 * Priority:
 *   1. If BE provides trend_status → map "Overbought"→"up", "Oversold"→"down", "Neutral"→"sideways"
 *   2. Fallback to changePercent sign
 *
 * @param {number|null} changePercent - Daily change percentage
 * @param {string|null} trendStatus - BE trend_status field
 * @returns {"up"|"down"|"sideways"}
 */
export const deriveTrend = (changePercent, trendStatus) => {
  // Use trend_status from BE indicators if available
  if (trendStatus) {
    const lower = trendStatus.toLowerCase();
    if (lower === 'overbought') return 'up';
    if (lower === 'oversold') return 'down';
    // "Neutral" → check changePercent for nuance
  }

  // Fallback to price change direction
  if (changePercent == null) return 'sideways';
  if (changePercent > 0.5) return 'up';
  if (changePercent < -0.5) return 'down';
  return 'sideways';
};

/**
 * Generate rule-based AI insight text from RSI and trend data.
 *
 * The BE does not have a dedicated "AI insights" endpoint per stock.
 * These are generated client-side from the RSI-14 value and trend_status
 * provided by the indicators endpoint. They serve as placeholder text
 * until the user interacts with the AI chatbot for deeper analysis.
 *
 * @param {number|null} rsi - RSI-14 value
 * @param {string|null} trendStatus - BE trend_status ("Overbought"/"Oversold"/"Neutral")
 * @param {string} ticker - Stock ticker symbol
 * @returns {{ observation: string, suggestedPlan: string, antiFomoWarning: string }}
 */
export const deriveAIInsights = (rsi, trendStatus, ticker) => {
  // Default when no data is available
  if (rsi == null) {
    return {
      observation: `Technical indicator data for ${ticker} is currently being processed. Check back shortly for updated analysis.`,
      suggestedPlan: 'Use the AI Assistant panel to ask for a detailed analysis of this stock.',
      antiFomoWarning: 'Always conduct thorough research before making any investment decisions. Past performance does not guarantee future results.',
    };
  }

  let observation, suggestedPlan, antiFomoWarning;

  if (rsi >= 70) {
    observation = `${ticker} shows an RSI of ${rsi.toFixed(1)}, indicating overbought conditions. The stock has experienced significant recent buying pressure, and the current price may reflect a short-term premium.`;
    suggestedPlan = `Consider monitoring for a consolidation or pullback phase before initiating new positions. If you already hold this stock, evaluate setting trailing stops to protect gains.`;
    antiFomoWarning = `Avoid chasing the price at elevated RSI levels. Buying into overbought momentum carries increased risk of mean reversion.`;
  } else if (rsi <= 30) {
    observation = `${ticker} has an RSI of ${rsi.toFixed(1)}, signaling oversold conditions. The stock has experienced heavy selling pressure and may be undervalued relative to recent price history.`;
    suggestedPlan = `Watch for reversal signals and volume confirmation before entering. An oversold condition does not automatically mean a rebound is imminent.`;
    antiFomoWarning = `Catching a falling knife is risky. Ensure the selling pressure has stabilized and fundamentals support the thesis before committing capital.`;
  } else {
    const trendLabel = trendStatus || 'Neutral';
    observation = `${ticker} displays an RSI of ${rsi.toFixed(1)} within the neutral range. Trend status: ${trendLabel}. No extreme momentum signals are present at this time.`;
    suggestedPlan = `This is a stable zone for evaluation. Use the AI Assistant to explore news sentiment and macroeconomic factors before making a decision.`;
    antiFomoWarning = `Even in calm markets, remain disciplined with your allocation strategy. Avoid making impulsive decisions based on short-term noise.`;
  }

  return { observation, suggestedPlan, antiFomoWarning };
};

/**
 * getNewsKeyword — Maps a stock ticker to a human-friendly search term for news.
 *
 * Problem: Raw tickers (e.g. "GOTO.JK") yield zero results on news portals.
 * Solution: A curated dictionary maps known tickers to meaningful search phrases.
 *           Unknown tickers fall back to the base symbol (stripped of exchange suffix).
 *
 * @param {string} ticker - Stock ticker (e.g. "GOTO.JK", "AAPL")
 * @returns {string} A search keyword suitable for GET /news/search?keyword=
 */
export const getNewsKeyword = (ticker) => {
  if (!ticker) return '';

  const upper = ticker.toUpperCase();

  // ─── Indonesian IDX stocks ─────────────────────────────────────────────────
  const dictionary = {
    // Big caps
    'GOTO.JK':  'GoTo OR Gojek OR Tokopedia',
    'TLKM.JK':  'Telkom Indonesia OR IndiHome OR TelkomSel',
    'BBCA.JK':  'Bank BCA OR BCA',
    'BBRI.JK':  'Bank BRI OR BRI',
    'BMRI.JK':  'Bank Mandiri',
    'ASII.JK':  'Astra International',
    'UNVR.JK':  'Unilever Indonesia',
    'ICBP.JK':  'Indofood CBP',
    'INDF.JK':  'Indofood',
    'KLBF.JK':  'Kalbe Farma',
    'PTBA.JK':  'Bukit Asam',
    'ADRO.JK':  'Adaro Energy',
    'MDKA.JK':  'Merdeka Copper Gold',
    'ANTM.JK':  'Aneka Tambang OR ANTAM',
    'SMGR.JK':  'Semen Indonesia',
    'PGAS.JK':  'Perusahaan Gas Negara OR PGN',
    'JSMR.JK':  'Jasa Marga',
    'BSDE.JK':  'Bumi Serpong Damai',
    'CPIN.JK':  'Charoen Pokphand Indonesia',
    'EXCL.JK':  'XL Axiata',
    'ISAT.JK':  'Indosat Ooredoo',
    'INCO.JK':  'Vale Indonesia',
    'MEDC.JK':  'Medco Energi',
    'LPKR.JK':  'Lippo Karawaci',
    'WSKT.JK':  'Waskita Karya',
    'WTON.JK':  'Wijaya Karya Beton',
    'BBNI.JK':  'Bank BNI OR BNI',
    'BRPT.JK':  'Barito Pacific',
    'BUKA.JK':  'Bukalapak',
    'EMTK.JK':  'Elang Mahkota Teknologi',

    // ─── US / Global blue chips ─────────────────────────────────────────────
    'AAPL':   'Apple',
    'MSFT':   'Microsoft',
    'GOOGL':  'Google OR Alphabet',
    'GOOG':   'Google OR Alphabet',
    'AMZN':   'Amazon',
    'META':   'Meta OR Facebook',
    'TSLA':   'Tesla',
    'NVDA':   'Nvidia',
    'NFLX':   'Netflix',
    'AMD':    'AMD OR Advanced Micro Devices',
    'INTC':   'Intel',
    'JPM':    'JPMorgan',
    'BAC':    'Bank of America',
    'GS':     'Goldman Sachs',
    'BABA':   'Alibaba',
    'TSM':    'TSMC OR Taiwan Semiconductor',
  };

  if (dictionary[upper]) return dictionary[upper];

  // ─── Fallback: strip exchange suffix (.JK, .US, .L, etc.) ────────────────
  const base = upper.split('.')[0];
  return base;
};
