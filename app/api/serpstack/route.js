import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { url, keyword } = await request.json();

    if (!url && !keyword) {
      return NextResponse.json(
        { error: 'URL or keyword is required' },
        { status: 400 }
      );
    }

    const serpstackApiKey = process.env.SERPSTACK_API_KEY;
    
    if (!serpstackApiKey) {
      return NextResponse.json(
        { error: 'SERPSTACK API key not configured' },
        { status: 500 }
      );
    }

    // If keyword is provided, get SERP data
    if (keyword) {
      const serpResponse = await axios.get('http://api.serpstack.com/search', {
        params: {
          access_key: serpstackApiKey,
          query: keyword,
          engine: 'google',
        },
      });

      return NextResponse.json({
        type: 'serp',
        data: serpResponse.data,
      });
    }

    // If URL is provided, analyze the website
    // You can use other SEO APIs here or implement your own analysis
    return NextResponse.json({
      type: 'url_analysis',
      url,
      message: 'URL analysis feature - implement with your preferred SEO API',
    });
  } catch (error) {
    console.error('SERPSTACK API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SEO data', details: error.message },
      { status: 500 }
    );
  }
}

