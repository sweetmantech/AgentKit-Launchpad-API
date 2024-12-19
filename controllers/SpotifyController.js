import searchArtist from "../lib/spotify/searchArtist.js";
import getAccessToken from "../lib/supabase/getAccessToken.js";

export const getProfile = async (req, res) => {
  const { handle } = req.query;
  const accessToken = await getAccessToken();
  const artist = await searchArtist(handle, accessToken);
  if (artist?.error) return res.status(500).json({ error: artist?.error });
  try {
    return res.status(200).json({
      profile: {
        name: artist.name,
        image: artist.images?.[0]?.url || "",
        fans: artist.followers.total,
        id: artist.id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};
