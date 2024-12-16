import fs from "fs/promises";

const loadCookies = async (scraper, cookies_path) => {
  try {
    console.log("ZIAD PATH COOKIES", cookies_path);
    const isAccessable = await fs.access(cookies_path);
    if (!isAccessable) return false;
    console.log("ZIAD ACCESSABLE COOKIES PATH");
    const cookiesData = await fs.readFile(cookies_path, "utf-8");
    const cookies = JSON.parse(cookiesData);
    await scraper.setCookies(cookies);
    console.log("LOAD COOKIE SUCCESS");
    return true;
  } catch (error) {
    console.log("ZIAD ERROR", error);
    return false;
  }
};

export default loadCookies;
