// src/routes/sitemap[.]xml.ts
import { createFileRoute } from "@tanstack/react-router";

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
};

const STATIC_PATHS = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/privacy", changefreq: "monthly", priority: "0.3" },
  { path: "/purchase", changefreq: "monthly", priority: "0.5" },
  { path: "/resources", changefreq: "daily", priority: "0.8" },
  { path: "/select", changefreq: "weekly", priority: "0.7" },
  { path: "/view", changefreq: "weekly", priority: "0.7" },
] as const;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSitemapXml(entries: SitemapEntry[]) {
  const urls = entries
    .map((entry) => {
      const parts = [
        `<loc>${escapeXml(entry.loc)}</loc>`,
        entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : "",
        entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : "",
        entry.priority ? `<priority>${entry.priority}</priority>` : "",
      ]
        .filter(Boolean)
        .join("\n    ");

      return `  <url>\n    ${parts}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

// Replace this with your real DB/Supabase query.
// Return only PUBLIC, indexable pages here.
async function getDynamicEntries(origin: string): Promise<SitemapEntry[]> {
  // Example shape:
  // const rows = await db.select(...)
  // return rows.map((row) => ({ loc: `${origin}/your-public-route/${row.slug}`, lastmod: row.updatedAt }))

  const rows: Array<{ slug: string; updatedAt?: string }> = [];

  return rows.map((row) => ({
    loc: `${origin}/view/${encodeURIComponent(row.slug)}`, // change this to your real public URL pattern
    lastmod: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined,
    changefreq: "weekly",
    priority: "0.8",
  }));
}

export const Route = createFileRoute("/sitemapfyugp.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;

        const staticEntries: SitemapEntry[] = STATIC_PATHS.map((item) => ({
          loc: `${origin}${item.path}`,
          changefreq: item.changefreq,
          priority: item.priority,
        }));

        const dynamicEntries = await getDynamicEntries(origin);

        const xml = buildSitemapXml([...staticEntries, ...dynamicEntries]);

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});