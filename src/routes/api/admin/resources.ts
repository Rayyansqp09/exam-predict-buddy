import { createFileRoute } from "@tanstack/react-router";
import { isAdminRequest } from "@/lib/admin-auth.server";
import { supabaseAdmin } from "@/lib/supabase.server";

type ResourceRow = {
  id: number;
  resource_slug: string;
  title: string;
  extra_info: string | null;
  description: string | null;
  resource_type: string;
  access_type: string;
  course: string;
  semester: number;
  subject: string;
  original_price: number | null;
  discount_price: number | null;
  preview_page_count: number | null;
  pdf_url: string | null;
  storage_path: string | null;
  is_featured: boolean;
  is_trending: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export const Route = createFileRoute("/api/admin/resources")({
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
            .from("resources")
            .select(
              "id,resource_slug,title,extra_info,description,resource_type,access_type,course,semester,subject,subject_id,original_price,discount_price,preview_page_count,pdf_url,storage_path,is_featured,is_trending,is_published,created_at,updated_at",
            )
            .order("created_at", { ascending: false });

          if (error) {
            return Response.json(
              { success: false, message: error.message },
              { status: 500 },
            );
          }

          const resources =
            (data as ResourceRow[] | null)?.map((row) => ({
              id: row.id,
              slug: row.resource_slug,
              title: row.title,
              extraInfo: row.extra_info,
              description: row.description,
              resourceType: row.resource_type,
              accessType: row.access_type,
              course: row.course,
              semester: row.semester,
              subject: row.subject,
              subjectId: row.subject_id,
              originalPrice: row.original_price,
              discountPrice: row.discount_price,
              previewPageCount: row.preview_page_count,
              pdfUrl: row.pdf_url,
              storagePath: row.storage_path,
              isFeatured: row.is_featured,
              isTrending: row.is_trending,
              isPublished: row.is_published,
              createdAt: row.created_at,
              updatedAt: row.updated_at,
            })) ?? [];

          return Response.json({
            success: true,
            resources,
          });
        } catch (error) {
          console.error(error);
          return Response.json(
            {
              success: false,
              message:
                error instanceof Error ? error.message : "Failed to load resources",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});