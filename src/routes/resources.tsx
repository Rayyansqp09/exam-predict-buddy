import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Download,
  Eye,
  FileText,
  Flame,
  GraduationCap,
  ShoppingCart,
  Lock,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Unlock,
  Filter,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingCTA } from "@/components/site/FloatingCTA";

type Access = "all" | "free" | "premium";
type SortKey = "latest" | "trending" | "popular";

type Resource = {
  id: number;
  slug: string;
  title: string;
  extraInfo: string | null;
  description: string | null;
  resourceType: string;
  accessType: "free" | "premium";
  course: string;
  semester: number;
  subjectId: string | null;
  subject: string;
  originalPrice: number | null;
  discountPrice: number | null;
  pdfUrl: string | null;
  storagePath: string | null;
  isFeatured: boolean;
  isTrending: boolean;
  isPublished: boolean;
  viewCount: number;
  purchaseCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
};

type ResourcesResponse =
  | { success: true; resources: Resource[] }
  | { success: false; message: string };

const RESOURCE_TYPES = [
  "MODEL_PAPER",
  "PYQ",
  "QUESTION_BANK",
  "STUDY_MATERIAL",
  "TEXTBOOK_PDF",
  "HANDWRITTEN_NOTE",
  "MICRO_NOTE",
  "IMPORTANT_QUESTION",
] as const;

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      {
        title: "Resource Hub — FYUGP Notes, PYQs, Predicted Papers & Study Materials",
      },
      {
        name: "description",
        content:
          "Centralized FYUGP resource hub for Calicut University students. Handwritten notes, PYQs, predicted model papers, micro notes, module-wise notes, question banks and more — organized by course, semester and subject.",
      },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [access, setAccess] = useState<Access>("all");
  const [sort, setSort] = useState<SortKey>("latest");

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trendingSubject, setTrendingSubject] = useState("");

  const [redirecting, setRedirecting] = useState(false);
  const [redirectLabel, setRedirectLabel] = useState("");
  const [buyingSlug, setBuyingSlug] = useState<string | null>(null);

  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/resources");
        const data = (await res.json()) as ResourcesResponse;

        if (!res.ok || !data.success) {
          throw new Error(data.success ? "Failed to load resources" : data.message);
        }

        setResources(data.resources);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load resources");
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleBuy = async (resource: Resource) => {
    try {
      const salePrice = resource.discountPrice ?? resource.originalPrice ?? 0;

      if (!salePrice || salePrice < 1) {
        throw new Error("Invalid price");
      }

      setBuyingSlug(resource.slug);

      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: salePrice,
          currency: "INR",
          course: resource.course,
          semester: resource.semester,

          resourceSlug: resource.slug,
          resourceTitle: resource.title,
          resourceType: resource.resourceType,

          subjectId: resource.subjectId,
          subjectName: resource.subject,

          originalPrice: resource.originalPrice,
          discountPrice: resource.discountPrice,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = (await response.json()) as {
        orderId: string;
        amount: number;
        currency: string;
      };

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!key) {
        throw new Error("Missing Razorpay key");
      }

      const RazorpayCtor = (window as any).Razorpay;
      if (!RazorpayCtor) {
        throw new Error("Razorpay checkout failed to load");
      }

      const options = {
        key,
        amount: data.amount,
        currency: data.currency,
        name: "FYUGP Resources",
        description: resource.title,
        order_id: data.orderId,
        handler: async function (paymentResponse: any) {
          const verifyResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,

              resourceSlug: resource.slug,
              resourceTitle: resource.title,
              resourceType: resource.resourceType,

              subjectId: resource.subjectId,
              subjectName: resource.subject,
              course: resource.course,
              semester: resource.semester,
            }),
          });

          if (!verifyResponse.ok) {
            throw new Error("Payment verification failed");
          }

          setRedirectLabel(`${resource.course} Semester ${resource.semester} · ${resource.title}`);
          setRedirecting(true);

          await new Promise((resolve) => setTimeout(resolve, 1200));

          window.location.href = `/api/resource/download/${resource.slug}`;
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new RazorpayCtor(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Payment failed. Try again.");
    } finally {
      setBuyingSlug(null);
    }
  };

  const courseOptions = useMemo(() => {
    return Array.from(new Set(resources.map((r) => r.course))).sort();
  }, [resources]);

  const semesterOptions = useMemo(() => {
    return Array.from(
      new Set(resources.filter((r) => !course || r.course === course).map((r) => r.semester)),
    ).sort((a, b) => a - b);
  }, [resources, course]);

  const subjectOptions = useMemo(() => {
    return Array.from(
      new Set(
        resources
          .filter(
            (r) =>
              (!course || r.course === course) && (!semester || String(r.semester) === semester),
          )
          .map((r) => r.subject),
      ),
    ).sort();
  }, [resources, course, semester]);

  const trendingSubjects = useMemo(() => {
    const scores = new Map<string, number>();

    for (const r of resources) {
      const base =
        (r.purchaseCount ?? 0) * 5 +
        (r.downloadCount ?? 0) * 3 +
        (r.viewCount ?? 0) +
        (r.isTrending ? 20 : 0);

      scores.set(r.subject, (scores.get(r.subject) ?? 0) + base);
    }

    return Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([s]) => s);
  }, [resources]);

  const latestSpotlight = useMemo(
    () =>
      [...resources]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4),
    [resources],
  );

  const popularSpotlight = useMemo(
    () =>
      [...resources]
        .sort((a, b) => b.downloadCount + b.purchaseCount - (a.downloadCount + a.purchaseCount))
        .slice(0, 4),
    [resources],
  );

  const filteredResources = useMemo(() => {
    const text = query.trim().toLowerCase();

    const list = resources.filter((r) => {
      if (course && r.course !== course) return false;
      if (semester && String(r.semester) !== semester) return false;
      if (subject && r.subject !== subject) return false;
      if (resourceType && r.resourceType !== resourceType) return false;
      if (access !== "all" && r.accessType !== access) return false;
      if (trendingSubject && r.subject !== trendingSubject) return false;

      if (text) {
        const hay = [
          r.title,
          r.subject,
          r.course,
          r.resourceType,
          r.extraInfo ?? "",
          r.description ?? "",
        ]
          .join(" ")
          .toLowerCase();

        if (!hay.includes(text)) return false;
      }

      return true;
    });

    const sortByTrending = (r: Resource) =>
      (r.purchaseCount ?? 0) * 5 +
      (r.downloadCount ?? 0) * 3 +
      (r.viewCount ?? 0) +
      (r.isTrending ? 20 : 0) +
      Math.max(0, 30 - daysAgo(r.createdAt));

    if (sort === "latest") {
      return [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    if (sort === "popular") {
      return [...list].sort(
        (a, b) => b.downloadCount + b.purchaseCount - (a.downloadCount + a.purchaseCount),
      );
    }

    return [...list].sort((a, b) => sortByTrending(b) - sortByTrending(a));
  }, [resources, query, course, semester, subject, resourceType, access, sort, trendingSubject]);

  const clearFilters = () => {
    setQuery("");
    setCourse("");
    setSemester("");
    setSubject("");
    setResourceType("");
    setAccess("all");
    setSort("latest");
    setTrendingSubject("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className=" relative overflow-hidden bg-gradient-hero from-primary/5 via-background to-background">
          <div className="pointer-events-none absolute -top-28 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

          <div className="mx-auto max-w-7xl px-4 pt-14 pb-4 md:px-6 md:pt-15 md:pb-15">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-medium text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              FYUGP Resource Hub
            </span>

            <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
              Every <span className="text-gradient">note, PYQ &amp; predicted paper</span> in one
              place.
            </h1>

            <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-lg">
              Handwritten notes, PYQs, predicted model papers, micro notes, module-wise notes,
              question banks and important questions — organized by course, semester and subject.
            </p>

            <div className="mt-8 flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-soft md:max-w-2xl">
              <Search className="ml-1 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by subject, course or resource type..."
                className="h-7 md:h-10 w-full bg-transparent text-xs md:text-sm outline-none placeholder:text-muted-foreground"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div className="mt-3 md:mt-6 flex flex-wrap items-center gap-0.5 md:gap-2 text-sm">
              <span className="inline-flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                <Flame className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />

                <span className="md:hidden">Trending :</span>

                <span className="hidden md:inline">Trending subjects:</span>
              </span>

              {trendingSubjects.map((s, index) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTrendingSubject((prev) => (prev === s ? "" : s))}
                  className={`rounded-full border px-2.5 py-1 text-[10px] md:px-3 md:py-1 md:text-xs transition duration-200 ${index >= 3 ? "hidden md:inline-flex" : ""
                    } ${trendingSubject === s
                      ? "border-primary bg-primary text-primary-foreground shadow-md md:scale-105"
                      : "border-border bg-card md:hover:-translate-y-0.5 md:hover:border-primary/40 md:hover:text-primary"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 pt-2 md:px-6">
          <div className="mt-6 rounded-2xl border bg-card p-4 shadow-soft">
            <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-end md:gap-3">
              <FilterSelect
                label="Access"
                value={access}
                onChange={(v) => setAccess(v as Access)}
                options={[
                  { value: "all", label: "All" },
                  { value: "free", label: "Free" },
                  { value: "premium", label: "Premium" },
                ]}
              />

              <FilterSelect
                label="Course"
                value={course}
                onChange={setCourse}
                options={[
                  { value: "", label: "All courses" },
                  ...courseOptions.map((c) => ({ value: c, label: c })),
                ]}
              />

              <FilterSelect
                label="Semester"
                value={semester}
                onChange={setSemester}
                options={[
                  { value: "", label: "All semesters" },
                  ...semesterOptions.map((s) => ({
                    value: String(s),
                    label: `Semester ${s}`,
                  })),
                ]}
              />

              <FilterSelect
                label="Subject"
                value={subject}
                onChange={setSubject}
                options={[
                  { value: "", label: "All subjects" },
                  ...subjectOptions.map((s) => ({ value: s, label: s })),
                ]}
              />

              <FilterSelect
                label="Type"
                value={resourceType}
                onChange={setResourceType}
                options={[
                  { value: "", label: "All types" },
                  ...RESOURCE_TYPES.map((t) => ({
                    value: t,
                    label: formatResourceType(t),
                  })),
                ]}
              />

              <FilterSelect
                label="Sort"
                value={sort}
                onChange={(v) => setSort(v as SortKey)}
                options={[
                  { value: "latest", label: "Latest" },
                  { value: "trending", label: "Trending" },
                  { value: "popular", label: "Popular" },
                ]}
              />

              <div className="col-span-2 flex justify-center md:ml-auto md:block">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-5 flex items-end justify-between mt-6 md:mt-9">
            <div>
              <h2 className="text-2xl font-bold">
                {filteredResources.length}{" "}
                {filteredResources.length === 1 ? "resource" : "resources"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {access === "free"
                  ? "Free study material"
                  : access === "premium"
                    ? "Premium curated resources"
                    : "Free & premium resources"}
              </p>
            </div>
          </div>

          {loading ? (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Loading resources...</CardTitle>
              </CardHeader>
            </Card>
          ) : error ? (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Failed to load resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{error}</p>
              </CardContent>
            </Card>
          ) : filteredResources.length === 0 ? (
            <div className="rounded-2xl border bg-card p-10 text-center shadow-soft">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 font-semibold">No resources match your filters</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try clearing filters or selecting a different course or semester.
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {filteredResources.map((r) => (
                <ResourceCard key={r.id} r={r} onBuy={handleBuy} buyingSlug={buyingSlug} />
              ))}
            </div>
          )}

          <div className="mt-4 md:mt-5 text-center">
            <a
              href="#find"
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Can't find desired resource?
            </a>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <Spotlight
              title="Latest uploads"
              icon={Sparkles}
              items={latestSpotlight}
              onBuy={handleBuy}
              buyingSlug={buyingSlug}
            />

            <Spotlight
              title="Most popular"
              icon={TrendingUp}
              items={popularSpotlight}
              onBuy={handleBuy}
              buyingSlug={buyingSlug}
            />
          </div>

          <section
            id="find"
            className="mt-10 rounded-3xl border border-border bg-card p-5 text-center shadow-soft md:mt-14 md:p-8"
          >
            <h2 className="font-display text-xl font-bold md:text-2xl">
              Can’t find your resource?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-5 text-muted-foreground">
              If your course, semester, subject, or preferred resource type is not
              available yet, let us know. Tell us your course, subject, semester,
              and the exact resource you need, and we’ll try to add it as soon as
              possible and notify you once available.
            </p>

            <p className="mt-3 text-sm text-muted-foreground">
              Reach us at{" "}
              <a
                href="mailto:support.fyugphub@gmail.com"
                className="font-medium underline underline-offset-4 hover:text-foreground"
              >
                support.fyugphub@gmail.com
              </a>{" "}
              or through our{" "}
              <a
                href="YOUR_WHATSAPP_CHANNEL_LINK"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-700"
              >
                WhatsApp channel
              </a>{" "}
              and{" "}
              <a
                href="YOUR_TELEGRAM_CHANNEL_LINK"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-700"
              >
                Telegram channel
              </a>.
            </p>
          </section>

        </section>
      </main>

      {redirecting ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border bg-background p-6 text-center shadow-card">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <h2 className="font-display text-2xl font-bold">Loading your resource</h2>
            <p className="mt-2 text-sm text-muted-foreground">{redirectLabel}</p>
            <p className="mt-3 text-sm text-muted-foreground">Preparing the PDF now...</p>
          </div>
        </div>
      ) : null}

      <Footer />
      <FloatingCTA />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="min-w-[110px] flex-1 md:min-w-[150px]">
      <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground md:mb-2 md:text-xs">
        {label}
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-primary md:h-10 md:px-3 md:text-sm"
      >
        {options.map((o) => (
          <option key={o.value || "_all"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ResourceCard({
  r,
  onBuy,
  buyingSlug,
}: {
  r: Resource;
  onBuy: (resource: Resource) => void;
  buyingSlug: string | null;
}) {
  const isPremium = r.accessType === "premium";
  const hasDiscount =
    isPremium &&
    r.originalPrice !== null &&
    r.discountPrice !== null &&
    r.discountPrice < r.originalPrice;

  const salePrice = hasDiscount ? r.discountPrice! : r.originalPrice;
  const off = hasDiscount
    ? Math.round(((r.originalPrice! - r.discountPrice!) / r.originalPrice!) * 100)
    : 0;

  return (
    <>
      {/* mobile version */}
      <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft md:hidden">
        <div
          className={`relative flex flex-col gap-2 px-3 pt-3 pb-4 ${isPremium
            ? "bg-gradient-to-br from-primary/10 to-primary/20"
            : "bg-gradient-to-br from-success/10 to-success/20"
            }`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`grid h-7 w-7 place-items-center rounded-lg ${isPremium ? "bg-primary/15 text-primary" : "bg-success/15 text-success"
                }`}
            >
              {isPremium ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            </div>

            <span
              className={`rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider ${isPremium
                ? hasDiscount
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/15 text-primary"
                : "bg-success/15 text-success"
                }`}
            >
              {isPremium ? (hasDiscount ? `${off}% OFF` : "Premium") : "Free"}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="-ml-1.5 w-fit rounded-full bg-secondary px-2 py-0.5 text-[9px] font-medium text-secondary-foreground">
              {formatResourceType(r.resourceType)}
            </span>

            <h3 className="text-[13px] font-extrabold leading-tight text-foreground">
              {r.title}
            </h3>
          </div>

          <p className="text-[10px] font-medium text-muted-foreground">
            {r.course} · Semester {r.semester}
            {r.subjectId ? ` · ${r.subjectId}` : ""}
          </p>

          <div className="absolute -bottom-3 right-3 rounded-xl bg-background px-2.5 py-1 shadow-md">
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-[15px] font-black leading-none ${isPremium ? "text-primary" : "text-success"
                  }`}
              >
                ₹{isPremium ? (salePrice ?? 0) : 0}
              </span>

              <span className="text-[9px] font-semibold text-muted-foreground line-through">
                ₹{isPremium ? r.originalPrice : 30}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-3 pb-1 pt-5">
          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Download className="h-3 w-3" />
              {r.downloadCount.toLocaleString()} dl
            </span>

            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {daysAgo(r.createdAt) === 0 ? "Today" : `${daysAgo(r.createdAt)}d ago`}
            </span>
          </div>

          {r.description ? (
            <p className="line-clamp-2 text-[11px] leading-4 text-muted-foreground">
              {r.description}
            </p>
          ) : null}

          <div className="flex items-center gap-2 mb-0">
            {!isPremium && r.pdfUrl ? (
              <Button asChild size="sm" variant="outline" className="h-8 flex-1 text-xs">
                <a href={`/api/resource/download/${r.slug}`} target="_blank" rel="noreferrer">
                  Download
                </a>
              </Button>
            ) : null}

            {isPremium ? (
              <div className="flex w-full items-center gap-2">

                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 shrink-0 p-0"
                >
                  <a
                    href={`/api/resource/download/${r.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Preview"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </a>
                </Button>

                <Button
                  size="sm"
                  className="h-8 flex-1 bg-gradient-primary text-xs shadow-glow hover:opacity-95"
                  onClick={() => onBuy(r)}
                  disabled={buyingSlug === r.slug}
                >
                  <ShoppingCart className="h-3 w-3 md:h-3.5 md:w-3.5" />

                  {buyingSlug === r.slug ? "Loading..." : "Buy Now"}
                </Button>

              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {r.isFeatured ? <Badge>Featured</Badge> : null}
          {r.isTrending ? <Badge variant="secondary">Trending</Badge> : null}
        </div>
      </div>

      {/* your existing desktop card exactly here */}
      <div className="hidden md:flex group flex-col rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card">
        <div className="flex items-start gap-3">
          <div
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${isPremium ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
              }`}
          >
            {isPremium ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${isPremium ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                  }`}
              >
                {isPremium ? "Premium" : "Free"}
              </span>

              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                {formatResourceType(r.resourceType)}
              </span>

              {hasDiscount ? (
                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                  {off}% OFF
                </span>
              ) : null}
            </div>

            <h3 className="mt-2 font-semibold leading-snug">{r.title}</h3>

            <p className="mt-1 text-xs text-muted-foreground">
              {r.course} · Semester {r.semester}
              {r.subjectId ? ` · ${r.subjectId}` : ""}
            </p>
          </div>
        </div>

        {r.description ? (
          <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">{r.description}</p>
        ) : null}

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            {r.downloadCount.toLocaleString()} downloads
          </span>

          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {daysAgo(r.createdAt) === 0 ? "Today" : `${daysAgo(r.createdAt)}d ago`}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            {isPremium ? (
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold">₹{salePrice ?? 0}</span>
                {hasDiscount ? (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{r.originalPrice}
                  </span>
                ) : null}
              </div>
            ) : (
              <span className="font-display text-2xl font-bold text-success">Free</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isPremium && r.pdfUrl ? (
              <Button asChild size="sm" variant="outline">
                <a href={`/api/resource/download/${r.slug}`} target="_blank" rel="noreferrer">
                  Download
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            ) : null}

            {isPremium ? (
              <Button
                size="sm"
                className="bg-gradient-primary shadow-glow hover:opacity-95"
                onClick={() => onBuy(r)}
                disabled={buyingSlug === r.slug}
              >
                <ShoppingCart className="h-4 w-4" />
                {buyingSlug === r.slug ? "Loading..." : "Buy"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>

        <div className="mt-0 flex flex-wrap gap-2">
          {r.isFeatured ? <Badge>Featured</Badge> : null}
          {r.isTrending ? <Badge variant="secondary">Trending</Badge> : null}
        </div>
      </div>
    </>

  );
}

function Spotlight({
  title,
  icon: Icon,
  items,
  onBuy,
  buyingSlug,
}: {
  title: string;
  icon: typeof Star;
  items: Resource[];
  onBuy: (resource: Resource) => void;
  buyingSlug: string | null;
}) {
  return (
    <div className="rounded-2xl mt-0 border border-border bg-card p-3 md:p-5 shadow-soft">
      <h3 className="inline-flex items-center gap-2 text-lg font-bold">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </h3>

      <ul className="mt-3 md:mt-4 divide-y divide-border">
        {items.map((r) => {
          const isPremium = r.accessType === "premium";

          return (
            <li
              key={r.id}
              className="flex flex-wrap items-center gap-2 py-2 md:flex-nowrap md:gap-3 md:py-3"
            >
              <div
                className={`grid h-8 w-8 md:h-9 md:w-9 shrink-0 place-items-center rounded-lg ${isPremium ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                  }`}
              >
                <BookOpen className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] md:text-sm font-semibold">{r.title}</p>
                <p className="truncate text-[10px] md:text-xs text-muted-foreground">
                  {r.course} · Sem {r.semester} · {formatResourceType(r.resourceType)}
                </p>
              </div>

              <span className="inline-flex items-center gap-1 rounded-md  px-2.5 py-1 text-xs font-medium hover:border-primary/40 hover:text-primary">
                <span className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium hover:border-primary/40 hover:text-primary">
                  {isPremium ? (
                    <Button
                      size="sm"
                      className="h-7 w-[72px] px-2 text-[11px] md:h-8 md:w-[90px] md:px-3 md:text-xs bg-gradient-primary shadow-glow hover:opacity-95"
                      onClick={() => onBuy(r)}
                      disabled={buyingSlug === r.slug}
                    >
                      {/* <ShoppingCart className="h-2.5 w-2.5 md:h-3.5 md:w-3.5" /> */}

                      {buyingSlug === r.slug
                        ? "Loading..."
                        : `₹${r.discountPrice ?? r.originalPrice ?? 0}`}

                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-7 min-w-[72px] px-2 text-[11px] md:h-8 md:min-w-[90px] md:px-3 md:text-xs"
                    >
                      <a href={`/api/resource/download/${r.slug}`} target="_blank" rel="noreferrer">
                        Free
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </span>
              </span>

            </li>
          );
        })}
      </ul>

      <div className="mt-3 text-right">
        {/* <Link
          to="/resources"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Browse all <GraduationCap className="ml-1 inline h-3 w-3" />
        </Link> */}
      </div>
    </div>

  );
}

function formatResourceType(type: string) {
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

  return map[type] ?? type;
}

function daysAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}
