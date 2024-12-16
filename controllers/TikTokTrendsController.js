import getActorStatus from "../lib/apify/getActorStatus.js";
import getDataset from "../lib/apify/getDataset.js";
import getFormattedAccountInfo from "../lib/apify/getFormattedAccountInfo.js";
import runTikTokActor from "../lib/apify/runTikTokActor.js";

export const get_tiktok_account_trends = async (req, res) => {
  const { handle } = req.query;
  const profiles = [handle];
  const input = {
    resultsPerPage: 10,
    proxyCountryCode: "None",
    profiles,
  };

  try {
    const defaultDatasetId = await runTikTokActor(
      input,
      "clockworks~tiktok-scraper",
    );

    return res.status(200).json({ success: true, data: defaultDatasetId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const get_dataset_items = async (req, res) => {
  const { datasetId } = req.query;

  try {
    const data = await getDataset(datasetId);
    console.log("ZIAD", data)
    const formattedData = getFormattedAccountInfo(data);
    return res
      .status(200)
      .json({ success: true, data: formattedData?.[0] || null });
  } catch (error) {
    console.error("ZIAD", error);
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
