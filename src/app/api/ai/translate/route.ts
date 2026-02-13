import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { translateText } from "@/lib/llm/client";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const text = body.text as string;
  const targetLanguage = body.target_language as string;

  if (!text || !targetLanguage) {
    return NextResponse.json({ error: "text and target_language required" }, { status: 400 });
  }

  try {
    const translated = await translateText(text, targetLanguage);
    return NextResponse.json({ data: { translated, target_language: targetLanguage } });
  } catch (err) {
    return NextResponse.json(
      { error: "Translation failed", details: String(err) },
      { status: 502 }
    );
  }
}
