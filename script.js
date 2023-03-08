"use strict";

const fruitList = [
  document.querySelector("#red_apple_container1"),
  document.querySelector("#red_apple_container2"),
  document.querySelector("#red_apple_container3"),
  document.querySelector("#red_apple_container4"),
  document.querySelector("#red_apple_container5"),
  document.querySelector("#red_apple_container6"),
  document.querySelector("#red_apple_container7"),
  document.querySelector("#red_apple_container8"),
];

window.addEventListener("load", ready);

let points = 0;
let lives = 3;

function ready() {
  console.log("btn_start");
  document.querySelector("#btn_start").addEventListener("click", startGame);
  document.querySelector("#btn_restart").addEventListener("click", startGame);
  document
    .querySelector("#btn_go_to_start")
    .addEventListener("click", showStartScreen);
}

function showGameScreen() {
  // Skjul startskærm, game over og level complete
  document.querySelector("#start").classList.add("hidden");
  document.querySelector("#game_over").classList.add("hidden");
  document.querySelector("#level_complete").classList.add("hidden");
}

function showStartScreen() {
  // fjern hidden fra startskærm og tilføj til game over og level complete
  document.querySelector("#start").classList.remove("hidden");
  document.querySelector("#game_over").classList.add("hidden");
  document.querySelector("#level_complete").classList.add("hidden");
}

function resetLives() {
  lives = 3;

  document.querySelector("#heart1").classList.remove("broken_heart");
  document.querySelector("#heart2").classList.remove("broken_heart");
  document.querySelector("#heart3").classList.remove("broken_heart");
  document.querySelector("#heart1").classList.add("active_heart");
  document.querySelector("#heart2").classList.add("active_heart");
  document.querySelector("#heart3").classList.add("active_heart");
}

function resetPoints() {
  // nulstil point
  points = 0;
  // nulstil vising af point
  displayPoints();
}

function startGame() {
  resetLives();
  resetPoints();
  showGameScreen();

  startAnimation();

  clickAnimation();
  // start timer
  startTimer();

  document.querySelector("#sound_background").play();
}

function clickAnimation() {
  document
    .querySelector("#red_apple_container1")
    .addEventListener("mousedown", clickFruit);
  document
    .querySelector("#red_apple_container2")
    .addEventListener("mousedown", clickFruit);
  document
    .querySelector("#red_apple_container3")
    .addEventListener("mousedown", clickFruit);
  document
    .querySelector("#red_apple_container4")
    .addEventListener("mousedown", clickFruit);
  document
    .querySelector("#red_apple_container5")
    .addEventListener("mousedown", clickFruit);
  document
    .querySelector("#red_apple_container6")
    .addEventListener("mousedown", clickFruit);
  document
    .querySelector("#red_apple_container7")
    .addEventListener("mousedown", clickFruit);
  document
    .querySelector("#red_apple_container8")
    .addEventListener("mousedown", clickFruit);
  document
    .querySelector("#bomb_container1")
    .addEventListener("mousedown", clickBomb);
  document
    .querySelector("#bomb_container2")
    .addEventListener("mousedown", clickBomb);
}

function startAnimation() {
  document.querySelector("#red_apple_container1").classList.add("rotation1");
  document.querySelector("#red_apple_container2").classList.add("rotation1");
  document.querySelector("#red_apple_container3").classList.add("rotation1");
  document.querySelector("#red_apple_container4").classList.add("rotation1");
  document.querySelector("#red_apple_container5").classList.add("rotation1");
  document.querySelector("#red_apple_container6").classList.add("rotation1");
  document.querySelector("#red_apple_container7").classList.add("rotation1");
  document.querySelector("#red_apple_container8").classList.add("rotation1");
  //document.querySelector("#bomb_container1").classList.add("rotation1");
  //document.querySelector("#bomb_container2").classList.add("rotation1");

  document.querySelector("#bomb_container1").classList.add("position1");
  document.querySelector("#bomb_container2").classList.add("position4");
}

