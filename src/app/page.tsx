"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRightLeft, Archive, Banknote, ImageIcon, ArrowRight, Sparkles, Zap, Shield } from "lucide-react"

const tools = [
  {
    href: "/file-converter",
    title: "File Converter",
    description: "Transform images to PNG with lightning speed and perfect quality.",
    icon: ArrowRightLeft,
    gradient: "from-emerald-400 to-cyan-400",
    bgGradient: "from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20",
  },
  {
    href: "/zip-compressor",
    title: "Zip Compressor",
    description: "Compress multiple files into efficient archives effortlessly.",
    icon: Archive,
    gradient: "from-orange-400 to-pink-400",
    bgGradient: "from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20",
  },
  {
    href: "/image-compressor",
    title: "Image Compressor",
    description: "Reduce image file sizes while maintaining excellent quality.",
    icon: ImageIcon,
    gradient: "from-violet-400 to-purple-400",
    bgGradient: "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20",
  },
  {
    href: "/currency-converter",
    title: "Currency Converter",
    description: "Convert currencies with real-time rates and beautiful interface.",
    icon: Banknote,
    gradient: "from-blue-400 to-indigo-400",
    bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
  },
]

const features = [
  { icon: Zap, title: "Lightning Fast", description: "Optimized for speed and performance" },
  { icon: Shield, title: "Secure & Private", description: "All processing happens locally" },
  { icon: Sparkles, title: "Beautiful Design", description: "Crafted with attention to detail" },
]

export default function Home() {
  return (
    <div className="container mx-auto space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8 py-12"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            Ado Tool
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A beautiful collection of powerful utilities designed to make your workflow smoother and more efficient.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex items-center space-x-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full border border-slate-200/50 dark:border-slate-700/50"
              >
                <Icon className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature.title}</span>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.section>

      {/* Tools Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">Choose Your Tool</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Select from our collection of beautifully crafted utilities
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {tools.map((tool, index) => {
            const Icon = tool.icon
            return (
              <motion.div
                key={tool.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Link href={tool.href} className="group block">
                  <div
                    className={`relative p-8 rounded-2xl bg-gradient-to-br ${tool.bgGradient} border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/5 overflow-hidden`}
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-125 transition-transform duration-500"></div>

                    <div className="relative z-10 space-y-4">
                      <motion.div
                        whileHover={{ rotate: 15 }}
                        transition={{ duration: 0.2 }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {tool.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{tool.description}</p>
                      </div>

                      <motion.div
                        className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform duration-200"
                        whileHover={{ x: 2 }}
                      >
                        <span>Get started</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </motion.section>
    </div>
  )
}