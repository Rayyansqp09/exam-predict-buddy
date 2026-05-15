import { createFileRoute } from "@tanstack/react-router";
import { isAdminRequest } from "@/lib/admin-auth.server";
import { supabaseAdmin } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/admin/delete-subject")({
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
          const subjectId = String((body as { subjectId?: unknown })?.subjectId ?? "").trim();

          if (!subjectId) {
            return Response.json(
              { success: false, message: "Subject ID is required" },
              { status: 400 },
            );
          }

          const { data: subject, error: fetchError } = await supabaseAdmin
            .from("subjects")
            .select("storage_path")
            .eq("subject_id", subjectId)
            .single();

          if (fetchError || !subject) {
            return Response.json(
              { success: false, message: "Subject not found" },
              { status: 404 },
            );
          }

          if (subject.storage_path) {
            const { error: storageError } = await supabaseAdmin.storage
              .from("model-papers")
              .remove([subject.storage_path]);

            if (storageError) {
              return Response.json(
                { success: false, message: storageError.message },
                { status: 500 },
              );
            }
          }

          const { error: deleteError } = await supabaseAdmin
            .from("subjects")
            .delete()
            .eq("subject_id", subjectId);

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