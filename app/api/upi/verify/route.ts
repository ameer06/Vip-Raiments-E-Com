import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient, hasSupabaseServiceRole } from "@/lib/supabase/admin";

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

    let orderId: string | undefined;

    if (hasSupabaseServiceRole()) {
      const adminClient = createSupabaseAdminClient();
      const { data: order } = await adminClient
        .from("orders")
        .select("id")
        .eq("payment_reference", body.txnId)
        .maybeSingle();
      orderId = order?.id;
    }

    return Response.json({
      ok: true,
      status: "paid",
      orderId,
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
