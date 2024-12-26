import supabase from "./serverClient.js";

const saveSpotifyAlbums = async (albums) => {
  const { data } = await supabase
    .from("spotify_analytics_albums")
    .insert(albums)
    .select("*");

  return data;
};

export default saveSpotifyAlbums;
