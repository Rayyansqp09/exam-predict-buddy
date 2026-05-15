import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/view")({
    validateSearch: (search: Record<string, unknown>) => {
        return {
            course: typeof search.course === "string" ? search.course : "",
            semester: typeof search.semester === "string" ? search.semester : "",
            subjectId: typeof search.subjectId === "string" ? search.subjectId : "",
        };
    },
    component: ViewPage,
});

function ViewPage() {
    const { course, semester, subjectId } = Route.useSearch();

    // TEMP TEST PDF
    const group = getPurchaseGroup(course, Number(semester));

    const subject = group?.subjects.find(
        (item) => item.id === subjectId,
    );

    const pdfUrl = subject?.pdfUrl;

    if (!pdfUrl) {
        return (
            <div className="min-h-screen bg-background">
                <Header />

                <main className="mx-auto max-w-4xl px-4 py-10">
                    <h1 className="text-3xl font-bold">PDF not found</h1>

                    <p className="mt-2 text-muted-foreground">
                        No PDF exists for this subject.
                    </p>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="mx-auto max-w-7xl px-4 py-6">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold">
                        {course} Semester {semester}
                    </h1>

                    <p className="text-muted-foreground">
                        Subject ID: {subjectId}
                    </p>
                </div>

                <div className="overflow-hidden rounded-2xl border shadow-card">
                    <iframe
                        src={pdfUrl}
                        className="h-[85vh] w-full"
                        title="PDF Viewer"
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}