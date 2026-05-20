import { createFileRoute } from "@tanstack/react-router";
import { isAdminRequest } from "@/lib/admin-auth.server";
import { supabaseAdmin } from "@/lib/supabase.server";

type PurchaseRow = {
  id: number;
  resource_slug: string | null;
  resource_title: string | null;
  resource_type: string | null;

  subject_id: string | null;
  subject_name: string | null;

  course: string;
  semester: number;
  original_price: number | null;
  discount_price: number | null;
  paid_amount: number;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  payment_status: string;
  created_at: string;
  paid_at: string | null;
};

export const Route = createFileRoute("/api/admin/dashboard")({
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
            .from("purchases")
            .select(
              "id,resource_slug,resource_title,resource_type,subject_id,subject_name,course,semester,original_price,discount_price,paid_amount,razorpay_order_id,razorpay_payment_id,payment_status,created_at,paid_at",
            )
            .order("created_at", { ascending: false });

          if (error) {
            return Response.json(
              { success: false, message: error.message },
              { status: 500 },
            );
          }

          const purchases = (data as PurchaseRow[] | null) ?? [];
          const paidPurchases = purchases.filter(
            (item) => item.payment_status === "paid",
          );

          const totalPurchases = purchases.length;
          const paidCount = paidPurchases.length;
          const pendingCount = purchases.filter(
            (item) => item.payment_status === "pending",
          ).length;

          const totalRevenue = paidPurchases.reduce(
            (sum, item) => sum + Number(item.paid_amount || 0),
            0,
          );

          const byCourseMap = new Map<
            string,
            { course: string; count: number; revenue: number }
          >();

          const bySemesterMap = new Map<
            string,
            { semester: number; count: number; revenue: number }
          >();

          const byResourceTypeMap = new Map<
            string,
            { resourceType: string; count: number; revenue: number }
          >();

          const topResourcesMap = new Map<
            string,
            {
              resourceSlug: string;
              resourceTitle: string;
              resourceType: string;
              course: string;
              semester: number;
              count: number;
              revenue: number;
            }
          >();

          for (const item of paidPurchases) {
            const courseKey = item.course;
            const semesterKey = String(item.semester);
            const resourceTypeKey = item.resource_type ?? "UNKNOWN";
            const resourceSlugKey = item.resource_slug ?? item.resource_title ?? item.subject_name ?? `purchase-${item.id}`;

            const courseEntry = byCourseMap.get(courseKey) ?? {
              course: courseKey,
              count: 0,
              revenue: 0,
            };
            courseEntry.count += 1;
            courseEntry.revenue += Number(item.paid_amount || 0);
            byCourseMap.set(courseKey, courseEntry);

            const semesterEntry = bySemesterMap.get(semesterKey) ?? {
              semester: item.semester,
              count: 0,
              revenue: 0,
            };
            semesterEntry.count += 1;
            semesterEntry.revenue += Number(item.paid_amount || 0);
            bySemesterMap.set(semesterKey, semesterEntry);

            const typeEntry = byResourceTypeMap.get(resourceTypeKey) ?? {
              resourceType: resourceTypeKey,
              count: 0,
              revenue: 0,
            };
            typeEntry.count += 1;
            typeEntry.revenue += Number(item.paid_amount || 0);
            byResourceTypeMap.set(resourceTypeKey, typeEntry);

            const resourceEntry = topResourcesMap.get(resourceSlugKey) ?? {
              resourceSlug: item.resource_slug ?? "",
              resourceTitle: item.resource_title ?? item.subject_name ?? "Untitled",
              resourceType: resourceTypeKey,
              course: item.course,
              semester: item.semester,
              count: 0,
              revenue: 0,
            };
            resourceEntry.count += 1;
            resourceEntry.revenue += Number(item.paid_amount || 0);
            topResourcesMap.set(resourceSlugKey, resourceEntry);
          }

          const byCourse = Array.from(byCourseMap.values()).sort(
            (a, b) => b.count - a.count,
          );

          const bySemester = Array.from(bySemesterMap.values()).sort(
            (a, b) => b.count - a.count,
          );

          const byResourceType = Array.from(byResourceTypeMap.values()).sort(
            (a, b) => b.count - a.count,
          );

          const topResources = Array.from(topResourcesMap.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

          const recentPurchases = purchases.slice(0, 20).map((item) => ({
            id: item.id,
            resourceSlug: item.resource_slug,
            resourceTitle: item.resource_title ?? item.subject_name ?? "Untitled",
            resourceType: item.resource_type ?? "UNKNOWN",

            subjectId: item.subject_id,
            subjectName: item.subject_name,

            course: item.course,
            semester: item.semester,
            originalPrice: item.original_price,
            discountPrice: item.discount_price,
            paidAmount: item.paid_amount,
            paymentStatus: item.payment_status,
            createdAt: item.created_at,
            paidAt: item.paid_at,
            razorpayPaymentId: item.razorpay_payment_id,
          }));

          return Response.json({
            success: true,
            summary: {
              totalPurchases,
              paidCount,
              pendingCount,
              totalRevenue,
              averageOrderValue:
                paidCount > 0 ? Math.round(totalRevenue / paidCount) : 0,
            },
            byCourse,
            bySemester,
            byResourceType,
            topResources,
            recentPurchases,
          });
        } catch (error) {
          console.error(error);
          return Response.json(
            {
              success: false,
              message:
                error instanceof Error
                  ? error.message
                  : "Failed to load dashboard",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});