function clickFruit() {
  let fruit = this;
  console.log("clickFruit");

  //fruit.removeEventListener("mousedown", clickFruit);
  //Hvis jeg tilføjer denne event kan jeg ikke klikke på æblerne efter første runde.
  //Og derfor er der gentagne click efter zoom_out

  // Stop coin container
  fruit.classList.add("paused");

  // forsvind-animation
  fruit.querySelector("img").classList.add("zoom_out");

  // når forsvind-animation er færdig: coinGone
  fruit.addEventListener("animationend", fruitGone);

  document.querySelector("#sound_fruit").currentTime = 0;
  // Afspil success-lyd
  document.querySelector("#sound_fruit").play();

  incrementpoints();

  //fik hjælp til denne del, for at æblerne skal kunne zoom in igen og kilkkes på.
  let isAllClicked = true;
  for (let i = 0; i < fruitList.length; i++) {
    //forloop
    const element = fruitList[i];
    if (!element.className.includes("paused")) {
      isAllClicked = false;
    }
  }

  if (isAllClicked) {
    for (let i = 0; i < fruitList.length; i++) {
      const element = fruitList[i];
      element.querySelector("img").classList.remove("zoom_out");
      element.querySelector("img").classList.add("scale_in");
      element.classList.remove("paused");
      setTimeout(() => {
        element.querySelector("img").classList.remove("scale_in");
      }, 1000); //efter 1000 miliskeunder bør scalein animationen forsvinde og ku klikkes på frugterne igen.
    }
  }
}

function displayPoints() {
  console.log("displayPoints");
  document.querySelector("#coin_count").textContent = points;
}

function fruitGone() {
  // fjern event der bringer os herind
  let fruit = this;
  fruit.removeEventListener("animationend", fruitGone);
  
}

function clickBomb() {
  let bomb = this;
  console.log("Click bomb");
  // Forhindr gentagne clicks
  bomb.removeEventListener("mousedown", clickBomb);

  // Stop coin container
  bomb.classList.add("paused");

  // sæt forsvind-animation på coin
  bomb.querySelector("img").classList.add("zoom_in");

  // når forsvind-animation er færdig: coinGone
  bomb.addEventListener("animationend", bombGone);

  document.querySelector("#sound_bomb").currentTime = 0;
  // Afspil success-lyd
  document.querySelector("#sound_bomb").play();

  decrementLives();
}

function decrementLives() {
  console.log("decrementLives");
  console.log(lives);
  lives--;
  displayDecrementLives();

  if (lives === 0) {
    gameOver();
  }
}

function displayDecrementLives() {
  console.log(`#heart ${lives}`);
  document
    .querySelector(`#heart${lives + 1}`)
    ?.classList.remove("active_heart");
  document.querySelector(`#heart${lives + 1}`)?.classList.add("broken_heart");
}

function bombGone() {
  let bomb = this;
  console.log("bombGone");
  console.log(bomb);

  bomb.removeEventListener("animationend", bombGone);

  // fjern forsvind-animation fra sprite
  bomb.querySelector("img").classList.remove("zoom_in");

  // fjern pause fra container

  bomb.classList.remove("paused");

  // genstart falling animation på container
  bombRestart.call(this);

  // gør det muligt at klikke på bomb igen
  bomb.addEventListener("mousedown", clickBomb);
}

function bombRestart() {
  console.log("bombRestart");
  let bomb = this;

  //genstarter bombe

  //fjerne position;
  document
    .querySelector("#bomb_container1")
    .classList.remove("position1", "position2");

  document
    .querySelector("#bomb_container2")
    .classList.remove("position3", "position4");

  bomb.offsetTranslate;

  //position til ny klasse;
  let pos = Math.floor(Math.random() * 5) + 1;
  bomb.classList.add("position" + pos);
}

function incrementpoints() {
  points++;
  console.log(points);
  displayPoints();
  if (points >= 24) {
    levelComplete();
  }
}

