import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  isDangerous = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <Modal isOpen={isOpen} onClose={onCancel} title={title} maxWidth="max-w-sm">
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        {isDangerous && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger-muted">
            <AlertTriangle className="h-4.5 w-4.5 text-danger" />
          </div>
        )}
        <p className="text-sm text-text-muted">{description}</p>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant={isDangerous ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);
