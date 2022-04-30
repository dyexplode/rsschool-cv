
//#################################
// Game State Description
//#################################

/*
pick – ожидаем, когда пользователь выберет гем (первый или второй рядом с первым);
switch – после выбора второго гема меняем их местами;
revert – после свитча не появилось групп сбора, возвращаемся к исходному состоянию (меняем позиции гемов обратно);
remove – после свитча появились группы сбора, которые нужно удалить;
refill – после удаления групп сбора нужно заполнить образовавшиеся пустоты новыми гемами.
*/

//########################
//Global Initialization
//########################

// Создание и заполнение поля
//document.addEventListener('DOMContentLoaded',ready);

/* настройки */
let gemSize = 40; // размер гема
let gemIconSize = 32; // size icon into Gem
let gemClass = "gem"; // класс элементов-гемов
let gemIdPrefix = "gem"; // префикс для идентификаторов
let numRows = 9; // количество рядов
let numCols = 6; // количество колонок
let jewels = new Array(); // двумерный массив гемов на поле
let gameState = "pick"; // текущее состояние поля - ожидание выбора гема
let gameGlobalState = "pause";

/* цвета гемов */
let bgColors = new Array(
  "magenta", 
  "mediumblue", 
  "yellow", 
  "lime", 
  "cyan", 
  "orange", 
  "crimson", 
  "gray"
);
//################################
/*Global variable of this game*/
//################################
let selectedCoordinates = [-1,-1];
let putCoordinates = [-1, -1];
let movingItems = 0;
let time = 15; 
let level = 1;
let score = 0;
let moves = 0;
let userName = 'User';
const timeField = document.querySelector('.time');
const movesField = document.querySelector('.moves');
const levelField = document.querySelector('.level');
const scoreField = document.querySelector('.score');
const bodyContainer = document.querySelector('body');
const highscoreHideForm = document.querySelector('.highscore-form');
const highscoreForm = document.querySelector('.highscore-content');
const userForm = document.querySelector('#user-form');
const buttonHighscore = document.querySelector('.highscore');
const buttonScoreConfirm = document.querySelector('.buttonOkScore');
const inputName = document.querySelector('.inputName');
let movesHintArray = [];
const buttonHint = document.querySelector('.hint');
buttonHint.addEventListener('click', drawRandomHint);
buttonHighscore.addEventListener('click', drawHighscoreAndPaused);
buttonScoreConfirm.addEventListener('click', confirmScore);
userForm.addEventListener('submit', onEnterUserName);

let isRunning = false;

//Sound effects for game

const playerGemSelect = new Audio();
const playerGemFade = new Audio();
const playerGemRevert = new Audio();
const playerGemSwitch = new Audio();
const playerLevelUp = new Audio();
const playerLogo = new Audio();
const playerGameOver = new Audio();
const playerGemHint = new Audio();

playerGemSelect.src = 'assets/sound/selGem.mp3';
playerGemFade.src = 'assets/sound/gemFadeAlt.mp3';
playerGemRevert.src = 'assets/sound/gemRevert.mp3';
playerGemSwitch.src = 'assets/sound/gemSwitch.mp3';
playerLevelUp.src = 'assets/sound/levelUp.mp3';
playerLogo.src = 'assets/sound/logo.mp3';
playerGameOver.src = 'assets/sound/gameOver.mp3';
playerGemHint.src = 'assets/sound/gemHint.mp3';


//inputName.addEventListener('click', playLogo);
/* создание поля */
//Заполнение окна
const mainField = document.querySelector('.game-interface');
mainField.innerHTML = '<div id = "gamefield"><div id = "marker"></div></div>';
mainField.style.backgroundColor = "black";
//mainField.style.margin = "0";

mainField.style.display = 'flex';
mainField.style.justifyContent = 'center';
mainField.style.alignItems = 'center';


//Заполнение поля
const gameField = document.querySelector('#gamefield');

//Создание маркера выборки
let gameMarker;

