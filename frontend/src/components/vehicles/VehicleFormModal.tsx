import { useEffect, useState, type FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Vehicle, VehicleFormInput } from '../../types/vehicle.types';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: VehicleFormInput) => void;
  isSubmitting: boolean;
  vehicle?: Vehicle | null;
}

const emptyForm: VehicleFormInput = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  category: '',
  price: 0,
  quantity: 0,
  description: '',
  imageUrl: '',
};

type FormErrors = Partial<Record<keyof VehicleFormInput, string>>;

const validate = (form: VehicleFormInput): FormErrors => {
  const errors: FormErrors = {};
  if (!form.make.trim()) errors.make = 'Make is required';
  if (!form.model.trim()) errors.model = 'Model is required';
  if (!form.category.trim()) errors.category = 'Category is required';
  if (!Number.isFinite(form.year) || form.year < 1886) errors.year = 'Enter a valid year';
  if (!Number.isFinite(form.price) || form.price <= 0)
    errors.price = 'Price must be greater than 0';
  if (!Number.isFinite(form.quantity) || form.quantity < 0)
    errors.quantity = 'Quantity cannot be negative';
  return errors;
};

export const VehicleFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  vehicle,
}: VehicleFormModalProps) => {
  const [form, setForm] = useState<VehicleFormInput>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isOpen) return;
    if (vehicle) {
      setForm({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        category: vehicle.category,
        price: vehicle.price,
        quantity: vehicle.quantity,
        description: vehicle.description ?? '',
        imageUrl: vehicle.imageUrl ?? '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [isOpen, vehicle]);

  const update = <K extends keyof VehicleFormInput>(key: K, value: VehicleFormInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSubmit(form);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicle ? 'Edit vehicle' : 'Add vehicle'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Make"
            value={form.make}
            onChange={(event) => update('make', event.target.value)}
            error={errors.make}
            placeholder="Toyota"
          />
          <Input
            label="Model"
            value={form.model}
            onChange={(event) => update('model', event.target.value)}
            error={errors.model}
            placeholder="Corolla"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Year"
            type="number"
            value={form.year}
            onChange={(event) => update('year', Number(event.target.value))}
            error={errors.year}
          />
          <Input
            label="Category"
            value={form.category}
            onChange={(event) => update('category', event.target.value)}
            error={errors.category}
            placeholder="Sedan, SUV, Truck…"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Price (USD)"
            type="number"
            min={0}
            value={form.price}
            onChange={(event) => update('price', Number(event.target.value))}
            error={errors.price}
          />
          <Input
            label="Quantity in stock"
            type="number"
            min={0}
            value={form.quantity}
            onChange={(event) => update('quantity', Number(event.target.value))}
            error={errors.quantity}
          />
        </div>

        <Input
          label="Image URL"
          value={form.imageUrl}
          onChange={(event) => update('imageUrl', event.target.value)}
          placeholder="/cars/corolla.jpg"
          hint="Leave blank to show a placeholder"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-muted" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={form.description}
            onChange={(event) => update('description', event.target.value)}
            className="w-full resize-none rounded-md border border-border-strong bg-surface-2 px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Trim level, condition, standout features…"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {vehicle ? 'Save changes' : 'Add vehicle'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
