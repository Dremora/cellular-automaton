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