function displayPoints() {
  console.log("displayPoints");
  document.querySelector("#coin_count").textContent = points;
}

function gameOver() {
  console.log("gameOver");
  document.querySelector("body").classList.add("#gameOver");
  document.querySelector("#game_over").classList.remove("hidden");
  //document.querySelector("#game_over_coins").textContent = points;
  document.querySelector("#level_complete").classList.add("hidden");

  // Afspil success-lyd
  document.querySelector("#sound_gameOver").play();

  stopGame();
}

function levelComplete() {
  console.log("levelComplete");
  document.querySelector("body").classList.add("#levelComplete");
  document.querySelector("#level_complete").classList.remove("hidden");
  //document.querySelector("#level_complete_coins").textContent = points;
  document.querySelector("#game_over").classList.add("hidden");
  // Afspil success-lyd
  document.querySelector("#sound_levelcomplete").play();

  stopGame();
}

function startTimer() {
  // Sæt timer-animationen (shrink) i gang ved at tilføje klassen shrink til time_sprite
  document.querySelector("#time_sprite").classList.add("shrink");

  // Tilføj en eventlistener som lytter efter at animationen er færdig (animationend) og kalder funktionen timeIsUp
  document
    .querySelector("#time_sprite")
    .addEventListener("animationend", timeIsUp);
}

function timeIsUp() {
  console.log("Tiden er gået!");

  if (points >= 24) {
    levelComplete();
  } else {
    gameOver();
  }
}

function stopGame() {
  console.log("Stop game!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  // Stop animationer
  document.querySelector("#red_apple_container1").classList.remove("rotation1");
  document.querySelector("#red_apple_container2").classList.remove("rotation1");
  document.querySelector("#red_apple_container3").classList.remove("rotation1");
  document.querySelector("#red_apple_container4").classList.remove("rotation1");
  document.querySelector("#red_apple_container5").classList.remove("rotation1");
  document.querySelector("#red_apple_container6").classList.remove("rotation1");
  document.querySelector("#red_apple_container7").classList.remove("rotation1");
  document.querySelector("#red_apple_container8").classList.remove("rotation1");
  document.querySelector("#bomb_container1").classList.remove("rotation1");
  document.querySelector("#bomb_container2").classList.remove("rotation1");

  // Fjern click
  document
    .querySelector("#red_apple_container1")
    .removeEventListener("mousedown", clickFruit);
  document
    .querySelector("#red_apple_container2")
    .removeEventListener("mousedown", clickFruit);
  document
    .querySelector("#red_apple_container3")
    .removeEventListener("mousedown", clickFruit);
  document
    .querySelector("#red_apple_container4")
    .removeEventListener("mousedown", clickFruit);
  document
    .querySelector("#red_apple_container5")
    .removeEventListener("mousedown", clickFruit);
  document
    .querySelector("#red_apple_container6")
    .removeEventListener("mousedown", clickFruit);
  document
    .querySelector("#red_apple_container7")
    .removeEventListener("mousedown", clickFruit);
  document
    .querySelector("#red_apple_container8")
    .removeEventListener("mousedown", clickFruit);
  document
    .querySelector("#bomb_container1")
    .removeEventListener("mousedown", clickBomb);
  document
    .querySelector("#bomb_container2")
    .removeEventListener("mousedown", clickBomb);

  document.querySelector("#time_sprite").classList.remove("shrink");
  document.querySelector("#sound_background").pause();
  document.querySelector("#sound_background").currentTime = 0;

  for (let i = 0; i < fruitList.length; i++) {
    const element = fruitList[i];
    console.log(element);
    element.querySelector("img").classList.remove("zoom_out");
    element.querySelector("img").classList.add("scale_in");
    element.classList.remove("paused");
    setTimeout(() => {
      element.querySelector("img").classList.remove("scale_in");
    }, 1000); //efter 1000 miliskeunder bør scalein animationen forsvinde og ku klikkes på frugterne igen.
  }
}
