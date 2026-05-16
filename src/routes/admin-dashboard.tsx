import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Clock3,
  CreditCard,
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
      topSubjects: Array<{
        subjectId: string;
        subjectName: string;
        course: string;
        semester: number;
        count: number;
        revenue: number;
      }>;
      recentPurchases: Array<{
        id: number;
        subjectId: string;
        subjectName: string;
        course: string;
        semester: number;
        originalPrice: number;
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
  const [data, setData] = useState<Extract<DashboardResponse, { success: true }> | null>(null);

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
              Sales overview, course trends, and recent purchase history.
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
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                  <ShoppingIcon />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{data.summary.totalPurchases}</div>
                  <p className="text-xs text-muted-foreground">
                    Paid + pending orders
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Paid Orders</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{data.summary.paidCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Successfully verified payments
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <Clock3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{data.summary.pendingCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Orders waiting for payment
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{revenueLabel}</div>
                  <p className="text-xs text-muted-foreground">
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
                            <TableCell className="font-medium">{row.course}</TableCell>
                            <TableCell>{row.count}</TableCell>
                            <TableCell className="text-right">{fmt(row.revenue)}</TableCell>
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
                            <TableCell className="font-medium">Semester {row.semester}</TableCell>
                            <TableCell>{row.count}</TableCell>
                            <TableCell className="text-right">{fmt(row.revenue)}</TableCell>
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
                <CardTitle>Top Selling Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.topSubjects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-muted-foreground">
                          No paid orders yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.topSubjects.map((row) => (
                        <TableRow key={row.subjectId}>
                          <TableCell className="font-medium">{row.subjectName}</TableCell>
                          <TableCell>{row.course}</TableCell>
                          <TableCell>{row.semester}</TableCell>
                          <TableCell>{row.count}</TableCell>
                          <TableCell className="text-right">{fmt(row.revenue)}</TableCell>
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
                      <TableHead>Subject</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentPurchases.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-muted-foreground">
                          No purchase history yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.recentPurchases.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(row.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium">{row.subjectName}</TableCell>
                          <TableCell>{row.course}</TableCell>
                          <TableCell>{row.semester}</TableCell>
                          <TableCell>
                            <Badge
                              variant={row.paymentStatus === "paid" ? "default" : "secondary"}
                            >
                              {row.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{fmt(row.paidAmount)}</TableCell>
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

function ShoppingIcon() {
  return <Users className="h-4 w-4 text-muted-foreground" />;
}