/*
  Millipede

  There's something mesmerizing about the waves that travel along a millipede's
  feet. This pattern's combination of wave()s and a remainder seems to capture
  a similar motion.

  Regarding the order of operations, remainder has the same precedence as
  multiplication and division, so `a * b / c % d * e` happens left-to-right.
*/

speed = 20
legs = 10
export var tiers = 1

export var cx = .5
export var cy = .5

export function sliderLegs(v) {
  legs = 1 + floor(v*20)
}

export function sliderSpeed(v) {
  speed = 1 + floor(v*65)
}

export function sliderPositionX(v) {
  cx = v
}

export function sliderPositionY(v) {
  cy = v
}

export function sliderTiers(v) {
  tiers = 1 + floor(v * 4.99)
}


export function beforeRender(delta) {
  t1 = time(1 / speed)
  t2 = time(2 / speed)
}

export function render(index) {
  h = index / pixelCount 
  h += (index / pixelCount + t2) * legs / 2 % .5
  v = wave(h + t2)
  v = v * v // Gamma correction
  hsv(h, 1, v)
}

export function render2D(index, x, y) {
  x -= cx
  y-= cy
  
  r = sqrt(x*x + y*y)
  
  t = floor(r * tiers) / tiers
  
  //use angle around a center point instead of distance on a strip
  h = ((atan2(x, y ) + 1)/PI2 + 1) * .5 
  h += (h + t2) * legs / 2 % .5
  v = wave(h + t2 + t)
  v = v * v // Gamma correction
  hsv(h, 1, v)
}
