import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type MeResponse = { authenticated: boolean };

type AdminSubject = {
    course: string;
    semester: number;
    subjectId: string;
    name: string;
    description: string;
    price: number;
    discountPrice: number | null;
    pdfUrl: string;
    storagePath: string;
};

type SubjectsResponse =
    | { success: true; subjects: AdminSubject[] }
    | { success: false; message: string };

export const Route = createFileRoute("/admin")({
    component: AdminPage,
});

function AdminPage() {
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);

    const [course, setCourse] = useState("");
    const [semester, setSemester] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("30");
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");

    const [subjects, setSubjects] = useState<AdminSubject[]>([]);
    const [subjectsLoading, setSubjectsLoading] = useState(false);
    const [subjectsError, setSubjectsError] = useState("");

    const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
    const [editCourse, setEditCourse] = useState("");
    const [editSemester, setEditSemester] = useState("");
    const [editSubjectId, setEditSubjectId] = useState("");
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPrice, setEditPrice] = useState("30");
    const [editPdfFile, setEditPdfFile] = useState<File | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    const [filterCourse, setFilterCourse] = useState("all");
    const [filterSemester, setFilterSemester] = useState("all");

    const [bulkScope, setBulkScope] = useState<"all" | "course" | "course-semester">("all");
    const [bulkCourse, setBulkCourse] = useState("");
    const [bulkSemester, setBulkSemester] = useState("");
    const [bulkField, setBulkField] = useState<"price" | "discount_price">("discount_price");
    const [bulkValue, setBulkValue] = useState("");
    const [bulkLoading, setBulkLoading] = useState(false);
    const [bulkMessage, setBulkMessage] = useState("");

    const [discountPrice, setDiscountPrice] = useState("");
    const [editDiscountPrice, setEditDiscountPrice] = useState("");

    const handleBulkPriceUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setBulkLoading(true);
        setBulkMessage("");

        try {
            const res = await fetch("/api/admin/bulk-price-update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    scope: bulkScope,
                    course: bulkCourse,
                    semester: bulkSemester,
                    field: bulkField,
                    value: bulkValue === "" ? null : Number(bulkValue),
                }),
            });

            const data = (await res.json()) as { success: boolean; message?: string };

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Bulk update failed");
            }

            setBulkMessage(`Updated ${data.updatedCount ?? 0} subjects`);
            await loadSubjects();
        } catch (error) {
            setBulkMessage(error instanceof Error ? error.message : "Bulk update failed");
        } finally {
            setBulkLoading(false);
        }
    };

    const filteredSubjects = subjects.filter((subject) => {
        const courseMatch =
            filterCourse === "all" || subject.course === filterCourse;

        const semesterMatch =
            filterSemester === "all" || String(subject.semester) === filterSemester;

        return courseMatch && semesterMatch;
    });

    const loadSubjects = async () => {
        setSubjectsLoading(true);
        setSubjectsError("");

        try {
            const res = await fetch("/api/admin/subjects");
            const data = (await res.json()) as SubjectsResponse;

            if (!res.ok || !data.success) {
                throw new Error(data.success ? "Failed to load subjects" : data.message);
            }

            setSubjects(data.subjects);
        } catch (error) {
            setSubjectsError(error instanceof Error ? error.message : "Failed to load subjects");
        } finally {
            setSubjectsLoading(false);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/admin/me");
                const data = (await res.json()) as MeResponse;
                setAuthenticated(Boolean(data.authenticated));
            } catch {
                setAuthenticated(false);
            } finally {
                setChecking(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (authenticated) {
            loadSubjects();
        }
    }, [authenticated]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");
        setLoginLoading(true);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = (await res.json()) as { success: boolean; message?: string };

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Login failed");
            }

            setAuthenticated(true);
            setPassword("");
        } catch (error) {
            setLoginError(error instanceof Error ? error.message : "Login failed");
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        setAuthenticated(false);
        setSubjects([]);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadMessage("");
        setUploadLoading(true);

        try {
            if (!pdfFile) throw new Error("Select a PDF file");

            const formData = new FormData();
            formData.append("course", course);
            formData.append("semester", semester);
            formData.append("subjectId", subjectId);
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("discountPrice", discountPrice);
            formData.append("pdf", pdfFile);

            const res = await fetch("/api/admin/upload-subject", {
                method: "POST",
                body: formData,
            });

            const data = (await res.json()) as { success: boolean; message?: string };

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Upload failed");
            }

            setUploadMessage("Uploaded successfully");
            setCourse("");
            setSemester("");
            setSubjectId("");
            setName("");
            setDescription("");
            setPrice("30");
            setDiscountPrice("");
            setPdfFile(null);
            await loadSubjects();
        } catch (error) {
            setUploadMessage(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setUploadLoading(false);
        }
    };

    const startEdit = (subject: AdminSubject) => {
        setEditingSubjectId(subject.subjectId);
        setEditCourse(subject.course);
        setEditSemester(String(subject.semester));
        setEditSubjectId(subject.subjectId);
        setEditName(subject.name);
        setEditDescription(subject.description);
        setEditPrice(String(subject.price));
        setEditDiscountPrice(
            subject.discountPrice != null
                ? String(subject.discountPrice)
                : "",
        );
        setEditPdfFile(null);
    };

    const cancelEdit = () => {
        setEditingSubjectId(null);
        setEditCourse("");
        setEditSemester("");
        setEditSubjectId("");
        setEditName("");
        setEditDescription("");
        setEditPrice("30");
        setEditDiscountPrice("");
        setEditPdfFile(null);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSubjectId) return;

        setEditLoading(true);

        try {
            const formData = new FormData();
            formData.append("originalSubjectId", editingSubjectId);
            formData.append("course", editCourse);
            formData.append("semester", editSemester);
            formData.append("subjectId", editSubjectId);
            formData.append("name", editName);
            formData.append("description", editDescription);
            formData.append("price", editPrice);

            if (editPdfFile) {
                formData.append("pdf", editPdfFile);
            }

            if (editDiscountPrice !== "") {
                formData.append("discountPrice", editDiscountPrice);
            } else {
                formData.append("discountPrice", "");
            }

            const res = await fetch("/api/admin/update-subject", {
                method: "POST",
                body: formData,
            });

            const data = (await res.json()) as { success: boolean; message?: string };

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Update failed");
            }

            cancelEdit();
            await loadSubjects();
        } catch (error) {
            alert(error instanceof Error ? error.message : "Update failed");
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async (subjectIdToDelete: string) => {
        const ok = window.confirm("Delete this subject permanently?");
        if (!ok) return;

        const res = await fetch("/api/admin/delete-subject", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subjectId: subjectIdToDelete }),
        });

        const data = (await res.json()) as { success: boolean; message?: string };

        if (!res.ok || !data.success) {
            alert(data.message || "Delete failed");
            return;
        }

        await loadSubjects();
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16 space-y-8">
                {checking ? (
                    <Card className="shadow-card">
                        <CardHeader>
                            <CardTitle>Checking admin session...</CardTitle>
                        </CardHeader>
                    </Card>
                ) : !authenticated ? (
                    <Card className="shadow-card">
                        <CardHeader>
                            <CardTitle>Admin Login</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4" onSubmit={handleLogin}>
                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <Button type="submit" disabled={loginLoading} className="w-full">
                                    {loginLoading ? "Logging in..." : "Login"}
                                </Button>

                                {loginError ? <p className="text-sm text-destructive">{loginError}</p> : null}
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card className="shadow-card">
                            <CardHeader className="flex flex-row items-center justify-between gap-4">
                                <CardTitle>Admin Upload</CardTitle>
                                <Button variant="outline" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </CardHeader>

                            <CardContent>
                                <form className="space-y-4" onSubmit={handleUpload}>
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
                                        <Textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Price</Label>
                                        <Input value={price} onChange={(e) => setPrice(e.target.value)} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Discount Price</Label>
                                        <Input
                                            type="number"
                                            value={discountPrice}
                                            onChange={(e) => setDiscountPrice(e.target.value)}
                                            placeholder="Optional"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>PDF File</Label>
                                        <Input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                                        />
                                    </div>

                                    <Button type="submit" disabled={uploadLoading} className="w-full">
                                        {uploadLoading ? "Uploading..." : "Upload Subject"}
                                    </Button>

                                    {uploadMessage ? (
                                        <p className="text-sm text-muted-foreground">{uploadMessage}</p>
                                    ) : null}
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="shadow-card">
                            <CardHeader>
                                <CardTitle>Bulk Price Update</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4" onSubmit={handleBulkPriceUpdate}>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Scope</Label>
                                            <select
                                                value={bulkScope}
                                                onChange={(e) =>
                                                    setBulkScope(e.target.value as "all" | "course" | "course-semester")
                                                }
                                                className="h-10 w-full rounded-md border bg-background px-3"
                                            >
                                                <option value="all">All subjects</option>
                                                <option value="course">Only one course</option>
                                                <option value="course-semester">Only one course + semester</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Field</Label>
                                            <select
                                                value={bulkField}
                                                onChange={(e) =>
                                                    setBulkField(e.target.value as "price" | "discount_price")
                                                }
                                                className="h-10 w-full rounded-md border bg-background px-3"
                                            >
                                                <option value="price">Price</option>
                                                <option value="discount_price">Discount price</option>
                                            </select>
                                        </div>
                                    </div>

                                    {(bulkScope === "course" || bulkScope === "course-semester") && (
                                        <div className="space-y-2">
                                            <Label>Course</Label>
                                            <Input value={bulkCourse} onChange={(e) => setBulkCourse(e.target.value)} />
                                        </div>
                                    )}

                                    {bulkScope === "course-semester" && (
                                        <div className="space-y-2">
                                            <Label>Semester</Label>
                                            <Input
                                                value={bulkSemester}
                                                onChange={(e) => setBulkSemester(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label>
                                            {bulkField === "price" ? "Price" : "Discount price"}
                                        </Label>
                                        <Input
                                            type="number"
                                            value={bulkValue}
                                            onChange={(e) => setBulkValue(e.target.value)}
                                            placeholder={bulkField === "discount_price" ? "Leave blank to clear" : "Enter price"}
                                        />
                                    </div>

                                    <Button type="submit" disabled={bulkLoading} className="w-full">
                                        {bulkLoading ? "Updating..." : "Update Prices"}
                                    </Button>

                                    {bulkMessage ? <p className="text-sm text-muted-foreground">{bulkMessage}</p> : null}
                                </form>
                            </CardContent>
                        </Card>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Filter by course</Label>
                                <select
                                    value={filterCourse}
                                    onChange={(e) => setFilterCourse(e.target.value)}
                                    className="h-10 w-full rounded-md border bg-background px-3"
                                >
                                    <option value="all">All courses</option>
                                    {Array.from(new Set(subjects.map((s) => s.course))).map((course) => (
                                        <option key={course} value={course}>
                                            {course}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Filter by semester</Label>
                                <select
                                    value={filterSemester}
                                    onChange={(e) => setFilterSemester(e.target.value)}
                                    className="h-10 w-full rounded-md border bg-background px-3"
                                >
                                    <option value="all">All semesters</option>
                                    {Array.from(new Set(subjects.map((s) => String(s.semester)))).map((sem) => (
                                        <option key={sem} value={sem}>
                                            Semester {sem}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <Card className="shadow-card">
                            <CardHeader>
                                <CardTitle>Uploaded Subjects</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {subjectsLoading ? (
                                    <p className="text-sm text-muted-foreground">Loading subjects...</p>
                                ) : subjectsError ? (
                                    <p className="text-sm text-destructive">{subjectsError}</p>
                                ) : subjects.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No subjects found.</p>
                                ) : (
                                    filteredSubjects.map((subject) => {
                                        const isEditing = editingSubjectId === subject.subjectId;

                                        return (
                                            <div
                                                key={subject.subjectId}
                                                className="rounded-2xl border bg-card p-4 shadow-sm"
                                            >
                                                {!isEditing ? (
                                                    <div className="space-y-4">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <h3 className="text-lg font-semibold">{subject.name}</h3>
                                                                    <Badge variant="secondary">₹{subject.price}</Badge>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {subject.course} · Semester {subject.semester}
                                                                </p>
                                                                <p className="mt-2 text-sm">{subject.description}</p>
                                                                <p className="mt-2 text-xs text-muted-foreground break-all">
                                                                    {subject.pdfUrl}
                                                                </p>
                                                            </div>

                                                            <div className="flex flex-col gap-2">
                                                                <Button variant="outline" onClick={() => startEdit(subject)}>
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    onClick={() => handleDelete(subject.subjectId)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <form className="space-y-4" onSubmit={handleUpdate}>
                                                        <div className="grid gap-4 md:grid-cols-2">
                                                            <div className="space-y-2">
                                                                <Label>Course</Label>
                                                                <Input
                                                                    value={editCourse}
                                                                    onChange={(e) => setEditCourse(e.target.value)}
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label>Semester</Label>
                                                                <Input
                                                                    value={editSemester}
                                                                    onChange={(e) => setEditSemester(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Subject ID</Label>
                                                            <Input
                                                                value={editSubjectId}
                                                                onChange={(e) => setEditSubjectId(e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Name</Label>
                                                            <Input
                                                                value={editName}
                                                                onChange={(e) => setEditName(e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Description</Label>
                                                            <Textarea
                                                                value={editDescription}
                                                                onChange={(e) => setEditDescription(e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Price</Label>
                                                            <Input
                                                                value={editPrice}
                                                                onChange={(e) => setEditPrice(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Discount Price</Label>
                                                            <Input
                                                                type="number"
                                                                name="discountPrice"
                                                                value={editDiscountPrice}
                                                                onChange={(e) => setEditDiscountPrice(e.target.value)}
                                                                placeholder="Leave blank to clear"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Replace PDF (optional)</Label>
                                                            <Input
                                                                type="file"
                                                                accept="application/pdf"
                                                                onChange={(e) => setEditPdfFile(e.target.files?.[0] ?? null)}
                                                            />
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <Button type="submit" disabled={editLoading}>
                                                                {editLoading ? "Saving..." : "Save"}
                                                            </Button>
                                                            <Button type="button" variant="outline" onClick={cancelEdit}>
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </form>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}