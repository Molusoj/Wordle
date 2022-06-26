var height = 6;
var width = 5;

var row = 0;
var col = 0;

var gameOver = false;

var lives = 6;
var _tries = 1;
var totalScore = 0;
var scorePerGame
var numOfPlays = 0;
var highScore = 0;

var canPlay = false;

var answer;

var GameOverTable;
var CompletedWordleTxt;
var livesText;
var scoreText;
var highestScoreTxt;
var GameOverBoard;

async function shareImage(src) {
    const response = await fetch(src);
    const blob = await response.blob();
    const filesArray = [
        new File(
            [blob],
            'meme.jpg',
            {
                type: "image/jpeg",
                lastModified: new Date().getTime()
            }
        )
    ];
    const shareData = {
        text: "Play with me",
        title: "Wordle Grand Prix",
        url: "https://afamuefuna.github.io/Wordle/Index.html",
        files: filesArray,
        
    };
    navigator.share(shareData);
}
    
function shareText(){
    const shareData = {
        text: "Play with me",
        title: "Wordle Grand Prix",
        url: "https://afamuefuna.github.io/Wordle/Index.html",
    };
    
    navigator.share(shareData)
}

function share() {

    let node = document.getElementById('Game-over');

    domtoimage.toPng(node)
        .then(function (dataUrl) {
            let img = new Image();
            img.src = dataUrl + "";
            
            shareImage(img.src)
        });
}

const startConfetti = () => {
    setTimeout(function() {
        confetti.start()
        confetti.speed = 10;
    }, 200); // 1000 is time that after 1 second start the confetti ( 1000 = 1 sec)
};

//  for stopping the confetti 

const stopConfetti = () => {
    setTimeout(function() {
        confetti.stop()

        answer.innerText = " "
        let overlay = document.getElementById('overlay')
        answer.style.opacity = '0'
        
    }, 3000); // 5000 is time that after 5 second stop the confetti ( 5000 = 5 sec)
};

function revealGridSampleResult(target, color){
    anime({
        endDelay: 1000,
        easing: 'easeInOutQuad',
        targets: target,
        backgroundColor: color,
        color: "#ffffff",
        borderColor: color
    })
}

function clearInstruction(center_overlay, BG_overlay){
    anime({
        targets: center_overlay,
        easing: 'linear',
        opacity: 0,
        translateY: 0,
        complete:function () {
            BG_overlay.style.opacity = "0"
        }
    })
    canPlay = true;
    center_overlay.style.zIndex = '0'
    BG_overlay.style.zIndex = '0'
}

var resultDetail = {
    'word':"",
    'score':"",
    'tries':""
}

var resultDetailList = [resultDetail]

window.onload = function (){
    readTextFile("sgb-words.txt")
    initialize();

    CompletedWordleTxt = document.getElementById('Completed-wordle');
    highestScoreTxt = document.getElementById('Highest-score')
    GameOverTable = document.getElementById('Game-over-table')
    GameOverBoard = document.getElementById('Game-over')
    let center_overlay = document.getElementById('Center-overlay');
    let BG_overlay = document.getElementById('BG-overlay');
    let sample_present = document.getElementById('sample-tile-present')
    let sample_wrong = document.getElementById('sample-tile-absent')
    let sample_correct = document.getElementById('sample-tile-correct')
    answer = document.getElementById('Answer');
    
    anime({
        targets: center_overlay,
        easing: 'linear',
        opacity: 1,
        translateY: 20,
        duration: 1000,
        complete:function () {
            revealGridSampleResult(sample_wrong, "#787c7e")
            revealGridSampleResult(sample_present, "#99ccff")
            revealGridSampleResult(sample_correct, "#333399")
            BG_overlay.style.opacity = "1"
        }
    })

    document.getElementById('BG-overlay').onclick = function() {
        clearInstruction(center_overlay, BG_overlay)
    }
    document.getElementById('Center-overlay').onclick = function () {
        clearInstruction(center_overlay, BG_overlay)
    }
    document.getElementById('Share').onclick = function () {
        shareText()
    }
}

