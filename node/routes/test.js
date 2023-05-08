const express = require('express');
const router = express.Router();
const testLogic = require('../logic/testLogic');

//Define routes for /test/f1

//route /test/:year/races
router.get('/:year/races', async (req, res) => {
    const year = req.params.year;
    try {
        const file = await testLogic(year);
        res.send(file);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;