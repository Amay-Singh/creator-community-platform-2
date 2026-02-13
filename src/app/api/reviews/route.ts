import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const revieweeId = searchParams.get("reviewee_id");

  if (!revieweeId) {
    return NextResponse.json({ error: "reviewee_id required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      reviewer:reviewer_id ( id, full_name, username, avatar_url )
    `)
    .eq("reviewee_id", revieweeId)
    .order("created_at", { ascending: false });

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
  const { reviewee_id, rating, text } = body;

  if (!reviewee_id || !rating || !text) {
    return NextResponse.json({ error: "reviewee_id, rating, and text required" }, { status: 400 });
  }

  if (reviewee_id === user.id) {
    return NextResponse.json({ error: "Cannot review yourself" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      reviewer_id: user.id,
      reviewee_id,
      rating,
      text,
    })
    .select(`
      *,
      reviewer:reviewer_id ( id, full_name, username, avatar_url )
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
