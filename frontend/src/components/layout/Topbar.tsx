import { Menu, Car } from 'lucide-react';

export const Topbar = ({ onMenuClick }: { onMenuClick: () => void }) => (
  <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3.5 lg:hidden">
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15">
        <Car className="h-4 w-4 text-primary" />
      </div>
      <span className="font-display text-base tracking-widest text-text">AUTOLEDGER</span>
    </div>
    <button
      onClick={onMenuClick}
      aria-label="Open menu"
      className="rounded-md p-2 text-text-muted hover:bg-surface-2 hover:text-text"
    >
      <Menu className="h-5 w-5" />
    </button>
  </header>
);
