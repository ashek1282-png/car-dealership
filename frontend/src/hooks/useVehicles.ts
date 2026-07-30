import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicle.service';
import { inventoryService } from '../services/inventory.service';
import type { Vehicle, VehicleFormInput, VehicleSearchFilters } from '../types/vehicle.types';

const VEHICLES_KEY = ['vehicles'] as const;

const hasActiveFilters = (filters: VehicleSearchFilters) =>
  Object.values(filters).some((value) => value !== undefined && value !== '');

export const useVehicles = (filters: VehicleSearchFilters) => {
  const isFiltered = hasActiveFilters(filters);

  return useQuery<Vehicle[]>({
    queryKey: isFiltered ? [...VEHICLES_KEY, filters] : VEHICLES_KEY,
    queryFn: () => (isFiltered ? vehicleService.search(filters) : vehicleService.getAll()),
    placeholderData: (previous) => previous,
  });
};

export const useVehicle = (id: string | undefined) => {
  return useQuery<Vehicle[], Error, Vehicle | undefined>({
    queryKey: VEHICLES_KEY,
    queryFn: vehicleService.getAll,
    enabled: Boolean(id),
    select: (vehicles) => vehicles.find((vehicle) => vehicle.id === id),
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: VehicleFormInput) => vehicleService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VEHICLES_KEY }),
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<VehicleFormInput> }) =>
      vehicleService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VEHICLES_KEY }),
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vehicleService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VEHICLES_KEY }),
  });
};

export const usePurchaseVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity?: number }) =>
      inventoryService.purchase(id, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VEHICLES_KEY }),
  });
};

export const useRestockVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      inventoryService.restock(id, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: VEHICLES_KEY }),
  });
};
