import { useEffect, useState, type FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Vehicle } from '../../types/vehicle.types';

interface RestockModalProps {
  isOpen: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
  onSubmit: (quantity: number) => void;
  isSubmitting: boolean;
}

export const RestockModal = ({
  isOpen,
  vehicle,
  onClose,
  onSubmit,
  isSubmitting,
}: RestockModalProps) => {
  const [quantity, setQuantity] = useState(10);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (isOpen) {
      setQuantity(10);
      setError(undefined);
    }
  }, [isOpen]);

  if (!vehicle) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!Number.isInteger(quantity) || quantity <= 0) {
      setError('Enter a positive whole number');
      return;
    }
    onSubmit(quantity);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restock vehicle" maxWidth="max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-sm text-text-muted">
          {vehicle.year} {vehicle.make} {vehicle.model} &mdash; currently{' '}
          <span className="font-mono text-text">{vehicle.quantity}</span> in stock.
        </p>
        <Input
          label="Units to add"
          type="number"
          min={1}
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          error={error}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Add stock
          </Button>
        </div>
      </form>
    </Modal>
  );
};
