import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/resource/pdf/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const slug = params.slug;

          const { data, error } = await supabaseAdmin
            .from("resources")
            .select("pdf_url")
            .eq("resource_slug", slug)
            .single();

          if (error || !data?.pdf_url) {
            return new Response("Resource not found", { status: 404 });
          }

          const upstream = await fetch(data.pdf_url);

          if (!upstream.ok || !upstream.body) {
            return new Response("Failed to fetch PDF", { status: 502 });
          }

          return new Response(upstream.body, {
            status: upstream.status,
            headers: {
              "Content-Type":
                upstream.headers.get("content-type") ?? "application/pdf",
              "Cache-Control": "no-store",
            },
          });
        } catch (error) {
          console.error(error);
          return new Response("PDF proxy failed", { status: 500 });
        }
      },
    },
  },
});