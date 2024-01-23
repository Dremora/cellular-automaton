import { Automation } from './automaton';
import { colorFromRGB, getBlue, getGreen, getRed, randomInt } from './utils';

export class ColorfulPixels extends Automation {
  width = 200;
  height = 200;
  data = new Uint32Array(this.width * this.height);

  override step() {
    const { width, height } = this;
    for (let iteration = 0; iteration < 1000; iteration++) {
      const i = randomInt(0, width - 1);
      const j = randomInt(0, height - 1);

      const centralPixel = this.data[i * width + j];
      for (const x of [i - 1, i, i + 1]) {
        if (x < 0 || x >= width) continue;
        for (const y of [j - 1, j, j + 1]) {
          if (y < 0 || y >= height) continue;
          if (x === i && y === j) continue;
          const pixel = this.data[x * width + y];

          const red = Math.round((getRed(pixel) + getRed(centralPixel)) / 2);
          const green = Math.round(
            (getGreen(pixel) + getGreen(centralPixel)) / 2
          );
          const blue = Math.round((getBlue(pixel) + getBlue(centralPixel)) / 2);

          this.data[i * width + j] = colorFromRGB(red, green, blue);
        }
      }
    }
  }

  override getColorFromPixel(pixel: number) {
    return `rgb(${getRed(pixel)}, ${getGreen(pixel)}, ${getBlue(pixel)})`;
  }

  override init() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.data[i * this.width + j] = Math.floor(
          Math.random() * 256 * 256 * 256
        );
      }
    }
  }
}
