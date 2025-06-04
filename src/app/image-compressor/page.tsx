"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Download, CheckCircle, AlertCircle, ImageIcon, Sliders, Info } from "lucide-react"

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [quality, setQuality] = useState(80)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number>(0)

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
        setOriginalSize(droppedFile.size)
        setError(null)
      } else {
        setError("Please select an image file")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setOriginalSize(selectedFile.size)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      setLoading(true)
      setError(null)

      // Create canvas for compression
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        // Set canvas dimensions
        canvas.width = img.width
        canvas.height = img.height

        // Draw image on canvas
        ctx?.drawImage(img, 0, 0)

        // Convert to blob with specified quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedSize(blob.size)
              setOutputUrl(URL.createObjectURL(blob))
            }
            setLoading(false)
          },
          "image/jpeg",
          quality / 100,
        )
      }

      img.onerror = () => {
        setError("Failed to load image")
        setLoading(false)
      }

      img.src = URL.createObjectURL(file)
    } catch (err) {
      console.error("Compression error:", err)
      setError(err instanceof Error ? err.message : "Failed to compress image")
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB"
    else return (bytes / 1048576).toFixed(2) + " MB"
  }

  const getCompressionRatio = () => {
    if (originalSize && compressedSize) {
      return ((1 - compressedSize / originalSize) * 100).toFixed(1)
    }
    return "0"
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
          <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl shadow-lg">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Image Compressor
          </h1>
        </motion.div>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Reduce image file sizes while maintaining excellent quality. Perfect for web optimization and storage.
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
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Upload & Compress</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 scale-105"
                    : "border-slate-300 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500"
                } ${error ? "border-red-300 dark:border-red-700" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <motion.div animate={{ y: dragActive ? -5 : 0 }} transition={{ duration: 0.2 }}>
                  <Upload className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                  <p className="mb-2 text-lg font-medium text-slate-700 dark:text-slate-300">
                    <span className="text-violet-600 dark:text-violet-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">PNG, JPG, WEBP (MAX. 10MB)</p>
                </motion.div>

                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="image-upload" />
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  htmlFor="image-upload"
                  className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-violet-500/20 cursor-pointer transition-all duration-300"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Select Image
                </motion.label>
              </motion.div>

              <AnimatePresence>
                {file && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200 dark:border-violet-800">
                      <CheckCircle className="h-6 w-6 text-violet-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-violet-800 dark:text-violet-200 truncate">{file.name}</p>
                        <p className="text-xs text-violet-600 dark:text-violet-400">
                          Original size: {formatFileSize(originalSize)}
                        </p>
                      </div>
                    </div>

                    {/* Quality Slider */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                          <Sliders className="w-4 h-4" />
                          <span>Quality</span>
                        </label>
                        <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">{quality}%</span>
                      </div>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="range"
                        min="10"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Lower quality = smaller file size. Higher quality = better image but larger file.
                        </p>
                      </div>
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
                className="w-full px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Compressing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <ImageIcon className="w-5 h-5" />
                    <span>Compress Image</span>
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
                  {/* Compression Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                        Size Reduction
                      </p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">{getCompressionRatio()}%</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                        New Size
                      </p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {formatFileSize(compressedSize)}
                      </p>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 p-4">
                    <img
                      src={outputUrl || "/placeholder.svg"}
                      alt="Compressed"
                      className="max-w-full h-auto mx-auto rounded-xl shadow-lg"
                    />
                  </div>

                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={outputUrl}
                    download="compressed-image.jpg"
                    className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Compressed Image
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
                  <p className="text-lg font-medium">Compressed image will appear here</p>
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