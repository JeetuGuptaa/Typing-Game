const express = require('express');
const port = 8000;
const app = express();
const path = require('path');
const db = require('./config/mongoose');

app.use(express.urlencoded({ extended: false }));

app.use(express.static('./assets'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const router = require('./routes');
app.use('/', router);
app.listen(port, (err) => {
    if(err){
        console.log(`Error in starting Server, ${err}`);
    }else{
        console.log(`Server Started Successfully at port ${port}`);
    }
});