///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //

var backgroundImage

var babypandaImage;
var babypandaX;
var babypandaY;
var babypandaWidth;
var babypandaHeight;


///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //

function onSetup() {
  backgroundImage = loadImage("bamboo.jpg");
  babypandaImage = loadImage("babypanda.png");

  babypandaX = 600;
  babypandaY = 1100;
  babypandaWidth = 600;
  babypandaHeight = babypandaWidth;
}


// Called 30 times or more per second
function onTick() {

    drawEverything();

}


function onKeyStart(keycode) {
    if (keycode === 39) {
        babypandaX = babypandaX +100;
    } else if (keycode === 37) {
        babypandaX = babypandaX - 100;
    }

    if (keycode === 38) {
        babypandaY = babypandaY -100;
    } else if (keycode === 40) {
        babypandaY = babypandaY +100;
    }
    if (babypandaY > screenHeight){
        babypandaY = screenHeight;
    } else if (babypandaY < 0){
        babypandaY = 0;
    }
    if (babypandaX > screenWidth){
        babypandaX = screenWidth;
    } else if (babypandaX < 0){
        babypandaX = 0;
    }
}



function drawEverything() {
    drawImage(backgroundImage, 0, 0, screenWidth, screenHeight);

    fillCircle(1920/2,1280/2,50,makeColor(1,1,0));

    drawTransformedImage(babypandaImage,
        babypandaX, babypandaY,
        0,
        babypandaWidth / babypandaWidth.width,
        babypandaHeight /babypandaImage.height);


}
