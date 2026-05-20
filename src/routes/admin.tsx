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
import { Pencil, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type MeResponse = {
    authenticated: boolean;
};

type LoginResponse =
    | { success: true }
    | { success: false; message: string };

type UploadResponse =
    | { success: true; message: string; resourceSlug: string; pdfUrl: string }
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

    const [resourceType, setResourceType] = useState("MODEL_PAPER");
    const [accessType, setAccessType] = useState<"free" | "premium">("premium");
    const [course, setCourse] = useState("");
    const [semester, setSemester] = useState("");
    const [subject, setSubject] = useState("");
    const [extraInfo, setExtraInfo] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("30");
    const [discountPrice, setDiscountPrice] = useState("");
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [editSubjectId, setEditSubjectId] = useState("");

    const [filterResourceType, setFilterResourceType] = useState("all");
    const [filterCourse, setFilterCourse] = useState("all");
    const [filterSubject, setFilterSubject] = useState("all");
    const [filterAccessType, setFilterAccessType] = useState("all");

    const [editingResourceSlug, setEditingResourceSlug] = useState<string | null>(null);
    const [editResourceType, setEditResourceType] = useState("MODEL_PAPER");
    const [editAccessType, setEditAccessType] = useState<"free" | "premium">("premium");
    const [editCourse, setEditCourse] = useState("");
    const [editSemester, setEditSemester] = useState("");
    const [editSubject, setEditSubject] = useState("");
    const [editExtraInfo, setEditExtraInfo] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPrice, setEditPrice] = useState("30");
    const [editDiscountPrice, setEditDiscountPrice] = useState("");
    const [editPdfFile, setEditPdfFile] = useState<File | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    const [bulkScope, setBulkScope] = useState("all");
    const [bulkCourse, setBulkCourse] = useState("");
    const [bulkSemester, setBulkSemester] = useState("");
    const [bulkResourceType, setBulkResourceType] = useState("");
    const [bulkSubject, setBulkSubject] = useState("");

    const [bulkField, setBulkField] = useState<"original_price" | "discount_price">(
        "discount_price",
    );

    const [bulkValue, setBulkValue] = useState("");

    const [bulkLoading, setBulkLoading] = useState(false);
    const [bulkMessage, setBulkMessage] = useState("");

    type ResourceItem = {
        id: number;
        slug: string;
        title: string;
        extraInfo: string | null;
        description: string | null;
        resourceType: string;
        accessType: string;
        course: string;
        semester: number;
        subject: string;
        subjectId: string | null;
        originalPrice: number | null;
        discountPrice: number | null;
        pdfUrl: string | null;
        storagePath: string | null;
        isFeatured: boolean;
        isTrending: boolean;
        isPublished: boolean;
        createdAt: string;
        updatedAt: string;
    };

    const [resources, setResources] = useState<ResourceItem[]>([]);
    const [resourcesLoading, setResourcesLoading] = useState(false);
    const [resourcesError, setResourcesError] = useState("");

    const filteredResources = resources.filter((resource) => {
        const typeMatch =
            filterResourceType === "all" ||
            resource.resourceType === filterResourceType;

        const courseMatch =
            filterCourse === "all" ||
            resource.course === filterCourse;

        const subjectMatch =
            filterSubject === "all" ||
            resource.subject === filterSubject;

        const accessMatch =
            filterAccessType === "all" ||
            resource.accessType === filterAccessType;

        return (
            typeMatch &&
            courseMatch &&
            subjectMatch &&
            accessMatch
        );
    });

    const startEditResource = (resource: ResourceItem) => {
        setEditingResourceSlug(resource.slug);
        setEditResourceType(resource.resourceType);
        setEditAccessType(resource.accessType);
        setEditCourse(resource.course);
        setEditSemester(String(resource.semester));
        setEditSubject(resource.subject);
        setEditSubjectId(resource.subjectId ?? "");
        setEditExtraInfo(resource.extraInfo ?? "");
        setEditDescription(resource.description ?? "");
        setEditPrice(resource.originalPrice != null ? String(resource.originalPrice) : "30");
        setEditDiscountPrice(resource.discountPrice != null ? String(resource.discountPrice) : "");
        setEditPdfFile(null);
    };

    const cancelResourceEdit = () => {
        setEditingResourceSlug(null);
        setEditResourceType("MODEL_PAPER");
        setEditAccessType("premium");
        setEditCourse("");
        setEditSemester("");
        setEditSubject("");
        setEditExtraInfo("");
        setEditDescription("");
        setEditPrice("30");
        setEditDiscountPrice("");
        setEditPdfFile(null);
    };

    const handleUpdateResource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingResourceSlug) return;

        setEditLoading(true);

        try {
            const formData = new FormData();
            formData.append("originalSlug", editingResourceSlug);
            formData.append("resourceType", editResourceType);
            formData.append("accessType", editAccessType);
            formData.append("course", editCourse);
            formData.append("semester", editSemester);
            formData.append("subject", editSubject);
            formData.append("subjectId", editSubjectId);
            formData.append("extraInfo", editExtraInfo);
            formData.append("description", editDescription);

            if (editAccessType === "premium") {
                formData.append("price", editPrice);
                formData.append("discountPrice", editDiscountPrice);
            }

            if (editPdfFile) {
                formData.append("pdf", editPdfFile);
            }

            const res = await fetch("/api/admin/update-resource", {
                method: "POST",
                body: formData,
            });

            const data = (await res.json()) as { success: boolean; message?: string };

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Update failed");
            }

            cancelResourceEdit();
            await loadResources();
        } catch (error) {
            alert(error instanceof Error ? error.message : "Update failed");
        } finally {
            setEditLoading(false);
        }
    };

    const handleBulkUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        setBulkLoading(true);
        setBulkMessage("");

        try {
            const res = await fetch("/api/admin/bulk-resource-update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    scope: bulkScope,
                    course: bulkCourse,
                    semester: bulkSemester,
                    resourceType: bulkResourceType,
                    subject: bulkSubject,
                    field: bulkField,
                    value: bulkValue === "" ? null : Number(bulkValue),
                }),
            });

            const data = (await res.json()) as {
                success: boolean;
                message?: string;
                updatedCount?: number;
            };

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Bulk update failed");
            }

            setBulkMessage(`Updated ${data.updatedCount ?? 0} resources`);

            await loadResources();
        } catch (error) {
            setBulkMessage(
                error instanceof Error ? error.message : "Bulk update failed",
            );
        } finally {
            setBulkLoading(false);
        }
    };


    const handleDeleteResource = async (slug: string) => {
        const ok = window.confirm("Delete this resource permanently?");
        if (!ok) return;

        const res = await fetch("/api/admin/delete-resource", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug }),
        });

        const data = (await res.json()) as { success: boolean; message?: string };

        if (!res.ok || !data.success) {
            alert(data.message || "Delete failed");
            return;
        }

        await loadResources();
    };

    const loadResources = async () => {
        setResourcesLoading(true);
        setResourcesError("");

        try {
            const res = await fetch("/api/admin/resources");
            const data = (await res.json()) as
                | { success: true; resources: ResourceItem[] }
                | { success: false; message: string };

            if (!res.ok || !data.success) {
                throw new Error(data.success ? "Failed to load resources" : data.message);
            }

            setResources(data.resources);
        } catch (error) {
            setResourcesError(error instanceof Error ? error.message : "Failed to load resources");
        } finally {
            setResourcesLoading(false);
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
            loadResources();
        }
    }, [authenticated]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");
        setLoginLoading(true);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            const data = (await res.json()) as LoginResponse;

            if (!res.ok || !data.success) {
                throw new Error(data.success ? "Login failed" : data.message);
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
    };

    const handleResourceUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadMessage("");
        setUploadLoading(true);

        try {
            if (!pdfFile) {
                throw new Error("Select a PDF file");
            }

            const formData = new FormData();
            formData.append("resourceType", resourceType);
            formData.append("accessType", accessType);
            formData.append("course", course);
            formData.append("semester", semester);
            formData.append("subject", subject);
            formData.append("extraInfo", extraInfo);
            formData.append("description", description);
            formData.append("pdf", pdfFile);
            formData.append("subjectId", subjectId);

            if (accessType === "premium") {
                formData.append("price", price);
                formData.append("discountPrice", discountPrice);
            }

            const res = await fetch("/api/admin/upload-resource", {
                method: "POST",
                body: formData,
            });

            const data = (await res.json()) as UploadResponse;

            if (!res.ok || !data.success) {
                throw new Error(data.success ? "Upload failed" : data.message);
            }

            setUploadMessage(`Uploaded successfully`);
            setResourceType("MODEL_PAPER");
            setAccessType("premium");
            setCourse("");
            setSemester("");
            setSubject("");
            setSubjectId("");
            setExtraInfo("");
            setDescription("");
            setPrice("30");
            setDiscountPrice("");
            setPdfFile(null);
        } catch (error) {
            setUploadMessage(error instanceof Error ? error.message : "Upload failed");
        } finally {
            setUploadLoading(false);
        }
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
                                        autoComplete="current-password"
                                    />
                                </div>

                                <Button type="submit" disabled={loginLoading} className="w-full">
                                    {loginLoading ? "Logging in..." : "Login"}
                                </Button>

                                {loginError ? (
                                    <p className="text-sm text-destructive">{loginError}</p>
                                ) : null}
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="shadow-card">
                        <CardHeader className="flex flex-row items-center justify-between gap-4">
                            <CardTitle>Upload Resource</CardTitle>
                            <Button variant="outline" onClick={handleLogout}>
                                Logout
                            </Button>
                        </CardHeader>

                        <CardContent>
                            <form className="space-y-4" onSubmit={handleResourceUpload}>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Resource Type</Label>
                                        <select
                                            value={resourceType}
                                            onChange={(e) => setResourceType(e.target.value)}
                                            className="h-10 w-full rounded-md border bg-background px-3"
                                        >
                                            <option value="MODEL_PAPER">Model Question Paper</option>
                                            <option value="PYQ">PYQ</option>
                                            <option value="QUESTION_BANK">Question Bank</option>
                                            <option value="STUDY_MATERIAL">Study Material</option>
                                            <option value="TEXTBOOK_PDF">Textbook PDF</option>
                                            <option value="HANDWRITTEN_NOTE">Handwritten Notes</option>
                                            <option value="MICRO_NOTE">Micro Notes</option>
                                            <option value="IMPORTANT_QUESTION">Important Questions</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Access Type</Label>
                                        <select
                                            value={accessType}
                                            onChange={(e) =>
                                                setAccessType(e.target.value as "free" | "premium")
                                            }
                                            className="h-10 w-full rounded-md border bg-background px-3"
                                        >
                                            <option value="premium">Premium</option>
                                            <option value="free">Free</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Course</Label>
                                        <Input
                                            value={course}
                                            onChange={(e) => setCourse(e.target.value)}
                                            placeholder="BCA"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Semester</Label>
                                        <Input
                                            type="number"
                                            value={semester}
                                            onChange={(e) => setSemester(e.target.value)}
                                            placeholder="1"
                                        />
                                    </div>


                                    <div className="space-y-2">
                                        <Label>Subject</Label>
                                        <Input
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="Programming Fundamentals"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Subject ID</Label>
                                        <Input
                                            value={subjectId}
                                            onChange={(e) => setSubjectId(e.target.value)}
                                            placeholder="cyber-law-bca-sem4"
                                        />
                                    </div>

                                </div>

                                <div className="space-y-2">
                                    <Label>Extra Info</Label>
                                    <Input
                                        value={extraInfo}
                                        onChange={(e) => setExtraInfo(e.target.value)}
                                        placeholder="Last two years, Module-wise, Important repeated questions"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Short description of this resource..."
                                    />
                                </div>

                                {accessType === "premium" ? (
                                    <>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Price</Label>
                                                <Input
                                                    type="number"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    placeholder="30"
                                                />
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
                                        </div>
                                    </>
                                ) : null}

                                <div className="space-y-2">
                                    <Label>PDF File</Label>
                                    <Input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                                    />
                                </div>

                                <Button type="submit" disabled={uploadLoading} className="w-full">
                                    {uploadLoading ? "Uploading..." : "Upload Resource"}
                                </Button>

                                {uploadMessage ? (
                                    <p className="text-sm text-muted-foreground">{uploadMessage}</p>
                                ) : null}
                            </form>
                        </CardContent>
                    </Card>
                )}

                <Card className="shadow-card mt-8">
                    <CardHeader>
                        <CardTitle>Bulk Price Update</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form className="space-y-4" onSubmit={handleBulkUpdate}>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                                <div className="space-y-2">
                                    <Label>Update Scope</Label>

                                    <select
                                        value={bulkScope}
                                        onChange={(e) => setBulkScope(e.target.value)}
                                        className="h-10 w-full rounded-md border bg-background px-3"
                                    >
                                        <option value="all">All Resources</option>
                                        <option value="course">Course</option>
                                        <option value="course-semester">
                                            Course + Semester
                                        </option>
                                        <option value="resource-type">
                                            Resource Type
                                        </option>
                                        <option value="subject">Subject</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Field</Label>

                                    <select
                                        value={bulkField}
                                        onChange={(e) =>
                                            setBulkField(
                                                e.target.value as
                                                | "original_price"
                                                | "discount_price",
                                            )
                                        }
                                        className="h-10 w-full rounded-md border bg-background px-3"
                                    >
                                        <option value="original_price">
                                            Original Price
                                        </option>

                                        <option value="discount_price">
                                            Discount Price
                                        </option>
                                    </select>
                                </div>
                            </div>


                            {(bulkScope === "course" ||
                                bulkScope === "course-semester") && (
                                    <div className="space-y-2">
                                        <Label>Course</Label>

                                        <Input
                                            value={bulkCourse}
                                            onChange={(e) => setBulkCourse(e.target.value)}
                                            placeholder="BCA"
                                        />
                                    </div>
                                )}

                            {bulkScope === "course-semester" && (
                                <div className="space-y-2">
                                    <Label>Semester</Label>

                                    <Input
                                        type="number"
                                        value={bulkSemester}
                                        onChange={(e) => setBulkSemester(e.target.value)}
                                    />
                                </div>
                            )}

                            {bulkScope === "resource-type" && (
                                <div className="space-y-2">
                                    <Label>Resource Type</Label>

                                    <select
                                        value={bulkResourceType}
                                        onChange={(e) =>
                                            setBulkResourceType(e.target.value)
                                        }
                                        className="h-10 w-full rounded-md border bg-background px-3"
                                    >
                                        <option value="">Select type</option>
                                        <option value="MODEL_PAPER">
                                            Model Question Paper
                                        </option>
                                        <option value="PYQ">PYQ</option>
                                        <option value="QUESTION_BANK">
                                            Question Bank
                                        </option>
                                        <option value="STUDY_MATERIAL">
                                            Study Material
                                        </option>
                                        <option value="TEXTBOOK_PDF">
                                            Textbook PDF
                                        </option>
                                        <option value="HANDWRITTEN_NOTE">
                                            Handwritten Notes
                                        </option>
                                        <option value="MICRO_NOTE">
                                            Micro Notes
                                        </option>
                                        <option value="IMPORTANT_QUESTION">
                                            Important Questions
                                        </option>
                                    </select>
                                </div>
                            )}

                            {bulkScope === "subject" && (
                                <div className="space-y-2">
                                    <Label>Subject</Label>

                                    <Input
                                        value={bulkSubject}
                                        onChange={(e) => setBulkSubject(e.target.value)}
                                        placeholder="Programming C"
                                    />
                                </div>
                            )}



                            <div className="space-y-2">
                                <Label>New Value</Label>

                                <Input
                                    type="number"
                                    value={bulkValue}
                                    onChange={(e) => setBulkValue(e.target.value)}
                                    placeholder="Leave empty to clear discount price"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={bulkLoading}
                                className="w-full"
                            >
                                {bulkLoading
                                    ? "Updating..."
                                    : "Update Prices"}
                            </Button>

                            {bulkMessage ? (
                                <p className="text-sm text-muted-foreground">
                                    {bulkMessage}
                                </p>
                            ) : null}
                        </form>
                    </CardContent>
                </Card>


                <div className="grid gap-4 md:grid-cols-2 mt-10 mb-10">

                    <div className="space-y-2">
                        <Label>Filter by type</Label>
                        <select
                            value={filterResourceType}
                            onChange={(e) => setFilterResourceType(e.target.value)}
                            className="h-10 w-full rounded-md border bg-background px-3"
                        >
                            <option value="all">All types</option>
                            <option value="MODEL_PAPER">Model Paper</option>
                            <option value="PYQ">PYQ</option>
                            <option value="QUESTION_BANK">Question Bank</option>
                            <option value="STUDY_MATERIAL">Study Material</option>
                            <option value="TEXTBOOK_PDF">Textbook PDF</option>
                            <option value="HANDWRITTEN_NOTE">Handwritten Notes</option>
                            <option value="MICRO_NOTE">Micro Notes</option>
                            <option value="IMPORTANT_QUESTION">Important Questions</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>Filter by course</Label>
                        <select
                            value={filterCourse}
                            onChange={(e) => setFilterCourse(e.target.value)}
                            className="h-10 w-full rounded-md border bg-background px-3"
                        >
                            <option value="all">All courses</option>
                            {Array.from(new Set(resources.map((r) => r.course))).map((course) => (
                                <option key={course} value={course}>
                                    {course}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>Filter by subject</Label>
                        <select
                            value={filterSubject}
                            onChange={(e) => setFilterSubject(e.target.value)}
                            className="h-10 w-full rounded-md border bg-background px-3"
                        >
                            <option value="all">All subjects</option>
                            {Array.from(new Set(resources.map((r) => r.subject))).map((subject) => (
                                <option key={subject} value={subject}>
                                    {subject}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>Filter by access</Label>

                        <select
                            value={filterAccessType}
                            onChange={(e) => setFilterAccessType(e.target.value)}
                            className="h-10 w-full rounded-md border bg-background px-3"
                        >
                            <option value="all">All</option>
                            <option value="premium">Premium</option>
                            <option value="free">Free</option>
                        </select>
                    </div>

                </div>


                <Card className="shadow-card">
                    <CardHeader>
                        <CardTitle>Uploaded Resources</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {resourcesLoading ? (
                            <p className="text-sm text-muted-foreground">Loading resources...</p>
                        ) : resourcesError ? (
                            <p className="text-sm text-destructive">{resourcesError}</p>
                        ) : resources.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No resources found.</p>
                        ) : (
                            <div className="space-y-3">
                                {filteredResources.map((resource) => {
                                    const salePrice =
                                        resource.discountPrice ?? resource.originalPrice;

                                    return (
                                        <div
                                            key={resource.id}
                                            className="w-full rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                                        >
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="flex-1 space-y-2 pr-4">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="text-lg font-semibold">{resource.title}</h3>
                                                        <Badge variant="secondary">{resource.resourceType}</Badge>
                                                        <Badge variant={resource.accessType === "premium" ? "default" : "outline"}>
                                                            {resource.accessType}
                                                        </Badge>
                                                    </div>

                                                    <p className="text-sm text-muted-foreground">
                                                        {resource.course} · Semester {resource.semester} · {resource.subject}
                                                    </p>

                                                    {resource.extraInfo ? (
                                                        <p className="text-sm text-muted-foreground">
                                                            Extra: {resource.extraInfo}
                                                        </p>
                                                    ) : null}

                                                    {resource.description ? (
                                                        <p className="mt-2 text-sm">{resource.description}</p>
                                                    ) : null}

                                                    <p className="mt-2 break-all text-xs text-muted-foreground">
                                                        {resource.pdfUrl}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    {resource.accessType === "premium" ? (
                                                        resource.discountPrice !== null ? (
                                                            <div className="flex flex-col items-end gap-1">
                                                                <span className="text-sm text-muted-foreground line-through">
                                                                    ₹{resource.originalPrice}
                                                                </span>
                                                                <span className="text-lg font-bold text-primary">
                                                                    ₹{resource.discountPrice}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-lg font-bold">
                                                                ₹{resource.originalPrice}
                                                            </span>
                                                        )
                                                    ) : (
                                                        <span className="text-sm font-medium text-success">Free</span>
                                                    )}

                                                    <div className="mt-4 flex flex-col gap-3">
                                                        <div className="flex flex-wrap justify-end gap-2">
                                                            <Badge variant={resource.isPublished ? "default" : "secondary"}>
                                                                {resource.isPublished ? "Published" : "Hidden"}
                                                            </Badge>

                                                            {resource.isFeatured ? <Badge>Featured</Badge> : null}
                                                            {resource.isTrending ? <Badge>Trending</Badge> : null}
                                                        </div>

                                                        <div className="flex items-center justify-end gap-2 rounded-xl border bg-muted/40 p-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-9 gap-2 rounded-lg px-3 font-medium transition-all hover:bg-background hover:shadow-sm"
                                                                onClick={() => startEditResource(resource)}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                                Edit
                                                            </Button>

                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                className="h-9 gap-2 rounded-lg px-3 font-medium shadow-sm transition-all hover:shadow-md"
                                                                onClick={() => handleDeleteResource(resource.slug)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>



                                    );
                                })}
                            </div>
                        )}


                    </CardContent>
                </Card>

                <Dialog
                    open={Boolean(editingResourceSlug)}
                    onOpenChange={(open) => {
                        if (!open) {
                            cancelResourceEdit();
                        }
                    }}
                >
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Edit Resource</DialogTitle>
                        </DialogHeader>

                        <form className="space-y-4" onSubmit={handleUpdateResource}>
                            <div className="space-y-2">
                                <Label>Resource Type</Label>

                                <select
                                    value={editResourceType}
                                    onChange={(e) => setEditResourceType(e.target.value)}
                                    className="h-10 w-full rounded-md border bg-background px-3"
                                >
                                    <option value="MODEL_PAPER">Model Question Paper</option>
                                    <option value="PYQ">PYQ</option>
                                    <option value="QUESTION_BANK">Question Bank</option>
                                    <option value="STUDY_MATERIAL">Study Material</option>
                                    <option value="TEXTBOOK_PDF">Textbook PDF</option>
                                    <option value="HANDWRITTEN_NOTE">Handwritten Notes</option>
                                    <option value="MICRO_NOTE">Micro Notes</option>
                                    <option value="IMPORTANT_QUESTION">Important Questions</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Access Type</Label>

                                <select
                                    value={editAccessType}
                                    onChange={(e) =>
                                        setEditAccessType(
                                            e.target.value as "free" | "premium",
                                        )
                                    }
                                    className="h-10 w-full rounded-md border bg-background px-3"
                                >
                                    <option value="premium">Premium</option>
                                    <option value="free">Free</option>
                                </select>
                            </div>

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
                                        type="number"
                                        value={editSemester}
                                        onChange={(e) => setEditSemester(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Subject</Label>

                                <Input
                                    value={editSubject}
                                    onChange={(e) => setEditSubject(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Subject ID</Label>
                                <Input
                                    value={editSubjectId}
                                    onChange={(e) => setEditSubjectId(e.target.value)}
                                    placeholder="cyber-law-bca-sem4"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Extra Info</Label>

                                <Input
                                    value={editExtraInfo}
                                    onChange={(e) => setEditExtraInfo(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>

                                <Textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                />
                            </div>

                            {editAccessType === "premium" ? (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Price</Label>

                                        <Input
                                            type="number"
                                            value={editPrice}
                                            onChange={(e) => setEditPrice(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Discount Price</Label>

                                        <Input
                                            type="number"
                                            value={editDiscountPrice}
                                            onChange={(e) =>
                                                setEditDiscountPrice(e.target.value)
                                            }
                                            placeholder="Leave blank to clear"
                                        />
                                    </div>
                                </div>
                            ) : null}

                            <div className="space-y-2">
                                <Label>Replace PDF (optional)</Label>

                                <Input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) =>
                                        setEditPdfFile(e.target.files?.[0] ?? null)
                                    }
                                />
                            </div>

                            <div className="flex flex-wrap justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={cancelResourceEdit}
                                >
                                    Cancel
                                </Button>

                                <Button type="submit" disabled={editLoading}>
                                    {editLoading ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

            </main>

            <Footer />
        </div>
    );
}