import getActorStatus from "../lib/apify/getActorStatus.js";
import getDataset from "../lib/apify/getDataset.js";
import runTikTokActor from "../lib/apify/runTikTokActor.js";
import {
  OUTSTANDING_ERROR,
  UNKNOWN_PROFILE_ERROR,
} from "../lib/twitter/errors.js";

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

export const get_dataset_items = async (req, res) => {
  const { datasetId } = req.query;

  try {
    const data = await getDataset(datasetId);
    if (data?.[0]?.error === UNKNOWN_PROFILE_ERROR)
      return res.status(500).json({ error: UNKNOWN_PROFILE_ERROR });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const get_dataset_status = async (req, res) => {
  const { datasetId } = req.query;

  try {
    const data = await getActorStatus(datasetId);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};
