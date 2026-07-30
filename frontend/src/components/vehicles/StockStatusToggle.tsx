import type { StockStatusFilter } from '../../types/vehicle.types';

interface StockStatusToggleProps {
  value: StockStatusFilter;
  onChange: (value: StockStatusFilter) => void;
  counts: { all: number; inStock: number; lowStock: number; outOfStock: number };
}

const OPTIONS: { value: StockStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in-stock', label: 'In stock' },
  { value: 'low-stock', label: 'Low stock' },
  { value: 'out-of-stock', label: 'Out of stock' },
];

const countFor = (key: StockStatusFilter, counts: StockStatusToggleProps['counts']) => {
  switch (key) {
    case 'in-stock':
      return counts.inStock;
    case 'low-stock':
      return counts.lowStock;
    case 'out-of-stock':
      return counts.outOfStock;
    default:
      return counts.all;
  }
};

export const StockStatusToggle = ({ value, onChange, counts }: StockStatusToggleProps) => (
  <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-surface p-1">
    {OPTIONS.map((option) => {
      const isActive = value === option.value;
      return (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-text-muted hover:bg-surface-2 hover:text-text'
          }`}
        >
          {option.label}
          <span className={`ml-1.5 font-mono ${isActive ? 'text-white/80' : 'text-text-faint'}`}>
            {countFor(option.value, counts)}
          </span>
        </button>
      );
    })}
  </div>
);
