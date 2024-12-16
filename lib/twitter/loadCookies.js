import fs from "fs/promises";

const loadCookies = async (scraper, cookies_path) => {
  try {
    const cookiesData = await fs.readFile(cookies_path, "utf-8");
    const cookies = JSON.parse(cookiesData);
    console.log("ZIAD COOKIE DATA", cookies[2], cookies[7], cookies[8], cookies);
    const cookiesArray = Array.from(cookies);
    console.log("ZIAD COOKIE DATA", cookiesArray);
    await scraper.setCookies(cookiesArray[cookiesArray.length - 1]);
    return true;
  } catch (error) {
    console.log("ZIAD ERROR", error);
    return false;
  }
};

export default loadCookies;
