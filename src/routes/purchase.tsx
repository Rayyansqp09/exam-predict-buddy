import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ShoppingCart, ShieldCheck } from "lucide-react";
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

    if (!course || !semester || Number.isNaN(semesterNumber) || semesterNumber <= 0) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="mx-auto max-w-4xl px-4 py-10">
                    <h1 className="text-3xl font-bold">Invalid selection</h1>
                    <p className="mt-2 text-muted-foreground">
                        Course or semester is missing. Go back and choose again.
                    </p>
                    <Button asChild className="mt-4">
                        <Link to="/select">Go back to selection</Link>
                    </Button>
                </main>
                <Footer />
            </div>
        );
    }

    const handleBuy = async (subject: Subject) => {
        try {
            const subjectId = subject.id;

            const response = await fetch("/api/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: subject.price,
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
                name: "FAIUGP Model Papers",
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

                    // small delay so the user actually sees the loader
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

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
                <div className="mb-8 text-center">
                    <Badge className="mb-4">Subject-wise checkout</Badge>
                    <h1 className="font-display text-3xl font-bold md:text-5xl">
                        {course} Semester {semester}
                    </h1>
                    <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                        Buy one subject at a time. Each paper is priced separately.
                    </p>
                </div>

                {loadingSubjects ? (
                    <Card className="mx-auto max-w-2xl shadow-card">
                        <CardHeader>
                            <CardTitle>Loading subjects...</CardTitle>
                            <CardDescription>Please wait while we load your papers.</CardDescription>
                        </CardHeader>
                    </Card>
                ) : loadError ? (
                    <Card className="mx-auto max-w-2xl shadow-card">
                        <CardHeader>
                            <CardTitle>Failed to load subjects</CardTitle>
                            <CardDescription>{loadError}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link to="/select">Go back to selection</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : subjects.length === 0 ? (
                    <Card className="mx-auto max-w-2xl shadow-card">
                        <CardHeader>
                            <CardTitle>No subjects found</CardTitle>
                            <CardDescription>
                                No subject list exists for this course and semester.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link to="/select">Go back to selection</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {subjects.map((subject) => (
                            <Card key={subject.id} className="shadow-card">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <CardTitle className="text-xl">{subject.name}</CardTitle>
                                            <CardDescription className="mt-2">{subject.description}</CardDescription>
                                        </div>
                                        <Badge variant="secondary">₹{subject.price}</Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="rounded-xl border bg-secondary/30 p-4 text-sm text-muted-foreground">
                                        <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                                            <ShieldCheck className="h-4 w-4" />
                                            Single-subject purchase
                                        </div>
                                        Buy this paper only. After payment, you will open the PDF directly.
                                    </div>

                                    <Button
                                        className="w-full bg-gradient-primary shadow-soft"
                                        onClick={() => handleBuy(subject)}
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        Buy Now
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            <Footer />


            {redirecting ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-md rounded-2xl border bg-background p-6 text-center shadow-card">
                        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                        <h2 className="font-display text-2xl font-bold">
                            Loading your model question paper
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {redirectLabel}
                        </p>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Preparing the PDF now...
                        </p>
                    </div>
                </div>
            ) : null}

        </div>
    );
}