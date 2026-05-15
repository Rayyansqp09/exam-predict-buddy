import { createFileRoute } from "@tanstack/react-router";
import { isAdminRequest } from "@/lib/admin-auth.server";
import { supabaseAdmin } from "@/lib/supabase.server";

type BulkScope = "all" | "course" | "course-semester";
type BulkField = "price" | "discount_price";

export const Route = createFileRoute("/api/admin/bulk-price-update")({
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

                    const body = (await request.json()) as {
                        scope?: BulkScope;
                        course?: string;
                        semester?: string | number;
                        field?: BulkField;
                        value?: string | number | null;
                    };

                    const scope = body.scope ?? "all";
                    const field = body.field ?? "price";
                    const course = String(body.course ?? "").trim();
                    const semesterRaw = body.semester;
                    const semester =
                        semesterRaw === undefined || semesterRaw === null || semesterRaw === ""
                            ? null
                            : Number(semesterRaw);

                    const valueRaw = body.value;
                    const value =
                        valueRaw === undefined || valueRaw === null || valueRaw === ""
                            ? null
                            : Number(valueRaw);

                    if (!["all", "course", "course-semester"].includes(scope)) {
                        return Response.json(
                            { success: false, message: "Invalid scope" },
                            { status: 400 },
                        );
                    }

                    if (!["price", "discount_price"].includes(field)) {
                        return Response.json(
                            { success: false, message: "Invalid field" },
                            { status: 400 },
                        );
                    }

                    if (scope !== "all" && !course) {
                        return Response.json(
                            { success: false, message: "Course is required for this scope" },
                            { status: 400 },
                        );
                    }

                    if (scope === "course-semester" && (!Number.isFinite(semester) || semester <= 0)) {
                        return Response.json(
                            { success: false, message: "Semester is required for this scope" },
                            { status: 400 },
                        );
                    }

                    if (field === "price" && (!Number.isFinite(value) || value === null || value <= 0)) {
                        return Response.json(
                            { success: false, message: "Price must be a valid number" },
                            { status: 400 },
                        );
                    }

                    if (
                        field === "discount_price" &&
                        value !== null &&
                        (!Number.isFinite(value) || value < 0)
                    ) {
                        return Response.json(
                            { success: false, message: "Discount price must be valid" },
                            { status: 400 },
                        );
                    }

                    const updatePayload: Record<string, number | null> = {
                        [field]: value,
                    };

                    let query = supabaseAdmin.from("subjects").update(updatePayload);

                    switch (scope) {
                        case "all":
                            query = query.gte("id", 0);
                            break;
                        case "course":
                            query = query.eq("course", course);
                            break;
                        case "course-semester":
                            query = query.eq("course", course).eq("semester", semester!);
                            break;
                    }

                    const { data, error } = await query.select("subject_id");

                    if (error) {
                        return Response.json(
                            { success: false, message: error.message },
                            { status: 500 },
                        );
                    }

                    return Response.json({
                        success: true,
                        updatedCount: data?.length ?? 0,
                    });
                } catch (error) {
                    console.error(error);
                    return Response.json(
                        {
                            success: false,
                            message: error instanceof Error ? error.message : "Bulk update failed",
                        },
                        { status: 500 },
                    );
                }
            },
        },
    },
});