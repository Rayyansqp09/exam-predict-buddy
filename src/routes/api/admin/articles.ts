import { createFileRoute } from "@tanstack/react-router";
import { isAdminRequest } from "@/lib/admin-auth.server";
import { supabaseAdmin } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/admin/articles")({
  server: {
    handlers: {
      GET: async ({ request }) => {
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

          const { data, error } = await supabaseAdmin
            .from("articles")
            .select("*")
            .order("created_at", { ascending: false });

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
            articles: data ?? [],
          });
        } catch (error) {
          console.error(error);

          return Response.json(
            {
              success: false,
              message:
                error instanceof Error
                  ? error.message
                  : "Failed to load articles",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});