import { Scraper, SearchMode } from "agent-twitter-client";
import { MAX_TWEETS } from "../lib/consts.js";
import processTweetData from "../lib/twitter/processTweetData.js";
import path from "path";
import saveCookies from "../lib/twitter/saveCookies.js";
import loadCookies from "../lib/twitter/loadCookies.js";

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
  const { handle } = req.query;
  const allTweets = new Map();
  let previousCount = 0;
  let stagnantBatches = 0;
  const MAX_STAGNANT_BATCHES = 2;
  const username = process.env.TWITTER_USERNAME;
  const password = process.env.TWITTER_PASSWORD;
  const email = process.env.TWITTER_EMAIL;

  const cookies_path = path.join(
    "/",
    "cookies",
    `${username}_cookies.json`,
  );

  try {
    const isLoadedCookies = await loadCookies(scraper, cookies_path);
    console.log("ZIAD IS LOADED COOKIES", isLoadedCookies);
    const isLoggedIn = await scraper.isLoggedIn();
    if (!isLoadedCookies || !isLoggedIn) {
      console.log("ZIAD LOGGED IN NEWLY");
      await scraper.login(username, password, email);
      const isNewLoggedIn = await scraper.isLoggedIn();
      if (isNewLoggedIn) await saveCookies(scraper, cookies_path);
    }

    const searchResults = scraper.searchTweets(
      `to:${handle}`,
      MAX_TWEETS,
      SearchMode.Latest,
    );

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
