import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8 space-y-6">
      <h1 className="text-3xl font-bold">Ado Tool</h1>
      <p>Collection of simple utilities built with Next.js.</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <Link href="/file-converter" className="text-blue-600 underline">
            File Converter
          </Link>
        </li>
        <li>
          <Link href="/zip-compressor" className="text-blue-600 underline">
            Zip Compressor
          </Link>
        </li>
        <li>
          <Link href="/currency-converter" className="text-blue-600 underline">
            Currency Converter
          </Link>
        </li>
      </ul>
    </main>
  );
}
