import getActorStatus from "../apify/getActorStatus";
import getDataset from "../apify/getDataset.js";
import getFormattedCommentsInfo from "./getFormattedCommentsInfo.js";
import getVideoCommentsDatasetId from "./getVideoCommentsDatasetId.js";

const getVideoComments = async (postURLs, chat_id) => {
  try {
    const datasetId = await getVideoCommentsDatasetId(postURLs);
    let attempts = 0;
    const maxAttempts = 30;
    let progress = 0;
    while (1) {
      attempts++;
      progress = (attempts / maxAttempts) * 100;
      if (progress < 20)
        global.io.emit(`${chat_id}`, {
          status: STEP_OF_ANALYSIS.POSTURLS,
        });
      if (progress > 20)
        global.io.emit(`${chat_id}`, {
          status: STEP_OF_ANALYSIS.VIDEO_COMMENTS,
        });

      const data = await getDataset(datasetId);
      const formattedData = getFormattedCommentsInfo(data);
      const status = await getActorStatus(datasetId);
      if (status === "SUCCEEDED" || progress > 95) return formattedData;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export default getVideoComments;
