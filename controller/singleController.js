const Text = require('../models/text');

module.exports.sendText = async (req, res) => {
    try{
        console.log(req.body);
        const paragraph = await Text.find({difficulty : req.body.difficulty});
        console.log(paragraph);
        const randomIndex = Math.floor(Math.random() * paragraph.length);
        const text = paragraph[randomIndex].paragraph;
        res.render('game', {paragraph : text});
    }catch(err){
        console.log(`Error in Sending Paragraph, ${err}`);
    }
}