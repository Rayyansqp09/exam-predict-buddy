import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Clock3,
  CreditCard,
  FileText,
  Package2,
  TrendingUp,
  Users,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DashboardResponse =
  | {
    success: true;
    summary: {
      totalPurchases: number;
      paidCount: number;
      pendingCount: number;
      totalRevenue: number;
      averageOrderValue: number;
    };
    byCourse: Array<{
      course: string;
      count: number;
      revenue: number;
    }>;
    bySemester: Array<{
      semester: number;
      count: number;
      revenue: number;
    }>;
    byResourceType: Array<{
      resourceType: string;
      count: number;
      revenue: number;
    }>;
    topResources: Array<{
      resourceSlug: string;
      resourceTitle: string;
      resourceType: string;
      course: string;
      semester: number;
      count: number;
      revenue: number;
    }>;
    recentPurchases: Array<{
      id: number;
      resourceSlug: string | null;
      resourceTitle: string;
      resourceType: string;

      subjectId: string | null;
      subjectName: string | null;

      course: string;
      semester: number;
      originalPrice: number | null;
      discountPrice: number | null;
      paidAmount: number;
      paymentStatus: string;
      createdAt: string;
      paidAt: string | null;
      razorpayPaymentId: string | null;
    }>;
  }
  | {
    success: false;
    message: string;
  };

export const Route = createFileRoute("/admin-dashboard")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] =
    useState<Extract<DashboardResponse, { success: true }> | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/admin/dashboard");
        const json = (await res.json()) as DashboardResponse;

        if (!res.ok || !json.success) {
          throw new Error(json.success ? "Failed to load dashboard" : json.message);
        }

        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const revenueLabel = useMemo(() => {
    if (!data) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(data.summary.totalRevenue);
  }, [data]);

  const money = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }),
    [],
  );

  const fmt = (value: number) => money.format(value);

  const formatResourceType = (type: string) => {
    const map: Record<string, string> = {
      MODEL_PAPER: "Model Paper",
      PYQ: "PYQ",
      QUESTION_BANK: "Question Bank",
      STUDY_MATERIAL: "Study Material",
      TEXTBOOK_PDF: "Textbook PDF",
      HANDWRITTEN_NOTE: "Handwritten Notes",
      MICRO_NOTE: "Micro Notes",
      IMPORTANT_QUESTION: "Important Questions",
      UNKNOWN: "Unknown",
    };
    return map[type] ?? type;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <Button asChild variant="outline" className="mb-4">
              <Link to="/admin">
                <ArrowLeft className="h-4 w-4" />
                Back to admin
              </Link>
            </Button>

            <h1 className="font-display text-3xl font-bold md:text-5xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sales overview, resource trends, and recent purchase history.
            </p>
          </div>

          <Badge className="hidden md:inline-flex">Live analytics</Badge>
        </div>

        {loading ? (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Loading dashboard...</CardTitle>
            </CardHeader>
          </Card>
        ) : error ? (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Failed to load dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button asChild>
                <Link to="/admin">Go to admin login</Link>
              </Button>
            </CardContent>
          </Card>

        ) : data ? (
          <div className="space-y-4">
            
            <div className="grid grid-cols-2 gap-2 md:gap-4 xl:grid-cols-4">
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-1 px-4 py-5 md:px-4 md:py-4 pb-1 md:pb-2">
                  <CardTitle className="flex items-center justify-between text-xs md:text-sm font-medium w-full">
                    <span>Total Purchases</span>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="text-3xl md:text-3xl font-bold mt-2 mb-2 md:mt-0 md:mb-0">
                    {data.summary.totalPurchases}
                  </div>

                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    Paid + pending orders
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-1 px-4 py-5 md:px-4 md:py-4 pb-1 md:pb-2">
                  <CardTitle className="flex items-center justify-between text-xs md:text-sm font-medium w-full">
                    <span>Paid Orders</span>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="text-3xl md:text-3xl font-bold mt-2 mb-2 md:mt-0 md:mb-0">
                    {data.summary.paidCount}
                  </div>

                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    Successfully verified payments
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-1 px-4 py-5 md:px-4 md:py-4 pb-1 md:pb-2">
                  <CardTitle className="flex items-center justify-between text-xs md:text-sm font-medium w-full">
                    <span>Pending Orders</span>
                    <Clock3 className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="text-3xl md:text-3xl font-bold mt-2 mb-2 md:mt-0 md:mb-0">
                    {data.summary.pendingCount}
                  </div>

                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    Orders waiting for payment
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-1 px-4 py-5 md:px-4 md:py-4 pb-1 md:pb-2">
                  <CardTitle className="flex items-center justify-between text-xs md:text-sm font-medium w-full">
                    <span>Revenue</span>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="text-3xl md:text-3xl font-bold mt-2 mb-2 md:mt-0 md:mb-0">
                    {revenueLabel}
                  </div>

                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    Avg order value: {fmt(data.summary.averageOrderValue)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Sales by Course
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.byCourse.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-muted-foreground">
                            No paid orders yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.byCourse.map((row) => (
                          <TableRow key={row.course}>
                            <TableCell className="font-medium">
                              {row.course}
                            </TableCell>
                            <TableCell>{row.count}</TableCell>
                            <TableCell className="text-right">
                              {fmt(row.revenue)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package2 className="h-5 w-5" />
                    Sales by Semester
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Semester</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.bySemester.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-muted-foreground">
                            No paid orders yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.bySemester.map((row) => (
                          <TableRow key={row.semester}>
                            <TableCell className="font-medium">
                              Semester {row.semester}
                            </TableCell>
                            <TableCell>{row.count}</TableCell>
                            <TableCell className="text-right">
                              {fmt(row.revenue)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Sales by Resource Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource Type</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.byResourceType.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-muted-foreground">
                          No paid orders yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.byResourceType.map((row) => (
                        <TableRow key={row.resourceType}>
                          <TableCell className="font-medium">
                            {formatResourceType(row.resourceType)}
                          </TableCell>
                          <TableCell>{row.count}</TableCell>
                          <TableCell className="text-right">
                            {fmt(row.revenue)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Top Selling Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.topResources.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-muted-foreground">
                          No paid orders yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.topResources.map((row) => (
                        <TableRow key={row.resourceSlug || row.resourceTitle}>
                          <TableCell className="font-medium">
                            {row.resourceTitle}
                          </TableCell>
                          <TableCell>{formatResourceType(row.resourceType)}</TableCell>
                          <TableCell>{row.course}</TableCell>
                          <TableCell>{row.semester}</TableCell>
                          <TableCell>{row.count}</TableCell>
                          <TableCell className="text-right">
                            {fmt(row.revenue)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentPurchases.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-muted-foreground">
                          No purchase history yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.recentPurchases.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(row.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            {row.resourceTitle}
                          </TableCell>
                          <TableCell>{formatResourceType(row.resourceType)}</TableCell>
                          <TableCell>{row.course}</TableCell>
                          <TableCell>{row.semester}</TableCell>
                          <TableCell>
                            <Badge
                              variant={row.paymentStatus === "paid" ? "default" : "secondary"}
                            >
                              {row.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {fmt(row.paidAmount)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}