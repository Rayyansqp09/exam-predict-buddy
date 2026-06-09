import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/article/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { slug } = params;

          const { data, error } = await supabaseAdmin
            .from("articles")
            .select("*")
            .eq("slug", slug)
            .eq("published", true)
            .single();

          if (error || !data) {
            return Response.json(
              {
                success: false,
                message: "Article not found",
              },
              { status: 404 },
            );
          }

          return Response.json({
            success: true,
            article: data,
          });
        } catch (error) {
          console.error(error);

          return Response.json(
            {
              success: false,
              message:
                error instanceof Error
                  ? error.message
                  : "Failed to load article",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});