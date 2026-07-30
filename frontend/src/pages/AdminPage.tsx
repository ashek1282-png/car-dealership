import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, PackagePlus, ShieldCheck } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import {
  useCreateVehicle,
  useDeleteVehicle,
  useRestockVehicle,
  useUpdateVehicle,
  useVehicles,
} from '../hooks/useVehicles';
import { getErrorMessage } from '../services/api';
import type {
  SortOption,
  StockStatusFilter,
  Vehicle,
  VehicleFormInput,
} from '../types/vehicle.types';
import { LOW_STOCK_THRESHOLD } from '../types/vehicle.types';
import { sortVehicles } from '../utils/sortVehicles';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StockGauge } from '../components/ui/StockGauge';
import { VehicleFormModal } from '../components/vehicles/VehicleFormModal';
import { VehicleFilters } from '../components/vehicles/VehicleFilters';
import { StockStatusToggle } from '../components/vehicles/StockStatusToggle';
import { RestockModal } from '../components/vehicles/RestockModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { InventoryStats } from '../components/vehicles/InventoryStats';

const PAGE_SIZE = 10;

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const AdminPage = () => {
  const { showToast } = useToast();

  // Filter + sort + stock-status + pagination state
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [stockStatus, setStockStatus] = useState<StockStatusFilter>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Modal / dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [restockTarget, setRestockTarget] = useState<Vehicle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);

  // Unfiltered list — used for stats and to populate category options regardless of active filters
  const allVehiclesQuery = useVehicles({});

  const backendFilters = useMemo(
    () => ({
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    }),
    [category, minPrice, maxPrice],
  );
  const hasBackendFilters = Boolean(category || minPrice || maxPrice);
  const filteredQuery = useVehicles(backendFilters);

  const baseVehicles = hasBackendFilters ? filteredQuery.data : allVehiclesQuery.data;
  const isLoading = hasBackendFilters ? filteredQuery.isLoading : allVehiclesQuery.isLoading;

  const categories = useMemo(() => {
    const set = new Set((allVehiclesQuery.data ?? []).map((vehicle) => vehicle.category));
    return Array.from(set).sort();
  }, [allVehiclesQuery.data]);

  const textFiltered = useMemo(() => {
    const list = baseVehicles ?? [];
    if (!search.trim()) return list;
    const term = search.trim().toLowerCase();
    return list.filter(
      (vehicle) =>
        vehicle.make.toLowerCase().includes(term) ||
        vehicle.model.toLowerCase().includes(term) ||
        vehicle.category.toLowerCase().includes(term),
    );
  }, [baseVehicles, search]);

  // Stock-status counts reflect the current search/category/price filters, so the
  // toggle numbers stay in sync with whatever the admin has already narrowed down to.
  const stockCounts = useMemo(
    () => ({
      all: textFiltered.length,
      inStock: textFiltered.filter((vehicle) => vehicle.quantity > LOW_STOCK_THRESHOLD).length,
      lowStock: textFiltered.filter(
        (vehicle) => vehicle.quantity > 0 && vehicle.quantity <= LOW_STOCK_THRESHOLD,
      ).length,
      outOfStock: textFiltered.filter((vehicle) => vehicle.quantity <= 0).length,
    }),
    [textFiltered],
  );

  const stockFiltered = useMemo(() => {
    if (stockStatus === 'all') return textFiltered;
    return textFiltered.filter((vehicle) => {
      if (stockStatus === 'out-of-stock') return vehicle.quantity <= 0;
      if (stockStatus === 'low-stock')
        return vehicle.quantity > 0 && vehicle.quantity <= LOW_STOCK_THRESHOLD;
      return vehicle.quantity > LOW_STOCK_THRESHOLD; // in-stock
    });
  }, [textFiltered, stockStatus]);

  const sorted = useMemo(() => sortVehicles(stockFiltered, sort), [stockFiltered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, category, minPrice, maxPrice, sort, stockStatus]);

  const hasActiveFilters = Boolean(search || category || minPrice || maxPrice);
  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
  };

  // Mutations
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const restockVehicle = useRestockVehicle();

  const handleFormSubmit = (payload: VehicleFormInput) => {
    if (editingVehicle) {
      updateVehicle.mutate(
        { id: editingVehicle.id, payload },
        {
          onSuccess: () => {
            showToast('Vehicle updated.', 'success');
            setIsFormOpen(false);
            setEditingVehicle(null);
          },
          onError: (error) => showToast(getErrorMessage(error), 'error'),
        },
      );
    } else {
      createVehicle.mutate(payload, {
        onSuccess: () => {
          showToast('Vehicle added to inventory.', 'success');
          setIsFormOpen(false);
        },
        onError: (error) => showToast(getErrorMessage(error), 'error'),
      });
    }
  };

  const handleRestockSubmit = (quantity: number) => {
    if (!restockTarget) return;
    restockVehicle.mutate(
      { id: restockTarget.id, quantity },
      {
        onSuccess: () => {
          showToast(`Added ${quantity} unit${quantity === 1 ? '' : 's'} to stock.`, 'success');
          setRestockTarget(null);
        },
        onError: (error) => showToast(getErrorMessage(error), 'error'),
      },
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteVehicle.mutate(deleteTarget.id, {
      onSuccess: () => {
        showToast('Vehicle removed from inventory.', 'success');
        setDeleteTarget(null);
      },
      onError: (error) => showToast(getErrorMessage(error), 'error'),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h1 className="font-display text-2xl tracking-wide text-text">Admin Console</h1>
          </div>
          <p className="mt-0.5 text-sm text-text-muted">
            Manage listings, stock levels, and pricing.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingVehicle(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add vehicle
        </Button>
      </div>

      <InventoryStats vehicles={allVehiclesQuery.data ?? []} />

      <VehicleFilters
        search={searchInput}
        onSearchChange={setSearchInput}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        sort={sort}
        onSortChange={setSort}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <StockStatusToggle value={stockStatus} onChange={setStockStatus} counts={stockCounts} />

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title={
            hasActiveFilters || stockStatus !== 'all'
              ? 'No vehicles match these filters'
              : 'No vehicles yet'
          }
          description={
            hasActiveFilters || stockStatus !== 'all'
              ? 'Try widening your search or clearing filters.'
              : 'Add your first vehicle to start managing the lot.'
          }
          action={
            hasActiveFilters || stockStatus !== 'all' ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  clearFilters();
                  setStockStatus('all');
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Button size="sm" onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4" />
                Add vehicle
              </Button>
            )
          }
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full min-w-180 text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-text-faint">
                    <th className="px-4 py-3 font-medium">Vehicle</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className="border-b border-border last:border-0 hover:bg-surface-2/50"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-text">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-xs text-text-faint">ID: {vehicle.id.slice(0, 8)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone="neutral">{vehicle.category}</Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-text">
                        {currency.format(vehicle.price)}
                      </td>
                      <td className="px-4 py-3">
                        <StockGauge quantity={vehicle.quantity} compact />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Restock"
                            onClick={() => setRestockTarget(vehicle)}
                          >
                            <PackagePlus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Edit"
                            onClick={() => {
                              setEditingVehicle(vehicle);
                              setIsFormOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Delete"
                            onClick={() => setDeleteTarget(vehicle)}
                          >
                            <Trash2 className="h-4 w-4 text-danger" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-1">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="px-2 font-mono text-sm text-text-muted">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <VehicleFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingVehicle(null);
        }}
        onSubmit={handleFormSubmit}
        isSubmitting={createVehicle.isPending || updateVehicle.isPending}
        vehicle={editingVehicle}
      />

      <RestockModal
        isOpen={Boolean(restockTarget)}
        vehicle={restockTarget}
        onClose={() => setRestockTarget(null)}
        onSubmit={handleRestockSubmit}
        isSubmitting={restockVehicle.isPending}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete vehicle"
        description={
          deleteTarget
            ? `This permanently removes the ${deleteTarget.year} ${deleteTarget.make} ${deleteTarget.model} from inventory.`
            : ''
        }
        confirmLabel="Delete"
        isLoading={deleteVehicle.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
