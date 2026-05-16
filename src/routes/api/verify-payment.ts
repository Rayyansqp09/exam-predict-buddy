import { createFileRoute } from "@tanstack/react-router";
import crypto from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/verify-payment")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          } = body as {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          };

          if (
            !razorpay_payment_id ||
            !razorpay_order_id ||
            !razorpay_signature
          ) {
            return Response.json(
              { success: false, message: "Missing payment data" },
              { status: 400 },
            );
          }

          const secret = process.env.RAZORPAY_KEY_SECRET;
          if (!secret) {
            return Response.json(
              { success: false, message: "Missing Razorpay secret" },
              { status: 500 },
            );
          }

          const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

          const isValid = expectedSignature === razorpay_signature;

          if (!isValid) {
            return Response.json(
              { success: false, message: "Invalid signature" },
              { status: 401 },
            );
          }

          const { data: purchase, error: fetchError } = await supabaseAdmin
            .from("purchases")
            .select("id, payment_status")
            .eq("razorpay_order_id", razorpay_order_id)
            .single();

          if (fetchError || !purchase) {
            return Response.json(
              { success: false, message: "Purchase record not found" },
              { status: 404 },
            );
          }

          if (purchase.payment_status === "paid") {
            return Response.json({ success: true, message: "Already verified" });
          }

          const { error: updateError } = await supabaseAdmin
            .from("purchases")
            .update({
              payment_status: "paid",
              razorpay_payment_id,
              razorpay_signature,
              paid_at: new Date().toISOString(),
            })
            .eq("razorpay_order_id", razorpay_order_id);

          if (updateError) {
            return Response.json(
              { success: false, message: updateError.message },
              { status: 500 },
            );
          }

          return Response.json({ success: true });
        } catch (error) {
          console.error(error);
          return Response.json(
            { success: false, message: "Verification failed" },
            { status: 500 },
          );
        }
      },
    },
  },
});