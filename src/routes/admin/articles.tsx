import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/articles")({
    component: ArticlesAdminPage,
});
console.log("ADMIN ARTICLES PAGE LOADED");
type ArticleItem = {
    id: number;
    title: string;
    slug: string;
    category: string | null;
    author: string | null;
    published: boolean;
    created_at: string;
    excerpt: string | null;
    content: string;
    cover_image: string | null;
};

function ArticlesAdminPage() {
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    const [articles, setArticles] = useState<ArticleItem[]>([]);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [category, setCategory] = useState("");
    const [author, setAuthor] = useState("FYUGP Hub");
    const [coverImage, setCoverImage] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [published, setPublished] = useState(true);

    const [creating, setCreating] = useState(false);
    const [message, setMessage] = useState("");

    const [editingArticle, setEditingArticle] =
        useState<ArticleItem | null>(null);

    const [editTitle, setEditTitle] = useState("");
    const [editSlug, setEditSlug] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editAuthor, setEditAuthor] = useState("");
    const [editCoverImage, setEditCoverImage] = useState("");
    const [editExcerpt, setEditExcerpt] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editPublished, setEditPublished] = useState(true);

    const [editLoading, setEditLoading] = useState(false);

    const handleCreateArticle = async (
        e: React.FormEvent,
    ) => {
        e.preventDefault();

        setCreating(true);
        setMessage("");

        try {
            const res = await fetch(
                "/api/admin/upload-article",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title,
                        slug,
                        excerpt,
                        content,
                        coverImage,
                        category,
                        author,
                        published,
                    }),
                },
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to create article",
                );
            }

            setMessage("Article published successfully");

            setTitle("");
            setSlug("");
            setCategory("");
            setCoverImage("");
            setExcerpt("");
            setContent("");

            await loadArticles();
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to create article",
            );
        } finally {
            setCreating(false);
        }
    };

    const handleUpdateArticle = async (
        e: React.FormEvent,
    ) => {
        e.preventDefault();

        if (!editingArticle) return;

        setEditLoading(true);

        try {
            const res = await fetch(
                "/api/admin/update-article",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        id: editingArticle.id,
                        title: editTitle,
                        slug: editSlug,
                        excerpt: editExcerpt,
                        content: editContent,
                        coverImage: editCoverImage,
                        category: editCategory,
                        author: editAuthor,
                        published: editPublished,
                    }),
                },
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(
                    data.message || "Update failed"
                );
            }

            setEditingArticle(null);

            await loadArticles();
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Update failed"
            );
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteArticle = async (
        id: number,
    ) => {
        const ok = window.confirm(
            "Delete this article permanently?"
        );

        if (!ok) return;

        const res = await fetch(
            "/api/admin/delete-article",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({ id }),
            },
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
            alert(
                data.message || "Delete failed"
            );
            return;
        }

        await loadArticles();
    };

    const loadArticles = async () => {
        setLoading(true);

        try {
            const res = await fetch("/api/admin/articles");
            const data = await res.json();

            if (data.success) {
                setArticles(data.articles);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setSlug(
            title
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
        );
    }, [title]);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/admin/me");
                const data = await res.json();

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
            loadArticles();
        }
    }, [authenticated]);

    return (
        <div className="min-h-screen bg-background">
            <Header admin />

            <main className="mx-auto max-w-6xl px-4 py-10">
                {checking ? (
                    <Card>
                        <CardContent className="p-6">
                            Checking admin session...
                        </CardContent>
                    </Card>
                ) : !authenticated ? (
                    <Card>
                        <CardContent className="p-6">
                            Unauthorized
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>
                                    Create Article
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <form
                                    className="space-y-4"
                                    onSubmit={handleCreateArticle}
                                >
                                    <div className="space-y-2">
                                        <Label>Title</Label>

                                        <Input
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                            placeholder="Calicut University FYUGP Admission 2026"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Slug</Label>

                                        <Input
                                            value={slug}
                                            readOnly
                                        />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Category</Label>

                                            <Input
                                                value={category}
                                                onChange={(e) =>
                                                    setCategory(e.target.value)
                                                }
                                                placeholder="Admissions"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Author</Label>

                                            <Input
                                                value={author}
                                                onChange={(e) =>
                                                    setAuthor(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Cover Image URL</Label>

                                        <Input
                                            value={coverImage}
                                            onChange={(e) =>
                                                setCoverImage(e.target.value)
                                            }
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Excerpt</Label>

                                        <Textarea
                                            value={excerpt}
                                            onChange={(e) =>
                                                setExcerpt(e.target.value)
                                            }
                                            placeholder="Short summary..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Content</Label>

                                        <Textarea
                                            value={content}
                                            onChange={(e) =>
                                                setContent(e.target.value)
                                            }
                                            rows={12}
                                            placeholder="Full article content..."
                                        />
                                    </div>

                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={published}
                                            onChange={(e) =>
                                                setPublished(
                                                    e.target.checked,
                                                )
                                            }
                                        />

                                        Published
                                    </label>



                                    <Button
                                        type="submit"
                                        disabled={creating}
                                        className="w-full"
                                    >
                                        {creating
                                            ? "Publishing..."
                                            : "Publish Article"}
                                    </Button>

                                    {message ? (
                                        <p className="text-sm text-muted-foreground">
                                            {message}
                                        </p>
                                    ) : null}
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Articles
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <div className="space-y-3">
                                        {articles.map((article) => (
                                            <div
                                                key={article.id}
                                                className="rounded-lg border p-4"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h3 className="font-semibold">
                                                            {article.title}
                                                        </h3>

                                                        <p className="text-sm text-muted-foreground">
                                                            {article.category || "No Category"}
                                                        </p>

                                                        <p className="text-xs text-muted-foreground">
                                                            {article.slug}
                                                        </p>

                                                        <p className="text-xs text-muted-foreground">
                                                            {article.published
                                                                ? "Published"
                                                                : "Draft"}
                                                        </p>

                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(article.created_at).toLocaleDateString()}
                                                        </p>

                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() =>
                                                                window.open(
                                                                    `/articles/${article.slug}`,
                                                                    "_blank"
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setEditingArticle(article);

                                                                setEditTitle(article.title);
                                                                setEditSlug(article.slug);
                                                                setEditCategory(article.category ?? "");
                                                                setEditAuthor(article.author ?? "");
                                                                setEditCoverImage(article.cover_image ?? "");
                                                                setEditExcerpt(article.excerpt ?? "");
                                                                setEditContent(article.content ?? "");
                                                                setEditPublished(article.published);
                                                            }}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>

                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDeleteArticle(article.id)
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}

                <Dialog
                    open={Boolean(editingArticle)}
                    onOpenChange={(open) => {
                        if (!open) {
                            setEditingArticle(null);
                        }
                    }}
                >
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Edit Article</DialogTitle>
                        </DialogHeader>

                        <form
                            className="space-y-4"
                            onSubmit={handleUpdateArticle}
                        >
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(e.target.value)
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Slug</Label>
                                <Input
                                    value={editSlug}
                                    onChange={(e) =>
                                        setEditSlug(e.target.value)
                                    }
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Input
                                        value={editCategory}
                                        onChange={(e) =>
                                            setEditCategory(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Author</Label>
                                    <Input
                                        value={editAuthor}
                                        onChange={(e) =>
                                            setEditAuthor(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Cover Image URL</Label>
                                <Input
                                    value={editCoverImage}
                                    onChange={(e) =>
                                        setEditCoverImage(e.target.value)
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Excerpt</Label>
                                <Textarea
                                    value={editExcerpt}
                                    onChange={(e) =>
                                        setEditExcerpt(e.target.value)
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Content</Label>
                                <Textarea
                                    value={editContent}
                                    rows={12}
                                    onChange={(e) =>
                                        setEditContent(e.target.value)
                                    }
                                />
                            </div>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={editPublished}
                                    onChange={(e) =>
                                        setEditPublished(e.target.checked)
                                    }
                                />
                                Published
                            </label>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setEditingArticle(null)
                                    }
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={editLoading}
                                >
                                    {editLoading
                                        ? "Saving..."
                                        : "Save Changes"}
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