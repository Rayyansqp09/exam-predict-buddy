import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      {
        title: "Privacy Policy — FYUGP Hub",
      },

      {
        name: "description",
        content:
          "Learn how FYUGP Hub handles user information, payments, analytics, and academic resources including notes, PYQs, and predicted model papers.",
      },

      {
        property: "og:title",
        content: "Privacy Policy — FYUGP Hub",
      },

      {
        property: "og:description",
        content:
          "Transparent privacy practices for FYUGP Hub users, including payment processing, analytics, and educational resource access.",
      },
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
        <div className="mt-6 ml-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <ShieldCheck className="h-3.5 w-3.5" /> Your privacy matters
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          FYUGP HUB — last updated {new Date().toLocaleDateString()}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Welcome to FYUGP HUB. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect information when you use our website and services.
        </p>

        <Section title="Information We Collect">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              We may collect limited information required to provide and improve our services.
              This can include basic contact details you voluntarily provide through forms,
              support requests, or communication channels.
            </p>

            <p>
              We may also receive limited payment confirmation information from our payment
              partners in order to verify transactions and deliver purchased resources.
            </p>

            <p>
              Basic technical data such as browser type, device information, and analytics
              data may be collected for website performance, security, and user experience
              improvements.
            </p>

            <p>
              We do not collect or store sensitive payment information such as card numbers,
              CVV details, UPI PINs, or banking passwords.
            </p>
          </div>
        </Section>

        <Section title="Payments & Transactions">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              All payments on this platform are processed securely through trusted
              third-party payment providers such as <strong>Razorpay</strong>.
            </p>

            <p>
              When you proceed with a purchase, you may be redirected to a secure
              payment environment to complete your transaction safely.
            </p>

            <p>
              We do not collect, access, or store sensitive payment information such
              as card numbers, CVV details, banking passwords, or UPI PINs.
            </p>

            <p>
              We only receive limited transaction confirmation details required to
              verify payments, provide purchased resources, and offer customer support
              when necessary.
            </p>
          </div>
        </Section>

        <Section title="How Your Data Is Used">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Any information shared during payment or communication is used only for
              providing services, verifying transactions, delivering purchased resources,
              improving user experience, and offering customer support.
            </p>

            <p>
              Payment-related information processed through third-party providers such as
              Razorpay is governed by their respective privacy policies. We only receive
              limited transaction confirmation details necessary to complete and manage orders.
            </p>

            <p>
              We do not sell, rent, or share personal information with third parties for
              marketing purposes.
            </p>
          </div>
        </Section>

        <Section title="Cookies & Tracking">
          This website may use cookies, local storage, and analytics tools to improve
          functionality, understand user behaviour, enhance performance, and provide
          a better user experience.

          We may use third-party services such as Google Analytics and Microsoft Clarity
          to collect anonymous usage and interaction data, including pages visited,
          device information, browser type, session activity, and general website
          performance metrics.

          These tools do not provide us with sensitive personal information such as
          passwords, payment details, or banking credentials.
        </Section>

        <Section title="Disclaimer">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              All resources provided on this platform, including notes, handwritten
              notes, PYQs, study materials, textbooks, important questions, and other
              academic content, are recreated and organized according to the latest
              available syllabus and exam structure for educational and preparation
              purposes only.
            </p>

            <p>
              Our predicted model question papers are specially prepared using syllabus
              analysis, previous year question papers, topic weightage, mark
              distribution, important concepts, exam trends, and other relevant
              academic parameters to recreate the most probable exam-oriented model
              paper for student preparation.
            </p>

            <p>
              While we aim to provide highly relevant and accurate preparation
              materials, we do not guarantee that the actual university examination
              questions will exactly match our predicted model papers.
            </p>

            <p>
              Micro notes and portable revision materials are designed only for quick
              revision, last-minute preparation, and easier studying anywhere.
            </p>

            <p>
              We do not encourage, support, or promote any form of malpractice,
              cheating, or unfair academic activity.
            </p>
          </div>
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
