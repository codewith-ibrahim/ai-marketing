import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, type = 'content', stream = false } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let systemPrompt = 'You are a helpful AI content writer.';
    if (type === 'blog') {
      systemPrompt = 'You are an expert blog writer. Write engaging, SEO-friendly blog posts.';
    } else if (type === 'social') {
      systemPrompt = 'You are a social media expert. Write engaging social media posts.';
    } else if (type === 'ad') {
      systemPrompt = 'You are a copywriting expert. Write compelling ad copy.';
    }

    const fullPrompt = `${systemPrompt}\n\n${prompt}`;

    const modelsToTry = ['gemini-2.5-flash'];

    // If streaming is requested, use streaming API
    if (stream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            let model = null;
            let lastError = null;

            for (const modelName of modelsToTry) {
              try {
                model = genAI.getGenerativeModel({
                  model: modelName,
                  generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
                });
                break;
              } catch (err) {
                lastError = err;
                console.warn(`Model ${modelName} failed:`, err);
              }
            }

            if (!model) {
              throw lastError || new Error('No model succeeded');
            }

            const result = await model.generateContentStream(fullPrompt);
            
            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              if (chunkText) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunkText, done: false })}\n\n`));
              }
            }

            // Send completion signal
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
            controller.close();
          } catch (error) {
            console.error('Streaming error:', error);
            const errorMessage = error.message || 'Failed to generate content';
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMessage, done: true })}\n\n`));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Non-streaming response (fallback)
    let result = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
        });

        result = await model.generateContent(fullPrompt);
        break;
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} failed:`, err);
      }
    }

    if (!result) throw lastError || new Error('No model succeeded');

    const response = await result.response;
    const content = response.text() || '';

    return NextResponse.json({
      content,
      usage: {
        promptTokens: response.usageMetadata?.promptTokenCount || 0,
        completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: response.usageMetadata?.totalTokenCount || 0,
      },
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    let errorMessage = 'Failed to generate content';
    let statusCode = 500;

    if (error.status === 429 || error.message?.toLowerCase().includes('quota')) {
      errorMessage = 'Gemini API quota exceeded. Please check your usage / billing.';
      statusCode = 429;
    } else if (error.status === 401 || error.message?.toLowerCase().includes('invalid') || error.message?.toLowerCase().includes('key')) {
      errorMessage = 'Invalid Gemini API key.';
      statusCode = 401;
    } else if (error.message?.toLowerCase().includes('rate limit')) {
      errorMessage = 'Rate limit exceeded.';
      statusCode = 429;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage, details: error.message }, { status: statusCode });
  }
}