function updateTable(){
    for (let i = numOfPlays; i <= resultDetailList.length -1; i++){
        var newTable = document.createElement('tr')
        newTable.setAttribute('class', 'row-' + i)

        var td = document.createElement('td');
        var td1 = document.createElement('td');
        var td2 = document.createElement('td');

        td.textContent = resultDetailList[i].word;
        td1.textContent = resultDetailList[i].tries;
        td2.textContent = resultDetailList[i].score;
        
        newTable.appendChild(td);
        newTable.appendChild(td1);
        newTable.appendChild(td2);

        GameOverTable.appendChild(newTable);
    }
}

const logFileText = async file => {
    const response = await fetch(file)
    const text = await response.text()
    console.log(text)
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest()
    rawFile.open("GET", file, true);
    rawFile.send(null);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0)
            {
                var allText = rawFile.responseText;
                var textByLine = allText.split('\n')
                
                wordList = textByLine;
                guessList = textByLine;
                word = wordList[Math.floor(Math.random()*wordList.length)].toUpperCase();
                guessList = guessList.concat(wordList);
                console.log(word)
            }
        }
    }

}

function addMoreTries(){
    console.log("row " + row)
    for (let r = height; r < height + 5; r++){
        for (let c = 0; c < width; c++){
            let tile = document.createElement("span")
            tile.id = r.toString() + "-" + c.toString()
            tile.classList.add("tile")
            tile.innerText = " ";
            document.getElementById("board").appendChild(tile)
        }
    }
    height = height + 5;
    livesText = document.getElementById("lives").innerText = "Tries: " + (--lives).toString();
    lives = lives +5;
    livesText = document.getElementById("lives").innerText = "Tries: " + (lives).toString();
}

let keyboard =
    [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
    ]

function initialize(){
    for (let r = 0; r < height; r++){
        
        for (let c = 0; c < width; c++){ 
            let tile = document.createElement("span")
            tile.id = r.toString() + "-" + c.toString()
            tile.classList.add("tile")
            tile.innerText = " ";
            document.getElementById("board").appendChild(tile)
        }
    }
    
    for (let i = 0; i<keyboard.length; i++){
        let currRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");
        
        for (let j=0; j < currRow.length; j++){
            let keyTile = document.createElement("div");
            let key = currRow[j];
            keyTile.innerText = key;
            if(key == "Enter"){
                keyTile.id = "Enter";
            }else if(key == "⌫"){
                keyTile.id = "Backspace"
            }else if("A" <= key && key <= "Z"){
                keyTile.id = "Key" + key;
            }
            keyTile.addEventListener("click", processKey);
            
            if(key == "Enter"){
                keyTile.classList.add("enter-key-tile");
            }
            else if(key == "⌫"){
                keyTile.classList.add("enter-key-tile");
            }
            else{
                keyTile.classList.add("key-tile")
            }
            keyboardRow.appendChild(keyTile)
        }
        document.getElementById("keyboardParent").appendChild(keyboardRow)
    }
    document.addEventListener("keydown", (e ) => {
        processInput(e);
    })
}

function processKey(){
    if(!canPlay){
        return;
    }
    console.log("clicked")
    e = {"code" : this.id};
    processInput(e);
}

function onOverlay() {
    document.getElementById("overlay").style.display = "block";
}

function offOverLay() {
    document.getElementById("overlay").style.display = "none";
}

