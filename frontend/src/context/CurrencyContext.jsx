/**
 * context/CurrencyContext.jsx
 * Global currency state — synced with user profile, persisted in localStorage
 * Provides: currency, setCurrency, formatAmount
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
];

const CurrencyContext = createContext(null);

export { CURRENCIES };

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(
    () => localStorage.getItem('currency') || 'INR'
  );

  const setCurrency = useCallback((code) => {
    setCurrencyState(code);
    localStorage.setItem('currency', code);
  }, []);

  // Format a number as currency string
  const formatAmount = useCallback((amount) => {
    const curr = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];
    return `${curr.symbol}${Number(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, [currency]);

  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol || '₹';

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount, currencySymbol, CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};
