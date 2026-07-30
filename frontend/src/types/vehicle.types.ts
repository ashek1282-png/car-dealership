export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  description: string | null;
  price: number;
  quantity: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleSearchFilters {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface VehicleFormInput {
  make: string;
  model: string;
  year: number;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
}

export type SortOption =
  'newest' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc' | 'name-asc';

export const LOW_STOCK_THRESHOLD = 3;

export type StockStatusFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
