import { cn } from '../../utils/cn';

export default function Input({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-3 rounded-xl border bg-white text-stone-900 placeholder-stone-500 text-sm',
          'focus:outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-400/20 transition-all duration-300',
          error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-cream-300',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-stone-500">{helperText}</p>
      )}
    </div>
  );
}
