import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendNewQuoteCustomer } from "@/lib/email/send";

export const runtime = "nodejs";

const bodySchema = z.object({
  matchId: z.string().uuid(),
  amount: z.number().positive(),
  description: z.string().max(500).optional(),
  validUntil: z.string().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid quote payload" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // Verify the user owns the tradie side of this match
  const matchRes = await supabase
    .from("matches")
    .select("id, tradie_id, chat_room_id, tradies(profile_id)")
    .eq("id", parsed.data.matchId)
    .maybeSingle();
  const match = matchRes.data as
    | {
        id: string;
        tradie_id: string;
        chat_room_id: string | null;
        tradies: { profile_id: string } | null;
      }
    | null;

  if (!match || match.tradies?.profile_id !== user.id) {
    return NextResponse.json({ error: "Not your match" }, { status: 403 });
  }
  if (!match.chat_room_id) {
    return NextResponse.json({ error: "Chat room missing" }, { status: 500 });
  }

  // Create the quote
  const quoteRes = await supabase
    .from("quotes")
    .insert({
      match_id: match.id,
      tradie_id: match.tradie_id,
      amount: parsed.data.amount,
      description: parsed.data.description ?? null,
      valid_until: parsed.data.validUntil ?? null,
      status: "pending",
    })
    .select("id")
    .single();

  if (quoteRes.error) {
    return NextResponse.json({ error: quoteRes.error.message }, { status: 500 });
  }
  const quote = quoteRes.data as { id: string };

  // Drop a chat message so it appears inline
  await supabase.from("chat_messages").insert({
    chat_room_id: match.chat_room_id,
    sender_id: user.id,
    content: parsed.data.description ?? "Quote sent",
    message_type: "quote",
    metadata: {
      quote_id: quote.id,
      amount: parsed.data.amount,
      title: parsed.data.description ?? "Quote",
      valid_until: parsed.data.validUntil ?? null,
    } as Record<string, unknown>,
  });

  // Fire-and-forget email to customer.
  void (async () => {
    try {
      const ctx = await supabase
        .from("matches")
        .select(
          "id, tradies(business_name), customers(profiles(email))",
        )
        .eq("id", parsed.data.matchId)
        .single();
      const m = ctx.data as
        | {
            tradies: { business_name: string | null } | null;
            customers: { profiles: { email: string } | null } | null;
          }
        | null;
      const customerEmail = m?.customers?.profiles?.email;
      if (customerEmail) {
        await sendNewQuoteCustomer({
          to: customerEmail,
          tradieBusiness: m?.tradies?.business_name ?? "Your tradie",
          amount: parsed.data.amount,
          matchId: parsed.data.matchId,
        });
      }
    } catch (err) {
      console.error("[quote-email]", err);
    }
  })();

  return NextResponse.json({ ok: true, quote_id: quote.id });
}
