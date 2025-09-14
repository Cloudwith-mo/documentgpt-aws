// Planner→Executor skeleton goes here. For now, just a stub.
export async function planAndRun(input: string) {
  return [{ tool: 'parse_document', args: { docId: 'demo' } }];
}
