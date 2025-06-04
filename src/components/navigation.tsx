"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, ArrowRightLeft, Archive, Banknote, ImageIcon } from "lucide-react"

const navItems = [
  { href: "/file-converter", label: "File Converter", icon: ArrowRightLeft },
  { href: "/zip-compressor", label: "Zip Compressor", icon: Archive },
  { href: "/image-compressor", label: "Image Compressor", icon: ImageIcon },
  { href: "/currency-converter", label: "Currency Converter", icon: Banknote },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 py-4 px-4 mb-6"
    >
      <nav className="container mx-auto flex flex-wrap gap-x-8 gap-y-3 items-center">
        <Link href="/" className="group flex items-center space-x-2">
          <motion.div
            whileHover={{ rotate: 90, scale: 1.05 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Ado Tool
          </span>
        </Link>

        <div className="flex flex-wrap gap-2 text-slate-600 dark:text-slate-300 font-medium">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href} className="relative group">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </motion.div>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </motion.header>
  )
}