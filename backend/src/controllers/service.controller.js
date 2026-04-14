
import mongoose from "mongoose";
import { Service } from "../models/service.model.js";
import { demoServices } from "../data/services.demo.js";
import { env } from "../config/env.js";

function filterDemoItems({ q = "", rating = "", category = "" }) {
  const qq = q.trim().toLowerCase();

  return demoServices.filter((item) => {
    const matchesText =
      !qq ||
      item.name.toLowerCase().includes(qq) ||
      item.domain.toLowerCase().includes(qq) ||
      item.category.toLowerCase().includes(qq);

    const matchesRating = !rating || item.rating === rating;
    const matchesCategory = !category || item.category === category;

    return matchesText && matchesRating && matchesCategory;
  });
}

function shouldUseDemoData() {
  return !env.MONGO_URI || mongoose.connection.readyState !== 1;
}

export async function listServices(req, res, next) {
  try {
    const { q = "", rating = "", category = "" } = req.query;

    if (shouldUseDemoData()) {
      return res.json(filterDemoItems({ q, rating, category }));
    }

    const filter = {};
    if (rating) filter.rating = rating;
    if (category) filter.category = category;
    if (q) {
      const re = new RegExp(q, "i");
      filter.$or = [{ name: re }, { domain: re }, { category: re }];
    }

    const items = await Service.find(filter).sort({ score: -1, updatedAt: -1 }).lean();
    if (!items.length) {
      return res.json(filterDemoItems({ q, rating, category }));
    }

    return res.json(items);
  } catch (error) {
    return next(error);
  }
}

export async function getService(req, res, next) {
  try {
    if (shouldUseDemoData()) {
      const item = demoServices.find((entry) => entry._id === req.params.id);
      if (!item) return res.status(404).json({ ok: false, error: "Not Found" });
      return res.json(item);
    }

    const item = await Service.findById(req.params.id).lean();
    if (!item) {
      const demoItem = demoServices.find((entry) => entry._id === req.params.id);
      if (!demoItem) return res.status(404).json({ ok: false, error: "Not Found" });
      return res.json(demoItem);
    }

    return res.json(item);
  } catch (error) {
    return next(error);
  }
}
