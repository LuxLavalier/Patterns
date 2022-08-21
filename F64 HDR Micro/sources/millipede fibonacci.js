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

export function beforeRender(delta) {
  t1 = time(1 / speed)
  t2 = time(2 / speed)
}

physicalToFibonacci = [ 0, 13, 26, 39, 52, 57, 44, 31, 18, 5, 10, 23, 36, 49, 62, 54, 41, 28, 15, 2, 7, 20, 33, 46, 59, 51, 38, 25, 12, 4, 17, 30, 43, 56, 61, 48, 35, 22, 9, 1, 14, 27, 40, 53, 58, 45, 32, 19, 6, 11, 24, 37, 50, 63, 55, 42, 29, 16, 3, 8, 21, 34, 47, 60 ];

export function render(index) {
  index = physicalToFibonacci[index]
  h = index / pixelCount + wave(t1)
  h += (index / pixelCount + t2) * legs / 2 % .5
  v = wave(h + t2)
  v = v * v // Gamma correction
  hsv(h, 1, v)
}
