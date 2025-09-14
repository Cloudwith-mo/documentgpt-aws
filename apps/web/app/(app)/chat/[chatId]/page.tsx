'use client';
import { useEffect, useRef, useState } from 'react';

type Msg = { role: 'user'|'assistant'; content: string; citations?: string[] };

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', content: 'Hello! I\'m DocumentGPT. Upload a PDF and ask me questions about its content. I\'ll provide detailed answers with citations from the document.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    
    setIsLoading(true);
    setMsgs(m => [...m, { role: 'user', content: text }]);
    setInput('');
    
    // Add a typing indicator
    setMsgs(m => [...m, { role: 'assistant', content: 'Thinking...', citations: [] }]);
    
    try {
      // Call the mock provider via API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...msgs, { role: 'user', content: text }],
          chatId: params.chatId 
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setMsgs(m => {
          const newMsgs = [...m];
          newMsgs[newMsgs.length - 1] = { 
            role: 'assistant', 
            content: data.content || 'I understand your question about the document. This is a demo response.',
            citations: data.citations || ['p.1', 'p.2']
          };
          return newMsgs;
        });
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback to demo response
      setMsgs(m => {
        const newMsgs = [...m];
        newMsgs[newMsgs.length - 1] = { 
          role: 'assistant', 
          content: `I understand you're asking about "${text}". This is a demo response from the DocumentGPT system. In a real implementation, I would analyze your uploaded PDF and provide specific answers with citations.`,
          citations: ['p.1', 'p.3']
        };
        return newMsgs;
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        listRef.current?.scrollTo({ top: 999999, behavior: 'smooth' });
      }, 100);
    }
  };

  useEffect(()=>{ listRef.current?.scrollTo({ top: 999999 }); }, []);

  return (
    <div className="grid grid-cols-12 h-dvh">
      <aside className="col-span-2 border-r border-gray-800 p-3 hidden md:block">
        <div className="text-sm opacity-70">Docs</div>
        <div className="mt-2 text-xs opacity-60">• sample.pdf</div>
      </aside>
      <main className="col-span-6 p-4 overflow-hidden">
        <div className="h-full rounded-xl bg-[var(--panel)]" />
      </main>
      <section className="col-span-12 md:col-span-4 border-l border-gray-800 flex flex-col">
        <div className="flex-1 overflow-y-auto p-3 space-y-3" ref={listRef}>
          {msgs.map((m,i)=>(
            <div key={i} className={"max-w-[90%] rounded-xl px-3 py-2 " + (m.role==='user'?'bg-blue-600/20':'bg-gray-700/40')}>
              <div className="whitespace-pre-wrap text-sm">{m.content}</div>
              {!!m.citations && <div className="mt-1 text-xs opacity-70">{m.citations.map((c,j)=><span key={j} className="mr-2">[{j+1}] {c}</span>)}</div>}
            </div>
          ))}
        </div>
        <form onSubmit={e=>{e.preventDefault(); send();}} className="p-3 border-t border-gray-800 flex gap-2">
          <input 
            value={input} 
            onChange={e=>setInput(e.target.value)} 
            className="flex-1 rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm" 
            placeholder="Ask about the document…" 
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-lg bg-blue-600 px-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
      </section>
    </div>
  );
}
