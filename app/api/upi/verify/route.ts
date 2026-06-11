import { createSupabaseServerClient } from "@/lib/supabase/server";

interface VerifyRequest {
  txnId: string;
}

export async function POST(request: Request) {
  try {
    const body: VerifyRequest = await request.json();

    if (!body.txnId) {
      return Response.json(
        { ok: false, error: "Missing transaction ID" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data: intent, error: fetchError } = await supabase
      .from("payment_intents")
      .select("status, order_ref")
      .eq("txn_id", body.txnId)
      .single();

    if (fetchError || !intent) {
      return Response.json(
        { ok: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    if (intent.status !== "confirmed") {
      return Response.json({ ok: true, status: intent.status });
    }

    const { data: order } = await supabase
      .from("orders")
      .select("id")
      .eq("payment_reference", body.txnId)
      .single();

    return Response.json({
      ok: true,
      status: "paid",
      orderId: order?.id,
    });
  } catch (error) {
    console.error("UPI verify error:", error);
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Verification failed",
      },
      { status: 500 }
    );
  }
}
