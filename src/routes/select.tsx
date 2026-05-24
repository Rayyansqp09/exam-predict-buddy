import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowRight, GraduationCap, CheckCircle2 } from "lucide-react";
import { COURSES, SEMESTERS } from "@/lib/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/select")({
  head: () => ({
    meta: [
      { title: "Select Course & Semester — FYUGP HUB" },
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
  const navigate = useNavigate();

  const [course, setCourse] = useState<string | null>(null);
  const [semester, setSemester] = useState<number | null>(null);

  const ready = Boolean(course && semester);

  const handleProceed = () => {
    if (!course || !semester) return;

    navigate({
      to: "/purchase",
      search: {
        course,
        semester: String(semester),
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-24">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-xs font-medium text-primary shadow-sm">
            Step 1 of 1 · Choose your paper
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold md:text-5xl">
            Select your <span className="text-gradient">Course &amp; Semester</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            Pick the right resource for your course and semester. You’ll be redirected
            to a secure checkout page to complete your purchase.
          </p>
        </div>

        <div className="mt-12 md:mt-12 space-y-7 md:space-y-10">
          {/* Course */}
          <section className="space-y-2 md:space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-base font-semibold sm:text-lg">
                1. Choose your course
              </h2>

              {course && (
                <span className="inline-flex items-center gap-1 self-start text-xs text-success sm:self-auto">
                  <CheckCircle2 className="h-4 w-4" /> {course} selected
                </span>
              )}
            </div>

            <Select
              value={course ?? ""}
              onValueChange={(value) => {
                setCourse(value);
                setSemester(null);
              }}
            >
              <SelectTrigger className="h-11 rounded-2xl sm:h-12">
                <SelectValue placeholder="Select your course" />
              </SelectTrigger>
              <SelectContent>
                {COURSES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-0 md:mt-3 text-center">
              <a
                href="#find"
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Can't find your course?
              </a>
            </div>

          </section>

          {/* Semester */}
          <section>
            <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-base font-semibold sm:text-lg">
                2. Choose your semester
              </h2>

              {semester && (
                <span className="inline-flex items-center gap-1 self-start text-xs text-success sm:self-auto">
                  <CheckCircle2 className="h-4 w-4" /> Semester {semester} selected
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
              {SEMESTERS.map((s) => {
                const active = semester === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSemester(s)}
                    className={`rounded-2xl border px-2 py-4 text-center font-semibold shadow-soft transition sm:px-3 sm:py-5 ${active
                      ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow"
                      : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/40"
                      }`}
                  >
                    <div className="text-[10px] uppercase tracking-wider opacity-70 sm:text-xs">
                      Sem
                    </div>
                    <div className="font-display text-xl sm:text-2xl">{s}</div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-3xl border border-primary/20 bg-gradient-hero p-5 shadow-card md:p-10">
            <div className="flex flex-col gap-4 md:gap-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground md:text-sm md:normal-case md:tracking-normal">
                  Your selection
                </p>

                <p className="font-display text-[1.1rem] font-bold leading-tight md:mt-1 md:text-xl">
                  {course ?? "Select course"} ·{" "}
                  {semester ? `Semester ${semester}` : "Select semester"}
                </p>

                <p className="text-[0.8rem] leading-6 text-muted-foreground">
                  ₹30 · Instant PDF after Razorpay checkout
                </p>
              </div>

              <div className="flex flex-col items-stretch gap-2 md:items-end">
                <Button
                  onClick={handleProceed}
                  disabled={!ready}
                  size="lg"
                  className="w-full bg-gradient-primary shadow-glow hover:opacity-95 md:w-auto"
                >
                  {ready ? (
                    <>
                      <span className="sm:hidden">
                        {course} Sem {semester}
                      </span>

                      <span className="hidden sm:inline">
                        Buy {course} Sem {semester} Resource
                      </span>

                      <ArrowRight className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Select course &amp; semester
                      <ArrowRight id="find" className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </section>

          <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-soft">
            <h3 className="text-lg font-semibold">
              Can’t find your course or semester?
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Tell us your course, semester, subject, and the type of resource you need,
              and we’ll try to add it as soon as possible and notify you once available.
              <br />
              Reach us at{" "}
              <a
                href="mailto:support.fyugphub@gmail.com"
                className="font-medium underline underline-offset-4"
              >
                support.fyugphub@gmail.com
              </a>{" "}
              or through our{" "}
              <a
                href="https://whatsapp.com/channel/0029VbCxFM2KbYMWPvmVnu3b"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-700"
              >
                WhatsApp
              </a>{" "}
              and{" "}
              <a
                href="https://t.me/FYUGPhub"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-700"
              >
                Telegram
              </a>{" "}
              channels, or message{" "}
              <a
                href="https://t.me/fyugp_hub"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-700"
              >
                @fyugp_hub
              </a>{" "}
              directly on Telegram.
            </p>
          </div>

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
