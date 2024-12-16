import getActorStatus from "../lib/apify/getActorStatus.js";
import getDataset from "../lib/apify/getDataset.js";
import getFormattedAccountInfo from "../lib/apify/getFormattedAccountInfo.js";
import runTikTokActor from "../lib/apify/runTikTokActor.js";
import {
  OUTSTANDING_ERROR,
  UNKNOWN_PROFILE_ERROR,
} from "../lib/twitter/errors.js";

export const get_tiktok_account_trends = async (req, res) => {
  const { handle } = req.query;
  const profiles = [handle];
  const input = {
    resultsPerPage: 10,
    proxyCountryCode: "None",
    profiles,
  };

  try {
    const response = await runTikTokActor(input, "clockworks~tiktok-scraper");

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
    const formattedData = getFormattedAccountInfo(data);
    return res
      .status(200)
      .json({ success: true, data: formattedData?.[0] || null });
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
