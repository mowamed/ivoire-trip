// Currency conversion utilities

export const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.85,
  XOF: 600
} as const;

export type Currency = keyof typeof EXCHANGE_RATES;

/**
 * Convert amount from selected currency to USD for internal calculations
 */
export const convertToUSD = (amount: number, currency: Currency): number => {
  return Math.round(amount / EXCHANGE_RATES[currency]);
};

/**
 * Convert amount from USD to selected currency for display
 */
export const convertFromUSD = (amount: number, currency: Currency): number => {
  return Math.round(amount * EXCHANGE_RATES[currency]);
};

/**
 * Format price in the specified currency
 */
export const formatPrice = (amount: number, currency: Currency): string => {
  const convertedAmount = convertFromUSD(amount, currency);
  
  if (currency === 'XOF') {
    return `${convertedAmount.toLocaleString()} F CFA`;
  } else if (currency === 'EUR') {
    return `€${convertedAmount.toLocaleString()}`;
  } else {
    return `$${convertedAmount.toLocaleString()}`;
  }
};