import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  GraduationCap,
  LineChart,
  Lock,
  MessageCircle,
  NotebookPen,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Unlock,
  Wallet,

} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingCTA } from "@/components/site/FloatingCTA";
import { SAMPLE_PDF_LINK } from "@/lib/config";
import heroImg from "@/assets/hero-student.jpg";
import { FREE_TYPES, MATCH_PROOFS, PREMIUM_TYPES, TELEGRAM_CHANNEL, WHATSAPP_CHANNEL, courses, faqs, features, testimonials } from "@/lib/homepage-data";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FYUGP Model Question Papers — Calicut University Predicted Papers" },
      { name: "description", content: "Syllabus-based predicted model question papers for Calicut University FYUGP, B.Com, BBA, BSc, BA, BCA semester exams. Smart, affordable, exam-focused." },
      { property: "og:title", content: "FYUGP Model Question Papers" },
      { property: "og:description", content: "Predicted model question papers built on syllabus analysis and exam trends." },
    ],
  }),
  component: HomePage,
});


function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ResourceHub />
        <Overview />
        <MatchProof />
        <Courses />
        <HowItWorks />
        <Channels />
        <FAQ />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary-glow/15 blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-10 md:grid-cols-2 md:items-center md:px-6 md:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-xs font-medium text-primary shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Calicut University · FYUGP Resource Hub
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-foreground md:text-6xl">
            Everything you need for <span className="text-gradient">FYUGP exam preparation</span> in one place.
          </h1>
         <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
  Handwritten notes, PYQs, predicted model papers, micro pocket notes,
  module-wise notes, question banks &amp; important questions — organized
  by course, semester and subject. Prepare smarter, not harder.

  <span className="mt-3 block text-sm">
    Join our{" "}
    <a
      href="YOUR_WHATSAPP_CHANNEL_LINK"
      target="_blank"
      rel="noreferrer"
      className="font-medium text-green-600 underline underline-offset-4 hover:text-green-700"
    >
      WhatsApp channel
    </a>{" "}
    or{" "}
    <a
      href="YOUR_TELEGRAM_CHANNEL_LINK"
      target="_blank"
      rel="noreferrer"
      className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-700"
    >
      Telegram channel
    </a>{" "}
    for latest updates, free resources & exclusive offers.
  </span>
