# InvestSense AI — Market Insight Page Design Specification

This document defines the layout, behavior, and data structure for the new Market Insight page (`/market-insight`).

---

## 1. Page Purpose
While the **Dashboard** focuses on analyzing a *specific individual stock* (Mikro), the **Market Insight** page focuses on the *overall market conditions* (Makro). It gives the user a bird's-eye view of the financial world before they dive into specific stocks.

---

## 2. Layout Structure

The page will use a CSS Grid layout, similar to the Dashboard, to maintain consistency.

```text
┌──────────────────────────────────────────────────────────────┐
│  Page Header: "MARKET INSIGHT"                               │
│  Data as of: [Current Time]                                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────────────────┐ ┌───────────────────────────────┐ │
│  │                       │ │                               │ │
│  │  1. Global Indices    │ │   3. Top Market News          │ │
│  │  (IHSG, S&P500, etc)  │ │   (List of headlines with     │ │
│  │                       │ │    sentiment tags)            │ │
│  └───────────────────────┘ │                               │ │
│  ┌───────────────────────┐ │                               │ │
│  │                       │ │                               │ │
│  │  2. Sector            │ │                               │ │
│  │     Performance       │ │                               │ │
│  │  (Banking, Tech, etc) │ │                               │ │
│  │                       │ │                               │ │
│  └───────────────────────┘ └───────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Core Components

### 3.1 Global Indices Card (Top Left)
- **Title**: `GLOBAL MARKETS`
- **Content**: A grid or list showing major indices.
- **Mock Data needed**: 
  - IDX Composite (IHSG): 7,200 (+0.4%)
  - S&P 500: 5,100 (-0.1%)
  - Nikkei 225: 39,000 (+1.2%)
- **Visuals**: Green for positive, Red for negative (using `text-success` and `text-danger`).

### 3.2 Sector Performance Card (Bottom Left)
- **Title**: `SECTOR MOVERS`
- **Content**: Shows which industry sectors are leading or lagging today.
- **Mock Data needed**:
  - Financials (Banking): +1.5% (Leading)
  - Consumer Goods: +0.2% (Neutral)
  - Technology: -0.8% (Lagging)
- **Visuals**: Simple horizontal progress bars or just numbers formatted cleanly.

### 3.3 Top Market News Card (Right Column)
- **Title**: `MARKET HEADLINES`
- **Content**: A curated feed of the latest financial news affecting the market.
- **Data Structure**:
  - Headline Title
  - Timestamp (e.g., "2 hours ago")
  - Source (e.g., "Bloomberg", "CNBC")
  - Sentiment Tag: A small pill/badge indicating if the news is `Bullish`, `Bearish`, or `Neutral`.

---

## 4. Design Guidelines (Cold Surgical)
- Must follow `DESIGN.md` strictly.
- **Cards**: `bg-card-dark`, `border-card-border`, `rounded-none`, no shadows.
- **Typography**: 
  - Card Titles: `font-display uppercase tracking-[2px] text-text-muted`
  - Numbers/Tickers: `font-mono`
  - News Titles: `font-body text-text-main`
- **Responsiveness**: On mobile, the grid collapses into a single column (Indices -> Sectors -> News).

---

## 5. Implementation Strategy (For Next Chat)
Since we don't have a backend yet, the `MarketInsight.jsx` page will initially use **hardcoded mock data** directly inside the file (similar to how `Dashboard` currently mocks data when no backend is present). This allows us to build the UI perfectly first.
