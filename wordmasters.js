//variables
const word_URL = "https://words.dev-apis.com/word-of-the-day";
const validate_URL = "https://words.dev-apis.com/validate-word";
let wordOfTheDay = '';
let answer = [];

//counters
let answerCount = 0;
let rowCount = 1;

//Main program
getwordoftheday();

//listen for key press
document.addEventListener ("keyup", function(keypress){
    processkey (keypress.key);
})

//get the wordoftheday
async function getwordoftheday() {
    //show spinning animation
    const spinner = document.querySelector(".spinner")
    spinner.style.visibility = 'visible'
    try {
        const promise = await fetch(word_URL);
        const processedResponse = await promise.json();

        if (promise.ok === false) {
            alert("Sorry, there was an error obtaining the word.");
            //hide spinning animation if error occurs
            spinner.style.visibility = 'hidden'
            return;
        }
    
        wordOfTheDay = processedResponse.word;
    } catch (error) {
        console.log (error);
        //hide spinning animation if error occurs
        spinner.style.visibility = 'hidden'
    }

    //hide spinning animation
    spinner.style.visibility = 'hidden'
}

//determine if key pressed is letter and route to proper process
function processkey (keyValue) {
    if (isLetter(keyValue)) {
        //key is letter so add to answer and display

        if (answerCount < 5){
            answer.push(keyValue.toUpperCase());
            answerCount++;
            display(rowCount,answerCount,keyValue);
        }
    } else {
        //key is not letter check whether backspace or Enter
        if (keyValue === 'Backspace'){
            if (answerCount > 0){
                back();
            }
        } else {
            if (keyValue === 'Enter'){
                if (answerCount === 5) { 
                    const answerEval = {
                        word: answer.join('')
                    }
                    evalWordValidity(answerEval);
                }
            }
        }
    }
}

//determine if value from keypress is a letter
function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

//display letter typed in answer box
function display(row,letterCount,keyValue) {
    const displayAnswer = document.querySelector(`.in-${row}-${letterCount}`);
    displayAnswer.innerText = keyValue;
}

//delete previously typed letter
function back(){
    display(rowCount,answerCount,'');
    answer.pop();
    answerCount--;
}

//Evaluate Answer
function evaluateanswer() {
    const wordOfTheDayUpper = wordOfTheDay.toUpperCase()

    //if all letters matched then game is won
    if (wordOfTheDayUpper === answer.join('')) {
        for (let i=0; i < 5; i++){
            backcolor (i+1,'#006400','white')
        }
        const pageHeader = document.querySelector(".page-header")
        pageHeader.classList.add("winner")

        alert("You Win!");

    } else {
        //if all letters do not match then provide hints
        let wordofTheDayArray = wordOfTheDayUpper.split('');

        //cycle through each letter and mark green if they are in same position
        for (let i = 0; i < answer.length; i++) {
            if (answer[i] === wordofTheDayArray[i]){
                //mark it green and erase so will not be compared again
                backcolor (i+1,'#006400','white');
                wordofTheDayArray[i] = '';
                answer[i] = '';
            } 
        }

        //cycle through each letter in the answer and compare to word for hints
        for (let i = 0; i < answer.length; i++) {
            if (answer[i] !== ''){
                //check if letter is in word
                if (wordofTheDayArray.indexOf(answer[i])>=0){
                    console.log (answer[i])
                    console.log (wordofTheDayArray)
                    //mark it yellow, store index and erase so will not be compared again
                    let WordIndex = wordofTheDayArray.indexOf(answer[i])
                    backcolor  (i+1,'#daa520','white')
                    wordofTheDayArray[WordIndex] = ''
                } else {
                    //letter is not found so mark grey
                    backcolor  (i+1,'#888888','white')
                }
            } else {
                //do nothing, this ignores if answer is ''
            }
        }

        if (rowCount === 6){
            alert(`You lost, the word is ${wordOfTheDayUpper}`)
        } else {
            //set counters for second row and reset answer variable
            rowCount++;
            answerCount = 0;
            answer = [];
        }
    }
}

//validate if answer is a valid word
async function evalWordValidity(word) {
    //show spinning animation
    const spinner = document.querySelector(".spinner")
    spinner.style.visibility = 'visible'
    try {
        const promise = await fetch(validate_URL,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(word)
        });
        const response = await promise.json()
    
        if (promise.ok === false) {
             alert("Error Submitting Word");
            //hide spinning animation if error occurs
            spinner.style.visibility = 'hidden'
            return;
        }
        
        //hide spinning animation when there are no errors
        spinner.style.visibility = 'hidden'

        if (response.validWord === true){
            evaluateanswer()
        } else {
            alert(`${answer.join('')} is not a valid word!`)
        }
    } catch (error) {
        //hide spinning animation if error occurs
        spinner.style.visibility = 'hidden'
        console.log (error);
    }
}

//Change Background Colors
function backcolor(letterPosition, backgroundColor, fontColor){
    const input = document.querySelector(`.in-${rowCount}-${letterPosition}`);
    input.style.backgroundColor = backgroundColor;
    input.style.color = fontColor;
}
