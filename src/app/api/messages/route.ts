import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversation_id");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!conversationId) {
    return NextResponse.json({ error: "conversation_id required" }, { status: 400 });
  }

  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      sender:sender_id ( id, full_name, username, avatar_url ),
      message_reactions ( id, emoji, user_id )
    `)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { conversation_id, text, attachment_url, attachment_name, attachment_type, attachment_size } = body;

  if (!conversation_id || !text) {
    return NextResponse.json({ error: "conversation_id and text required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id,
      sender_id: user.id,
      text,
      attachment_url: attachment_url || null,
      attachment_name: attachment_name || null,
      attachment_type: attachment_type || null,
      attachment_size: attachment_size || null,
    })
    .select(`
      *,
      sender:sender_id ( id, full_name, username, avatar_url )
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversation_id);

  return NextResponse.json({ data }, { status: 201 });
}
