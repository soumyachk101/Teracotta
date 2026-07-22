import { useState } from 'react';
import { cn } from '../../utils/cn';

export default function ImageWithFallback({ src, alt, className, fallbackClassName }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <img
        src="/images/bankura_horse.png"
        alt={alt || "Terracotta craft"}
        className={cn('object-cover', className)}
      />
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
