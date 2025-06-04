import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ado Tool',
  description: 'Collection of small utilities',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 antialiased flex flex-col">
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 mb-6">
          <nav className="container mx-auto flex gap-6 text-white font-medium">
            <Link href="/" className="hover:underline">Ado Tool</Link>
            <Link href="/file-converter" className="hover:underline">File Converter</Link>
            <Link href="/zip-compressor" className="hover:underline">Zip Compressor</Link>
            <Link href="/currency-converter" className="hover:underline">Currency Converter</Link>
          </nav>
        </header>
        <main className="container mx-auto flex-1 px-4 pb-10">{children}</main>
      </body>
    </html>
  );
}
