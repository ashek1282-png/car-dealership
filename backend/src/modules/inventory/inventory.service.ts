import * as inventoryRepository from './inventory.repository.js';

export const restock = async (id: string, quantity: number) => {
  return await inventoryRepository.restockVehicle(id, quantity);
};

export const purchase = async (id: string, quantity: number) => {
  const vehicle = await inventoryRepository.getVehicleStock(id);

  if (!vehicle) {
    const error: any = new Error('Record not found in database');
    error.statusCode = 404;
    throw error;
  }

  if (vehicle.quantity < quantity) {
    const error: any = new Error('Insufficient stock available');
    error.statusCode = 400; // Bad Request
    throw error;
  }

  return await inventoryRepository.decrementVehicleStock(id, quantity);
};
