import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ado Tool',
  description: 'Collection of small utilities',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
