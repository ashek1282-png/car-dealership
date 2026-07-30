import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, ShoppingCart, Pencil, Trash2, PackagePlus } from 'lucide-react';
import { useState } from 'react';
import {
  useVehicle,
  useDeleteVehicle,
  usePurchaseVehicle,
  useRestockVehicle,
  useUpdateVehicle,
} from '../hooks/useVehicles';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getErrorMessage } from '../services/api';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { StockGauge } from '../components/ui/StockGauge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { RestockModal } from '../components/vehicles/RestockModal';
import { VehicleFormModal } from '../components/vehicles/VehicleFormModal';
import type { VehicleFormInput } from '../types/vehicle.types';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const VehicleDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  const { data: vehicle, isLoading } = useVehicle(id);
  const purchaseVehicle = usePurchaseVehicle();
  const restockVehicle = useRestockVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (isLoading) {
    return <div className="animate-shimmer h-96 w-full rounded-lg" />;
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="font-display text-xl text-text">Vehicle not found</p>
        <p className="text-sm text-text-muted">
          It may have been sold, removed, or the link is incorrect.
        </p>
        <Link to="/dashboard">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back to inventory
          </Button>
        </Link>
      </div>
    );
  }

  const isSoldOut = vehicle.quantity <= 0;

  const handlePurchase = () => {
    purchaseVehicle.mutate(
      { id: vehicle.id, quantity: 1 },
      {
        onSuccess: () => showToast(`Purchased 1 ${vehicle.make} ${vehicle.model}.`, 'success'),
        onError: (error) => showToast(getErrorMessage(error, 'Purchase failed'), 'error'),
      },
    );
  };

  const handleEditSubmit = (payload: VehicleFormInput) => {
    updateVehicle.mutate(
      { id: vehicle.id, payload },
      {
        onSuccess: () => {
          showToast('Vehicle updated.', 'success');
          setIsEditOpen(false);
        },
        onError: (error) => showToast(getErrorMessage(error), 'error'),
      },
    );
  };

  const handleRestockSubmit = (quantity: number) => {
    restockVehicle.mutate(
      { id: vehicle.id, quantity },
      {
        onSuccess: () => {
          showToast(`Added ${quantity} unit${quantity === 1 ? '' : 's'} to stock.`, 'success');
          setIsRestockOpen(false);
        },
        onError: (error) => showToast(getErrorMessage(error), 'error'),
      },
    );
  };

  const handleDelete = () => {
    deleteVehicle.mutate(vehicle.id, {
      onSuccess: () => {
        showToast('Vehicle removed from inventory.', 'success');
        navigate('/dashboard');
      },
      onError: (error) => showToast(getErrorMessage(error), 'error'),
    });
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Link
        to="/dashboard"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to inventory
      </Link>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative h-64 overflow-hidden rounded-lg border border-border bg-surface-2 md:h-full">
          {vehicle.imageUrl ? (
            <img
              src={vehicle.imageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-2 to-surface-3">
              <Car className="h-16 w-16 text-text-faint" strokeWidth={1.5} />
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge tone="neutral">{vehicle.category}</Badge>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-display text-3xl tracking-wide text-text">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p className="mt-1 font-mono text-2xl text-text">{currency.format(vehicle.price)}</p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-text-faint">Stock level</p>
            <StockGauge quantity={vehicle.quantity} />
          </div>

          {vehicle.description && (
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-text-faint">Description</p>
              <p className="text-sm leading-relaxed text-text-muted">{vehicle.description}</p>
            </div>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
            <Button
              className="flex-1 sm:flex-none"
              disabled={isSoldOut}
              isLoading={purchaseVehicle.isPending}
              onClick={handlePurchase}
            >
              <ShoppingCart className="h-4 w-4" />
              {isSoldOut ? 'Sold out' : 'Purchase'}
            </Button>

            {isAdmin && (
              <>
                <Button variant="secondary" onClick={() => setIsRestockOpen(true)}>
                  <PackagePlus className="h-4 w-4" />
                  Restock
                </Button>
                <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="secondary" onClick={() => setIsDeleteOpen(true)}>
                  <Trash2 className="h-4 w-4 text-danger" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <VehicleFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
        isSubmitting={updateVehicle.isPending}
        vehicle={vehicle}
      />

      <RestockModal
        isOpen={isRestockOpen}
        vehicle={vehicle}
        onClose={() => setIsRestockOpen(false)}
        onSubmit={handleRestockSubmit}
        isSubmitting={restockVehicle.isPending}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete vehicle"
        description={`This permanently removes the ${vehicle.year} ${vehicle.make} ${vehicle.model} from inventory.`}
        confirmLabel="Delete"
        isLoading={deleteVehicle.isPending}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
};
