// A Breakout-style game for codeheart.js written in about two hours
// for #1GAM by Morgan McGuire. http://casual-effects.com
//
// Uses CC0 graphics by Kenny.nl downloaded from:
//
//    http://opengameart.org/content/puzzle-game-art
//
// Uses CC0 audio by Kenny.nl, CC-BY licensed title song
// http://www.freesound.org/people/zagi2/sounds/184413/ b y Zagi2, 
// and CC-BY licensed background song
// http://www.freesound.org/people/rap2h/sounds/151539/ by rap2h

///////////////////////////////////////////////////////////////
//                                                           //
//                    CONSTANT STATE                         //

var BACKGROUND_COLOR1   = "#465a89";
var BACKGROUND_COLOR2   = "#cc8833";
var BACKGROUND_COLOR3   = "#ffbb88";

var PADDLE_SPEED       = 1100; // pixels per second

// Coordinates of the on-screen keys (for mobile)
var TOUCH_KEY_X        = 100;
var TOUCH_KEY_Y        = 1700;
var TOUCH_KEY_RADIUS   = 100;
var TOUCH_KEY_COLOR    = makeColor(1, 1, 1, 0.1);
var TOUCH_KEY_ACTIVE_COLOR = makeColor(1, 1, 1, 0.9);

var LEFT_KEY_CODE      = asciiCode("A");
var RIGHT_KEY_CODE     = asciiCode("D");
var LEFT2_KEY_CODE     = 37;
var RIGHT2_KEY_CODE    = 39;

var BALL_IMAGE         = loadImage("ballGrey.png");
var PADDLE_IMAGE       = loadImage("paddleRed.png");
var BLUE_BRICK_IMAGE   = loadImage("element_blue_rectangle.png");
var YELLOW_BRICK_IMAGE = loadImage("element_yellow_rectangle.png");
var GREEN_BRICK_IMAGE  = loadImage("element_green_rectangle.png");
var PURPLE_BRICK_IMAGE = loadImage("element_purple_rectangle.png");
var STAR_IMAGE         = loadImage("particleSmallStar.png");

var DELTA_TIME         = 1.0 / 30.0;

var WALL_SOUND         = loadSound("wall.mp3");
var PADDLE_SOUND       = loadSound("paddle.mp3");
var BRICK1_SOUND       = loadSound("brick1.mp3");
var BRICK2_SOUND       = loadSound("brick2.mp3");
var BRICK3_SOUND       = loadSound("brick3.mp3");
var BRICK4_SOUND       = loadSound("brick4.mp3");
var LAUNCH_SOUND       = loadSound("launch.mp3");
var LOST_BALL_SOUND    = loadSound("lostball.mp3");
var GAME_OVER_SOUND    = loadSound("gameover.mp3");
var WIN_SOUND          = loadSound("win.mp3");
var TITLE_SOUND        = loadSound("title.mp3");
var BACKGROUND_SOUND   = loadSound("background.mp3");

var BALL_START_SPEED   = 500;

// On each collision
var BALL_SPEEDUP       = 1.015;

var Mode = Object.freeze({
    TITLE     : "TITLE", 
    PLAYING   : "PLAYING",
    RESET     : "RESET",
    GAME_OVER : "GAME_OVER"
});

///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //

// Objects with width, height, image, angle, center, and velocity
var ball;
var paddle;

// Array of brick objects that disappear when hit but also bounce the ball
var brickArray;

// Array of star objects, just for making the background pretty
var starArray;

// Map of keys that are currently pressed
var keyActive = {};

var score;

var ballsLeft;

var backgroundGradient;

var mode;

var frame;

// Tell codeheart.js that we want a portrait orientation game
defineGame("Brick Breaker", "Morgan McGuire", "", "V", false);

///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //

