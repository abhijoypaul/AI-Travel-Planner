import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const FALLBACK_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 156.0,
  AUD: 1.51,
  INR: 83.5,
  CAD: 1.37,
  THB: 36.5
};

export async function initExchangeRates() {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (res.ok) {
      const data = await res.json();
      if (data.rates) {
        localStorage.setItem('usd_exchange_rates', JSON.stringify(data.rates));
        window.EXCHANGE_RATES = data.rates;
        return;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch real-time exchange rates, using cache/fallbacks', err);
  }
  // Try loading from localStorage cache
  try {
    const cached = localStorage.getItem('usd_exchange_rates');
    if (cached) {
      window.EXCHANGE_RATES = JSON.parse(cached);
      return;
    }
  } catch {}
  window.EXCHANGE_RATES = FALLBACK_RATES;
}

export function formatCurrency(amount, currency) {
  const selectedCurrency = currency || localStorage.getItem('currency') || 'INR';
  
  // Format currency with proper locale
  const localeMap = {
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    JPY: 'ja-JP',
    AUD: 'en-AU',
    INR: 'en-IN',
    CAD: 'en-CA',
    THB: 'th-TH'
  };
  const locale = localeMap[selectedCurrency] || 'en-US';

  return new Intl.NumberFormat(locale, { style: 'currency', currency: selectedCurrency }).format(amount || 0);
}
