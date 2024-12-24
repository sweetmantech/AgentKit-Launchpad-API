import {
  CHAT_POINT_SYSTEM_ID,
  MESSAGE_SENT_EVENT,
  MESSAGE_SENT_POINT,
} from "../consts.js";
import getStackClient from "./getStackClient.js";

const trackFunnelAnalysisChat = async (
  address,
  username,
  artistId,
  chatId,
  funnelName,
) => {
  try {
    const stackClient = getStackClient(CHAT_POINT_SYSTEM_ID);
    const uniqueId = `${address}-${Date.now()}`;
    const eventName = `${MESSAGE_SENT_EVENT}-${chatId}`;
    await stackClient.track(eventName, {
      points: MESSAGE_SENT_POINT,
      account: address,
      uniqueId,
      metadata: {
        conversationId: chatId,
        artistId,
        title: `${funnelName} Analysis: ${username}`,
        is_funnel_analysis: true,
        funnel_name: funnelName,
      },
    });
  } catch (error) {
    console.error(error);
    return { error };
  }
};

export default trackFunnelAnalysisChat;
