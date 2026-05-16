import { createFileRoute } from "@tanstack/react-router";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          const {
            amount,
            currency = "INR",
            receipt,
            subjectId,
            subjectName,
            course,
            semester,
            originalPrice,
            discountPrice,
          } = body as {
            amount: number;
            currency?: string;
            receipt?: string;
            subjectId?: string;
            subjectName?: string;
            course?: string;
            semester?: number;
            originalPrice?: number;
            discountPrice?: number | null;
          };

          if (!amount || amount < 1) {
            return Response.json({ error: "Invalid amount" }, { status: 400 });
          }

          if (
            !subjectId ||
            !subjectName ||
            !course ||
            !semester ||
            !originalPrice
          ) {
            return Response.json(
              { error: "Missing purchase details" },
              { status: 400 },
            );
          }

          const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
          });

          const order = await razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency,
            receipt: receipt ?? `rcpt_${Date.now()}`,
            notes: {
              subjectId,
              subjectName,
              course,
              semester: String(semester),
            },
          });

          const { error: insertError } = await supabaseAdmin
            .from("purchases")
            .insert({
              subject_id: subjectId,
              subject_name: subjectName,
              course,
              semester,
              original_price: originalPrice,
              discount_price: discountPrice,
              paid_amount: amount,
              razorpay_order_id: order.id,
              payment_status: "pending",
            });

          if (insertError) {
            return Response.json(
              { error: insertError.message },
              { status: 500 },
            );
          }

          return Response.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
          });
        } catch (error) {
          console.error(error);
          return Response.json(
            { error: "Failed to create order" },
            { status: 500 },
          );
        }
      },
    },
  },
});