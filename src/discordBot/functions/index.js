import sh from "shortid";
import Url from "../../models/urlModel.js";
import { responseBot } from "./globalResponseBot.js";

export const createShortUrlDiscord = async (user, redirectUrl) => {
  try {
    if (!redirectUrl || !user)
      return responseBot({
        status: 400,
        message: "Invalid request. URL or User not provided.",
      });

    const _shortUrl = sh.generate();

    // console.log("Generated short URL:", _shortUrl);
    const response = await Url.create({
      redirectUrl: redirectUrl,
      shortUrl: _shortUrl,
      analytics: [],
    });

    if (response._id) {
      return responseBot({
        status: 201,
        message: "Short URL created successfully.",
        data: response.shortUrl,
      });
    } else {
      return responseBot({
        status: 400,
        message: "Short URL creation failed.",
      });
    }
  } catch (error) {
    return responseBot({
      status: 500,
      message: `Internal server error: ${error.message}`,
    });
  }
};

export const getRedirectUrlDiscord = async (shortUrl) => {
  try {
    if (!shortUrl)
      return responseBot({
        status: 400,
        message: "URL not provided.",
      });

    const urlData = await Url.findOneAndUpdate(
      { shortUrl: shortUrl },
      {
        $push: { analytics: { timestamp: new Date() } },
      }
    );

    if (!urlData) {
      return responseBot({
        status: 404,
        message: "URL is not valid or expired.",
      });
    }
    return responseBot({
      status: 200,
      message: "URL fetched successfully.",
      data: {
        redirectUrl: urlData.redirectUrl,
      },
    });
  } catch (err) {
    return responseBot({
      status: 500,
      message: `Internal server error: ${err.message}`,
    });
  }
};
export const getShortUrlDiscord = async (redirectUrl) => {
  try {
    if (!redirectUrl)
      return responseBot({
        status: 400,
        message: "URL not provided.",
      });

    const urlData = await Url.findOneAndUpdate(
      { redirectUrl: redirectUrl },
      {
        $push: { analytics: { timestamp: new Date() } },
      }
    );

    if (!urlData) {
      return responseBot({
        status: 404,
        message: "URL is not valid or expired.",
      });
    }
    return responseBot({
      status: 200,
      message: "URL fetched successfully.",
      data: {
        shortUrl: urlData.shortUrl,
      },
    });
  } catch (err) {
    return responseBot({
      status: 500,
      message: `Internal server error: ${err.message}`,
    });
  }
};

export const getUrlAnalyticsDiscord = async (shortUrl) => {
  try {
    if (!shortUrl)
      return responseBot({
        status: 400,
        message: "URL not provided.",
      });

    const urlData = await Url.findOne({ shortUrl: shortUrl });
    if (!urlData)
      return responseBot({
        status: 404,
        message: "URL is not valid or expired.",
      });

    return responseBot({
      status: 200,
      message: "URL analytics fetched successfully.",
      data: {
        totalClicks: urlData.analytics.length,
      },
    });
  } catch (err) {
    return responseBot({
      status: 500,
      message: `Internal server error: ${err.message}`,
    });
  }
};

export const getAllUrlsDiscord = async () => {
  try {
    // console.log("All URLs fetching:");
    const urls = await Url.find({});
    // console.log("All URLs fetched:", urls);
    return responseBot({
      status: 200,
      message: "All URLs fetched successfully.",
      data: urls,
    });
  } catch (error) {
    return responseBot({
      status: 500,
      message: `Internal server error: ${error}`,
    });
  }
};
