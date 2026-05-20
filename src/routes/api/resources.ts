import { createFileRoute } from "@tanstack/react-router";
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
  subject_id: string | null;
  subject: string;
  original_price: number | null;
  discount_price: number | null;
  pdf_url: string | null;
  storage_path: string | null;
  is_featured: boolean;
  is_trending: boolean;
  is_published: boolean;
  view_count: number;
  purchase_count: number;
  download_count: number;
  created_at: string;
  updated_at: string;
};

export const Route = createFileRoute("/api/resources")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { data, error } = await supabaseAdmin
            .from("resources")
            .select(
              "id,resource_slug,title,extra_info,description,resource_type,access_type,course,semester,subject_id,subject,original_price,discount_price,pdf_url,storage_path,is_featured,is_trending,is_published,view_count,purchase_count,download_count,created_at,updated_at",
            )
            .eq("is_published", true)
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
              subjectId: row.subject_id,
              subject: row.subject,
              originalPrice: row.original_price,
              discountPrice: row.discount_price,
              pdfUrl: row.pdf_url,
              storagePath: row.storage_path,
              isFeatured: row.is_featured,
              isTrending: row.is_trending,
              isPublished: row.is_published,
              viewCount: row.view_count,
              purchaseCount: row.purchase_count,
              downloadCount: row.download_count,
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