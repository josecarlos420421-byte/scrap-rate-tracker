import { Category, RateItem, RateHistory } from "@/types/rate";
import { getCategories, saveCategories, formatDate } from "@/lib/storage";

// Generate rate history for past 10 days
function generateRateHistory(currentRate: number): RateHistory[] {
  const history: RateHistory[] = [];
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    // Add some variation to rates (±3%)
    const variation = 1 + (Math.random() - 0.5) * 0.06;
    const rate = i === 0 ? currentRate : Math.round(currentRate * variation * 100) / 100;
    history.push({ date: formatDate(date), rate });
  }
  return history;
}

// LOHA (Iron) - Complete List - 25 items
const LOHA_ITEMS: Omit<RateItem, "id" | "updatedAt">[] = [
  { name: "آڑھت چھانٹ", rate: 125.92, unit: "kg", notes: "4700 per 40kg" },
  { name: "آڑھت ٹوک", rate: 128.59, unit: "kg", notes: "4800 per 40kg" },
  { name: "آڑھت نگر ٹوک", rate: 131.28, unit: "kg", notes: "4900 per 40kg" },
  { name: "آڑھت قینچی ٹوک", rate: 136.64, unit: "kg", notes: "5100 per 40kg" },
  { name: "کمپریسر ڈوم", rate: 162, unit: "kg", notes: "روٹین پر" },
  { name: "سکریپ بنگھار", rate: 152, unit: "kg" },
  { name: "کمپریسر دیگ بڑی", rate: 121, unit: "kg" },
  { name: "کمپریسر دیگ چھوٹی", rate: 127, unit: "kg" },
  { name: "دیگی سکریپ ولایتی مال", rate: 125, unit: "kg" },
  { name: "دیگی سکریپ موٹر مال", rate: 109, unit: "kg" },
  { name: "دیگی سکریپ مکس مال", rate: 107, unit: "kg" },
  { name: "دیگی سکریپ دیسی ٹوکہ مشین", rate: 92, unit: "kg" },
  { name: "سکریپ لوہا بورا صاف", rate: 122, unit: "kg" },
  { name: "سکریپ دیگی بورا صاف", rate: 97, unit: "kg" },
  { name: "ٹین ڈبہ", rate: 107, unit: "kg" },
  { name: "لوہا پرانا (جنرل)", rate: 145, unit: "kg", notes: "General Old Iron" },
  { name: "لوہا صاف سکریپ", rate: 155, unit: "kg", notes: "Clean Scrap" },
  { name: "لوہا مکس سکریپ", rate: 135, unit: "kg", notes: "Mixed Iron" },
  { name: "ہیوی سٹیل سکریپ", rate: 185, unit: "kg", notes: "Heavy Steel" },
  { name: "کاسٹ آئرن", rate: 140, unit: "kg", notes: "Cast Iron" },
  { name: "MS پلیٹ سکریپ", rate: 165, unit: "kg", notes: "MS Plate" },
  { name: "لوہا چادر", rate: 150, unit: "kg", notes: "Iron Sheet" },
  { name: "سریا پرانا", rate: 160, unit: "kg", notes: "Old Rods" },
  { name: "لوہا تار", rate: 130, unit: "kg", notes: "Iron Wire" },
  { name: "لوہا پائپ", rate: 145, unit: "kg", notes: "Iron Pipe" },
];

// COPPER (Tamba) - Complete List - 15 items
const COPPER_ITEMS: Omit<RateItem, "id" | "updatedAt">[] = [
  { name: "تانبا پرانا / سکریپ", rate: 2100, unit: "kg", notes: "Scrap Copper" },
  { name: "تانبا نیا", rate: 2800, unit: "kg", notes: "New/Refined Copper" },
  { name: "تانبا کیبل", rate: 1900, unit: "kg", notes: "Cable Copper" },
  { name: "تانبا موٹر والا", rate: 2000, unit: "kg", notes: "Motor Copper" },
  { name: "تانبا ٹرانسفارمر", rate: 2200, unit: "kg", notes: "Transformer Copper" },
  { name: "تانبا مکس", rate: 1850, unit: "kg", notes: "Mixed Copper" },
  { name: "تانبا جلا ہوا", rate: 2350, unit: "kg", notes: "Burnt Copper" },
  { name: "تانبا پائپ", rate: 2150, unit: "kg", notes: "Copper Pipe" },
  { name: "تانبا تار", rate: 2250, unit: "kg", notes: "Copper Wire" },
  { name: "تانبا چادر", rate: 2300, unit: "kg", notes: "Copper Sheet" },
  { name: "تانبا کوائل", rate: 2100, unit: "kg", notes: "Copper Coil" },
  { name: "تانبا AC والا", rate: 2050, unit: "kg", notes: "AC Copper" },
  { name: "تانبا فریج والا", rate: 1950, unit: "kg", notes: "Fridge Copper" },
  { name: "تانبا برتن", rate: 2400, unit: "kg", notes: "Utensil Copper" },
  { name: "تانبا ریڈی ایٹر", rate: 1800, unit: "kg", notes: "Radiator Copper" },
];

