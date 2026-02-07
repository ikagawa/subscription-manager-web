export type Currency = 'USD' | 'EUR' | 'JPY' | 'GBP';

interface ExchangeRates {
  [key: string]: number;
}

const CACHE_KEY = 'exchange_rates_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CachedRates {
  rates: ExchangeRates;
  timestamp: number;
}

export async function getExchangeRates(): Promise<ExchangeRates> {
  try {
    // Check cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { rates, timestamp }: CachedRates = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return rates;
      }
    }

    // Fetch from API
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();
    const rates: ExchangeRates = {
      USD: 1,
      EUR: data.rates.EUR,
      JPY: data.rates.JPY,
      GBP: data.rates.GBP,
    };

    // Cache the rates
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        rates,
        timestamp: Date.now(),
      })
    );

    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Return default rates if fetch fails
    return {
      USD: 1,
      EUR: 0.92,
      JPY: 149.5,
      GBP: 0.79,
    };
  }
}

export function convertCurrency(amount: number, fromCurrency: Currency, toCurrency: Currency, rates: ExchangeRates): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Convert to USD first, then to target currency
  const amountInUSD = amount / rates[fromCurrency];
  return amountInUSD * rates[toCurrency];
}

export function formatCurrencySymbol(currency: Currency): string {
  const symbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    JPY: '¥',
    GBP: '£',
  };
  return symbols[currency];
}
