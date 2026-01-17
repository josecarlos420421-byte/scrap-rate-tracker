import { db } from "./db";
import { categories, rateItems } from "@shared/schema";

const INITIAL_CATEGORIES = [
  { name: "LOHA", icon: "layers", color: "#B71C1C", sortOrder: 0 },
  { name: "COPPER", icon: "circle", color: "#E65100", sortOrder: 1 },
  { name: "ALUMINUM", icon: "square", color: "#00695C", sortOrder: 2 },
  { name: "PLASTIC", icon: "box", color: "#C2185B", sortOrder: 3 },
  { name: "BRASS", icon: "award", color: "#FF8F00", sortOrder: 4 },
  { name: "BATTERY", icon: "battery", color: "#2E7D32", sortOrder: 5 },
  { name: "PAPER", icon: "file-text", color: "#6D4C41", sortOrder: 6 },
  { name: "STEEL", icon: "shield", color: "#455A64", sortOrder: 7 },
  { name: "ELECTRONICS", icon: "cpu", color: "#1565C0", sortOrder: 8 },
  { name: "GLASS", icon: "droplet", color: "#00838F", sortOrder: 9 },
  { name: "RUBBER", icon: "disc", color: "#7B1FA2", sortOrder: 10 },
  { name: "SILVER", icon: "star", color: "#757575", sortOrder: 11 },
  { name: "ZINC", icon: "hexagon", color: "#9E9D24", sortOrder: 12 },
];

const INITIAL_ITEMS: Record<string, { name: string; rate: number; unit: string }[]> = {
  "LOHA": [
    { name: "Iron Rods (Sariya)", rate: 85, unit: "kg" },
    { name: "Cast Iron", rate: 45, unit: "kg" },
    { name: "Iron Sheets", rate: 55, unit: "kg" },
    { name: "Galvanized Iron", rate: 60, unit: "kg" },
    { name: "Iron Pipes", rate: 50, unit: "kg" },
  ],
  "COPPER": [
    { name: "Copper Wire", rate: 850, unit: "kg" },
    { name: "Copper Pipe", rate: 820, unit: "kg" },
    { name: "Copper Scrap Mixed", rate: 780, unit: "kg" },
    { name: "Copper Bright", rate: 900, unit: "kg" },
  ],
  "ALUMINUM": [
    { name: "Aluminum Cans", rate: 160, unit: "kg" },
    { name: "Aluminum Sheet", rate: 180, unit: "kg" },
    { name: "Aluminum Wire", rate: 175, unit: "kg" },
    { name: "Aluminum Utensils", rate: 165, unit: "kg" },
  ],
  "PLASTIC": [
    { name: "PET Bottles", rate: 35, unit: "kg" },
    { name: "HDPE (Hard Plastic)", rate: 40, unit: "kg" },
    { name: "PP (Polypropylene)", rate: 38, unit: "kg" },
    { name: "PVC Pipes", rate: 32, unit: "kg" },
  ],
  "BRASS": [
    { name: "Brass Fittings", rate: 550, unit: "kg" },
    { name: "Brass Mixed", rate: 520, unit: "kg" },
    { name: "Brass Radiator", rate: 480, unit: "kg" },
  ],
  "BATTERY": [
    { name: "Car Battery (Used)", rate: 140, unit: "kg" },
    { name: "UPS Battery", rate: 135, unit: "kg" },
    { name: "Dry Cell Battery", rate: 45, unit: "kg" },
  ],
  "PAPER": [
    { name: "Newspaper", rate: 22, unit: "kg" },
    { name: "Cardboard", rate: 18, unit: "kg" },
    { name: "Office Paper", rate: 25, unit: "kg" },
    { name: "Books/Magazines", rate: 20, unit: "kg" },
  ],
  "STEEL": [
    { name: "Stainless Steel", rate: 120, unit: "kg" },
    { name: "Mild Steel", rate: 45, unit: "kg" },
    { name: "Steel Scrap Mixed", rate: 42, unit: "kg" },
  ],
  "ELECTRONICS": [
    { name: "Computer/Laptop", rate: 250, unit: "piece" },
    { name: "Mobile Phone", rate: 50, unit: "piece" },
    { name: "TV/Monitor", rate: 150, unit: "piece" },
    { name: "AC Unit", rate: 800, unit: "piece" },
  ],
  "GLASS": [
    { name: "Glass Bottles", rate: 8, unit: "kg" },
    { name: "Window Glass", rate: 12, unit: "kg" },
    { name: "Broken Glass Mixed", rate: 5, unit: "kg" },
  ],
  "RUBBER": [
    { name: "Car Tyres", rate: 25, unit: "kg" },
    { name: "Truck Tyres", rate: 28, unit: "kg" },
    { name: "Rubber Scrap", rate: 15, unit: "kg" },
  ],
  "SILVER": [
    { name: "Silver Jewelry", rate: 75000, unit: "tola" },
    { name: "Silver Coins", rate: 72000, unit: "tola" },
    { name: "Silver Scrap", rate: 70000, unit: "tola" },
  ],
  "ZINC": [
    { name: "Zinc Ingots", rate: 280, unit: "kg" },
    { name: "Zinc Die Cast", rate: 250, unit: "kg" },
    { name: "Zinc Scrap", rate: 220, unit: "kg" },
  ],
};

async function seed() {
  console.log("Seeding database...");
  
  for (const cat of INITIAL_CATEGORIES) {
    const [createdCategory] = await db.insert(categories).values(cat).returning();
    console.log(`Created category: ${createdCategory.name}`);
    
    const items = INITIAL_ITEMS[cat.name] || [];
    for (const item of items) {
      await db.insert(rateItems).values({
        categoryId: createdCategory.id,
        name: item.name,
        rate: item.rate,
        unit: item.unit,
        rateHistory: [],
      });
      console.log(`  - Created item: ${item.name}`);
    }
  }
  
  console.log("Seeding completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