// ALUMINUM - Complete List - 15 items
const ALUMINUM_ITEMS: Omit<RateItem, "id" | "updatedAt">[] = [
  { name: "ایلومینیم سکریپ", rate: 1100, unit: "kg", notes: "Scrap Aluminum" },
  { name: "ایلومینیم کھڑکی", rate: 1200, unit: "kg", notes: "Window Aluminum" },
  { name: "ایلومینیم برتن", rate: 1050, unit: "kg", notes: "Utensil Aluminum" },
  { name: "ایلومینیم تار", rate: 1150, unit: "kg", notes: "Wire Aluminum" },
  { name: "ایلومینیم کین (پیپسی)", rate: 480, unit: "kg", notes: "Pepsi/Coke Cans" },
  { name: "ایلومینیم مکس", rate: 1000, unit: "kg", notes: "Mixed Aluminum" },
  { name: "ایلومینیم چادر", rate: 1180, unit: "kg", notes: "Aluminum Sheet" },
  { name: "ایلومینیم پائپ", rate: 1120, unit: "kg", notes: "Aluminum Pipe" },
  { name: "ایلومینیم پروفائل", rate: 1250, unit: "kg", notes: "Aluminum Profile" },
  { name: "ایلومینیم ریڈی ایٹر", rate: 950, unit: "kg", notes: "Radiator Aluminum" },
  { name: "ایلومینیم AC", rate: 1080, unit: "kg", notes: "AC Aluminum" },
  { name: "ایلومینیم انجن", rate: 900, unit: "kg", notes: "Engine Aluminum" },
  { name: "ایلومینیم وہیل", rate: 1150, unit: "kg", notes: "Wheel Aluminum" },
  { name: "ایلومینیم فوائل", rate: 850, unit: "kg", notes: "Aluminum Foil" },
  { name: "ایلومینیم سلینڈر", rate: 1100, unit: "kg", notes: "Cylinder Aluminum" },
];

// PLASTIC - Complete List - 15 items
const PLASTIC_ITEMS: Omit<RateItem, "id" | "updatedAt">[] = [
  { name: "پلاسٹک مکس", rate: 70, unit: "kg", notes: "Mixed Plastic" },
  { name: "پلاسٹک بوتل", rate: 85, unit: "kg", notes: "Plastic Bottles" },
  { name: "پلاسٹک بالٹی", rate: 75, unit: "kg", notes: "Buckets" },
  { name: "پلاسٹک کرسی", rate: 65, unit: "kg", notes: "Chairs" },
  { name: "پلاسٹک پائپ", rate: 80, unit: "kg", notes: "Pipes" },
  { name: "پلاسٹک شیٹ", rate: 60, unit: "kg", notes: "Sheets" },
  { name: "پلاسٹک ڈبہ", rate: 72, unit: "kg", notes: "Containers" },
  { name: "پلاسٹک ٹوکری", rate: 68, unit: "kg", notes: "Baskets" },
  { name: "پلاسٹک کھلونے", rate: 55, unit: "kg", notes: "Toys" },
  { name: "PET بوتل", rate: 90, unit: "kg", notes: "PET Bottles" },
  { name: "HDPE پلاسٹک", rate: 85, unit: "kg", notes: "HDPE" },
  { name: "LDPE پلاسٹک", rate: 75, unit: "kg", notes: "LDPE" },
  { name: "PP پلاسٹک", rate: 80, unit: "kg", notes: "Polypropylene" },
  { name: "PVC پائپ", rate: 65, unit: "kg", notes: "PVC Pipe" },
  { name: "پلاسٹک فرنیچر", rate: 70, unit: "kg", notes: "Furniture" },
];

