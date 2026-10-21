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
    DETAILED_NOTES: "Detailed Notes",
    SHORT_NOTES: "Short Notes",
    TEXTBOOK_PDF: "Textbook PDF",
    HANDWRITTEN_NOTE: "Handwritten Notes",
    MICRO_NOTE: "Micro Notes",
    IMPORTANT_QUESTION: "Important Questions",
    UNKNOWN: "Unknown",
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

          const title = extraInfo
            ? `${subject} - ${formatResourceType(resourceType)} (${extraInfo})`
            : `${subject} - ${formatResourceType(resourceType)}`;

          const newSlug = slugify(
            `${resourceType}-${course}-sem-${semester}-${subject}-${extraInfo || formatResourceType(resourceType)}`,
          );

          const bucket = "resources";
          let pdfUrl: string | null = existing.pdf_url;
          let storagePath: string | null = existing.storage_path;
          let newlyUploadedStoragePath: string | null = null;

          // Upload to a unique path for every replacement. Reusing the old path can
          // leave browsers/CDNs showing the previous PDF even after an upsert.
          if (pdf instanceof File && pdf.size > 0) {
            if (pdf.type !== "application/pdf") {
              return Response.json(
                { success: false, message: "Only PDF files are allowed" },
                { status: 400 },
              );
            }

            const newStoragePath =
              `${course}/sem-${semester}/${newSlug}-${crypto.randomUUID()}.pdf`;
            const fileBody = Buffer.from(await pdf.arrayBuffer());

            const { error: uploadError } = await supabaseAdmin.storage
              .from(bucket)
              .upload(newStoragePath, fileBody, {
                contentType: "application/pdf",
                cacheControl: "0",
                upsert: false,
              });

            if (uploadError) {
              return Response.json(
                { success: false, message: uploadError.message },
                { status: 500 },
              );
            }

            newlyUploadedStoragePath = newStoragePath;
            storagePath = newStoragePath;
            pdfUrl = supabaseAdmin.storage.from(bucket).getPublicUrl(newStoragePath).data.publicUrl;
          }

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
            // If the database update failed, keep the old file and clean up the
            // newly uploaded replacement so the resource remains consistent.
            if (newlyUploadedStoragePath) {
              const { error: cleanupError } = await supabaseAdmin.storage
                .from(bucket)
                .remove([newlyUploadedStoragePath]);
              if (cleanupError) {
                console.error("Failed to clean up replacement PDF:", cleanupError);
              }
            }

            return Response.json(
              { success: false, message: updateError.message },
              { status: 500 },
            );
          }

          // Delete the old PDF only after the database points to the new file.
          if (
            newlyUploadedStoragePath &&
            existing.storage_path &&
            existing.storage_path !== newlyUploadedStoragePath
          ) {
            const { error: removeError } = await supabaseAdmin.storage
              .from(bucket)
              .remove([existing.storage_path]);

            if (removeError) {
              // The replacement is already active, so don't report the update as
              // failed. Log the orphaned old object for later cleanup instead.
              console.error("Failed to remove old resource PDF:", removeError);
            }
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
