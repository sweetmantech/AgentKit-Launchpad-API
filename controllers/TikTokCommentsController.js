import getActorStatus from "../lib/apify/getActorStatus.js";
import getDataset from "../lib/apify/getDataset.js";
import runTikTokActor from "../lib/apify/runTikTokActor.js";
import getFormattedCommentsInfo from "../lib/apify/getFormattedCommentsInfo.js";

export const get_tiktok_video_comments = async (req, res) => {
  const { postURLs } = req.query;

  const input = {
    postURLs: JSON.parse(postURLs),
    commentsPerPost: 100,
    maxRepliesPerComment: 0,
  };

  try {
    const defaultDatasetId = await runTikTokActor(
      input,
      "clockworks~tiktok-comments-scraper",
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
    const formattedData = getFormattedCommentsInfo(data);

    return res.status(200).json({
      success: true,
      data: {
        videos: formattedData.videos,
        total_video_comments_count: formattedData.totalComments,
      },
    });
  } catch (error) {
    console.error(error);
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
