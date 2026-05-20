import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/lib/supabase.server";

export const Route = createFileRoute(
  "/api/resource/download/$slug",
)({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const slug = params.slug;

          if (!slug) {
            return new Response("Missing slug", {
              status: 400,
            });
          }

          const { data: resource, error } =
            await supabaseAdmin
              .from("resources")
              .select("pdf_url,download_count")
              .eq("resource_slug", slug)
              .single();

          if (error || !resource?.pdf_url) {
            return new Response("Resource not found", {
              status: 404,
            });
          }

          await supabaseAdmin
            .from("resources")
            .update({
              download_count:
                (resource.download_count ?? 0) + 1,
            })
            .eq("resource_slug", slug);

          return Response.redirect(resource.pdf_url, 302);
        } catch (error) {
          console.error(error);

          return new Response("Download failed", {
            status: 500,
          });
        }
      },
    },
  },
});