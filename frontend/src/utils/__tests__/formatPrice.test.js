import { describe, it, expect } from 'vitest';
import { formatPrice, formatPricePaise } from '../formatPrice';

describe('formatPrice', () => {
  it('should format a number as INR currency', () => {
    const result = formatPrice(1899);
    expect(result).toContain('₹');
    expect(result).toContain('1,899');
  });

  it('should format zero', () => {
    const result = formatPrice(0);
    expect(result).toContain('₹');
    expect(result).toContain('0');
  });

  it('should format large numbers with commas', () => {
    const result = formatPrice(100000);
    expect(result).toContain('1,00,000');
  });

  it('should format decimal amounts by rounding', () => {
    const result = formatPrice(999.50);
    expect(result).toContain('₹');
    // The function uses minimumFractionDigits: 0 and maximumFractionDigits: 0
    // so 999.5 rounds to 1,000
    expect(result).toContain('1,000');
  });
});

describe('formatPricePaise', () => {
  it('should convert paise to rupees and format', () => {
    const result = formatPricePaise(189900);
    expect(result).toContain('₹');
    expect(result).toContain('1,899');
  });

  it('should handle zero paise', () => {
    const result = formatPricePaise(0);
    expect(result).toContain('₹');
    expect(result).toContain('0');
  });

  it('should convert small amounts correctly', () => {
    const result = formatPricePaise(100);
    expect(result).toContain('₹');
    expect(result).toContain('1');
  });
});