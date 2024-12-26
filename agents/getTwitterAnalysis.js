import { Scraper } from "agent-twitter-client";
import getAllTweets from "../lib/twitter/getAllTweets.js";
import { STEP_OF_ANALYSIS } from "../lib/step.js";

const scraper = new Scraper();

export const getProfile = async (req, res) => {
  const { handle } = req.query;

  try {
    const profile = await scraper.getProfile(handle);
    return res.status(200).json({ profile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

const getTwitterAnalysis = async (handle, chat_id, account_id, address) => {
  try {
    const newAnalysis = await beginAnalysis(chat_id, handle);
    const analysisId = newAnalysis.id;
    await updateAnalysisStatus(chat_id, analysisId, STEP_OF_ANALYSIS.PROFILE);
    const profile = await scraper.getProfile(handle);
    console.log("ZIAD PROFILE", profile);
    
    // const avatar = await uploadPfpToIpfs(profile.avatar);
    // const allTweets = await getAllTweets(scraper, handle);
    // const comments =  allTweets?.map((tweet) => ({
    //   comment: tweet.text,
    //   created_at: new Date(tweet.createdAt).getTime(),
    //   username: tweet.username,
    // }));
    // await saveFunnelComments(videoComments);
    // await updateAnalysisStatus(chat_id, analysisId, STEP_OF_ANALYSIS.SEGMENTS);
    // const segments = await getSegments(videoComments);
    // const segmentsWithIcons = await getSegmentsWithIcons(segments, analysisId);
    // await saveFunnelSegments(segmentsWithIcons);
    // await updateAnalysisStatus(
    //   chat_id,
    //   analysisId,
    //   STEP_OF_ANALYSIS.CREATING_ARTIST,
    // );
    // const newArtist = await saveFunnelArtist(
    //   Funnel_Type.TIKTOK,
    //   profile?.nickname,
    //   avatar,
    //   `https://tiktok.com/@${profile?.name}`,
    //   account_id,
    // );
    // await saveFunnelProfile({
    //   ...profile,
    //   avatar,
    //   type: "TIKTOK",
    //   analysis_id: analysisId,
    //   artistId: newArtist.id,
    // });
    // await updateAnalysisStatus(
    //   chat_id,
    //   analysisId,
    //   STEP_OF_ANALYSIS.SAVING_ANALYSIS,
    // );
    // await trackFunnelAnalysisChat(
    //   address,
    //   handle,
    //   newArtist?.id,
    //   chat_id,
    //   "TikTok",
    // );
    // await updateAnalysisStatus(chat_id, analysisId, STEP_OF_ANALYSIS.FINISHED);
    return;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export default getTwitterAnalysis;
