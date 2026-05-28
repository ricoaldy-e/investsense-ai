# InvestSense AI — Market Insight (Backend Documentation)

This document defines the data structures and API requirements for the newly revamped **Market Insight (Anti-FOMO Radar)** page.

## 1. Page Philosophy (Anti-FOMO Radar)
The Market Insight page has pivoted from a generic "Global Dashboard" to a highly actionable **Anti-FOMO Radar**. It scans the entire Indonesian stock market (IHSG) to find stocks that are statistically over-extended based on their 14-day RSI (Relative Strength Index).

The goal is to warn users when the market is too greedy (Overbought) and alert them when the market is panicking (Oversold).

---

## 2. Required API Endpoint

### `GET /api/v1/market-insight/radar`

**Description:**
Returns a curated list of extreme stocks based on technical indicators (RSI) across the entire tracked market. This endpoint should ideally be calculated via a batch cron job (e.g., at 20:00 WIB daily) rather than calculated on-the-fly to ensure fast response times.

**Response Structure (JSON):**

```json
{
  "status": "success",
  "data": {
    "lastUpdated": "2026-05-28T20:00:00Z",
    "overbought": [
      {
        "ticker": "BBCA",
        "name": "Bank Central Asia Tbk.",
        "price": 10500,
        "change": 1.5,
        "rsi": 78.5
      },
      // ... max 5 items
    ],
    "oversold": [
      {
        "ticker": "GOTO",
        "name": "GoTo Gojek Tokopedia Tbk.",
        "price": 50,
        "change": -2.5,
        "rsi": 22.1
      },
      // ... max 5 items
    ]
  }
}
```

### 3. Business Logic Requirements

#### A. Overbought Array (Risiko Koreksi Tinggi)
- **Condition:** Stocks with `RSI_14 >= 70`.
- **Sorting:** Descending by RSI (highest RSI at the top).
- **Limit:** Top 5 stocks max.
- **Frontend Usage:** Displayed in the red/danger section to warn users of high FOMO risk.

#### B. Oversold Array (Potensi Rebound)
- **Condition:** Stocks with `RSI_14 <= 30`.
- **Sorting:** Ascending by RSI (lowest RSI at the top).
- **Limit:** Top 5 stocks max.
- **Frontend Usage:** Displayed in the green/success section to highlight potential discount opportunities.

#### C. Market News (Existing)
- The right column continues to use the existing `/api/v1/news/search?keyword=IHSG` endpoint to fetch general market news and sentiment. No changes required here.

---

## 4. Frontend Integration Note
Currently, the frontend (`src/pages/MarketInsight.jsx`) is using hardcoded `mockOverbought` and `mockOversold` data arrays. 

Once this endpoint is live, the Frontend team will replace the mock variables with an axios call to `api.get('/market-insight/radar')`.
