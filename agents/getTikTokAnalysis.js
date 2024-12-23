import { Funnel_Type } from "../lib/funnels.js";
import getSegments from "../lib/getSegments.js";
import getSegmentsWithIcons from "../lib/getSegmentsWithIcons.js";
import uploadPfpToIpfs from "../lib/ipfs/uploadPfpToIpfs.js";
import { STEP_OF_ANALYSIS } from "../lib/step.js";
import beginAnalysis from "../lib/supabase/beginAnalysis.js";
import completeAnalysis from "../lib/supabase/completeAnalysis.js";
import saveFunnelArtist from "../lib/supabase/saveFunnelArtist.js";
import saveFunnelComments from "../lib/supabase/saveFunnelComments.js";
import saveFunnelProfile from "../lib/supabase/saveFunnelProfile.js";
import getProfile from "../lib/tiktok/getProfile.js";
import getProfileDatasetId from "../lib/tiktok/getProfileDatasetId.js";
import getVideoComments from "../lib/tiktok/getVideoComments.js";

const getTikTokAnalysis = async (handle, chat_id, account_id) => {
  try {
    console.log("ZIAD START");
    const newAnalysis = await beginAnalysis(chat_id);
    const analysisId = newAnalysis.id;
    console.log("ZIAD NEW ANALYSIS", newAnalysis);
    const profileDatasetId = await getProfileDatasetId(handle);
    console.log("ZIAD PROFILE DATASET ID", profileDatasetId);
    global.io.emit(`${chat_id}`, { status: STEP_OF_ANALYSIS.PROFILE });
    const profile = await getProfile(profileDatasetId);
    console.log("ZIAD PROFILE", profile);
    const avatar = await uploadPfpToIpfs(profile.avatar);
    const analytics_profile = await saveFunnelProfile({
      ...profile,
      avatar,
      type: "TIKTOK",
      analysis_id: analysisId,
    });
    console.log("ZIAD ANALYTICS PROFILE", analytics_profile);
    const videoComments = await getVideoComments(
      profile?.videos,
      chat_id,
      analysisId,
    );
    await saveFunnelComments(videoComments);
    console.log("ZIAD AVATAR", avatar);
    global.io.emit(`${chat_id}`, { status: STEP_OF_ANALYSIS.SEGMENTS });
    const segments = await getSegments(videoComments);
    const segmentsWithIcons = await getSegmentsWithIcons(segments);
    console.log("ZIAD SEGMENTS", segmentsWithIcons);
    global.io.emit(`${chat_id}`, { status: STEP_OF_ANALYSIS.CREATING_ARTIST });
    const artistId = await saveFunnelArtist(
      Funnel_Type.TIKTOK,
      profile?.nickname,
      profile?.avatar,
      `https://tiktok.com/@${profile?.name}`,
      account_id,
    );
    console.log("ZIAD ARTIST ID", artistId);
    global.io.emit(`${chat_id}`, { status: STEP_OF_ANALYSIS.SAVING_ANALYSIS });
    await completeAnalysis(analysisId);
    return;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export default getTikTokAnalysis;
