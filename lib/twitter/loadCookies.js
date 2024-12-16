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
    const cookie = cookies[cookies.length - 1]
    console.log("ZIAD COOKIE", cookie);
    await scraper.setCookies(cookie);
    return true;
  } catch (error) {
    console.log("ZIAD ERROR", error);
    return false;
  }
};

export default loadCookies;
