var score = 0;
var highScore = 0;
var combo = 1;
var shownCombo = 1;
var tn = 0;//czy gra trwa
var timeLeft = 5;
var balls = [];
var particles = [];
var animationNow = undefined;
var mouse = {
    x : undefined,
    y : undefined,
    clicked : false
}


colors = ["#FF1178", "#FE0000", "#FFF205", "#01FFF4", "#7cFF01"];
const playButton =  document.getElementById('start');
const gameOverButton = document.getElementById('gameOverButton');
const timer = document.getElementById('timer');
const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


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
    tn = 0;
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
    console.log(balls.length);
    score = 0;
    combo = 1;
    timeLeft = 5;
    tn = 1;

    //.style.cursor = "help";
    showScore();
    hideMenu(main);
    showMenu(stats);
    setTimer();
    animate();
    renderBallsInterval();
}
//czemu szybkosc sie zwyieksza za druga gra?

class ball
{
    constructor()
    {
        this.color = colors[(Math.round(Math.random()*10))%5];
        this.siz = 40+ Math.random()*10;

        this.x = Math.floor(Math.random() * window.innerWidth);
        this.speedX = Math.round((Math.random() - 0.5) * 8);
        this.y = Math.floor(window.innerHeight);
        this.speedY = 10 + Math.floor(Math.random()*3);

        this.isBomb = false;
        if(this.color == "#FE0000")
            this.isBomb = true;
    }
    update()
    {
        this.x += this.speedX;
        this.y -= this.speedY;
        this.speedY-=0.1;
    }    
    draw()
    {
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x, this.y, this.siz, 0, Math.PI * 2);
        c.fill();
        this.update();
    }
}

function renderBalls()
{
    for(var i = 0; i < balls.length; ++i)
    {
        balls[i].draw();
        if(balls[i].y > window.innerHeight + balls[i].siz)
        {
            balls.splice(i, 1);
            i--;
        }
        else if(Math.abs(mouse.x - balls[i].x) <= balls[i].siz && Math.abs(mouse.y - balls[i].y) <= balls[i].siz && mouse.clicked)
        {
            if(balls[i].isBomb == true)
            {
                //BOOM
            }
            else 
            {
                //produce particles
            }
            balls.splice(i, 1);
            i--;
        }
    }
}
function renderBallsInterval()
{
    var interv = setInterval(()=>{
        if(tn == 0)
            clearInterval(interv);
        var quantity = Math.floor(Math.random()*5)+1;
        for(var i = 0; i < quantity; ++i)
        {
            balls.push(new ball());
        }
    }, 1000);
}


function animate()
{
    c.clearRect(0,0, innerWidth, innerHeight);
    if(!tn && balls.length == 0)
        cancelAnimationFrame(AnimationNow);
    renderBalls();

    AnimationNow = requestAnimationFrame(animate);
}


//Game logic


showMenu(main);
playButton.addEventListener('click', () => {
    startGame();
})
gameOverButton.addEventListener('click', () => {
    hideMenu(gameOver);
    showMenu(main);
})

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})


//mouse start
window.addEventListener('mousemove', (event)=>{
    mouse.x = event.x;
    mouse.y = event.y;
})

window.addEventListener('mousedown', () => {
    console.log("h");
    mouse.clicked = true;
})

window.addEventListener('mouseup', () => {
    mouse.clicked = false;
})
window.addEventListener('mouseout', () => {
    mouse.x = 0;
    mouse.y = 0;
    isMouseClicked = false;
})

// mouse end


