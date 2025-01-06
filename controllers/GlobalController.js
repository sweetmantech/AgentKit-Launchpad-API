import getActorStatus from "../lib/apify/getActorStatus.js";
import getDataset from "../lib/apify/getDataset.js";
import exa from "../lib/exa/client.js";
import tvly from "../lib/tavily/client.js";

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

export const get_dataset_items = async (req, res) => {
  const { datasetId } = req.query;

  try {
    const data = await getDataset(datasetId);
    if (data?.[0]?.error)
      return res.status(500).json({ error: data?.[0]?.error });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

export const get_social_handles = async (req, res) => {
  const { handle } = req.query;
  try {
    let query = `What is tiktok handle for ${handle}?`;
    let response = await tvly.search(query, {
      includeDomains: ["tiktok.com"],
      searchDepth: "advanced",
      maxResults: 10,
      includeAnswer: true,
      maxTokens: 1111,
    });
    let result = response.results.find(
      (result) => result.url.search("https://www.tiktok.com/@") >= 0,
    );

    const tiktokHandle = result.url.match(/@(\w+)/)[1];

    query = `What is spotify handle for ${handle}?`;
    response = await tvly.search(query, {
      includeDomains: ["spotify.com"],
      searchDepth: "advanced",
      maxResults: 10,
      includeAnswer: true,
      maxTokens: 1111,
    });

    return res.status(200).json({ success: true, response, tiktokHandle });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};
