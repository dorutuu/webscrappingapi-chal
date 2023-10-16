const puppeteer = require('puppeteer');


async function countWords(url) {

  const browser = await puppeteer.launch({
    headless: 'new'
  });

  const page = await browser.newPage();
  await page.goto(url);

  const body = await page.content();
  const bodyText = body.replace(/<.+?\/?>/g, '');

  const words = bodyText.split(' ');
 
  await browser.close();
  return words.length;
}


async function countWordsMultiple(urls) {

  const wordCounts = [];

  
  for (const url of urls) {
    const wordCount = await countWords(url);
    wordCounts.push(wordCount);
  }

 
  return wordCounts;
}


module.exports = countWordsMultiple;