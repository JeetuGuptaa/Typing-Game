const mongoose = require('mongoose');

const textSchema = new mongoose.Schema({
    difficulty : {
        type : String,
        required : true,
    },
    paragraph : {
        type : String,
        required : true
    }
});

const Text = mongoose.model('Text', textSchema);
module.exports = Text;