</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button asChild size="lg" className="w-full bg-gradient-primary shadow-glow hover:opacity-95 sm:w-auto">
              <Link to="/select" className="w-full">
                Download Resources <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link to="/resources" className="w-full">
                Latest Uploads <FileText className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-5 flex flex-col gap-2 text-xs text-muted-foreground md:mt-8 md:flex-row md:flex-wrap md:items-center md:gap-5 md:text-sm">

            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Secure Razorpay payment
            </span>

            <span className="inline-flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" />
              Instant PDF access
            </span>

            <span className="inline-flex items-center gap-2">
              <Unlock className="h-4 w-4 text-success" />
              Free study material
            </span>

          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-primary opacity-20 blur-2xl" />
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <img src={heroImg} alt="Student preparing for Calicut University exams" width={1280} height={960} className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-border bg-card px-4 py-3 shadow-card md:block">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-success/15 text-success">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Syllabus-aligned</p>
                <p className="text-xs text-muted-foreground">Updated each semester</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResourceHub() {
  return (
    <section id="features" className="bg-secondary/40 py-10 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <NotebookPen className="h-3.5 w-3.5" />
            Everything in one academic hub
          </span>

          <h2 className="mt-4 text-left font-display text-2xl font-bold leading-tight md:text-center md:text-4xl">
            All the <span className="text-gradient">resources & services</span> you need
          </h2>

          <p className="mt-3 text-left text-sm text-muted-foreground md:text-center md:text-base">
            Access organized study resources designed for Calicut University FYUGP students —
            from textbooks and notes to PYQs, model papers and revision materials.
          </p>
        </div>

        {/* Mobile: vertical scroll with fixed height | Desktop: normal grid */}
        <div className="mt-12">

          {/* Mobile */}
          <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1 md:hidden">
            {[
              "Text Books",
              "Study Materials",
              "Handwritten Notes",
              "PYQs",
              "Predicted Model Question Papers",
              "Micro Notes",
              "Module-wise Notes",
              "Question Banks",
              "Important Questions",
              "Revision Materials",
              "Exam-focused Notes",
              "Semester-wise Resources",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </span>

                <p className="text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
            {[
              "Text Books",
              "Study Materials",
              "Handwritten Notes",
              "PYQs",
              "Predicted Model Question Papers",
              "Micro Notes",
              "Module-wise Notes",
              "Question Banks",
              "Important Questions",
              "Revision Materials",
              "Exam-focused Notes",
              "Semester-wise Resources",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-card"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </span>

                <p className="text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}



function Overview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-20">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold md:text-4xl">What is a Predicted Model Question Paper?</h2>
          <p className="mt-4 text-sm md:text-base text-muted-foreground">
            Our model papers are carefully predicted question sets crafted for Calicut University
            degree semester exams. Each paper combines syllabus mapping, topic weightage,
            previous year question patterns and current academic trends — giving you a focused,
            exam-ready study guide.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Designed for last-mile exam preparation",
              "Saves hours of revision and topic-hunting",
              "Built course by course — never generic",
              "Honest, syllabus-driven, no false promises",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { icon: Brain, label: "Smart Analysis" },
            { icon: BookOpen, label: "Syllabus First" },
            { icon: LineChart, label: "Trend Mapped" },
            { icon: Target, label: "Exam Focused" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft md:p-6"
            >
              <Icon className="h-6 w-6 text-primary" />

              <p className="mt-4 font-semibold">{label}</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Carefully engineered for results that matter.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="bg-secondary/40 py-10 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Everything you need before exam day</h2>
          <p className="mt-3 text-muted-foreground">Built for clarity, accuracy, and effective revision.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MatchProof() {
  const totalMatched = MATCH_PROOFS.reduce((s, p) => s + p.matchedQuestions, 0);
  const totalQuestions = MATCH_PROOFS.reduce((s, p) => s + p.totalQuestions, 0);
  return (
    <section className="mx-auto max-w-7xl px-4 py-5 md:px-6">
      <div className="overflow-hidden rounded-3xl border border-border bg-gradient-hero p-5 shadow-card md:p-14">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <TrendingUp className="h-3.5 w-3.5" /> Verified Match Reports
          </span>
          <h2 className="mt-4 font-display text-left md:text-center text-2xl font-bold md:text-4xl">
            Last semester, <span className="text-gradient">{totalMatched} of {totalQuestions} predicted questions</span> appeared in the actual exam.
          </h2>
          <p className="mt-2 text-sm text-left md:text-center text-muted-foreground md:mt-3 md:text-base">
            Real comparisons between our predicted model papers and the official Calicut University question papers — not abstract percentages.
          </p>
        </div>

        <div className="mt-5 md:mt-10 grid gap-2.5 md:gap-5 md:grid-cols-3">
          {MATCH_PROOFS.map((p) => {
            const pct = Math.round((p.matchedQuestions / p.totalQuestions) * 100);
            return (
              <div key={`${p.course}-${p.semester}-${p.subject}`} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                    {p.course} · Sem {p.semester}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-[11px] font-semibold text-success">
                    <CheckCircle2 className="h-3 w-3" /> {pct}% matched
                  </span>
                </div>
                <h3 className="mt-4 font-semibold leading-snug">{p.subject}</h3>
                <p className="mt-3 font-display text-3xl font-bold text-gradient">
                  {p.matchedQuestions}<span className="text-xl text-muted-foreground">/{p.totalQuestions}</span>
                </p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">questions matched</p>
                {p.highlight && (
                  <p className="mt-4 rounded-lg border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Highlight:</span> {p.highlight}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-2xl rounded-xl border border-border bg-background/70 p-4 text-center text-xs text-muted-foreground">
          <strong className="text-foreground">Honest note:</strong> Match counts are based on side-by-side comparison after each exam. Predictions are syllabus &amp; trend driven — not leaked papers, and never a guarantee of exact questions.
        </p>
      </div>
    </section>
  );
}

function Channels() {
  return (
    <section id="Channels" className="mx-auto max-w-7xl px-4 py-10 md:py-15 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Join the community
        </span>
        <h2 className="mt-4 font-display text-2xl font-bold md:text-3xl">Get Free Study Materials &amp; Updates First</h2>
        <p className="mt-3 text-sm md:text-base text-muted-foreground">
          Join our WhatsApp or Telegram channels for free study materials, latest updates,
          exclusive offers, exam notifications, and early access to new model papers.
        </p>
      </div>
      <div className="mx-auto mt-5 md:mt-10 grid max-w-3xl gap-3 md:gap-5 sm:grid-cols-2">
        <a
          href={WHATSAPP_CHANNEL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:border-success/40 hover:shadow-card"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-success/15 text-success">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">WhatsApp Channel</p>
            <p className="text-xs text-muted-foreground"></p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
        </a>
        <a
          href={TELEGRAM_CHANNEL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Send className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Telegram Channel</p>
            <p className="text-xs text-muted-foreground"></p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
        </a>
      </div>
    </section>
  );
}

function Courses() {
  return (
    <section id="courses" className="mx-auto max-w-7xl px-4 py-10 md:py-20 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Supported courses</h2>
        <p className="mt-3 mx-8 text-sm md:text-base text-muted-foreground">Calicut University degree programs we currently cover.</p>
      </div>
      <div className="mt-7 md:mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {courses.map((c) => (
          <div key={c} className="group rounded-2xl border border-border bg-card p-6 text-center shadow-soft transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-card">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-gradient-primary group-hover:text-primary-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-semibold md:text-base">
              {c}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Simple, student-friendly pricing</h2>
          <p className="mt-3 text-muted-foreground">One paper. One price. Instant access.</p>
        </div>
        <div className="mx-auto mt-12 max-w-lg overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-glow">
          <div className="bg-gradient-primary px-8 py-6 text-primary-foreground">
            <p className="text-sm uppercase tracking-widest opacity-90">Model Question Paper</p>
            <p className="mt-1 font-display text-2xl font-bold">FAIUGP &amp; Degree Courses</p>
          </div>
          <div className="px-8 py-8">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold">₹49</span>
              <span className="text-sm text-muted-foreground">/ paper</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Course &amp; semester specific. Instant PDF download.</p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Syllabus-mapped predicted questions", "Trend &amp; weightage analysis", "Clean, printable PDF", "Razorpay secure checkout"].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                  <span dangerouslySetInnerHTML={{ __html: t }} />
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-7 w-full bg-gradient-primary shadow-soft">
              <Link to="/select">
                <Wallet className="mr-2 h-4 w-4" /> Buy Now
              </Link>
            </Button>
            <a href={SAMPLE_PDF_LINK} className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground">
              Download a sample preview →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Choose your course & semester", text: "Pick the right course and semester and confirm it." },
    { n: "02", title: "Click buy now or download and complete payment", text: "Secure Razorpay checkout — pay in seconds." },
    { n: "03", title: "Get instant access to your PDF", text: "Download your resource immediately and start your preparation without delay." },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 py-6 md:py-20 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">How it works</h2>
        <p className="mt-1 md:mt-3 text-sm md:text-base text-muted-foreground">Three steps from purchase to preparation.</p>
      </div>
      <div className="mt-5 md:mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
        {steps.map((s) => (
          <div
            key={s.n}
            className="relative rounded-2xl border border-border bg-card p-4 shadow-soft md:p-7"
          >
            <div className="flex items-start gap-3 md:block md:gap-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-gradient md:block md:h-auto md:w-auto md:rounded-none md:bg-transparent md:text-5xl">
                {s.n}
              </span>

              <div className="min-w-0 md:mt-3">
                <h3 className="text-base font-semibold leading-snug md:text-lg">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground md:mt-2">
                  {s.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Trusted by students</h2>
          <p className="mt-3 text-muted-foreground">Real feedback from learners using our model papers.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm">{t.text}</p>
              <div className="mt-5 border-t border-border pt-4">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.course}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button variant="outline" asChild>
            <a href="mailto:support@faiugp-papers.example">Send us your feedback</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-7 md:py-20 md:px-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold md:text-4xl">Frequently asked questions</h2>
        <p className="mt-3 text-sm md:text-base text-muted-foreground">Everything you need to know before you buy.</p>
      </div>
      <div className="mt-10 space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="rounded-2xl border border-border bg-card shadow-soft">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-sm font-semibold sm:text-base md:text-base">
                  {f.q}
                </span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && <p className="px-6 pb-5 text-sm text-muted-foreground">{f.a}</p>}
            </div>
          );
        })}
      </div>
      <div className="mt-12 rounded-3xl border border-primary/20 bg-gradient-hero p-8 text-center shadow-card">
        <h3 className="font-display text-[1.3rem] md:text-2xl font-bold">
          Ready to study smarter?
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Get instant access to high-quality study resources designed to help you prepare faster and better.
        </p>
        <Button asChild size="lg" className="mt-6 bg-gradient-primary shadow-glow">
          <Link to="/select">Buy Now <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
        <div className="mt-4 text-xs text-muted-foreground">
          Read our <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
        </div>
      </div>
    </section>
  );
}
