import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
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
  // console.log("ARTICLE PAGE LOADED");

  const { slug } = Route.useParams();

  console.log("SLUG:", slug);

  const [loading, setLoading] = useState(true);
  const [article, setArticle] =
    useState<Extract<ArticleResponse, { success: true }>["article"] | null>(
      null,
    );
  const [error, setError] = useState("");

  const articleTitle = article?.title
    ? `${article.title} | FYUGP Hub`
    : "FYUGP Hub";

  useEffect(() => {
    if (!article) return;

    document.title =
      `${article.title} | FYUGP Hub`;

    const description =
      article.excerpt ||
      "Latest FYUGP Hub updates and articles.";

    let meta = document.querySelector(
      'meta[name="description"]'
    );

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute(
        "name",
        "description",
      );
      document.head.appendChild(meta);
    }

    meta.setAttribute(
      "content",
      description,
    );
  }, [article]);

  useEffect(() => {
    const load = async () => {
      try {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-10">
        <Button asChild variant="outline" className="mb-6">
          <Link to="/articles">
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>
        </Button>

        {loading ? (
          <p>Loading article...</p>
        ) : error ? (
          <p>{error}</p>
        ) : article ? (
          <Card className="shadow-card">
            {article.cover_image ? (
              <img
                src={article.cover_image}
                alt={article.title}
                className="h-72 w-full object-cover"
              />
            ) : null}

            <CardContent className="p-6 md:p-10">
              <div className="mb-2 text-sm text-muted-foreground">
                {article.category}
              </div>

              <h1 className="text-4xl font-bold">
                {article.title}
              </h1>

              <div className="mt-3 text-sm text-muted-foreground">
                By {article.author || "FYUGP Hub"} ·{" "}
                {new Date(article.created_at).toLocaleDateString()}
              </div>

              {article.excerpt ? (
                <p className="mt-6 text-lg text-muted-foreground">
                  {article.excerpt}
                </p>
              ) : null}

              <div className="mt-8 whitespace-pre-wrap leading-8">
                {article.content}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}