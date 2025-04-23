import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  phoneNumber: text("phone_number"),
  email: text("email"),
  photoURL: text("photo_url"),
  userType: text("user_type").default("farmer"),
  location: text("location"),
  firebaseUid: text("firebase_uid").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  quality: text("quality").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  image: text("image"),
  sellerId: integer("seller_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Market Prices table
export const marketPrices = pgTable("market_prices", {
  id: serial("id").primaryKey(),
  market: text("market").notNull(),
  product: text("product").notNull(),
  variety: text("variety").notNull(),
  price: integer("price").notNull(),
  unit: text("unit").default("quintal"),
  source: text("source"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// SMS Subscriptions table
export const smsSubscriptions = pgTable("sms_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  phoneNumber: text("phone_number").notNull(),
  marketId: text("market_id").notNull(),
  productId: text("product_id").notNull(),
  frequency: text("frequency").default("daily"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas for insertions
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarketPriceSchema = createInsertSchema(marketPrices).omit({
  id: true,
  recordedAt: true,
});

export const insertSmsSubscriptionSchema = createInsertSchema(smsSubscriptions).omit({
  id: true, 
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertMarketPrice = z.infer<typeof insertMarketPriceSchema>;
export type MarketPrice = typeof marketPrices.$inferSelect;

export type InsertSmsSubscription = z.infer<typeof insertSmsSubscriptionSchema>;
export type SmsSubscription = typeof smsSubscriptions.$inferSelect;
