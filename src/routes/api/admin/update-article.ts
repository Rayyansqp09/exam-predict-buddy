import { createFileRoute } from "@tanstack/react-router";
import { isAdminRequest } from "@/lib/admin-auth.server";
import { supabaseAdmin } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/admin/update-article")({
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

          const {
            id,
            title,
            slug,
            excerpt,
            content,
            coverImage,
            category,
            author,
            published,
            tags,
          } = await request.json();

          if (!id) {
            return Response.json(
              {
                success: false,
                message: "Article ID required",
              },
              { status: 400 },
            );
          }

          const { error } = await supabaseAdmin
            .from("articles")
            .update({
              title,
              slug,
              excerpt,
              content,
              cover_image: coverImage,
              category,
              author,
              published,
              tags,
              updated_at: new Date().toISOString(),
            })
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
                  : "Update failed",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});