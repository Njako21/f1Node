const express = require('express');
const router = express.Router();
const testLogic = require('../logic/testLogic');

//Define routes for /test/f1

//route /test/:year/races
router.get('/:year/races', async (req, res) => {
    const year = req.params.year;
    try {
        const file = await testLogic.yearRaces(year);
        res.send(file);
    } catch (error) {
        res.status(400).send(error);
    }
});

//route /test/:year/:grand_prix
router.get('/:year/:grand_prix', async (req, res) => {
    const year = req.params.year;
    const grand_prix = req.params.grand_prix;
    try {
        const file = await testLogic.grandPrix(year, grand_prix);
        res.send(file);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;