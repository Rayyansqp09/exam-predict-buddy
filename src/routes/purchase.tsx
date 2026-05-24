import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    BadgePercent,
    BookOpen,
    ShieldCheck,
    ShoppingCart,
    Download,
    Eye,
} from "lucide-react";



import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

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
    createdAt: string;
    downloadCount: number;
    previewPageCount: number | null;
};

type ResourcesApiResponse =
    | { success: true; resources: Resource[] }
    | { success: false; message: string };

export const Route = createFileRoute("/purchase")({
    validateSearch: (search: Record<string, unknown>) => {
        return {
            course: typeof search.course === "string" ? search.course : "",
            semester:
                typeof search.semester === "string" && search.semester.trim()
                    ? search.semester
                    : "",
        };
    },
    component: PurchasePage,
});

function formatTimeAgo(dateString: string) {
    const seconds = Math.floor(
        (Date.now() - new Date(dateString).getTime()) / 1000,
    );

    if (seconds < 60) {
        return `${seconds}s ago`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 30) {
        return `${days}d ago`;
    }

    const months = Math.floor(days / 30);

    if (months < 12) {
        return `${months}mo ago`;
    }

    const years = Math.floor(months / 12);

    return `${years}y ago`;
}

function PurchasePage() {
    const { course, semester } = Route.useSearch();
    const semesterNumber = Number(semester);

    const [resources, setResources] = useState<Resource[]>([]);
    const [loadingResources, setLoadingResources] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [redirecting, setRedirecting] = useState(false);
    const [redirectLabel, setRedirectLabel] = useState("");
    const [buyingSlug, setBuyingSlug] = useState<string | null>(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function loadResources() {
            setLoadingResources(true);
            setLoadError("");

            try {
                const response = await fetch("/api/resources");
                const data = (await response.json()) as ResourcesApiResponse;

                if (!response.ok || !data.success) {
                    throw new Error(data.success ? "Failed to load resources" : data.message);
                }

                if (!cancelled) {
                    setResources(data.resources);
                }
            } catch (error) {
                if (!cancelled) {
                    setLoadError(error instanceof Error ? error.message : "Failed to load resources");
                }
            } finally {
                if (!cancelled) {
                    setLoadingResources(false);
                }
            }
        }

        loadResources();

        return () => {
            cancelled = true;
        };
    }, []);

    const isValidSelection = Boolean(
        course && semester && !Number.isNaN(semesterNumber) && semesterNumber > 0,
    );

    const filteredResources = useMemo(() => {
        return resources.filter(
            (resource) => resource.course === course && resource.semester === semesterNumber,
        );
    }, [resources, course, semesterNumber]);

    const money = useMemo(
        () =>
            new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }),
        [],
    );

    const formatPrice = (value: number) => money.format(value).replace("₹", "₹");

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
        };

        return map[type] ?? type;
    };

    const handleOpenFreeResource = (resource: Resource) => {
        if (!resource.pdfUrl) {
            alert("PDF not available.");
            return;
        }

        window.open(resource.pdfUrl, "_blank", "noopener,noreferrer");
    };

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
                    course,
                    semester: semesterNumber,

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
                            course,
                            semester: semesterNumber,
                        }),
                    });

                    if (!verifyResponse.ok) {
                        throw new Error("Payment verification failed");
                    }

                    setRedirectLabel(`${course} Semester ${semesterNumber} · ${resource.title}`);
                    setRedirecting(true);

                    await new Promise((resolve) => setTimeout(resolve, 1200));

                    if (resource.pdfUrl) {
                        window.location.href = `/api/resource/download/${resource.slug}`;
                    }
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

    if (!isValidSelection) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl items-center px-4 py-12 md:px-6">
                    <div className="mx-auto w-full max-w-xl text-center">
                        <Badge className="mb-4">Resource checkout</Badge>
                        <h1 className="font-display text-3xl font-bold md:text-5xl">
                            Select a valid course and semester
                        </h1>
                        <p className="mt-3 text-muted-foreground">
                            Your purchase page needs both values before it can load resources.
                        </p>

                        <Card className="mx-auto mt-8 max-w-md shadow-card">
                            <CardHeader className="pb-3">
                                <CardTitle>Invalid selection</CardTitle>
                                <CardDescription>
                                    Course or semester is missing. Go back and choose again.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full bg-gradient-primary shadow-soft">
                                    <Link to="/select">
                                        <ArrowLeft className="h-4 w-4" />
                                        Go back to selection
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
                <Link
                    to="/select"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Change course or semester
                </Link>

                <div className="mt-6 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-xs font-medium text-primary shadow-sm">
                        Step 2 of 2 · Pick your resources
                    </span>

                    <h1 className="mt-4 font-display text-3xl font-bold md:text-5xl">
                        <span className="text-gradient">{course}</span> · Semester {semesterNumber}
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                        Free and premium FYUGP resources organized by subject.
                    </p>
                </div>

                <div className="mt-10">
                    {loadingResources ? (
                        <Card className="mx-auto max-w-2xl shadow-card">
                            <CardHeader>
                                <CardTitle>Loading resources...</CardTitle>
                                <CardDescription>
                                    Please wait while we load the resources for {course} Semester {semesterNumber}.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ) : loadError ? (
                        <Card className="mx-auto max-w-2xl shadow-card">
                            <CardHeader>
                                <div className="flex items-start gap-3">
                                    <div className="rounded-full bg-destructive/10 p-2 text-destructive">
                                        <AlertCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle>Failed to load resources</CardTitle>
                                        <CardDescription className="mt-1">{loadError}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button asChild variant="outline" className="w-full">
                                    <Link to="/select">Go back to selection</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : filteredResources.length === 0 ? (
                        <Card className="mx-auto max-w-2xl shadow-card">
                            <CardHeader>
                                <div className="flex items-start gap-3">
                                    <div className="rounded-full bg-muted p-2">
                                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <CardTitle>No resources found</CardTitle>
                                        <CardDescription className="mt-1">
                                            No resources exist for {course} Semester {semesterNumber}.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full bg-gradient-primary shadow-soft">
                                    <Link to="/select">Go back to selection</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="mt-10 grid gap-4 md:grid-cols-2">
                            {filteredResources.map((resource) => {
                                const isPremium = resource.accessType === "premium";
                                const hasDiscount =
                                    isPremium &&
                                    resource.discountPrice !== null &&
                                    resource.originalPrice !== null &&
                                    resource.discountPrice < resource.originalPrice;

                                const salePrice = hasDiscount
                                    ? resource.discountPrice!
                                    : resource.originalPrice ?? resource.discountPrice ?? 0;

                                const off = hasDiscount
                                    ? Math.round(
                                        ((resource.originalPrice! - resource.discountPrice!) /
                                            resource.originalPrice!) *
                                        100,
                                    )
                                    : 0;

                                return (
                                    <div
                                        key={resource.id}
                                        className="group flex flex-col rounded-2xl border border-border bg-card p-5 pb-3 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${isPremium ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                                                    }`}
                                            >
                                                <BookOpen className="h-5 w-5" />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span
                                                        className={`rounded-full px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide sm:tracking-wider ${isPremium
                                                            ? "bg-primary/10 text-primary"
                                                            : "bg-success/10 text-success"
                                                            }`}
                                                    >
                                                        {isPremium ? "Premium" : "Free"}
                                                    </span>

                                                    <span className="rounded-full bg-secondary px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-secondary-foreground">
                                                        {formatResourceType(resource.resourceType)}
                                                    </span>

                                                    {hasDiscount ? (
                                                        <span className="rounded-full bg-destructive/10 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-destructive">
                                                            {off}% OFF
                                                        </span>
                                                    ) : null}

                                                </div>

                                                <h3 className="mt-2 font-semibold leading-snug">
                                                    {resource.title}
                                                </h3>

                                                <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground">
                                                    {resource.course} · Semester {resource.semester}
                                                    {resource.subjectId ? ` · ${resource.subjectId}` : ""}
                                                </p>


                                            </div>
                                        </div>

                                        {resource.description ? (
                                            <p className="mt-4 text-sm text-muted-foreground">
                                                {resource.description}
                                            </p>
                                        ) : null}

                                        <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">

                                            <span className="inline-flex items-center gap-1">
                                                <Download className="h-3.5 w-3.5" />
                                                {resource.downloadCount.toLocaleString()} Downloads
                                            </span>

                                            <span>{formatTimeAgo(resource.createdAt)}</span>
                                        </div>

                                        <div className="mt-3 flex items-end justify-between">
                                            <div>
                                                {isPremium ? (
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="font-display text-2xl font-bold">
                                                            {formatPrice(salePrice)}
                                                        </span>

                                                        {hasDiscount ? (
                                                            <span className="text-sm text-muted-foreground line-through">
                                                                {formatPrice(resource.originalPrice!)}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="font-display text-2xl sm:text-2xl font-bold text-success">
                                                            ₹0
                                                        </span>

                                                        <span className="text-sm text-muted-foreground line-through">
                                                            ₹30
                                                        </span>
                                                    </div>
                                                )}


                                            </div>

                                            {isPremium ? (
                                                <div className="flex items-center gap-2">

                                                    {(resource.previewPageCount ?? 0) > 1 ? (
                                                        <Button
                                                            asChild
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-9 w-9 shrink-0 p-0"
                                                        >
                                                            <Link
                                                                to="/preview/$slug"
                                                                params={{ slug: resource.slug }}
                                                                aria-label="Preview"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    ) : null}

                                                    <Button
                                                        size="sm"
                                                        className="bg-gradient-primary shadow-glow hover:opacity-95"
                                                        onClick={() => handleBuy(resource)}
                                                        disabled={buyingSlug === resource.slug}
                                                    >
                                                        <ShoppingCart className="h-4 w-4" />
                                                        {buyingSlug === resource.slug ? "Loading..." : "Buy"}
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="outline"
                                                    className="shadow-soft"
                                                >
                                                    <a
                                                        href={`/api/resource/download/${resource.slug}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        <BookOpen className="h-4 w-4" />
                                                        Open PDF
                                                        <ArrowRight className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            )}
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <p className="mt-12 text-center text-xs text-muted-foreground">
                    Secure payments via Razorpay. Resources are organized by course and semester.
                </p>
            </main>

            <Footer />

            {redirecting ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-md rounded-2xl border bg-background p-6 text-center shadow-card">
                        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                        <h2 className="font-display text-2xl font-bold">
                            Loading your resource
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">{redirectLabel}</p>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Preparing the PDF now...
                        </p>
                    </div>
                </div>
            ) : null}
        </div>
    );
}