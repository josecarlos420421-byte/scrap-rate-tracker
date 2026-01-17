import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { storage } from "./storage";

const ADMIN_PASSWORD = "FATIMA2024";

function isAdminAuthorized(req: any): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;
  const password = authHeader.replace("Bearer ", "");
  return password === ADMIN_PASSWORD;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.get("/api/categories", async (req, res) => {
    try {
      const allCategories = await storage.getAllCategories();
      const categoriesWithItems = await Promise.all(
        allCategories.map(async (category) => {
          const items = await storage.getRateItemsByCategory(category.id);
          return { ...category, items };
        })
      );
      res.json(categoriesWithItems);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      const items = await storage.getRateItemsByCategory(category.id);
      res.json({ ...category, items });
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  app.post("/api/admin/categories", async (req, res) => {
    if (!isAdminAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const category = await storage.createCategory(req.body);
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.put("/api/admin/categories/:id", async (req, res) => {
    if (!isAdminAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const category = await storage.updateCategory(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", async (req, res) => {
    if (!isAdminAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const success = await storage.deleteCategory(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  app.get("/api/categories/:categoryId/items", async (req, res) => {
    try {
      const items = await storage.getRateItemsByCategory(req.params.categoryId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  app.post("/api/admin/items", async (req, res) => {
    if (!isAdminAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const item = await storage.createRateItem(req.body);
      res.json(item);
    } catch (error) {
      console.error("Error creating item:", error);
      res.status(500).json({ error: "Failed to create item" });
    }
  });

  app.put("/api/admin/items/:id", async (req, res) => {
    if (!isAdminAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const existingItem = await storage.getRateItem(req.params.id);
      if (!existingItem) {
        return res.status(404).json({ error: "Item not found" });
      }
      
      const updateData = { ...req.body };
      if (req.body.rate !== undefined && req.body.rate !== existingItem.rate) {
        const history = existingItem.rateHistory || [];
        const today = new Date().toISOString().split('T')[0];
        const existingTodayIndex = history.findIndex((h: any) => h.date === today);
        
        if (existingTodayIndex >= 0) {
          history[existingTodayIndex].rate = existingItem.rate;
        } else {
          history.unshift({ date: today, rate: existingItem.rate });
        }
        
        updateData.rateHistory = history.slice(0, 10);
      }
      
      const item = await storage.updateRateItem(req.params.id, updateData);
      res.json(item);
    } catch (error) {
      console.error("Error updating item:", error);
      res.status(500).json({ error: "Failed to update item" });
    }
  });

  app.delete("/api/admin/items/:id", async (req, res) => {
    if (!isAdminAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const success = await storage.deleteRateItem(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ error: "Failed to delete item" });
    }
  });

  app.get("/api/activation-codes", async (req, res) => {
    if (!isAdminAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const codes = await storage.getAllActivationCodes();
      res.json(codes);
    } catch (error) {
      console.error("Error fetching activation codes:", error);
      res.status(500).json({ error: "Failed to fetch activation codes" });
    }
  });

  app.post("/api/admin/activation-codes", async (req, res) => {
    if (!isAdminAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { codes } = req.body;
      if (!Array.isArray(codes)) {
        return res.status(400).json({ error: "codes must be an array" });
      }
      const createdCodes = await storage.createActivationCodes(codes);
      res.json(createdCodes);
    } catch (error) {
      console.error("Error creating activation codes:", error);
      res.status(500).json({ error: "Failed to create activation codes" });
    }
  });

  app.post("/api/activate", async (req, res) => {
    try {
      const { code, phoneNumber, transactionId } = req.body;
      
      if (!code || !phoneNumber || !transactionId) {
        return res.status(400).json({ success: false, message: "All fields required" });
      }
      
      const activationCode = await storage.getActivationCode(code);
      
      if (!activationCode) {
        return res.status(400).json({ success: false, message: "Ghalat code - یہ کوڈ غلط ہے" });
      }
      
      if (activationCode.isUsed === "true") {
        return res.status(400).json({ success: false, message: "Yeh code pehle istemal ho chuka hai - یہ کوڈ استعمال ہو چکا ہے" });
      }
      
      await storage.useActivationCode(code, phoneNumber);
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      res.json({
        success: true,
        message: "Subscription activate ho gayi! - سبسکرپشن فعال ہو گئی!",
        expiresAt: expiresAt.toISOString()
      });
    } catch (error) {
      console.error("Error activating:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await storage.getActiveImportantNotes();
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.get("/api/admin/notes", async (req, res) => {
    if (!isAdminAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const notes = await storage.getAllImportantNotes();
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.post("/api/admin/notes", async (req, res) => {
    if (!isAdminAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const note = await storage.createImportantNote(req.body);
      res.json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ error: "Failed to create note" });
    }
  });

  app.put("/api/admin/notes/:id", async (req, res) => {
    if (!isAdminAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const note = await storage.updateImportantNote(req.params.id, req.body);
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(500).json({ error: "Failed to update note" });
    }
  });

  app.delete("/api/admin/notes/:id", async (req, res) => {
    if (!isAdminAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const success = await storage.deleteImportantNote(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ error: "Failed to delete note" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
