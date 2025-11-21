import sh from "shortid";
import Url from "../models/urlModel.js";

export const createShortUrl = async (req, res) => {
  try {
    if (!req.body.redirectUrl)
      return res.status(400).json({ message: "URL not provided." });

    const _shortUrl = sh.generate();

    // console.log("Generated short URL:", _shortUrl);
    const response = await Url.create({
      redirectUrl: req.body.redirectUrl,
      shortUrl: _shortUrl,
      analytics: [],
    });

    if (response._id) {
      return res.status(201).json({
        message: "Short URL created successfully.",
        data: response.shortUrl,
      });
      // return res.render("home", { shortUrl: response.shortUrl });
    } else {
      return res.status(400).json({ message: "Short URL creation failed." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};

export const getRedirectUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    if (!shortUrl)
      return res.status(400).json({ message: "URL not provided." });

    const urlData = await Url.findOneAndUpdate(
      { shortUrl: shortUrl },
      {
        $push: { analytics: { timestamp: new Date() } },
      }
    );

    if (!urlData) {
      return res
        .status(404)
        .json({ message: "URL is not valid or expired.", data: urlData });
    }
    console.log("Short URL requested:", urlData);

    return res.redirect(urlData.redirectUrl);
  } catch (err) {
    res.status(500).json({ message: `Internal server error: ${err.message}` });
  }
};

export const getUrlAnalytics = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    if (!shortUrl)
      return res.status(400).json({ message: "URL not provided." });
    const urlData = await Url.findOne({ shortUrl: shortUrl });
    if (!urlData)
      return res.status(404).json({ message: "URL is not valid or expired." });

    return res.status(200).json({
      message: "URL analytics fetched successfully.",
      data: {
        totalClicks: urlData.analytics.length,
        analytics: urlData.analytics,
      },
    });
  } catch (err) {
    res.status(500).json({ message: `Internal server error: ${err.message}` });
  }
};

export const getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find({});
    // console.log("All URLs fetched:", urls);
    res.status(200).json({
      message: "All URLs fetched successfully.",
      data: urls,
    });
    // return res.render("home", { urlLists: urls });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};
