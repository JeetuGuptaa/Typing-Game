const express = require('express');
const port = 8000;
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: false }));

app.use(express.static('./assets'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res)=>{
    res.render('home');
})

app.listen(port, (err) => {
    if(err){
        console.log(`Error in starting Server, ${err}`);
    }else{
        console.log(`Server Started Successfully at port ${port}`);
    }
});