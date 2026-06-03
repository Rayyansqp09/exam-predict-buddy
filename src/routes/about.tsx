import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, ShieldCheck, Sparkles, Users, Zap } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4 text-[9px] px-2 py-0.5 md:text-sm md:px-3 md:py-1">About FYUGP Hub</Badge>

          <h1 className="font-display text-2xl font-bold md:text-6xl">
            Built to help students prepare{" "}
            <span className="text-gradient">smarter, faster, and better</span>.
          </h1>

          <p className="mx-auto text-[14px] mt-4 max-w-2xl text-muted-foreground md:text-lg">
            FYUGP Hub is a centralized academic resource platform for students who
            want organized study materials, PYQs, model papers, handwritten notes,
            question banks, and exam-focused revision content in one place.
          </p>

          <div className="mt-8 flex justify-center gap-2 md:gap-3">
            <Button
              asChild
              size="sm"
              className="md:h-10 md:px-5 md:text-base bg-gradient-primary shadow-glow"
            >
              <Link to="/resources">Browse Resources</Link>
            </Button>

            <Button
              asChild
              size="sm"
              variant="outline"
              className="md:h-10 md:px-5 md:text-base"
            >
              <Link to="/select">Find Resources by Course</Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 md:mt-12 h-px w-full bg-border" />

        <section className="mx-auto mt-10 max-w-3xl text-left">
          <h2 className="font-display text-xl font-bold md:text-3xl">
            About FYUGP HUB
          </h2>

          <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
            FYUGP HUB is a platform created to help Four-Year Undergraduate Programme (FYUGP) students access the study resources they need in one convenient place.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
            We provide a wide range of academic materials, including study materials, notes, micro notes, previous year question papers (PYQs),
            model question papers, question banks, textbook PDFs, and other exam-focused resources. Our goal is simple: help students spend less
            time searching for materials and more time learning.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
            We started with Calicut University and currently provide resources for several popular undergraduate courses. However, our vision extends
            far beyond a single university. We are actively working to expand our coverage across universities throughout Kerala and, eventually, to
            students across India, making FYUGP HUB a comprehensive destination for academic resources.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
            In addition to our website, we maintain active WhatsApp and Telegram communities where students can stay updated with the latest resources,
            important academic updates, exclusive materials, and announcements.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
            FYUGP HUB is built with students in mind. We understand how difficult and time-consuming it can be to find reliable study materials scattered
            across different websites, groups, and platforms. That's why we aim to bring everything students need together in one organized and accessible place.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
            Please note that FYUGP HUB is an independent educational platform and is not officially affiliated with, endorsed by, or associated with any
            university, college, or educational institution.

            Our mission is to make quality academic resources more accessible, organized, and convenient for every FYUGP student.
          </p>

        </section>


        <div className="mt-14 hidden md:grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                Organized content
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Resources are arranged by course, semester, subject, and resource type.
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                Exam-focused
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Everything is built around revision, repeated questions, and high-value prep.
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Reliable access
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Free and premium resources are handled cleanly with secure payment flow.
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-primary" />
                Fast access
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Students can search, filter, preview, and open resources without wasting time.
            </CardContent>
          </Card>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>What this platform offers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>PYQs and predicted model papers</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>Handwritten notes and micro notes</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>Study materials and textbook PDFs</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>Question banks and important questions</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Why students use it</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-4 w-4 text-primary" />
                <span>It saves time by keeping everything in one place.</span>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                <span>It helps students focus on what is actually useful for exams.</span>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="mt-0.5 h-4 w-4 text-primary" />
                <span>It makes revision easier through smart organization and previews.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 rounded-2xl border bg-card p-5 shadow-soft md:mt-14 md:rounded-3xl md:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-2xl font-bold md:text-4xl">
              We are not just selling PDFs.
            </h2>

            <p className="mt-3 text-sm text-muted-foreground md:mt-4 md:text-lg">
              The goal is to build a proper FYUGP academic ecosystem where students
              can discover resources, prepare better, and actually trust the platform.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2 md:mt-8 md:gap-3">
              <Button asChild className="bg-gradient-primary shadow-glow">
                <Link to="/resources">Explore the Hub</Link>
              </Button>

              <Button asChild variant="outline">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}