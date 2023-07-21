const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/TypingGame')
.then(()=> console.log("MongoDB connected"))
.catch((err) => console.log(`Error in connection to MongoDb, ${err}`));