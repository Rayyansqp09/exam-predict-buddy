import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — FYUGP Model Question Papers" },
      { name: "description", content: "How FYUGP Model Question Papers handles your information and payments." },
      { property: "og:title", content: "Privacy Policy — FYUGP Model Question Papers" },
      { property: "og:description", content: "Transparent privacy practices for our predicted model paper service." },
    ],
  }),
  component: PrivacyPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <ShieldCheck className="h-3.5 w-3.5" /> Your privacy matters
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          FYUGP Model Question Papers — last updated {new Date().toLocaleDateString()}
        </p>

        <Section title="Information we collect">
          We do not collect or store personal data on this website. The site is a static, frontend-only
          marketing page. No accounts, no logins, and no databases.
        </Section>

        <Section title="How payments work">
          All payments are processed securely by <strong>Razorpay</strong> through their hosted payment page.
          When you click <em>Buy Now</em>, you are redirected to Razorpay's secure environment to complete
          your payment. We do not see, handle or store your card or banking details.
        </Section>

        <Section title="How your data is used">
          Any information you choose to share with Razorpay during checkout is governed by Razorpay's own
          privacy policy. We only receive minimal payment confirmation information necessary to deliver
          your purchased model question paper.
        </Section>

        <Section title="Cookies & tracking">
          This website does not use marketing cookies or third-party tracking. Basic browser storage may
          be used only for essential UI behaviour.
        </Section>

        <Section title="Disclaimer">
          Our model question papers are prediction-based study aids built on syllabus analysis, topic
          weightage and previous year trends. We do not guarantee that the actual exam questions will
          match our predictions.
        </Section>

        <Section title="Contact">
          For privacy-related queries, reach us at{" "}
          <a href="mailto:support.fyugphub@gmail.com" className="text-primary hover:underline">
            support.fyugphub@gmail.com
          </a>.
        </Section>

        <div className="mt-12">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Return to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
