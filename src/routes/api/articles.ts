import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/articles")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { data, error } = await supabaseAdmin
            .from("articles")
            .select(
              "id,title,slug,excerpt,cover_image,category,author,created_at,tags",
            )
            .eq("published", true)
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