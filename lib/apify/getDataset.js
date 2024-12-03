import fetch from "node-fetch";
import { APIFY_TOKEN } from "../consts.js";

const getDataset = async (datasetId) => {
  const response = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = await response.json();

  return data;
};

export default getDataset;
