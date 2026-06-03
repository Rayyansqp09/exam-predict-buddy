import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageCircleMore, Send, Users } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      const data = (await res.json()) as {
        success: boolean;
        message?: string;
      };

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send message");
        console.log("CONTACT RESPONSE:", data);
      }

      setStatus("Message sent successfully.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }
    catch (err) {
      console.error("CONTACT FORM ERROR:", err);

      setStatus(
        err instanceof Error
          ? err.message
          : JSON.stringify(err),
      );
    }
    finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold md:text-6xl">
            Get in <span className="text-gradient">touch</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
            Have questions, can't find your course, found an issue, or have ideas to improve FYUGP HUB? We'd love to hear from you.
            Send us a message for support, feedback, feature suggestions, resource requests, or bug reports—your input helps us make
            the platform better for students.
          </p>

        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Contact options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a
                href="mailto:support.fyugphub@gmail.com"
                className="flex items-center gap-3 rounded-xl border p-4 transition hover:border-primary/40 hover:bg-muted/30"
              >
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">support.fyugphub@gmail.com</p>
                </div>
              </a>

              <a
                href="https://chat.whatsapp.com/DxIoknRVc7a0cZpVMNI6Gr"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border p-4 transition hover:border-primary/40 hover:bg-muted/30"
              >
                <MessageCircleMore className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">WhatsApp group</p>
                  <p className="text-sm text-muted-foreground">Join for updates and support</p>
                </div>
              </a>

              <a
                href="https://t.me/FYUGPhub"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border p-4 transition hover:border-primary/40 hover:bg-muted/30"
              >
                <Send className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Telegram group</p>
                  <p className="text-sm text-muted-foreground">Join the Telegram community</p>
                </div>
              </a>

              <div className="hidden md:flex items-center gap-3 rounded-xl border p-4">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Use this page for</p>
                  <p className="text-sm text-muted-foreground">
                    Missing courses, resource requests, feedback, or ideas
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Course request / feedback / idea"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-primary shadow-glow" disabled={sending}>
                  <Send className="h-4 w-4" />
                  {sending ? "Sending..." : "Send message"}
                </Button>

                {status ? (
                  <p className="text-sm text-muted-foreground">{status}</p>
                ) : null}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}