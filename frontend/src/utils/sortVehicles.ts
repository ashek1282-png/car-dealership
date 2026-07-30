import type { SortOption, Vehicle } from '../types/vehicle.types';

export const sortVehicles = (vehicles: Vehicle[], sort: SortOption): Vehicle[] => {
  const list = [...vehicles];
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price);
    case 'stock-asc':
      return list.sort((a, b) => a.quantity - b.quantity);
    case 'stock-desc':
      return list.sort((a, b) => b.quantity - a.quantity);
    case 'name-asc':
      return list.sort((a, b) => `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`));
    case 'newest':
    default:
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};
