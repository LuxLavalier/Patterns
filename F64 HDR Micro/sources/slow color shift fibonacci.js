/*
  Slow color shift
*/

l4 = pixelCount * 4     // 4 times the strip length

export function beforeRender(delta) {
  t1 = time(.15) * PI2
  t2 = time(.1)
}

physicalToFibonacci = [ 0, 13, 26, 39, 52, 57, 44, 31, 18, 5, 10, 23, 36, 49, 62, 54, 41, 28, 15, 2, 7, 20, 33, 46, 59, 51, 38, 25, 12, 4, 17, 30, 43, 56, 61, 48, 35, 22, 9, 1, 14, 27, 40, 53, 58, 45, 32, 19, 6, 11, 24, 37, 50, 63, 55, 42, 29, 16, 3, 8, 21, 34, 47, 60 ];

export function render(index) {
  index = physicalToFibonacci[index]
  
  h = (t2 + 1 + sin(index / 2 + 5 * sin(t1)) / 5) + index / l4

  v = wave((index / 2 + 5 * sin(t1)) / PI2)
  v = v * v * v * v

  hsv(h, 1, v)
}
