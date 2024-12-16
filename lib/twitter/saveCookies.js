import path from "path";
import fs from "fs/promises";

const saveCookies = async (scraper, cookies_path) => {
  try {
    const cookies = await scraper.getCookies();
    await fs.mkdir(path.dirname(cookies_path), { recursive: true });
    await fs.writeFile(cookies_path, JSON.stringify(cookies));
  } catch (error) {
    return { error };
  }
};

export default saveCookies;