// BRASS (Pital) - Complete List - 12 items
const BRASS_ITEMS: Omit<RateItem, "id" | "updatedAt">[] = [
  { name: "پیتل سکریپ", rate: 1580, unit: "kg", notes: "Scrap Brass" },
  { name: "پیتل نیا", rate: 1750, unit: "kg", notes: "New Brass" },
  { name: "پیتل نل والا", rate: 1620, unit: "kg", notes: "Tap Brass" },
  { name: "پیتل برتن", rate: 1680, unit: "kg", notes: "Utensil Brass" },
  { name: "پیتل مکس", rate: 1450, unit: "kg", notes: "Mixed Brass" },
  { name: "پیتل تار", rate: 1550, unit: "kg", notes: "Brass Wire" },
  { name: "پیتل چادر", rate: 1600, unit: "kg", notes: "Brass Sheet" },
  { name: "پیتل پائپ", rate: 1580, unit: "kg", notes: "Brass Pipe" },
  { name: "پیتل والو", rate: 1650, unit: "kg", notes: "Brass Valve" },
  { name: "پیتل فٹنگ", rate: 1620, unit: "kg", notes: "Brass Fitting" },
  { name: "پیتل سجاوٹ", rate: 1500, unit: "kg", notes: "Decorative Brass" },
  { name: "پیتل کلید", rate: 1550, unit: "kg", notes: "Brass Keys/Locks" },
];

// BATTERY - Complete List - 12 items
const BATTERY_ITEMS: Omit<RateItem, "id" | "updatedAt">[] = [
  { name: "بیٹری سکریپ", rate: 310, unit: "kg", notes: "Scrap Battery" },
  { name: "بیٹری UPS والی", rate: 313, unit: "kg", notes: "UPS Battery" },
  { name: "بیٹری گاڑی والی", rate: 312, unit: "kg", notes: "Car Battery" },
  { name: "بیٹری موٹر سائیکل", rate: 305, unit: "kg", notes: "Bike Battery" },
  { name: "بیٹری ٹرک والی", rate: 310, unit: "kg", notes: "Truck Battery" },
  { name: "بیٹری انورٹر", rate: 315, unit: "kg", notes: "Inverter Battery" },
  { name: "بیٹری ٹیوبلر", rate: 320, unit: "kg", notes: "Tubular Battery" },
  { name: "بیٹری ڈرائی", rate: 300, unit: "kg", notes: "Dry Battery" },
  { name: "بیٹری AGS", rate: 310, unit: "kg", notes: "AGS Battery" },
  { name: "بیٹری Phoenix", rate: 312, unit: "kg", notes: "Phoenix Battery" },
  { name: "بیٹری Osaka", rate: 308, unit: "kg", notes: "Osaka Battery" },
  { name: "بیٹری Exide", rate: 315, unit: "kg", notes: "Exide Battery" },
];

// PAPER (Kaghaz) - Complete List - 12 items
const PAPER_ITEMS: Omit<RateItem, "id" | "updatedAt">[] = [
  { name: "ردی کاغذ", rate: 70, unit: "kg", notes: "Waste Paper" },
  { name: "اخبار", rate: 75, unit: "kg", notes: "Newspaper" },
  { name: "کارڈ بورڈ", rate: 65, unit: "kg", notes: "Cardboard" },
  { name: "کتابیں", rate: 60, unit: "kg", notes: "Books" },
  { name: "کاپی رجسٹر", rate: 55, unit: "kg", notes: "Registers" },
  { name: "آفس پیپر", rate: 80, unit: "kg", notes: "Office Paper" },
  { name: "میگزین", rate: 65, unit: "kg", notes: "Magazines" },
  { name: "پیکنگ باکس", rate: 60, unit: "kg", notes: "Packing Boxes" },
  { name: "ڈبے", rate: 55, unit: "kg", notes: "Cartons" },
  { name: "کاغذ مکس", rate: 50, unit: "kg", notes: "Mixed Paper" },
  { name: "کاغذ سفید", rate: 85, unit: "kg", notes: "White Paper" },
  { name: "کاغذ رنگین", rate: 45, unit: "kg", notes: "Colored Paper" },
];

