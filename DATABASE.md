# InvestSense AI - Database Documentation

## Tables Overview

| Table | Function |
|---|---|
| `users` | Store user account data |
| `stocks` | Store stock/company data |
| `stock_prices` | Store stock price history |
| `technical_indicators` | Store technical analysis data |
| `news` | Store stock news & sentiment |
| `chat_history` | Store AI chat history |
| `user_watchlist` | Store user watchlist |

---

# users

Store registered users.

| Column | Type |
|---|---|
| id | uuid (PK) |
| email | varchar |
| username | varchar |
| password_hash | varchar |
| refresh_token | text |
| created_at | timestamp |

---

# stocks

Store stock/company information.

| Column | Type |
|---|---|
| ticker | varchar (PK) |
| company_name | varchar |
| sector | varchar |
| last_updated | timestamp |

---

# stock_prices

Store historical stock prices.

| Column | Type |
|---|---|
| id | uuid (PK) |
| ticker | varchar (FK → stocks.ticker) |
| record_date | date |
| open | numeric |
| high | numeric |
| low | numeric |
| close | numeric |
| volume | bigint |
| created_at | timestamp |

---

# technical_indicators

Store technical analysis indicators.

| Column | Type |
|---|---|
| id | uuid (PK) |
| ticker | varchar (FK → stocks.ticker) |
| record_date | date |
| rsi_14 | numeric |
| trend_status | varchar |
| created_at | timestamp |

---

# news

Store stock-related news.

| Column | Type |
|---|---|
| id | uuid (PK) |
| ticker | varchar (FK → stocks.ticker) |
| title | varchar |
| description | text |
| url | varchar |
| source_name | varchar |
| published_at | timestamp |
| sentiment_score | numeric |
| sentiment_label | varchar |
| created_at | timestamp |

---

# chat_history

Store chatbot conversations.

| Column | Type |
|---|---|
| id | uuid (PK) |
| user_id | uuid (FK → users.id) |
| message | text |
| sender_role | varchar |
| created_at | timestamp |

---

# user_watchlist

Store user favorite/watchlist stocks.

| Column | Type |
|---|---|
| id | uuid (PK) |
| user_id | uuid (FK → users.id) |
| ticker | varchar (FK → stocks.ticker) |
| added_at | timestamp |

---

# Relationships

```text
users
 ├── chat_history
 └── user_watchlist

stocks
 ├── stock_prices
 ├── technical_indicators
 ├── news
 └── user_watchlist