function onSetup() {
    fillRectangle(0, 0, screenWidth, screenHeight, makeColor(0.1, 0.2, 0.2));

    ball = {
        angle:    0,
        center:   vec2(screenWidth / 2, screenHeight / 2),
        size:     vec2(22 * 2,22 * 2),
        image:    BALL_IMAGE,
        velocity: vec2(BALL_START_SPEED, -BALL_START_SPEED)
    };

    paddle = {
        angle:    0,
        image:    PADDLE_IMAGE,
        size:     vec2(104 * 2, 24 * 2),
        center:   vec2(screenWidth / 2, screenHeight - 350)
    };

    makeStars();
    makeBricks();

    backgroundGradient = _ch_ctx.createLinearGradient(0, 0, 0, screenHeight);
    backgroundGradient.addColorStop(0.40, BACKGROUND_COLOR1);
    backgroundGradient.addColorStop(0.85, BACKGROUND_COLOR2);
    backgroundGradient.addColorStop(1.00, BACKGROUND_COLOR3);

    if (isMobile) {
        setTouchKeyCircle(LEFT_KEY_CODE, TOUCH_KEY_X, TOUCH_KEY_Y, TOUCH_KEY_RADIUS, "\u25C0");
        setTouchKeyCircle(RIGHT_KEY_CODE, screenWidth - TOUCH_KEY_X, TOUCH_KEY_Y, TOUCH_KEY_RADIUS, "\u25B6");
    }

    ballsLeft = 3;
    score = 0;
    mode = Mode.TITLE;
    frame = 0;

    stopSound(BACKGROUND_SOUND);
    playSound(TITLE_SOUND, true);
}


function onTouchStart(x, y, id) {
    // Touch keys will prevent this from being called.
    // Mouse will be routed through here.
    onAnyKeyPressed();
}


function onGamepadStart(buttonId, gamepadId, isDirection) {
    if (! isDirection) {
        onAnyKeyPressed();
    }
}


function onGamepadMove(x, y, stickId, gamepadId) {
    var threshold = 0.5;

    // Use the gamepad to force key strokes
    keyActive[RIGHT_KEY_CODE] = false;
    keyActive[LEFT_KEY_CODE] = false;
    if (x > threshold) {
        keyActive[RIGHT_KEY_CODE] = true;
    } else if (x < -threshold) {
        keyActive[LEFT_KEY_CODE] = true;
    }
}


function onKeyStart(key) {
    keyActive[key] = true;

    if ((key !== LEFT_KEY_CODE) && 
        (key !== RIGHT_KEY_CODE) &&
        (key !== LEFT2_KEY_CODE) && 
        (key !== RIGHT2_KEY_CODE)) {

        // Some key was pressed
        onAnyKeyPressed();
    }
}


function onAnyKeyPressed() {
    switch (mode) {
    case Mode.TITLE:
        stopSound(TITLE_SOUND);
        playSound(BACKGROUND_SOUND, true);
        // Fall through

    case Mode.RESET:
        ball.velocity.x = sign(ball.velocity.x) * BALL_START_SPEED;
        ball.velocity.y = -BALL_START_SPEED;
        playSound(LAUNCH_SOUND);
        playSound(BACKGROUND_SOUND, true);
        mode = Mode.PLAYING;
        break;
        
    case Mode.GAME_OVER:
        reset();
        break;
    }
}


function onKeyEnd(key) {
    keyActive[key] = false;
}


function onTick() {
    ++frame;

    if (mode !== Mode.GAME_OVER) {
        doPhysics();
    }

    doGraphics();
}

///////////////////////////////////////////////////////////////
//                                                           //
//                      HELPER RULES                         //

