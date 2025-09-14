import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, chatId } = await request.json();
    
    // Get the last user message
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
    const userText = lastUserMessage?.content || '';
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Generate a contextual response based on the user's question
    let response = '';
    let citations: string[] = [];
    
    if (userText.toLowerCase().includes('summary') || userText.toLowerCase().includes('summarize')) {
      response = `Based on the document you uploaded, here's a summary: The document appears to contain important information that addresses your question about "${userText}". The key points include relevant details that would typically be found in such documents. This is a demo response showing how DocumentGPT would analyze your PDF and provide a comprehensive summary with proper citations.`;
      citations = ['p.1', 'p.2', 'p.5'];
    } else if (userText.toLowerCase().includes('introduction') || userText.toLowerCase().includes('intro')) {
      response = `The introduction section of your document covers the foundational concepts and background information relevant to the main topic. It establishes the context and provides necessary background for understanding the subsequent sections. This demo response shows how DocumentGPT would extract and explain the introduction from your uploaded PDF.`;
      citations = ['p.1', 'p.2'];
    } else if (userText.toLowerCase().includes('conclusion') || userText.toLowerCase().includes('conclude')) {
      response = `The conclusion section summarizes the key findings and main points discussed throughout the document. It provides a synthesis of the information presented and may include recommendations or future directions. This is how DocumentGPT would analyze the conclusion of your PDF document.`;
      citations = ['p.8', 'p.9'];
    } else if (userText.toLowerCase().includes('what') || userText.toLowerCase().includes('how') || userText.toLowerCase().includes('why')) {
      response = `Based on the content of your uploaded document, I can explain that ${userText.toLowerCase()}. The document contains relevant information that addresses this question, with specific details and explanations that would help clarify the topic. This demo response shows how DocumentGPT would provide detailed answers based on your PDF content.`;
      citations = ['p.3', 'p.4', 'p.6'];
    } else {
      response = `I understand you're asking about "${userText}". Based on the document you uploaded, I can provide insights on this topic. The document contains relevant information that addresses your question, with specific details and context that would help answer your inquiry. This is a demo response showing how DocumentGPT would analyze your PDF and provide comprehensive answers with proper citations.`;
      citations = ['p.2', 'p.4', 'p.7'];
    }
    
    return NextResponse.json({
      content: response,
      citations,
      chatId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
