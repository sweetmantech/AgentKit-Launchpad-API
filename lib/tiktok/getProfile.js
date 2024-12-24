import getActorStatus from "../apify/getActorStatus.js";
import getDataset from "../apify/getDataset.js";
import { STEP_OF_ANALYSIS } from "../step.js";
import { UNKNOWN_PROFILE_ERROR } from "../twitter/errors.js";
import getFormattedAccount from "./getFormattedAccount.js";

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
      const formattedAccount = getFormattedAccount(datasetItems);
      console.log("ZIAD PROFILE FORMATTED ACCOUNT INFO", formattedAccount);
      const status = await getActorStatus(datasetId);
      if (formattedAccount && status === "SUCCEEDED") return formattedAccount;
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export default getProfile;
