'use client';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

export default function NewChat() {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileUpload = async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setUploading(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // For now, we'll simulate the upload and create a chat ID
      // In a real implementation, this would call your backend
      const chatId = `chat_${Date.now()}`;
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to the chat page
      router.push(`/chat/${chatId}`);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-[var(--panel)] rounded-2xl p-8">
        <h2 className="text-xl font-semibold mb-3">Upload a PDF to start chatting</h2>
        <p className="text-sm opacity-80 mb-6">Upload your document and start asking questions about its content.</p>
        
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-2">📄</div>
              <span className="text-sm">Drag & drop a PDF or click to browse</span>
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          Supported format: PDF files only
        </div>
      </div>
    </div>
  );
}
