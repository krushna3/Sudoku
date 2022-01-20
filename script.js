// lode board from file or manully
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

// Create variables

var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;


window.onload = function () {
    // Run start game function when butten is clicked
    id("start-btn").addEventListener("click", startGame);
    // Add event Listener to each number in the number container
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].addEventListener("click", function () {
            // if selecting is not disable
            if (!disableSelect) {
                // if number is alrady delected
                if (this.classList.contains("selected")) {
                    // then remove selection
                    this.classList.remove("selected");
                    selectedNum = null;
                }
                else {
                    //Deselect all other number
                    for (let i = 0; i < 9; i++) {
                        id("number-container").children[i].classList.remove("selected");
                    }
                    // Selected it and update SelectedNum Variable
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }
        });
    }
}

function startGame() {
    // Choose board difficulty
    let board;
    if (id("diff-1").checked) board = easy[0];
    else if (id("diff-2").checked) board = medium[0];
    else board = hard[0];

    // set lives to 3 and enable selecting number and tiles
    lives = 3;
    disableSelect = false;
    id("lives").textContent = "Lives Remaning : 3";
    // Create Board Based on Difficulty
    generateBoard(board);
    // start the timer 
    startTimer();
    // Sets theme besed on input 
    if (id("theme-1").checked) {
        qs("body").classList.remove("dark");
    }
    else {
        qs("body").classList.add("dark");
    }
    // show number container
    id("number-container").classList.remove("hidden");
}

function startTimer() {
    // sets time remaning besed on input
    if (id("time-1").checked) timeRemaining = 180;
    else if (id("time-2").checked) timeRemaining = 300;
    else timeRemaining = 600;
    // sets the timer for first second

    id("timer").textContent = timeConvertion(timeRemaining);
    // sets timer to update every second
    timer = setInterval(function () {
        timeRemaining--;
        // if no time remanig end the game
        if (timeRemaining === 0) endGame();
        id("timer").textContent = timeConvertion(timeRemaining);
    }, 1000)
}

// converts second into sting of MM:SS format
function timeConvertion(time) {
    let minutes = Math.floor(time / 60);
    if (minutes < 10)
        minutes = "0" + minutes;
    let seconds = time % 60;
    if (seconds < 10)
        seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

function generateBoard(board) {
    // Clear previous Board
    clearPrevious();
    // let udes to increment tile ids
    let idCount = 0;
    // Create 81 tiles
    for (let i = 0; i < 81; i++) {
        // Create a new paragraph elemeent
        let tile = document.createElement("p");
        // if the tile is not supposed to  be blank;
        if (board.charAt(i) != "-") {
            // Set tile Text To Correct Number
            tile.textContent = board.charAt(i);
        }
        else {
            // add click event listener to tile
            tile.addEventListener("click", function () {
                // if selecting is not disabled
                if (!disableSelect) {
                    // if the tile is alrady selected 
                    if (tile.classList.contains("selected")) {
                        // remove the slection
                        tile.classList.remove("selected");
                        selectedTile = null;
                    }
                    else {
                        // Deselect All other tile
                        for (let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        // Add Selection And Update Variable
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            });
        }
        // Assign tile id
        tile.id = idCount;
        // Increment for next tile
        idCount++;
        //Add tile class to all tile
        tile.classList.add("tile");
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }
        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }
        // Add tile to board
        id("board").appendChild(tile);
    }
}

function updateMove() {
    // if a tile and a number is selected 
    if (selectedTile && selectedNum) {
        // set the tile to the corect number
        selectedTile.textContent = selectedNum.textContent;
        // if the number matches the coresponding number in the solution key
        if (checkCorrect(selectedTile)) {
            // Deselects the tiles
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            // clear the selected variable
            selectedNum = null;
            selectedTile = null;
            // chake if board is complited
            if (checkDone()) {
                endGame();
            }
        }
        // if the number does not match the solution key
        else {
            // Desable selecting new number for one second
            disableSelect = true;
            // make the tile turn red
            selectedTile.classList.add("incorrect");
            // run in one second
            setTimeout(function () {
                // substract lives by one
                lives--;
                // if no lives left end the game
                if (lives === 0) {
                    endGame();
                }// if live is not equal to zero
                else {
                    // updates the lives text
                    id("lives").textContent = "Lives Remaning: " + lives;
                    // Reanable selecting number and tiles
                    disableSelect = false;
                }
                // Restore tile color and remove selected from both
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");
                // Clear the Tile text and clear selected variable
                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null
            }, 1000);
        }
    }
}

function checkDone() {
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        if (tile.textContent === "") {
            return false;
        }
    }
    return true;
}

function endGame() {
    // Disable moves and stop timer
    disableSelect = true;
    clearTimeout(timer);
    // Display Win or Loss message
    if (lives === 0 || timeRemaining === 0) {
        id("lives").textContent = "You Lost!";
    }
    else {
        id("lives").textContent = "You Won!";
    }
}

function checkCorrect(tile) {
    // set solution based on difficuilty seletion
    let solution;
    if (id("diff-1").checked) solution = easy[1];
    else if (id("diff-2").checked) solution = medium[1];
    else solution = hard[1];
    // tiles number is eqal to solutions number 
    if (solution.charAt(tile.id) === tile.textContent)
        return true;
    else
        return false;
}


function clearPrevious() {
    // Access all of the tiles
    let tiles = qsa(".tile");
    // Remove Each Tile
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }
    // If their is a time clear it
    if (timer) clearTimeout(timer);
    // Deselect any number
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }
    //Clear selected variables
    selectedTile = null;
    selectedNum = null;
}

// Helper Function
function id(id) {
    return document.getElementById(id);
}

function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}