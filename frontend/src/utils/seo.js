/**
 * SEO Configuration and Helpers
 * Provides utilities for managing meta tags and structured data
 */

export const SITE_CONFIG = {
  title: "Dipak Portfolio",
  description: "Portfolio of Dipak, a fresher full stack developer showcasing projects, services, resume, and blog updates.",
  url:
    process.env.REACT_APP_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3001"),
  image: "/og-image.png",
  twitterHandle: "@dipak",
  author: "Dipak Sah",
  email: "shahdipak449@gmail.com",
};

function toAbsoluteUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return `${SITE_CONFIG.url}${SITE_CONFIG.image}`;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${SITE_CONFIG.url}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

/**
 * Build page metadata
 */
export function buildPageMeta(page = {}) {
  const {
    title = SITE_CONFIG.title,
    description = SITE_CONFIG.description,
    path = "/",
    image = SITE_CONFIG.image,
    type = "website",
  } = page;

  const url = `${SITE_CONFIG.url}${path}`;
  const absoluteImage = toAbsoluteUrl(image);

  return {
    title: `${title} | ${SITE_CONFIG.title}`.replace(/\s+\|\s+\|\s+/, " | "),
    description: description.substring(0, 160),
    url,
    image: absoluteImage,
    type,
    canonical: url,
  };
}

/**
 * Create JSON-LD structured data for Schema.org
 */
export function createStructuredData(type = "Person", data = {}) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
    name: SITE_CONFIG.author,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.email,
    image: toAbsoluteUrl(SITE_CONFIG.image),
    sameAs: [
      "https://facebook.com/dipak",
      "https://instagram.com/dipak",
      "https://linkedin.com/in/dipak",
    ],
  };

  return { ...baseSchema, ...data };
}

/**
 * Create Organization schema
 */
export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dipak Portfolio",
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo192.png`,
    description: SITE_CONFIG.description,
    sameAs: [
      "https://facebook.com/dipak",
      "https://instagram.com/dipak",
      "https://linkedin.com/in/dipak",
    ],
  };
}

/**
 * Create Article schema for blog posts
 */
export function createArticleSchema(article = {}) {
  const {
    title = "Article",
    description = "",
    image = SITE_CONFIG.image,
    datePublished = new Date().toISOString(),
    dateModified = new Date().toISOString(),
    author = "Dipak Sah",
    slug = "article",
  } = article;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: toAbsoluteUrl(image),
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      "@type": "Person",
      name: author,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/blog/${slug}`,
    },
  };
}

/**
 * Create BreadcrumbList schema
 */
export function createBreadcrumbSchema(breadcrumbs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${SITE_CONFIG.url}${item.path}`,
    })),
  };
}

