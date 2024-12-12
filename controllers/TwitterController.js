import { Scraper, SearchMode } from "agent-twitter-client";
import { MAX_TWEETS } from "../lib/consts.js";
import processTweetData from "../lib/twitter/processTweetData.js";

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

export const getAllTweets = async (req, res) => {
  const handle = req.query;
  const allTweets = new Map();
  let previousCount = 0;
  let stagnantBatches = 0;
  const MAX_STAGNANT_BATCHES = 2;

  try {
    const searchResults = scraper.searchTweets(
      `from:${handle}`,
      MAX_TWEETS,
      SearchMode.Latest,
    );

    console.log("ZIAD", searchResults)

    for await (const tweet of searchResults) {
      if (tweet && !allTweets.has(tweet.id)) {
        const processedTweet = processTweetData(tweet);
        if (processedTweet) {
          allTweets.set(tweet.id, processedTweet);

          if (allTweets.size % 100 === 0) {
            if (allTweets.size === previousCount) {
              stagnantBatches++;
              if (stagnantBatches >= MAX_STAGNANT_BATCHES) {
                break;
              }
            } else {
              stagnantBatches = 0;
            }
            previousCount = allTweets.size;
          }
        }
      }
    }
    return res.status(200).json({ tweets: Array.from(allTweets.values()) });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
