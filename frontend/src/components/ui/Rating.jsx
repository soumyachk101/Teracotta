import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Rating({
  value,
  max = 5,
  size = 'sm',
  showValue = false,
  reviewCount,
  className,
}) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              sizes[size],
              i < Math.floor(value)
                ? 'fill-terracotta-500 text-terracotta-500'
                : 'text-stone-300'
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-stone-600 ml-1">
          {value.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-stone-400"> ({reviewCount})</span>
          )}
        </span>
      )}
      {!showValue && reviewCount !== undefined && (
        <span className="text-xs text-stone-500 ml-1">({reviewCount})</span>
      )}
    </div>
  );
}
