import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, GraduationCap, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { COURSES, SEMESTERS, getRazorpayLink } from "@/lib/config";

export const Route = createFileRoute("/select")({
  head: () => ({
    meta: [
      { title: "Select Course & Semester — FAIUGP Model Question Papers" },
      {
        name: "description",
        content:
          "Choose your Calicut University course and semester to get the matching predicted model question paper.",
      },
    ],
  }),
  component: SelectPage,
});

function SelectPage() {
  const [course, setCourse] = useState<string | null>(null);
  const [semester, setSemester] = useState<number | null>(null);

  const link = course && semester ? getRazorpayLink(course, semester) : undefined;
  const ready = Boolean(course && semester);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-xs font-medium text-primary shadow-sm">
            Step 1 of 1 · Choose your paper
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold md:text-5xl">
            Select your <span className="text-gradient">Course &amp; Semester</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Pick the right Calicut University paper. You'll be redirected to a secure Razorpay
            page to complete your purchase.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {/* Course */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">1. Choose your course</h2>
              {course && (
                <span className="inline-flex items-center gap-1 text-xs text-success">
                  <CheckCircle2 className="h-4 w-4" /> {course} selected
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {COURSES.map((c) => {
                const active = course === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCourse(c)}
                    className={`group rounded-2xl border p-5 text-left shadow-soft transition ${
                      active
                        ? "border-primary bg-primary/5 shadow-glow"
                        : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/40"
                    }`}
                  >
                    <div
                      className={`grid h-10 w-10 place-items-center rounded-xl ${
                        active
                          ? "bg-gradient-primary text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <p className="mt-3 font-semibold">{c}</p>
                    <p className="text-xs text-muted-foreground">Calicut University</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Semester */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">2. Choose your semester</h2>
              {semester && (
                <span className="inline-flex items-center gap-1 text-xs text-success">
                  <CheckCircle2 className="h-4 w-4" /> Semester {semester} selected
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {SEMESTERS.map((s) => {
                const active = semester === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSemester(s)}
                    className={`rounded-2xl border px-3 py-5 text-center font-semibold shadow-soft transition ${
                      active
                        ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow"
                        : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/40"
                    }`}
                  >
                    <div className="text-xs uppercase tracking-wider opacity-70">Sem</div>
                    <div className="font-display text-2xl">{s}</div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-3xl border border-primary/20 bg-gradient-hero p-6 shadow-card md:p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your selection</p>
                <p className="mt-1 font-display text-xl font-bold">
                  {course ?? "Select course"} ·{" "}
                  {semester ? `Semester ${semester}` : "Select semester"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  ₹49 · Instant PDF after Razorpay checkout
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-2 md:items-end">
                {ready && !link ? (
                  <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/70 px-4 py-2 text-xs text-muted-foreground">
                    <AlertCircle className="h-4 w-4" /> Coming soon for this combination
                  </div>
                ) : null}
                <Button
                  asChild={ready && !!link}
                  disabled={!ready || !link}
                  size="lg"
                  className="bg-gradient-primary shadow-glow hover:opacity-95"
                >
                  {ready && link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      Buy {course} Sem {semester} Paper
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  ) : (
                    <span>
                      Select course &amp; semester
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </section>

          <p className="text-center text-xs text-muted-foreground">
            Need help?{" "}
            <Link to="/" className="underline hover:text-foreground">
              Back to home
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
