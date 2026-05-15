import { createFileRoute } from "@tanstack/react-router";
import { isAdminRequest } from "@/lib/admin-auth.server";
import { supabaseAdmin } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/admin/update-subject")({
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

        

          const originalSubjectId = String(formData.get("originalSubjectId") ?? "").trim();
          const course = String(formData.get("course") ?? "").trim();
          const semesterRaw = String(formData.get("semester") ?? "").trim();
          const subjectId = String(formData.get("subjectId") ?? "").trim();
          const name = String(formData.get("name") ?? "").trim();
          const description = String(formData.get("description") ?? "").trim();
          const priceRaw = String(formData.get("price") ?? "").trim();

          const pdf = formData.get("pdf");

          if (!originalSubjectId) {
            return Response.json(
              { success: false, message: "Original subject ID is required" },
              { status: 400 },
            );
          }

          const semester = Number(semesterRaw);
          const price = Number(priceRaw);

          if (!course || !subjectId || !name || !description) {
            return Response.json(
              { success: false, message: "Missing required fields" },
              { status: 400 },
            );
          }

          if (!Number.isFinite(semester) || semester <= 0) {
            return Response.json(
              { success: false, message: "Semester must be valid" },
              { status: 400 },
            );
          }

          if (!Number.isFinite(price) || price <= 0) {
            return Response.json(
              { success: false, message: "Price must be valid" },
              { status: 400 },
            );
          }

          const discountPriceRaw = String(
            formData.get("discountPrice") ?? "",
          ).trim();

         

          let discountPrice: number | null = null;

          if (discountPriceRaw !== "") {
            discountPrice = Number(discountPriceRaw);

            if (!Number.isFinite(discountPrice) || discountPrice < 0) {
              return Response.json(
                {
                  success: false,
                  message: "Discount price must be valid",
                },
                { status: 400 },
              );
            }
          }

          const { data: existing, error: fetchError } = await supabaseAdmin
            .from("subjects")
            .select("storage_path,pdf_url")
            .eq("subject_id", originalSubjectId)
            .single();

          if (fetchError || !existing) {
            return Response.json(
              { success: false, message: "Subject not found" },
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

            const bucket = "model-papers";
            const newStoragePath = `${course}/sem-${semester}/${subjectId}.pdf`;

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

          const { error: updateError } = await supabaseAdmin
            .from("subjects")
            .update({
              course,
              semester,
              subject_id: subjectId,
              name,
              description,
              price,
              discount_price: discountPrice,
              pdf_url: pdfUrl,
              storage_path: storagePath,
            })
            .eq("subject_id", originalSubjectId);

          if (updateError) {
            return Response.json(
              { success: false, message: updateError.message },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,
            message: "Updated successfully",
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