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
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Subject = {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice: number | null;
    pdfUrl: string;
};

type SubjectsApiResponse =
    | { success: true; subjects: Subject[] }
    | { success: false; message: string };

export const Route = createFileRoute("/purchase")({
    validateSearch: (search: Record<string, unknown>) => {
        return {
            course: typeof search.course === "string" ? search.course : "",
            semester:
                typeof search.semester === "string" && search.semester.trim() ? search.semester : "",
        };
    },
    component: PurchasePage,
});

function PurchasePage() {
    const { course, semester } = Route.useSearch();
    const semesterNumber = Number(semester);

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [redirecting, setRedirecting] = useState(false);
    const [redirectLabel, setRedirectLabel] = useState("");

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

        async function loadSubjects() {
            setLoadingSubjects(true);
            setLoadError("");

            try {
                const response = await fetch(
                    `/api/subjects?course=${encodeURIComponent(course)}&semester=${encodeURIComponent(
                        String(semesterNumber),
                    )}`,
                );

                const data = (await response.json()) as SubjectsApiResponse;

                if (!response.ok || !data.success) {
                    throw new Error(data.success ? "Failed to load subjects" : data.message);
                }

                if (!cancelled) {
                    setSubjects(data.subjects);
                }
            } catch (error) {
                if (!cancelled) {
                    setLoadError(error instanceof Error ? error.message : "Failed to load subjects");
                }
            } finally {
                if (!cancelled) {
                    setLoadingSubjects(false);
                }
            }
        }

        if (course && Number.isFinite(semesterNumber) && semesterNumber > 0) {
            loadSubjects();
        } else {
            setLoadingSubjects(false);
        }

        return () => {
            cancelled = true;
        };
    }, [course, semesterNumber]);

    const isValidSelection = Boolean(course && semester && !Number.isNaN(semesterNumber) && semesterNumber > 0);

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

    if (!isValidSelection) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl items-center px-4 py-12 md:px-6">
                    <div className="mx-auto w-full max-w-xl text-center">
                        <Badge className="mb-4">Subject-wise checkout</Badge>
                        <h1 className="font-display text-3xl font-bold md:text-5xl">
                            Select a valid course and semester
                        </h1>
                        <p className="mt-3 text-muted-foreground">
                            Your purchase page needs both values before it can load the subject list.
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

    const handleBuy = async (subject: Subject) => {
        try {
            const subjectId = subject.id;
            const salePrice = subject.discountPrice ?? subject.price;

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
                    subjectId,
                    receipt: `${course}-${semesterNumber}-${subjectId}-${Date.now()}`,
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
                name: "FYUGP Model Papers",
                description: subject.name,
                order_id: data.orderId,
                handler: async function (response: any) {
                    const verifyResponse = await fetch("/api/verify-payment", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            subjectId,
                            course,
                            semester: semesterNumber,
                        }),
                    });

                    if (!verifyResponse.ok) {
                        throw new Error("Payment verification failed");
                    }

                    setRedirectLabel(`${course} Semester ${semesterNumber} · ${subject.name}`);
                    setRedirecting(true);

                    await new Promise((resolve) => setTimeout(resolve, 1200));
                    window.location.href = subject.pdfUrl;
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
        }
    };

    const heading = `${course} · Semester ${semesterNumber}`;

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
                        Step 2 of 2 · Pick your subjects
                    </span>

                    <h1 className="mt-4 font-display text-3xl font-bold md:text-5xl">
                        <span className="text-gradient">{course}</span> · Semester {semesterNumber}
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                        Subject-wise predicted model question papers. Buy only what you need. Unlocked instantly after payment.
                    </p>
                </div>

                <div className="mt-10">
                    {loadingSubjects ? (
                        <Card className="mx-auto max-w-2xl shadow-card">
                            <CardHeader>
                                <CardTitle>Loading subjects...</CardTitle>
                                <CardDescription>
                                    Please wait while we load the papers for {heading}.
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
                                        <CardTitle>Failed to load subjects</CardTitle>
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
                    ) : subjects.length === 0 ? (
                        <Card className="mx-auto max-w-2xl shadow-card">
                            <CardHeader>
                                <div className="flex items-start gap-3">
                                    <div className="rounded-full bg-muted p-2">
                                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <CardTitle>No subjects found</CardTitle>
                                        <CardDescription className="mt-1">
                                            No subject list exists for {course} Semester {semesterNumber}.
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
                        <div className="mt-10 grid gap-4 sm:grid-cols-2">
                            {subjects.map((s) => {
                                const hasDiscount =
                                    typeof s.discountPrice === "number" && s.discountPrice < s.price;

                                const salePrice = hasDiscount ? s.discountPrice! : s.price;
                                const off = hasDiscount
                                    ? Math.round(((s.price - s.discountPrice!) / s.price) * 100)
                                    : 0;

                                return (
                                    <div
                                        key={s.id}
                                        className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                                <BookOpen className="h-5 w-5" />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-semibold leading-snug">{s.name}</h3>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {course} · Semester {semester}
                                                </p>
                                            </div>

                                            {hasDiscount && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                                                    <BadgePercent className="h-3 w-3" /> {off}% OFF
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-5 flex items-end justify-between">
                                            <div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-display text-2xl font-bold">₹{salePrice}</span>
                                                    {hasDiscount && (
                                                        <span className="text-sm text-muted-foreground line-through">
                                                            ₹{s.price}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    Instant PDF after payment
                                                </p>
                                            </div>

                                            <Button
                                                size="sm"
                                                className="bg-gradient-primary shadow-glow hover:opacity-95"
                                                onClick={() => handleBuy(s)}
                                            >
                                                Buy
                                                <ArrowRight className="ml-1 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                <p className="mt-12 text-center text-xs text-muted-foreground">
                    Secure payments via Razorpay. Predictions are estimates based on syllabus &amp; past
                    patterns — not guaranteed.
                </p>

            </main>

            <Footer />

            {redirecting ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-md rounded-2xl border bg-background p-6 text-center shadow-card">
                        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                        <h2 className="font-display text-2xl font-bold">
                            Loading your model question paper
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">{redirectLabel}</p>
                        <p className="mt-3 text-sm text-muted-foreground">Preparing the PDF now...</p>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
