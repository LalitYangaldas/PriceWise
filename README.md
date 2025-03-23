# PriceWise: Your Smart Price-Tracking Companion

Welcome to **PriceWise**, a cutting-edge price-tracking application designed to empower savvy shoppers with real-time insights and unbeatable deals. Built from the ground up with **Next.js**, PriceWise harnesses the power of web scraping, data analysis, and automated notifications to monitor Amazon product prices and alert users when it’s time to strike. Whether it’s snagging the lowest price or staying ahead of market trends, PriceWise transforms raw data into actionable savings—all wrapped in a sleek, modern web interface.

### What Makes PriceWise Stand Out?
- **Real-Time Price Scraping**: Leveraging **Bright Data** proxies, PriceWise fetches up-to-the-minute pricing from Amazon, ensuring you never miss a deal.
- **Intelligent Data Processing**: Tracks price histories and computes key metrics—lowest, highest, and average prices—to give you the full picture.
- **Smart Notifications**: Integrated with **Nodemailer** and Gmail, it sends personalized email alerts when prices drop or hit user-defined thresholds.
- **Scalable Architecture**: Powered by **MongoDB** and deployed on **Vercel**, PriceWise balances performance and efficiency, handling cron-driven updates with ease.
- **Future-Ready**: Designed with extensibility in mind—think price trend analysis, predictive modeling, and interactive visualizations (coming soon!).

Born as a final year project, PriceWise blends **software engineering finesse** with **data science potential**, showcasing my ability to build practical, impactful tools from scratch. Whether you're a bargain hunter or a tech enthusiast, dive in and see how PriceWise turns data into dollars saved!

---

## Features

- **Price Monitoring**: Add any Amazon product URL and let PriceWise track its price history.
- **Dynamic Updates**: A cron job (`/api/cron`) runs every 5 minutes on Vercel, scraping and updating one product per invocation.
- **User Dashboard**: View tracked products with details like current price, lowest price, and notification status (via `app/products/[id]`).
- **Email Alerts**: Get notified instantly when a product hits its lowest price, restocks, or drops below a threshold.
- **Data Persistence**: All price data and user preferences are stored securely in MongoDB.

---

## Tech Stack

- **Frontend & Backend**: Next.js 15.1.6 (App Router, Server Actions)
- **Database**: MongoDB (via Mongoose)
- **Scraping**: Bright Data proxies with custom scraper (`lib/scraper`)
- **Notifications**: Nodemailer with Gmail SMTP (`lib/nodemailer`)
- **Deployment**: Vercel (Hobby plan optimized)
- **Utilities**: Custom functions for price analysis (`lib/utils`)

---

## Getting Started

### Prerequisites
- **Node.js**: v18+ recommended
- **MongoDB Atlas**: For product and user data storage
- **Bright Data**: Proxy service for scraping (free tier available)
- **Gmail**: Account with an App Password for email notifications

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/LalitYangaldas/PriceWise.git
   cd PriceWise
2. **Install Dependencies**:
   ```bash
   npm install
3. **Set Up Environment Variables**:
    ```bash
    BRIGHT_DATA_USERNAME=<your-bright-data-username>
    BRIGHT_DATA_PASSWORD=<your-bright-data-password>
    MONGODB_URI=mongodb+srv://<your-mongodb-username>:<your-mongodb- password>@cluster0.3l7ou.mongodb.net/pricewise?retryWrites=true&w=majority
    EMAIL_USER=<your-gmail-address>
    EMAIL_PASSWORD=<your-gmail-app-password>
4. **Run the Development Server**:
    ```bash
    npm run dev

Open http://localhost:3000 in your browser to see the app live.
Edit app/page.tsx to tweak the homepage—changes auto-update!

## Deployment

PriceWise is deployed on Vercel for a seamless live experience:

Live Demo: Check out the app in action at https://price-wise-sable.vercel.app/.

![Screenshot 2025-03-23 172256](https://github.com/user-attachments/assets/10e5a272-7122-4d86-b9f2-f0011759de5e)


![image](https://github.com/user-attachments/assets/0079d469-50dd-40ff-9210-6ba42003a457)


