const express = require('express');
const router = express.Router();
const {nanoid} = require('nanoid');
const singleController = require('../controller/singleController');

router.get('/', (req, res) => {
    if(req.query.name){
        res.render('home', {
            uID : req.query.uID,
            name : req.query.name
        })
    }else{
        const uID = nanoid(8);
        req.uID = uID;
        res.render('home',
        {
            uID : uID
        });
    }
})

router.post('/game', singleController.sendText);
router.get('/game', (req, res) => {
    res.send("Page you are looking for doesn't exists");
});

module.exports = router;