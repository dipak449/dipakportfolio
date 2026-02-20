const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");

function normalizeEmail(value = "") {
  return String(value || "").trim().toLowerCase();
}

exports.setupAdmin = async (req, res, next) => {
  try {
    const { setupKey, name, password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!setupKey || setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ message: "Invalid setup key" });
    }
    if (!String(name || "").trim() || !email || !String(password || "").trim()) {
      return res.status(400).json({ message: "name, email, password required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Valid email required" });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existing = await AdminUser.findOne({ email });
    if (existing) return res.status(409).json({ message: "Admin already exists" });

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await AdminUser.create({ name: String(name).trim(), email, passwordHash });

    return res.json({ ok: true, admin: { id: admin._id, email: admin.email } });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });
    const admin = await AdminUser.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (e) {
    next(e);
  }
};

exports.me = async (req, res) => {
  return res.json({ admin: req.admin });
};
