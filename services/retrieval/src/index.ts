import { Qdrant } from '@docgpt/vector/src/qdrant';

const client = new Qdrant(process.env.QDRANT_URL || 'http://localhost:6333', process.env.QDRANT_API_KEY);
export async function search(collection: string, vector: number[]) {
  return client.search(collection, vector, 8);
}
