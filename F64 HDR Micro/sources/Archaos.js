/*  Archaos
  *
  * Arc Cosine makes some regular polygons; Chaotically animates params
  *
  * See https://www.desmos.com/calculator/ufugbkkpek
  *
  * Jeff Vyduna / MIT License
*/

// Debug / dev utilities
// export var _w1  = -1, _w2 = -1, _w3 = -1 // Watch variables; sort _ to top
// export var _min, _max
// trackMinMax= (v) => { _min = min(_min, v); _max = max(_max, v) }
// export var _p1, _p2, _p3  // Development tuning params
// export var sliderP1 = v => _p1 = v 
// export var sliderP2 = v => _p2 = v
// export var sliderP3 = v => _p3 = v

// Going for very subtle here
export var brightness = .2
export var sliderBrightness = v => brightness = v

var cycleProgress = 0
// Uncomment this slider to manually scroll through the shapes
// export function sliderCycleProgress(_v) {
//   cycleProgress = clamp(_v, 0, 1 - .001)
// }


// Line width: 40 good for most with scale 4 and below
// Width 2.8 best on F64 for scale 7 ?!? OK.
var width = 40 
// export function sliderWidthInvK(_v) {
//   width = (1 - _v) * 40
// }

// Line edge sharpness: 2.1 good for most
var sharpness = 2.1 
// export function sliderSharpnessInvN(_v) {
//   sharpness = (1 - _v) * 20
// }

var userScaleFactor = 1
// export function sliderScale(_v) {
//   userScaleFactor = .25 + 1.5 * _v
// }

var userRotation = 0
// export function sliderRotation(_v) {
//   userRotation = PI2 * _v
// }


var cycles // Number of line segments of lines to compute. 4 to 20 is interesting.
var scaleFactor // The polygons generated are different sizes, so we scale to fit them to the F64 display
//  [cycles, scale] pairs for the the selected regular polygons to linger near 
var cycleStops = [[4, 4],    // Two lines
                  [5, 7],    // Pentagram
                  [6, 4],    // Triangle
                  [7, 3.25], // Heptagram
                  [8, 3],    // Square
                  [20, 2.5], // Dual decagon but basically a circle
                  [20, 2.5]] // Spend more time on this last one

var movementFrac // Percen of time spent trnasitioning between cycleStops

var lastRotationTarget, rotationTarget  // Radians 
var rotationProgress = 1 // 0..1 ramp between lastRotationTarget and rotationTarget
var rotationDuration     // Full time to reach rotationTarget (not always rotating during this period)
var hue0

export function beforeRender(delta) {
  resetTransform()
  translate(-.5, -.5)         // Center at (0,0)
  
  progressRamp = time (90 / 65.536)
  movementFrac = .5 + .2 * wave(time(20 / 65.535))
  
  colorT1 = smoothstep(wave(time(60 / 65.535)), .2, .8)
  hue0 = .66 + (1-brightness)*.44 // Combat color temp cooling on low brightness
  
  setCyclesAndScale(cycleProgress ? cycleProgress : progressRamp)

  scaleLFO = .9 + wave(time(30 / 65.5)) / 5
  scaleFactor *=  scaleLFO * userScaleFactor
  scale(scaleFactor, scaleFactor)
  
  doRotation(delta)
}

var MRP = 16  // Mean Rotation Period in seconds (mean a binomial distribution)
var UDR = MRP * 2 / 4  // Uniform Distribution Range, for sum of 4 uniform distributions
function doRotation(delta) {
  if (rotationProgress >= 1) {
    rotationProgress = 0
    rotationDuration = [UDR, UDR, UDR, UDR].reduce((acc, v) => acc + random(v), 2) // Sample from binomial dist
    lastRotationTarget = rotationTarget
    rotationTarget = random(PI2) - PI
  }
  
  rotationProgress += delta / rotationDuration / 1000
  lastRotationTarget + (rotationTarget - lastRotationTarget) * smoothstep(rotationProgress, .5, .999)
  rotate(userRotation + lastRotationTarget + (rotationTarget - lastRotationTarget) * smoothstep(rotationProgress, .5, .999))
}

export var scaleFactor
// For t1 in 0..2
// Interpolate between pairs of [[cycles, scale], [nextCycles, nextScale]] in cycleStops
function setCyclesAndScale(t1) {
  var maxIndex = cycleStops.length - 1
  var interpIndex = smoothstair(t1 * (maxIndex),  movementFrac)
  var pct = 1 - frac(interpIndex)

  var next = cycleStops[(interpIndex + 1) % (cycleStops.length - 1)] // Circular
  cycles = cycleStops[interpIndex][0] * pct + next[0] * (1 - pct)
  scaleFactor = cycleStops[interpIndex][1] * pct + next[1] * (1 - pct)
  width = clamp((scaleFactor-4)*-37.2/3 + 40, 2.8, 40) // Experimementally determined [(4, 40), (7, 2.8)]
}


export function render2D(index, x, y) {
  var r =  hypot(x, y)
  var phi = atan2(y, x) + 1.0 * PI // Reminder that output range of atan2 is in [-PI..PI]
  renderPolar(index, r, phi)
}

export function renderPolar(index, r, phi) {
  // Distance between actual r and ideal computed r(phi), for domain phi in [0, 4*PI]
  // This does distort the scalar field vs cartesian distance error
  // hence why triangle/square sides look a little bit bent
  var dist = 100
  for (var revolution = 0; revolution < 2; revolution++) {
    var denom = cos(2 / cycles * acos(cos(cycles / 2 * (phi + revolution * PI2))))
    var revDist = denom < 0.01 ? 20 : abs(r - 1 / denom)
    dist = min(dist, revDist)
  }
  
  var v = expStep(dist, width, sharpness)
  
  var colorGradient = clamp(1 + colorT1 - r/scaleFactor, 0, 1)
  
  hsv(hueGradient(colorGradient), satGradient(colorGradient), v * brightness)
}



// Takes 0..1, returns an  warm-white to an cool blue
// hue0 defined in beforeRender() 
var hue1 = 1.04
function hueGradient(t) {
  return hue0 + (hue1 - hue0) * t
}

var sat0 = 0.5
var sat1 = .87
function satGradient(t) {
  return sat0 + t * (sat1 - sat0) * abs(.5 - t)/.5
}


// https://iquilezles.org/articles/functions/
// https://www.desmos.com/calculator/b0seqywous
function expStep(x, k, n) {
  var result = exp(-k * pow(x, n))
  return (result > 1) ? 0 : result
}

// https://thebookofshaders.com/glossary/?search=smoothstep
// https://www.desmos.com/calculator/as0c0vjjum
function smoothstep(x, edge0, edge1) {
  var t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t)
}

// https://www.desmos.com/calculator/npueouzdvc
function smoothstair(x, transitionFrac) {
  return floor(x) + smoothstep(frac(x), .9999 - transitionFrac, .9999)  
}


