// src/routes/api/create-order.ts
import { createFileRoute } from "@tanstack/react-router";
import Razorpay from "razorpay";

export const Route = createFileRoute("/api/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();

        const { amount, currency = "INR", receipt, subjectId } = body as {
          amount: number;
          currency?: string;
          receipt?: string;
          subjectId?: string;
        };

        if (!amount || amount < 1) {
          return Response.json({ error: "Invalid amount" }, { status: 400 });
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
            subjectId: subjectId ?? "",
          },
        });

        return Response.json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
        });
      },
    },
  },
}); 