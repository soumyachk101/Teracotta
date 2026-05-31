import { useState } from 'react';
import { cn } from '../../utils/cn';

export default function ImageWithFallback({ src, alt, className, fallbackClassName }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={cn(
        'bg-cream-200 flex items-center justify-center',
        fallbackClassName || className
      )}>
        <svg className="w-12 h-12 text-stone-400" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 72 L25 90 L35 60 L10 40 L40 40 Z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={cn('absolute inset-0 bg-cream-200 animate-pulse rounded', className)} />
      )}
      <img
        src={src}
        alt={alt}
        className={cn('transition-opacity duration-300', isLoading ? 'opacity-0' : 'opacity-100', className)}
        onLoad={() => setIsLoading(false)}
        onError={() => { setIsLoading(false); setHasError(true); }}
        loading="lazy"
      />
    </div>
  );
}
