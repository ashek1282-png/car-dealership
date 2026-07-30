import { NavLink } from 'react-router-dom';
import { Car, LayoutGrid, ShieldCheck, LogOut, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItemClasses = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-primary-muted text-primary' : 'text-text-muted hover:bg-surface-2 hover:text-text'
  }`;

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15">
          <Car className="h-4.5 w-4.5 text-primary" />
        </div>
        <span className="font-display text-lg tracking-widest text-text">AUTOLEDGER</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        {!isAdmin && (
          <NavLink to="/dashboard" className={navItemClasses} onClick={onNavigate} end>
            <LayoutGrid className="h-4.5 w-4.5" />
            Inventory
          </NavLink>
        )}
        {isAdmin && (
          <NavLink to="/admin" className={navItemClasses} onClick={onNavigate}>
            <ShieldCheck className="h-4.5 w-4.5" />
            Admin Console
          </NavLink>
        )}
      </nav>

      <div className="shrink-0 border-t border-border px-3 py-4">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-3 font-display text-sm text-text">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text">{user?.name}</p>
            <p className="truncate text-xs text-text-faint">{user?.role === 'ADMIN' ? 'Administrator' : 'Member'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-danger-muted hover:text-danger"
        >
          <LogOut className="h-4.5 w-4.5" />
          Log out
        </button>
      </div>
    </div>
  );
};

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => (
  <>
    {/* Desktop sidebar */}
    <aside className="hidden w-60 shrink-0 border-r border-border bg-surface lg:flex">
      <SidebarContent />
    </aside>

    {/* Mobile drawer */}
    {isOpen && (
      <div className="fixed inset-0 z-40 flex lg:hidden">
        <div className="absolute inset-0 bg-black/60" onClick={onClose} role="presentation" />
        <div className="relative flex w-64 max-w-[80%] flex-col bg-surface animate-fade-in-up">
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="absolute right-3 top-4 rounded-md p-1.5 text-text-muted hover:bg-surface-2"
          >
            <X className="h-5 w-5" />
          </button>
          <SidebarContent onNavigate={onClose} />
        </div>
      </div>
    )}
  </>
);
