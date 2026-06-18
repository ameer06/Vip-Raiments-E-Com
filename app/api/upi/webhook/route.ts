import { createSupabaseServerClient } from "@/lib/supabase/server";

interface WebhookPayload {
  txnId: string;
  status: "confirmed" | "failed";
  providerRef?: string;
}

export async function POST(request: Request) {
  try {
    const body: WebhookPayload = await request.json();

    if (!body.txnId || !body.status) {
      return Response.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data: intent } = await supabase
      .from("payment_intents")
      .select("status")
      .eq("txn_id", body.txnId)
      .single();

    if (!intent) {
      return Response.json(
        { ok: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    if (intent.status !== "pending") {
      return Response.json({ ok: true, message: "Already processed" });
    }

    const update: Record<string, string | null> = {
      status: body.status,
    };

    if (body.status === "confirmed") {
      update.confirmed_at = new Date().toISOString();
    }

    if (body.providerRef) {
      update.provider_ref = body.providerRef;
    }

    await supabase.from("payment_intents").update(update).eq("txn_id", body.txnId);

    return Response.json({ ok: true, status: body.status });
  } catch (error) {
    console.error("UPI webhook error:", error);
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}
