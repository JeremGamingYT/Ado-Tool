"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Download, CheckCircle, AlertCircle, ArrowRightLeft, ImageIcon } from "lucide-react"

export default function FileConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type.startsWith("image/")) {
        setFile(droppedFile)
        setError(null)
      } else {
        setError("Please select an image file")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      setLoading(true)
      setError(null)
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/convert-image", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`)
      }

      const blob = await res.blob()
      setOutputUrl(URL.createObjectURL(blob))
    } catch (err) {
      console.error("Conversion error:", err)
      setError(err instanceof Error ? err.message : "Failed to convert image")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center space-x-3 mb-6"
        >
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl shadow-lg">
            <ArrowRightLeft className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            File Converter
          </h1>
        </motion.div>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Convert your images to PNG format with our easy-to-use tool. Fast, secure, and completely free.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Upload Image</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 scale-105"
                    : "border-slate-300 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500"
                } ${error ? "border-red-300 dark:border-red-700" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <motion.div animate={{ y: dragActive ? -5 : 0 }} transition={{ duration: 0.2 }}>
                  <Upload className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                  <p className="mb-2 text-lg font-medium text-slate-700 dark:text-slate-300">
                    <span className="text-emerald-600 dark:text-emerald-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">PNG, JPG, GIF, WEBP (MAX. 10MB)</p>
                </motion.div>

                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  htmlFor="file-upload"
                  className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 cursor-pointer transition-all duration-300"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Select File
                </motion.label>
              </motion.div>

              <AnimatePresence>
                {file && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800"
                  >
                    <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 truncate">{file.name}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
                  >
                    <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!file || loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Converting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <ArrowRightLeft className="w-5 h-5" />
                    <span>Convert to PNG</span>
                  </div>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Result Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Result</h2>

            <AnimatePresence mode="wait">
              {outputUrl ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <div className="border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 p-4">
                    <img
                      src={outputUrl || "/placeholder.svg"}
                      alt="Converted"
                      className="max-w-full h-auto mx-auto rounded-xl shadow-lg"
                    />
                  </div>
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={outputUrl}
                    download="converted.png"
                    className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download PNG
                  </motion.a>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-80 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl"
                >
                  <ImageIcon className="h-16 w-16 mb-4" />
                  <p className="text-lg font-medium">Converted image will appear here</p>
                  <p className="text-sm">Upload an image to get started</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}