import fs from "fs/promises";

const loadCookies = async (scraper, cookies_path) => {
  try {
    const cookiesData = await fs.readFile(cookies_path, "utf-8");
    const cookies = JSON.parse(cookiesData);
    console.log(
      "ZIAD COOKIE DATA",
      cookies[2],
      cookies[7],
      cookies[8],
      cookies,
    );
    console.log("ZIAD IS ARRAY", Array.isArray(cookies));
    const cookieValues = Object.values(cookies);
    console.log("ZIAD COOKIE VALUES", cookieValues);
    await scraper.setCookies(cookiesArray[cookiesArray.length - 1]);
    return true;
  } catch (error) {
    console.log("ZIAD ERROR", error);
    return false;
  }
};

export default loadCookies;
