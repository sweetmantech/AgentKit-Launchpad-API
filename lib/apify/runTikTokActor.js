import fetch from "node-fetch";
import { APIFY_TOKEN } from "../consts.js";

const runTikTokActor = async (input, actorId) => {
  try {
    const response = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      },
    );

    const data = await response.json();
    console.log("ZIAD", data)
    const defaultDatasetId = data.data.defaultDatasetId;
    return defaultDatasetId;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default runTikTokActor;
