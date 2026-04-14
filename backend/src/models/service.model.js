
import mongoose from "mongoose";

const { Mixed } = mongoose.Schema.Types;

const serviceSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    domain: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    rating: { type: String, enum: ["A", "B", "C", "D", "E"], required: true },
    score: { type: Number, default: 0 },
    summary: { type: String, required: true },
    tagline: { type: String, default: "" },
    location: { type: String, default: "" },
    reviewStatus: { type: String, default: "" },
    cookieSummary: { type: Mixed, default: {} },
    trackerCount: { type: Number, default: 0 },
    thirdPartyCount: { type: Number, default: 0 },
    retention: { type: String, default: "" },
    deletion: { type: String, default: "" },
    privacyHighlights: { type: [String], default: [] },
    riskFlags: { type: [Mixed], default: [] },
    checklist: { type: [Mixed], default: [] },
    cookieCategories: { type: [Mixed], default: [] },
    cookies: { type: [Mixed], default: [] },
    trackers: { type: [Mixed], default: [] },
    findings: { type: [Mixed], default: [] },
    termsHighlights: { type: [String], default: [] },
    scoreBreakdown: { type: [Mixed], default: [] },
    policyLinks: { type: Mixed, default: {} },
    rights: { type: [String], default: [] },
    collectedData: { type: [String], default: [] },
    sharedWith: { type: [String], default: [] },
    retentionDetails: { type: [String], default: [] },
    transfers: { type: [String], default: [] },
    strength: { type: String, default: "" },
    caution: { type: String, default: "" },
  },
  { timestamps: true, minimize: false, _id: false }
);

export const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);
