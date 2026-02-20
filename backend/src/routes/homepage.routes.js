const router = require("express").Router();
const c = require("../controllers/homepage.controller");
const { requireAdmin } = require("../middleware/auth.middleware");

router.get("/public", c.getPublic);
router.get("/admin", requireAdmin, c.getAdmin);
router.put("/admin", requireAdmin, c.updateAdmin);

module.exports = router;

