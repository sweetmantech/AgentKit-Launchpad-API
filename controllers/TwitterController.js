import { Scraper, SearchMode } from "agent-twitter-client";
import { MAX_TWEETS } from "../lib/consts.js";
import processTweetData from "../lib/twitter/processTweetData.js";
import path from "path";
import fs from 'fs';

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
    "cookies",
    `${username}_cookies.json`,
  );

  try {
    const cookies = await scraper.getCookies();
    console.log("ZIAD COOKIES", cookies)
    await scraper.setCookies(cookies);
    const isLoggedIn = await scraper.isLoggedIn();
    console.log("ZIAD HERE", isLoggedIn);
    if (!isLoggedIn) {
      await scraper.login(username, password, email);
      const isNewLoggedIn = await scraper.isLoggedIn();
      if (isNewLoggedIn) {
        const cookies = await scraper.getCookies();
        fs.mkdir(path.dirname(cookies_path), { recursive: true });
        fs.writeFile(cookies_path, JSON.stringify(cookies));
      }
    }
      

    const newCookies = await scraper.getCookies();
    console.log("ZIAD COOKIES", newCookies)

    return res.json({status: true})
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
    return res.status(200).json({
      tweets: Array.from(allTweets.values()),
      isAlreadyLoggedIn: isLoadedCookies && isLoggedIn,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
