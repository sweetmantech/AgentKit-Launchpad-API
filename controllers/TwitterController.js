import { Scraper, SearchMode } from "agent-twitter-client";

const scraper = new Scraper();

export const getProfile = async (req, res) => {
  const { handle } = req.query;

  try {
    const profile = await scraper.getProfile(handle);
    return res.status(200).json({ profile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};
