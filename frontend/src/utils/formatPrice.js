import { CONFIG } from '../constants/config';

export function formatPrice(amount, currency = CONFIG.CURRENCY, locale = 'en-IN') {
  const inRupees = typeof amount === 'number' ? amount : parseFloat(amount) || 0;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(inRupees).replace('₹', CONFIG.CURRENCY_SYMBOL);
}

export function formatPricePaise(paise) {
  return formatPrice(paise / 100);
}
