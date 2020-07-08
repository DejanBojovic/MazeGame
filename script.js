// dragNdrop for player and target 
const player = document.querySelector(".player");
const target = document.querySelector(".target");
const body = document.querySelector("body");

// listeners for player icon
player.addEventListener('dragstart', dragStart);
player.addEventListener('dragend', dragEnd);

// timer for medium and hard mode
const timer = document.querySelector(".timer");

// drag functions for player
function dragStart() {
    // making player invisible after startin to drag it 
    setTimeout(function() {
        player.classList.add("invisible");
    }, 0)

    // gets the number from the DOM
    let time = timer.innerHTML;
    
    // function that starts countdown for medium and hard mode
    function count() {
        // decrementation of time
        time--;

        // displaying that decremented number on the page
        timer.innerHTML = time;

        if (timer.classList[1] === "lose") {
            // when class "lose" is appended to timer in "dragEnterWall" function it means that player hit the wall and lost soo the game ends
            // interval is being reset and timer is being set for the next round to start
            clearInterval(interval);

            // sets time again
            if(body.classList.value === "hard") {
                timer.innerHTML = 5;
            } else if(body.classList.value === "medium") {
                timer.innerHTML = 10;
            }
            
            timer.classList.remove("lose");
            return;
            
        // this is in case that player wins
        // class "win" is being appended to timer in "dragEnter" function if player gets to target
        // then on next iteration of setInterval its being checked here, same as for "lose" above 
        } else if (target.classList[1] === "win") {
            // then interval is being reset and timer set again
            clearInterval(interval);

            // sets time again
            if(body.classList.value === "hard") {
                timer.innerHTML = 5;
            } else if(body.classList.value === "medium") {
                timer.innerHTML = 10;
            }

            target.classList = "target";
            return;
        }


        // time is seto to -1 in order to not glitch when the player reaches target at 0 left
        // timer never shows -1 on the page, since it displays 10 when time gets to -1
        // 0 is the last second for the player to win and last number shown on the page
        if (time === -1) {
            // interval is being cleared - so it doesnt continue decrementing
            clearInterval(interval);
            // timer is being set here so it doesnt show -1
            if(body.classList.value === "hard") {
                timer.innerHTML = 5;
            } else if(body.classList.value === "medium") {
                timer.innerHTML = 10;
            }

            // removing target before you clcik on "loser"
            target.style.display = "none";

            // displaying popup menu
            result.style.display = "block";
            pMenu.innerText = "You lost";
            resultButton.innerText = "Loser!";

            // removing popup menu on button click
            resultButton.addEventListener("click", function() {
                // removing popup menu
                result.style.display = "none";
                // resetting target class
                target.classList = "target";
                // displaying target again
                target.style.display = "flex";
            })
        } 

    }

    // this checks if the medium mode is selected
    //and only then on dragStart function starts the countdown for player
    if(body.classList.value === "medium" || body.classList.value === "hard") {
        // count function is being called first because setInterval will wait 1s before starting the loop
        // this is in order to preserve the continuity of the countdown timer
        count();
        // interval is being set to call function after every second until stoped
        // assigning it to variable "interval" is for the purpose of stoping the loop when needed - this is done inside of "count" function
        var interval = setInterval(count, 1000);
    }
 
}

// function that gets player to the start again if the dragging stops
function dragEnd() {
    // removing class invisible is basically making player visible at the start againg - countdown does not reset if it happens
    player.classList.remove("invisible");
}

// listeners for target
target.addEventListener("dragover", dragOver);
target.addEventListener("dragenter", dragEnter);

// popup menu items
const result = document.querySelector(".result");
const resultMenu = document.querySelector(".result-menu");
const pMenu = document.querySelector(".result-menu p");
const resultButton = document.querySelector(".result-button");
const main = document.querySelector(".main");

// drag functions for target
function dragOver(e) {
    e.preventDefault();
}

// when player reaches target he wins
function dragEnter(e) {
    e.preventDefault();
    target.style.backgroundColor = "#0000ff";
    //player position static is set because player needs to fit perfectly in target
    player.style.position = "static";
    // player div is being appended to the target div
    target.append(player);
    // class "win" is being added to target soo the interval in the "dragStart" function can stop
    target.classList.add("win");
   
    // popup menu is being displayed
    // setTimeout is set bacuse player needs to wait 1s before he starts another round
    // in order for timer not to glicth when someone clicks fast on button for another round
    setTimeout(function() {
        result.style.display = "block";
        resultButton.innerText = "Nice!";
        pMenu.innerHTML = "You won";
    }, 1000);

    // when button in the popup menu is clicked the whole rounds resets and players can start again
    resultButton.addEventListener("click", function() {
        // player is removed from the target
        player.remove();
        // player position is returned to absolute so it can be positioned at the start (top right corner) again
        player.style.position = "absolute";
        // player is being appended to the main board - maze
        main.append(player);
        // removing popup manu again
        result.style.display = "none";
        // reseting classes for target - removing "win"
        target.classList.remove("win");
        // setting target background to the violet again after round reset
        target.style.backgroundColor = "#EE82EE";

    });
}

// variable that counts how many times player hit the walls before he lost
// its value is being incremented in dragEnterWall function
let hits = 0;

