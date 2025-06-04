'use client';
import { useEffect, useState } from 'react';
import { ArrowsRightLeftIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL'];

// Format date in a consistent way for both server and client
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function CurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set the date once on client side to avoid hydration mismatch
    setIsClient(true);
    setCurrentDate(formatDate(new Date()));
  }, []);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using a more reliable API
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validate the response structure for exchangerate-api.com
        if (!data || !data.rates || typeof data.rates !== 'object') {
          throw new Error('Invalid response format from exchange rate API');
        }
        
        // Check if the target currency exists in the rates
        if (!(to in data.rates)) {
          throw new Error(`Exchange rate for ${to} not available`);
        }
        
        setRates(data.rates);
        
        // If we already have an amount, update the result with the new rates
        if (amount > 0 && data.rates[to]) {
          setResult(amount * data.rates[to]);
        }
      } catch (err) {
        console.error('Error fetching rates:', err);
        
        // Fallback to a different API if the first one fails
        try {
          console.log('Trying fallback API...');
          const fallbackResponse = await fetch(`https://open.er-api.com/v6/latest/${from}`);
          
          if (!fallbackResponse.ok) {
            throw new Error(`Fallback API error: ${fallbackResponse.status}`);
          }
          
          const fallbackData = await fallbackResponse.json();
          
          if (!fallbackData || !fallbackData.rates || typeof fallbackData.rates !== 'object') {
            throw new Error('Fallback API also returned invalid format');
          }
          
          if (!(to in fallbackData.rates)) {
            throw new Error(`Exchange rate for ${to} not available in fallback API`);
          }
          
          setRates(fallbackData.rates);
          
          if (amount > 0 && fallbackData.rates[to]) {
            setResult(amount * fallbackData.rates[to]);
          }
          
          setError(null); // Clear error if fallback succeeds
          
        } catch (fallbackErr) {
          console.error('Fallback API also failed:', fallbackErr);
          setError('Unable to fetch exchange rates. Please try again later.');
          setRates(null);
          setResult(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [from, to, amount]);

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFrom(e.target.value);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTo(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
    
    if (rates && !isNaN(value) && rates[to]) {
      setResult(value * rates[to]);
    } else {
      setResult(null);
    }
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Currency Converter</h1>
        <p className="text-gray-600 dark:text-gray-400">Convert between different currencies with real-time exchange rates.</p>
      </div>
      
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    className="block w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2">
                  <label htmlFor="from-currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
                  <select
                    id="from-currency"
                    value={from}
                    onChange={handleFromChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end justify-center">
                  <button 
                    type="button" 
                    onClick={handleSwap}
                    className="p-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <ArrowsRightLeftIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="to-currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">To</label>
                  <select
                    id="to-currency"
                    value={to}
                    onChange={handleToChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="p-6 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-700">
                {loading ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center py-4">
                    <p>{error}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="mt-2 text-sm text-blue-500 hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : result !== null ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Conversion Result</p>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {result.toFixed(2)} {to}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      1 {from} = {rates?.[to] ? rates[to].toFixed(4) : '—'} {to}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    Enter an amount to see the conversion result
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                <p>Exchange rates provided by exchangerate-api.com</p>
                {isClient && (
                  <p>Last updated: {currentDate}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
