import Link from 'next/link';
export default function NewChat() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-[var(--panel)] rounded-2xl p-8">
        <h2 className="text-xl font-semibold mb-3">Start a new chat</h2>
        <p className="text-sm opacity-80">This is a placeholder. Wire uploads and create a chat ID, then redirect to /chat/[id].</p>
        <Link href="/chat/temp" className="underline mt-4 inline-block">Continue</Link>
      </div>
    </div>
  );
}
