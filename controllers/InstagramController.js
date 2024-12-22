import runTikTokActor from "../lib/apify/runTikTokActor.js";
import { OUTSTANDING_ERROR } from "../lib/twitter/errors.js";

export const get_instagram_account_profile = async (req, res) => {
  const { handle } = req.query;
  const input = {
    usernames: [handle],
  };

  try {
    const response = await runTikTokActor(
      input,
      "apify~instagram-profile-scraper",
    );

    const error = response?.error;
    if (error) {
      if (error === OUTSTANDING_ERROR)
        res.status(500).json({ error: OUTSTANDING_ERROR });
    }
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const get_instagram_reels = async (req, res) => {
  const { handle } = req.query;
  const input = {
    username: [handle],
    resultsLimit: 30,
  };

  try {
    const response = await runTikTokActor(
      input,
      "apify~instagram-reel-scraper",
    );

    const error = response?.error;
    if (error) {
      if (error === OUTSTANDING_ERROR)
        res.status(500).json({ error: OUTSTANDING_ERROR });
    }
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const get_instagram_comments = async (req, res) => {
  const { directUrls } = req.query;

  const input = {
    directUrls,
    resultsLimit: 100,
  };

  try {
    const defaultDatasetId = await runTikTokActor(
      input,
      "apify~instagram-comment-scraper",
    );

    return res.status(200).json({ success: true, data: defaultDatasetId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};
