import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";

puppeteer.use(StealthPlugin());

class FacebookScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: false, // Set true in production
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    this.page = await this.browser.newPage();
  }

  async login() {
    const cookiesPath = "facebook_cookies.json";

    try {
      const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
      await this.page.setCookie(...cookies);
      console.log("✅ Loaded session cookies.");
    } catch (error) {
      console.log("⚠️ No session cookies found. Logging in...");
      await this.page.goto("https://www.facebook.com", { waitUntil: 'networkidle2' });

      await this.page.type("#email", process.env.FACEBOOK_EMAIL);
      await this.page.type("#pass", process.env.FACEBOOK_PASSWORD);
      await Promise.all([
        this.page.click("[type='submit']"),
        this.page.waitForNavigation({ waitUntil: 'networkidle2' }),
      ]);

      const cookies = await this.page.cookies();
      fs.writeFileSync(cookiesPath, JSON.stringify(cookies));
      console.log("✅ Saved session cookies.");
    }
  }

  async scrapePage(username, retries = 3) {
    try {
      await this.page.goto(`https://www.facebook.com/${username}`, { waitUntil: "networkidle2" });

      const data = await this.page.evaluate(() => ({
        name: document.querySelector('h1, [class*="profileName"]')?.innerText || "Unknown",
        profilePic: document.querySelector('img[alt*="profile"], img[src*="scontent"]')?.src || null,
        category: document.querySelector('[class*="category"]')?.innerText || "Unknown"
      }));

      console.log("✅ Scraped Data:", data);
      return data;
    } catch (error) {
      if (retries > 0) {
        console.warn(`🔄 Retrying (${3 - retries}/3)...`);
        return this.scrapePage(username, retries - 1);
      }
      console.error("❌ Scraping failed:", error);
      return null;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export default FacebookScraper;
