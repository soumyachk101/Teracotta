import { cn } from '../../utils/cn';

export default function Skeleton({ className, variant = 'default' }) {
  const variants = {
    default: 'bg-cream-300 animate-pulse',
    text: 'bg-cream-400 h-4 rounded',
    circular: 'bg-cream-300 rounded-full animate-pulse',
  };

  return <div className={cn(variants[variant], className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card-product">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    </div>
  );
}
