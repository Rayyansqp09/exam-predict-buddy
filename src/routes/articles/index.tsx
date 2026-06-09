import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent } from "@/components/ui/card";

import {
  Search,
  Calendar,
  Newspaper,
  Sparkles,
  Tag,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string | null;
  author: string | null;
  created_at: string;
  tags?: string[] | null;
};

export const Route = createFileRoute("/articles/")({
  component: ArticlesPage,
});

function ArticlesPage() {
  // console.log("ARTICLES FEED PAGE LOADED");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(
      articles
        .map((a) => a.category)
        .filter(Boolean),
    ),
  ];

  const filteredArticles =
    articles.filter((article) => {
      const matchesSearch =
        article.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        (article.excerpt ?? "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        article.tags?.some((tag) =>
          tag
            .toLowerCase()
            .includes(search.toLowerCase())
        );

      const matchesCategory =
        category === "All" ||
        article.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  const featured =
    articles.length > 0
      ? articles[0]
      : null;

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

      <main>
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-b from-secondary/40 to-background mb-4 pb-0">
          <div className="mx-auto max-w-7xl px-4 pt-10 pb-8 md:px-6 md:pt-14 md:pb-14">
            <div className="flex items-center gap-2 text-xs font-medium text-primary">
              <Newspaper className="h-4 w-4" />
              <span>Articles & Updates</span>
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold tracking-tight md:text-4xl">
              Calicut University news, updates & study guidance
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              Exam notifications, admission updates, syllabus changes, result alerts, and smart
              preparation tips — curated for FYUGP students.
            </p>

            <div className="mt-6">
              <div className="relative max-w-xl">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search articles..."
                  className="pl-9 placeholder:text-[14px] sm:placeholder:text-sm"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`rounded-full border px-2 py-1 text-[11px] sm:px-3 sm:py-1 sm:text-xs transition ${category === cat
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* Featured */}
        {!loading && featured && category === "All" && !search && (
          <section className="mx-auto max-w-7xl px-4  pt-8 md:px-6 mb-6">
            <Link
              to="/articles/$slug"
              params={{ slug: featured.slug }}
              className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-lg"
            >
              <div className="grid md:grid-cols-2">
                {/* Image */}
                <div className="relative aspect-[16/9] md:h-full md:aspect-auto">
                  {featured.cover_image ? (
                    <div className="relative h-full overflow-hidden">
                      <img
                        src={featured.cover_image}
                        alt={featured.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-primary-foreground">
                      <Newspaper className="h-14 w-14 opacity-70" />
                    </div>
                  )}

                  <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6">

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">

                    <Badge
                      variant="secondary"
                      className="text-[10px] sm:text-xs"
                    >
                      {featured.category || "Update"}
                    </Badge>

                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(featured.created_at).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  <h2 className="mt-3 font-display text-base font-bold leading-snug md:text-2xl">
                    {featured.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground md:text-base">
                    {featured.excerpt}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                    Read article
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>

                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Feed */}
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold md:text-xl">
              {search || category !== "All"
                ? "Results"
                : "Latest Articles"}
            </h2>

            <span className="text-sm text-muted-foreground">
              {filteredArticles.length} article
              {filteredArticles.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <p>Loading articles...</p>
          ) : filteredArticles.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <p className="text-muted-foreground">
                No articles found.
              </p>

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  to="/articles/$slug"
                  params={{ slug: article.slug }}
                >
                  <Card className="group overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-soft">

                    {/* Image */}
                    <div className="relative aspect-[16/9] bg-secondary">
                      {article.cover_image ? (
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-primary text-primary-foreground">
                          <Newspaper className="h-8 w-8 opacity-70" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <CardContent className="flex flex-1 flex-col p-4">

                      {/* Category + Date */}
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Badge
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {article.category || "Update"}
                        </Badge>

                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(article.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug transition group-hover:text-primary">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="mt-1.5 line-clamp-3 text-sm text-muted-foreground">
                        {article.excerpt}
                      </p>

                      {article.tags?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {article.tags
                            .slice(0, 3)
                            .map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground"
                              >
                                <Tag className="h-2.5 w-2.5" />
                                {tag}
                              </span>
                            ))}
                        </div>
                      )}

                      {/* Read More */}
                      <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                        Read more
                        <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                      </div>

                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}