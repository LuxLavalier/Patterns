/*
fractal flower
2021 Ben Hencke
*/

//*********** Settings ***********/
//set up the source matrix dimensions - match to your display for best results
//or set lower for a pixelated mosaic
var width = 8
var height = 8

//globals for dynamic settings
//*********** Settings ***********/

export var iterations = 5
export var drawLevels = 4 //skip drawing some starting iterations

export var scale = .035
export var speed = 7
export var fade = .9

export var angleRange1 = 1
export var angleRange2 = 1

export var replicas = 5
export var spacing = .2

export var useWhite = true
export var usePinwheel = true
export var wrapWorld = false


//globals for calculations
//*********** Settings ***********/
var pixels = array(width * height)
var hues = array(width * height)
var color, branchAngle1, branchAngle2, h, v

//*********** Globals for watching ***********/
export var iter //see how many iterations are run
export var maxValue //the brightest pixel
export var valueFactor = 20 //used to adjust brightness automatically

//*********** UI Controls ***********/
export function sliderIterations(v) {iterations = 1 + floor(v*8)}
export function sliderDrawLevels(v) {drawLevels = 1 + floor(v*8)}
export function sliderScale(v) {scale = v * v * .1}
export function sliderSpeed(v) {speed = 1 + ceil(v * 10) * 3}
export function sliderAngleRange1(v) {angleRange1 = v * 2}
export function sliderAngleRange2(v) {angleRange2 = v * 2}
export function sliderTrails(v) {fade = v && (v * .5 + .5)}
export function sliderReplicas(v) {replicas = 1 + floor(v*12)}
export function sliderSpacing(v) {spacing = v/2}
export function sliderWhiteMode(v) {useWhite = v > .5}
export function sliderPinwheelMode(v) {usePinwheel = v > .5}
export function sliderWrapMode(v) {wrapWorld = v > .5}

//*********** Utility Functions ***********/
//map an x and y into a 1D array
function getIndex(x, y) {
  var res = floor(x*width) + floor(y*height)*width
  return res
}

function blendHue(h1, v1, h2, v2) {
  v = v1+v2
  //rotate hues so that they are closer numerically
  if (h2 - h1 > .5)
    h2 -= 1
  if (h1 - h2 > .5)
    h1 -= 1
  //average the hues, weighted by brightness
  h = (h1 * v1 + h2 * v2) / v
}

//*********** Fractal Implementation ***********/
function fractal(x, y, a, i) {
  var index, l
  
  
  iter++ //keep track of how many calls we've made

  //move coordinates in direction vector for our angle
  
  //each iteration travels a smaller distance
  //but don't travel for the first iteration
  if (i < iterations)  {
    l = i * scale + scale
    x += sin(a) * l;
    y += cos(a) * l;
  }

  //make coordinates "wrap" around to the other side
  if (wrapWorld) {
    x = mod(x,.99999)
    y = mod(y,.99999)
  }
  
  //skip earlier levels, and only draw "on screen"
  if(i <= drawLevels && x >= 0 && x <= .99999 && y >= 0 && y <= .999999) {
    index = getIndex(x,y)
    
    // blendHue(hues[index], pixels[index], iter * .004 + color , hues[index] + 1)
    blendHue(hues[index], pixels[index], i * .1 + color, 1)
    
    hues[index] = h
    pixels[index] = v
  }
  
  if (--i > 0) {
    //if there are more iterations left, recurse to this function adding rotations for each branch
    fractal(x, y, a + branchAngle1, i)
    fractal(x, y, a + branchAngle2, i)
  }
}

//*********** Rendering ***********/

export function beforeRender(delta) {
  var startingAngle, i
  
  //update globals used by the fractal
  color = time(1 / speed)
  branchAngle1 = -1 + sin(wave(time(4.4 / speed))*PI2) * PI * angleRange1
  branchAngle2 = .5 + sin(wave(-time(11 / speed))*PI2) * PI * angleRange2

  startingAngle = sin(time(3 / speed) * PI2) * PI
  
  //fade out pixel values
  pixels.mutate(p => p*fade)
  
  iter = 0
  if (replicas > 1) {
    for (i = 0; i < replicas; i++) {
      if (usePinwheel) {
        //pinwheel - rotate petal in place
        fractal(0.5 + spacing * sin(i/replicas * PI2), 0.5 + spacing * cos(i/replicas * PI2), startingAngle + i/replicas * PI2, iterations)
      } else {
        //roate petals around center
        fractal(0.5 + spacing * sin(i/replicas * PI2 + startingAngle), 0.5 + spacing * cos(i/replicas * PI2 + startingAngle), 0*startingAngle + i/replicas * PI2, iterations)
      }
    }
  } else {
    //for a single fractal instance, ignore spacing and draw in center.
    fractal(.5,.5, startingAngle, iterations)
  }
  
  //adjust valueFactor to scale brightness based on the last maxValue found in the previous render
  //this helps bring out more detail when many fractal dots overlap
  //do this gradially over time to avoid flickering
  valueFactor = clamp(valueFactor*.95 + maxValue*.05, 1, 100)
  maxValue = 0
  
  // resetTransform()
  // translate(-.5, -.5)
  // rotate(wave(time(.2)) * PI*2)
  // translate(.5, .5)
}

export function render2D(index, x, y) {
  var vc = 0
  index = getIndex(x, y) //figure out index from coordinate
  if (index >= pixels.length || index < 0) return
  v = pixels[index]
  maxValue = max(maxValue, v) //keep track of the brightest pixel
  v = v / valueFactor //scale brightness down
  v = v*v //give things a bit more contrast
  if (useWhite)
    s = 1.5 - v //highlight bright pixels by shifting toward white
  else
    s = 1
  hsv(hues[index], s, v)
}
