import { api } from './api';
import type { Vehicle, VehicleFormInput, VehicleSearchFilters } from '../types/vehicle.types';

export const vehicleService = {
  getAll: async (): Promise<Vehicle[]> => {
    const { data } = await api.get<Vehicle[]>('/vehicles');
    return data;
  },

  search: async (filters: VehicleSearchFilters): Promise<Vehicle[]> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''),
    );
    const { data } = await api.get<Vehicle[]>('/vehicles/search', { params });
    return data;
  },

  create: async (payload: VehicleFormInput): Promise<Vehicle> => {
    const { data } = await api.post<Vehicle>('/vehicles', payload);
    return data;
  },

  update: async (id: string, payload: Partial<VehicleFormInput>): Promise<Vehicle> => {
    const { data } = await api.put<Vehicle>(`/vehicles/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  },
};
