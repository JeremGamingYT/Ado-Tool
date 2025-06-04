'use client';
import { useState } from 'react';

export default function ZipCompressor() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));
    const res = await fetch('/api/compress', {
      method: 'POST',
      body: formData,
    });
    const blob = await res.blob();
    setDownloadUrl(URL.createObjectURL(blob));
  };

  return (
    <section className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Zip Compressor</h1>
      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white/70 dark:bg-zinc-800/70 rounded-lg shadow">
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="block w-full"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={!files || files.length === 0}
        >
          Compress
        </button>
      </form>
      {downloadUrl && (
        <a href={downloadUrl} download="archive.zip" className="block underline text-blue-600">
          Download zip
        </a>
      )}
    </section>
  );
}
