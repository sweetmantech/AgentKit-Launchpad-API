import searchArtist from "../lib/spotify/searchArtist.js";
import getAccessToken from "../lib/supabase/getAccessToken.js";

export const getProfile = async (req, res) => {
  const { handle } = req.query;
  const accessToken = await getAccessToken();
  console.log("ZIAD", accessToken);
  const artist = await searchArtist(handle, accessToken);
  console.log("ZIAD", artist);

  try {
    return res.status(200).json({ profile: {} });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};
