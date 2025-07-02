import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'USD' | 'EUR' | 'XOF';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amount: number) => string;
  convertPrice: (amount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rates (base: USD)
const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.85, // Approximate rate
  XOF: 600, // Approximate rate (1 USD = 600 XOF)
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  XOF: 'F CFA',
};

const CURRENCY_NAMES: Record<Currency, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  XOF: 'CFA Franc',
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    return (saved as Currency) || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const convertPrice = (amount: number): number => {
    return Math.round(amount * EXCHANGE_RATES[currency]);
  };

  const formatPrice = (amount: number): string => {
    const convertedAmount = convertPrice(amount);
    const symbol = CURRENCY_SYMBOLS[currency];
    
    if (currency === 'XOF') {
      return `${convertedAmount.toLocaleString()} ${symbol}`;
    }
    
    return `${symbol}${convertedAmount.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      formatPrice,
      convertPrice,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export { CURRENCY_NAMES };