function answerShake(){
    answer.style.opacity = '1'
    const xMax = 16;
    var answerReveal = anime({
        targets: answer,
        easing: 'easeInOutSine',
        duration: 550,
        translateX: [
            {
                value: xMax * -1,
            },
            {
                value: xMax,
            },
            {
                value: xMax/-2,
            },
            {
                value: xMax/2,
            },
            {
                value: 0
            }
        ],
        complete: function () {
            var answerClose = anime({
                targets: answer,
                easing: 'easeInOutSine',
                opacity: '0'
            });
        }
    });
}

 function processInput(e){
     if(!canPlay){
         return;
     }
    if(gameOver) return;
    
    if("KeyA" <= e.code && e.code <= "KeyZ"){
        console.log("entering texts")
        if(col < width){
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            anime({
                endDelay: 50,
                targets: currTile,
                scale: 1.05,
            })
            if(currTile.innerText == ""){
                console.log(e.code[3])
                currTile.innerText = e.code[3];
                col+=1
            }
            currTile.style.borderColor = "#D7D7D7FF"
        }
    }
    else if(e.code == "Backspace"){
        if(0 < col && col <= width){
            console.log(col)
            col -=1;
        }
        let currTile = document.getElementById(row.toString()+'-'+ col.toString());
        currTile.innerText = " ";
        anime({
            endDelay: 50,
            targets: currTile,
            scale: 1,
        })
        currTile.style.borderColor = "#919191FF"
        
        if(answer.innerText == "Word does not exist"){
            answer.innerText = " "
            answer.style.opacity = '0'
        }
    }
    else if(e.code == "Enter"){
        if(col == 5){
            update();
        }

    }
    
    if(!gameOver && row==height){
        gameOver = true;
        GameOverBoard.style.zIndex = '2'

        livesText = document.getElementById("lives").innerText = "Lives: " + lives.toString();
        answer.innerText = word;
        let overlay = document.getElementById('overlay')
        answer.style.opacity = "1";
        answer.style.color = "#FFD700"

        anime({
            targets: GameOverBoard,
            easing: 'linear',
            opacity: 1,
            duration: 1000
        })
    }
}

function cleanKey(){
    for (let i = 0; i<keyboard.length; i++){
        let currRow = keyboard[i];

        for (let j=0; j < currRow.length; j++){
            let key = currRow[j];
            if(key == "Enter"){
                
            }else if(key == "⌫"){
                
            }else if("A" <= key && key <= "Z"){
                let keyID = "Key"+key;
                document.getElementById(keyID).classList.remove("correct");
                document.getElementById(keyID).classList.remove("present");
                document.getElementById(keyID).classList.remove("absent");
                let mKey = document.getElementById(keyID)
                anime({
                    endDelay: 1000,
                    easing: 'easeInOutQuad',
                    targets: mKey,
                    backgroundColor: "#d3d6da",
                    color: "#000000",
                })
            }
        }
    }
}

function  reverseString(str) {
    return str.split("").reverse().join("");
}

function updateScore(){
    scoreText = document.getElementById("score");
    
    switch(_tries) {
        case 1:
            scorePerGame = 100;
            totalScore = totalScore + 100;
            scoreText.innerText = "Score: " + totalScore + "pts";
            break;
        case 2:
            scorePerGame = 70;
            totalScore = totalScore + 70;
            scoreText.innerText = "Score: " + totalScore + "pts";
            break;
        case 3:
            scorePerGame = 50;
            totalScore = totalScore + 50;
            scoreText.innerText = "Score: " + totalScore + "pts";
            break;
        case 4:
            scorePerGame = 40;
            totalScore = totalScore + 40;
            scoreText.innerText = "Score: " + totalScore + "pts";
            break;
        case 5:
            scorePerGame = 30;
            totalScore = totalScore + 30;
            scoreText.innerText = "Score: " + totalScore + "pts";
            break;
        case 6:
            scorePerGame = 30;
            totalScore = totalScore + 10;
            scoreText.innerText = "Score: " + totalScore + "pts";
            break;    
        default:
            scorePerGame = 30;
            totalScore = totalScore + 10;
            scoreText.innerText = "Score: " + totalScore + "pts";
            break;
        // code block
    }
    
    if(scorePerGame > highScore){
        highScore = scorePerGame;
    }

    resultDetailList.push(resultDetail = {
        word: word,
        tries: _tries,
        score: scorePerGame,
    })
}

