import getActorStatus from "../apify/getActorStatus.js";
import getDataset from "../apify/getDataset.js";
import { STEP_OF_ANALYSIS } from "../step.js";
import getFormattedAccountInfo from "./getFormattedAccountInfo.js";

const getProfile = async (datasetId, chat_id) => {
  try {
    while (1) {
      const datasetItems = await getDataset(datasetId);
      if (datasetItems?.[0]?.error === UNKNOWN_PROFILE_ERROR) {
        global.io.emit(`${chat_id}`, {
          status: STEP_OF_ANALYSIS.UNKNOWN_PROFILE,
        });
        throw new Error(error);
      }
      const formattedAccountInfo = getFormattedAccountInfo(datasetItems);
      const status = await getActorStatus(datasetId);
      if (formattedAccountInfo && status === "SUCCEEDED")
        return formattedAccountInfo;
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export default getProfile;
