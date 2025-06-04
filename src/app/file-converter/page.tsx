'use client';
import { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function FileConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Please select an image file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/convert-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      
      const blob = await res.blob();
      setOutputUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Image Converter</h1>
        <p className="text-gray-600 dark:text-gray-400">Convert your images to PNG format with our easy-to-use tool.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'} ${error ? 'border-red-300 dark:border-red-700' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <ArrowUpIcon className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF, WEBP (MAX. 10MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                  Select File
                </label>
              </div>
              
              {file && (
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span>{file.name}</span>
                  <span className="text-xs">({(file.size / 1024).toFixed(2)} KB)</span>
                </div>
              )}
              
              {error && (
                <div className="flex items-center space-x-2 text-sm text-red-500">
                  <ExclamationCircleIcon className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}
              
              <button
                type="submit"
                disabled={!file || loading}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md font-medium shadow-sm hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Converting...' : 'Convert to PNG'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            
            {outputUrl ? (
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-zinc-900 p-2">
                  <img src={outputUrl} alt="Converted" className="max-w-full h-auto mx-auto rounded" />
                </div>
                <a
                  href={outputUrl}
                  download="converted.png"
                  className="flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-md font-medium shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  <ArrowDownIcon className="h-5 w-5 mr-2" />
                  Download PNG
                </a>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p>Converted image will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
