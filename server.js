const express = require("express");
const app = express();
const port = 3000;
const scrape = require("./scripts/scraper");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const ejs = require("ejs");
const scrapeImage = require("./scripts/imgRec");
const sentimentArray = require("./scripts/sentimentAnalysis");
const countWordsMultiple = require("./scripts/countWords");

app.use(bodyParser.json());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  textFromImage = "";
  jsonData = [];

  res.render("index", { jsonData, textFromImage });
});

var values = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.post("/scrape", async (req, res) => {
  const url = req.body.url;

  if (!url) {
    return res
      .status(400)
      .json({ error: "URL is required in the request body" });
  }

  const html = await scrape(url);

  const $ = cheerio.load(html);

  const titleValues = [];
  const descValues = [];
  const imgUrlValues = [];
  const hrefValues = [];
  const urlForDisplay = url.substring(0, url.length - 1);
  let sentimentValues = [];
  let wordsCountValues = [];

  const imgSrc = $("a>img");
  imgSrc.each((index, element) => {
    const src = $(element).attr("src");
    imgUrlValues[index] = src;
  });

  const spansHref = $("a");
  spansHref.each((index, element) => {
    const href = $(element).attr("href");
    hrefValues[index] = href;
  });

  const filteredHrefValues = hrefValues.reduce((accumulator, currentValue) => {
    if (!accumulator.includes(currentValue)) {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);

  const spans = $("a");
  spans.each((index, element) => {
    const spanText = $(element).text();
    titleValues[index] = spanText;
  });

  const divs = $("div.group>div");

  divs.each((index, element) => {
    const divText = $(element).next().text();
    descValues[index] = divText;
  });

  sentimentValues = await sentimentArray(descValues);

  const titleObject = [];

  for (let i = 1; i < titleValues.length; i += 2) {
    if (titleValues[i] !== "") {
      titleObject.push({
        title: titleValues[i],
      });
    }
  }

  const descObject = [];

  for (let i = 0; i < descValues.length; i += 2) {
    if (descValues[i] !== "") {
      descObject.push({
        short_description: descValues[i],
      });
    }
  }

  const urlsForWordCounts = filteredHrefValues.map(
    (filteredHrefValues) => urlForDisplay + filteredHrefValues
  );

  wordsCountValues = await countWordsMultiple(urlsForWordCounts);
  console.log(wordsCountValues);

  for (let i = 0; i < titleObject.length; i++) {
    values.push({
      title: titleObject[i].title,
      short_description: descObject[i].short_description,
      image: urlForDisplay + imgUrlValues,
      href: urlForDisplay + filteredHrefValues[i],
      sentiment: sentimentValues[i],
      words: wordsCountValues[i],
    });
  }

  const serializedJsonData = JSON.stringify(values, null, 2);

  res.render("index", { jsonData: serializedJsonData });
});

app.post("/scrapeimage", async (req, res) => {
  const url = req.body.url;

  if (!url) {
    return res
      .status(400)
      .json({ error: "URL is required in the request body" });
  }
  const textFromImage = await scrapeImage(url);

  res.render("index", { textFromImage });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
