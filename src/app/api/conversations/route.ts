import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: memberships } = await supabase
    .from("conversation_members")
    .select("conversation_id")
    .eq("user_id", user.id);

  if (!memberships || memberships.length === 0) {
    return NextResponse.json({ data: [] });
  }

  const conversationIds = memberships.map((m) => m.conversation_id);

  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      conversation_members (
        user_id,
        role,
        profiles:user_id ( id, full_name, username, avatar_url )
      ),
      messages (
        id, text, sender_id, created_at
      )
    `)
    .in("id", conversationIds)
    .order("updated_at", { ascending: false });

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
  const { name, is_group, member_ids } = body as {
    name?: string;
    is_group?: boolean;
    member_ids: string[];
  };

  const { data: conversation, error: convError } = await supabase
    .from("conversations")
    .insert({
      name: name || null,
      is_group: is_group || false,
      created_by: user.id,
    })
    .select()
    .single();

  if (convError || !conversation) {
    return NextResponse.json({ error: convError?.message || "Failed to create" }, { status: 500 });
  }

  const allMembers = [user.id, ...member_ids.filter((id) => id !== user.id)];
  const memberInserts = allMembers.map((uid) => ({
    conversation_id: conversation.id,
    user_id: uid,
    role: uid === user.id ? "admin" : "member",
  }));

  await supabase.from("conversation_members").insert(memberInserts);

  return NextResponse.json({ data: conversation }, { status: 201 });
}
