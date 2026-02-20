const Message = require("../models/Message");
const ContactInfo = require("../models/ContactInfo");

function cleanText(value = "", max = 5000) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

async function getOrCreateContactInfo() {
  let doc = await ContactInfo.findOne();
  if (!doc) doc = await ContactInfo.create({});
  return doc;
}

// public
exports.send = async (req, res, next) => {
  try {
    const name = cleanText(req.body.name, 120);
    const email = cleanText(req.body.email, 160).toLowerCase();
    const subject = cleanText(req.body.subject || "", 180);
    const message = cleanText(req.body.message, 5000);
    if (!name || !email || !message)
      return res.status(400).json({ message: "All required fields missing" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Valid email required" });
    }

    const created = await Message.create({ name, email, subject, message });
    res.status(201).json({ ok: true, id: created._id });
  } catch (e) { next(e); }
};

exports.getContactInfoPublic = async (req, res, next) => {
  try {
    const doc = await getOrCreateContactInfo();
    if (!doc.isPublished) {
      return res.json({ email: "", phone: "", location: "", isPublished: false });
    }
    res.json({
      email: doc.email || "",
      phone: doc.phone || "",
      location: doc.location || "",
      isPublished: !!doc.isPublished,
    });
  } catch (e) { next(e); }
};

// admin
exports.listAll = async (req, res, next) => {
  try {
    const items = await Message.find({}).sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (e) { next(e); }
};

exports.markRead = async (req, res, next) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Not found" });
    msg.isRead = true;
    await msg.save();
    res.json({ ok: true });
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
};

exports.getContactInfoAdmin = async (req, res, next) => {
  try {
    const doc = await getOrCreateContactInfo();
    res.json({
      email: doc.email || "",
      phone: doc.phone || "",
      location: doc.location || "",
      isPublished: !!doc.isPublished,
    });
  } catch (e) { next(e); }
};

exports.upsertContactInfoAdmin = async (req, res, next) => {
  try {
    const doc = await getOrCreateContactInfo();

    if (typeof req.body.email === "string") doc.email = cleanText(req.body.email, 160);
    if (typeof req.body.phone === "string") doc.phone = cleanText(req.body.phone, 40);
    if (typeof req.body.location === "string") doc.location = cleanText(req.body.location, 120);
    if (typeof req.body.isPublished === "boolean") doc.isPublished = req.body.isPublished;

    await doc.save();
    res.json({
      email: doc.email || "",
      phone: doc.phone || "",
      location: doc.location || "",
      isPublished: !!doc.isPublished,
    });
  } catch (e) { next(e); }
};
