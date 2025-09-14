'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Landing() {
  const [hover, setHover] = useState(false);
  const router = useRouter();
  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-[var(--panel)] rounded-2xl p-8 shadow">
        <h1 className="text-2xl font-semibold mb-2">DocumentGPT</h1>
        <p className="text-sm opacity-80 mb-6">Upload → Understand → Act. Chat with your PDFs and dispatch tasks.</p>
        <div
          onDragOver={(e)=>{e.preventDefault(); setHover(true);}}
          onDragLeave={()=>setHover(false)}
          onDrop={(e)=>{e.preventDefault(); setHover(false); router.push('/chat/new');}}
          className={"h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors " + (hover ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-500")}
          onClick={()=>router.push('/chat/new')}
        >
          <div className="text-4xl mb-2">📄</div>
          <span className="text-sm">Drag & drop a PDF or click to start</span>
        </div>
      </div>
    </main>
  );
}
