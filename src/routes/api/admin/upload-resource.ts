import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/lib/supabase.server";
import { isAdminRequest } from "@/lib/admin-auth.server";

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

export const Route = createFileRoute("/api/admin/upload-resource")({
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

          if (!resourceType) {
            return Response.json(
              { success: false, message: "Resource type is required" },
              { status: 400 },
            );
          }

          if (!accessType || !["free", "premium"].includes(accessType)) {
            return Response.json(
              { success: false, message: "Access type must be free or premium" },
              { status: 400 },
            );
          }

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

          if (!subject) {
            return Response.json(
              { success: false, message: "Subject is required" },
              { status: 400 },
            );
          }

          if (!subjectId) {
            return Response.json(
              { success: false, message: "Subject ID is required" },
              { status: 400 },
            );
          }

          if (!(pdf instanceof File)) {
            return Response.json(
              { success: false, message: "PDF file is required" },
              { status: 400 },
            );
          }

          if (pdf.type !== "application/pdf") {
            return Response.json(
              { success: false, message: "Only PDF files are allowed" },
              { status: 400 },
            );
          }

          let originalPrice: number | null = null;
          let discountPrice: number | null = null;

          if (accessType === "premium") {
            if (!priceRaw) {
              return Response.json(
                { success: false, message: "Price is required for premium resources" },
                { status: 400 },
              );
            }

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

          const readableType = formatResourceType(resourceType);
          const title = extraInfo
            ? `${subject} - ${readableType} (${extraInfo})`
            : `${subject} - ${readableType}`;

          const bucket = "resources";
          const resourceSlug = slugify(
            `${resourceType}-${course}-sem-${semester}-${subject}-${extraInfo || readableType}`,
          );
          const storagePath = `${course}/sem-${semester}/${resourceSlug}.pdf`;

          const arrayBuffer = await pdf.arrayBuffer();
          const fileBody = Buffer.from(arrayBuffer);

          const uploadResult = await supabaseAdmin.storage
            .from(bucket)
            .upload(storagePath, fileBody, {
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
            .getPublicUrl(storagePath);

          const pdfUrl = publicData.publicUrl;

          const { error: insertError } = await supabaseAdmin.from("resources").insert({
            resource_slug: resourceSlug,
            title,
            extra_info: extraInfo || null,
            description: description || null,
            resource_type: resourceType,
            access_type: accessType,
            course,
            semester,
            subject,
            subject_id: subjectId,
            original_price: originalPrice,
            discount_price: discountPrice,
            pdf_url: pdfUrl,
            storage_path: storagePath,
            is_published: true,
          });

          if (insertError) {
            return Response.json(
              { success: false, message: insertError.message },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,
            message: "Resource uploaded successfully",
            resourceSlug,
            pdfUrl,
            title,
          });
        } catch (error) {
          console.error(error);
          return Response.json(
            {
              success: false,
              message: error instanceof Error ? error.message : "Upload failed",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});