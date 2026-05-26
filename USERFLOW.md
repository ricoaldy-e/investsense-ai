# User Flow Documentation
# InvestSense AI

---

# 1. Main User Flow

Landing Page
↓
Login / Register
↓
Dashboard (with AI Assistant Panel)
↓
Stock Analysis Exploration + AI Conversations
↓
Market Insight Page (macro-level overview)

---

# 2. Landing Page Flow

## User Actions

Users can:
- explore platform overview
- understand AI-powered analysis features
- read feature explanations
- access authentication pages

## Main CTA Buttons

- Get Started
- Login
- Explore Dashboard

---

# 3. Authentication Flow

# 3.1 Register Flow

User opens Register Page
↓
User inputs:
- Username
- Email
- Password
↓
Account Created
↓
Redirect to Login Page

---

# 3.2 Login Flow

User opens Login Page
↓
User inputs:
- Email
- Password
↓
Authentication Success
↓
Redirect to Dashboard

---

# 4. Dashboard Flow

## Dashboard Purpose

The dashboard acts as the main investment analysis workspace. It combines stock analysis cards with an integrated AI Assistant Panel, enabling users to analyze stocks and consult with the AI in one unified view.

## Dashboard Sections

### Sidebar Navigation

Contains:
- Dashboard
- Market Insight
- Logout

### Main Content Area

Contains:
- Market overview
- Trending stocks
- Sentiment indicators
- AI insight cards
- Technical indicators
- Risk awareness summaries

### AI Assistant Panel (Right Side)

The AI chatbot is embedded as a right-side collapsible panel within the Dashboard layout:
- Toggled open/closed via a floating action button or panel trigger
- Allows conversation-based AI interaction without leaving the analysis workspace
- Provides contextual responses based on the currently viewed stock
- Maintains session-level conversation history
- On mobile, the panel appears as a slide-over overlay

---

# 5. Stock Analysis Flow

User opens Dashboard
↓
User searches stock/company
↓
System retrieves:
- sentiment analysis
- technical indicators
- market insights
↓
Dashboard updates analysis cards
↓
User reviews:
- sentiment status
- technical indicators
- AI-generated insights
↓
User may open AI Assistant Panel for deeper explanation

---

# 6. AI Assistant Flow (Integrated Panel)

User opens AI Assistant Panel (right side of Dashboard)
↓
User enters stock-related question
↓
AI processes request
↓
System analyzes:
- market sentiment
- technical indicators
- financial context
↓
AI generates:
- beginner-friendly explanation
- market insight
- sentiment interpretation
- risk explanation
↓
User receives AI-generated response within the panel
↓
User can continue browsing dashboard cards simultaneously

---

# 7. Example AI Assistant Queries

Users may ask:
- Analyze BBCA sentiment
- Explain RSI indicator
- Why is market sentiment negative?
- Explain market volatility
- Summarize recent financial news
- Analyze stock risk

---

# 8. Market Insight Page Flow

User navigates to Market Insight via sidebar
↓
System displays:
- aggregated market sentiment overview
- curated financial news feed
- sector performance summaries
- trending stock highlights
- educational market content
↓
User reviews macro-level market conditions
↓
User may return to Dashboard for stock-specific analysis

---

# 9. AI Insight Flow

User selects stock/topic
↓
System collects:
- market data
- financial news
- technical indicators
↓
AI analyzes collected data
↓
System displays:
- sentiment summary
- technical indicators
- AI-generated explanation
- risk awareness insight
- educational interpretation

---

# 10. Risk Awareness Flow

User reviews stock insight
↓
System detects:
- volatility
- unstable sentiment
- market uncertainty
↓
Platform displays:
- caution indicators
- volatility warnings
- anti-FOMO reminders
- rational investment prompts

---

# 11. Beginner-Friendly Guidance Flow

User views technical indicator
↓
AI simplifies financial terminology
↓
System provides:
- educational explanation
- simplified interpretation
- beginner-friendly insight

---

# 12. Mobile User Flow

Mobile users can:
- access landing page
- login/register
- open dashboard
- use AI Assistant Panel (slide-over overlay)
- access Market Insight page
- view market insights

## Mobile Navigation

Sidebar behavior:
- collapsible drawer menu

AI Assistant Panel behavior:
- slide-over overlay from the right
- full-height panel covering the main content area

Main focus:
- analysis cards
- AI Assistant interaction
- responsive dashboard experience

---

# 13. Navigation Structure

Routes:

/               → Landing Page
/login          → Login Page
/register       → Register Page
/dashboard      → Dashboard (with integrated AI Assistant Panel)
/market-insight → Market Insight Page

---

# 14. User Experience Goals

The platform should feel:
- modern
- professional
- analytical
- beginner-friendly
- educational

The experience should encourage:
- rational investment thinking
- financial understanding
- reduced emotional investing behavior
- better market awareness