import { Funnel_Type } from "../lib/funnels.js";
import getSegments from "../lib/getSegments.js";
import getSegmentsWithIcons from "../lib/getSegmentsWithIcons.js";
import uploadPfpToIpfs from "../lib/ipfs/uploadPfpToIpfs.js";
import { STEP_OF_ANALYSIS } from "../lib/step.js";
import saveFunnelAnalysis from "../lib/supabase/saveFunnelAnalysis.js";
import saveFunnelArtist from "../lib/supabase/saveFunnelArtist.js";
import getProfile from "../lib/tiktok/getProfile.js";
import getProfileDatasetId from "../lib/tiktok/getProfileDatasetId.js";
import getVideoComments from "../lib/tiktok/getVideoComments.js";

const getTikTokAnalysis = async (handle, chat_id, account_id) => {
  try {
    console.log("ZIAD START");
    const profileDatasetId = await getProfileDatasetId(handle);
    console.log("ZIAD PROFILE DATASET ID", profileDatasetId);
    global.io.emit(`${chat_id}`, { status: STEP_OF_ANALYSIS.PROFILE });
    const profile = await getProfile(profileDatasetId);
    console.log("ZIAD PROFILE", profile);
    const videoComments = await getVideoComments(profile?.videos, chat_id);
    const avatar = await uploadPfpToIpfs(profile.avatar);
    console.log("ZIAD AVATAR", avatar);
    const profileWithComments = {
      ...profile,
      avatar,
      videos: videoComments.videos,
      total_video_comments_count: videoComments.total_video_comments_count,
    };
    global.io.emit(`${chat_id}`, { status: STEP_OF_ANALYSIS.SEGMENTS });
    const segments = await getSegments(profileWithComments);
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
    console.log("ZIAD", artistId);
    global.io.emit(`${chat_id}`, { status: STEP_OF_ANALYSIS.SAVING_ANALYSIS });
    const analysis = {
      ...profileWithComments,
      segments: [...segmentsWithIcons],
      chat_id,
      artistId,
    };
    await saveFunnelAnalysis(analysis);
    return;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export default getTikTokAnalysis;
