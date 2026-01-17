import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const categories = pgTable("categories", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  icon: text("icon").notNull().default("package"),
  color: text("color").notNull().default("#B71C1C"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  items: many(rateItems),
}));

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true,
  color: true,
  sortOrder: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const rateItems = pgTable("rate_items", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  rate: real("rate").notNull().default(0),
  unit: text("unit").notNull().default("kg"),
  notes: text("notes"),
  rateHistory: jsonb("rate_history").$type<{ date: string; rate: number }[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const rateItemsRelations = relations(rateItems, ({ one }) => ({
  category: one(categories, {
    fields: [rateItems.categoryId],
    references: [categories.id],
  }),
}));

export const insertRateItemSchema = createInsertSchema(rateItems).pick({
  categoryId: true,
  name: true,
  rate: true,
  unit: true,
  notes: true,
});

export type InsertRateItem = z.infer<typeof insertRateItemSchema>;
export type RateItem = typeof rateItems.$inferSelect;

export const activationCodes = pgTable("activation_codes", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  isUsed: text("is_used").notNull().default("false"),
  usedBy: text("used_by"),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertActivationCodeSchema = createInsertSchema(activationCodes).pick({
  code: true,
});

export type InsertActivationCode = z.infer<typeof insertActivationCodeSchema>;
export type ActivationCode = typeof activationCodes.$inferSelect;

export const importantNotes = pgTable("important_notes", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  isActive: text("is_active").notNull().default("true"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertImportantNoteSchema = createInsertSchema(importantNotes).pick({
  content: true,
  isActive: true,
});

export type InsertImportantNote = z.infer<typeof insertImportantNoteSchema>;
export type ImportantNote = typeof importantNotes.$inferSelect;
