
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, type } = await request.json();

    if (!prompt || !type) {
      return NextResponse.json(
        { error: "Missing prompt or type" },
        { status: 400 }
      );
    }

    const systemPrompt = type === 'image' 
      ? `You are an expert AI image generation prompt engineer. Your task is to enhance user prompts to create stunning, viral-worthy Instagram content. 

Transform the user's simple prompt into a detailed, compelling prompt that will generate amazing results. Include:
- Visual style and aesthetics
- Lighting and atmosphere
- Colors and mood
- Composition details
- Quality keywords (8k, ultra detailed, professional, etc.)

Keep it concise but powerful. Return ONLY the enhanced prompt text, no explanations.`
      : `You are an expert AI video generation prompt engineer. Your task is to enhance user prompts to create engaging, viral Instagram Reels.

Transform the user's simple prompt into a detailed video animation prompt. Include:
- Motion and animation style
- Camera movements
- Transitions and effects
- Mood and pacing
- Duration considerations (15-30 seconds ideal for Reels)

Keep it concise but powerful. Return ONLY the enhanced prompt text, no explanations.`;

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Original prompt: ${prompt}` }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Failed to enhance prompt');
    }

    const data = await response.json();
    const enhancedPrompt = data.choices[0]?.message?.content || prompt;

    return NextResponse.json({ enhancedPrompt });

  } catch (error) {
    console.error('Enhance prompt error:', error);
    return NextResponse.json(
      { error: "Failed to enhance prompt" },
      { status: 500 }
    );
  }
}
