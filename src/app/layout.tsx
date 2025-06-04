import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ado Tool',
  description: 'Collection of small utilities',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 text-gray-900 dark:text-zinc-100 antialiased flex flex-col">
        <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border-b border-gray-200 dark:border-zinc-800 py-4 px-4 mb-6">
          <nav className="container mx-auto flex flex-wrap gap-x-8 gap-y-3 items-center">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ado Tool
            </Link>
            <div className="flex flex-wrap gap-6 text-gray-600 dark:text-gray-300 font-medium">
              <Link href="/file-converter" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                File Converter
              </Link>
              <Link href="/zip-compressor" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Zip Compressor
              </Link>
              <Link href="/currency-converter" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Currency Converter
              </Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto flex-1 px-4 py-8">{children}</main>
        <footer className="mt-auto py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          <div className="container mx-auto">
            &copy; {new Date().getFullYear()} Ado Tool - All tools in one place
          </div>
        </footer>
      </body>
    </html>
  );
}
