// Pride pattern
// based on Pride2015 by Mark Kriegsman: https://gist.github.com/kriegsman/964de772d64c502760e5
// modified by Ben Hencke to run on Pixelblaze

var fibonacciToPhysical = [ 0, 39, 19, 58, 29, 9, 48, 20, 59, 38, 10, 49, 28, 1, 40, 18, 57, 30, 8, 47, 21, 60, 37, 11, 50, 27, 2, 41, 17, 56, 31, 7, 46, 22, 61, 36, 12, 51, 26, 3, 42, 16, 55, 32, 6, 45, 23, 62, 35, 13, 52, 25, 4, 43, 15, 54, 33, 5, 44, 24, 63, 34, 14, 53 ]

// beatsin8( BPM, uint8_t low, uint8_t high) returns an 8-bit value that
// rises and falls in a sine wave, 'BPM' times per minute,
// between the values of 'low' and 'high'.
function beatsin8(bpm, low, high) {
  return wave(time(0.91552734375/bpm)) * (high - low) + low
}

function beatsin88(bpm, low, high) {
  return beatsin8(bpm>>8, low, high);
}

var sPseudotime = 0; //was uint16_t modified to be a value between 0 and 1
// var sLastMillis = 0; //uint16_t
export var sHue16 = 0; //was uint16_t seems to work fine as-is
export var ledarray = array(pixelCount*3);

function pride(deltams, useFibonacciOrder) {
  // var sat8 = beatsin88( 87, 220, 250); //uint8_t
  // var brightdepth = beatsin88( 341, 96, 224); //uint8_t
  var brightdepth = beatsin88(171, 96, 224); //uint8_t
  // var brightnessthetainc16 = beatsin88( 203, (25 * 256), (40 * 256)); //uint16_t
  var brightnessthetainc16 = beatsin88( 102, (25 * 256), (40 * 256)); //uint16_t
  // var msmultiplier = beatsin88(147, 23, 60); //uint8_t
  var msmultiplier = beatsin88(74, 23, 60); //uint8_t

  var hue16 = sHue16;//gHue * 256; //uint16_t
  // var hueinc16 = beatsin88(113, 300, 1500); //uint16_t
  // var hueinc16 = beatsin88(57, 1, 128); //uint16_t
  var hueinc16 = beatsin88(57, 1, 128*3); //varies a bit more

  // var ms = millis(); //uint16_t
  // var deltams = ms - sLastMillis ; //uint16_t
  // sLastMillis  = ms;
  sPseudotime += (deltams * msmultiplier) >>16;
  // sHue16 += deltams * beatsin88( 400, 5, 9);
  sHue16 += deltams * beatsin88( 200, 5, 9);
  var brightnesstheta16 = sPseudotime; //uint16_t

  for ( var i = 0 ; i < pixelCount; i++) { //uint16_t
    hue16 += hueinc16;
    var hue8 = hue16 / 256; //uint8_t
    //this is doing a triangle
    var h16_128 = hue16 >> 7; //uint16_t
    if ( h16_128 & 0x100) {
      hue8 = 255 - (h16_128 >> 1);
    } else {
      hue8 = h16_128 >> 1;
    }

    brightnesstheta16  += brightnessthetainc16>>16;
    brightnesstheta16 = mod(brightnesstheta16 + (brightnessthetainc16>>16), 1)
    var b16 = wave( brightnesstheta16); //uint16_t

    //var bri16 = (uint32_t)((uint32_t)b16 * (uint32_t)b16) / 65536; //uint16_t
    var bri16 = b16 * b16
    //var bri8 = (uint32_t)(((uint32_t)bri16) * brightdepth) / 65536; //uint8_t
    var bri8 = bri16 * (brightdepth>>8)
    bri8 += (1 - (brightdepth>>8));

    var index = hue8; //uint8_t
    //index = triwave8( index);
    index = index/256 * 240;

    // CRGB newcolor = ColorFromPalette( palette, index, bri8);

    var pixelnumber = useFibonacciOrder ? fibonacciToPhysical[i] : i; //uint16_t

    // nblend( ledarray[pixelnumber], newcolor, 8);
    //TODO palletes, blending in RGB. For now use the 3 byte pixel for hue and value
    ledarray[pixelnumber*3] = hue8 / 128;
    ledarray[pixelnumber*3 + 2] = bri8;
  }
}

export function beforeRender(delta) {
  pride(delta, 1)
}

export function render(index) {
  v = ledarray[index*3+2]
  hsv(ledarray[index*3], 1, v*v)
}
