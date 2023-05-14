const htmlSorter = require('../services/htmlSorter');
const db = require('../services/db');

//this file is used is the entrypoint for updating the database
//it is called from index.js

//its run every time the server starts up and checks and starts out by getting the current year and date then it queries the database for every f1 races that has happened this year and to the date
//then it checks if the races have results and if they dont it adds the races that dosnt have data to an array called rounds
//then it calls the loadDoc function from htmlSorter and passes the current year and the rounds array as arguments
//the loadDoc function calls the f1 'https://www.formula1.com/en/results.html/2023/races.html' and scrapes the data and finds the rounds and links to the rounds

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

// This is an asynchronous function called "update" that fetches data from a database using two SQL queries.
// The function starts by getting the current year and initializing an empty array called "rounds".
// It then creates a SQL query that selects the name, raceId, and round from the "races" table where the date is between the first day of the current year and the current date.
// After executing the query, the function parses the resulting JSON data and iterates over the array of objects using a for loop.
// Within the loop, the function creates a temporary SQL query that selects all data from the "results" table where the raceId matches the current object's raceId.
// The temporary query is executed and its result is checked for an empty array. If it's empty, a message is logged to the console indicating that no results were found for the current race, and the current round is added to the "rounds" array. If there are results, a message is logged indicating that results were found.
// If an error occurs during the execution of the temporary query, it's caught and logged to the console.
// If an error occurs during the execution of the main query, it's caught and logged to the console.
// Finally, the function calls a function called "loadDoc" from an object called "htmlSorter" and passes the current year and the "rounds" array as arguments.
async function update(){
    const date = new Date();
    const year = date.getFullYear();
    rounds = [];

    const query = `SELECT name, raceId, round FROM races WHERE date BETWEEN DATE('${year}-01-01') AND DATE(NOW())`;
    try {
        const result = await queryFunc(query);
        const parsedResult = JSON.parse(result);
        for(let i = 0; i < parsedResult.length; i++){
            try{
                const tempQuery = `SELECT * FROM results WHERE raceId = ${parsedResult[i].raceId};`
                const tempResult = await queryFunc(tempQuery);
                if(tempResult == "[]"){
                    console.log("-------");
                    console.log(`No results found for ${parsedResult[i].name} ${parsedResult[i].round}`);
                    rounds.push(parsedResult[i].round);
                }else{
                    console.log("-------");
                    console.log(`Results found for ${parsedResult[i].name} ${parsedResult[i].round}`);
                }
            }catch(error){
                
                console.error(error);
            }
            
        }
    } catch (error) {
        console.error(error);
    }
    htmlSorter.loadDoc(year, rounds);
}

update();
