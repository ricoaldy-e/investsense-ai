# Software Requirements Specification (SRS)
# InvestSense AI

Version: 1.0  
Project Type: AI-Powered Investment Decision Support Platform

---

# 1. Introduction

## 1.1 Purpose

InvestSense AI is a web-based AI-powered investment decision support platform designed to help beginner investors make more rational and informed stock-related decisions.

The platform combines:
- technical analysis
- AI-powered sentiment analysis
- market insight interpretation
- anti-FOMO behavioral guidance

to reduce impulsive investing behavior and improve financial understanding.

---

## 1.2 Scope

InvestSense AI is NOT a stock trading platform.

The platform does NOT:
- execute stock transactions
- provide brokerage services
- manage investment portfolios
- perform automated trading
- connect to stock exchanges

Instead, the platform focuses on:
- stock analysis
- market sentiment insights
- AI-generated explanations
- educational financial guidance
- rational decision support

---

## 1.3 Target Users

Primary users:
- beginner investors
- users with limited financial literacy
- users seeking rational investment guidance

Secondary users:
- users interested in AI-assisted market analysis
- users seeking sentiment-based investment insights

---

## 1.4 Goals

The primary goals of InvestSense AI are:
- reduce FOMO-based investing behavior
- simplify stock analysis
- improve financial understanding
- provide beginner-friendly AI insights
- support rational investment thinking

---

# 2. System Overview

## 2.1 System Architecture

Frontend:
- React (Vite)
- Tailwind CSS
- React Router DOM

Backend:
- Express.js
- PostgreSQL

AI Services:
- FastAPI
- Machine Learning Models
- Sentiment Analysis Engine

---

## 2.2 Main Features

Core system features:
- Landing Page
- Authentication System
- AI Investment Dashboard
- AI Chatbot Assistant
- Sentiment Analysis
- Technical Indicator Analysis
- Risk Awareness System

---

# 3. Functional Requirements

# 3.1 Landing Page

## Description

The landing page introduces users to the InvestSense AI platform and its AI-powered investment analysis capabilities.

## Features

- Hero section
- Platform overview
- Feature highlights
- AI insight explanation
- Call-to-action buttons
- Responsive layout

## Navigation

Users can navigate to:
- Login Page
- Register Page
- Dashboard Preview

---

# 3.2 Authentication System

## Login

Users can:
- login using email and password

## Register

Users can:
- create an account using:
  - full name
  - email
  - password

## Authentication Restrictions

The platform does NOT require:
- OTP verification
- social login
- phone verification
- KYC verification

---

# 3.3 Dashboard

## Description

The dashboard acts as the primary investment analysis workspace.

## Features

- Market overview
- Stock analysis cards
- Sentiment indicators
- AI-generated insights
- Technical indicator summaries
- Beginner-friendly explanations

## Dashboard Sections

### Sidebar
Contains:
- Dashboard
- Chatbot
- Market Insights
- Settings

### Main Content
Contains:
- Trending stocks
- Sentiment summaries
- AI insight cards
- Technical indicators
- Risk awareness indicators

---

# 3.4 AI Chatbot Assistant

## Description

The chatbot acts as an AI-powered investment analysis assistant.

The chatbot is NOT:
- customer support
- a general-purpose chatbot
- a trading bot
- a stock execution assistant

## Features

Users can:
- ask stock-related questions
- request sentiment analysis
- ask for technical indicator explanations
- receive beginner-friendly investment guidance
- request market summaries

## Suggested Prompts

Examples:
- Analyze BBCA sentiment
- Explain RSI indicator
- Summarize market sentiment
- Explain market volatility
- Analyze stock risk

---

# 3.5 Sentiment Analysis

## Description

The system analyzes financial news and market-related text data to identify sentiment trends.

## Sentiment Categories

The platform provides:
- Positive sentiment
- Neutral sentiment
- Negative sentiment

## Data Sources

Possible data sources:
- financial news articles
- market headlines
- analyzed text datasets

---

# 3.6 Technical Analysis

## Supported Indicators

The platform supports:
- RSI
- MACD
- Trend analysis
- Volatility indicators

## Purpose

Technical indicators are simplified to help beginner users better understand market conditions.

---

# 3.7 Risk Awareness System

## Description

The system provides risk-awareness indicators and anti-FOMO guidance mechanisms.

## Features

The platform may provide:
- volatility warnings
- market caution indicators
- sentiment risk alerts
- rational investment reminders

---

# 3.8 Anti-FOMO Guidance System

## Description

InvestSense AI includes behavioral-awareness mechanisms designed to reduce impulsive investment decisions.

## Features

The platform may display:
- volatility reminders
- sentiment caution indicators
- rational investing prompts
- beginner-friendly risk explanations

## Goal

Encourage users to evaluate investments logically rather than emotionally.

---

# 3.9 Beginner-Friendly Experience

## Description

The platform is designed for users with limited financial knowledge.

## Features

The interface simplifies:
- technical indicators
- financial terminology
- market sentiment explanations
- investment insights

AI responses prioritize:
- clarity
- educational explanations
- simplified analysis

---

# 4. Non-Functional Requirements

# 4.1 Performance

The system should provide:
- responsive UI performance
- smooth navigation
- fast page loading

---

# 4.2 Usability

The platform must:
- be beginner-friendly
- use understandable terminology
- avoid overwhelming interfaces

---

# 4.3 Design Requirements

The UI should feel:
- modern
- analytical
- intelligent
- trustworthy
- professional

Avoid:
- gaming aesthetics
- crypto exchange appearance
- trading terminal behavior

---

# 4.4 Security

Basic security requirements:
- secure authentication
- password protection
- protected API communication

---

# 4.5 Responsiveness

The platform must support:
- desktop
- tablet
- mobile devices

---

# 5. Platform Limitations

InvestSense AI does NOT:
- execute trades
- connect to brokerage systems
- automate investments
- manage user portfolios

The platform functions solely as:
- an analytical assistant
- an educational investment platform
- an AI-powered decision support system

---

# 6. User Roles

# Standard User

Users can:
- register/login
- access dashboard
- use chatbot
- view market insights
- access sentiment analysis
- explore technical indicators

---

# 7. Disclaimer

InvestSense AI is designed as an educational and analytical decision-support platform.

The platform does not provide guaranteed financial advice or trading execution services.

Users remain fully responsible for their investment decisions.

---

# 8. Future Improvements

Possible future features:
- personalized watchlists
- contextual AI memory
- multilingual support
- exportable reports
- advanced AI insight generation

---

# 9. Conclusion

InvestSense AI is an AI-powered investment analysis platform focused on:
- market sentiment analysis
- technical insight explanation
- rational investment guidance
- beginner-friendly financial education

The platform prioritizes:
- educational value
- analytical support
- anti-FOMO decision assistance

rather than stock trading execution.