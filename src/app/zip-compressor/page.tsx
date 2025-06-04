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
    <div className="p-8 space-y-4">
      <h1 className="text-xl font-bold">Zip Compressor</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={!files || files.length === 0}
        >
          Compress
        </button>
      </form>
      {downloadUrl && (
        <a href={downloadUrl} download="archive.zip" className="text-blue-600 underline">
          Download zip
        </a>
      )}
    </div>
  );
}
