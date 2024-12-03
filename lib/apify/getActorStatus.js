import fetch from "node-fetch";
import dotenv from "dotenv";
import { APIFY_TOKEN } from "../consts.js";

dotenv.config();

const getActorStatus = async (datasetId) => {
  try {
    const response = await fetch(
      `https://api.apify.com/v2/actor-runs?token=${APIFY_TOKEN}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    const actorStatus = data.data.items.find(
      (item) => item.defaultDatasetId === datasetId,
    );
    return actorStatus.status;
  } catch (error) {
    return "RUNNING";
  }
};

export default getActorStatus;
