var score = 0;
var highScore = 0;
var combo = 1;
var shownCombo = 1;
var tn = 0;//czy gra trwa
var timeLeft = 30;
colors = ["#FF1178", "#FE0000", "FFF205", "01FFF4", "7cFF01"];
const playButton =  document.getElementById('start');
const gameOverButton = document.getElementById('gameOverButton');
const timer = document.getElementById('timer');
const canvas = document.getElementById('canvas');

function showMenu(menu)
{
    menu.classList.add('open');
}
function hideMenu(menu)
{
    menu.classList.remove('open');
}
/*wyczyść pole gry*/
function finishGame(){
    showMenu(gameOver);
    hideMenu(stats);
}
/*na pozniej*/
function showScore ()
{
    document.getElementById('scoreText').innerHTML = `SCORE: ${score}`;
    if(highScore < score || highScore == 0)
    {
        highScore = score;
        document.getElementById('highScoreText').innerHTML = `HIGHSCORE: ${score}`;
    }
    if(shownCombo != combo)
    {
        shownCombo = combo;
        document.getElementById('combo').innerHTML = `${shownCombo}x`;
    }
}
function setTimer()
{
    var minutes = Math.floor(timeLeft/60);
    timer.innerHTML = `${minutes < 10 ? '0' : ''}${minutes}:${timeLeft-(minutes*60) < 10 ? '0' : ''}${timeLeft-(minutes*60)}`;
    var interv = setInterval(() => {
        if(timeLeft == 0) 
        {
            clearInterval(interv);
            finishGame();
        }
        timeLeft--;
        minutes = Math.floor(timeLeft/60);
        timer.innerHTML = `${minutes < 10 ? '0' : ''}${minutes}:${timeLeft-(minutes*60) < 10 ? '0' : ''}${timeLeft-(minutes*60)}`;
    }
    ,1000);
}
function startGame()
{   
    score = 0;
    combo = 1;
    timeLeft = 30;
    tn = 1;
    showScore();
    hideMenu(main);
    showMenu(stats);
    setTimer();
}

showMenu(main);
playButton.addEventListener('click', () => {
    startGame();
})
gameOverButton.addEventListener('click', () => {
    hideMenu(gameOver);
    showMenu(main);
})

//Game logic
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class blocks
{
    constructor()
    {
        this.color = colors[Math.random()%5];
        this.siz = 10;

        this.x = Math.floor(Math.random() * window.innerWidth);
        this.speedX = Math.round((Math.random() - 0.5) * 4);
        this.y = Math.floor(window.innerHeight);
        this.speedY = 10;
    }

    move()
    {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY-=0.1;
    }    
}





