import { Checkbox, InputWrapper, Select, Slider } from '@mantine/core';
import { Automation } from './automaton';
import { grayscaleHueToRGB, randomInt } from './utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

  public setOperation(operation: Operation) {
    this.operation = operation;
  }

  public setHue(hue: number) {
    this.hue = hue;
  }

  public setIterations(iterations: number) {
    this.iterations = iterations;
  }

  public setMonochrome(monochrome: boolean) {
    this.monochrome = monochrome;
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

export function useConfig({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const iterationsRef = useRef(10000);
  const [iterations, setIterations] = useState(iterationsRef.current);

  const operationRef = useRef<Operation>('replace');
  const [operation, setOperation] = useState<Operation>(operationRef.current);

  const monochromeRef = useRef(false);
  const [monochrome, setMonochrome] = useState(monochromeRef.current);

  const hueRef = useRef(0);
  const [hue, setHue] = useState(hueRef.current);

  const [automaton, setAutomaton] = useState(() => {
    return new GradualBlur({
      width,
      height,
      hue: hueRef.current,
      iterations: iterationsRef.current,
      monochrome: monochromeRef.current,
      operation: operationRef.current,
    });
  });

  const updateHue = useCallback(
    (hue: number) => {
      setHue(hue);
      automaton.setHue(hue);
      hueRef.current = hue;
    },
    [automaton]
  );

  const updateIterations = useCallback(
    (iterations: number) => {
      setIterations(iterations);
      automaton.setIterations(iterations);
      iterationsRef.current = iterations;
    },
    [automaton]
  );

  const updateMonochrome = useCallback(
    (monochrome: boolean) => {
      setMonochrome(monochrome);
      automaton.setMonochrome(monochrome);
      monochromeRef.current = monochrome;
      automaton.init();
    },
    [automaton]
  );

  const updateOperation = useCallback(
    (operation: Operation) => {
      setOperation(operation);
      automaton.setOperation(operation);
      operationRef.current = operation;
    },
    [automaton]
  );

  useEffect(() => {
    setAutomaton(
      new GradualBlur({
        width,
        height,
        iterations: iterationsRef.current,
        operation: operationRef.current,
        monochrome: monochromeRef.current,
        hue: hueRef.current,
      })
    );
  }, [height, width]);

  const node = useMemo(
    () => (
      <>
        <InputWrapper label="Iterations (per frame)">
          <Slider
            mb="lg"
            min={0}
            max={6}
            step={0.0001}
            precision={4}
            value={Math.log10(iterations)}
            onChange={(value) =>
              updateIterations(Math.round(Math.pow(10, value)))
            }
            scale={(x) => Math.round(Math.pow(10, x))}
            marks={[
              { value: 0, label: '0' },
              {
                value: 6,
                label: (
                  <span style={{ position: 'absolute', right: 0 }}>
                    1,000,000
                  </span>
                ),
              },
            ]}
          />
        </InputWrapper>
        <InputWrapper label="Operation">
          <Select
            data={['blur', 'replace']}
            value={operation}
            onChange={(operation) => updateOperation(operation as Operation)}
          />
        </InputWrapper>
        <Checkbox
          label="Monochrome"
          checked={monochrome}
          onChange={() => updateMonochrome(!monochrome)}
        />
        {monochrome && (
          <InputWrapper label="Hue">
            <Slider
              mb="lg"
              min={0}
              max={359}
              showLabelOnHover={false}
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
              onChange={updateHue}
            />
          </InputWrapper>
        )}
      </>
    ),
    [
      hue,
      iterations,
      monochrome,
      operation,
      updateHue,
      updateIterations,
      updateMonochrome,
      updateOperation,
    ]
  );

  return useMemo(() => ({ automaton, node }), [automaton, node]);
}
