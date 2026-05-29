# InvestSense AI

InvestSense AI is a web-based decision support system built as a Capstone Project for the MBKM program. It is designed to help beginner investors make rational stock investment decisions by stripping away speculative noise and neutralizing cognitive biases (like FOMO). 

The platform integrates traditional technical analysis (RSI, price trends) with AI-driven market sentiment analysis to provide a balanced and data-driven perspective on the stock market.

## Key Features

- **Technical Analysis Dashboard**: Real-time stock quotes, candlestick charts, and RSI indicators.
- **AI Assistant**: An integrated side panel that provides contextual explanations and personalized investment insights without leaving the workspace.
- **Market Insight**: A dedicated macro-level overview displaying aggregated market sentiment, trending news, and anti-FOMO radars (Overbought/Oversold alerts).
- **Reality Check Mechanisms**: Intercepts impulsive actions and encourages users to evaluate their decisions logically before adding stocks to their watchlist.
- **Cold Surgical Design System**: A strictly defined UI/UX focusing on typography and grid systems, avoiding the generic "glowing AI SaaS" aesthetics.

## Tech Stack

This repository contains the **Frontend** of the application.

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Internationalization**: i18next (ID/EN)

## Project Structure

```text
src/
├── components/      # Reusable UI components and complex widgets (Charts, AI Panel)
├── context/         # React Context providers (AuthContext)
├── hooks/           # Custom React hooks (useDebounce, useOnClickOutside)
├── i18n/            # Localization files and configurations
├── layouts/         # Page layouts (DashboardLayout)
├── pages/           # Main route components (Dashboard, MarketInsight, Watchlist)
├── services/        # API integration and utility functions
└── store/           # Zustand global state (useDashboardStore)
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ricoaldy-e/investsense-ai.git
   cd investsense-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and configure the API endpoint:
   ```env
   VITE_API_BASE_URL=https://investsense-ai-investsense-backend.hf.space/api/v1
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Status

**Currently in development.** 
This is the frontend implementation for the MBKM Capstone Project. The backend repository and API endpoints are hosted separately.

---
*InvestSense AI — helping you invest based on data, not emotion.*