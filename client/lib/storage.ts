import AsyncStorage from "@react-native-async-storage/async-storage";
import { Category, RateItem, RateHistory } from "@/types/rate";

const CATEGORIES_KEY = "@scrap_categories";
const SETTINGS_KEY = "@scrap_settings";
const RATE_HISTORY_KEY = "@rate_history";

export interface AppSettings {
  currency: string;
  defaultUnit: string;
  displayName: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  currency: "Rs",
  defaultUnit: "kg",
  displayName: "",
};

// Categories
export async function getCategories(): Promise<Category[]> {
  try {
    const data = await AsyncStorage.getItem(CATEGORIES_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error reading categories:", error);
    return [];
  }
}

export async function saveCategories(categories: Category[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error("Error saving categories:", error);
    throw error;
  }
}

export async function addCategory(name: string, icon: string): Promise<Category> {
  const categories = await getCategories();
  const newCategory: Category = {
    id: Date.now().toString(),
    name: name.trim(),
    icon,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  categories.unshift(newCategory);
  await saveCategories(categories);
  return newCategory;
}

export async function updateCategory(id: string, updates: Partial<Pick<Category, "name" | "icon">>): Promise<Category | null> {
  const categories = await getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;

  categories[index] = {
    ...categories[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await saveCategories(categories);
  return categories[index];
}

export async function deleteCategory(id: string): Promise<boolean> {
  const categories = await getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;
  await saveCategories(filtered);
  return true;
}

// Rate Items within a Category
export async function addRateItem(
  categoryId: string,
  item: Omit<RateItem, "id" | "updatedAt">
): Promise<RateItem | null> {
  const categories = await getCategories();
  const index = categories.findIndex((c) => c.id === categoryId);
  if (index === -1) return null;

  const newItem: RateItem = {
    ...item,
    id: Date.now().toString(),
    updatedAt: new Date().toISOString(),
    rateHistory: [{ date: formatDate(), rate: item.rate }],
  };

  categories[index].items.unshift(newItem);
  categories[index].updatedAt = new Date().toISOString();
  await saveCategories(categories);
  return newItem;
}

export async function updateRateItem(
  categoryId: string,
  itemId: string,
  updates: Partial<Omit<RateItem, "id">>
): Promise<RateItem | null> {
  const categories = await getCategories();
  const catIndex = categories.findIndex((c) => c.id === categoryId);
  if (catIndex === -1) return null;

  const itemIndex = categories[catIndex].items.findIndex((i) => i.id === itemId);
  if (itemIndex === -1) return null;

  const currentItem = categories[catIndex].items[itemIndex];
  const today = formatDate();
  
  // Update rate history if rate changed
  let rateHistory = currentItem.rateHistory || [];
  if (updates.rate !== undefined && updates.rate !== currentItem.rate) {
    // Check if we already have an entry for today
    const todayIndex = rateHistory.findIndex(h => h.date === today);
    if (todayIndex >= 0) {
      rateHistory[todayIndex].rate = updates.rate;
    } else {
      // Add new entry and keep only last 10 days
      rateHistory = [{ date: today, rate: updates.rate }, ...rateHistory].slice(0, 10);
    }
  }

  categories[catIndex].items[itemIndex] = {
    ...currentItem,
    ...updates,
    rateHistory,
    updatedAt: new Date().toISOString(),
  };
  categories[catIndex].updatedAt = new Date().toISOString();
  await saveCategories(categories);
  return categories[catIndex].items[itemIndex];
}

export async function deleteRateItem(categoryId: string, itemId: string): Promise<boolean> {
  const categories = await getCategories();
  const catIndex = categories.findIndex((c) => c.id === categoryId);
  if (catIndex === -1) return false;

  const filtered = categories[catIndex].items.filter((i) => i.id !== itemId);
  if (filtered.length === categories[catIndex].items.length) return false;

  categories[catIndex].items = filtered;
  categories[catIndex].updatedAt = new Date().toISOString();
  await saveCategories(categories);
  return true;
}

export async function getCategory(id: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.id === id) || null;
}

// Settings
export async function getSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    if (data) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error reading settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  try {
    const current = await getSettings();
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
}

export function formatCurrency(amount: number, currency: string = "Rs"): string {
  return `${currency} ${amount.toLocaleString("en-PK")}`;
}

export function formatDate(date: Date = new Date()): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Abhi Abhi";
  if (diffMins < 60) return `${diffMins} min pehle`;
  if (diffHours < 24) return `${diffHours} ghante pehle`;
  if (diffDays < 7) return `${diffDays} din pehle`;

  return date.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

// Get last N days dates
export function getLastNDays(n: number = 10): string[] {
  const dates: string[] = [];
  for (let i = 0; i < n; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(formatDate(date));
  }
  return dates;
}

// Generate rate history for demo (past 10 days)
export function generateDemoRateHistory(currentRate: number): RateHistory[] {
  const history: RateHistory[] = [];
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    // Add some variation to rates (±5%)
    const variation = 1 + (Math.random() - 0.5) * 0.1;
    const rate = i === 0 ? currentRate : Math.round(currentRate * variation);
    history.push({ date: formatDate(date), rate });
  }
  return history;
}
