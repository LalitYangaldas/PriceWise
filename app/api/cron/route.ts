import { NextResponse } from "next/server";
import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifType } from "@/lib/utils";
import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { scraperAmazonProduct } from "@/lib/scraper";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";

// Configuration for Vercel Serverless Function
export const maxDuration = 60; // Max for Hobby plan (60 seconds)
export const dynamic = "force-dynamic"; // Force dynamic rendering
export const revalidate = 0; // Disable caching

export async function GET(request: Request) {
  try {
    await connectToDB();

    // Fetch one unscraped product
    const product = await Product.findOne({ lastScraped: { $exists: false } })
      .sort({ createdAt: 1 }) // Oldest first
      .limit(1);

    if (!product) {
      return NextResponse.json({ message: "No products left to scrape" });
    }

    // 1. Scrape latest product details & update DB
    const scrapedProduct = await scraperAmazonProduct(product.url);

    if (!scrapedProduct) {
      throw new Error(`Failed to scrape product: ${product.url}`);
    }

    const updatedPriceHistory = [
      ...product.priceHistory,
      { price: scrapedProduct.currentPrice },
    ];

    const updatedProductData = {
      ...scrapedProduct,
      priceHistory: updatedPriceHistory,
      lowestPrice: getLowestPrice(updatedPriceHistory),
      highestPrice: getHighestPrice(updatedPriceHistory),
      averagePrice: getAveragePrice(updatedPriceHistory),
      lastScraped: new Date(),
    };

    const updatedProduct = await Product.findOneAndUpdate(
      { url: product.url },
      updatedProductData,
      { new: true }
    );

    // 2. Check product status & send email
    const emailNotifType = getEmailNotifType(scrapedProduct, product);

    if (emailNotifType && updatedProduct.users.length > 0) {
      const productInfo = {
        title: updatedProduct.title,
        url: updatedProduct.url,
      };
      const emailContent = await generateEmailBody(productInfo, emailNotifType);
      const userEmails = updatedProduct.users.map((user: any) => user.email);
      await sendEmail(emailContent, userEmails);
    }

    return NextResponse.json({
      message: "Ok",
      data: updatedProduct,
    });
  } catch (error: any) {
    console.error("Cron error:", error);
    return NextResponse.json(
      { message: `Failed: ${error.message}` },
      { status: 500 }
    );
  }
}