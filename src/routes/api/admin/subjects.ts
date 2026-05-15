import { createFileRoute } from "@tanstack/react-router";
import { isAdminRequest } from "@/lib/admin-auth.server";
import { supabaseAdmin } from "@/lib/supabase.server";

type SubjectRow = {
  course: string;
  semester: number;
  subject_id: string;
  name: string;
  description: string;
  price: number;
  pdf_url: string;
  storage_path: string;
};

export const Route = createFileRoute("/api/admin/subjects")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          if (!isAdminRequest(request)) {
            return Response.json(
              { success: false, message: "Unauthorized" },
              { status: 401 },
            );
          }

          const { data, error } = await supabaseAdmin
            .from("subjects")
            .select("course,semester,subject_id,name,description,price,pdf_url,storage_path")
            .order("created_at", { ascending: false });

          if (error) {
            return Response.json(
              { success: false, message: error.message },
              { status: 500 },
            );
          }

          const subjects =
            (data as SubjectRow[] | null)?.map((row) => ({
              course: row.course,
              semester: row.semester,
              subjectId: row.subject_id,
              name: row.name,
              description: row.description,
              price: row.price,
              pdfUrl: row.pdf_url,
              storagePath: row.storage_path,
            })) ?? [];

          return Response.json({ success: true, subjects });
        } catch (error) {
          console.error(error);
          return Response.json(
            { success: false, message: "Failed to load subjects" },
            { status: 500 },
          );
        }
      },
    },
  },
});