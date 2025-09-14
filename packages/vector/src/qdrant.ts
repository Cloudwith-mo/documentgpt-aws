import fetch from 'node-fetch';

export type Point = { id: string; vector: number[]; payload: Record<string, any> };
export class Qdrant {
  constructor(private url: string, private apiKey?: string) {}
  private headers() {
    const h: any = { 'content-type': 'application/json' };
    if (this.apiKey) h['api-key'] = this.apiKey;
    return h;
  }
  async upsert(collection: string, points: Point[]) {
    const r = await fetch(`${this.url}/collections/${collection}/points`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify({ points })
    });
    if (!r.ok) throw new Error(`qdrant upsert: ${r.status}`);
    return r.json();
  }
  async search(collection: string, vector: number[], top = 10, filter?: any) {
    const r = await fetch(`${this.url}/collections/${collection}/points/search`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ vector, top, filter })
    });
    if (!r.ok) throw new Error(`qdrant search: ${r.status}`);
    return r.json();
  }
}
