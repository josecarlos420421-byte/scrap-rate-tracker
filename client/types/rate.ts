export interface RateHistory {
  date: string;
  rate: number;
}

export interface RateItem {
  id: string;
  name: string;
  rate: number;
  unit: string;
  notes?: string;
  updatedAt: string;
  rateHistory?: RateHistory[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
  color?: string;
  items: RateItem[];
  createdAt: string;
  updatedAt: string;
}

export type RateUnit = "kg" | "ton" | "piece" | "gram" | "quintal" | "tola";

export const RATE_UNITS: { value: RateUnit; label: string }[] = [
  { value: "kg", label: "Per KG" },
  { value: "ton", label: "Per Ton" },
  { value: "piece", label: "Per Piece" },
  { value: "gram", label: "Per Gram" },
  { value: "quintal", label: "Per Quintal" },
  { value: "tola", label: "Per Tola" },
];

export const CATEGORY_ICONS = [
  { value: "box", label: "Box" },
  { value: "package", label: "Package" },
  { value: "layers", label: "Layers" },
  { value: "disc", label: "Disc" },
  { value: "circle", label: "Circle" },
  { value: "square", label: "Square" },
  { value: "triangle", label: "Triangle" },
  { value: "hexagon", label: "Hexagon" },
  { value: "tool", label: "Tool" },
  { value: "settings", label: "Settings" },
  { value: "monitor", label: "Monitor" },
  { value: "droplet", label: "Droplet" },
  { value: "loader", label: "Loader" },
  { value: "star", label: "Star" },
  { value: "zap", label: "Zap" },
];

// Category images mapping
export const CATEGORY_IMAGES: Record<string, string> = {
  loha: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
  copper: "https://images.unsplash.com/photo-1605557202138-6e0f5fead5e4?w=200&h=200&fit=crop",
  aluminum: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
  plastic: "https://images.unsplash.com/photo-1572275545630-8bc8867f1d4f?w=200&h=200&fit=crop",
  brass: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
  battery: "https://images.unsplash.com/photo-1619641805634-74f4bbe66df7?w=200&h=200&fit=crop",
  paper: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=200&h=200&fit=crop",
  steel: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
  electronics: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop",
  glass: "https://images.unsplash.com/photo-1605434024078-a0ee68f60e36?w=200&h=200&fit=crop",
  rubber: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
  silver: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&h=200&fit=crop",
  zinc: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
};
