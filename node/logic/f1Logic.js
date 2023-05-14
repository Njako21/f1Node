const db = require('../services/db');
const format = require('../services/formatting');

/*  note to self: the callback function is the function that is passed into the function as a parameter
    the callback function is then called in the function
    the callback function is used to return the result of the function
    the callback function is used to return an error if the function fails

    note not routes but functions that are called by the routes
*/

/*  Queries the database for races in a given year and returns the formatted result
    route /api/f1/year/:year
    example /api/f1/year/2022
*/
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

/*   Queries the database for the results of a given grand prix in a given year and returns the formatted result
     route /api/f1/year/:year/grand_prix/:grand_prix
     example /api/f1/year/2022/grand_prix/Bahrain_Grand_Prix
*/
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


/*   Queries the database for the results of a given driver in a given year and returns the formatted result
     route /api/f1/year/:year/driver/:driver
     example /api/f1/year/2022/driver/Max_Verstappen
*/

function yearDriver(year, driver, callback){
    if (!year || !driver) {
        return callback('Year or driver parameter missing');
    }
    firstName = driver.split("_")[0];
    lastName = driver.split("_")[1];

    const query = `
    SELECT r.round, r.name, r.date, res.positionText, res.positionOrder, res.grid, status.status
    FROM races r
    INNER JOIN results res ON r.raceId = res.raceId
    INNER JOIN drivers d ON res.driverId = d.driverId
    INNER JOIN status ON res.statusId = status.statusId
    WHERE d.forename = "${firstName}" AND d.surname = "${lastName}" AND YEAR(r.date) = ${year}
    ORDER BY r.round ASC;
    `;

    let finishes = [];
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return callback('Error executing query');
        } else {
            for (let i = 0; i < results.length; i++) {
                finishes.push(results[i].positionOrder);
            }
            results.push(finishes);
            return callback(null, format(year, results, "driver year"));
        }
    });
}

/*   Queries the database for the results of all drivers in a given year and returns the formatted result
     route /api/f1/year/:year/drivers
     example /api/f1/year/2022/drivers
*/

function yearDrivers(year, callback){
    if (!year) {
        return callback('Year or driver parameter missing');
    }

    const query = `
    SELECT DISTINCT d.forename, d.surname, d.code, d.driverRef
    FROM drivers d
    JOIN results r ON d.driverId = r.driverId
    JOIN races ra ON ra.raceId = r.raceId
    WHERE YEAR(ra.date) = ${year}
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return callback('Error executing query');
        } else {
            return callback(null, format(year, results, "drivers year"));
        }
    });
}

/* Queries the database for the results of a given driver and returns the formatted result
   route /api/f1/driver/:driver
   example /api/f1/driver/Max_Verstappen
*/

function driver(driver, callback){
    if (!driver) {
        return callback('driver parameter missing');
    }
    firstName = driver.split("_")[0];
    lastName = driver.split("_")[1];
    const query = `
    SELECT r.positionOrder, r.positionText, r.grid, s.status, ra.round, ra.name, ra.year 
    FROM results r
    JOIN drivers d ON d.driverId = r.driverId
    JOIN races ra ON ra.raceId = r.raceId
    JOIN status s ON s.statusId = r.statusId
    WHERE d.forename = "${firstName}" AND d.surname = "${lastName}"
    `;

    let finishes = [];
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return callback('Error executing query');
        } else {
            for (let i = 0; i < results.length; i++) {
                finishes.push(results[i].positionOrder);
            }
            results.push(finishes);
            return callback(null, format(0000, results, `Driver ${driver}`));
        }
    });
}

/* Queries the database for the years a given driver was active and returns the formatted result
    route /api/f1/driver/:driver/active
    example /api/f1/driver/Max_Verstappen/active
*/

function yearsActive(driver, callback){
    if (!driver) {
        return callback('driver parameter missing');
    }
    firstName = driver.split("_")[0];
    lastName = driver.split("_")[1];
    const query = `
    SELECT DISTINCT year 
    FROM races 
    JOIN results ON results.raceId = races.raceId 
    JOIN drivers ON drivers.driverId = results.driverId 
    WHERE drivers.forename = '${firstName}' AND drivers.surname = '${lastName}';
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return callback('Error executing query');
        } else {
            return callback(null, format(0000, results, `Driver ${driver} years active`));
        }
    });
}

/* Queries the database for the points systems and returns the formatted result
    route /api/f1/pointsSystems
    example /api/f1/pointsSystems
*/

function pointsSystems(callback){
    const query = `
    SELECT * FROM pointsystem;
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return callback('Error executing query');
        } else {
            return callback(null, format(0000, results, `Points Systems`));
        }
    });
}

/* Queries the database for the points systems and returns the formatted result
    route /api/f1/pointsSystem/:pointsSystem
    example /api/f1/pointsSystem/1
*/

function pointsSystemWValue(pointsSystem, callback){
    const query = `
    SELECT p.*, (SELECT timePeriode FROM pointsystem WHERE pointSystemId = ${pointsSystem}) as timePeriode
    FROM points p
    WHERE p.pointSystemId = ${pointsSystem}
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return callback('Error executing query');
        } else {
            return callback(null, format(results[0].timePeriode, results, `Points System ${pointsSystem}`));
        }
    });
}

function allPointsSystems(callback){
    const query = `
    SELECT ps.*, p.position, p.points
    FROM pointsystem ps
    JOIN points p ON p.pointSystemId = ps.pointSystemId;
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return callback('Error executing query');
        } else {
            const timePeriodes = {};
            let lastTimePeriode = results[0].timePeriode;
            let object = {};
            for (let i = 0; i < results.length; i++) {
                let timePeriode = results[i].timePeriode;
                if (timePeriode != lastTimePeriode) {
                    timePeriodes[lastTimePeriode] = object;
                    object = {};
                    object[results[i].position] = results[i].points;
                    lastTimePeriode = timePeriode;
                }else{
                    object[results[i].position] = results[i].points;
                }
            }

            return callback(null, format(`${results[0].timePeriode} - ${results[results.length-1].timePeriode}`, timePeriodes, `all points Systems`));
        }
    });
}


module.exports = {
  yearRaces:            yearRaces,
  grandPrix:            grandPrix,
  yearDriver:           yearDriver,
  yearDrivers:          yearDrivers,
  driver:               driver,
  yearsActive:          yearsActive,
  pointsSystems:        pointsSystems,
  pointsSystemWValue:   pointsSystemWValue,
  allPointsSystems:     allPointsSystems
};