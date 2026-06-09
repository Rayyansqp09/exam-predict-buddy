import { createFileRoute } from "@tanstack/react-router";
import { isAdminRequest } from "@/lib/admin-auth.server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute(
  "/api/admin/delete-article",
)({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          if (!isAdminRequest(request)) {
            return Response.json(
              {
                success: false,
                message: "Unauthorized",
              },
              { status: 401 },
            );
          }

          const { id } = await request.json();

          const { error } = await supabaseAdmin
            .from("articles")
            .delete()
            .eq("id", id);

          if (error) {
            return Response.json(
              {
                success: false,
                message: error.message,
              },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,
          });
        } catch (error) {
          return Response.json(
            {
              success: false,
              message:
                error instanceof Error
                  ? error.message
                  : "Delete failed",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});