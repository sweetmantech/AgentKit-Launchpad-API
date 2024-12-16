import fs from "fs/promises";

const loadCookies = async (scraper, cookies_path) => {
  try {
    if (await fs.access(cookies_path).catch(() => false)) {
      const cookiesData = await fs.readFile(cookies_path, "utf-8");
      const cookies = JSON.parse(cookiesData);
      await scraper.setCookies(cookies);
      console.log("LOAD COOKIE SUCCESS");
      return true;
    }
  } catch (error) {
    console.log("ZIAD ERROR", error);
    return false;
  }
};

export default loadCookies;
