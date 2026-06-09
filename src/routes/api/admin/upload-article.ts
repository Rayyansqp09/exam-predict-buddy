import { createFileRoute } from "@tanstack/react-router";
import { isAdminRequest } from "@/lib/admin-auth.server";
import { supabaseAdmin } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/admin/upload-article")({
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

          const body = await request.json();

          const {
            title,
            slug,
            excerpt,
            content,
            coverImage,
            category,
            author,
            published,
            tags,
          } = body;

          if (!title?.trim()) {
            return Response.json(
              {
                success: false,
                message: "Title is required",
              },
              { status: 400 },
            );
          }

          if (!slug?.trim()) {
            return Response.json(
              {
                success: false,
                message: "Slug is required",
              },
              { status: 400 },
            );
          }

          if (!content?.trim()) {
            return Response.json(
              {
                success: false,
                message: "Content is required",
              },
              { status: 400 },
            );
          }

          const { data, error } = await supabaseAdmin
            .from("articles")
            .insert({
              title: title.trim(),
              slug: slug.trim(),
              excerpt: excerpt?.trim() || null,
              content: content.trim(),
              cover_image: coverImage?.trim() || null,
              category: category?.trim() || null,
              author: author?.trim() || "FYUGP Hub",
              published: Boolean(published),
              tags: tags ?? [],
            })
            .select()
            .single();

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
                  : "Failed to create article",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});