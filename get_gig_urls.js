const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const clUrl = "https://albany.craigslist.org/";
const gigUrl = "d/computer-gigs/search/cpg";

axios.get(clUrl).then((response) => {
    
    const links = [clUrl + gigUrl]; // make sure to save main craigslist link

    const $ = cheerio.load(response.data);
    const ul = $("ul.acitem");
    const items = $(ul[0]).find("li.s a");
    items.each((index, item) => {
        const link = 'https:' + $(item).attr("href") + gigUrl ;
        // console.log(link);
        // console.log("https:" + $(item).attr("href"));
        links.push(link);
    });

    fs.writeFileSync("gig_urls.txt", links.join("\n"));
    console.log("File Created");

}).catch((err) => {
    console.log(err);
});
