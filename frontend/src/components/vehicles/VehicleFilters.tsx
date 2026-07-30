import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { SortOption } from '../../types/vehicle.types';

interface VehicleFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export const VehicleFilters = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sort,
  onSortChange,
  onClear,
  hasActiveFilters,
}: VehicleFiltersProps) => (
  <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-faint" />
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by make or model…"
        className="w-full rounded-md border border-border-strong bg-surface-2 py-2.5 pl-9 pr-3 text-sm text-text placeholder:text-text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>

    <div className="flex flex-wrap items-end gap-3">
      <div className="w-full min-w-[140px] sm:w-40">
        <Select
          label="Category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <div className="w-[calc(50%-6px)] sm:w-28">
        <Input
          label="Min price"
          type="number"
          min={0}
          inputMode="numeric"
          value={minPrice}
          onChange={(event) => onMinPriceChange(event.target.value)}
          placeholder="$0"
        />
      </div>

      <div className="w-[calc(50%-6px)] sm:w-28">
        <Input
          label="Max price"
          type="number"
          min={0}
          inputMode="numeric"
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(event.target.value)}
          placeholder="Any"
        />
      </div>

      <div className="w-full min-w-[150px] sm:w-48">
        <Select
          label="Sort by"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
        >
          <option value="newest">Newest arrivals</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="stock-desc">Stock: most first</option>
          <option value="stock-asc">Stock: least first</option>
          <option value="name-asc">Name: A to Z</option>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="mb-0.5">
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}

      <div className="ml-auto hidden items-center gap-1.5 text-xs text-text-faint sm:flex">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filters apply live
      </div>
    </div>
  </div>
);
