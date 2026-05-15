import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/admin/upload-subject")({
    server: {
        handlers: {
            POST: async ({ request }) => {
                try {
                    const formData = await request.formData();

                    const course = String(formData.get("course") ?? "").trim();
                    const semesterRaw = String(formData.get("semester") ?? "").trim();
                    const subjectId = String(formData.get("subjectId") ?? "").trim();
                    const name = String(formData.get("name") ?? "").trim();
                    const description = String(formData.get("description") ?? "").trim();
                    const priceRaw = String(formData.get("price") ?? "").trim();
                    const pdf = formData.get("pdf");

                    if (!course) {
                        return Response.json({ success: false, message: "Course is required" }, { status: 400 });
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
                            { success: false, message: "Semester must be a valid number" },
                            { status: 400 },
                        );
                    }

                    if (!subjectId) {
                        return Response.json(
                            { success: false, message: "Subject ID is required" },
                            { status: 400 },
                        );
                    }

                    if (!name) {
                        return Response.json(
                            { success: false, message: "Subject name is required" },
                            { status: 400 },
                        );
                    }

                    if (!description) {
                        return Response.json(
                            { success: false, message: "Description is required" },
                            { status: 400 },
                        );
                    }

                    const price = Number(priceRaw);
                    if (!Number.isFinite(price) || price <= 0) {
                        return Response.json(
                            { success: false, message: "Price must be a valid number" },
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

                    const bucket = "model-papers";
                    const safeFileName = `${subjectId}.pdf`;
                    const filePath = `${course}/sem-${semester}/${safeFileName}`;

                    const arrayBuffer = await pdf.arrayBuffer();
                    const fileBody = Buffer.from(arrayBuffer);

                    const uploadResult = await supabaseAdmin.storage
                        .from(bucket)
                        .upload(filePath, fileBody, {
                            contentType: "application/pdf",
                            upsert: true,
                        });

                    if (uploadResult.error) {
                        return Response.json(
                            { success: false, message: uploadResult.error.message },
                            { status: 500 },
                        );
                    }

                    const { data: publicData } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);

                    const pdfUrl = publicData.publicUrl;

                    const { error: insertError } = await supabaseAdmin.from("subjects").upsert(
                        {
                            course,
                            semester,
                            subject_id: subjectId,
                            name,
                            description,
                            price,
                            pdf_url: pdfUrl,
                            storage_path: filePath,
                        },
                        {
                            onConflict: "subject_id",
                        },
                    );

                    if (insertError) {
                        return Response.json(
                            { success: false, message: insertError.message, pdfUrl },
                            { status: 500 },
                        );
                    }

                    return Response.json({
                        success: true,
                        message: "Uploaded successfully",
                        pdfUrl,
                        subjectId,
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