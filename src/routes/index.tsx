import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, BookOpen, Brain, CheckCircle2, ChevronDown, Download,
  FileText, GraduationCap, LineChart, ShieldCheck, Sparkles, Star, Target, Wallet,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingCTA } from "@/components/site/FloatingCTA";
import { SAMPLE_PDF_LINK } from "@/lib/config";
import heroImg from "@/assets/hero-student.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FAIUGP Model Question Papers — Calicut University Predicted Papers" },
      { name: "description", content: "Syllabus-based predicted model question papers for Calicut University FAIUGP, B.Com, BBA, BSc, BA, BCA semester exams. Smart, affordable, exam-focused." },
      { property: "og:title", content: "FAIUGP Model Question Papers" },
      { property: "og:description", content: "Predicted model question papers built on syllabus analysis and exam trends." },
    ],
  }),
  component: HomePage,
});

const features = [
  { icon: BookOpen, title: "Syllabus-Based Prediction", text: "Every paper is mapped directly to the official Calicut University syllabus." },
  { icon: LineChart, title: "Topic Weightage Analysis", text: "We weigh chapters by frequency, marks distribution, and recurring patterns." },
  { icon: FileText, title: "Previous Year Patterns", text: "Five years of past papers analysed to surface high-probability questions." },
  { icon: Target, title: "Internal Exam Relevance", text: "Topics aligned with internal assessment trends and university expectations." },
  { icon: GraduationCap, title: "Course-Specific Papers", text: "Tailored sets for FAIUGP, B.Com, BBA, BSc, BA, BCA and more." },
  { icon: Download, title: "Instant PDF Access", text: "Download a clean, printable PDF immediately after secure payment." },
];

const courses = ["FAIUGP", "B.Com", "BBA", "BSc", "BA", "BCA", "More coming soon"];

const testimonials = [
  { name: "Aysha R.", course: "B.Com 4th Sem", text: "Helped me focus on the important topics in the last week. Saved hours of guesswork." },
  { name: "Rahul M.", course: "BCA 2nd Sem", text: "Good for exam preparation. The pattern analysis felt accurate to what we got." },
  { name: "Fathima K.", course: "FAIUGP", text: "Affordable and useful. The PDF was clean and easy to revise from." },
];

const faqs = [
  { q: "Is this a guaranteed question paper?", a: "No. These are predicted model papers built on syllabus mapping, weightage and previous year trends. They are a study aid, not a guarantee of exact exam questions." },
  { q: "Is this based on the official syllabus?", a: "Yes. Every paper is structured against the official Calicut University syllabus for the chosen course and semester." },
  { q: "Which courses are supported?", a: "FAIUGP, B.Com, BBA, BSc, BA and BCA. More degree programs are being added regularly." },
  { q: "How do I receive the file after payment?", a: "After completing payment on the Razorpay page, you will get instant access to download the PDF." },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Overview />
        <Features />
        <AccuracyStat />
        <Courses />
        <Pricing />
        <HowItWorks />
        <Testimonials />
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
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-2 md:items-center md:px-6 md:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-xs font-medium text-primary shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Calicut University · Semester Exams
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-foreground md:text-6xl">
            Predicted Model Papers, <span className="text-gradient">built on syllabus</span> &amp; trends.
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
            Smart, focused model question papers for FAIUGP and supported degree courses.
            Spend less time guessing — and more time studying what matters.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-primary shadow-glow hover:opacity-95">
              <Link to="/select">
                Buy Now <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#how">See How It Works</a>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Secure Razorpay payment</span>
            <span className="inline-flex items-center gap-2"><Download className="h-4 w-4 text-primary" /> Instant PDF</span>
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

function Overview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="font-display text-3xl font-bold md:text-4xl">What is a model question paper?</h2>
          <p className="mt-4 text-muted-foreground">
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
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Brain, label: "Smart Analysis" },
            { icon: BookOpen, label: "Syllabus First" },
            { icon: LineChart, label: "Trend Mapped" },
            { icon: Target, label: "Exam Focused" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <Icon className="h-6 w-6 text-primary" />
              <p className="mt-4 font-semibold">{label}</p>
              <p className="mt-1 text-sm text-muted-foreground">Carefully engineered for results that matter.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="bg-secondary/40 py-20">
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

function AccuracyStat() {
  const pct = 40;
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <div className="overflow-hidden rounded-3xl border border-border bg-gradient-hero p-8 shadow-card md:p-14">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Honest Confidence Metric
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">Estimated Prediction Accuracy</h2>
            <p className="mt-3 text-muted-foreground">
              Based on syllabus coverage, topic weightage, and previous year question trend analysis
              across the last several semesters.
            </p>
            <p className="mt-5 rounded-xl border border-border bg-background/70 p-4 text-xs text-muted-foreground">
              <strong className="text-foreground">Note:</strong> This is an estimate based on syllabus and question
              trend analysis. It is <strong>not a guarantee</strong> of exact exam questions.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
                <circle cx="100" cy="100" r={r} stroke="oklch(0.92 0.01 250)" strokeWidth="14" fill="none" />
                <circle
                  cx="100" cy="100" r={r}
                  stroke="url(#grad)" strokeWidth="14" fill="none"
                  strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.48 0.20 258)" />
                    <stop offset="100%" stopColor="oklch(0.62 0.22 258)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="font-display text-5xl font-bold text-gradient">{pct}%</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">est. accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Courses() {
  return (
    <section id="courses" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Supported courses</h2>
        <p className="mt-3 text-muted-foreground">Calicut University degree programs we currently cover.</p>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {courses.map((c) => (
          <div key={c} className="group rounded-2xl border border-border bg-card p-6 text-center shadow-soft transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-card">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-gradient-primary group-hover:text-primary-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>
            <p className="mt-4 font-semibold">{c}</p>
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
    { n: "01", title: "Choose your course & semester", text: "Pick the right paper for your degree program and semester." },
    { n: "02", title: "Click Buy Now & complete payment", text: "Secure Razorpay checkout — pay in seconds." },
    { n: "03", title: "Get instant access to your PDF", text: "Download immediately and start focused revision." },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">How it works</h2>
        <p className="mt-3 text-muted-foreground">Three steps from purchase to preparation.</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="relative rounded-2xl border border-border bg-card p-7 shadow-soft">
            <span className="font-display text-5xl font-bold text-gradient">{s.n}</span>
            <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
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
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 md:px-6">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Frequently asked questions</h2>
        <p className="mt-3 text-muted-foreground">Everything you need to know before you buy.</p>
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
                <span className="font-semibold">{f.q}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && <p className="px-6 pb-5 text-sm text-muted-foreground">{f.a}</p>}
            </div>
          );
        })}
      </div>
      <div className="mt-12 rounded-3xl border border-primary/20 bg-gradient-hero p-8 text-center shadow-card">
        <h3 className="font-display text-2xl font-bold">Ready to prepare smarter?</h3>
        <p className="mt-2 text-sm text-muted-foreground">Get your model paper instantly after secure payment.</p>
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
