import { createFileRoute } from "@tanstack/react-router";
import { isAdminRequest } from "@/lib/admin-auth.server";
import { supabaseAdmin } from "@/lib/supabase.server";

type Scope = "all" | "course" | "course-semester" | "resource-type" | "subject";
type Field = "original_price" | "discount_price";

export const Route = createFileRoute("/api/admin/bulk-resource-update")({
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
            scope?: Scope;
            course?: string;
            semester?: string | number;
            resourceType?: string;
            subject?: string;
            field?: Field;
            value?: string | number | null;
          };

          const scope = body.scope ?? "all";
          const field = body.field ?? "discount_price";

          const course = String(body.course ?? "").trim();
          const resourceType = String(body.resourceType ?? "").trim();
          const subject = String(body.subject ?? "").trim();

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

          if (!["all", "course", "course-semester", "resource-type", "subject"].includes(scope)) {
            return Response.json(
              { success: false, message: "Invalid scope" },
              { status: 400 },
            );
          }

          if (!["original_price", "discount_price"].includes(field)) {
            return Response.json(
              { success: false, message: "Invalid field" },
              { status: 400 },
            );
          }

          if (scope !== "all" && scope !== "subject" && scope !== "resource-type" && !course) {
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

          if (scope === "resource-type" && !resourceType) {
            return Response.json(
              { success: false, message: "Resource type is required" },
              { status: 400 },
            );
          }

          if (scope === "subject" && !subject) {
            return Response.json(
              { success: false, message: "Subject is required" },
              { status: 400 },
            );
          }

          if (
            field === "original_price" &&
            (value === null || !Number.isFinite(value) || value <= 0)
          ) {
            return Response.json(
              { success: false, message: "Price must be a valid positive number" },
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

          let query = supabaseAdmin.from("resources").update(updatePayload);

          switch (scope) {
            case "course":
              query = query.eq("course", course);
              break;
            case "course-semester":
              query = query.eq("course", course).eq("semester", semester!);
              break;
            case "resource-type":
              query = query.eq("resource_type", resourceType);
              break;
            case "subject":
              query = query.eq("subject", subject);
              break;
            case "all":
              query = query.gte("id", 0);
              break;
          }

          const { data, error } = await query.select("id");

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