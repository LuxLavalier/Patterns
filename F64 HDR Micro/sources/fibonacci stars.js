// Fibonacci Stars pattern by Jason Coon
// For Fibonacci256: https://www.tindie.com/products/19429
// Meant for use in this sketch: https://github.com/jasoncoon/esp8266-fastled-webserver/tree/fibonacci256

// modified by Ben Hencke to run on Pixelblaze

var starCount = 2;
var starMagicNumbers = [8, 13, 21]

var fibonacciToPhysical = [ 0, 39, 19, 58, 29, 9, 48, 20, 59, 38, 10, 49, 28, 1, 40, 18, 57, 30, 8, 47, 21, 60, 37, 11, 50, 27, 2, 41, 17, 56, 31, 7, 46, 22, 61, 36, 12, 51, 26, 3, 42, 16, 55, 32, 6, 45, 23, 62, 35, 13, 52, 25, 4, 43, 15, 54, 33, 5, 44, 24, 63, 34, 14, 53 ]
var stars = array(starCount)
var moveTimer
var gHue = 0
var leds = array(pixelCount)
var hues = array(pixelCount)
var fade = 0.995
var moveTimerTarget = 90

export function sliderSpeed(v) {
  v = 1-v
  moveTimerTarget = 10 + (v*v)*190
}

export function sliderFade(v) {
  fade = (1-(v*v)) * .0999 + .9
}


//setup initial stars state
stars.mutate(() => {
  var offset = starMagicNumbers[random(starMagicNumbers.length)]
  return [
    randomInt(offset),
    offset
    ]
})


export function beforeRender(delta) {
  gHue = (gHue + delta/40) % 256
  
  
  //only move the stars every so often
  moveTimer += delta
  if (moveTimer > moveTimerTarget) {
    moveTimer -= moveTimerTarget
    updateFibonacciStars()
  }
  
  //fade to black
  leds.mutate(v => v * fade)
  
  drawFibonacciStars()
}

export function render2D(index, x, y) {
  v = leds[index]
  h = hues[index]/ 256
  hsv(h, 1.75 - v, pow(v, 2))
}


function randomInt(n) {
  return floor(random(n))
}


function updateFibonacciStars() {
  stars.forEach((star) => {
    // move the stars
    star[0] += star[1]
    
    //reset any stars out of bounds
    if (star[0] >= pixelCount) {
      star[1] = starMagicNumbers[random(starMagicNumbers.length)]
      star[0] = randomInt(star[1])
    }
  })
}

function drawFibonacciStars() {
  stars.forEach((star) => {
    var index = fibonacciToPhysical[star[0]];
    // draw the star
    leds[index] = 1
    hues[index] = star[0] + gHue
  });
}
