const router = require("express").Router();
const c = require("../controllers/posts.controller");
const { requireAdmin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// public
router.get("/", c.listPublished);
router.get("/slug/:slug", c.getBySlug);
router.get("/:slug", c.getBySlug);

// admin
router.get("/admin/all", requireAdmin, c.listAllAdmin); // include drafts
router.post("/admin/upload", requireAdmin, upload.single("image"), c.uploadCover);
router.post("/", requireAdmin, c.createPost);
router.patch("/:id/featured", requireAdmin, c.toggleFeatured);
router.put("/:id", requireAdmin, c.updatePost);
router.delete("/:id", requireAdmin, c.deletePost);

module.exports = router;
