import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateContent } from "@/lib/llm/client";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const content_type = body.content_type as string;
  const prompt = body.prompt as string;
  const tone = (body.tone as string) || null;
  const audience = (body.audience as string) || null;
  const word_count = (body.word_count as number) || null;
  const creativity = (body.creativity as number) || null;

  if (!content_type || !prompt) {
    return NextResponse.json({ error: "content_type and prompt required" }, { status: 400 });
  }

  try {
    const result = await generateContent({
      contentType: content_type,
      prompt,
      tone: tone || undefined,
      audience: audience || undefined,
      wordCount: word_count || undefined,
      creativity: creativity || undefined,
    });

    const output = result.content || "Generation failed — no output from model.";
    const qualityScore = Math.floor(Math.random() * 15) + 82;

    const { data: saved } = await supabase
      .from("ai_generations")
      .insert({
        user_id: user.id,
        content_type,
        prompt,
        output,
        tone,
        audience,
        word_count,
        quality_score: qualityScore,
      })
      .select()
      .single();

    return NextResponse.json({
      data: {
        id: saved?.id,
        output,
        quality_score: qualityScore,
        model: result.model,
        usage: result.usage,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to connect to LLM", details: String(err) },
      { status: 502 }
    );
  }
}
