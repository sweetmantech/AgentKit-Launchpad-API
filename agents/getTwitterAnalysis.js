import { Scraper } from "agent-twitter-client";
import getAllTweets from "../lib/twitter/getAllTweets.js";
import { STEP_OF_ANALYSIS } from "../lib/step.js";
import beginAnalysis from "../lib/supabase/beginAnalysis.js";
import updateAnalysisStatus from "../lib/supabase/updateAnalysisStatus.js";
import getTwitterComments from "../lib/twitter/getTwitterComments.js";
import saveFunnelComments from "../lib/supabase/saveFunnelComments.js";
import getSegments from "../lib/getSegments.js";
import getSegmentsWithIcons from "../lib/getSegmentsWithIcons.js";
import saveFunnelSegments from "../lib/supabase/saveFunnelSegments.js";
import { Funnel_Type } from "../lib/funnels.js";
import saveFunnelProfile from "../lib/supabase/saveFunnelProfile.js";
import trackFunnelAnalysisChat from "../lib/stack/trackFunnelAnalysisChat.js";

const scraper = new Scraper();

const getTwitterAnalysis = async (handle, chat_id, account_id, address) => {
  try {
    const newAnalysis = await beginAnalysis(chat_id, handle);
    const analysisId = newAnalysis.id;
    await updateAnalysisStatus(chat_id, analysisId, STEP_OF_ANALYSIS.PROFILE);
    const scrappedProfile = await scraper.getProfile(handle);
    console.log("ZIAD PROFILE", scrappedProfile);
    const profile = {
      avatar: profile.avatar,
      bio: profile.biography,
      followers: profile.followersCount,
      followings: profile.followingCount,
      name: profile.username,
      nickname: profile.name,
      region: profile.location,
    };
    await updateAnalysisStatus(
      chat_id,
      analysisId,
      STEP_OF_ANALYSIS.POST_COMMENTS,
    );
    const allTweets = await getAllTweets(scraper, handle);
    const comments = getTwitterComments(allTweets);
    console.log("ZIAD COMMENTS", comments);
    await saveFunnelComments(comments);
    await updateAnalysisStatus(chat_id, analysisId, STEP_OF_ANALYSIS.SEGMENTS);
    const segments = await getSegments(comments);
    const segmentsWithIcons = await getSegmentsWithIcons(segments, analysisId);
    await saveFunnelSegments(segmentsWithIcons);
    await updateAnalysisStatus(
      chat_id,
      analysisId,
      STEP_OF_ANALYSIS.CREATING_ARTIST,
    );
    const newArtist = await saveFunnelArtist(
      Funnel_Type.TWITTER,
      profile?.nickname,
      profile?.avatar,
      `https://x.com/${profile?.name}`,
      account_id,
    );
    await saveFunnelProfile({
      ...profile,
      type: "TWITTER",
      analysis_id: analysisId,
      artistId: newArtist.id,
    });
    await updateAnalysisStatus(
      chat_id,
      analysisId,
      STEP_OF_ANALYSIS.SAVING_ANALYSIS,
    );
    await trackFunnelAnalysisChat(
      address,
      handle,
      newArtist?.id,
      chat_id,
      "Twitter",
    );
    await updateAnalysisStatus(chat_id, analysisId, STEP_OF_ANALYSIS.FINISHED);
    return;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export default getTwitterAnalysis;
