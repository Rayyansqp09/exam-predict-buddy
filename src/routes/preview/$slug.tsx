import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Lock } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ResourceResponse =
  | {
    success: true;
    resource: {
      slug: string;
      title: string;
      description: string | null;
      resourceType: string;
      accessType: "free" | "premium";
      course: string;
      semester: number;
      subject: string;
      subjectId: string | null;
      pdfUrl: string | null;
      previewPageCount: number | null;
    };
  }
  | { success: false; message: string };

type PdfModule = {
  Document: React.ComponentType<any>;
  Page: React.ComponentType<any>;
};

export const Route = createFileRoute("/preview/$slug")({
  component: PreviewPage,
});

function PreviewPage() {
  const { slug } = Route.useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resource, setResource] =
    useState<Extract<ResourceResponse, { success: true }>["resource"] | null>(
      null,
    );

  const [numPages, setNumPages] = useState(0);
  const [pdfModule, setPdfModule] = useState<PdfModule | null>(null);
  const [pdfLoadError, setPdfLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/resource/${slug}`);
        const json = (await res.json()) as ResourceResponse;

        if (!res.ok || !json.success) {
          throw new Error(json.success ? "Failed to load resource" : json.message);
        }

        if (!cancelled) {
          setResource(json.resource);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load resource");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    let cancelled = false;

    const loadPdfModule = async () => {
      try {
        const mod = await import("react-pdf");
        const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");

        mod.pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

        if (!cancelled) {
          setPdfModule({
            Document: mod.Document as unknown as React.ComponentType<any>,
            Page: mod.Page as unknown as React.ComponentType<any>,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setPdfLoadError(
            err instanceof Error ? err.message : "Failed to load PDF viewer",
          );
        }
      }
    };

    loadPdfModule();

    return () => {
      cancelled = true;
    };
  }, []);

  const previewCount = useMemo(() => {
    return Math.max(1, resource?.previewPageCount ?? 2);
  }, [resource]);

  const isPremium = resource?.accessType === "premium";

  const navigate = useNavigate({ from: "/preview/$slug" });

  const handlePurchase = () => {
    if (!resource) return;
    if (!resource.course) return;
    if (resource.semester === null || resource.semester === undefined) return;

    navigate({
      to: "/purchase",
      search: {
        course: resource.course,
        semester: String(resource.semester),
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-12">
        <Button asChild variant="outline" className="mb-4 w-full sm:mb-6 sm:w-auto">
          <Link to="/resources">
            <ArrowLeft className="h-4 w-4" />
            Back to resources
          </Link>
        </Button>

        {loading ? (
          <Card className="shadow-card">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Loading preview...</CardTitle>
            </CardHeader>
          </Card>
        ) : error ? (
          <Card className="shadow-card">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Failed to load preview</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              <p className="text-sm text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        ) : resource ? (
          <div className="space-y-4 sm:space-y-6">
            <Card className="shadow-card">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-4 pb-4 text-sm text-muted-foreground sm:px-6 sm:pb-6">
                <p>
                  {resource.course} · Semester {resource.semester} · {resource.subject}
                </p>
                <p>
                  Showing first {previewCount} page
                  {previewCount > 1 ? "s" : ""} preview.
                </p>
              </CardContent>
            </Card>

            {pdfLoadError ? (
              <Card className="shadow-card">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">PDF viewer failed</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                  <p className="text-sm text-muted-foreground">{pdfLoadError}</p>
                </CardContent>
              </Card>
            ) : !pdfModule ? (
              <Card className="shadow-card">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Loading PDF viewer...</CardTitle>
                </CardHeader>
              </Card>
            ) : resource.pdfUrl ? (
              <div className="grid gap-4 sm:gap-6">
                <DocumentBlock
                  pdfModule={pdfModule}
                  pdfUrl={resource.pdfUrl}
                  previewCount={previewCount}
                  numPages={numPages}
                  setNumPages={setNumPages}
                />

                {numPages > previewCount ? (
                  <div className="space-y-3">
                    {Array.from({ length: numPages - previewCount }, (_, index) => {
                      const pageNumber = previewCount + index + 1;

                      return (
                        <div
                          key={pageNumber}
                          className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5"
                        >
                          <div className="flex items-start gap-3 sm:items-center">
                            <div className="rounded-full bg-destructive/10 p-2 text-destructive">
                              <Lock className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">Page {pageNumber} locked</p>
                              <p className="text-sm text-muted-foreground">
                                Buy to unlock the full PDF
                              </p>
                            </div>
                          </div>

                          {isPremium ? (
                            <Button
                              onClick={handlePurchase}
                              className="w-full bg-gradient-primary shadow-glow sm:w-auto"
                            >
                              <ArrowRight className="h-4 w-4" />
                              Buy
                            </Button>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ) : (
              <Card className="shadow-card">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">No PDF attached</CardTitle>
                </CardHeader>
              </Card>
            )}
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

function DocumentBlock({
  pdfModule,
  pdfUrl,
  previewCount,
  numPages,
  setNumPages,
}: {
  pdfModule: PdfModule;
  pdfUrl: string;
  previewCount: number;
  numPages: number;
  setNumPages: (value: number) => void;
}) {
  const { Document, Page } = pdfModule;
  const [pageWidth, setPageWidth] = useState(600);

  useEffect(() => {
    const updateWidth = () => {
      const width = Math.min(600, window.innerWidth - 32);
      setPageWidth(Math.max(280, width));
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <Document
      file={pdfUrl}
      onLoadSuccess={(pdf: { numPages: number }) => {
        setNumPages(pdf.numPages);
      }}
      onLoadError={(err: unknown) => {
        console.error("PDF LOAD ERROR:", err);
      }}
      onSourceError={(err: unknown) => {
        console.error("PDF SOURCE ERROR:", err);
      }}
      loading={
        <Card className="shadow-card">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Loading PDF...</CardTitle>
          </CardHeader>
        </Card>
      }
      error={
        <Card className="shadow-card">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Could not load PDF</CardTitle>
          </CardHeader>
        </Card>
      }
    >
      <div className="space-y-3 sm:space-y-5">
        {Array.from(
          { length: Math.min(previewCount, numPages || previewCount) },
          (_, index) => {
            const pageNumber = index + 1;

            return (
              <Card key={pageNumber} className="overflow-hidden shadow-card">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="text-base sm:text-lg">Page {pageNumber}</CardTitle>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5" />
                    Preview
                  </span>
                </CardHeader>
                <CardContent className="overflow-x-auto p-1 pb-2 sm:p-4">
                  <div className="flex justify-center items-start leading-none">
                    <Page
                      pageNumber={pageNumber}
                      width={pageWidth}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="block"
                      style={{ display: "block", margin: 0 }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          },
        )}
      </div>
    </Document>
  );
}