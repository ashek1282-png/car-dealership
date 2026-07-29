import * as inventoryRepository from './inventory.repository.js';

export const restock = async (id: string, quantity: number) => {
  return await inventoryRepository.restockVehicle(id, quantity);
};
