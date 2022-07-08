/*
  Knight Rider: A car named KITT gains sentience and fights critme and all that 
  good stuff.
  
  Want to learn how to code patterns like this? This pattern has a YouTube
  video walkthrough:
  
    https://www.youtube.com/watch?v=3ugNIZ96UK4
    
  Added a radial 2D mode
*/

leader = 0
direction = 1
pixels = array(pixelCount)

speed = pixelCount / 800
fade = .0008
export function beforeRender(delta) {
  lastLeader = floor(leader)
  leader += direction * delta * speed
  
  if (leader >= pixelCount) {
    direction = -direction
    leader = pixelCount - 1
  }
  
  if (leader < 0) {
    direction = -direction
    leader = 0
  }

  // Fill pixels between frames. Added after the video walkthrough was uploaded.
  up = lastLeader < leader 
  for (i = lastLeader; i != floor(leader); up ? i++ : i-- ) pixels[i] = 1
    
  for (i = 0; i < pixelCount; i++) {
    pixels[i] -= delta * fade
    pixels[i] = max(0, pixels[i])
  }
  
  resetTransform()
  translate(-.5, -.5)
}

export function render2D(index, x, y) {
  var r = hypot(x, y)
  v = pixels[min(r*1.9*pixelCount, pixelCount-1)]
  v = v * v * v
  hsv(0, 1, v)
}

export function render(index) {
  v = pixels[index]
  v = v * v * v
  hsv(0, 1, v)
}

