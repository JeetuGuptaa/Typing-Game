const express = require('express');
const port = 8000;
const app = express();
const path = require('path');
const db = require('./config/mongoose');
const Text = require('./models/text');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
let easy = [];
let medium = [];
let hard = [];
let playing = [];
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('play', (data) => {
        console.log(data)
        console.log(`your name is ${data.name}`)
        console.log(`Your uID is ${data.uID}`)
        console.log(`Your difficulty is ${data.difficulty}`)
        if(data.difficulty == 'easy'){
            easy.push(data);
        }else if(data.difficulty == 'medium'){
            medium.push(data);
        }else{
            hard.push(data);
        }

        console.log(`Length of easy = ${easy.length}`)
        if(easy.length >= 3){

            let obj = {
                p1 : {
                    name : easy[0].name,
                    uID : easy[0].uID
                },
                p2 : {
                    name : easy[1].name,
                    uID : easy[1].uID
                },
                p3 : {
                    name : easy[2].name,
                    uID : easy[2].uID
                },
                status : 'inactive'
            }
            easy.splice(0,3);
            const sendObj = async function(obj){
                try{
                    const paragraph = await Text.find({difficulty : 'easy'});
                    const randomIndex = Math.floor(Math.random() * paragraph.length);
                    const text = paragraph[randomIndex].paragraph;
                    obj.text = text;
                    playing.push(obj);
                    
                    io.emit('find', {allPlayers : playing} )
                    console.log("sent");
                }catch(err){
                    console.log("Easy ParaFetching error", err)
                }
            }

            sendObj(obj);

        }else if(medium.length >= 3){
            //fetch paragraph
            //send playing obj
        }else if(hard.length >= 3){
            //fetch paragraph
            //send playing obj
        }

        socket.on('update', (data) => {
            console.log("player udpdate", data);
            io.emit('progress', data);
        })
    });

    socket.on('found', (obj) => {
        const index = playing.findIndex((element) => element.p1.uID === obj.p1.uID);
        playing[index].status = 'active';
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
  });

app.use(express.urlencoded({ extended: false }));

app.use(express.static('./assets'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const router = require('./routes');
app.use('/', router);
server.listen(port, (err) => {
    if(err){
        console.log(`Error in starting Server, ${err}`);
    }else{
        console.log(`Server Started Successfully at port ${port}`);
    }
});