# 📈 Real-Time Indian Investment Dashboard

A high-performance, responsive investment portfolio analytics dashboard built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and the **Yahoo Finance API**. It enriches static portfolio holdings with live market prices, calculating detailed returns, sector allocations, and historical metrics with premium glassmorphic visual aesthetics.

---

## ✨ Features

- **🔄 Real-time Data Pipeline:** Automated pooling fetches live Indian stock market indices (NSE & BSE) every 15 seconds.
- **⚡ Resilient API Fetching:** Utilizes a highly robust `Promise.allSettled` parallel fetch model coupled with in-memory TTL caching to handle Yahoo Finance rate limits gracefully without service disruption.
- **📊 Interactive Allocation Analytics:** Beautifully styled Recharts pie charts visually mapping portfolio weights across industries.
- **⏰ Smart Market Status Indicator:** Displays a real-time pulsing 🟢 **Open** or 🔴 **Closed** status tuned to Indian trading hours (9:15 AM - 3:30 PM IST, Monday - Friday).
- **📱 Fully Responsive Design:** Hand-crafted glassmorphism cards and tables designed to collapse beautifully on mobile viewports while maintaining horizontal scroll boundaries for clean reading.
- **🔢 Comprehensive Financial Calculations:**
  - **Today's Return:** Delta calculation against yesterday's closing price.
  - **Total Return:** Life-of-portfolio unrealized gains/losses.
  - **P/E (TTM):** Live valuation metric tracking.
  - **Last Earnings Date:** Real-time earnings calendar dates.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router) with Turbopack support
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Vanilla Glassmorphic components)
- **Data Engine:** `yahoo-finance2`
- **Charts:** Recharts
- **Icons:** Lucide React

---

## 🚀 Setup & Installation

### Prerequisites
Make sure you have [Node.js (v18.0.0 or higher)](https://nodejs.org/) installed.

### 1. Install Dependencies
Navigate to the root directory and install all node packages:
```bash
npm install
```

### 2. Configure Holdings
The portfolio holdings are read from a static local JSON database at `src/data/portfolio.json`. 
To customize your portfolio, modify that file using this standard format:
```json
[
  {
    "symbol": "HDFCBANK.NS",
    "name": "HDFC Bank",
    "shares": 100,
    "averageBuyPrice": 1450.50
  },
  {
    "symbol": "FINEORG.NS",
    "name": "Fine Organic Industries",
    "shares": 16,
    "averageBuyPrice": 4284.00
  }
]
```
> 💡 **Tip:** Always use `.NS` extensions for NSE (National Stock Exchange of India) and `.BO` for BSE (Bombay Stock Exchange) to guarantee clean, real-time resolution from the Yahoo Finance API.

---

## 💻 Usage

### Start Development Server
To launch the application in development mode with hot-reloading:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to see your live portfolio update.

### Build for Production
To generate a production-ready bundle:
```bash
npm run build
```

### Start Production Server
Once the build completes successfully, start the server in production mode:
```bash
npm start
```

---

## 📂 Project Architecture

```
├── src/
│   ├── app/                 # Next.js App Router (pages & API layer)
│   │   ├── api/             # BFF Endpoint (/api/portfolio) doing all metrics calculations
│   │   └── page.tsx         # Main interactive dashboard container
│   ├── components/          # Bounded UI blocks (Table, Cards, Sector Allocation, Badges)
│   ├── data/                # Source database (portfolio.json)
│   ├── services/            # Finance API clients and business logic engines
│   ├── types/               # Type-safe TypeScript schemas
│   └── utils/               # Formatting and data grouping utilities
```

---

## 📈 Financial Formulas Used

### **Total Return**
$$GainLossAmount = (CMP \times Shares) - (AvgBuyPrice \times Shares)$$
$$GainLossPercentage = \left(\frac{GainLossAmount}{AvgBuyPrice \times Shares}\right) \times 100$$

### **Today's Return**
$$DayGainAmount = (CMP - PreviousClose) \times Shares$$
$$DayGainPercentage = \left(\frac{CMP - PreviousClose}{PreviousClose}\right) \times 100$$

---

## 📝 Troubleshooting

- **Chart render warnings:** If you see Recharts container size warnings in console, they are safely mitigated by the visual `minHeight` styles.
- **Empty / 0.00 values:** If Today's Change or P/E are represented by a dash (`—`), this means the stock (e.g. extremely low-cap small-caps) does not currently publish active previous-close or trailing metrics on Yahoo Finance. The app handles this gracefully without crashing the UI.
