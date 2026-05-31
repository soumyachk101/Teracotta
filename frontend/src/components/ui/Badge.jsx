import { cn } from '../../utils/cn';

export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-stone-100 text-stone-700 border border-stone-200',
    gi: 'bg-amber-50 text-amber-700 border border-amber-200',
    bestseller: 'bg-terracotta-50 text-terracotta-600 border border-terracotta-200',
    limited: 'bg-stone-800 text-cream-100 border border-stone-800',
    premium: 'bg-gold-500/10 text-gold-600 border border-gold-400/30',
    trending: 'bg-cream-200 text-stone-700 border border-stone-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