// dragNdrop funcionality for the walls
// checks if the player loses before timer counts down
function dragEnterWall(e) {
    e.preventDefault();

    // as soon as player hits the walls variable "hits" increments
    hits++;
    // then class "lose" is added to timer soo it can end the interval loop
    timer.classList.add("lose");

    // removing event listeners for walls and borders soo player cant lose twice in a very short time if he hits the walls fast
    for(let i = 0; i < walls.length; i++) {
        walls[i].removeEventListener("dragenter", dragEnterWall);
        walls[i].removeEventListener("dragover", dragOverWall);
    }
    
    for(let i = 0; i < borders.length; i++) {
        borders[i].removeEventListener("dragenter", dragEnterWall);
        borders[i].removeEventListener("dragover", dragOverWall);
    }

    // reseting the round when the wall si hit
    if(hits === 1) {
        // removing target so player cant cheat
        target.style.display = "none";

        // displaying popup menu
        // setTimeout is set bacuse player needs to wait 1s before he starts another round
        // in order for timer not to glicth when someone clicks fast on button for another round
        setTimeout(function() {
            result.style.display = "block";
            pMenu.innerText = "You lost";
            resultButton.innerText = "Loser!";
        }, 1000);
        
        // reseting hits
        hits = 0;

        // removing popup menu on button click
        resultButton.addEventListener("click", function() {
            // removing popup menu
            result.style.display = "none";
            // displaying target back
            target.style.display = "flex";
            // removing "lose" class soo the round can start again after
            timer.classList.remove("lose");

            // returning event listeners after clicking the button and resetting the round
            for(let i = 0; i < walls.length; i++) {
                walls[i].addEventListener("dragenter", dragEnterWall);
                walls[i].addEventListener("dragover", dragOverWall);
            }
            
            for(let i = 0; i < borders.length; i++) {
                borders[i].addEventListener("dragenter", dragEnterWall);
                borders[i].addEventListener("dragover", dragOverWall);
            }
        })

    }

}

function dragOverWall(e) {
    e.preventDefault();
}

// walls of the maze
const walls = document.querySelectorAll(".row");
// borders of the maze
const borders = document.querySelectorAll(".border");

// adding functions to the walls of the maze
for(let i = 0; i < walls.length; i++) {
    walls[i].addEventListener("dragenter", dragEnterWall);
    walls[i].addEventListener("dragover", dragOverWall);
}

// adding functions to the borders of the maze
for(let i = 0; i < borders.length; i++) {
    borders[i].addEventListener("dragenter", dragEnterWall);
    borders[i].addEventListener("dragover", dragOverWall);
}

// menu on the left
// setting event listeners for difficulties
const easy = document.querySelector(".easy");
const medium = document.querySelector(".medium");
const hard = document.querySelector(".hard");

// variable for moving walls
// in hard mode they are activated, in easy and medium mode deactivated
const rowFourThree = document.querySelector(".row-four-3");
const rowFiveOne = document.querySelector(".row-five-1");
const rowTwoThree = document.querySelector(".row-two-3");
const rowFourOne = document.querySelector(".row-four-1");
const rowSevenNine = document.querySelector(".row-seven-9");
const rowTenThree = document.querySelector(".row-ten-3");

// if "easy" mode is selected
easy.addEventListener("click", function() {
    // everu class is being removed from body
    body.classList = "";
    // removing the timer from the page
    timer.style.display = "none";

    // stoping animation from hard mode
    // vertical animation
    rowFourThree.classList.remove("slide-vertical");
    rowSevenNine.classList.remove("slide-vertical");
    // horizontal animation
    rowFiveOne.classList.remove("slide-horizontal");
    rowTenThree.classList.remove("slide-horizontal");
    // rotation
    rowTwoThree.classList.remove("rotate");
    rowFourOne.classList.remove("rotate");

});

// if "medium" mode is selected
medium.addEventListener("click", function() {
    // class "medium" is being add to body
    // since interval only starts on "medium" and "hard" mode it is cheking the body class to know if it needs to be started on the dragging or not
    body.classList = "medium";
    // timer is displayed on the page
    timer.style.display = "block";
    timer.innerHTML = 10;
    timer.style.color = "#fff";

    // stoping animation from hard mode
    // vertical animation
    rowFourThree.classList.remove("slide-vertical");
    rowSevenNine.classList.remove("slide-vertical");
    // horizontal animation
    rowFiveOne.classList.remove("slide-horizontal");
    rowTenThree.classList.remove("slide-horizontal");
    // rotation
    rowTwoThree.classList.remove("rotate");
    rowFourOne.classList.remove("rotate");

});

// if "hard" mode is selected
hard.addEventListener("click", function() {
    // class for the bodyt is set to "hard"
    body.classList = "hard";
    // timer is displayed on the page
    timer.style.display = "block";
    timer.innerHTML = 5;
    timer.style.color = "#000";

    // vertical animation
    rowFourThree.classList.add("slide-vertical");
    rowSevenNine.classList.add("slide-vertical");
    // horizontal animation
    rowFiveOne.classList.add("slide-horizontal");
    rowTenThree.classList.add("slide-horizontal");
    // rotation
    rowTwoThree.classList.add("rotate");
    rowFourOne.classList.add("rotate");

});

// adding selection of different backgrounds - menu on the left
const backgroundBlue = document.querySelector(".bg-blue");
const backgroundRed = document.querySelector(".bg-red");
const backgroundPurple = document.querySelector(".bg-purple");

// primary color - blue
backgroundBlue.addEventListener("click", function() {
    body.style.background = "linear-gradient(to bottom left, #80d0c7, #13547a)";
})
// red
backgroundRed.addEventListener("click", function() {
    body.style.background = "linear-gradient(to bottom left, #dd1818, #333333)";
})
// purple
backgroundPurple.addEventListener("click", function() {
    body.style.background = "linear-gradient(to bottom left, #a8c0ff, #3f2b96)";
})
