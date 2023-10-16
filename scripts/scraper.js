const puppeteer = require("puppeteer");

async function scraper(url) {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();
  try {
    await page.goto(url);

    const html = await page.content();

    await browser.close();

    return html;
  } catch (error) {
    console.error(error);
    await browser.close();
    return null;
  }
}

module.exports = scraper;
