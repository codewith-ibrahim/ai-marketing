import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import OpenAI from "openai";

export async function POST(request) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { prompt, type = 'content' } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let systemPrompt = 'You are a helpful AI content writer.';
    
    if (type === 'blog') {
      systemPrompt = 'You are an expert blog writer. Write engaging, SEO-friendly blog posts.';
    } else if (type === 'social') {
      systemPrompt = 'You are a social media expert. Write engaging social media posts.';
    } else if (type === 'ad') {
      systemPrompt = 'You are a copywriting expert. Write compelling ad copy.';
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Using gpt-3.5-turbo as default (cheaper and more available)
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ 
      content,
      usage: completion.usage 
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate content';
    let statusCode = 500;
    
    // Check for specific OpenAI API errors
    if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('exceeded')) {
      errorMessage = 'OpenAI API quota exceeded. Please check your plan and billing details at https://platform.openai.com/account/billing';
      statusCode = 429;
    } else if (error.message?.includes('API key') || error.status === 401) {
      errorMessage = 'Invalid OpenAI API key. Please check your environment variables.';
      statusCode = 401;
    } else if (error.message?.includes('rate limit') || error.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.message?.includes('insufficient_quota')) {
      errorMessage = 'OpenAI API quota exceeded. Please add credits to your account at https://platform.openai.com/account/billing';
      statusCode = 429;
    } else {
      errorMessage = error.message || 'Failed to generate content';
    }
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: error.message,
        status: error.status,
        helpUrl: statusCode === 429 ? 'https://platform.openai.com/account/billing' : undefined
      },
      { status: statusCode }
    );
  }
}

