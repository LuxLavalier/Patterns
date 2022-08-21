/*
  Spin cycle
*/

export function beforeRender(delta) {
  t1 = time(.1)
}

physicalToFibonacci = [ 0, 13, 26, 39, 52, 57, 44, 31, 18, 5, 10, 23, 36, 49, 62, 54, 41, 28, 15, 2, 7, 20, 33, 46, 59, 51, 38, 25, 12, 4, 17, 30, 43, 56, 61, 48, 35, 22, 9, 1, 14, 27, 40, 53, 58, 45, 32, 19, 6, 11, 24, 37, 50, 63, 55, 42, 29, 16, 3, 8, 21, 34, 47, 60 ];

export function render(index) {
  index = physicalToFibonacci[index];
  pct = index / pixelCount  // Percent this pixel is into the overall strip
  h = pct * (5 * wave(t1) + 5) + 2 * wave(t1)
  h = h % .5 + t1  // Remainder has precedence over addition
  v = triangle(5 * pct + 10 * t1)
  v = v * v * v
  hsv(h, 1, v)
}