// STEEL - Complete List - 12 items
const STEEL_ITEMS: Omit<RateItem, "id" | "updatedAt">[] = [
  { name: "سٹیل سکریپ", rate: 215, unit: "kg", notes: "Steel Scrap" },
  { name: "سٹیل باڈی", rate: 210, unit: "kg", notes: "Steel Body" },
  { name: "سٹیل پائپ", rate: 220, unit: "kg", notes: "Steel Pipe" },
  { name: "سٹیل چادر", rate: 205, unit: "kg", notes: "Steel Sheet" },
  { name: "سٹیل ہیوی", rate: 185, unit: "kg", notes: "Heavy Steel" },
  { name: "سٹیل میکس", rate: 180, unit: "kg", notes: "Max Steel" },
  { name: "سٹیل فرنیچر", rate: 195, unit: "kg", notes: "Steel Furniture" },
  { name: "سٹیل دروازے", rate: 200, unit: "kg", notes: "Steel Doors" },
  { name: "سٹیل الماری", rate: 190, unit: "kg", notes: "Steel Almirah" },
  { name: "سٹیل گرل", rate: 185, unit: "kg", notes: "Steel Grill" },
  { name: "سٹیل ٹینکی", rate: 195, unit: "kg", notes: "Steel Tank" },
  { name: "سٹیل ڈرم", rate: 175, unit: "kg", notes: "Steel Drum" },
];

// ELECTRONICS (Electronic Scrap) - New Category - 12 items
const ELECTRONICS_ITEMS: Omit<RateItem, "id" | "updatedAt">[] = [
  { name: "کمپیوٹر سکریپ", rate: 150, unit: "kg", notes: "Computer Scrap" },
  { name: "موبائل فون", rate: 500, unit: "piece", notes: "Mobile Phones" },
  { name: "ٹی وی پرانا", rate: 200, unit: "piece", notes: "Old TV" },
  { name: "LCD/LED ٹی وی", rate: 350, unit: "piece", notes: "LCD/LED TV" },
  { name: "فریج پرانا", rate: 450, unit: "piece", notes: "Old Fridge" },
  { name: "AC پرانا", rate: 500, unit: "piece", notes: "Old AC" },
  { name: "واشنگ مشین", rate: 400, unit: "piece", notes: "Washing Machine" },
  { name: "مائیکرو ویو", rate: 200, unit: "piece", notes: "Microwave" },
  { name: "پرنٹر", rate: 150, unit: "piece", notes: "Printer" },
  { name: "لیپ ٹاپ", rate: 600, unit: "piece", notes: "Laptop" },
  { name: "UPS پرانا", rate: 350, unit: "piece", notes: "Old UPS" },
  { name: "سی پی یو", rate: 250, unit: "piece", notes: "CPU" },
];

// GLASS (Sheesha) - New Category - 8 items
const GLASS_ITEMS: Omit<RateItem, "id" | "updatedAt">[] = [
  { name: "شیشہ سکریپ", rate: 25, unit: "kg", notes: "Glass Scrap" },
  { name: "شیشہ بوتل", rate: 30, unit: "kg", notes: "Glass Bottles" },
  { name: "شیشہ شفاف", rate: 35, unit: "kg", notes: "Clear Glass" },
  { name: "شیشہ رنگین", rate: 20, unit: "kg", notes: "Colored Glass" },
  { name: "شیشہ کھڑکی", rate: 28, unit: "kg", notes: "Window Glass" },
  { name: "شیشہ آئینہ", rate: 22, unit: "kg", notes: "Mirror Glass" },
  { name: "شیشہ ٹوٹا", rate: 15, unit: "kg", notes: "Broken Glass" },
  { name: "شیشہ بلب", rate: 18, unit: "kg", notes: "Bulb Glass" },
];

// RUBBER (Rubber) - New Category - 8 items
const RUBBER_ITEMS: Omit<RateItem, "id" | "updatedAt">[] = [
  { name: "ٹائر پرانا", rate: 45, unit: "kg", notes: "Old Tires" },
  { name: "ٹیوب پرانی", rate: 40, unit: "kg", notes: "Old Tubes" },
  { name: "ربڑ مکس", rate: 35, unit: "kg", notes: "Mixed Rubber" },
  { name: "ربڑ شیٹ", rate: 50, unit: "kg", notes: "Rubber Sheet" },
  { name: "ربڑ پائپ", rate: 42, unit: "kg", notes: "Rubber Pipe" },
  { name: "ربڑ میٹ", rate: 38, unit: "kg", notes: "Rubber Mat" },
  { name: "ربڑ بیلٹ", rate: 55, unit: "kg", notes: "Rubber Belt" },
  { name: "ربڑ سول", rate: 48, unit: "kg", notes: "Rubber Sole" },
];

