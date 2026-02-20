const router = require("express").Router();
const { setupAdmin, login, me } = require("../controllers/auth.controller");
const { requireAdmin } = require("../middleware/auth.middleware");
const { rateLimit } = require("../middleware/rate-limit.middleware");

const authRateLimit = rateLimit({ windowMs: 10 * 60 * 1000, max: 20, keyPrefix: "auth" });

/**
 * ✅ Keep old working routes (your existing ones)
 */
router.post("/admin/setup", authRateLimit, setupAdmin);
router.post("/admin/login", authRateLimit, login);
router.get("/admin/me", requireAdmin, me);

/**
 * ✅ Add NEW aliases to match frontend request
 * Frontend is calling: /api/auth/login
 */
router.post("/login", authRateLimit, login);
router.get("/me", requireAdmin, me);

module.exports = router;
