const searchArtist = async (handle, accessToken) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(`artist:${handle}`)}&type=artist`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    console.log("ZIAD", response);
    if (!response.ok) return { error: true };
    const data = await response.json();

    return data.artists.items[0];
  } catch (error) {
    return { error };
  }
};

export default searchArtist;
