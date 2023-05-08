const db = require('../services/db');
const format = require('../services/formatting');


// Queries the database for races in a given year and returns the formatted result
// route /api/f1/:year
// example /api/f1/2022
function yearRaces(year, callback) {
  if (!year) {
    return callback('Year parameter missing');
  }

  const query = `SELECT name, date FROM races WHERE year = ${year};`;
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      callback('Error executing query');
    } else {
      callback(null, format(year, results, "races"));
    }
  });
}

// Queries the database for the results of a given grand prix in a given year and returns the formatted result
// route /api/f1/:year/:grand_prix
// example /api/f1/2022/Bahrain_Grand_Prix
function grandPrix(year, grand_prix, callback){
    if (!year || !grand_prix) {
        return callback('Year parameter missing');
    }
    grand_prix = grand_prix.replace(/_/g, ' ');
    
    const query = `
        SELECT drivers.code, drivers.forename, drivers.surname, results.positionText, results.positionOrder, results.grid, status.status 
        FROM races 
        INNER JOIN results ON races.raceId = results.raceId 
        INNER JOIN drivers ON results.driverId = drivers.driverId 
        INNER JOIN status ON results.statusId = status.statusId 
        WHERE races.year = ${year} AND races.name = "${grand_prix}" 
        ORDER BY results.positionOrder ASC;`;
    
    db.query(query, (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          callback('Error executing query');
        } else {
          callback(null, format(year, results, "grand_prix"));
        }
      });
}

module.exports = {
  yearRaces: yearRaces,
  grandPrix: grandPrix
};