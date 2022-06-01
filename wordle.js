

var height = 6;
var width = 5;

var row = 0;
var col = 0;

var gameOver = false;

var triesText;
var scoreText;

var tries = 1;
var score = 0;

const startConfetti = () => {
    setTimeout(function() {
        confetti.start()
    }, 200); // 1000 is time that after 1 second start the confetti ( 1000 = 1 sec)
};

//  for stopping the confetti 

const stopConfetti = () => {
    setTimeout(function() {
        confetti.stop()
    }, 5000); // 5000 is time that after 5 second stop the confetti ( 5000 = 5 sec)
};


window.onload = function (){
    readTextFile("sgb-words.txt")
    initialize();
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
    for (let r = height; r < height + 3; r++){
        for (let c = 0; c < width; c++){
            let tile = document.createElement("span")
            tile.id = r.toString() + "-" + c.toString()
            tile.classList.add("tile")
            tile.innerText = " ";
            document.getElementById("board").appendChild(tile)
        }
    }
    height = height + 3;
}

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
    
    let keyboard = 
        [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
            ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
        ]
    
    
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
        document.body.appendChild(keyboardRow);
    }
    document.addEventListener("keydown", (e ) => {
        processInput(e);
    })
}

function processKey(){
    console.log("clicked")
    e = {"code" : this.id};
    processInput(e);
}

 function processInput(e){
    if(gameOver) return;
    
    if("KeyA" <= e.code && e.code <= "KeyZ"){
        console.log("entering texts")
        if(col < width){
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            anime({
                endDelay: 50,
                targets: currTile,
                scale: 1.05,
                borderColor: "#919191FF"
            })
            if(currTile.innerText == ""){
                console.log(e.code[3])
                currTile.innerText = e.code[3];
                col+=1
            }
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
            borderColor: "#D7D7D7FF",
        })
        if(document.getElementById("answer").style.display == "block"){
            document.getElementById("answer").style.display = "none"
        }
    }
    else if(e.code == "Enter"){
        if(col == 5){
            update();
        }

    }
    
    if(!gameOver && row==height){
        gameOver = true;
        triesText = document.getElementById("tries").innerText = "Tries: " + tries.toString();
        document.getElementById("answer").innerText = word;
    }
}

function  reverseString(str) {
    return str.split("").reverse().join("");
}

function displayScore(){
    scoreText = document.getElementById("score");
    
    switch(tries) {
        case 1:
            score = score + 100;
            scoreText.innerText = "Score: " + score + "pts";
            break;
        case 2:
            score = score + 70;
            scoreText.innerText = "Score: " + score + "pts";
            break;
        case 3:
            score = score + 50;
            scoreText.innerText = "Score: " + score + "pts";
            break;
        case 4:
            score = score + 40;
            scoreText.innerText = "Score: " + score + "pts";
            break;
        case 5:
            score = score + 30;
            scoreText.innerText = "Score: " + score + "pts";
            break;
        case 6:
            score = score + 10;
            scoreText.innerText = "Score: " + score + "pts";
            break;    
        default:
        // code block
    }
}

function update(){
    
    console.log("updating")
    let guess = "";
    document.getElementById("answer").innerText = "";
    
    for(let c = 0; c < width; c++){
        let currTile = document.getElementById(row.toString() +'-' + (c).toString());
        console.log(currTile.innerText);
        let letter = currTile.innerText;
        guess += letter;
    }
    guess = guess.toLowerCase();
    console.log(guess);
    
    
    if(!guessList.includes(guess)){
        document.getElementById("answer").style.display = "block"
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

            anime({
                endDelay: 1000,
                easing: 'easeInOutQuad',
                targets: currTile,
                backgroundColor: "#6aaa64",
                color: "#ffffff",
                borderColor: "#6aaa64"
            })

            anime({
                endDelay: 1000,
                easing: 'easeInOutQuad',
                targets: keyTile,
                backgroundColor: "#6aaa64",
                color: "#ffffff",
                borderColor: "#6aaa64"
            })
        }
        console.log("width " + width);
        console.log("correct " + correct)
        
        if(correct == width){
            console.log("game over")
            startConfetti()
            stopConfetti()
            displayScore();
            addMoreTries();
            readTextFile("sgb-words.txt")
            col = 0
            console.log(row)
            row += 1;
            console.log(row)
            tries = 1;
            triesText = document.getElementById("tries").innerText = "Tries: " + tries.toString();
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
                    anime({
                        endDelay: 1000,
                        easing: 'easeInOutQuad',
                        targets: keyTile,
                        backgroundColor: "#c9b458",
                        color: "#ffffff",
                        borderColor: "#c9b458"
                    })
                }
                
                letterCount[letter] -= 1;

                anime({
                    endDelay: 1000,
                    easing: 'easeInOutQuad',
                    targets: currTile,
                    backgroundColor: "#c9b458",
                    color: "#ffffff",
                    borderColor: "#c9b458"
                })
                
            }
            else{
                currTile.classList.add("absent");
                let keyTile = document.getElementById("Key"+letter);
                keyTile.classList.add("absent");

                anime({
                    endDelay: 1000,
                    easing: 'easeInOutQuad',
                    targets: currTile,
                    backgroundColor: "#787c7e",
                    color: "#ffffff",
                    borderColor: "#787c7e"
                })

                anime({
                    endDelay: 1000,
                    easing: 'easeInOutQuad',
                    targets: keyTile,
                    backgroundColor: "#787c7e",
                    color: "#ffffff",
                    borderColor: "#787c7e"
                })
            }
        }
    }
    
    triesText = document.getElementById("tries").innerText = "Tries: " + tries.toString();
    
    row += 1;
    col = 0
    
    tries = tries + 1;
}
