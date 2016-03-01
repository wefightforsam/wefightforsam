///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //

var backgroundImage;

var fairyImage;
var fairyX;
var fairyY;
var fairyWidth;
var fairyHeight;


///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //

function onSetup() {
  backgroundImage = loadImage("waterfall.jpg");
  fairyImage = loadImage(" bir.png");

  fairyX = 100;
  fairyY = 100;
  fairyWidth = 600;
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

    drawTransformedImage(fairyImage,
        screenWidth / 2 + cos(time * 0.5) * 1500,
        -200 + sin(time * 0.5) * 500,
        0, fairyWidth / fairyImage.width, fairyHeight / fairyImage.height);

    drawTransformedImage(fairyImage,
        screenWidth / 2 + cos(time * 0.5 + 3) * 1300,
        -200 + sin(time * 0.5 + 3) * 800,
        0, fairyWidth / fairyImage.width, fairyHeight / fairyImage.height);
}

//ahhhhhhhhhhhhhhh
var time = 0;
function movefairy() {
  time = time + 1/30;
}
