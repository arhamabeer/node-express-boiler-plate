const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    redirectUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    analytics: [{ timestamp: { type: Date, default: Date.now } }],
  },
  { timestamps: true }
);

const Url = mongoose.model("url", urlSchema);

module.exports = Url;
