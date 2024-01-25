export function getRed(pixel: number) {
  return (pixel >> 16) & 0xff;
}

export function getGreen(pixel: number) {
  return (pixel >> 8) & 0xff;
}

export function getBlue(pixel: number) {
  return pixel & 0xff;
}

export function colorFromRGB(red: number, green: number, blue: number) {
  return (red << 16) | (green << 8) | blue;
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function grayscaleHueToRGB(
  grayscale: number,
  hue: number
): [number, number, number] {
  const s = 0.5;
  const l = grayscale / 255;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= hue && hue < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= hue && hue < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= hue && hue < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= hue && hue < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= hue && hue < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= hue && hue < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const red = Math.round((r + m) * 255);
  const green = Math.round((g + m) * 255);
  const blue = Math.round((b + m) * 255);

  return [red, green, blue];
}
