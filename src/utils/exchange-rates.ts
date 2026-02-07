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

// Default rates as fallback
const DEFAULT_RATES: ExchangeRates = {
  USD: 1,
  EUR: 0.92,
  JPY: 149.5,
  GBP: 0.79,
};

export async function getExchangeRates(): Promise<ExchangeRates> {
  try {
    // Check cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { rates, timestamp }: CachedRates = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        console.log('Using cached exchange rates');
        return rates;
      }
    }

    // Fetch from API
    console.log('Fetching fresh exchange rates...');
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('API response not ok:', response.status);
      throw new Error(`Failed to fetch exchange rates: ${response.status}`);
    }

    const data = await response.json();

    if (!data.rates) {
      console.error('No rates in API response:', data);
      throw new Error('No rates in API response');
    }

    const rates: ExchangeRates = {
      USD: 1,
      EUR: data.rates.EUR || DEFAULT_RATES.EUR,
      JPY: data.rates.JPY || DEFAULT_RATES.JPY,
      GBP: data.rates.GBP || DEFAULT_RATES.GBP,
    };

    console.log('Fresh rates fetched:', rates);

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
    return DEFAULT_RATES;
  }
}

export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  rates: ExchangeRates
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Validate inputs
  if (!rates[fromCurrency] || !rates[toCurrency]) {
    console.error(`Invalid currency rates: ${fromCurrency} or ${toCurrency}`, rates);
    return amount; // Return original amount if rates are invalid
  }

  if (isNaN(amount) || !isFinite(amount)) {
    console.error('Invalid amount:', amount);
    return 0;
  }

  // Convert to USD first, then to target currency
  const amountInUSD = amount / rates[fromCurrency];
  const result = amountInUSD * rates[toCurrency];

  if (isNaN(result) || !isFinite(result)) {
    console.error('Conversion resulted in NaN:', { amount, fromCurrency, toCurrency, rates });
    return 0;
  }

  return result;
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