// SILVER (Chandi) - New Category - 6 items
const SILVER_ITEMS: Omit<RateItem, "id" | "updatedAt">[] = [
  { name: "چاندی سکریپ", rate: 2350, unit: "tola", notes: "Silver Scrap" },
  { name: "چاندی زیور", rate: 2400, unit: "tola", notes: "Silver Jewelry" },
  { name: "چاندی برتن", rate: 2300, unit: "tola", notes: "Silver Utensils" },
  { name: "چاندی سکے", rate: 2450, unit: "tola", notes: "Silver Coins" },
  { name: "ہارڈ سلور", rate: 585, unit: "kg", notes: "Hard Silver" },
  { name: "سلور کوٹنگ", rate: 550, unit: "kg", notes: "Silver Coating" },
];

// ZINC (Jast) - New Category - 6 items
const ZINC_ITEMS: Omit<RateItem, "id" | "updatedAt">[] = [
  { name: "جست سکریپ", rate: 450, unit: "kg", notes: "Zinc Scrap" },
  { name: "جست چادر", rate: 480, unit: "kg", notes: "Zinc Sheet" },
  { name: "جست پائپ", rate: 460, unit: "kg", notes: "Zinc Pipe" },
  { name: "جست بالٹی", rate: 440, unit: "kg", notes: "Zinc Bucket" },
  { name: "جست ڈرم", rate: 430, unit: "kg", notes: "Zinc Drum" },
  { name: "جست مکس", rate: 420, unit: "kg", notes: "Mixed Zinc" },
];

interface CategorySeed {
  name: string;
  icon: string;
  items: Omit<RateItem, "id" | "updatedAt">[];
}

const ALL_CATEGORIES: CategorySeed[] = [
  { name: "LOHA (لوہا)", icon: "box", items: LOHA_ITEMS },
  { name: "COPPER (تانبا)", icon: "circle", items: COPPER_ITEMS },
  { name: "ALUMINUM (ایلومینیم)", icon: "hexagon", items: ALUMINUM_ITEMS },
  { name: "PLASTIC (پلاسٹک)", icon: "package", items: PLASTIC_ITEMS },
  { name: "BRASS (پیتل)", icon: "disc", items: BRASS_ITEMS },
  { name: "BATTERY (بیٹری)", icon: "square", items: BATTERY_ITEMS },
  { name: "PAPER (کاغذ)", icon: "layers", items: PAPER_ITEMS },
  { name: "STEEL (سٹیل)", icon: "tool", items: STEEL_ITEMS },
  { name: "ELECTRONICS (الیکٹرانکس)", icon: "monitor", items: ELECTRONICS_ITEMS },
  { name: "GLASS (شیشہ)", icon: "droplet", items: GLASS_ITEMS },
  { name: "RUBBER (ربڑ)", icon: "loader", items: RUBBER_ITEMS },
  { name: "SILVER (چاندی)", icon: "star", items: SILVER_ITEMS },
  { name: "ZINC (جست)", icon: "zap", items: ZINC_ITEMS },
];

export async function seedAllData(): Promise<boolean> {
  try {
    const existingCategories = await getCategories();
    
    // Check if already seeded with all categories
    if (existingCategories.length >= ALL_CATEGORIES.length) {
      return false;
    }

    const now = new Date().toISOString();
    
    const categories: Category[] = ALL_CATEGORIES.map((cat, catIndex) => {
      const items: RateItem[] = cat.items.map((item, itemIndex) => ({
        ...item,
        id: `${cat.name.toLowerCase().replace(/[^a-z]/g, "")}_${Date.now()}_${itemIndex}`,
        updatedAt: now,
      }));

      return {
        id: `cat_${Date.now()}_${catIndex}`,
        name: cat.name,
        icon: cat.icon,
        items,
        createdAt: now,
        updatedAt: now,
      };
    });

    await saveCategories(categories);
    return true;
  } catch (error) {
    console.error("Error seeding data:", error);
    return false;
  }
}

export async function clearAllData(): Promise<void> {
  await saveCategories([]);
}

export async function resetAndSeedData(): Promise<boolean> {
  try {
    await clearAllData();
    
    const now = new Date().toISOString();
    
    const categories: Category[] = ALL_CATEGORIES.map((cat, catIndex) => {
      const items: RateItem[] = cat.items.map((item, itemIndex) => ({
        ...item,
        id: `${cat.name.toLowerCase().replace(/[^a-z]/g, "")}_${Date.now()}_${itemIndex}`,
        updatedAt: now,
        rateHistory: generateRateHistory(item.rate),
      }));

      return {
        id: `cat_${Date.now()}_${catIndex}`,
        name: cat.name,
        icon: cat.icon,
        items,
        createdAt: now,
        updatedAt: now,
      };
    });

    await saveCategories(categories);
    return true;
  } catch (error) {
    console.error("Error resetting data:", error);
    return false;
  }
}
