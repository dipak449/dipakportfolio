const Service = require("../models/Service");
const { importImageToCloudinary } = require("../utils/image-storage.util");
const { normalizeImageFields } = require("../utils/image-url.util");

exports.listPublished = async (req, res, next) => {
  try {
    const items = await Service.find({ isPublished: true }).sort({ launchDate: -1 }).lean();
    const normalized = items.map((item) => ({
      ...item,
      category: item.category || "",
      launchDate: item.launchDate || null,
      imageUrl: item.imageUrl || "",
    }));
    res.json(normalizeImageFields(normalized, ["imageUrl"]));
  } catch (e) {
    next(e);
  }
};

exports.listAllAdmin = async (req, res, next) => {
  try {
    const items = await Service.find({}).sort({ launchDate: -1 }).lean();
    const normalized = items.map((item) => ({
      ...item,
      category: item.category || "",
      launchDate: item.launchDate || null,
      imageUrl: item.imageUrl || "",
    }));
    res.json(normalizeImageFields(normalized, ["imageUrl"]));
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const {
      title,
      category = "",
      launchDate,
      imageUrl = "",
      description = "",
      isPublished = true,
    } = req.body;
    if (!title || !launchDate) return res.status(400).json({ message: "title and launchDate required" });
    const created = await Service.create({
      title,
      category,
      launchDate,
      imageUrl: await importImageToCloudinary(imageUrl, "dipak_portfolio/services"),
      description,
      isPublished,
    });
    res.status(201).json(normalizeImageFields(created.toObject(), ["imageUrl"]));
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Service.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Service not found" });
    const fields = ["title", "category", "launchDate", "description", "isPublished"];
    fields.forEach((k) => {
      if (typeof req.body[k] !== "undefined") item[k] = req.body[k];
    });
    if (typeof req.body.imageUrl === "string") {
      item.imageUrl = await importImageToCloudinary(req.body.imageUrl, "dipak_portfolio/services");
    }
    await item.save();
    res.json(normalizeImageFields(item.toObject(), ["imageUrl"]));
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Service not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
};
