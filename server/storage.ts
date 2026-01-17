import { 
  users, categories, rateItems, activationCodes, importantNotes,
  type User, type InsertUser,
  type Category, type InsertCategory,
  type RateItem, type InsertRateItem,
  type ActivationCode, type InsertActivationCode,
  type ImportantNote, type InsertImportantNote
} from "@shared/schema";
import { db } from "./db";
import { eq, asc, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
  
  getRateItemsByCategory(categoryId: string): Promise<RateItem[]>;
  getRateItem(id: string): Promise<RateItem | undefined>;
  createRateItem(item: InsertRateItem): Promise<RateItem>;
  updateRateItem(id: string, item: Partial<InsertRateItem & { rateHistory: { date: string; rate: number }[] }>): Promise<RateItem | undefined>;
  deleteRateItem(id: string): Promise<boolean>;
  
  getAllActivationCodes(): Promise<ActivationCode[]>;
  getActivationCode(code: string): Promise<ActivationCode | undefined>;
  createActivationCodes(codes: string[]): Promise<ActivationCode[]>;
  useActivationCode(code: string, usedBy: string): Promise<boolean>;
  
  getAllImportantNotes(): Promise<ImportantNote[]>;
  getActiveImportantNotes(): Promise<ImportantNote[]>;
  createImportantNote(note: InsertImportantNote): Promise<ImportantNote>;
  updateImportantNote(id: string, note: Partial<InsertImportantNote>): Promise<ImportantNote | undefined>;
  deleteImportantNote(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(asc(categories.sortOrder));
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db
      .update(categories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result.length > 0;
  }

  async getRateItemsByCategory(categoryId: string): Promise<RateItem[]> {
    return db.select().from(rateItems).where(eq(rateItems.categoryId, categoryId)).orderBy(asc(rateItems.name));
  }

  async getRateItem(id: string): Promise<RateItem | undefined> {
    const [item] = await db.select().from(rateItems).where(eq(rateItems.id, id));
    return item || undefined;
  }

  async createRateItem(item: InsertRateItem): Promise<RateItem> {
    const [newItem] = await db.insert(rateItems).values(item).returning();
    return newItem;
  }

  async updateRateItem(id: string, item: Partial<InsertRateItem & { rateHistory: { date: string; rate: number }[] }>): Promise<RateItem | undefined> {
    const [updated] = await db
      .update(rateItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(rateItems.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteRateItem(id: string): Promise<boolean> {
    const result = await db.delete(rateItems).where(eq(rateItems.id, id)).returning();
    return result.length > 0;
  }

  async getAllActivationCodes(): Promise<ActivationCode[]> {
    return db.select().from(activationCodes).orderBy(desc(activationCodes.createdAt));
  }

  async getActivationCode(code: string): Promise<ActivationCode | undefined> {
    const [found] = await db.select().from(activationCodes).where(eq(activationCodes.code, code.toUpperCase()));
    return found || undefined;
  }

  async createActivationCodes(codes: string[]): Promise<ActivationCode[]> {
    const values = codes.map(code => ({ code: code.toUpperCase() }));
    return db.insert(activationCodes).values(values).returning();
  }

  async useActivationCode(code: string, usedBy: string): Promise<boolean> {
    const [updated] = await db
      .update(activationCodes)
      .set({ isUsed: "true", usedBy, usedAt: new Date() })
      .where(eq(activationCodes.code, code.toUpperCase()))
      .returning();
    return !!updated;
  }

  async getAllImportantNotes(): Promise<ImportantNote[]> {
    return db.select().from(importantNotes).orderBy(desc(importantNotes.createdAt));
  }

  async getActiveImportantNotes(): Promise<ImportantNote[]> {
    return db.select().from(importantNotes).where(eq(importantNotes.isActive, "true")).orderBy(desc(importantNotes.createdAt));
  }

  async createImportantNote(note: InsertImportantNote): Promise<ImportantNote> {
    const [newNote] = await db.insert(importantNotes).values(note).returning();
    return newNote;
  }

  async updateImportantNote(id: string, note: Partial<InsertImportantNote>): Promise<ImportantNote | undefined> {
    const [updated] = await db
      .update(importantNotes)
      .set({ ...note, updatedAt: new Date() })
      .where(eq(importantNotes.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteImportantNote(id: string): Promise<boolean> {
    const result = await db.delete(importantNotes).where(eq(importantNotes.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
