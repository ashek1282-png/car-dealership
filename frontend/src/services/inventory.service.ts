import { api } from './api';
import type { Vehicle } from '../types/vehicle.types';

export const inventoryService = {
  purchase: async (id: string, quantity = 1): Promise<Vehicle> => {
    const { data } = await api.post<Vehicle>(`/inventory/${id}/purchase`, { quantity });
    return data;
  },

  restock: async (id: string, quantity: number): Promise<Vehicle> => {
    const { data } = await api.post<Vehicle>(`/inventory/${id}/restock`, { quantity });
    return data;
  },
};
