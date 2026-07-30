import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border-strong bg-surface/50 px-6 py-16 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2">
      <Icon className="h-6 w-6 text-text-faint" />
    </div>
    <p className="font-display text-lg tracking-wide text-text">{title}</p>
    {description && <p className="max-w-sm text-sm text-text-muted">{description}</p>}
    {action}
  </div>
);
