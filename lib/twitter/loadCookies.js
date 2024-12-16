import fs from "fs/promises";

const loadCookies = async (scraper) => {
  try {
    const cookies = await scraper.getCookies();
    await scraper.setCookies(cookies);
    return true;
  } catch (error) {
    console.log("ZIAD ERROR HERE", error);
    return false;
  }
};

export default loadCookies;
