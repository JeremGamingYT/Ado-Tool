import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Navigation from "@/components/navigation"

export const metadata: Metadata = {
  title: "Ado Tool",
  description: "Collection of beautiful utilities",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 text-slate-900 dark:text-slate-100 antialiased">
        <div className="fixed inset-0 bg-[url('/grid.png')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none"></div>
        <div className="relative z-10 min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1 px-4 py-8">{children}</main>
          <footer className="mt-auto py-8 text-center text-slate-500 dark:text-slate-400 text-sm border-t border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
            <div className="container mx-auto">
              <div className="flex items-center justify-center space-x-2">
                <span>&copy; {new Date().getFullYear()} Ado Tool</span>
                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                <span>All tools in one beautiful place</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}