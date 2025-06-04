'use client';
import { useState } from 'react';

export default function FileConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/convert-image', {
      method: 'POST',
      body: formData,
    });
    const blob = await res.blob();
    setOutputUrl(URL.createObjectURL(blob));
  };
  return (
    <section className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">File Converter (Image to PNG)</h1>
      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white/70 dark:bg-zinc-800/70 rounded-lg shadow">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={!file}
        >
          Convert
        </button>
      </form>
      {outputUrl && (
        <div className="p-4 bg-white/70 dark:bg-zinc-800/70 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Result</h2>
          <a href={outputUrl} download="converted.png" className="underline text-blue-600">
            Download converted file
          </a>
          <div className="mt-2">
            <img src={outputUrl} alt="Converted" className="max-w-xs" />
          </div>
        </div>
      )}
    </section>
  );
}
