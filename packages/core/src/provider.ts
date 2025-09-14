export type ModelCfg = { name: string; ctx: number; t?: number; topP?: number; seed?: number };
export interface ToolSpec { name: string; description: string; parameters: any; }
export type StreamEvent = { type: 'token' | 'tool' | 'done'; data: any };

export interface LLMProvider {
  chat(opts: {
    system?: string;
    messages: { role: 'system'|'user'|'assistant'|'tool'; content: string; tool_name?: string; tool_result?: any }[];
    tools?: ToolSpec[];
    tool_choice?: 'auto' | { type: 'function'; function: { name: string } };
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
  }): AsyncIterable<StreamEvent>;
}

export const GPT5_DEFAULT: ModelCfg = { name: 'gpt-5-sonnet', ctx: 200_000, t: 0.2, topP: 0.9 };

// Mock provider for local dev: echoes tokens with tiny delay
export class MockProvider implements LLMProvider {
  async *chat(opts: any): AsyncIterable<StreamEvent> {
    const lastUser = [...opts.messages].reverse().find((m:any)=>m.role==='user')?.content || '';
    const fake = `Demo: ${lastUser} → [1]`;
    for (const ch of fake.split(' ')) {
      await new Promise(r=>setTimeout(r, 40));
      yield { type: 'token', data: ch + ' '};
    }
    yield { type: 'done', data: null };
  }
}

// Provider factory (extend with real OpenAI/Bedrock adapters)
export function getProvider(): LLMProvider {
  const p = (process.env.PROVIDER || 'mock').toLowerCase();
  if (p === 'mock') return new MockProvider();
  // TODO: add real adapters: OpenAIProvider, BedrockProvider, etc.
  return new MockProvider();
}
