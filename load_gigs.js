const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

(async () => {
  const gigUrlFile = "gig_urls.txt";
  const searchRe = /developer|web|site|javascript|php|coding|computer|html|css/;
  const possibleGigs = [];

  //load the gig_urls.txt

  const gigUrls = fs.readFileSync(gigUrlFile, "utf8");
  const urls = gigUrls.split("\n");

  //open the url

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`Finding gigs in ${url}`);

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      // find a.result-title

      const gigs = $("a.result-title");

      gigs.each((index, gig) => {
        const gigText = $(gig).html();
        const gigUrl = $(gig).attr("href");

        if (gigText.search(searchRe) !== -1) {
          possibleGigs.push({ gigTitle: gigText, url: gigUrl });
        }
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  if (possibleGigs.length !== 0) {
    console.log(`Found ${possibleGigs.length} possible gigs`);
    writeGigs(possibleGigs);
  } else {
    console.log("No Gigs to write?");
  }

})();

function writeGigs(gigData) {
  fs.writeFileSync("possible_gigs.json", JSON.stringify(gigData));
  // fs.writeFileSync("possible_gigs.txt", gigData.join("\n"));
}