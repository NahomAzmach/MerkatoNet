import { 
  users, 
  products, 
  marketPrices, 
  smsSubscriptions,
  type User, 
  type InsertUser, 
  type Product, 
  type InsertProduct,
  type MarketPrice,
  type InsertMarketPrice,
  type SmsSubscription,
  type InsertSmsSubscription
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product operations
  getProductById(id: number): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Market price operations
  getCurrentMarketPrices(): Promise<(MarketPrice & { dayChange?: number; weekChange?: number })[]>;
  getMarketPriceHistory(): Promise<{ date: string; magna: number; mixed: number; sergegna: number; }[]>;
  getMarketInsights(): Promise<{ type: string; title: string; description: string; }[]>;
  recordMarketPrice(price: InsertMarketPrice): Promise<MarketPrice>;
  
  // SMS subscription operations
  createSmsSubscription(subscription: InsertSmsSubscription): Promise<SmsSubscription>;
  deactivateSmsSubscriptions(phoneNumber: string): Promise<void>;
  checkSmsSubscriptionStatus(phoneNumber: string): Promise<boolean>;
  getActiveSmsSubscriptions(): Promise<SmsSubscription[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private marketPrices: Map<number, MarketPrice>;
  private smsSubscriptions: Map<number, SmsSubscription>;
  
  private currentUserId: number;
  private currentProductId: number;
  private currentMarketPriceId: number;
  private currentSmsSubscriptionId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.marketPrices = new Map();
    this.smsSubscriptions = new Map();
    
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentMarketPriceId = 1;
    this.currentSmsSubscriptionId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // === User operations ===
  
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  // === Product operations ===
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const now = new Date();
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    
    if (!product) {
      return undefined;
    }
    
    const updatedProduct: Product = {
      ...product,
      ...updates,
      updatedAt: new Date()
    };
    
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // === Market price operations ===
  
  async getCurrentMarketPrices(): Promise<(MarketPrice & { dayChange?: number; weekChange?: number })[]> {
    // Get the latest prices for each variety
    const prices = Array.from(this.marketPrices.values());
    
    // Group by variety and sort by recordedAt (most recent first)
    const groupedByVariety = prices.reduce((acc, price) => {
      if (!acc[price.variety]) {
        acc[price.variety] = [];
      }
      acc[price.variety].push(price);
      return acc;
    }, {} as Record<string, MarketPrice[]>);
    
    // Get the most recent price for each variety
    const latestPrices = Object.values(groupedByVariety).map(varieties => {
      const sortedVarieties = varieties.sort((a, b) => 
        b.recordedAt.getTime() - a.recordedAt.getTime()
      );
      
      const latest = sortedVarieties[0];
      
      // Calculate changes
      let dayChange = 0;
      let weekChange = 0;
      
      if (sortedVarieties.length > 1) {
        // Day change - compare to yesterday's price if available
        const yesterday = sortedVarieties.find(p => {
          const dayDiff = Math.floor((latest.recordedAt.getTime() - p.recordedAt.getTime()) / (1000 * 60 * 60 * 24));
          return dayDiff === 1;
        });
        
        if (yesterday) {
          dayChange = ((latest.price - yesterday.price) / yesterday.price) * 100;
        }
        
        // Week change - compare to price from 7 days ago if available
        const lastWeek = sortedVarieties.find(p => {
          const dayDiff = Math.floor((latest.recordedAt.getTime() - p.recordedAt.getTime()) / (1000 * 60 * 60 * 24));
          return dayDiff >= 7 && dayDiff < 8;
        });
        
        if (lastWeek) {
          weekChange = ((latest.price - lastWeek.price) / lastWeek.price) * 100;
        }
      }
      
      return {
        ...latest,
        dayChange: parseFloat(dayChange.toFixed(1)), // Round to 1 decimal place
        weekChange: parseFloat(weekChange.toFixed(1)), // Round to 1 decimal place
      };
    });
    
    return latestPrices;
  }
  
  async getMarketPriceHistory(): Promise<{ date: string; magna: number; mixed: number; sergegna: number; }[]> {
    // Generate sample price history data
    return this.generateHistoricalPriceData(180); // 6 months of data
  }
  
  async getMarketInsights(): Promise<{ type: string; title: string; description: string; }[]> {
    // Sample market insights
    return [
      {
        type: "warning",
        title: "Supply Forecast",
        description: "Expected shortage due to delayed rains in central regions. Prices may increase in the next 2 weeks."
      },
      {
        type: "success",
        title: "Buying Opportunity",
        description: "Mixed teff prices have stabilized and may decrease as new harvest enters the market."
      },
      {
        type: "info",
        title: "Regional Difference",
        description: "Prices in Bahir Dar markets are 5-10% lower than Addis Ababa for equivalent quality."
      }
    ];
  }
  
  async recordMarketPrice(insertPrice: InsertMarketPrice): Promise<MarketPrice> {
    const id = this.currentMarketPriceId++;
    const price: MarketPrice = {
      ...insertPrice,
      id,
      recordedAt: new Date()
    };
    this.marketPrices.set(id, price);
    return price;
  }
  
  // === SMS subscription operations ===
  
  async createSmsSubscription(insertSubscription: InsertSmsSubscription): Promise<SmsSubscription> {
    const id = this.currentSmsSubscriptionId++;
    const now = new Date();
    const subscription: SmsSubscription = {
      ...insertSubscription,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.smsSubscriptions.set(id, subscription);
    return subscription;
  }
  
  async deactivateSmsSubscriptions(phoneNumber: string): Promise<void> {
    // Find all subscriptions for this phone number and deactivate them
    for (const [id, subscription] of this.smsSubscriptions.entries()) {
      if (subscription.phoneNumber === phoneNumber) {
        this.smsSubscriptions.set(id, {
          ...subscription,
          isActive: false,
          updatedAt: new Date()
        });
      }
    }
  }
  
  async checkSmsSubscriptionStatus(phoneNumber: string): Promise<boolean> {
    // Check if there are any active subscriptions for this phone number
    return Array.from(this.smsSubscriptions.values()).some(
      subscription => subscription.phoneNumber === phoneNumber && subscription.isActive
    );
  }
  
  async getActiveSmsSubscriptions(): Promise<SmsSubscription[]> {
    // Get all active subscriptions
    return Array.from(this.smsSubscriptions.values()).filter(
      subscription => subscription.isActive
    );
  }
  
  // === Helper methods ===
  
  private initializeSampleData() {
    // Initialize sample market prices
    const teffVarieties = ["Magna (White)", "Mixed", "Sergegna (Red)"];
    const prices = [6800, 5950, 5300];
    
    // Record current prices
    const today = new Date();
    
    teffVarieties.forEach((variety, index) => {
      this.recordMarketPrice({
        market: "Addis Ababa",
        product: "teff",
        variety,
        price: prices[index],
        unit: "quintal",
        source: "Ethiopian Grain Trade Enterprise"
      });
    });
    
    // Record historical prices for the past week
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      teffVarieties.forEach((variety, index) => {
        // Add some random variation to the prices
        const variation = Math.floor(Math.random() * 100) - 50; // -50 to +50
        
        this.recordMarketPrice({
          market: "Addis Ababa",
          product: "teff",
          variety,
          price: prices[index] + variation,
          unit: "quintal",
          source: "Ethiopian Grain Trade Enterprise",
          recordedAt: date
        });
      });
    }
    
    // Initialize sample products
    const productTitles = ["White Teff (Magna)", "Mixed Teff", "Red Teff (Sergegna)", "Organic White Teff"];
    const productTypes = ["white", "mixed", "red", "organic"];
    const qualities = ["Premium", "Standard", "Premium", "Organic"];
    const quantities = [3, 5, 2, 1];
    const locations = ["Addis Ababa, Kolfe", "Addis Ababa, Akaki", "Addis Ababa, Bole", "Addis Ababa, Nifas Silk"];
    const images = [
      "https://images.unsplash.com/photo-1592997571659-0b21ff64313b",
      "https://images.unsplash.com/photo-1586201375761-83865001e8c7",
      "https://images.unsplash.com/photo-1623227866882-c005c26dfe41",
      "https://images.unsplash.com/photo-1595229207662-35aaefe34647"
    ];
    
    // Create 4 sample user accounts first
    const usernames = ["abebe", "tigist", "daniel", "sara"];
    const userIds: number[] = [];
    
    usernames.forEach(username => {
      this.createUser({
        username,
        password: "password123", // In a real app, this would be hashed
        displayName: `${username.charAt(0).toUpperCase() + username.slice(1)} T.`,
        userType: "farmer",
        location: "Addis Ababa",
        firebaseUid: `sample-firebase-uid-${username}`
      }).then(user => {
        userIds.push(user.id);
      });
    });
    
    // Add sample products
    setTimeout(() => {
      for (let i = 0; i < productTitles.length; i++) {
        this.createProduct({
          title: productTitles[i],
          type: productTypes[i],
          quality: qualities[i],
          quantity: quantities[i],
          price: prices[i],
          location: locations[i],
          description: `High-quality ${productTitles[i]} from a verified seller. Great for making injera and other traditional Ethiopian dishes.`,
          image: images[i],
          sellerId: userIds[i % userIds.length]
        });
      }
    }, 100); // Small delay to ensure users are created first
  }
  
  private generateHistoricalPriceData(days: number): { date: string; magna: number; mixed: number; sergegna: number; }[] {
    const data = [];
    const today = new Date();
    
    // Base prices
    let magnaPrice = 6500;
    let mixedPrice = 5800;
    let sergegnaPrice = 5200;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Add some randomness to create realistic price movements
      magnaPrice += Math.random() * 100 - 50;
      mixedPrice += Math.random() * 80 - 40;
      sergegnaPrice += Math.random() * 60 - 30;
      
      // Ensure prices don't go too low
      magnaPrice = Math.max(magnaPrice, 5800);
      mixedPrice = Math.max(mixedPrice, 5000);
      sergegnaPrice = Math.max(sergegnaPrice, 4500);
      
      data.push({
        date: date.toISOString().split('T')[0],
        magna: Math.round(magnaPrice),
        mixed: Math.round(mixedPrice),
        sergegna: Math.round(sergegnaPrice)
      });
    }
    
    return data;
  }
}

export const storage = new MemStorage();
