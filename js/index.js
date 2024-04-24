document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    const player = document.createElement('div');     //creating player div...
    let isGameOver = false;     //I'm gonna change it for true later...
    let platformCount = 5; //5
    let platforms = [];
    let score = 0;
    let playerLeftSpace = 40; //50
    let playerStartPoint = 150; //150 for globally use
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
            this.left = Math.random() * 320 // 5 platform because the width of the actual grid is 400px //CAMBIAR TO 315
            this.bottom = newPlatBottom
            this.brick = document.createElement('div')
            
            const brick = this.brick;
            brick.classList.add('brick');
            brick.style.left = this.left + 'px'
            brick.style.bottom = this.bottom + 'px'
            grid.appendChild(brick)  //adding the div
  
        }
    }
  
    function createPlatforms() {    //for create multiple
        for(let i = 0; i < platformCount; i ++) {
            let platformGap = 600 / platformCount; //to calculate the gap (brecha) btwn each one;
            let newPlatBottom = 100 + i * platformGap; //100
            let newPlatform = new Platform(newPlatBottom);  
            platforms.push(newPlatform);
        }
    }
  
    function movePlatforms() {
        if(playerBtmSpace < 650) { //200**
        platforms.forEach(platform => {
            platform.bottom -= 6; //4
            let brick = platform.brick;
            brick.style.bottom = platform.bottom + 'px';
  
            // Reposicionar la plataforma en la parte superior si llega al fondo
  
            if (platform.bottom < 10) { //10
                let firstPlatform = platforms[0].brick; // Posición en la parte superior
                firstPlatform.classList.remove('brick')
                platforms.shift();
                console.log(platforms);
                score ++;
                let newPlatform = new Platform(600);
                platforms.push(newPlatform);
            }
        });
    }
  }
  
  
  
    function createPlayer() {      //to create the div into the 'grid' div...  
        grid.appendChild(player)      //adding the player to the grid div in the function.
        player.classList.add('player')     //adding the class player to the div create with the function.
  
        const playerImg = document.createElement('img');
        playerImg.src = 'img/player.png';
        playerImg.style.width = 45 + 'px';
        playerImg.style.height = 45 + 'px';
        player.appendChild(playerImg);
  
        playerLeftSpace = platforms[0].left; //Is gonna appear above the first platform
        player.style.left = playerLeftSpace + 'px';     //to position the player eachtime above of the first platform 
        player.style.bottom = playerBtmSpace + 'px';
    }
  
  
  //PLAYER MOVEMENT
  
    
    //Player falling:
  
    function fall () {
        isJumping = false;
        clearTimeout(UpTimerId); //Because we're falling
        downTimerId = setInterval(() => {
            playerBtmSpace -= 6; // 5 drecreasing player bottom space;
            player.style.bottom = playerBtmSpace + 'px';
            if(playerBtmSpace <= 0) {
                gameOver();
            }
  
            //COLLISION
  
            platforms.forEach(platform => {
                if(
                    (playerBtmSpace >= platform.bottom) &&
                    (playerBtmSpace <= platform.bottom + 20)  &&
                    ((playerLeftSpace + 60) >= platform.left) && //60
                    (playerLeftSpace <= (platform.left + 85)) && //85
                    !isJumping
                ) {
                    playerStartPoint = playerBtmSpace;
                    jump();
                    console.log('startPoint', playerStartPoint);
                    isJumping = true; //true
                    score ++;
                }
            })
        }, 20)  // 20 milisecs
    }
  
  
  
    function jump () {
        clearInterval(downTimerId);
        isJumping = true;
        UpTimerId = setInterval(() => {
            playerBtmSpace += 20; //20
            player.style.bottom = playerBtmSpace + 'px'
            if(playerBtmSpace > playerStartPoint + 200) {  //original value = 200
                fall();
                isJumping = false;
            }
        }, 20); //20 milisecs
    }
  
    //Moving Left Command:
    function moveLeft () {
        if (isGoingRight) {
            clearInterval(rightTimerId);
            isGoingRight = false;
        }
        isGoingLeft = true;
        leftTimerId = setInterval(() => {
            if (playerLeftSpace >= 0){
                console.log('going left');
                playerLeftSpace -= 4; //5
                player.style.left = playerLeftSpace + 'px';
            } else if (playerLeftSpace < 0) {
                !isGoingLeft;
            }
            else {
                moveRight();
            }
        }, 20); //20 milisecs
  
        player.querySelector('img').src = 'img/player01-left.png';
    }
  
    //Moving Right Command:
  
    function moveRight () {
        if (isGoingLeft) {
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }
        isGoingRight = true;
        rightTimerId = setInterval(() => {
            if (playerLeftSpace <= 315){   //315
                console.log('going rigth');
                playerLeftSpace += 4; //original 5;
                player.style.left = playerLeftSpace + 'px';
            } 
            // else {
            //     moveLeft();
            // }
        }, 20); //20
        player.querySelector('img').src = 'img/player01.png';
    }
    
    
    //Everytime pressed a key the player button needs to be updated KEYCODES
  
    function moveStraight () {
        isGoingUp = true;
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }
  
    function control (e) {
        player.style.bottom = playerBtmSpace + 'px';
        if (e.key === 'ArrowLeft'){
            moveLeft();
        } else if (e.key === 'ArrowRight'){
            moveRight();
        } else if (e.key === 'ArrowUp') {
            moveStraight();
        }
    }
  
  
    function start () {
        if(!isGameOver){
            createPlatforms();
            createPlayer();
            setInterval(movePlatforms, 40); // Llama a movePlatforms cada 20 milisegundos
            jump();
            document.addEventListener('keydown', control);
        }
    }
  
  
    start();
  
  
  
    function gameOver () {
        isGameOver = true;
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }
        grid.innerHTML = `Game Over! Your Score: ${score}`;
        clearInterval(downTimerId);
        clearInterval(UpTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
        clearInterval(platformInterval);
    }
  
  })
  
  //*** Proyect-02-jumping-game