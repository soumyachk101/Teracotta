import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Select({ options, value, onChange, placeholder = 'Select...', label, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 rounded-xl border bg-white text-sm transition-all duration-300',
          isOpen ? 'border-terracotta-400 ring-2 ring-terracotta-400/20' : 'border-cream-300',
          error && 'border-red-400'
        )}
      >
        <span className={selected ? 'text-stone-900' : 'text-stone-500'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={cn('h-4 w-4 text-stone-400 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-cream-200 shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={cn(
                'w-full text-left px-4 py-2.5 text-sm hover:bg-cream-100 transition-colors',
                option.value === value && 'bg-terracotta-50 text-terracotta-600 font-medium'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
