const Text = require('../models/text');
const Lobby = require('../models/lobby');

module.exports.sendText = async (req, res) => {
    try{
        if(req.body.mode === "single"){
            const paragraph = await Text.find({difficulty : req.body.difficulty});
            const randomIndex = Math.floor(Math.random() * paragraph.length);
            const text = paragraph[randomIndex].paragraph;
            res.render('game', {
                paragraph : text,
                name : req.body.name,
                uID : req.body.uID
            });
        }else{
            res.render('multiGame',{
                name : req.body.name,
                uID : req.body.uID,
                difficulty : req.body.difficulty
            });
        }
        
    }catch(err){
        console.log(`Error in Sending Paragraph, ${err}`);
    }
}