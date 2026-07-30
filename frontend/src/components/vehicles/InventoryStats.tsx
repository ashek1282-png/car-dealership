import { Boxes, DollarSign, Layers, TriangleAlert, PackageX } from 'lucide-react';
import type { Vehicle } from '../../types/vehicle.types';
import { LOW_STOCK_THRESHOLD } from '../../types/vehicle.types';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

interface InventoryStatsProps {
  vehicles: Vehicle[];
}

export const InventoryStats = ({ vehicles }: InventoryStatsProps) => {
  const totalListings = vehicles.length;
  const totalUnits = vehicles.reduce((sum, vehicle) => sum + vehicle.quantity, 0);
  const totalValue = vehicles.reduce((sum, vehicle) => sum + vehicle.price * vehicle.quantity, 0);
  const lowStockCount = vehicles.filter(
    (vehicle) => vehicle.quantity > 0 && vehicle.quantity <= LOW_STOCK_THRESHOLD,
  ).length;
  const outOfStockCount = vehicles.filter((vehicle) => vehicle.quantity <= 0).length;

  const stats: { label: string; value: string; icon: typeof Layers; tone?: 'amber' | 'danger' }[] =
    [
      { label: 'Listings', value: totalListings.toLocaleString(), icon: Layers },
      { label: 'Units on lot', value: totalUnits.toLocaleString(), icon: Boxes },
      { label: 'Inventory value', value: currency.format(totalValue), icon: DollarSign },
      {
        label: 'Low stock alerts',
        value: lowStockCount.toLocaleString(),
        icon: TriangleAlert,
        tone: lowStockCount > 0 ? 'amber' : undefined,
      },
      {
        label: 'Out of stock',
        value: outOfStockCount.toLocaleString(),
        icon: PackageX,
        tone: outOfStockCount > 0 ? 'danger' : undefined,
      },
    ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map(({ label, value, icon: Icon, tone }) => (
        <div key={label} className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-text-faint">
            <Icon
              className={`h-4 w-4 ${tone === 'amber' ? 'text-amber' : tone === 'danger' ? 'text-danger' : ''}`}
            />
            <span className="text-xs uppercase tracking-wide">{label}</span>
          </div>
          <p
            className={`mt-1.5 font-display text-2xl tracking-wide ${
              tone === 'amber' ? 'text-amber' : tone === 'danger' ? 'text-danger' : 'text-text'
            }`}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );
};
