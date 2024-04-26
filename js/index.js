document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const player = document.createElement("div"); //creating player div...
  const scorePoints = document.getElementById("score");
  const backgroundMusic = document.getElementById("back-music");
  const jumpSoundEffect = document.getElementById("jumpSound");
  const gameOverSound = document.getElementById("game-over-sound");

  let isGameOver = false; //I'm gonna change it for true later...
  let platformCount = 5; //5
  let eggCount = 2; //new
  let platforms = [];
  let eggsArray = [];
  let score = 0;
  let playerLeftSpace = 50; //50
  let playerStartPoint = 150; //150 global
  let playerBtmSpace = playerStartPoint;
  let isJumping = true;
  let UpTimerId;
  let downTimerId;
  let isGoingLeft = false;
  let leftTimerId;
  let isGoingRight = false;
  let rightTimerId;


  class Platform {
    constructor(newPlatBottom) {
      this.left = Math.random() * 415; //change to 315
      this.bottom = newPlatBottom;
      this.brick = document.createElement("div");

      const brick = this.brick;
      brick.classList.add("brick");
      brick.style.left = this.left + "px";
      brick.style.bottom = this.bottom + "px";
      grid.appendChild(brick); //adding bricks
    }
  }


  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) { //for create multiple
      let platformGap = 600 / platformCount; //*platformCount to calculate the (brecha) btwn each array;
      let newPlatBottom = 100 + i * platformGap; //100
      let newPlatform = new Platform(newPlatBottom);
      platforms.push(newPlatform);
    }
  }

  function movePlatforms() {
    if (playerBtmSpace < 600) { //200**
      platforms.forEach((platform) => {
        platform.bottom -= 4; //4
        let brick = platform.brick;
        brick.style.bottom = platform.bottom + "px";

        if (platform.bottom < 1) { //10
          let firstPlatform = platforms[0].brick; // Posición en la parte superior
          firstPlatform.classList.remove("brick");
          platforms.shift();
          console.log(platforms);
          let newPlatform = new Platform(600);
          platforms.push(newPlatform);
        }
      });
    }
  }

  function createPlayer() {
    //to create the div into the 'grid' div...
    grid.appendChild(player); //adding the player to the grid div in the function.
    player.classList.add("player"); //adding the class player to the div create with the function.

    const playerImg = document.createElement("img");
    playerImg.src = "img/player01.png";
    playerImg.style.width = 50 + "px";
    playerImg.style.height = 50 + "px";
    player.appendChild(playerImg);

    playerLeftSpace = platforms[0].left; // 0 appers in the first platform
    player.style.left = playerLeftSpace + "px"; //to position the player eachtime above of the first platform
    player.style.bottom = playerBtmSpace + "px";
  }

  //Player falling:

  function fall() {
    isJumping = false;
    clearTimeout(UpTimerId); //Because we're falling
    downTimerId = setInterval(() => {
      playerBtmSpace -= 5; // 5 drecreasing player bottom space;
      player.style.bottom = playerBtmSpace + "px";
      if (playerBtmSpace <= 0) {
        gameOver(); //should I call you in another website?
      }

      //COLLISION

      platforms.forEach((platform) => {
        if (
          playerBtmSpace >= platform.bottom &&
          playerBtmSpace <= platform.bottom + 10 && //20
          playerLeftSpace + 60 >= platform.left && //60
          playerLeftSpace <= platform.left + 85 && //85
          !isJumping
        ) {
          playerStartPoint = playerBtmSpace;
          jump();
          scorePoints.textContent = `SCORE: ${score++}`;
          console.log("startPoint", playerStartPoint);
          isJumping = true; //true
        }
      });
    }, 20); // 20 milisecs
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    jumpSoundEffect.play();
    jumpSoundEffect.volume = 0.3
    UpTimerId = setInterval(() => {
      playerBtmSpace += 20; //20
      player.style.bottom = playerBtmSpace + "px";
      if (playerBtmSpace > playerStartPoint + 250) { //original value = 200
        fall();
        isJumping = false;
      }
    }, 20); //20 milisecs
  }

  //Moving Left Command:

  function moveLeft() {
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(() => {
      if (playerLeftSpace > 0) {
        // Check if player is within the left boundary
        //console.log("going left");
        playerLeftSpace -= 4; // 5
        player.style.left = playerLeftSpace + "px";
      } else {
        clearInterval(leftTimerId); // Clear interval if player hits left boundary
        isGoingLeft = false;
      }
    }, 20); // 20 milliseconds

    player.querySelector("img").src = "img/player01-left.png";
  }

  //Moving Right Command:

  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(() => {
      if (playerLeftSpace < 415) {
        //console.log("going rigth");
        playerLeftSpace += 4; // vel. increased 5;
        player.style.left = playerLeftSpace + "px";
      } else {
        clearInterval(rightTimerId); //
        isGoingRight = false;
      }
    }, 20); //20
    player.querySelector("img").src = "img/player01.png";
  }

  // calling the functions with the keyboard:
  function control(e) {
    console.log("Key pressed:", e.key);
    player.style.bottom = playerBtmSpace + "px";
    if (e.key === "ArrowLeft") {
      console.log("Moving left...");
      moveLeft();
    } else if (e.key === "ArrowRight") {
      console.log("Moving right...");
      moveRight();
    }
  }
  

  function start() {
    scorePoints.textContent = `SCORE: ${score}`; //to show initial SCORE = 0
    if (!isGameOver) {
      createPlatforms();
      createPlayer();
      setInterval(movePlatforms, 40); // is calling movePlatforms every 20 milisec
      jump();
      document.addEventListener("keydown", control);
      backgroundMusic.play();
      backgroundMusic.volume = 0.3;
    }
  }

  start();

  function gameOver() {
    isGameOver = true;
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    backgroundMusic.volume = 0;
    gameOverSound.play();
    gameOverSound.volume = 0.3

    grid.innerHTML = `Game Over! Your Score: ${score}`;
    clearInterval(downTimerId);
    clearInterval(UpTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }


});
