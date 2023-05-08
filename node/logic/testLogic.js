const format = require('../services/formatting');
const fs = require("fs");

function yearRaces(year) {
    return new Promise((resolve, reject) => {
        if (!year) {
            reject('year parameter missing');
        }

        if (year >= 2024 || year <= 1950) {
            resolve(format(year, "", "races"));
        }

        fs.readFile(__dirname + '/../resources/2023races.txt', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const file = JSON.parse(data);
                resolve(file);
            }
        });
    });
}

module.exports = yearRaces;