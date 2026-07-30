import { Car, Pencil, Trash2, PackagePlus, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Vehicle } from '../../types/vehicle.types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { StockGauge, getStockStatus } from '../ui/StockGauge';

interface VehicleCardProps {
  vehicle: Vehicle;
  isAdmin: boolean;
  onPurchase: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onRestock: (vehicle: Vehicle) => void;
  isPurchasing?: boolean;
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const VehicleCard = ({
  vehicle,
  isAdmin,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
  isPurchasing,
}: VehicleCardProps) => {
  const status = getStockStatus(vehicle.quantity);
  const isSoldOut = vehicle.quantity <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-200 hover:border-border-strong hover:shadow-lg hover:shadow-black/20 animate-fade-in-up">
      <Link
        to={`/vehicles/${vehicle.id}`}
        className="relative block h-40 overflow-hidden bg-surface-2"
      >
        {vehicle.imageUrl ? (
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-2 to-surface-3">
            <Car className="h-10 w-10 text-text-faint" strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute left-2 top-2">
          <Badge tone="neutral">{vehicle.category}</Badge>
        </div>
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Badge tone="danger">Sold out</Badge>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link to={`/vehicles/${vehicle.id}`}>
            <h3 className="font-display text-lg leading-tight tracking-wide text-text hover:text-primary">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
          </Link>
          <p className="mt-0.5 font-mono text-base text-text">{currency.format(vehicle.price)}</p>
        </div>

        <StockGauge quantity={vehicle.quantity} />

        <div className="mt-auto flex items-center gap-2 pt-1">
          <Button
            className="flex-1"
            size="sm"
            disabled={isSoldOut}
            isLoading={isPurchasing}
            onClick={() => onPurchase(vehicle)}
          >
            <ShoppingCart className="h-4 w-4" />
            {isSoldOut ? 'Sold out' : 'Purchase'}
          </Button>

          {isAdmin && (
            <>
              <Button
                variant="secondary"
                size="sm"
                aria-label="Restock vehicle"
                onClick={() => onRestock(vehicle)}
              >
                <PackagePlus className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                aria-label="Edit vehicle"
                onClick={() => onEdit(vehicle)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                aria-label="Delete vehicle"
                onClick={() => onDelete(vehicle)}
              >
                <Trash2 className="h-4 w-4 text-danger" />
              </Button>
            </>
          )}
        </div>
        <span className="sr-only">{status.label}</span>
      </div>
    </div>
  );
};
