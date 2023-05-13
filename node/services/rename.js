const db = require('../services/db');
const htmlSorter = require('../services/htmlSorter');

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

async function update(){
    const date = new Date();
    const year = date.getFullYear();
    rounds = [];

    const query = `SELECT name, raceId, round FROM races WHERE date BETWEEN DATE('${year}-01-01') AND DATE(NOW())`;
    console.log("-------");
    try {
        const result = await queryFunc(query);
        const parsedResult = JSON.parse(result);
        for(let i = 0; i < parsedResult.length; i++){
            try{
                const tempQuery = `SELECT * FROM results WHERE raceId = ${parsedResult[i].raceId};`
                const tempResult = await queryFunc(tempQuery);
                if(tempResult == "[]"){
                    console.log(`No results found for ${parsedResult[i].name} ${parsedResult[i].round}`);
                    rounds.push(parsedResult[i].round);
                    console.log("-------");
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