import Link from 'next/link';

export default function Home() {
  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-extrabold">Ado Tool</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Collection of simple utilities built with Next.js.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        <Link
          href="/file-converter"
          className="block p-6 rounded-lg shadow-md bg-white/70 dark:bg-zinc-800/70 hover:shadow-lg transition"
        >
          <h2 className="font-semibold text-lg mb-1">File Converter</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Convert images to PNG.
          </p>
        </Link>
        <Link
          href="/zip-compressor"
          className="block p-6 rounded-lg shadow-md bg-white/70 dark:bg-zinc-800/70 hover:shadow-lg transition"
        >
          <h2 className="font-semibold text-lg mb-1">Zip Compressor</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Compress multiple files into an archive.
          </p>
        </Link>
        <Link
          href="/currency-converter"
          className="block p-6 rounded-lg shadow-md bg-white/70 dark:bg-zinc-800/70 hover:shadow-lg transition"
        >
          <h2 className="font-semibold text-lg mb-1">Currency Converter</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Convert between currencies using live rates.
          </p>
        </Link>
      </div>
    </section>
  );
}
