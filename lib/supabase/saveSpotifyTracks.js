import supabase from "./serverClient.js";

const saveSpotifyTracks = async (tracks) => {
  const { data } = await supabase
    .from("spotify_analytics_tracks")
    .insert(tracks)
    .select("*");

  return data;
};

export default saveSpotifyTracks;
