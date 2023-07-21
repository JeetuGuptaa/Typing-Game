const express = require('express');
const router = express.Router();
const singleController = require('../controller/singleController');

router.get('/', (req, res) => {
    res.render('home');
})

router.post('/game', singleController.sendText);
router.get('/game', (req, res) => {
    res.send("Page you are looking for doesn't exists");
});

module.exports = router;