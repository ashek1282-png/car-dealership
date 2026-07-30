import { useEffect, useMemo, useState } from 'react';
import { Plus, PackageSearch } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import {
  useCreateVehicle,
  useDeleteVehicle,
  usePurchaseVehicle,
  useRestockVehicle,
  useUpdateVehicle,
  useVehicles,
} from '../hooks/useVehicles';
import { getErrorMessage } from '../services/api';
import type { SortOption, Vehicle, VehicleFormInput } from '../types/vehicle.types';
import { sortVehicles } from '../utils/sortVehicles';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { VehicleCardSkeleton } from '../components/ui/Skeleton';
import { VehicleFilters } from '../components/vehicles/VehicleFilters';
import { VehicleFormModal } from '../components/vehicles/VehicleFormModal';
import { RestockModal } from '../components/vehicles/RestockModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { InventoryStats } from '../components/vehicles/InventoryStats';
import { Button } from '../components/ui/Button';

const PAGE_SIZE = 8;

export const DashboardPage = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  // Filter + sort + pagination state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);

  // Debounce the free-text search box
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Modal / dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [restockTarget, setRestockTarget] = useState<Vehicle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  // Unfiltered list — used to populate category options and stats regardless of active filters
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
  const isError = hasBackendFilters ? filteredQuery.isError : allVehiclesQuery.isError;

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

  const sorted = useMemo(() => sortVehicles(textFiltered, sort), [textFiltered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, category, minPrice, maxPrice, sort]);

  const hasActiveFilters = Boolean(search || category || minPrice || maxPrice);
  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
  };

  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const purchaseVehicle = usePurchaseVehicle();
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

  const handlePurchase = (vehicle: Vehicle) => {
    setPurchasingId(vehicle.id);
    purchaseVehicle.mutate(
      { id: vehicle.id, quantity: 1 },
      {
        onSuccess: () => showToast(`Purchased 1 ${vehicle.make} ${vehicle.model}.`, 'success'),
        onError: (error) => showToast(getErrorMessage(error, 'Purchase failed'), 'error'),
        onSettled: () => setPurchasingId(null),
      },
    );
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
          <h1 className="font-display text-2xl tracking-wide text-text">Inventory</h1>
          <p className="mt-0.5 text-sm text-text-muted">
            Browse the lot, search by make or model, and buy.
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => {
              setEditingVehicle(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add vehicle
          </Button>
        )}
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

      {isError && (
        <p className="rounded-md border border-danger/30 bg-danger-muted px-4 py-3 text-sm text-danger">
          Couldn&apos;t load inventory. Try refreshing the page.
        </p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <VehicleCardSkeleton key={index} />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title={hasActiveFilters ? 'No vehicles match your filters' : 'The lot is empty'}
          description={
            hasActiveFilters
              ? 'Try widening your search or clearing filters.'
              : isAdmin
                ? 'Add your first vehicle to get the inventory started.'
                : 'Check back soon — new vehicles are added regularly.'
          }
          action={
            hasActiveFilters ? (
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginated.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isAdmin={isAdmin}
                onPurchase={handlePurchase}
                onEdit={(target) => {
                  setEditingVehicle(target);
                  setIsFormOpen(true);
                }}
                onDelete={setDeleteTarget}
                onRestock={setRestockTarget}
                isPurchasing={purchasingId === vehicle.id}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
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
