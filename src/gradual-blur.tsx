import {
  Checkbox,
  InputWrapper,
  Select,
  Slider,
  TextInput,
} from '@mantine/core';
import { Automation } from './automaton';
import { grayscaleHueToRGB, randomInt } from './utils';
import { useMemo, useState } from 'react';

export type Operation = 'blur' | 'replace';

export class GradualBlur extends Automation {
  width;
  height;
  data: Uint8Array;
  iterations: number;
  operation: Operation;
  monochrome: boolean;
  hue: number;

  constructor({
    width,
    height,
    iterations,
    operation,
    monochrome,
    hue,
  }: {
    width: number;
    height: number;
    iterations: number;
    operation: Operation;
    monochrome: boolean;
    hue: number;
  }) {
    super();
    this.width = width;
    this.height = height;
    this.iterations = iterations;
    this.operation = operation;
    this.monochrome = monochrome;
    this.hue = hue;
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
      const color = this.data[y * this.width + x];
      return grayscaleHueToRGB(color, this.hue);
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

export function useConfig() {
  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(1000);
  const [iterations, setIterations] = useState(10000);
  const [operation, setOperation] = useState<Operation>('replace');
  const [monochrome, setMonochrome] = useState(false);
  const [hue, setHue] = useState(0);
  const node = useMemo(
    () => (
      <>
        <TextInput
          placeholder="200"
          label="Width"
          value={width}
          type="number"
          onChange={(e) => setWidth(+e.currentTarget.value)}
        />
        <TextInput
          placeholder="200"
          label="Height"
          value={height}
          type="number"
          onChange={(e) => setHeight(+e.currentTarget.value)}
        />
        <TextInput
          placeholder="100"
          label="Iterations"
          value={iterations}
          type="number"
          onChange={(e) => setIterations(+e.currentTarget.value)}
        />
        <InputWrapper label="Operation">
          <Select
            data={['blur', 'replace']}
            value={operation}
            onChange={(operation) => setOperation(operation as Operation)}
          />
        </InputWrapper>
        <Checkbox
          label="Monochrome"
          checked={monochrome}
          onChange={() => setMonochrome(!monochrome)}
        />
        {monochrome && (
          <InputWrapper label="Hue">
            <Slider
              min={0}
              max={359}
              marks={[
                { value: 0, label: 'Red' },
                { value: 60, label: 'Yellow' },
                { value: 120, label: 'Green' },
                { value: 180, label: 'Cyan' },
                { value: 240, label: 'Blue' },
                { value: 300, label: 'Magenta' },
                { value: 360, label: 'Red' },
              ]}
              value={hue}
              onChange={setHue}
            />
          </InputWrapper>
        )}
      </>
    ),
    [width, height, iterations, operation, monochrome, hue]
  );

  const config = useMemo(() => {
    return {
      width,
      height,
      iterations,
      operation,
      monochrome,
      hue,
    };
  }, [width, height, iterations, operation, monochrome, hue]);

  return useMemo(() => ({ config, node }), [config, node]);
}
