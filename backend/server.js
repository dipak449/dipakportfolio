require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { rateLimit } = require("./src/middleware/rate-limit.middleware");

const connectDB = require("./src/config/db");

// Routes
const authRoutes = require("./src/routes/auth.routes");
const postsRoutes = require("./src/routes/posts.routes");
const servicesRoutes = require("./src/routes/services.routes");
const galleryRoutes = require("./src/routes/gallery.routes");
const messagesRoutes = require("./src/routes/messages.routes");
const homepageRoutes = require("./src/routes/homepage.routes");
const aboutRoutes = require("./src/routes/about.routes");
const socialLinksRoutes = require("./src/routes/social-links.routes");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

/* =========================
   MIDDLEWARE
========================= */
const corsOrigins = (process.env.CORS_ORIGINS || "http://localhost:3001")
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean);
const allowVercelPreviews = String(process.env.CORS_ALLOW_VERCEL_PREVIEWS || "").toLowerCase() === "true";

function isAllowedOrigin(origin = "") {
  if (corsOrigins.includes(origin)) return true;
  if (allowVercelPreviews) {
    try {
      const host = new URL(origin).hostname.toLowerCase();
      if (host.endsWith(".vercel.app")) return true;
    } catch {
      return false;
    }
  }
  return false;
}

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (isAllowedOrigin(origin)) return cb(null, true);
      const err = new Error("CORS blocked");
      err.status = 403;
      return cb(err);
    },
    credentials: true,
  })
);

// Basic security headers without extra dependencies
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  next();
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Global API rate limit guard (route-level stricter limits still apply where configured)
const globalApiRateLimit = rateLimit({ windowMs: 60_000, max: 120, keyPrefix: "api" });
app.use("/api", globalApiRateLimit);

// Prevent sensitive API responses from being cached
app.use((req, res, next) => {
  if (req.path.startsWith("/api/auth") || /\/api\/.+\/admin(\/|$)/.test(req.path)) {
    res.setHeader("Cache-Control", "no-store");
  }
  next();
});

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/homepage", homepageRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/social-links", socialLinksRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const status = Number(err?.status || err?.statusCode || 500);
  const safeStatus = status >= 400 && status < 600 ? status : 500;
  const message = safeStatus >= 500 ? "Internal server error" : err?.message || "Request failed";
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  res.status(safeStatus).json({ message });
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 8001;

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });

  function shutdown(signal) {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
});
