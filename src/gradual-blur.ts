import { Automation } from './automaton';
import { randomInt } from './utils';

export type Operation = 'blur' | 'replace';

export class GradualBlur extends Automation {
  width;
  height;
  data: Uint8Array;
  iterations: number;
  operation: Operation;
  monochrome: boolean;

  constructor({
    width,
    height,
    iterations,
    operation,
    monochrome,
  }: {
    width: number;
    height: number;
    iterations: number;
    operation: Operation;
    monochrome: boolean;
  }) {
    super();
    this.width = width;
    this.height = height;
    this.iterations = iterations;
    this.operation = operation;
    this.monochrome = monochrome;
    this.data = new Uint8Array(this.width * this.height * (monochrome ? 1 : 3));
  }

  override step() {
    const { width, height } = this;
    for (let iteration = 0; iteration < this.iterations; iteration++) {
      const i = randomInt(0, width - 1);
      const j = randomInt(0, height - 1);

      let centralRed: number, centralGreen: number, centralBlue: number;
      if (this.monochrome) {
        centralRed = centralGreen = centralBlue = this.data[j * width + i];
      } else {
        centralRed = this.data[(j * width + i) * 3];
        centralGreen = this.data[(j * width + i) * 3 + 1];
        centralBlue = this.data[(j * width + i) * 3 + 2];
      }

      for (const x of [i - 1, i, i + 1]) {
        if (x < 0 || x >= width) continue;
        for (const y of [j - 1, j, j + 1]) {
          if (y < 0 || y >= height) continue;
          if (x === i && y === j) continue;
          if (this.monochrome) {
            if (this.operation === 'blur') {
              this.data[y * width + x] = Math.round(
                (this.data[y * width + x] + centralRed) / 2
              );
            } else {
              this.data[y * width + x] = centralRed;
            }
          } else {
            const currentRed = this.data[(y * width + x) * 3];
            const currentGreen = this.data[(y * width + x) * 3 + 1];
            const currentBlue = this.data[(y * width + x) * 3 + 2];

            let updatedRed: number, updatedGreen: number, updatedBlue: number;
            if (this.operation === 'blur') {
              updatedRed = Math.round((currentRed + centralRed) / 2);
              updatedGreen = Math.round((currentGreen + centralGreen) / 2);
              updatedBlue = Math.round((currentBlue + centralBlue) / 2);
            } else {
              updatedRed = centralRed;
              updatedGreen = centralGreen;
              updatedBlue = centralBlue;
            }

            this.data[(y * width + x) * 3] = updatedRed;
            this.data[(y * width + x) * 3 + 1] = updatedGreen;
            this.data[(y * width + x) * 3 + 2] = updatedBlue;
          }
        }
      }
    }
  }

  override getColorFromPixel(x: number, y: number) {
    if (this.monochrome) {
      return [
        this.data[y * this.width + x],
        this.data[y * this.width + x],
        this.data[y * this.width + x],
      ] satisfies [number, number, number];
    } else {
      return [
        this.data[(y * this.width + x) * 3],
        this.data[(y * this.width + x) * 3 + 1],
        this.data[(y * this.width + x) * 3 + 2],
      ] satisfies [number, number, number];
    }
  }

  override init() {
    for (
      let i = 0;
      i < this.width * this.height * (this.monochrome ? 1 : 3);
      i++
    ) {
      this.data[i] = randomInt(0, 255);
    }
  }
}