//Прогрузка контента
function ready() { 
gameField.style.backgroundColor = '#000000';
gameField.style.position = 'relative';
gameField.style.width = (numCols * gemSize) + 'px';
gameField.style.height = (numRows * gemSize) + 'px';
gameField.addEventListener('click',tap);
  

gameMarker = document.querySelector('#marker');
gameMarker.style.width = (gemSize - 10) + 'px';
gameMarker.style.height = (gemSize - 10) + 'px';
gameMarker.style.border = '5px solid white';
gameMarker.style.position = 'absolute';
gameMarker.style.display = 'none';
  

    /* создание сетки поля */
    for(let i = 0; i < numRows; i++){
      jewels[i] = new Array();
      for(let j = 0; j < numCols; j++){
          jewels[i][j] = -1;
      }
    }
  
    /* генерация исходного набора гемов */
    for(let i = 0; i < numRows; i++){
      for(let j = 0; j < numCols; j++){
        
        //Switch color 
        do {
        jewels[i][j] = Math.floor(Math.random() * (getComplexity()));
        
        } while(isStreak(i, j));
        
        const dtlItem = document.createElement('div');
        dtlItem.classList.add(gemClass);
        dtlItem.id = `${gemIdPrefix}_${i}_${j}`;
        dtlItem.style.top = (i * gemSize) + 2 +'px';
        dtlItem.style.left = (j * gemSize) + 2 +'px';
        dtlItem.style.width = gemIconSize + 'px';
        dtlItem.style.height = gemIconSize + 'px';
        dtlItem.style.position = 'absolute';
        dtlItem.style.border = '1px solid white';
        dtlItem.style.cursor = 'pointer';
        //dtlItem.style.backgroundColor = bgColors[jewels[i][j]];
        dtlItem.style.backgroundImage = `url("assets/png/${jewels[i][j]}.png")`;//backgroundColor = bgColors[jewels[i][j]]; //`url("assets/dtl/${jewels[i][j]}.png")`;//
        dtlItem.style.backgroundSize = 'contain';
        gameField.append(dtlItem);
  
      }
    }
    
    moves = getMovesCount();
    drawStatField();
    
    //remove preloader
    document.body.classList.add('loaded_hiding');
    window.setTimeout(function () {
      document.body.classList.add('loaded');
      document.body.classList.remove('loaded_hiding');
    }, 1000);

    if (!isRunning) {
      setTimeout(onTimer, 1000);
      isRunning = true;
    };
    gameGlobalState = 'game'; 
  };

function isStreak(row, col){
  return isVerticalStreak(row, col) || isHorizontalStreak(row, col);
}

function isVerticalStreak(row, col){

  let gemValue = jewels[row][col];
  let streak = 0;
  let tmp = row;

  while (tmp > 0 && jewels[tmp - 1][col] === gemValue){
    streak++;
    tmp--;
  }
  
  tmp = row;
  
  while(tmp < (numRows - 1) && jewels[tmp + 1][col] === gemValue){
    streak++;
    tmp++;
  }

  return streak > 1;
}

function isHorizontalStreak(row, col){
  const gemValue = jewels[row][col];
  let streak = 0;
  let tmp = col;

  while(tmp > 0 && jewels[row][tmp - 1] === gemValue){
    streak++;
    tmp--;
  }

  tmp = col;

  while(tmp < (numCols - 1) && jewels[row][tmp + 1] === gemValue){
    streak++;
    tmp++;
  }

  return streak > 1;
}

function getCoordFromId(id){
  const arrayId = id.split('_');
  return [+arrayId[1], +arrayId[2]];
}

function getValueFromId(id){
  const coord = getCoordFromId(id);
  return `url("assets/png/${jewels[coord[0]][coord[1]]}.png")`;//bgColors[jewels[coord[0]][coord[1]]];
}



function checkMoving(){
  drawStatField();
  movingItems--;
  //finish last moving gem
  if (movingItems === 0){
    //do from gameState
    switch (gameState) {
      //check delete group
      case "switch":
      case "revert":
        if(!isStreak(selectedCoordinates[0], selectedCoordinates[1]) && !isStreak(putCoordinates[0], putCoordinates[1])){
          //if not in delete group 
          //revert all change
          
          if(gameState !== 'revert'){
            gameState = 'revert';
            gemSwitch();
          }else{
            
            gameState = 'pick';
            selectedCoordinates = [-1,-1];
            moves = getMovesCount();
            drawStatField();
          }
          break;
        }else{
          
          gameState = 'remove';
          if(isStreak(selectedCoordinates[0],selectedCoordinates[1])){
            removeGems(selectedCoordinates[0],selectedCoordinates[1]);
          }
          if(isStreak(putCoordinates[0],putCoordinates[1])){
            removeGems(putCoordinates[0],putCoordinates[1]);
          }
          gemFade();
          break;
        };
      
      case "remove" :
        checkFalling();
        break;
      
      case "refill" :
        placeNewGems();
        break;
    }
  } 
}


