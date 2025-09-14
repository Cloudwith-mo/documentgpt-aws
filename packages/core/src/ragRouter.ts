export type RouterInput = { tokensDoc: number; multiDoc: boolean; needCitations: boolean; slaMs: number; ctx: number };
export type Mode = 'STUFF' | 'RAG_LITE' | 'RAG_FULL';

export function chooseMode(x: RouterInput): Mode {
  if (!x.needCitations && !x.multiDoc && x.tokensDoc < 0.6 * x.ctx) return 'STUFF';
  if (x.slaMs < 1500 || x.tokensDoc < 5 * x.ctx) return 'RAG_LITE';
  return 'RAG_FULL';
}
