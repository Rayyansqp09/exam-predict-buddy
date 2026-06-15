import { createFileRoute, Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Share2,
  Check,
  X,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ArticleResponse =
  | {
    success: true;
    article: {
      id: number;
      title: string;
      slug: string;
      excerpt: string | null;
      content: string;
      cover_image: string | null;
      category: string | null;
      author: string | null;
      created_at: string;
    };
  }
  | {
    success: false;
    message: string;
  };

export const Route = createFileRoute("/articles/$slug")({
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();

  const [loading, setLoading] = useState(true);
  const [article, setArticle] =
    useState<Extract<ArticleResponse, { success: true }>["article"] | null>(
      null,
    );
  const [error, setError] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  const articleUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, [article?.slug]);

  useEffect(() => {
    if (!article) return;

    document.title = `${article.title} | FYUGP Hub`;

    const description =
      article.excerpt || "Latest FYUGP Hub updates and articles.";

    let meta = document.querySelector('meta[name="description"]');

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", description);
  }, [article]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/article/${slug}`);
        const json = (await res.json()) as ArticleResponse;

        if (!res.ok || !json.success) {
          throw new Error(
            json.success ? "Failed to load article" : json.message,
          );
        }

        setArticle(json.article);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load article",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setReadProgress(Math.min(100, Math.max(0, progress)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShareOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleCopyLink = async () => {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = url;

      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";

      document.body.appendChild(textArea);

      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        alert("Failed to copy link");
      }

      document.body.removeChild(textArea);
    }
  };

  const handleNativeShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.excerpt || "",
          url,
        });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-transparent">
        <div
          className="h-full bg-foreground/80 transition-all duration-200"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <main className="mx-auto max-w-3xl px-4 py-4 sm:py-6 md:py-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm" className="px-2">
            <Link to="/articles">
              <ArrowLeft className="h-4 w-4" />
              <span className="ml-1">Back</span>
            </Link>
          </Button>

          {article ? (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setShareOpen(true)}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          ) : null}
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-56 w-full animate-pulse rounded-2xl bg-muted" />
            <div className="space-y-3 rounded-2xl border bg-card p-5">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-8 w-4/5 animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              <div className="space-y-2 pt-4">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        ) : error ? (
          <Card className="rounded-2xl border-muted shadow-none">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">Could not load article.</p>
              <p className="mt-2 text-base font-medium">{error}</p>
              <Button asChild className="mt-5 rounded-full">
                <Link to="/articles">Browse articles</Link>
              </Button>
            </CardContent>
          </Card>
        ) : article ? (
          <article className="overflow-hidden rounded-3xl bg-transparent shadow-none">
            {article.cover_image ? (
              <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            <div className="px-0 py-5 sm:py-6 md:py-8">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                {article.category ? (
                  <span className="rounded-full border px-3 py-1 text-muted-foreground">
                    {article.category}
                  </span>
                ) : null}
                <span className="rounded-full border px-3 py-1 text-muted-foreground">
                  {new Date(article.created_at).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-[23px] leading-tight font-bold tracking-tight sm:text-3xl md:text-4xl">
                {article.title}
              </h1>

              <div className="mt-3 text-sm text-muted-foreground">
                By {article.author || "FYUGP Hub"}
              </div>

              {/* {article.excerpt ? (
                <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                  {article.excerpt}
                </p>
              ) : null} */}

              <div className="prose prose-neutral mt-6 max-w-none text-[16px] text-gray-700 md:text-[16px] leading-6 md:leading-7 prose-p:my-3 prose-headings:tracking-tight prose-img:rounded-2xl dark:prose-invert">
                <div className="whitespace-pre-wrap">
                  <ReactMarkdown>
                    {article.content}
                  </ReactMarkdown>
                </div>
              </div>

            </div>
          </article>
        ) : null}
      </main>

      <Footer />

      {article ? (
        <>
          <button
            onClick={() => setShareOpen(true)}
            className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border bg-background shadow-lg md:hidden"
            aria-label="Share article"
          >
            <Share2 className="h-5 w-5" />
          </button>

          {shareOpen ? (
            <div
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-4 sm:items-center"
              onClick={() => setShareOpen(false)}
            >
              <div
                className="w-full max-w-md rounded-3xl border bg-background p-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold">Share article</h2>
                    <p className="text-sm text-muted-foreground">
                      Send or copy this link
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShareOpen(false)}
                    aria-label="Close share sheet"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full justify-between rounded-2xl"
                    variant="outline"
                    onClick={handleNativeShare}
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Native share
                    </span>
                  </Button>

                  <Button
                    className="w-full justify-between rounded-2xl"
                    variant="outline"
                    onClick={handleCopyLink}
                  >
                    <span className="flex items-center gap-2">
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied ? "Copied" : "Copy link"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}