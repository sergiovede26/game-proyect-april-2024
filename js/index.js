document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const player = document.createElement("div"); //creating player div...
  const scorePoints = document.getElementById("score");

  let isGameOver = false; //I'm gonna change it for true later...
  let platformCount = 5; //5
  let platforms = [];
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
      this.left = Math.random() * 415; //CAMBIAR TO 315
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
    for (let i = 0; i < platformCount; i++) {
      //for create multiple
      let platformGap = 600 / 5; //*platformCount to calculate the (brecha) btwn each array;
      let newPlatBottom = 50 + i * platformGap; //100
      let newPlatform = new Platform(newPlatBottom);
      platforms.push(newPlatform);
    }
  }

  function movePlatforms() {
    if (playerBtmSpace < 700) {
      //200**
      platforms.forEach((platform) => {
        platform.bottom -= 4; //4
        let brick = platform.brick;
        brick.style.bottom = platform.bottom + "px";

        if (platform.bottom < 3) {
          //10
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
          playSound();
          console.log("startPoint", playerStartPoint);
          isJumping = true; //true
        }
      });
    }, 20); // 20 milisecs
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    document.getElementById('jumpSound').play();
    UpTimerId = setInterval(() => {
      playerBtmSpace += 20; //20
      player.style.bottom = playerBtmSpace + "px";
      if (playerBtmSpace > playerStartPoint + 300) { //original value = 200
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
        console.log("going left");
        playerLeftSpace -= 5; // 5
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
        console.log("going rigth");
        playerLeftSpace += 5; // vel. increased 5;
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
    player.style.bottom = playerBtmSpace + "px";
    if (e.key === "ArrowLeft") {
      moveLeft();
    } else if (e.key === "ArrowRight") {
      moveRight();
    }
  }

  function start() {
    scorePoints.textContent = `SCORE: ${score}`; //to show initial SCORE = 0
    if (!isGameOver) {
      createPlatforms();
      createPlayer();
      setInterval(movePlatforms, 40); // Llama a movePlatforms cada 20 milisegundos
      jump();
      document.addEventListener("keydown", control);
    }
  }

  start();

  function gameOver() {
    isGameOver = true;
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    grid.innerHTML = `Game Over! Your Score: ${score}`;
    clearInterval(downTimerId);
    clearInterval(UpTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }


});
