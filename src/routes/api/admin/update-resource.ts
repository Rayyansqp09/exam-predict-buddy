import { createFileRoute } from "@tanstack/react-router";
import { isAdminRequest } from "@/lib/admin-auth.server";
import { supabaseAdmin } from "@/lib/supabase.server";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatResourceType(resourceType: string) {
  const map: Record<string, string> = {
    MODEL_PAPER: "Model Paper",
    PYQ: "PYQ",
    QUESTION_BANK: "Question Bank",
    STUDY_MATERIAL: "Study Material",
    TEXTBOOK_PDF: "Textbook PDF",
    HANDWRITTEN_NOTE: "Handwritten Notes",
    MICRO_NOTE: "Micro Notes",
    IMPORTANT_QUESTION: "Important Questions",
  };
  return map[resourceType] ?? resourceType;
}

export const Route = createFileRoute("/api/admin/update-resource")({
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

          const formData = await request.formData();

          const originalSlug = String(formData.get("originalSlug") ?? "").trim();
          const resourceType = String(formData.get("resourceType") ?? "").trim();
          const accessType = String(formData.get("accessType") ?? "").trim();
          const course = String(formData.get("course") ?? "").trim();
          const semesterRaw = String(formData.get("semester") ?? "").trim();
          const subject = String(formData.get("subject") ?? "").trim();
          const subjectId = String(formData.get("subjectId") ?? "").trim();
          const extraInfo = String(formData.get("extraInfo") ?? "").trim();
          const description = String(formData.get("description") ?? "").trim();
          const priceRaw = String(formData.get("price") ?? "").trim();
          const discountPriceRaw = String(formData.get("discountPrice") ?? "").trim();
          const pdf = formData.get("pdf");
          const previewPageCountRaw = String(formData.get("previewPageCount") ?? "").trim();
          const parsedPreviewCount = Number(previewPageCountRaw);

          const previewPageCount =
            Number.isFinite(parsedPreviewCount) && parsedPreviewCount >= 0
              ? parsedPreviewCount
              : 0;

          if (!originalSlug) {
            return Response.json(
              { success: false, message: "Original slug is required" },
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

          if (!resourceType || !accessType || !course || !subject) {
            return Response.json(
              { success: false, message: "Missing required fields" },
              { status: 400 },
            );
          }

          let originalPrice: number | null = null;
          let discountPrice: number | null = null;

          if (accessType === "premium") {
            originalPrice = Number(priceRaw);
            if (!Number.isFinite(originalPrice) || originalPrice <= 0) {
              return Response.json(
                { success: false, message: "Price must be valid" },
                { status: 400 },
              );
            }

            if (discountPriceRaw !== "") {
              discountPrice = Number(discountPriceRaw);
              if (!Number.isFinite(discountPrice) || discountPrice < 0) {
                return Response.json(
                  { success: false, message: "Discount price must be valid" },
                  { status: 400 },
                );
              }
            }
          }

          const { data: existing, error: fetchError } = await supabaseAdmin
            .from("resources")
            .select("storage_path,pdf_url")
            .eq("resource_slug", originalSlug)
            .single();

          if (fetchError || !existing) {
            return Response.json(
              { success: false, message: "Resource not found" },
              { status: 404 },
            );
          }

          let pdfUrl = existing.pdf_url;
          let storagePath = existing.storage_path;

          if (pdf instanceof File && pdf.size > 0) {
            if (pdf.type !== "application/pdf") {
              return Response.json(
                { success: false, message: "Only PDF files are allowed" },
                { status: 400 },
              );
            }

            const bucket = "resources";
            const newSlug = slugify(
              `${resourceType}-${course}-sem-${semester}-${subject}-${extraInfo || formatResourceType(resourceType)}`,
            );
            const newStoragePath = `${course}/sem-${semester}/${newSlug}.pdf`;

            const arrayBuffer = await pdf.arrayBuffer();
            const fileBody = Buffer.from(arrayBuffer);

            const uploadResult = await supabaseAdmin.storage
              .from(bucket)
              .upload(newStoragePath, fileBody, {
                contentType: "application/pdf",
                upsert: true,
              });

            if (uploadResult.error) {
              return Response.json(
                { success: false, message: uploadResult.error.message },
                { status: 500 },
              );
            }

            const { data: publicData } = supabaseAdmin.storage
              .from(bucket)
              .getPublicUrl(newStoragePath);

            pdfUrl = publicData.publicUrl;
            storagePath = newStoragePath;

            if (existing.storage_path && existing.storage_path !== newStoragePath) {
              await supabaseAdmin.storage.from(bucket).remove([existing.storage_path]);
            }
          }

          const title = extraInfo
            ? `${subject} - ${formatResourceType(resourceType)} (${extraInfo})`
            : `${subject} - ${formatResourceType(resourceType)}`;

          const newSlug = slugify(
            `${resourceType}-${course}-sem-${semester}-${subject}-${extraInfo || formatResourceType(resourceType)}`,
          );

          const { error: updateError } = await supabaseAdmin
            .from("resources")
            .update({
              resource_slug: newSlug,
              title,
              extra_info: extraInfo || null,
              resource_type: resourceType,
              access_type: accessType,
              course,
              semester,
              subject,
              subject_id: subjectId,
              description: description || null,
              original_price: originalPrice,
              discount_price: discountPrice,
              pdf_url: pdfUrl,
              storage_path: storagePath,
              is_published: true,
              preview_page_count: previewPageCount,
            })
            .eq("resource_slug", originalSlug);

          if (updateError) {
            return Response.json(
              { success: false, message: updateError.message },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,
            message: "Updated successfully",
            resourceSlug: newSlug,
            pdfUrl,
          });
        } catch (error) {
          console.error(error);
          return Response.json(
            { success: false, message: "Update failed" },
            { status: 500 },
          );
        }
      },
    },
  },
});