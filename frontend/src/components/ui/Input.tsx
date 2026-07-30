import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-md border bg-surface-2 px-3 py-2.5 text-sm text-text placeholder:text-text-faint transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${
            error ? 'border-danger' : 'border-border-strong focus:border-primary'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-danger">{error}</span>}
        {hint && !error && <span className="text-xs text-text-faint">{hint}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
