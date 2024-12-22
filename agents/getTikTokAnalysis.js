import getSegments from "../lib/getSegments.js";
import getSegmentsWithIcons from "../lib/getSegmentsWithIcons.js";
import uploadPfpToIpfs from "../lib/ipfs/uploadPfpToIpfs.js";
import { STEP_OF_ANALYSIS } from "../lib/step.js";
import getProfile from "../lib/tiktok/getProfile.js";
import getProfileDatasetId from "../lib/tiktok/getProfileDatasetId.js";
import getVideoComments from "../lib/tiktok/getVideoComments.js";

const getTikTokAnalysis = async (handle, chat_id) => {
  try {
    const profileDatasetId = await getProfileDatasetId(handle);
    console.log("ZIAD PROFILE DATASET ID");
    global.io.emit(`${chat_id}` , { status: STEP_OF_ANALYSIS.PROFILE }) ;
    const profile = await getProfile(profileDatasetId);
    console.log("ZIAD PROFILE");
    const videoComments = await getVideoComments(profile?.videos, chat_id);
    const avatar = await uploadPfpToIpfs(profile.avatar);
    console.log("ZIAD AVATAR", avatar);
    const profileWithComments = {
      ...profile,
      avatar,
      videos: videoComments.videos,
      total_video_comments_count: videoComments.total_video_comments_count,
    };
    global.io.emit(`${chat_id}` , { status: STEP_OF_ANALYSIS.SEGMENTS }) ;
    const segments = await getSegments(profileWithComments) ;
    const segmentsWithIcons = await getSegmentsWithIcons(segments) ;
    console.log("ZIAD SEGMENTS", segmentsWithIcons) ;
    return
  } catch(error) {
    throw new Error(error)
  }
}

export default getTikTokAnalysis