function doPhysics() {
    // Move the paddle
    var left  = keyActive[LEFT_KEY_CODE]  || keyActive[LEFT2_KEY_CODE];
    var right = keyActive[RIGHT_KEY_CODE] || keyActive[RIGHT2_KEY_CODE];

    if (left && ! right) {
        paddle.center.x -= PADDLE_SPEED * DELTA_TIME;
    } else if (! left && right) {
        paddle.center.x += PADDLE_SPEED * DELTA_TIME;
    }

    // Restrict the paddle to the screen
    paddle.center.x = min(screenWidth - paddle.size.x / 2, max(paddle.size.x / 2, paddle.center.x));

    // Bounce off walls if the ball is overlapped with a wall AND it
    // is still moving in that direction.  If we don't test the
    // velocity direction, then we could get stuck bouncing back and
    // forth inside of a wall.
    if (((ball.center.x < ball.size.x / 2) && (ball.velocity.x < 0)) ||
        ((ball.center.x > screenWidth - ball.size.x / 2) && (ball.velocity.x > 0))) {
        if (ball.center.y < screenHeight) {
            // Don't play sounds when the ball is below the bottom of the screen
            playSound(WALL_SOUND);
        }
        ball.velocity.x = -ball.velocity.x;
    }

    if ((ball.center.y < ball.size.y / 2) && (ball.velocity.y < 0)) {
        // Bounce off top
        ball.velocity.y = -ball.velocity.y;
        playSound(WALL_SOUND);
    }

    if ((ball.center.y > screenHeight * 1.1) && (ball.velocity.y > 0)) {
        // Ball went off the bottom of the screen
        if (ballsLeft > 0) {
            stopSound(BACKGROUND_SOUND);
            playSound(LOST_BALL_SOUND);
            --ballsLeft;
            mode = Mode.RESET;

            // Sometimes change the ball direction
            if (randomInteger(0, 1) === 1) {
                ball.velocity.x *= -1;
            }
            ball.velocity.y = -abs(ball.velocity.y);
        } else {
            playSound(GAME_OVER_SOUND);
            mode = Mode.GAME_OVER;
        }
    }

    // Bounce off the paddle if it overlaps the ball and AND the ball is moving down on the screen.
    if (overlaps(ball.center.x, ball.center.y, ball.size, paddle) &&
        (ball.velocity.y > 0)) {
        playSound(PADDLE_SOUND);
        ball.velocity.y = -ball.velocity.y;
    }

    doBrickPhysics();

    // Move the ball
    ball.center.x = ball.center.x + ball.velocity.x * DELTA_TIME;
    ball.center.y = ball.center.y + ball.velocity.y * DELTA_TIME;

    if ((mode === Mode.RESET) || (mode === Mode.TITLE)) {
        // Keep the ball on the paddle in reset mode
        ball.center.x = paddle.center.x;
        ball.center.y = paddle.center.y - (paddle.size.y + ball.size.y) / 2;
    }

    doStarPhysics();
}


/* Returns true if the object at (x, y) with the given size overlaps
   the obstacle. 

   I chose to not pass two objects because often the first object is
   moving and the calling function needs to alter its position based
   on velocity for a test. */
function overlaps(x, y, size, obstacle) {
    // This first paren is really important. Without it, Javascript will immediately
    // end the function. This is one of the few places where newlines and whitespace
    // matter in Javascript.
    return (
        // Left edge of obstacle
        ((x + size.x / 2) > (obstacle.center.x - obstacle.size.x / 2)) &&

        // Right edge of obstacle
        ((x - size.x / 2) < (obstacle.center.x + obstacle.size.x / 2)) &&

        // Top edge of obstacle
        ((y + size.y / 2) > (obstacle.center.y - obstacle.size.y / 2)) &&

        // Bottom edge of obstacle
        ((y - size.y / 2) < (obstacle.center.y + obstacle.size.y / 2)));
}


function doGraphics() {
    // Draw background
    fillRectangle(0, 0, screenWidth, screenHeight, backgroundGradient);
    forEach(starArray, drawObject);

    // Draw the objects
    forEach(brickArray, drawObject);
    drawObject(ball);
    drawObject(paddle);

    if (isMobile) {
        // Draw the touch keys dimly
        _ch_ctx.globalAlpha = 0.25;
        drawTouchKeys();
        _ch_ctx.globalAlpha = 1.0;
    }

    fillText(numberWithCommas(score), screenWidth - 25, 25, "#DDD", "bold 80px Arial", "right", "top");

    for (var i = 0; i < ballsLeft; ++i) {
        drawImage(ball.image, 25 + ball.image.width * 1.5 * i, 60);
    }


    switch (mode) {
    case Mode.GAME_OVER:
        var style = "bold 200px sans-serif";
        // Drop shadow
        fillText("GAME OVER", screenWidth / 2, screenHeight / 2 + 10, makeColor(0,0,0,0.075), style, "center", "middle");
        fillText("GAME OVER", screenWidth / 2, screenHeight / 2, "#FFF", style, "center", "middle");
        strokeText("GAME OVER", screenWidth / 2, screenHeight / 2, "#000", style, 3, "center", "middle");
        break;

    case Mode.TITLE:
        var style = "bold 200px serif";
        fillText("Brick Breaker", screenWidth / 2, screenHeight * 0.4 - 5, BACKGROUND_COLOR3, style, "center");
        fillText("Brick Breaker", screenWidth / 2, screenHeight * 0.4 + 3, "#247", style, "center");
        fillText("Brick Breaker", screenWidth / 2, screenHeight * 0.4, 
                 (frame % 4 === 0) ? BACKGROUND_COLOR3 : BACKGROUND_COLOR2, style, "center");

        fillText("by Morgan McGuire for #1GAM", screenWidth / 2, screenHeight - 150,
                 "#FFF", "45px sans-serif", "center", "bottom");
        fillText("uses CC0 assets by Kenney.nl", screenWidth / 2, screenHeight - 75,
                 "#FFF", "45px sans-serif", "center", "bottom");
        fillText("press any key or gamepad button, or tap the screen to play", 
                 screenWidth / 2, screenHeight - 25,
                 "#FFF", "45px sans-serif", "center", "bottom");
        break;
    }
}


