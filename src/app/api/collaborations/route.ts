import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  let query = supabase
    .from("collaborations")
    .select(`
      *,
      owner:owner_id ( id, full_name, username, avatar_url ),
      collaboration_members ( user_id, role, status )
    `, { count: "exact" })
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, total: count });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, category, tags } = body;

  const { data, error } = await supabase
    .from("collaborations")
    .insert({
      title,
      description: description || null,
      owner_id: user.id,
      category: category || null,
      tags: tags || [],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("collaboration_members").insert({
    collaboration_id: data.id,
    user_id: user.id,
    role: "owner",
    status: "accepted",
  });

  return NextResponse.json({ data }, { status: 201 });
}
