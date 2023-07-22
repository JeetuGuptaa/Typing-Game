const inputText = document.getElementById("textContainer").value;
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
    const displaySpans = document.querySelectorAll('span');
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