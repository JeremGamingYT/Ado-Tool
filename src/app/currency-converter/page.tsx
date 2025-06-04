'use client';
import { useEffect, useState } from 'react';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];

export default function CurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    fetch(`https://api.exchangerate.host/latest?base=${from}`)
      .then((res) => res.json())
      .then((data) => setRates(data.rates));
  }, [from]);

  const convert = () => {
    if (!rates) return;
    const rate = rates[to];
    setResult(amount * rate);
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-xl font-bold">Currency Converter</h1>
      <div className="space-x-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="border p-1"
        />
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="border p-1">
          {CURRENCIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <span>to</span>
        <select value={to} onChange={(e) => setTo(e.target.value)} className="border p-1">
          {CURRENCIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button onClick={convert} className="px-3 py-1 bg-blue-600 text-white rounded">
          Convert
        </button>
      </div>
      {result !== null && (
        <p>{amount} {from} = {result.toFixed(2)} {to}</p>
      )}
    </div>
  );
}
