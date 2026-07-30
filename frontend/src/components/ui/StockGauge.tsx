import { LOW_STOCK_THRESHOLD } from '../../types/vehicle.types';

interface StockGaugeProps {
  quantity: number;
  maxScale?: number;
  compact?: boolean;
}

const getStatus = (quantity: number) => {
  if (quantity <= 0)
    return { label: 'Out of stock', color: 'var(--color-danger)', tone: 'danger' as const };
  if (quantity <= LOW_STOCK_THRESHOLD)
    return { label: 'Low stock', color: 'var(--color-amber)', tone: 'amber' as const };
  return { label: 'In stock', color: 'var(--color-success)', tone: 'success' as const };
};

/**
 * A fuel-gauge-style stock indicator — the needle sweeps from Empty (0)
 * to Full (maxScale), echoing a dashboard cluster instead of plain text.
 */
export const StockGauge = ({ quantity, maxScale = 20, compact = false }: StockGaugeProps) => {
  const status = getStatus(quantity);
  const clamped = Math.min(Math.max(quantity, 0), maxScale);
  const fillPercent = (clamped / maxScale) * 100;

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-1.5 flex-1 min-w-16 overflow-hidden rounded-full bg-surface-3">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${fillPercent}%`, backgroundColor: status.color }}
        />
        {/* Low-stock threshold tick */}
        <div
          className="absolute top-0 h-full w-px bg-bg/60"
          style={{ left: `${(LOW_STOCK_THRESHOLD / maxScale) * 100}%` }}
        />
      </div>
      {!compact && (
        <span className="whitespace-nowrap font-mono text-xs" style={{ color: status.color }}>
          {quantity} unit{quantity === 1 ? '' : 's'}
        </span>
      )}
    </div>
  );
};

export const getStockStatus = getStatus;
