const router = require("express").Router();
const c = require("../controllers/messages.controller");
const { requireAdmin } = require("../middleware/auth.middleware");
const { rateLimit } = require("../middleware/rate-limit.middleware");

const contactSendRateLimit = rateLimit({ windowMs: 10 * 60 * 1000, max: 15, keyPrefix: "contact-send" });

// public
router.post("/", contactSendRateLimit, c.send);
router.get("/contact-info", c.getContactInfoPublic);

// admin
router.get("/admin/all", requireAdmin, c.listAll);
router.put("/admin/read/:id", requireAdmin, c.markRead);
router.delete("/admin/:id", requireAdmin, c.remove);
router.get("/admin/contact-info", requireAdmin, c.getContactInfoAdmin);
router.put("/admin/contact-info", requireAdmin, c.upsertContactInfoAdmin);

module.exports = router;
