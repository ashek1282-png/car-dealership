import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-4 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2">
      <Compass className="h-6 w-6 text-text-faint" />
    </div>
    <div>
      <p className="font-display text-4xl tracking-widest text-text">404</p>
      <p className="mt-1 text-sm text-text-muted">This page isn&apos;t on the lot.</p>
    </div>
    <Link to="/dashboard">
      <Button size="sm">Back to inventory</Button>
    </Link>
  </div>
);
