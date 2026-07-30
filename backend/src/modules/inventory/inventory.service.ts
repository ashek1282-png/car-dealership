import * as inventoryRepository from './inventory.repository.js';

export const restock = async (id: string, quantity: number) => {
  return await inventoryRepository.restockVehicle(id, quantity);
};

export const purchase = async (id: string, quantity: number) => {
  const vehicle = await inventoryRepository.findVehicleById(id);

  if (!vehicle) {
    const error: any = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }

  if (vehicle.quantity < quantity) {
    const error: any = new Error('Insufficient stock for this purchase');
    error.statusCode = 400;
    throw error;
  }

  return await inventoryRepository.purchaseVehicle(id, quantity);
};