function gemSwitch(){
  let offsetCoordinates = [selectedCoordinates[0] - putCoordinates[0], selectedCoordinates[1] - putCoordinates[1]];
  let sel = document.querySelector(`#${gemIdPrefix}_${selectedCoordinates[0]}_${selectedCoordinates[1]}`);
  let put = document.querySelector(`#${gemIdPrefix}_${putCoordinates[0]}_${putCoordinates[1]}`);
  sel.classList.add('switch');
  sel.setAttribute('dir', '-1');
  put.classList.add('switch');
  put.setAttribute('dir', '1');
  //switch jewels in matrix

  if(gameState === 'switch') playerGemSwitch.play();
  if(gameState === 'revert') playerGemRevert.play();


  let temp = jewels[selectedCoordinates[0]][selectedCoordinates[1]];
  jewels[selectedCoordinates[0]][selectedCoordinates[1]] = jewels[putCoordinates[0]][putCoordinates[1]];
  jewels[putCoordinates[0]][putCoordinates[1]] = temp;
  
  document.querySelectorAll('.switch').forEach( (item) =>{
    movingItems++;
    let player = item.animate(
      [
        // keyframes
        { 
         left: `${+item.style.left.split('p')[0] + offsetCoordinates[1] * gemSize * item.getAttribute('dir')}px`,
         top: `${+item.style.top.split('p')[0] + offsetCoordinates[0] * gemSize * item.getAttribute('dir')}px`
        }
      ],
         {
        // timing options
        duration: 250,
        iterations: 1
      });
    
    player.onfinish = function (e){
      item.classList.remove('switch');
      item.removeAttribute('dir');
      //change value bacground color after switch
      //put.style.backgroundColor = getValueFromId(put.getAttribute('id'));
      put.style.backgroundImage = getValueFromId(put.getAttribute('id'));
      //sel.style.backgroundColor = getValueFromId(sel.getAttribute('id'));
      sel.style.backgroundImage = getValueFromId(sel.getAttribute('id'));
      //check new splash
      checkMoving();
    }
  })
}


function tap(event){
  if (event.target.className === 'gem'){
    if (gameState === 'pick'){
      const coordinates = getCoordFromId(event.target.id);
      gameMarker.style.top = coordinates[0] * gemSize + 'px';
      gameMarker.style.left = coordinates[1] * gemSize + 'px';
      gameMarker.style.display = 'block';
      // if gem don't select -- save selected gem
      if (selectedCoordinates[0] === -1){
        playerGemSelect.play();
        selectedCoordinates = coordinates;
      }else{
        //if any gem is selected then check new selected gem
        // is neighbour. If it's checked then switch this elements.
        //If it's don't check then only select gem in new position.
        if ((Math.abs(selectedCoordinates[0] - coordinates[0]) === 1 && selectedCoordinates[1] === coordinates[1]) || 
        (Math.abs(selectedCoordinates[1] - coordinates[1]) === 1 && selectedCoordinates[0] === coordinates[0])){
          gameMarker.style.display = 'none';
          gameState = 'switch';
          putCoordinates = coordinates;
          gemSwitch();
        }else{
          playerGemSelect.play();
          selectedCoordinates = coordinates;
        }

      }
      
    }
  }
}

