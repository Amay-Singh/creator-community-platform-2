import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const calleeId = body.callee_id as string;
  const callType = (body.call_type as string) || "video";

  if (!calleeId) {
    return NextResponse.json({ error: "callee_id required" }, { status: 400 });
  }

  const callId = randomUUID();

  const { data, error } = await supabase
    .from("calls")
    .insert({
      id: callId,
      caller_id: user.id,
      callee_id: calleeId,
      call_type: callType,
      status: "ringing",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const callId = body.call_id as string;
  const status = body.status as string;

  if (!callId || !status) {
    return NextResponse.json({ error: "call_id and status required" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = { status };
  if (status === "connected") {
    updateData.started_at = new Date().toISOString();
  } else if (status === "ended" || status === "missed" || status === "declined") {
    updateData.ended_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("calls")
    .update(updateData)
    .eq("id", callId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
