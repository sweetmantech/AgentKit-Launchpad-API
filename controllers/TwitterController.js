import { Scraper, SearchMode } from "agent-twitter-client";

const scraper = new Scraper();

export const getProfile = async (req, res) => {
  const { handle } = req.query;

  console.log("ZIAD HERE", handle);
  try {
    const profile = await scraper.getProfile(handle);
    console.log("ZIAD", profile);
    return profile;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};