function removeGems(row, col){
  let gemValue = jewels[row][col];
  let tmp = row;
  document.querySelector(`#${gemIdPrefix}_${row}_${col}`).classList.add('remove');
  if(isVerticalStreak(row, col)){
    while(tmp > 0 && jewels[tmp - 1][col] === gemValue){
      document.querySelector(`#${gemIdPrefix}_${tmp - 1}_${col}`).classList.add('remove');
      jewels[tmp -1][col] = -1;
      tmp--;
    }
    tmp = row;
    while(tmp < (numRows - 1) && jewels[tmp + 1][col] === gemValue){
      document.querySelector(`#${gemIdPrefix}_${tmp + 1}_${col}`).classList.add('remove');
      jewels[tmp + 1][col] = -1;
      tmp++;
    }
  
 }
  
  if(isHorizontalStreak(row, col)){
    tmp = col;
    while(col > 0 && jewels[row][tmp - 1] === gemValue){
      document.querySelector(`#${gemIdPrefix}_${row}_${tmp - 1}`).classList.add('remove');
      jewels[row][tmp - 1] = -1;
      tmp--;
    }
    tmp = col;
    while(tmp < (numCols - 1) && jewels[row][tmp + 1] === gemValue){
      document.querySelector(`#${gemIdPrefix}_${row}_${tmp + 1}`).classList.add('remove');
      jewels[row][tmp + 1] = -1;
      tmp++;
    }
  }
  
  jewels[row][col] = -1;
}

function gemFade(){
  switch (document.querySelectorAll('.remove').length){
    case 3:
      score += 10;
      time = time + level;
      drawStatField();
      break;
    case 4:
      score += 15;
      time = time + Math.floor(level * 1.5);
      drawStatField();
      break;
    case 5:
      score += 20;
      time = time + level * 2;
      drawStatField();
      break;
    
    default:
      score += 50;
      time = time + level * 3;
      drawStatField();
      break;
  }
 

document.querySelectorAll('.remove').forEach( item =>{
 movingItems++;
 playerGemFade.play();
  let player = item.animate(
    [
      // keyframes
      { 
       opacity : 0
      }
    ],
       {
      // timing options
      duration: 250,
      iterations: 1
    }
  );
  player.onfinish = function (e){
    item.remove();
    checkMoving();
  }

 } )  

};

function checkFalling() {
  let fellDown = 0;
  for(let j = 0; j < numCols; j++) {
    for(let i = numRows - 1; i > 0; i--) {
      if((+jewels[i][j] === -1) && (+(jewels[i - 1][j]) >= 0)) {
        document.querySelector(`#${gemIdPrefix}_${i - 1}_${j}`).classList.add('fall');
        document.querySelector(`#${gemIdPrefix}_${i - 1}_${j}`).setAttribute('id',`${gemIdPrefix}_${i}_${j}`);
        jewels[i][j] = jewels[i - 1][j];
        jewels[i - 1][j] = -1;
        fellDown++;
      }
    }
  }
  document.querySelectorAll('.fall').forEach( item => {
    movingItems++;
    let player = item.animate(
      [
        // keyframes
        { 
         top : `${Number(item.style.top.split('p')[0]) + gemSize}px`
        }
      ],
         {
        // timing options
        duration: 100,
        iterations: 1
      }
    );
    player.onfinish = function (e){
      item.style.top = `${Number(item.style.top.split('p')[0]) + gemSize}px`;
      item.classList.remove('fall');
      checkMoving();
    }

  }

  )
  if(fellDown === 0){
    gameState = 'refill';
    movingItems = 1;
    checkMoving();
  }
};

function placeNewGems() {
  let gemsPlaced = 0;
  for (i = 0; i < numCols; i++) {
    if (jewels[0][i] === -1) {
      jewels[0][i] = Math.floor(Math.random() * (getComplexity()));
      const gem = document.createElement('div');
      gem.classList.add(gemClass);
      gem.setAttribute('id', `${gemIdPrefix}_0_${i}`);
      gem.style.top = '4px';
      gem.style.left = (i * gemSize) + 4 + 'px';
      gem.style.width = gemIconSize + 'px';
      gem.style.height = gemIconSize + 'px';
      gem.style.position = 'absolute';
      gem.style.border = '1px solid white';
      gem.style.cursor = 'pointer';

      gem.style.backgroundImage = `url("assets/png/${jewels[0][i]}.png")`;
      gem.style.backgroundSize = 'contain';
      //gem.style.backgroundColor = bgColors[jewels[0][i]];
      
      gameField.append(gem);
      gemsPlaced++;
    }
  }
  if(gemsPlaced) {
    gameState = 'remove';
    checkFalling();
  }else{
    let combo = 0;
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        if(j <=numCols - 3 && jewels[i][j] === jewels[i][j + 1] && jewels[i][j] === jewels[i][j + 2]){
          combo++;
          removeGems(i,j);
        }
        if (i <= numRows - 3 && jewels[i][j] === jewels[i + 1][j] && jewels[i][j] === jewels[i + 2][j]){
          combo++;
          removeGems(i,j);
        }
      }
    }
    if (combo > 0){
      gameState = 'remove';
      gemFade();
    }else{
      gameState = 'pick';
      selectedCoordinates = [-1,-1];
      moves = getMovesCount();
      drawStatField();
      
    }
  }
}



