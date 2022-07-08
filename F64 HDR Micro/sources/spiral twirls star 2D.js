/*
  Spiral twirls star 2D
  
  This is "Spiral twirls 2D" (ChrisNZ) modified with some code from 
  "Geometry Morphing Demo 2D" (Zranger1) to mask to a star shape.
  Mixed by wizard.
  
  A configurable 2D pattern that creates a variety of rotating and swirling
  circular and spiral effects masked to a star.
  
*/

//from Geometry Morphing Demo
var objectSize = 0.4;
var lineWidth = 0.05;
export function sliderSize(v) {
  objectSize = .9 * v;
}
export function sliderLineWidth(v){
  lineWidth = 0.25 * v * v;
}


var twistSpeed = .015
var rotateSpeed = .002
var startingColor = .3
var colorSpeed = .015
var twist, rotation, colorShift, arms
export var starRotateSpeed = .002 //added for rotating the star
var starRotationTimer = timer(starRotateSpeed)

// How quickly the spiral should rotate back and forth
export function sliderTwistSpeed(v) { twistSpeed = v = 0 ? 0 : .015 / v }

// How quickly the entire pattern should rotate
export function sliderRotationSpeed(v) { rotateSpeed = v = 0 ? 0 : .005 / v }

// What initial colors to display. If colorSpeed is zero then the pattern will
// stay this color
export function sliderInitialColor(v) { startingColor = v * 2 }

// How quickly the colors of the pattern should change
export function sliderColorSpeed(v) { colorSpeed = v = 0 ? 0 : .015 / v }

// How many arms of symmetry the pattern should have (1-3)
export function sliderArms(v) { arms = 1 + floor(v * 2.999) }

//how fast to rotate the star mask
export function sliderStarRotation(v) {
  starRotateSpeed = triangle(v)
  starRotateSpeed = pow(10, (starRotateSpeed*starRotateSpeed -.5)*4)
  if (v < .5)
    starRotateSpeed = -starRotateSpeed
  timerSetInterval(starRotationTimer, starRotateSpeed)
}


export function beforeRender(delta) {
  twist = wave(time(twistSpeed)) * 2 - 1
  rotation = time(rotateSpeed)
  colorShift = time(colorSpeed)
  
  resetTransform()
  translate(-.5, -.5)
  scale(2,2)
  
  // rotate entire scene
  var theta = PI2 * timerNow(starRotationTimer);
  rotate(theta);  
}

export function render2D(index, x, y) {
  if (hexStar(x, y, objectSize) > lineWidth)
    return
  
  dist = hypot(x,y)
  angle = (atan2(y, x) + PI) / PI / 2
  angle += dist * twist / 2
  
  h = angle * arms - rotation + 10
  h = h - floor(h)
  v = (1.01 - dist) * (h < .5 ? h * h * h : h)
  h = (h + startingColor) / 2 + colorShift
  
  hsv(h, 1, v)
}

// Experimentally-derived isometric projection. YMMV.
export function render3D(index, x0, y0, z0) {
  x = x0 / 3
  y = y0 / 3 + 0.68
  z = z0 / 3 - 0.75
  px = 0.4 * (1.71 * x - 1.71 * z)
  py = 0.4 * (x + 2 * y + z)
  render2D(index, px, py)
}

// Render the line sliced across the horizon, y = .5
export function render(index) {
  pct = index / pixelCount
  render2D(index, pct, 0.5)
}


//from Geometry Morphing Demo
function signum(a) {
  return (a > 0) - (a < 0)
}

function hexStar(x,y,r) {
  // rescale to pointy parts of star
  x = abs(x*1.73205); y = abs(y*1.73205); 
  dot = 2 * min(-0.5*x + 0.866025 * y,0);
  x -= dot * -0.5; y -= dot * 0.866025;
  
  dot = 2 * min(0.866025*x + -0.5 * y,0);
  x -= dot * 0.866025; y -= dot * -0.5;
  
  x -= clamp(x, r * 0.57735, r * 1.73205);
  y -= r;
  return signum(y) * hypot(x,y) / 1.73205;
}


//timer utility functions for smooth speed adjustment
function timer(interval) {
  return [0, interval]
}

function timerSetInterval(timer, interval) {
  var p1 = time(timer[1]) //measure the current interval's value
  var p2 = time(interval) //measure the new interval's value
  //calculate the phase difference between these
  timer[0] = mod(timer[0] + p1 - p2, 1)
  timer[1] = interval
}

function timerNow(timer) {
  return (time(timer[1]) + timer[0]) % 1
}
