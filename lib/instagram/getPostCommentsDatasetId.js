import runTikTokActor from "../apify/runTikTokActor.js";

const getPostCommentsDatasetId = async (directUrls) => {
  const input = {
    directUrls,
    resultsLimit: 100,
  };

  try {
    const defaultDatasetId = await runTikTokActor(
      input,
      "apify~instagram-comment-scraper",
    );
    return defaultDatasetId;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export default getPostCommentsDatasetId;
