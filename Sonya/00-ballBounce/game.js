///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //

var backgroundImage;

var ballImage;
var ballX;
var ballY;
var ballWidth;
var ballHeight;
var ballXSpeed;
var ballYSpeed;
var gravity;
var ballBounce;

///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //

function onSetup() {
  backgroundImage = loadImage("mountains.jpg");
  ballImage = loadImage("ball.png");
  ballBounce = loadSound("bounce.mp3");
  ballX = 100;
  ballY = 100;
  ballWidth = 100;
  ballHeight = ballWidth;
  ballXSpeed = 5;
  ballYSpeed = 0;

  gravity = 0.8;
}


// Called 30 times or more per second
function onTick() {
  if (ballX < screenWidth + ballWidth) {
    drawEverything();
    moveBall();
  }
}


function drawEverything() {
  drawImage(backgroundImage, 0, 0, screenWidth, screenHeight);
  drawTransformedImage(ballImage, ballX, ballY, 0, ballWidth / ballImage.width, ballHeight / ballImage.height);
}


function moveBall() {
  ballX = ballX + ballXSpeed;
  ballY = ballY + ballYSpeed;

  ballYSpeed = ballYSpeed + gravity;

  if (ballY > screenHeight * 95/100) {
    // bounce
    ballYSpeed = -ballYSpeed * 9/10;
    ballXSpeed = ballXSpeed * 95/100;
    playSound(ballBounce);
  }
}
