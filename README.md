# InvestSense AI 🚀

InvestSense AI is a web-based decision support system designed to help beginner investors make smarter and more rational stock investment decisions.

The application addresses the common issue of **FOMO (Fear of Missing Out)** by combining technical analysis and AI-driven news sentiment into a simple and user-friendly interface.

---

## ✨ Features

* **Technical Analysis**
  Provides stock insights using indicators such as RSI and price trends

* **News Sentiment Analysis**
  Classifies financial news into positive, neutral, or negative sentiment

* **AI Assistant (Integrated Panel)**
  A right-side collapsible panel embedded within the Dashboard that delivers contextual explanations and investment insights without leaving the analysis workspace

* **Market Insight Page**
  A dedicated page providing macro-level market overviews including aggregated sentiment, financial news, and sector performance

* **Anti-FOMO Mechanisms**

  * Reality Check → helps users evaluate decisions logically
  * Interceptor → warns users before making impulsive actions

* **User Mode Toggle**
  Beginner Mode (simplified view) and Pro Mode (detailed analysis)

---

## 🏗️ System Overview

This repository contains the **frontend application** built with React.
It communicates with backend services and AI models through REST APIs.

---

## 🛠 Tech Stack

* React (Vite)
* Tailwind CSS
* Axios

---

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/              ← Authentication components
│   ├── chatbot/           ← AI Assistant panel components
│   ├── landing/           ← Landing page sections
│   └── ui/                ← Shared UI components
├── layouts/
│   └── DashboardLayout.jsx ← Sidebar + Navbar + AI Panel + Outlet
├── pages/
│   ├── Landing.jsx
│   ├── Auth.jsx
│   ├── Dashboard.jsx
│   └── MarketInsight.jsx
├── services/
├── mocks/
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🚀 Getting Started

### Clone repository

```
git clone https://github.com/ricoaldy-e/investsense-ai.git
cd investsense-ai
```

### Install dependencies

```
npm install
```

### Run the application

```
npm run dev
```

---

## 📌 Status

Currently in development (Frontend Capstone Project)

---

## 🎯 Objective

To provide a clean and intuitive interface that helps users understand stock insights and make rational investment decisions.

---

## 🤖 AI Agent Onboarding Guide

If you are an AI Assistant / Agent assigned to work on this repository, you MUST read and internalize the following documentation before suggesting any changes or refactoring:

1. **[DESIGN.md](./DESIGN.md)**: This is the single most important visual document. We use a strictly defined **"Cold Surgical"** design system. You must understand the 3-font typography trinity, the absolute ban on rounded corners (except pill buttons), and the prohibition of generic "AI SaaS" glowing/shadow effects.
2. **[SRS.md](./SRS.md)**: Understand the core product philosophy. This is an **Anti-FOMO** decision support tool, NOT a trading execution bot.
3. **[USERFLOW.md](./USERFLOW.md)**: Reference for how the user navigates between the Landing Page, Dashboard (with AI Assistant Panel), and Market Insight page.
4. **[DATABASE.md](./DATABASE.md)**: Reference for future backend integration context.
5. **[DASHBOARD-CHATBOT.md](./DASHBOARD-CHATBOT.md)**: Detailed design and layout specification for the integrated AI Assistant Panel inside the Dashboard.

**Golden Rule for AI Agents**: DO NOT redesign the UI, DO NOT add unnecessary abstractions, and ALWAYS respect the Cold Surgical design guidelines.

---

**InvestSense AI — helping you invest based on data, not emotion.**