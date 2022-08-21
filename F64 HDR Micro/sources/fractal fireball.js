// Fractal Fireball pattern by Ben Hencke

var width = 32
var height = 16
var iterations = 7
var scale = .02
var speed = .5
var fade = .9

var skip = 4

var pixels = array(width * height)
var hues = array(width * height)

export var iter

var w1, t1, w2

export var bx, by

function getIndex(x, y) {
  var res = floor(x*width) + floor(y*height)*width
  if (x < 0 || x > 1 || y < 0 || y  > 1 || res < 0 || res > 255) {
    bx = x; by = y
  }
  return res
}

function f(x, y, a, i) {
  iter++
  var s = sin(a), c = cos(a), index
  
  x += s * i * scale;
  y += c * i * scale;
  
  x = mod(x,.99999)
  y =  mod(y,.99999)
  
  if (i <= skip) {
    index = getIndex(x,y)
    pixels[index]++
    hues[index] = i * .3 + .1 
  }
  
  i--
  if (i > 0) {
    f(x, y, a + w2, i)
    f(x, y, a - w1, i)
  }
}

export function beforeRender(delta) {
  t1 = time(.1 / speed)
  w1 = sin(t1*PI2) * PI2
  w2 = sin(time(.13 / speed)*PI2) * PI2
  w3 = sin(time(.5 / speed) * PI2) * PI2
  iter = 0
  
  pixels.mutate(p => p*fade)
  f(.5,.5, w3, iterations)
}

export function render2D(index, x, y) {
  index = getIndex(x, y)
  h = hues[index] * .07
  
  v = clamp(pixels[index] /10, 0, 1)
  v = v*v
  
  hsv(h, 1, v)
}
