import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/resource/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const slug = params.slug;

          const { data, error } = await supabaseAdmin
            .from("resources")
            .select(
              "id,resource_slug,title,extra_info,description,resource_type,access_type,course,semester,subject_id,subject,original_price,discount_price,pdf_url,storage_path,is_featured,is_trending,is_published,view_count,purchase_count,download_count,preview_page_count,created_at,updated_at",
            )
            .eq("resource_slug", slug)
            .single();

          if (error || !data) {
            return Response.json(
              { success: false, message: "Resource not found" },
              { status: 404 },
            );
          }

          return Response.json({
            success: true,
            resource: {
              id: data.id,
              slug: data.resource_slug,
              title: data.title,
              extraInfo: data.extra_info,
              description: data.description,
              resourceType: data.resource_type,
              accessType: data.access_type,
              course: data.course,
              semester: data.semester,
              subjectId: data.subject_id,
              subject: data.subject,
              originalPrice: data.original_price,
              discountPrice: data.discount_price,
              pdfUrl: data.pdf_url,
              storagePath: data.storage_path,
              isFeatured: data.is_featured,
              isTrending: data.is_trending,
              isPublished: data.is_published,
              viewCount: data.view_count,
              purchaseCount: data.purchase_count,
              downloadCount: data.download_count,
              previewPageCount: data.preview_page_count,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            },
          });
        } catch (error) {
          console.error(error);
          return Response.json(
            {
              success: false,
              message: error instanceof Error ? error.message : "Failed to load resource",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});