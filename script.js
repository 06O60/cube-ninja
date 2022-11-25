var score = 0;
var highScore = 0;
var combo = 1;
var shownCombo = 1;
var tn = 0;//czy gra trwa
var timeLeft = 30;
var balls = [];
var particles = [];
var strokes = [];
var bombs = [];
var animationNow = undefined;
var maximumExplosionSize = 30;
var mouse = {
    x : undefined,
    y : undefined,
    clicked : false
}
var lastTimeHit = -1;

colors = ["#FF1178", "#FE0000", "#FFF205", "#01FFF4", "#7cFF01", "#A24CC2", "#58F380", "#D9E716"];
const playButton =  document.getElementById('start');
const gameOverButton = document.getElementById('gameOverButton');
const timer = document.getElementById('timer');
const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');
const countDown = document.getElementById('countdown');
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

function finishGame(){
    tn = 0;
    document.getElementById('final-score').innerHTML = `YOUR SCORE: ${score}`;
    showMenu(gameOver);
    hideMenu(stats);
}


function showScore ()
{
    document.getElementById('scoreText').innerHTML = `SCORE: ${score}`;
    if(highScore < score || highScore == 0)
    {
        highScore = score;
        let helper = document.getElementsByClassName('highScoreText');
        for(var i = 0; i < helper.length; ++i)
            helper[i].innerHTML = `HIGHSCORE: ${score}`;
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
    timer.innerHTML = `<p>${minutes < 10 ? '0' : ''}${minutes}:${timeLeft-(minutes*60) < 10 ? '0' : ''}${timeLeft-(minutes*60)}`;
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
    animate();
    renderBallsInterval();
}
function countdown()
{
    let counter = 3;
    countDown.innerHTML = `${counter}`;
    var intervall = setInterval(()=>{

        counter--;
        if(counter == 0 || timeLeft <= 0)
        {
            countDown.innerHTML = ``;
            if(timeLeft > 0)
            {
                tn = 1;
                animate();
                renderBallsInterval();
            }
            clearInterval(intervall);
            return;
        }
        countDown.innerHTML = `${counter}`;
    }, 1000);
}

class particle
{
    constructor(x,y, color)
    {
        this.color = color;
        this.siz = 2 + Math.random()*10;

        this.x = x;
        this.speedX = Math.round((Math.random() - 0.5) * 8);
        this.y = y;
        this.speedY = Math.random() * 3 ;
    }
    update()
    {
        if(this.siz > 0.2)
            this.siz -= 0.1;
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
class ball
{
    constructor()
    {
        this.color = colors[(Math.round(Math.random()*10))%colors.length];
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
class bomb{
    constructor(x,y)
    {
        this.siz = Math.random()*10;
        this.speedSiz = 3;
        this.x = x + (Math.random()-0.5)*150;
        this.y = y + (Math.random()-0.5)*150;
        this.mxSize = 25 + Math.round(Math.random()*100);
        this.rgbG = Math.random()*100;
        this.color = `rgb(255,${this.rgbG}, 0)`;
    }
        update()
        {
            console.log(this.x, ' ',this.y);
            if(this.siz >= this.mxSize)
            {
                this.speedSiz *= (-1);
                this.siz += this.speedSiz;
            }
            else if(this.siz + this.speedSiz > 0)
                this.siz += this.speedSiz;
            else 
                this.siz = 0.2;

            this.rgbG += 2.5
             if(this.rgbG > 255)
                this.rgbG = 255;
            this.color = `rgb(255,${this.rgbG}, 0)`;
        }
        draw()
        {
            if(this.siz > 0)
            {
                c.fillStyle = this.color;
                c.beginPath();
                c.arc(this.x, this.y, this.siz, 0, Math.PI * 2);
                c.fill();
                this.update();
            }
        }
}

function explosion(idx)
{
    for(var i = 0; i < balls.length; ++i)
    {
        for(var j = 0; j < 7 + ((balls[i].siz)%5); ++j)
        {
            if(balls[i].isBomb == 0)
                particles.push(new particle(balls[i].x, balls[i].y, balls[i].color));
            else 
                bombs.push(new bomb(balls[i].x, balls[i].y));
        }
    }
    combo = 1;
    score -= Math.round(balls[idx].siz/10);
    if(score < 0)
        score = 0;
    showScore();

    balls = [];
    tn = -1;
    countdown();
}
function renderBalls()
{
    for(var i = 0; i < balls.length; ++i)
    {
        if(tn < 0)
        {
            balls = [];
            continue;
        }
        balls[i].draw();
        if(balls[i].y > window.innerHeight + balls[i].siz)
        {
            balls.splice(i, 1);
            i--;
        }
        else if(tn == 0)
            continue;
        else if(Math.abs(mouse.x - balls[i].x) <= balls[i].siz && Math.abs(mouse.y - balls[i].y) <= balls[i].siz && mouse.clicked)
        {
            if(balls[i].isBomb == true)
            {
                explosion(i);
                //BOOM
            }
            else 
            {
                for(var j = 0; j < 7 + ((balls[i].siz)%5); ++j)
                    particles.push(new particle(balls[i].x, balls[i].y, balls[i].color));
                score+= 6 - Math.round((balls[i].siz/10) );
                
                if(new Date().getTime() - lastTimeHit < 420)
                    combo ++;
                else 
                    combo = 1;
                lastTimeHit = new Date().getTime();

                showScore();
                //produce particles
            }
            balls.splice(i, 1);
            i--;
        }
    }

    for(var i = 0; i < particles.length; ++i)
    {
        particles[i].draw();
        if(particles[i].siz < 0.3)
        {
            particles.splice(i, 1);
            i--;
        }
    }

    for(var i = 0; i < bombs.length; ++i)
    {
        bombs[i].draw();
        if(bombs[i].siz < 0.3)
        {
            bombs.splice(i, 1);
            i--;
        }
    }
}
function renderBallsInterval()
{
    var interv = setInterval(()=>{
        if(tn <= 0)
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
    if(tn <= 0 && balls.length == 0 && particles.length == 0)
    {
        cancelAnimationFrame(animationNow);
        return;
    }

    renderBalls();
    renderMouse();
    animationNow = requestAnimationFrame(animate);
}
function renderMouse()
{//fst element is the ending of stroke
    let inc , dec, wdth = 1;
    for (let i = 1; i < strokes.length; i++) {
        inc = (strokes.length - i -1)/10;
        dec = 1-inc;
        c.strokeStyle = 'rgb(' + Math.floor(255) + ',' + Math.floor(200 - (255 * dec)) + ',' + Math.floor(200 - (255 * inc)) + ')';
        c.lineWidth= wdth;
        wdth+=0.75;

        c.beginPath();
        c.moveTo(strokes[i].x, strokes[i].y);
        c.lineTo(strokes[i-1].x, strokes[i-1].y);
        c.stroke();
        c.closePath();
    }
    if (strokes.length > 10) 
        strokes.shift();
}

showMenu(main);
playButton.addEventListener('click', () => {
    startGame();
})
gameOverButton.addEventListener('click', () => {
    hideMenu(gameOver);
    balls = [];
    particles = [];
    showMenu(main);
})

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

var prvX, prvY;
window.addEventListener('mousemove', (event)=>{
    if(mouse.clicked)
    {
        prvX = mouse.x;
        prvY = mouse.y;
        mouse.x = event.x;
        mouse.y = event.y;
        strokes.push({x: mouse.x, y: mouse.y, prx: prvX, pry: prvY});
    }
})

window.addEventListener('mousedown', (event) => {
    prvX = mouse.x;
    prvY = mouse.y;
    mouse.x = event.x;
    mouse.y = event.y;
    mouse.clicked = true;
})

window.addEventListener('mouseup', () => {
    mouse.x = 0;
    mouse.y = 0;
    mouse.clicked = false;
    strokes = [];
})
window.addEventListener('mouseout', () => {
    mouse.x = 0;
    mouse.y = 0;
    strokes = [];
    isMouseClicked = false;
})

// mouse end


