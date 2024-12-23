import createSocialLink from "./createSocialLink.js";

const updateArtistSocials = async (
  artistId,
  tiktok_url,
  youtube_url,
  apple_url,
  instagram_url,
  twitter_url,
  spotify_url,
) => {
  const socialMediaLinks = [
    { type: "TIKTOK", url: tiktok_url },
    { type: "YOUTUBE", url: youtube_url },
    { type: "APPLE", url: apple_url },
    { type: "INSTAGRAM", url: instagram_url },
    { type: "TWITTER", url: twitter_url },
    { type: "SPOTIFY", url: spotify_url },
  ];

  await Promise.all(
    socialMediaLinks.map(({ type, url }) =>
      createSocialLink(artistId, type, url),
    ),
  );
};

export default updateArtistSocials;
