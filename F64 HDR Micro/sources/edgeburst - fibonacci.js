/*
  Edgeburst
  
  The triangle() function is simple:
  
  output:   1  /\    /\
              /  \  /  \   etc
           0 /    \/    \/
  input:    0  .5  1     2
  
  triangle() is the go-to function when you want to mirror something (space, or
  time!) This pattern does both.
  
  Mirroring space is the building block for kaleidoscopes (see 'sound - spectro
  kalidastrip', 'xorcery', and 'glitch bands'). In this pattern we mirror the
  pixel's position (expressed as a percentage) around the middle of the strip
  with `triangle(pct)`.
  
  Mirroring a 0..1 time sawtooth turns a looping timer into a back-and-forth
  repetition.
*/

export function beforeRender(delta) {
  t1 = triangle(time(.1))  // Mirror time (bounce)
}

physicalToFibonacci = [ 0, 13, 26, 39, 52, 57, 44, 31, 18, 5, 10, 23, 36, 49, 62, 54, 41, 28, 15, 2, 7, 20, 33, 46, 59, 51, 38, 25, 12, 4, 17, 30, 43, 56, 61, 48, 35, 22, 9, 1, 14, 27, 40, 53, 58, 45, 32, 19, 6, 11, 24, 37, 50, 63, 55, 42, 29, 16, 3, 8, 21, 34, 47, 60 ];

export function render(index) {
  index = physicalToFibonacci[index];
  pct = index / pixelCount
  edge = clamp(triangle(pct) + t1 * 4 - 2, 0, 1)  // Mirror space
  
  h = edge * edge - .2  // Expand violets
  
  v = triangle(edge)    // Doubles the frequency

  hsv(h, 1, v)
}