const clearUsedTiles = () => {
    setTimeout(function() {
        let translate = 500;

        let absentClass = document.querySelectorAll(".absent")
        let presentClass = document.querySelectorAll(".present")
        let correctClass = document.querySelectorAll(".correct")

        correctClass.forEach(c => {
            let getClassID = document.getElementById(c.id)
            var hideAnim = anime({
                targets: getClassID,
                scale: 2,
                translateX: translate,
                easing: 'easeInOutSine',
                complete: function (anim){
                    console.log("done")
                    c.remove();
                }
            })
        })

        presentClass.forEach(c => {
            let getClassID = document.getElementById(c.id)
            var hideAnim = anime({
                targets: getClassID,
                scale: 2,
                translateX: translate,
                easing: 'easeInOutSine',
                complete: function (anim){
                    console.log("done")
                    c.remove();
                }
            })
        })

        absentClass.forEach(c => {
            let getClassID = document.getElementById(c.id)
            var hideAnim = anime({
                targets: getClassID,
                scale: 2,
                translateX: translate,
                easing: 'easeInOutSine',
                complete: function (anim){
                    console.log("done")
                    c.remove();
                }
            })
        })
    }, 2500);
};

function update(){
    
    console.log("updating")
    let guess = "";
    answer.innerText = "";
    
    for(let c = 0; c < width; c++){
        let currTile = document.getElementById(row.toString() +'-' + (c).toString());
        console.log(currTile.innerText);
        let letter = currTile.innerText;
        guess += letter;
    }
    guess = guess.toLowerCase();
    console.log(guess);

    if(!guessList.includes(guess)){
        answer.innerText = "Word does not exist"
        answer.style.opacity = "1";
        answer.style.color = "#000000"
        answerShake()
        return;
    }
    
    let correct = 0;
    let letterCount = {};
    for (let i = 0; i<word.length; i++){
        let letter = word[i];
        if(letterCount[letter]){
            letterCount[letter] += 1;
        }else{
            letterCount[letter] = 1;
        }
    }
    console.log("Letter count " + letterCount)
    
    for (let c = 0; c < width; c++){
        let currTile  = document.getElementById(row.toString()+'-'+ (c).toString());
        console.log(col);
        let letter = currTile.innerText;
        
        if(word[c] == letter){
            currTile.classList.add("correct");
            
            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("present");
            keyTile.classList.add("correct");
            correct+=1;
            letterCount[letter] -= 1;

            revealGridSampleResult(keyTile, "#333399")
            revealGridSampleResult(currTile, "#333399")
        }
        console.log("width " + width);
        console.log("correct " + correct)
        
        if(correct == width){
            answer.style.opacity = '1';
            answer.style.color = "#FFD700";
            answer.innerText = word;

            updateScore();
            numOfPlays += 1;
            updateTable()
            CompletedWordleTxt.innerText = numOfPlays;
            highestScoreTxt.innerText = highScore;

            console.log("Score: " + totalScore)
            
            startConfetti()
            stopConfetti()
            addMoreTries();
            readTextFile("sgb-words.txt")
            col = 0
            row += 1;
            _tries = 1;
            cleanKey();
            clearUsedTiles();
            return;
        }
    }
    
    console.log(letterCount);
    console.log("col " + col);
    for(let c = 0; c < width; c++){
        let currTile = document.getElementById(row.toString()+'-'+ c.toString());
        let letter = currTile.innerText;
        
        if(!currTile.classList.contains("correct")){
            if(word.includes(letter) && letterCount[letter] > 0){
                currTile.classList.add("present");
                
                let keyTile = document.getElementById("Key"+letter);
                if(!keyTile.classList.contains("correct")){
                }
                revealGridSampleResult(keyTile, "#99ccff")
                letterCount[letter] -= 1;
                revealGridSampleResult(currTile, "#99ccff")
            }
            else{
                currTile.classList.add("absent");
                let keyTile = document.getElementById("Key"+letter);
                keyTile.classList.add("absent");

                revealGridSampleResult(currTile, "#787c7e")
                revealGridSampleResult(keyTile, "#787c7e")
            }
        }
    }
    
    livesText = document.getElementById("lives").innerText = "Tries: " + (--lives).toString();
    
    _tries += 1;
    row += 1;
    col = 0
}
