///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //
// Number of the shape that was clicked on
var saw = 1;



///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //
//
function onSetup() {
}

function onKeyStart(key){
    if (key === 40) {
        if (saw < 4) {
            saw = saw + 1;
        }
    } else if (key === 38 ) {
        if (saw > 0) {
            saw = saw - 1;
        }
    }
}

// Space = 32 (keycode)
function onTick() {
    var WHITE  = makeColor(1.0, 1.0, 1.0);
    var RED    = makeColor(0.8, 0.0, 0.0);
    var GREEN  = makeColor(0.0, 0.8, 0.0);
    var PURPLE = makeColor(0.7, 0.0, 0.4);
    var ORANGE = makeColor(0.9, 0.5, 0.1);
    var YELLOW = makeColor(1.0, 0.9, 0.0);
    var BLACK  = makeColor(0.0, 0.0, 0.0);
    var BLUE   = makeColor(0.0, 0.0, 0.5);
    fillRectangle(0, 0, screenWidth, screenHeight, WHITE);
    
    
    // Triangle  
   var x = 1000;
   var y = 370;
   var points = [];
   var radius = 100 / sqrt(3);
   var rotate = 2 * Math.PI / 12;
   var i = 0;
   while (i < 3) {
       var angle = 2.0 * Math.PI * i / 3 + rotate;
       insertBack(points, x + cos(angle) * radius);
       insertBack(points, y + sin(angle) * radius);
       i = i + 1;
   }
    fillPolygon(points, GREEN);
    
   // Outline
   if (saw === 0) {
       strokePolygon (points,BLACK,10,true);
   }

// Big Rhombus  
var x = 1500;
var y = 370;
var points = [];
var radius = 100 / sqrt(3);
var rotate = 2 * Math.PI / 12;
var i = 0;
while (i < 3) {
    var angle = 2.0 * Math.PI * i / 3 + rotate;
    insertBack(points, x + cos(angle) * radius);
    insertBack(points, y + sin(angle) * radius);
    i = i + 1;
}
insertAt(points, 2, x);
insertAt(points, 3, y + (1 - 2 * cos(Math.PI * 2 / 3)) * radius);
 fillPolygon(points, BLUE);
 
// Outline
if (saw === 5) {
    strokePolygon (points,BLACK,10,true);
}
   
    // Square
x = 1000;
y = 700;
   var points = [];
   var radius = sqrt(5000);
   var rotate = 2 * Math.PI / 8;
   var i = 0;
   while (i < 4) {
       var angle = 2.0 * Math.PI * i / 4 + rotate;
       insertBack(points, x + cos(angle) * radius);
       insertBack(points, y + sin(angle) * radius);
       i = i + 1;
   }
   
    fillPolygon(points, ORANGE);
    if (saw === 1) {strokePolygon (points,BLACK,10,true);
                   } 
                       
        
    // Hexagon
   x = 1000;
   y = 500
   var points = [];
   var radius = 100;
   var i = 0;
   while (i < 6) {
       var angle = 2.0 * Math.PI * i / 6;
       insertBack(points, x + cos(angle) * radius);
       insertBack(points, y + sin(angle) * radius);
       i = i + 1;
   }
   fillPolygon(points, YELLOW);
   
   
   
   // Outline
   if (saw === 2) {
       strokePolygon (points,BLACK,10,true);
   }
    
    
    // Trapezoid
  x = 1400;
  var points = [];
  var radius = 100;
  var i = 0;
  while (i < 4) {
      var angle = 2.0 * Math.PI * i / 6;
      insertBack(points, x + cos(angle) * radius);
      insertBack(points, y + sin(angle) * radius);
      i = i + 1;
  }
  
  fillPolygon(points, RED);
  
  
  
// Outline
if (saw === 3) {
    strokePolygon (points,BLACK,10,true);
}
 
    
}
