"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Download, AlertCircle, Archive, FileText, X } from "lucide-react"

export default function ZipCompressor() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [fileList, setFileList] = useState<File[]>([])

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(e.dataTransfer.files)
      setFileList(Array.from(e.dataTransfer.files))
      setError(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files)
      setFileList(Array.from(e.target.files))
      setError(null)
    }
  }

  const removeFile = (index: number) => {
    const newFileList = fileList.filter((_, i) => i !== index)
    setFileList(newFileList)

    if (newFileList.length === 0) {
      setFiles(null)
    } else {
      const dt = new DataTransfer()
      newFileList.forEach((file) => dt.items.add(file))
      setFiles(dt.files)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!files || files.length === 0) return

    try {
      setLoading(true)
      setError(null)
      const formData = new FormData()
      Array.from(files).forEach((file) => formData.append("files", file))

      const res = await fetch("/api/compress", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`)
      }

      const blob = await res.blob()
      setDownloadUrl(URL.createObjectURL(blob))
    } catch (err) {
      console.error("Compression error:", err)
      setError(err instanceof Error ? err.message : "Failed to compress files")
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB"
    else return (bytes / 1048576).toFixed(2) + " MB"
  }

  const getTotalSize = () => {
    return fileList.reduce((total, file) => total + file.size, 0)
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
          <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl shadow-lg">
            <Archive className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Zip Compressor
          </h1>
        </motion.div>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Compress multiple files into a single ZIP archive. Perfect for organizing and sharing files efficiently.
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
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Upload Files</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 scale-105"
                    : "border-slate-300 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500"
                } ${error ? "border-red-300 dark:border-red-700" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <motion.div animate={{ y: dragActive ? -5 : 0 }} transition={{ duration: 0.2 }}>
                  <Upload className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                  <p className="mb-2 text-lg font-medium text-slate-700 dark:text-slate-300">
                    <span className="text-orange-600 dark:text-orange-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Select multiple files to compress</p>
                </motion.div>

                <input type="file" multiple onChange={handleFileChange} className="hidden" id="files-upload" />
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  htmlFor="files-upload"
                  className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 cursor-pointer transition-all duration-300"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Select Files
                </motion.label>
              </motion.div>

              <AnimatePresence>
                {fileList.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                        Selected Files ({fileList.length})
                      </h3>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Total: {formatFileSize(getTotalSize())}
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                      <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {fileList.map((file, index) => (
                          <motion.div
                            key={`${file.name}-${index}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                          >
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <FileText className="h-5 w-5 text-orange-500 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => removeFile(index)}
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors duration-200"
                            >
                              <X className="h-4 w-4" />
                            </motion.button>
                          </motion.div>
                        ))}
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
                disabled={!files || files.length === 0 || loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
                    <Archive className="w-5 h-5" />
                    <span>Create ZIP Archive</span>
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
              {downloadUrl ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-center h-60 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-2xl">
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="p-6 bg-gradient-to-br from-orange-500 to-pink-500 rounded-3xl shadow-xl mb-4 mx-auto w-fit"
                      >
                        <Archive className="h-16 w-16 text-white" />
                      </motion.div>
                      <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Archive Ready!</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Your files have been compressed successfully
                      </p>
                    </div>
                  </div>
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={downloadUrl}
                    download="archive.zip"
                    className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download ZIP Archive
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
                  <Archive className="h-16 w-16 mb-4" />
                  <p className="text-lg font-medium">Compressed ZIP file will appear here</p>
                  <p className="text-sm">Upload files to get started</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}