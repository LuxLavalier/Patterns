//  Idea lifted from the brilliant mind of Yaroslaw Turbin (LDIRKO): https://editor.soulmatelights.com/gallery/984-sincx

export var timebase = 1.5; export function sliderSpeed(v) { timebase = 0.1 + 1.9 * (1 - v); }
export var scale = 1; export function sliderScale(v) { scale = 0.25 + 3.75 * (v); }
export var sizeB = 14; export function sliderSizeB(v) { sizeB = 1 + (sqrt(pixelCount) - 1) * (1 - v); }
export var sizeC = 8; export function sliderSizeC(v) { sizeC = 1 + (sqrt(pixelCount) - 1) * (1 - v); }
export var gamma = 3; export function sliderGamma(v) { gamma = 1 + floor(5 * v); }

export function beforeRender(delta) {
  a = scale * PI2 * time(timebase);
  a3= scale * PI2 * time(timebase / sizeB);
  a4= scale * PI2 * time(timebase / 4);
}

export function render2D(index, x, y) {
  
  var rad = hypot(x-cos(a3), y-cos(a4));
  var r = pow(1-cos(((PI2*rad)-a))/rad, gamma);

  var rad = hypot(x-cos(a3+PI/2), y-cos(a4-PI/4));
  var g = pow(1-cos((PI2*rad)-a+PI/2)/rad, gamma);

  rad = hypot(x-cos(a3-PI), y-cos(a4+PI/4));
  var b = pow(1-cos((PI2*rad)-a+PI)/rad, gamma);

  rgb(r,g,b);
}
