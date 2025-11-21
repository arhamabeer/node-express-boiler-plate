const express = require("express");
const {
  createShortUrl,
  getRedirectUrl,
  getUrlAnalytics,
  getAllUrls,
} = require("../controllers/urlController");

const router = express.Router();

router.post("/createUrl", createShortUrl);
router.get("/getUrl/:shortUrl", getRedirectUrl);
router.get("/urlAnalytics/:shortUrl", getUrlAnalytics);
router.get("/", getAllUrls);

module.exports = router;
