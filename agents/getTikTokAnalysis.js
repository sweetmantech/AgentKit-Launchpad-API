import { Funnel_Type } from "../lib/funnels.js";
import getSegments from "../lib/getSegments.js";
import getSegmentsWithIcons from "../lib/getSegmentsWithIcons.js";
import uploadPfpToIpfs from "../lib/ipfs/uploadPfpToIpfs.js";
import trackFunnelAnalysisChat from "../lib/stack/trackFunnelAnalysisChat.js";
import { STEP_OF_ANALYSIS } from "../lib/step.js";
import beginAnalysis from "../lib/supabase/beginAnalysis.js";
import saveFunnelArtist from "../lib/supabase/saveFunnelArtist.js";
import saveFunnelComments from "../lib/supabase/saveFunnelComments.js";
import saveFunnelProfile from "../lib/supabase/saveFunnelProfile.js";
import saveFunnelSegments from "../lib/supabase/saveFunnelSegments.js";
import updateAnalysisStatus from "../lib/supabase/updateAnalysisStatus.js";
import getProfile from "../lib/tiktok/getProfile.js";
import getProfileDatasetId from "../lib/tiktok/getProfileDatasetId.js";
import getVideoComments from "../lib/tiktok/getVideoComments.js";

const getTikTokAnalysis = async (handle, chat_id, account_id, address) => {
  try {
    const newAnalysis = await beginAnalysis(chat_id, handle);
    const analysisId = newAnalysis.id;
    const profileDatasetId = await getProfileDatasetId(handle);
    await updateAnalysisStatus(chat_id, analysisId, STEP_OF_ANALYSIS.PROFILE);
    const accountData = await getProfile(profileDatasetId);
    const profile = accountData?.profile?.[0];
    const videoUrls = accountData?.videoUrls;
    const avatar = await uploadPfpToIpfs(profile.avatar);
    const videoComments = await getVideoComments(
      videoUrls,
      chat_id,
      analysisId,
    );
    await saveFunnelComments(videoComments);
    await updateAnalysisStatus(chat_id, analysisId, STEP_OF_ANALYSIS.SEGMENTS);
    const segments = await getSegments(videoComments);
    const segmentsWithIcons = await getSegmentsWithIcons(segments, analysisId);
    await saveFunnelSegments(segmentsWithIcons);
    await updateAnalysisStatus(
      chat_id,
      analysisId,
      STEP_OF_ANALYSIS.CREATING_ARTIST,
    );
    const newArtist = await saveFunnelArtist(
      Funnel_Type.TIKTOK,
      profile?.nickname,
      avatar,
      `https://tiktok.com/@${profile?.name}`,
      account_id,
    );
    await saveFunnelProfile({
      ...profile,
      avatar,
      type: "TIKTOK",
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
      "TikTok",
    );
    await updateAnalysisStatus(chat_id, analysisId, STEP_OF_ANALYSIS.FINISHED);
    return;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export default getTikTokAnalysis;