function drawObject(object) {
    drawTransformedImage(object.image, object.center.x, object.center.y, object.angle,
                         object.size.x / object.image.width, object.size.y / object.image.height);
}

////////////////////////////////////////////////////////////////////////////////////
//
//                                      Bricks

function makeBricks() {
    var ROWS    = 5;
    var COLUMNS = floor(screenWidth / 128);
    var imageByRow = [YELLOW_BRICK_IMAGE, GREEN_BRICK_IMAGE, BLUE_BRICK_IMAGE, PURPLE_BRICK_IMAGE];
    var soundByRow = [BRICK1_SOUND, BRICK2_SOUND, BRICK3_SOUND, BRICK4_SOUND];

    brickArray = makeArray(ROWS * COLUMNS);

    for (var row = 0, i = 0; row < ROWS; ++row) {
        for (var column = 0; column < COLUMNS; ++column, ++i) {
            brickArray[i] = {
                angle:   0,
                center:  vec2(128 * column + 64, 300 + 64 * row),
                image:   imageByRow[min(row, imageByRow.length - 1)],
                sound:   soundByRow[min(row, imageByRow.length - 1)],
                size:    vec2(128, 64),
                points:  (imageByRow.length - min(row, imageByRow.length - 1)) * 100
            };
        } // col
    } // row
}


function doBrickPhysics() {
    var ballNextX = ball.center.x + ball.velocity.x * DELTA_TIME;
    var ballNextY = ball.center.y + ball.velocity.y * DELTA_TIME;

    forEach(brickArray, function (brick) {
        if (overlaps(ball.center.x, ballNextY, ball.size, brick)) {
            // The brick is hit vertically

            // Reflect the ball
            ball.velocity.x *= BALL_SPEEDUP;
            ball.velocity.y *= -BALL_SPEEDUP;

            score += floor(brick.points * BALL_SPEEDUP);

            // Remove the brick from the game
            playSound(brick.sound);
            return forEach.REMOVE;
        } else if (overlaps(ballNextX, ball.center.y, ball.size, brick)) {
            // The brick is hit horizontally

            // Reflect the ball
            ball.velocity.x *= -BALL_SPEEDUP;
            ball.velocity.y *= BALL_SPEEDUP;


            score += brick.points;
            playSound(brick.sound);

            // Remove the brick from the game
            return forEach.REMOVE;
        }
    });

    if (brickArray.length === 0) {
        playSound(WIN_SOUND);
        mode = Mode.GAME_OVER;
    }
}


////////////////////////////////////////////////////////////////////////////////////
//
//                                      Stars

function makeStars() {
    starArray = makeArray(25);
    for (var i = 0; i < starArray.length; ++i) {
        starArray[i] = {
            angle:     randomReal(0, Math.PI),
            center:    vec2(randomInteger(0, screenWidth), randomInteger(0, screenHeight)),
            velocity:  vec2(0, randomInteger(8, 25)),
            image:     STAR_IMAGE,
            size:      vec2(10 * 2, 10 * 2)
        };
    }
}


function doStarPhysics() {
    // Move the stars down the screen
    forEach(starArray, function(star) {
        star.center.y = star.center.y + star.velocity.y * DELTA_TIME;
        star.angle += star.velocity.y * DELTA_TIME * 0.1;

        if (star.center.y > screenHeight) {
            // This star moved off the bottom. Put it back up at a random location.
            star.center.y = 0;
            star.center.x = randomInteger(0, screenWidth);
            star.velocity.y = randomInteger(10, 100);
        }
    });
}


/* From http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript */
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
