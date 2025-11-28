import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is missing" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, type = "content", stream = false } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // -----------------------------
    // SYSTEM INSTRUCTIONS
    // -----------------------------
    let systemPrompt = "You are a helpful AI content writer.";

    if (type === "blog") {
      systemPrompt = "You are an expert blog writer. Write high-quality SEO-optimized blogs.";
    } else if (type === "social") {
      systemPrompt = "You create viral social media posts. Write in a catchy style.";
    } else if (type === "ad") {
      systemPrompt = "You write powerful, high-converting ad copy.";
    }

    // -----------------------------
    // TEXT GENERATION (Simple & Working)
    // -----------------------------
    
    // For now, use non-streaming to ensure it works
    // We'll add streaming back step by step
    const fullPrompt = `${systemPrompt}\n\n${prompt}`;
    
    try {
      // Try gemini-2.5-flash first
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
      });

      // Extract text from response
      let generatedText = "";
      
      if (response.text) {
        generatedText = response.text;
      } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
        generatedText = response.candidates[0].content.parts[0].text;
      } else if (typeof response === 'string') {
        generatedText = response;
      }

      if (!generatedText) {
        // Try fallback model
        const fallbackResponse = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: fullPrompt,
        });
        
        generatedText = fallbackResponse.text || 
                       fallbackResponse.candidates?.[0]?.content?.parts?.[0]?.text || 
                       "";
      }

      if (!generatedText) {
        throw new Error("No text generated. Please check your API key and try again.");
      }

      // If streaming is requested, simulate it by sending chunks
      if (stream) {
        const encoder = new TextEncoder();
        const streamResponse = new ReadableStream({
          async start(controller) {
            try {
              // Split text into chunks for streaming effect
              const words = generatedText.split(' ');
              for (let i = 0; i < words.length; i++) {
                const chunk = (i === 0 ? words[i] : ' ' + words[i]);
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ content: chunk, done: false })}\n\n`
                  )
                );
                // Small delay for streaming effect
                await new Promise(resolve => setTimeout(resolve, 20));
              }
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
              controller.close();
            } catch (error) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ error: error.message, done: true })}\n\n`
                )
              );
              controller.close();
            }
          },
        });

        return new Response(streamResponse, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      }

      // Non-streaming response
      return NextResponse.json({
        content: generatedText,
        success: true,
      });

    } catch (error) {
      console.error("Gemini API Error:", error);
      return NextResponse.json(
        { 
          error: error.message || "Failed to generate content. Please check your API key.",
          details: error.toString()
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Gemini API Error:", error);

    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
