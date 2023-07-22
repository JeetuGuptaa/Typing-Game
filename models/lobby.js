const mongoose = require('mongoose');

const lobbySchema = new mongoose.Schema({
    lid : {
        type : String,
        required : true,
        unique : true,
    },
    status : {
        type : String,
        required : true
    },
    users: [
        {
          uid: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
        },
      ],
    difficulty : {
        type : String,
        required : true
    }
},
{
    timestamps : true
});

const Lobby = mongoose.model('Lobby', lobbySchema);
module.exports = Lobby;