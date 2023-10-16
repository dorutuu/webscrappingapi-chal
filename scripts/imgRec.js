const T = require("tesseract.js");

async function scrapeImage(url) {
  var textData;

  await T.recognize(url, "eng", { logger: (e) => console.log(e) }).then(
    ({ data: { text } }) => {
      textData = text;
      console.log('intra aici');
      
    }
  );

  


  return textData
}

module.exports = scrapeImage


