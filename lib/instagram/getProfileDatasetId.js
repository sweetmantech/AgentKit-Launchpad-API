import runTikTokActor from "../apify/runTikTokActor.js";
import { OUTSTANDING_ERROR } from "../twitter/errors.js";

const getProfileDatasetId = async (handle) => {
  const input = {
    usernames: [handle],
  };

  try {
    const response = await runTikTokActor(
      input,
      "apify~instagram-profile-scraper",
    );

    const error = response?.error;
    if (error) throw new Error(OUTSTANDING_ERROR);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export default getProfileDatasetId;
