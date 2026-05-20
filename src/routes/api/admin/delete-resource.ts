import { createFileRoute } from "@tanstack/react-router";
import { isAdminRequest } from "@/lib/admin-auth.server";
import { supabaseAdmin } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/admin/delete-resource")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          if (!isAdminRequest(request)) {
            return Response.json(
              { success: false, message: "Unauthorized" },
              { status: 401 },
            );
          }

          const body = await request.json();
          const slug = String((body as { slug?: unknown })?.slug ?? "").trim();

          if (!slug) {
            return Response.json(
              { success: false, message: "Resource slug is required" },
              { status: 400 },
            );
          }

          const { data: resource, error: fetchError } = await supabaseAdmin
            .from("resources")
            .select("storage_path")
            .eq("resource_slug", slug)
            .single();

          if (fetchError || !resource) {
            return Response.json(
              { success: false, message: "Resource not found" },
              { status: 404 },
            );
          }

          if (resource.storage_path) {
            const { error: storageError } = await supabaseAdmin.storage
              .from("resources")
              .remove([resource.storage_path]);

            if (storageError) {
              return Response.json(
                { success: false, message: storageError.message },
                { status: 500 },
              );
            }
          }

          const { error: deleteError } = await supabaseAdmin
            .from("resources")
            .delete()
            .eq("resource_slug", slug);

          if (deleteError) {
            return Response.json(
              { success: false, message: deleteError.message },
              { status: 500 },
            );
          }

          return Response.json({ success: true });
        } catch (error) {
          console.error(error);
          return Response.json(
            { success: false, message: "Delete failed" },
            { status: 500 },
          );
        }
      },
    },
  },
});