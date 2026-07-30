import type { ReactNode } from 'react';
import { Car } from 'lucide-react';

export const AuthLayout = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) => (
  <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
    <div className="w-full max-w-sm animate-fade-in-up">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15">
          <Car className="h-5.5 w-5.5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl tracking-widest text-text">AUTOLEDGER</h1>
          <p className="mt-1 text-sm text-text-muted">Dealership inventory, on the record.</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6 shadow-xl shadow-black/20">
        <h2 className="font-display text-lg tracking-wide text-text">{title}</h2>
        <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  </div>
);
