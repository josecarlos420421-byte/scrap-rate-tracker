// Scrap item images mapping
// Each category and item has its representative image

import ironImage from '../assets/scrap-images/iron.jpg';
import ironRustyImage from '../assets/scrap-images/iron-rusty.jpg';
import ironRodsImage from '../assets/scrap-images/iron-rods.jpg';
import copperImage from '../assets/scrap-images/copper.jpg';
import copperWireImage from '../assets/scrap-images/copper-wire.jpg';
import copperPipeImage from '../assets/scrap-images/copper-pipe.jpg';
import aluminumImage from '../assets/scrap-images/aluminum.jpg';
import aluminumCansImage from '../assets/scrap-images/aluminum-cans.jpg';
import aluminumSheetImage from '../assets/scrap-images/aluminum-sheet.jpg';
import brassImage from '../assets/scrap-images/brass.jpg';
import brassFittingsImage from '../assets/scrap-images/brass-fittings.jpg';
import batteryImage from '../assets/scrap-images/battery.jpg';
import batteryCarImage from '../assets/scrap-images/battery-car.jpg';
import paperImage from '../assets/scrap-images/paper.jpg';
import paperCardboardImage from '../assets/scrap-images/paper-cardboard.jpg';
import steelImage from '../assets/scrap-images/steel.jpg';
import steelUtensilsImage from '../assets/scrap-images/steel-utensils.jpg';
import electronicsImage from '../assets/scrap-images/electronics.jpg';
import glassImage from '../assets/scrap-images/glass.jpg';
import rubberImage from '../assets/scrap-images/rubber.jpg';
import silverImage from '../assets/scrap-images/silver.jpg';
import zincImage from '../assets/scrap-images/zinc.jpg';
import plasticImage from '../assets/scrap-images/plastic.jpg';

// Category level images (default)
export const scrapImages: Record<string, any> = {
  iron: ironImage,
  loha: ironImage,
  copper: copperImage,
  tamba: copperImage,
  aluminum: aluminumImage,
  brass: brassImage,
  pital: brassImage,
  battery: batteryImage,
  paper: paperImage,
  kaghaz: paperImage,
  steel: steelImage,
  electronics: electronicsImage,
  glass: glassImage,
  sheesha: glassImage,
  rubber: rubberImage,
  silver: silverImage,
  chandi: silverImage,
  zinc: zincImage,
  jast: zincImage,
  plastic: plasticImage,
  scrap: ironImage,
};

// Item-specific images mapping
const itemImages: Record<string, any> = {
  // Iron/Loha varieties
  'nigar': ironRustyImage,
  'nigartook': ironRustyImage,
  'nigar took': ironRustyImage,
  'arahat': ironRodsImage,
  'arahattook': ironRodsImage,
  'arahat took': ironRodsImage,
  'saria': ironRodsImage,
  'sariya': ironRodsImage,
  'rod': ironRodsImage,
  'rods': ironRodsImage,
  'pipe': ironRodsImage,
  'angle': ironRodsImage,
  'patti': ironImage,
  'patri': ironImage,
  'kala loha': ironRustyImage,
  'safed loha': ironImage,
  'mix loha': ironRustyImage,
  
  // Copper varieties
  'wire': copperWireImage,
  'tar': copperWireImage,
  'cable': copperWireImage,
  'tamba wire': copperWireImage,
  'copper wire': copperWireImage,
  'nali': copperPipeImage,
  'pipe tamba': copperPipeImage,
  'copper pipe': copperPipeImage,
  'motor': copperWireImage,
  'motor winding': copperWireImage,
  'winding': copperWireImage,
  'mix tamba': copperImage,
  'mix copper': copperImage,
  
  // Aluminum varieties
  'can': aluminumCansImage,
  'cans': aluminumCansImage,
  'tin': aluminumCansImage,
  'dabba': aluminumCansImage,
  'sheet': aluminumSheetImage,
  'chadar': aluminumSheetImage,
  'parat': aluminumSheetImage,
  'aluminum sheet': aluminumSheetImage,
  'aluminum can': aluminumCansImage,
  'bartan': aluminumImage,
  'utensil': aluminumImage,
  'mix aluminum': aluminumImage,
  
  // Brass varieties
  'valve': brassFittingsImage,
  'valves': brassFittingsImage,
  'fitting': brassFittingsImage,
  'fittings': brassFittingsImage,
  'nal': brassFittingsImage,
  'nalkay': brassFittingsImage,
  'pital fitting': brassFittingsImage,
  'brass fitting': brassFittingsImage,
  'mix pital': brassImage,
  'mix brass': brassImage,
  
  // Battery varieties
  'car battery': batteryCarImage,
  'gari battery': batteryCarImage,
  'bike battery': batteryCarImage,
  'ups battery': batteryCarImage,
  'dry battery': batteryImage,
  'wet battery': batteryCarImage,
  
  // Paper varieties
  'cardboard': paperCardboardImage,
  'karton': paperCardboardImage,
  'box': paperCardboardImage,
  'newspaper': paperImage,
  'akhbar': paperImage,
  'magazine': paperImage,
  'white paper': paperImage,
  'mix paper': paperImage,
  
  // Steel varieties
  'bartan steel': steelUtensilsImage,
  'kitchen': steelUtensilsImage,
  'utensils steel': steelUtensilsImage,
  'stainless': steelUtensilsImage,
  'ss': steelUtensilsImage,
  'mix steel': steelImage,
};

export function getScrapImage(categoryName: string): any {
  const name = categoryName.toLowerCase();
  
  if (name.includes("loha") || name.includes("لوہا") || name.includes("iron")) {
    return scrapImages.iron;
  }
  if (name.includes("copper") || name.includes("تانبا") || name.includes("tamba")) {
    return scrapImages.copper;
  }
  if (name.includes("aluminum") || name.includes("ایلومینیم")) {
    return scrapImages.aluminum;
  }
  if (name.includes("brass") || name.includes("پیتل") || name.includes("pital")) {
    return scrapImages.brass;
  }
  if (name.includes("battery") || name.includes("بیٹری")) {
    return scrapImages.battery;
  }
  if (name.includes("paper") || name.includes("کاغذ") || name.includes("kaghaz")) {
    return scrapImages.paper;
  }
  if (name.includes("steel") || name.includes("سٹیل")) {
    return scrapImages.steel;
  }
  if (name.includes("electronics") || name.includes("الیکٹرانکس")) {
    return scrapImages.electronics;
  }
  if (name.includes("glass") || name.includes("شیشہ") || name.includes("sheesha")) {
    return scrapImages.glass;
  }
  if (name.includes("rubber") || name.includes("ربڑ")) {
    return scrapImages.rubber;
  }
  if (name.includes("silver") || name.includes("چاندی") || name.includes("chandi")) {
    return scrapImages.silver;
  }
  if (name.includes("zinc") || name.includes("جست") || name.includes("jast")) {
    return scrapImages.zinc;
  }
  if (name.includes("plastic") || name.includes("پلاسٹک")) {
    return scrapImages.plastic;
  }
  
  return scrapImages.scrap;
}

// Get image for specific item within a category
export function getItemImage(itemName: string, categoryName: string): any {
  const name = itemName.toLowerCase().trim();
  
  // Check item-specific images first
  for (const [key, image] of Object.entries(itemImages)) {
    if (name.includes(key) || name === key) {
      return image;
    }
  }
  
  // Fall back to category image
  return getScrapImage(categoryName);
}
