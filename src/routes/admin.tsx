import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("30");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!pdfFile) throw new Error("Select a PDF file");

      const formData = new FormData();
      formData.append("course", course);
      formData.append("semester", semester);
      formData.append("subjectId", subjectId);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("pdf", pdfFile);

      const res = await fetch("/api/admin/upload-subject", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Upload failed");

      setMessage("Uploaded successfully");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-16">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Admin Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Course</Label>
                  <Input value={course} onChange={(e) => setCourse(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Input value={semester} onChange={(e) => setSemester(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subject ID</Label>
                <Input value={subjectId} onChange={(e) => setSubjectId(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Subject Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Price</Label>
                <Input value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>PDF File</Label>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Uploading..." : "Upload Subject"}
              </Button>

              {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}