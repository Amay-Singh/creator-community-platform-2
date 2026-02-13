import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { searchParams } = new URL(request.url);

  const skill = searchParams.get("skill");
  const location = searchParams.get("location");
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (skill) {
    query = query.contains("skills", [skill]);
  }
  if (location) {
    query = query.ilike("location", `%${location}%`);
  }
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,username.ilike.%${search}%,bio.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, total: count });
}
