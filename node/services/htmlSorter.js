const wr = require('../services/websiteRequester');
const cheerio = require('cheerio')
const db = require('../services/db');

// Executes a given SQL query and returns a promise that resolves with the query results as a JSON string. If the query fails, the promise is rejected with an error message.
function queryFunc (query) {
  return new Promise((resolve, reject) => {
      db.query(query, (error, results) => {
          if (error) {
              console.error('Error executing query:', error);
              reject('Error executing query');
          } else {
              const jsonResults = JSON.stringify(results);
              resolve(jsonResults);
          }
      });
  });
}

// This function loads the HTML for the race results page for the given year, 
// scrapes the relevant race links from it based on the given round numbers, 
// and then calls the loadrace() function for each race link with the corresponding 
// year and round number.
function loadDoc(year, rounds) {
    if (rounds.length == 0){
        console.log("No rounds to load");
        return;
    }

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
        for(num in racesLinks){
            loadrace(racesLinks[num], year, rounds[num]);
        }
    })
    .catch((error) => {
        console.error(error);
    });
}
/**
 * Loads the race and qualifying data for a given year and round.
 * @param {string} link - The relative link to the race result page.
 * @param {number} year - The year of the race.
 * @param {number} round - The round number of the race.
 */
function loadrace(link, year, round) {
  console.log(year, round, "loading");

  const raceLink = `https://www.formula1.com/${link}`
  const qualiLink = `https://www.formula1.com/${link}`.replace('/race-result.html', '/qualifying.html')
  
  wr.request(qualiLink)
  .then((html) => handleQualiData(html, year, round))
  .then(() => wr.request(raceLink))
  .then((html) => handleRaceData(html, year, round))
  .catch((error) => {
    console.error(error);
  });
}

// This function takes in HTML data for a specific race and processes it to extract and store relevant race data in a MySQL database.
// The function parses the HTML using the Cheerio library and then creates a JavaScript object with the relevant data.
// The function then generates a SQL query using this object and inserts it into the database using the queryFunc function.
function handleRaceData(html, year, round) {
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
          if (index === 1) {
            line.pos = text;
          } else if (index === 2) {
            line.number = text;
          } else if (index === 3) {

            splitted = text.split('\n');
            let name = {}
            name["First Name"] = splitted[0].trim().split(' ')[0];
            let lastNameParts = splitted[1].trim().split(' ');
            if (lastNameParts.length === 1) {
              name["Last Name"] = lastNameParts[0];
            } else {
              name["Last Name"] = lastNameParts.slice(0).join(' ');
            }
            if (splitted[3].trim() === "") {
              name["short"] = splitted[4].trim();
            }else{
              name["short"] = splitted[3].trim();
            }
            let jsonName = JSON.stringify(name);
            let parsedName = JSON.parse(jsonName);

            line.driver = parsedName;

          } else if (index === 4) {
            line.car = text;
          } else if (index === 5) {
            line.laps = text;
          } else if (index === 6) {
            line.time = text;
          } else if (index === 7) {
            line.points = text;
          }
        });
      if (line.driver) {
        let driver = line.driver["First Name"] + "_" + line.driver["Last Name"].replace(" ", "_");
        let driverKey = driver;
        if (!data[driverKey]) {
          data[driverKey] = [];
        }
        data[driverKey].push(line);
      }
    });
    // Process the data as needed
    for (driver in data){
      if (!Number.isInteger(parseInt(data[driver][0].pos))) {
        data[driver][0].pos = 20;
      }
      let raceQuery = 
  `INSERT INTO \`results\` (
    \`resultId\`, 
    \`raceId\`, 
    \`driverId\`, 
    \`constructorId\`, 
    \`number\`, 
    \`grid\`, 
    \`position\`, 
    \`positionText\`, 
    \`positionOrder\`, 
    \`points\`, 
    \`laps\`, 
    \`time\`, 
    \`statusId\`
  ) VALUES (
    NULL, 
    (
      SELECT \`raceId\`
      FROM \`races\`
      WHERE \`round\` = ${round} AND \`year\` = ${year}
    ), 
    (
      SELECT \`driverId\` d
      FROM \`drivers\`
      WHERE \`forename\` = '${data[driver][0].driver["First Name"]}'
        AND \`surname\` = '${data[driver][0].driver["Last Name"]}'
    ), 
    (
      SELECT \`constructorId\`
      FROM \`constructors\`
      WHERE \`name\` LIKE '${data[driver][0].car.split(' ')[0]}%' LIMIT 1
    ), 
    ${data[driver][0].number}, 
    (
      SELECT \`position\` 
      FROM \`qualifying\`
      WHERE \`raceId\` = (
        SELECT \`raceId\`
        FROM \`races\`
        WHERE \`round\` = ${round} AND \`year\` = ${year}
      ) AND \`driverId\` = (
        SELECT \`driverId\`
        FROM \`drivers\`
        WHERE \`forename\` = '${data[driver][0].driver["First Name"]}'
          AND \`surname\` = '${data[driver][0].driver["Last Name"]}'
      ) LIMIT 1
    ), 
    '${data[driver][0].pos}', 
    '${data[driver][0].pos}', 
    '${data[driver][0].pos}', 
    ${data[driver][0].points}, 
    ${data[driver][0].laps}, 
    '${data[driver][0].time}', 
    '0'
  )`;
      queryFunc(raceQuery);
    }
}

