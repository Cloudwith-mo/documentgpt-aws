// Lambda (Node 20) streaming with awslambda.streamifyResponse
// NOTE: This uses the mock provider by default. Swap to real GPT-5 adapter in @docgpt/core.
import { getProvider } from '@docgpt/core';
const provider = getProvider();

// @ts-ignore - available in Lambda runtime
export const handler = awslambda.streamifyResponse(async (event: any, responseStream: any, ctx: any) => {
  try {
    const body = event.body && typeof event.body === 'string' ? JSON.parse(event.body) : (event.body || {});
    const messages = body.messages || [{ role: 'user', content: 'Hello' }];
    responseStream.setContentType("text/event-stream");
    for await (const ev of provider.chat({ messages })) {
      if (ev.type === 'token') responseStream.write(`data: ${ev.data}\n\n`);
    }
  } catch (e) {
    responseStream.setStatusCode(500);
    responseStream.write(`event: error\ndata: ${(e as Error).message}\n\n`);
  } finally {
    responseStream.end();
  }
});
