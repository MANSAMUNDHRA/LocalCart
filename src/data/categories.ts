// src/data/categories.ts
// Static category list — replaces the CATEGORIES export from mockData.ts

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Pottery',     icon: 'earth',           color: '#A0522D' },
  { id: 'c2', name: 'Cafes',       icon: 'cafe',            color: '#6F4E37' },
  { id: 'c3', name: 'Candles',     icon: 'flame',           color: '#FF7A30' },
  { id: 'c4', name: 'Stationery',  icon: 'pencil',          color: '#6366F1' },
  { id: 'c5', name: 'Handmade',    icon: 'hand-left',       color: '#EC4899' },
  { id: 'c6', name: 'Bakery',      icon: 'restaurant',      color: '#F59E0B' },
  { id: 'c7', name: 'Food',        icon: 'fast-food',       color: '#EF4444' },
  { id: 'c8', name: 'Fruits',      icon: 'nutrition',       color: '#22C55E' },
  { id: 'c9', name: 'Street Food', icon: 'storefront',      color: '#8B5CF6' },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);
