💰 Crypto Tracker App
A modern web application built with Next.js 14, React, and Tailwind CSS, that displays the top 50 cryptocurrencies with live prices, watchlist functionality, and detailed coin charts powered by the CoinGecko API.

🚀 Features
✅ Live market data (Top 50 coins)

⭐ Add/remove coins to a persistent watchlist

📈 Interactive coin detail pages with price chart

🔍 Search by coin name or symbol

💡 Mobile-responsive UI with clean design

⚡ Local cache + CoinGecko API rate-limit handling

🔐 Environment support for private API key

🛠️ Tech Stack
Next.js 14 (App Router, API routes)

React 18

Tailwind CSS for styling

Lucide React Icons

CoinGecko API for market data

LocalStorage for persistent watchlist

📦 Installation
Clone the repo

bash
Copy
Edit
git clone https://github.com/purushotham-24/crypto-tracker.git
cd crypto-tracker
Install dependencies

bash
Copy
Edit
npm install
Create .env.local

ini
Copy
Edit
NEXT_PUBLIC_COINGECKO_API_KEY=your_optional_api_key
Run the development server

bash
Copy
Edit
npm run dev
Open http://localhost:3000 in your browser.