function drawStatField() {
  if (moves === 0){
    gameField.innerHTML = '<div id = "marker"></div></div>';
    selectedCoordinates = [-1,-1];
    putCoordinates = [-1, -1];
    movingItems = 0;
    ready();
  };


  movesField.textContent = moves;
  const levelLast = level;
  level = Math.trunc(score / 500) + 1;
  if (level > levelLast){
    playerLevelUp.play();
  };
  levelField.textContent = level;
  scoreField.textContent = score;
  timeField.textContent = time;
}

function getMovesCount(){
  movesHintArray = [];
  let tmp = -1;
  if ( gameState === 'pick' ){
    for (let i =  0; i < numRows - 1; i++){
      for (let j = 0; j < numCols - 1; j++){
        tmp = jewels[i][j];
        jewels[i][j] = jewels[i + 1][j];
        jewels[i + 1][j] = tmp;
        if (isStreak(i , j) || isStreak(i + 1, j)){
          movesHintArray.push([i,j,i + 1,j]);
        };

        jewels[i + 1][j] = jewels[i][j];
        jewels[i][j] = jewels[i][j + 1];
        jewels[i][j + 1] = tmp;

        if (isStreak(i , j) || isStreak(i, j + 1)){
          movesHintArray.push([i,j,i,j + 1]);
        }
        jewels[i][j + 1] = jewels[i][j];
        jewels[i][j] = tmp;
        
      }
    }
  }
  

  return movesHintArray.length;
}


function drawRandomHint() {
  if (gameState === 'pick' && movesHintArray.length > 0) {
    playerGemHint.play();
    const hint = movesHintArray[Math.floor(Math.random() * movesHintArray.length)];
    const first = document.querySelector(`#${gemIdPrefix}_${hint[0]}_${hint[1]}`);
    const second = document.querySelector(`#${gemIdPrefix}_${hint[2]}_${hint[3]}`);
    let player = first.animate(
      [
        // keyframes
        { 
         opacity : 0
        },
        { 
          opacity : 1
         }
      ],
         {
        // timing options
        duration: 100,
        iterations: 3
      }
    );
    player.onfinish = function (e){
      
      let player2 = second.animate(
        [
          // keyframes
          { 
           opacity : 0
          },
          { 
            opacity : 1
           }
        ],
           {
          // timing options
          duration: 100,
          iterations: 3
        }
      );
      
      
    }
  }
}

function getComplexity() {
  return (level<6)? level + 2 : 8;
}

function putHightscore(highscore){
  if (highscore.length > 10){
    highscore.splice(10);
  }
  localStorage.setItem("highscore", JSON.stringify(highscore));
  //highscoreArray = JSON.parse(localStorage.getItem("highscoreArray"));  
}

