var score = "0";
var highScore = "0";
const playButton =  document.getElementById('start');

function showMenu(menu)
{
    menu.classList.add('open');
}
function hideMenu(menu)
{
    menu.classList.remove('open');
}

function setTimer()//do 3 sec countdown
{

} 
function startGame()
{   
    hideMenu(main);
    showMenu(stats);
    setTimer();
    setInterval(()=>{hideMenu(stats); showMenu(gameOver)}, 2000 );
}


showMenu(main);

playButton.addEventListener('click', () => {
    startGame();
})







