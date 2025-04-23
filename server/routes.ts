import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { twilioService } from "./twilio";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // API routes prefix
  const API_PREFIX = "/api";
  
  // === Market Price Routes ===
  
  // Get current market prices
  app.get(`${API_PREFIX}/market/prices/current`, async (req, res) => {
    try {
      const prices = await storage.getCurrentMarketPrices();
      
      // Format the response
      const response = {
        data: prices.map(price => ({
          type: price.variety,
          price: price.price,
          dayChange: price.dayChange || 0,
          weekChange: price.weekChange || 0
        })),
        lastUpdated: prices.length > 0 ? prices[0].recordedAt.toISOString() : new Date().toISOString(),
        source: "Ethiopian Grain Trade Enterprise"
      };
      
      res.json(response);
    } catch (error) {
      console.error("Error fetching current prices:", error);
      res.status(500).json({ message: "Failed to fetch current market prices" });
    }
  });
  
  // Get historical price data
  app.get(`${API_PREFIX}/market/prices/history`, async (req, res) => {
    try {
      const history = await storage.getMarketPriceHistory();
      res.json(history);
    } catch (error) {
      console.error("Error fetching price history:", error);
      res.status(500).json({ message: "Failed to fetch price history" });
    }
  });
  
  // Get market insights
  app.get(`${API_PREFIX}/market/insights`, async (req, res) => {
    try {
      const insights = await storage.getMarketInsights();
      res.json({ data: insights });
    } catch (error) {
      console.error("Error fetching market insights:", error);
      res.status(500).json({ message: "Failed to fetch market insights" });
    }
  });
  
  // === Products Routes ===
  
  // Get all products
  app.get(`${API_PREFIX}/products`, async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  // Get product by ID
  app.get(`${API_PREFIX}/products/:id`, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  // === SMS Routes ===
  
  // Send SMS message
  app.post(`${API_PREFIX}/sms/send`, async (req, res) => {
    const schema = z.object({
      to: z.string().min(1),
      message: z.string().min(1)
    });
    
    try {
      const { to, message } = schema.parse(req.body);
      
      // Use Twilio to send SMS
      const result = await twilioService.sendSms(to, message);
      
      res.json({
        success: true,
        messageId: result.sid
      });
    } catch (error) {
      console.error("Error sending SMS:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      
      res.status(500).json({ message: "Failed to send SMS" });
    }
  });
  
  // Subscribe to price alerts
  app.post(`${API_PREFIX}/sms/subscribe`, async (req, res) => {
    const schema = z.object({
      phoneNumber: z.string().min(1),
      preferences: z.object({
        product: z.string().default("teff"),
        market: z.string().default("addis_ababa"),
        frequency: z.enum(["daily", "weekly"]).default("daily")
      })
    });
    
    try {
      const { phoneNumber, preferences } = schema.parse(req.body);
      
      // Add subscription to database
      const subscription = await storage.createSmsSubscription({
        phoneNumber,
        marketId: preferences.market,
        productId: preferences.product,
        frequency: preferences.frequency,
        userId: null, // Would be set from authenticated user
        isActive: true
      });
      
      // Send confirmation SMS
      await twilioService.sendSms(
        phoneNumber,
        `You are now subscribed to ${preferences.frequency} price alerts for ${preferences.product} in ${preferences.market}. Reply STOP to unsubscribe.`
      );
      
      res.json({
        success: true,
        subscription
      });
    } catch (error) {
      console.error("Error subscribing to SMS alerts:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      
      res.status(500).json({ message: "Failed to subscribe to SMS alerts" });
    }
  });
  
  // Unsubscribe from price alerts
  app.post(`${API_PREFIX}/sms/unsubscribe`, async (req, res) => {
    const schema = z.object({
      phoneNumber: z.string().min(1)
    });
    
    try {
      const { phoneNumber } = schema.parse(req.body);
      
      // Deactivate all subscriptions for this phone number
      await storage.deactivateSmsSubscriptions(phoneNumber);
      
      // Send confirmation SMS
      await twilioService.sendSms(
        phoneNumber,
        "You have been unsubscribed from all price alerts. Reply START to resubscribe."
      );
      
      res.json({
        success: true
      });
    } catch (error) {
      console.error("Error unsubscribing from SMS alerts:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      
      res.status(500).json({ message: "Failed to unsubscribe from SMS alerts" });
    }
  });
  
  // Check subscription status
  app.get(`${API_PREFIX}/sms/status`, async (req, res) => {
    const phoneNumber = req.query.phone as string;
    
    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    
    try {
      const isSubscribed = await storage.checkSmsSubscriptionStatus(phoneNumber);
      
      res.json({
        phoneNumber,
        isSubscribed
      });
    } catch (error) {
      console.error("Error checking SMS subscription status:", error);
      res.status(500).json({ message: "Failed to check subscription status" });
    }
  });

  return httpServer;
}