function getHightscore(){
  let highscoreArray = [];
  highscoreArray = JSON.parse(localStorage.getItem("highscore"));
  if (gameGlobalState === 'pause'){
    if (highscoreArray){
      let i = 1;
      highscoreForm.innerHTML = `<div class="game-global-state">Game Paused</div>`;
      highscoreArray.forEach(item =>{
        const scrItem = document.createElement('div');
        scrItem.classList.add('highscore-line');
        scrItem.innerHTML = `<span>${i}</span><span>${item[0]}</span><span>${item[1]}</span>`;
        highscoreForm.append(scrItem);
        i++;
      });
      const infoItem = document.createElement('div');
      infoItem.classList.add('info-current-score');
      infoItem.innerHTML = `<span>You Name is ${userName}</span><span>You Score is ${score}</span>`;
      highscoreForm.append(infoItem);
      buttonScoreConfirm.textContent = 'Play';


    }else{
      //if highscore is empty
      highscoreForm.innerHTML = `<div class="game-global-state">Game Paused</div>
                                  <div>Highscore is Empty</div>
                                  <div>You score is ${score}</div>`;
      buttonScoreConfirm.textContent = 'Play';
    }

  }else{
   
    if (highscoreArray){
      let n = 0;
      while (n < highscoreArray.length && highscoreArray[n][1] > score){
        
        n++;
      }
      highscoreArray.splice(n,0,[userName, score]);
      putHightscore(highscoreArray);
      let i = 1;
      highscoreForm.innerHTML = `<div class="game-global-state">Game Over</div>`;
      
        highscoreArray.forEach(item =>{
          const scrItem = document.createElement('div');
          scrItem.classList.add('highscore-line');
          scrItem.innerHTML = `<span>${i}</span><span>${item[0]}</span><span>${item[1]}</span>`;
          highscoreForm.append(scrItem);
          i++;
        });
        const infoItem = document.createElement('div');
        infoItem.classList.add('info-current-score');
        infoItem.innerHTML = `<span>Your Name is ${userName}</span>
                              <span>Your Score is ${score}</span>
                              <span>Your position in Highscore is ${(n > 9)?'none': n + 1}</span>`;
        highscoreForm.append(infoItem);
        buttonScoreConfirm.textContent = 'Play Again';
      }else{
        
        highscoreArray = [];
        highscoreArray.push([userName, score]);
        putHightscore(highscoreArray);
        let i = 1;
        highscoreForm.innerHTML = `<div class="game-global-state">Game Over</div>`;
          highscoreArray.forEach(item =>{
            const scrItem = document.createElement('div');
            scrItem.classList.add('highscore-line');
            scrItem.innerHTML = `<span>${i}</span><span>${item[0]}</span><span>${item[1]}</span>`;
            highscoreForm.append(scrItem);
            i++;
          });
          const infoItem = document.createElement('div');
          infoItem.classList.add('info-current-score');
          infoItem.innerHTML = `<span>Your Name is ${userName}</span>
                                <span>Your Score is ${score}</span>
                                <span>Your position in Highscore is 1</span>`;
          highscoreForm.append(infoItem);
          buttonScoreConfirm.textContent = 'Play Again';
      }
  }
}


function onTimer() {
  time--;
  if (time >= 0 && gameGlobalState !== 'pause') {
    setTimeout(onTimer,1000);
    drawStatField();
  }else{
    if (time < 0){
      playerGameOver.play();
      isRunning = false;
      gameGlobalState = 'over';
      getHightscore();
      highscoreHideForm.classList.remove('hide');
      mainField.style.display = 'none';
    }
  }
}


function onEnterUserName(event){
  event.preventDefault();
  playerLogo.play();
  if(event.target[0].value){
  userName = event.target[0].value;
  };
  ready();
}

function drawHighscoreAndPaused(){
  gameGlobalState = 'pause';
  getHightscore();
  highscoreHideForm.classList.remove('hide');
  mainField.style.display = 'none';
  //bodyContainer.classList.add('draw-form');
}

function confirmScore(){
  if (gameGlobalState === 'pause'){
    gameGlobalState = 'game';
    onTimer();
    highscoreHideForm.classList.add('hide');
    mainField.style.display = 'flex';
  }else{
    gameField.innerHTML = '<div id = "marker"></div></div>';
    selectedCoordinates = [-1,-1];
    putCoordinates = [-1, -1];
    movingItems = 0;
    time = 10; 
    level = 1;
    score = 0;
    moves = 0;
    ready();
    gameGlobalState = 'game';
    highscoreHideForm.classList.add('hide');
    mainField.style.display = 'flex';
  }
}

function playLogo(){
  playerLogo.play()
}


//########################################
//function cache theme images from website
//########################################
function preloadImages(){
  for (let i = 0; i < 9; i++){
    const img = new Image();
    img.src = `assets/png/${i}.png`;
  };
};

preloadImages();
//ready();