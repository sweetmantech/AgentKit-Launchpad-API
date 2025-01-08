import getSegments from "../lib/getSegments.js";
import getSegmentsWithIcons from "../lib/getSegmentsWithIcons.js";
import uploadPfpToIpfs from "../lib/ipfs/uploadPfpToIpfs.js";
import getProfile from "../lib/instagram/getProfile.js";
import getProfileDatasetId from "../lib/instagram/getProfileDatasetId.js";
import getPostComments from "../lib/instagram/getPostComments.js";
import beginAnalysis from "../lib/supabase/beginAnalysis.js";
import { v4 as uuidV4 } from "uuid";
import saveFunnelProfile from "../lib/supabase/saveFunnelProfile.js";
import getPostCommentsDatasetId from "../lib/instagram/getPostCommentsDatasetId.js";
import updateAnalysisStatus from "../lib/supabase/updateAnalysisStatus.js";
import saveFunnelSegments from "../lib/supabase/saveFunnelSegments.js";
import { Funnel_Type } from "../lib/funnels.js";
import { STEP_OF_ANALYSIS } from "../lib/step.js";
import saveFunnelComments from "../lib/supabase/saveFunnelComments.js";

export const run_instagram_agent = async (req, res) => {
  const { handle } = req.query;
  const pilotId = uuidV4();
  const newAnalysis = await beginAnalysis(
    pilotId,
    handle,
    Funnel_Type.INSTAGRAM,
  );
  const analysisId = newAnalysis.id;
  try {
    const profileDatasetId = await getProfileDatasetId(handle);
    await updateAnalysisStatus(
      pilotId,
      analysisId,
      Funnel_Type.INSTAGRAM,
      STEP_OF_ANALYSIS.PROFILE,
    );
    const accountData = await getProfile(profileDatasetId);
    const profile = accountData?.profile;
    const latestPosts = accountData?.latestPosts;
    const avatar = await uploadPfpToIpfs(profile.avatar);
    res.status(200).json({ pilotId });
    await saveFunnelProfile({
      ...profile,
      avatar,
      type: "INSTAGRAM",
      analysis_id: analysisId,
      artistId: newArtist.id,
    });
    const commentDatasetId = await getPostCommentsDatasetId(latestPosts);
    console.log("ZIAD commentDatasetId", commentDatasetId)
    const postComments = await getPostComments(
      commentDatasetId,
      pilotId,
      analysisId,
    );
    await saveFunnelComments(postComments.formattedData);
    await updateAnalysisStatus(
      pilotId,
      analysisId,
      Funnel_Type.INSTAGRAM,
      STEP_OF_ANALYSIS.SEGMENTS,
    );
    const segments = await getSegments(postComments);
    const segmentsWithIcons = await getSegmentsWithIcons(segments, analysisId);
    await saveFunnelSegments(segmentsWithIcons);
    await updateAnalysisStatus(
      pilotId,
      analysisId,
      Funnel_Type.INSTAGRAM,
      STEP_OF_ANALYSIS.SAVING_ANALYSIS,
    );
    await updateAnalysisStatus(
      pilotId,
      analysisId,
      Funnel_Type.INSTAGRAM,
      STEP_OF_ANALYSIS.FINISHED,
    );
    return
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
