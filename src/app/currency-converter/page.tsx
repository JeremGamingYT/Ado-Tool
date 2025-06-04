"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowRightLeft, DollarSign, TrendingUp, RefreshCw, AlertCircle } from "lucide-react"

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", "BRL"]

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export default function CurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number> | null>(null)
  const [from, setFrom] = useState("USD")
  const [to, setTo] = useState("EUR")
  const [amount, setAmount] = useState(1)
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setCurrentDate(formatDate(new Date()))
  }, [])

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        if (!data || !data.rates || typeof data.rates !== "object") {
          throw new Error("Invalid response format from exchange rate API")
        }

        if (!(to in data.rates)) {
          throw new Error(`Exchange rate for ${to} not available`)
        }

        setRates(data.rates)

        if (amount > 0 && data.rates[to]) {
          setResult(amount * data.rates[to])
        }
      } catch (err) {
        console.error("Error fetching rates:", err)

        try {
          console.log("Trying fallback API...")
          const fallbackResponse = await fetch(`https://open.er-api.com/v6/latest/${from}`)

          if (!fallbackResponse.ok) {
            throw new Error(`Fallback API error: ${fallbackResponse.status}`)
          }

          const fallbackData = await fallbackResponse.json()

          if (!fallbackData || !fallbackData.rates || typeof fallbackData.rates !== "object") {
            throw new Error("Fallback API also returned invalid format")
          }

          if (!(to in fallbackData.rates)) {
            throw new Error(`Exchange rate for ${to} not available in fallback API`)
          }

          setRates(fallbackData.rates)

          if (amount > 0 && fallbackData.rates[to]) {
            setResult(amount * fallbackData.rates[to])
          }

          setError(null)
        } catch (fallbackErr) {
          console.error("Fallback API also failed:", fallbackErr)
          setError("Unable to fetch exchange rates. Please try again later.")
          setRates(null)
          setResult(null)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
  }, [from, to, amount])

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFrom(e.target.value)
  }

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTo(e.target.value)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    setAmount(isNaN(value) ? 0 : value)

    if (rates && !isNaN(value) && rates[to]) {
      setResult(value * rates[to])
    } else {
      setResult(null)
    }
  }

  const handleSwap = () => {
    setFrom(to)
    setTo(from)
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center space-x-3 mb-6"
        >
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Currency Converter
          </h1>
        </motion.div>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Convert between different currencies with real-time exchange rates and beautiful animations.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Input Section */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-3"
              >
                <label
                  htmlFor="amount"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide"
                >
                  Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="h-6 w-6 text-slate-400" />
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    className="block w-full pl-12 pr-4 py-4 text-xl font-semibold border-2 border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </motion.div>

              <div className="grid grid-cols-5 gap-4 items-end">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="col-span-2"
                >
                  <label
                    htmlFor="from-currency"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3"
                  >
                    From
                  </label>
                  <select
                    id="from-currency"
                    value={from}
                    onChange={handleFromChange}
                    className="block w-full px-4 py-4 text-lg font-semibold border-2 border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={handleSwap}
                    className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                  >
                    <ArrowRightLeft className="h-6 w-6" />
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="col-span-2"
                >
                  <label
                    htmlFor="to-currency"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3"
                  >
                    To
                  </label>
                  <select
                    id="to-currency"
                    value={to}
                    onChange={handleToChange}
                    className="block w-full px-4 py-4 text-lg font-semibold border-2 border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </motion.div>
              </div>
            </div>

            {/* Result Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col justify-center"
            >
              <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 rounded-2xl border-2 border-slate-200/50 dark:border-slate-700/50">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex flex-col justify-center items-center h-32 space-y-4"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl"
                      >
                        <RefreshCw className="h-8 w-8 text-white" />
                      </motion.div>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">Fetching rates...</p>
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center py-8 space-y-4"
                    >
                      <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-2xl w-fit mx-auto">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                      </div>
                      <div>
                        <p className="text-red-600 dark:text-red-400 font-medium mb-2">{error}</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.location.reload()}
                          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-300 font-medium"
                        >
                          Try again
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : result !== null ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center space-y-4"
                    >
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Conversion Result
                      </p>
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
                      >
                        {result.toFixed(2)} {to}
                      </motion.div>
                      <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-semibold">1 {from}</span> ={" "}
                          <span className="font-semibold">
                            {rates?.[to] ? rates[to].toFixed(4) : "—"} {to}
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-slate-500 dark:text-slate-400 py-8 space-y-4"
                    >
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit mx-auto">
                        <DollarSign className="h-8 w-8" />
                      </div>
                      <p className="font-medium">Enter an amount to see the conversion result</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 text-xs text-slate-500 dark:text-slate-400 text-center space-y-1"
              >
                <p className="font-medium">Exchange rates provided by exchangerate-api.com</p>
                {isClient && <p>Last updated: {currentDate}</p>}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}