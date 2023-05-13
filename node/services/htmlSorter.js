const { text } = require('body-parser');
const wr = require('../services/websiteRequester');
const cheerio = require('cheerio')
function loadDoc(year, rounds) {
    wr.request(`https://www.formula1.com/en/results.html/${year}/races.html`)
    .then((html) => {
        console.log("done loading");
        let $ = cheerio.load(html)

        var races = ""; //An array of JSON objects that will hold everything
        $('div.resultsarchive-filter-wrap').each(function() { //Loop for each paragraph
        //Now let's take the content of the paragraph and put it into a json object
            races = $(this).html() //Add data to the main jsonObject    
        });

        $ = cheerio.load(races)
        
        racesLinks = [];
        counter = 0;
        $('li.resultsarchive-filter-item a').each(function() {
            const href = $(this).attr('href');
            for (num in rounds){
                if(counter == rounds[num]){
                    racesLinks.push(href);
                }
            }
            counter += 1;
        });
        loadrace(racesLinks[1]);
        for(num in racesLinks){
            //loadrace(racesLinks[num]);
        }
    })
    .catch((error) => {
        console.error(error);
    });
}

function loadrace(link){
    const baseurl = `https://www.formula1.com/${link}`
    console.log(baseurl);
    wr.request(baseurl)
    .then(handleHtml)
    .catch((error) => {
        console.error(error);
    });
}

function handleHtml(html) {
    console.log("done loading");
    let $ = cheerio.load(html);
    console.log("loaded");
    let data = {};
    $('tr').each(function () {
      let line = {};
      $(this)
        .find('td')
        .each(function (index) {
          let text = $(this).text().trim();
          if (index === 0) {
            console.log(text);
          } else if (index === 1) {
            line.points = text;
          } else if (index === 2) {
            line.number = text;
          } else if (index === 3) {
            let driverName = text.split('\n')[3].trim().split(' ');
            line.driver = {
              first_name: driverName[0],
              last_name: driverName[1],
            };
          } else if (index === 4) {
            line.team = text;
          } else if (index === 5) {
            line.laps = text;
          } else if (index === 6) {
            line.time = text;
          } else if (index === 7) {
            line.grid = text;
          }
        });
      if (line.driver) {
        let driverKey = `${line.driver.first_name} ${line.driver.last_name}`;
        if (!data[driverKey]) {
          data[driverKey] = [];
        }
        data[driverKey].push(line);
      }
    });
    console.log(data);
    // Process the data as needed
  }
module.exports = {
    loadDoc
};