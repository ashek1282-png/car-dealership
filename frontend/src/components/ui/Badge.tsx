import type { ReactNode } from 'react';

type Tone = 'neutral' | 'success' | 'amber' | 'danger' | 'primary';

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-surface-3 text-text-muted',
  success: 'bg-success-muted text-success',
  amber: 'bg-amber-muted text-amber',
  danger: 'bg-danger-muted text-danger',
  primary: 'bg-primary-muted text-primary',
};

export const Badge = ({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) => (
  <span
    className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${toneClasses[tone]}`}
  >
    {children}
  </span>
);
