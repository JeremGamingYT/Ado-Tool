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
    <div className="p-8 space-y-4">
      <h1 className="text-xl font-bold">File Converter (Image to PNG)</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={!file}
        >
          Convert
        </button>
      </form>
      {outputUrl && (
        <div>
          <h2 className="font-semibold">Result</h2>
          <a href={outputUrl} download="converted.png" className="underline text-blue-600">Download converted file</a>
          <div className="mt-2">
            <img src={outputUrl} alt="Converted" className="max-w-xs" />
          </div>
        </div>
      )}
    </div>
  );
}
