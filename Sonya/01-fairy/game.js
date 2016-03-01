///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //

var backgroundImage;

var fairyImage;
var fairyX;
var fairyY;
var fairyWidth;
var fairyHeight;

var jewelImage;
///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //

function onSetup() {
  backgroundImage = loadImage("mountains.jpg");
  fairyImage = loadImage("fairy.png");
  jewelImage = loadImage("jewel.png");
  fairyX = 100;
  fairyY = 100;
  fairyWidth = 300;
  fairyHeight = fairyWidth;
  fairyXSpeed = 5;
  fairyYSpeed = 0;

  gravity = 0.8;
}


// Called 30 times or more per second
function onTick() {
  if (fairyX < screenWidth + fairyWidth) {
    drawEverything();
    movefairy();
  }
}


function drawEverything() {
  drawImage(backgroundImage, 0, 0, screenWidth, screenHeight);
  // Middle
  drawImage(jewelImage, 950, 550);
  drawImage(jewelImage, 950, 350);
  // Right
  drawImage(jewelImage, 1050, 450);
  drawImage(jewelImage, 1150, 550);
  drawImage(jewelImage, 1050, 650);
  drawImage(jewelImage, 950, 750);
  // Left
  drawImage(jewelImage, 850, 450);
  drawImage(jewelImage, 750, 550);
  drawImage(jewelImage, 850, 650);
  drawTransformedImage(fairyImage, fairyX, fairyY, 0, fairyWidth / fairyImage.width, fairyHeight / fairyImage.height);
}

//ahhhhhhhhhhhhhhh
var time = 0;
function movefairy() {
  time = time + 1/30;
  fairyX = screenWidth / 2 + cos(time) * 300;
  fairyY = screenHeight / 2 + sin(time) * 300;
}
