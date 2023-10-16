async function sentimentArray(phrases) {

    function sentiment(phrase) {

        const positiveWords = ['positive', 'good', 'joyful', 'happy', 'love', 'great', 'amazing'];
        const negativeWords = ['negative', 'bad', 'sad', 'hate', 'terrible', 'awful'];
    
        const words = phrase.split(" ");
    
        let sentimentScore = 0;
        for (const word of words) {
          if (positiveWords.includes(word)) {
            sentimentScore++;
          } else if (negativeWords.includes(word)) {
            sentimentScore--;
          }
        }
    
        let sentiment;
        if (sentimentScore > 0) {
          sentiment = "positive";
        } else if (sentimentScore < 0) {
          sentiment = "negative";
        } else {
          sentiment = "neutral";
        }
        return sentiment;
    }

    const sentiments = [];

    const cleanArray = [];

for(let i = 0; i< phrases.length; i +=2) {
  if(phrases[i] !== '') {
    cleanArray.push(
      phrases[i],
    );
  }
}

  for (const phrase of cleanArray) {
    const sentimentValue = sentiment(phrase);
    sentiments.push(sentimentValue);
  }

  return sentiments;
}
module.exports = sentimentArray

