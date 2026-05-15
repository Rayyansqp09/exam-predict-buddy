import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/lib/supabase.server";

type SubjectRow = {
  subject_id: string;
  name: string;
  description: string;
  price: number;
  pdf_url: string;
};

export const Route = createFileRoute("/api/subjects")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const course = url.searchParams.get("course")?.trim() ?? "";
          const semesterRaw = url.searchParams.get("semester")?.trim() ?? "";

          if (!course) {
            return Response.json(
              { success: false, message: "Course is required" },
              { status: 400 },
            );
          }

          if (!semesterRaw) {
            return Response.json(
              { success: false, message: "Semester is required" },
              { status: 400 },
            );
          }

          const semester = Number(semesterRaw);
          if (!Number.isFinite(semester) || semester <= 0) {
            return Response.json(
              { success: false, message: "Semester must be valid" },
              { status: 400 },
            );
          }

          const { data, error } = await supabaseAdmin
            .from("subjects")
            .select("subject_id,name,description,price,pdf_url")
            .eq("course", course)
            .eq("semester", semester)
            .order("name", { ascending: true });

          if (error) {
            return Response.json(
              { success: false, message: error.message },
              { status: 500 },
            );
          }

          const subjects =
            (data as SubjectRow[] | null)?.map((row) => ({
              id: row.subject_id,
              name: row.name,
              description: row.description,
              price: row.price,
              pdfUrl: row.pdf_url,
            })) ?? [];

          return Response.json({
            success: true,
            subjects,
          });
        } catch (error) {
          console.error(error);
          return Response.json(
            {
              success: false,
              message: error instanceof Error ? error.message : "Failed to load subjects",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});