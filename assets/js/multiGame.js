const name = document.getElementById('name');
const uID = document.getElementById('uID');
const difficulty = document.getElementById('difficulty');
let player1 = {}
let player2 = {}

const socket = io();
socket.emit("play", {
    name : name.value.trim(),
    uID : uID.value.trim(),
    difficulty : difficulty.value.trim(),
})

socket.on("find", (data) => {
    console.log(data);
    const allPlayingarray = data.allPlayers;
    const findObj = allPlayingarray.find((obj) => (obj.p1.uID == uID.value || obj.p2.uID == uID.value ||obj.p3.uID == uID.value));
    if(findObj){
        if(findObj.status = "inactive"){
            console.log("starting game")
            startGame(findObj.text);
            socket.emit('found', findObj);

            
            if(findObj.p1.uID == uID.value){
                player1.uID = findObj.p2.uID;
                player1.name = findObj.p2.name;
                player2.uID = findObj.p3.uID;
                player2.name = findObj.p3.name;
            }else if(findObj.p2.uID == uID.value){
                player1.uID = findObj.p1.uID;
                player1.name = findObj.p1.name;
                player2.uID = findObj.p3.uID;
                player2.name = findObj.p3.name;
            }else{
                player1.uID = findObj.p1.uID;
                player1.name = findObj.p1.name;
                player2.uID = findObj.p2.uID;
                player2.name = findObj.p2.name;
            }
            document.getElementById('player1_name').innerText = player1.name;
            document.getElementById('player2_name').innerText = player2.name;


            console.log(player1)
            console.log(player2)

            
        }
    }
});



const startGame = (text_to_display) => {
    const inputText = text_to_display;
    const displayTextElement = document.getElementById("displayed-text")
    const inputElement = document.getElementById("typingProgress");
    const Accuracy = document.getElementById("Accuracy");
    const Word = document.getElementById("word");
    const Time = document.getElementById("time");

    const finish = (message)=>{
        document.getElementById('content').style.display = 'none';
        document.getElementById('gameResultSection').style.display = 'block';

        document.getElementById('resultAccuracy').innerText = Accuracy.innerText;
        if(Time.innerText === '0'){
            document.getElementById('resultTime').innerText = "Time Exceeded";
        }else if(message == "Not Completed"){
            document.getElementById('resultTime').innerText = message;
        }else{
            document.getElementById('resultTime').innerText = 120 - parseInt(Time.innerText) + " seconds";
        }
        document.getElementById('resultSpeed').innerText = Word.innerText;
    }

    let incorrect = 0;
    let word = 0;
    let prevIncorrect = 0;
    let timeTaken = 0;

    inputElement.addEventListener('keydown', (event) => {
        const key = event.key; 
        if (key === 'Backspace') {
        event.preventDefault(); 
        }
    });

    inputElement.addEventListener('input', (event)=>{
        incorrect = 0;
        prevIncorrect = 0;
        word = 0;
        const displaySpans = document.querySelectorAll('span.charSpan');
        const typedValue = inputElement.value.split('');
        for(let i = 0; i<displaySpans.length; i++){
            if( i >= typedValue.length){
                displaySpans[i].classList.remove('correct');
                displaySpans[i].classList.remove('incorrect');
                displaySpans[i].classList.remove('underline');
            }
            else if(typedValue[i] === displaySpans[i].innerText){
                if(typedValue[i] === " "){
                    if(prevIncorrect == incorrect){
                        word = word + 1;
                    }
                    prevIncorrect = incorrect;
                }
                
                displaySpans[i].classList.add('correct');
                displaySpans[i].classList.remove('incorrect');
                displaySpans[i].classList.remove('underline');
            }else{
                incorrect += 1;
                displaySpans[i].classList.remove('correct');
                displaySpans[i].classList.add('incorrect');
                displaySpans[i].classList.remove('underline');
            }

            if(i === typedValue.length && i < displaySpans.length){
                displaySpans[i].classList.add('underline');
            }
            if(typedValue.length > 0){
                let accuracy = Math.floor(((typedValue.length - incorrect) * 100)/typedValue.length);
                Accuracy.innerText = `${accuracy}%`
            }
            else{
                Accuracy.innerText = `100%`
            }  
        }
        if(timeTaken == 0) Word.innerText = `0WPM`;
        else Word.innerText = `${Math.floor((word * 60)/timeTaken)}WPM`;

        let accToSend, speedTosend, progressTosend;
        if(typedValue.length > 0){
            accToSend = Math.floor(((typedValue.length - incorrect) * 100)/typedValue.length);
        }else{
            accToSend = 100;
        }
        speedTosend = Math.floor((word * 60)/timeTaken);
        progressTosend = Math.floor((typedValue.length * 100)/inputText.length);
        socket.emit('update', {
            player_id : uID.value,
            speed : speedTosend,
            completed : progressTosend,
            accuracy : accToSend
        });

        if(inputText.length === typedValue.length){
            clearInterval(id);
            finish();
        }
    
    })

    function displayText(){
        displayTextElement.innerHTML = null;
        inputText.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.innerText = char;
            charSpan.classList.add('charSpan')
            displayTextElement.appendChild(charSpan);
        });
        inputElement.value = null;
    }

    displayText();

    inputElement.addEventListener('paste', (event) => {
        event.preventDefault();
        alert("Pasting isn't Allowed")
    });

    document.addEventListener('selectstart', (event) => {
        event.preventDefault();
    });

    const time = Date.now();
    var id = setInterval(()=>{
        const curTime = Date.now();
        timeTaken = Math.floor((curTime - time)/1000);
        if(timeTaken >= 120){
            clearInterval(id);
            Time.innerText = 120 - timeTaken;
            finish();
        }
        Time.innerText = 120 - timeTaken;
    }, 1000);

    const submitBtn = document.getElementById('end-game');
    submitBtn.addEventListener('click', ()=>{
        clearInterval(id);
        finish("Not Completed");
    });
}

socket.on('progress', (data) => {
    if(data.player_id == player1.uID){
        document.getElementById('player1_accuracy').innerText = data.accuracy;
        document.getElementById('player1_speed').innerText = data.speed;
        document.getElementById('player1_completed').innerText = data.completed;
    }else if(data.player_id == player2.uID){
        document.getElementById('player2_accuracy').innerText = data.accuracy;
        document.getElementById('player2_speed').innerText = data.speed;
        document.getElementById('player2_completed').innerText = data.completed;
    }
});