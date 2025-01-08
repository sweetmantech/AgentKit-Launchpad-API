import getSegments from "../lib/getSegments.js";
import getSegmentsWithIcons from "../lib/getSegmentsWithIcons.js";
import uploadPfpToIpfs from "../lib/ipfs/uploadPfpToIpfs.js";
import getProfile from "../lib/instagram/getProfile.js";
import getProfileDatasetId from "../lib/instagram/getProfileDatasetId.js";
import getPostComments from "../lib/instagram/getPostComments.js";

export const run_instagram_agent = async (req, res) => {
  const { handle } = req.query;
  try {
    const profileDatasetId = await getProfileDatasetId(handle);
    const accountData = await getProfile(profileDatasetId);
    const profile = accountData?.profile;
    const latestPosts = accountData?.latestPosts;
    const avatar = await uploadPfpToIpfs(profile.avatar);
    const postComments = await getPostComments(latestPosts);
    const segments = await getSegments(postComments);
    const segmentsWithIcons = await getSegmentsWithIcons(segments);

    return res.status(200).json({
      success: true,
      data: {
        ...profile,
        avatar,
        segments: segmentsWithIcons,
        comments: postComments.formattedData,
        apifyDatasetId: postComments.datasetId,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
