const fs = require("fs");
const path = require("path");

function normalizeBaseUrl(raw) {
  const value = String(raw || "").trim();
  if (!value) return "https://example.com";
  try {
    const u = new URL(value.startsWith("http") ? value : `https://${value}`);
    return u.origin;
  } catch {
    return "https://example.com";
  }
}

const baseUrl = normalizeBaseUrl(process.env.REACT_APP_SITE_URL || process.env.SITE_URL);
const publicDir = path.join(__dirname, "..", "public");
const now = new Date().toISOString().slice(0, 10);

const routes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.9" },
  { path: "/service", changefreq: "monthly", priority: "0.8" },
  { path: "/project", changefreq: "weekly", priority: "0.8" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/certifications", changefreq: "monthly", priority: "0.7" },
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const robotsTxt = `User-agent: *
Disallow:
Disallow: /admin/

Sitemap: ${baseUrl}/sitemap.xml
`;

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXml, "utf8");
fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsTxt, "utf8");

console.log(`[seo] Generated sitemap.xml and robots.txt for ${baseUrl}`);
