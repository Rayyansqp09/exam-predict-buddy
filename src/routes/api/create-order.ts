import { createFileRoute } from "@tanstack/react-router";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          // console.log("CREATE ORDER BODY:", body);
          const {
            amount,
            currency = "INR",
            receipt,

            resourceSlug,
            resourceTitle,
            resourceType,

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

            resourceSlug?: string;
            resourceTitle?: string;
            resourceType?: string;

            subjectId?: string | null;
            subjectName?: string | null;
            course?: string;
            semester?: number;
            originalPrice?: number | null;
            discountPrice?: number | null;
          };

          if (!amount || amount < 1) {
            return Response.json({ error: "Invalid amount" }, { status: 400 });
          }

          if (!resourceSlug || !resourceTitle || !resourceType || !course || !semester) {
            return Response.json(
              { error: "Missing purchase details" },
              { status: 400 },
            );
          }

          const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
          });

          const safeReceipt = `r_${Date.now().toString(36)}_${Math.random()
            .toString(36)
            .slice(2, 8)}`;

          const order = await razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency,
            receipt: safeReceipt,
            notes: {
              resourceSlug,
              resourceTitle,
              resourceType,
              subjectId: subjectId ?? "",
              subjectName: subjectName ?? "",
              course,
              semester: String(semester),
            },
          });

          const { error: insertError } = await supabaseAdmin
            .from("purchases")
            
            .insert({
              resource_slug: resourceSlug,
              resource_title: resourceTitle,
              resource_type: resourceType,

              subject_id: subjectId ?? null,
              subject_name: subjectName ?? null,

              course,
              semester,
              original_price: originalPrice ?? null,
              discount_price: discountPrice ?? null,
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