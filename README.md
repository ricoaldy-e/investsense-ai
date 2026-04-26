# InvestSense AI 🚀

InvestSense AI is a web-based decision support system designed to help beginner investors make smarter and more rational stock investment decisions.

The application addresses the common issue of **FOMO (Fear of Missing Out)** by combining technical analysis and AI-driven news sentiment into a simple and user-friendly interface.

---

## ✨ Features

* **Technical Analysis**
  Provides stock insights using indicators such as RSI and price trends

* **News Sentiment Analysis**
  Classifies financial news into positive, neutral, or negative sentiment

* **AI Chatbot (RAG-based)**
  Delivers contextual explanations and investment insights

* **Anti-FOMO Mechanisms**

  * *Reality Check*: helps users evaluate decisions logically
  * *Interceptor*: warns users before making impulsive actions

* **User Mode Toggle**
  Beginner Mode (simplified view) and Pro Mode (detailed analysis)

---

## 🏗️ System Overview

The system integrates multiple components to deliver end-to-end analysis:

Frontend (React) → Backend API (Express.js) → Database (PostgreSQL) → AI Services (FastAPI + TensorFlow)

---

## 🛠 Tech Stack

**Frontend**

* React (Vite)
* Tailwind CSS
* Axios

**Backend**

* Node.js (Express.js)
* PostgreSQL

**Data Science**

* Python
* Pandas, NumPy
* Technical indicators (RSI, trend analysis)

**AI / Machine Learning**

* TensorFlow
* FastAPI (model serving)
* Retrieval-Augmented Generation (RAG)

---

## 📁 Project Structure

```id="structfinal"
investsense-ai/
├── frontend/   # User interface (React)
├── backend/    # API and server logic
└── README.md
```

---

## 🚀 Getting Started

### Clone repository

```id="clonefinal"
git clone https://github.com/ricoaldy-e/investsense-ai.git
cd investsense-ai
```

### Install dependencies

Frontend:

```id="installfinal1"
cd frontend
npm install
```

Backend:

```id="installfinal2"
cd backend
npm install
```

### Run the application

Frontend:

```id="runfinal1"
npm run dev
```

Backend:

```id="runfinal2"
node index.js
```

---

## 📌 Project Status

Currently in development as part of a capstone project.

---

## 🎯 Objective

To reduce impulsive investment behavior and improve financial decision-making by providing clear, data-driven insights through an accessible web application.

---

## 👥 Team

This project is developed collaboratively by:

* Full-Stack Developer
* Data Scientist
* AI Engineer

---

**InvestSense AI — helping you invest based on data, not emotion.**