// This function handles the qualifying data from an HTML page.
// It uses Cheerio to load and parse the HTML, and extracts the relevant data
// for each driver, such as their position, name, car, and lap times.
// It then processes the data as needed and generates an SQL query to insert
// the data into a database table.
// The function takes in the following parameters:
// - html: the HTML string to parse
// - year: the year of the race
// - round: the round number of the race
// It returns nothing.
function handleQualiData(html, year, round) {
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
        if (index === 1) {
          line.pos = text;
        } else if (index === 2) {
          line.number = text;
        } else if (index === 3) {

          splitted = text.split('\n');
          let name = {}
          name["First Name"] = splitted[0].trim().split(' ')[0];
          let lastNameParts = splitted[1].trim().split(' ');
          if (lastNameParts.length === 1) {
            name["Last Name"] = lastNameParts[0];
          } else {
            name["Last Name"] = lastNameParts.slice(0).join(' ');
          }
          if (splitted[3].trim() === "") {
            name["short"] = splitted[4].trim();
          }else{
            name["short"] = splitted[3].trim();
          }
          let jsonName = JSON.stringify(name);
          let parsedName = JSON.parse(jsonName);

          line.driver = parsedName;

        } else if (index === 4) {
          line.car = text;
        } else if (index === 5) {
          line.q1 = text;
        } else if (index === 6) {
          line.q2 = text;
        } else if (index === 7) {
          line.q3 = text;
        } else if (index === 8) {
          line.laps = text;
        }
      });
    if (line.driver) {
      let driver = line.driver["First Name"] + "_" + line.driver["Last Name"].replace(" ", "_");
      let driverKey = driver;
      if (!data[driverKey]) {
        data[driverKey] = [];
      }
      data[driverKey].push(line);
    }

  });
  // Process the data as needed
  for (driver in data){ 
    if (!Number.isInteger(parseInt(data[driver][0].pos))) {
      data[driver][0].pos = 20;
    }

    console.log(data[driver][0].driver["First Name"], data[driver][0].driver["Last Name"]);
    let insertQualifyingQuery = `
    INSERT INTO \`qualifying\` (\`qualifyId\`, \`raceId\`, \`driverId\`, \`constructorId\`, \`number\`, \`position\`, \`q1\`, \`q2\`, \`q3\`)
    VALUES (
    NULL,
    (
      SELECT \`raceId\`
      FROM \`races\`
      WHERE \`round\` = ${round} AND \`year\` = ${year}
    ),
    (
      SELECT \`driverId\`
      FROM \`drivers\`
      WHERE \`forename\` = '${data[driver][0].driver["First Name"]}'
        AND \`surname\` = '${data[driver][0].driver["Last Name"]}'
    ),
    (
      SELECT \`constructorId\`
      FROM \`constructors\`
      WHERE \`name\` LIKE '${data[driver][0].car.split(' ')[0]}%' LIMIT 1
    ),
    ${data[driver][0].number},
    ${data[driver][0].pos},
    '${data[driver][0].q1}',
    '${data[driver][0].q2}',
    '${data[driver][0].q3}'
  );
  `;
  queryFunc(insertQualifyingQuery);
  }
}
module.exports = {
    loadDoc
};