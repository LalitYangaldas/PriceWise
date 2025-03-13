import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractPrice, extractDescription } from '../utils';
import { connectToDB } from '../mongoose';
import Product from '../models/product.model';

// Define the structure of a price history entry
interface PriceHistoryEntry {
  price: number;
  date: string; // Use string for serialized dates (ISO format)
}

// Define the product structure
interface ProductData {
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: PriceHistoryEntry[];
  discountRate: number;
  category: string;
  reviewsCount: number;
  stars: number;
  isOutOfStock: boolean;
  description: string;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  users?: { email: string }[]; // Optional, for saved products
  _id?: string; // Optional, added by MongoDB
  createdAt?: string; // Optional, added by MongoDB
  updatedAt?: string; // Optional, added by MongoDB
}

export async function scraperAmazonProduct(url: string) {
  if (!url) return;

  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 33335;
  const session_id = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    // Extract product title
    const title = $('#productTitle').text().trim();

    // Extract prices
    const currentPrice = extractPrice(
      $('.priceToPay span.a-price-whole'),
      $('.a-size-base.a-color-price'),
      $('.a-button-selected .a-color-base'),
      $('.a-price.a-text-price'),
      $('.a-section.a-spacing-none'),
      $('.priceToPay span.a-price-whole')
    );

    const originalPrice = extractPrice(
      $('#priceblock_ourprice'),
      $('.a-price.a-text-price span.a-offscreen'),
      $('#listPrice'),
      $('#priceblock_dealprice'),
      $('.a-price.a-text-price'),
      $('.a-size-base.a-color-price'),
      $('.a-size-small')
    );

    // Extract currency symbol (e.g., "$", "£", "€", "₹")
    const currencySymbol = $('.a-price-symbol').text().trim() || '₹'; // Fallback to INR for India
    let currency = 'INR'; // Default to INR since you're in India
    if (currencySymbol === '$') currency = 'USD';
    else if (currencySymbol === '£') currency = 'GBP';
    else if (currencySymbol === '€') currency = 'EUR';
    else if (currencySymbol === '₹') currency = 'INR';

    // Check if the product is out of stock
    const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

    // Extract image URLs
    const images =
      $('#imgBlkFront').attr('data-a-dynamic-image') ||
      $('#landingImage').attr('data-a-dynamic-image') ||
      '{}';
    const imageUrls = Object.keys(JSON.parse(images));

    // Extract discount rate
    const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "").trim() || 'N/A';

    const description = extractDescription($);

    // Construct data object with scraped information
    const data = {
      url,
      currency, // Included currency field with INR support
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || 0,
      originalPrice: Number(originalPrice) || 0,
      priceHistory: [],
      discountRate: Number(discountRate) || 0,
      category: 'category',
      reviewsCount: 100,
      stars: 4.5,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice) || 0,
      highestPrice: Number(originalPrice) || Number(currentPrice) || 0,
      averagePrice: Number(currentPrice) || Number(originalPrice) || 0,
    };

    return data;
  } catch (error: any) {
    console.log(error);
  }
}

export async function getProductById(productId: string) {
  try {
    await connectToDB(); // Await the async connection
    const product = await Product.findOne({ _id: productId });
    if (!product) return null;
    return product.toJSON(); // Convert to plain object for frontend compatibility
  } catch (error) {
    console.log(error);
  }
}