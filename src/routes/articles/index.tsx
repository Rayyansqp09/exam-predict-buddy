import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent } from "@/components/ui/card";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string | null;
  author: string | null;
  created_at: string;
};

export const Route = createFileRoute("/articles/")({
  component: ArticlesPage,
});

function ArticlesPage() {
  console.log("ARTICLES FEED PAGE LOADED");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/articles");
        const json = await res.json();

        if (json.success) {
          setArticles(json.articles);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">
            Articles & Updates
          </h1>

          <p className="mt-3 text-muted-foreground">
            Admission updates, exam tips, university notifications,
            study guides and more.
          </p>
        </div>

        {loading ? (
          <p>Loading articles...</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden shadow-card"
              >
                {article.cover_image ? (
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="h-52 bg-muted" />
                )}

                <CardContent className="p-5">
                  <div className="mb-2 text-xs text-muted-foreground">
                    {article.category}
                  </div>

                  <h2 className="line-clamp-2 text-xl font-bold">
                    {article.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                    {article.excerpt}
                  </p>

                  <Link
                    to="/articles/$slug"
                    params={{ slug: article.slug }}
                    onClick={() => {
                      console.log("CLICKED ARTICLE", article.slug);
                    }}
                    className="mt-5 inline-flex items-center gap-2 font-medium text-primary"
                  >
                    Read Article
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}