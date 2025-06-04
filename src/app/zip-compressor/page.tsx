'use client';
import { useState } from 'react';
import { ArrowUpIcon, ArchiveBoxIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function ZipCompressor() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileList, setFileList] = useState<File[]>([]);

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(e.dataTransfer.files);
      setFileList(Array.from(e.dataTransfer.files));
      setError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
      setFileList(Array.from(e.target.files));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) return;
    
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append('files', file));
      
      const res = await fetch('/api/compress', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      
      const blob = await res.blob();
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Compression error:', err);
      setError(err instanceof Error ? err.message : 'Failed to compress files');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Zip Compressor</h1>
        <p className="text-gray-600 dark:text-gray-400">Compress multiple files into a single ZIP archive.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
            
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
                  Select multiple files to compress
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="files-upload"
                />
                <label
                  htmlFor="files-upload"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                  Select Files
                </label>
              </div>
              
              {fileList.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Files ({fileList.length})</h3>
                  <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {fileList.map((file, index) => (
                        <li key={index} className="px-3 py-2 flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            <span className="truncate max-w-[180px]">{file.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
                disabled={!files || files.length === 0 || loading}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md font-medium shadow-sm hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Compressing...' : 'Create ZIP Archive'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            
            {downloadUrl ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center h-40 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="text-center">
                    <ArchiveBoxIcon className="h-16 w-16 mx-auto text-blue-500 mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Archive ready for download</p>
                  </div>
                </div>
                <a
                  href={downloadUrl}
                  download="archive.zip"
                  className="flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-md font-medium shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  <ArchiveBoxIcon className="h-5 w-5 mr-2" />
                  Download ZIP Archive
                </a>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p>Compressed ZIP file will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
