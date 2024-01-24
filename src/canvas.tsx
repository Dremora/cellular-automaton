import canvasSketch, { Settings } from 'canvas-sketch';
import { useCallback, useEffect, useRef } from 'react';

import { canvasStyle } from './canvas.css';
import { Automation } from './automaton';

export function Canvas({ automaton }: { automaton: Automation }) {
  const ref = useRef<HTMLCanvasElement>(null);

  const sketch = useCallback(
    function sketch() {
      return ({
        context,
        width,
        height,
      }: {
        context: CanvasRenderingContext2D;
        width: number;
        height: number;
      }) => {
        const image = context.getImageData(0, 0, width, height);
        const pixels = image.data;
        for (let i = 0; i < width; i++) {
          for (let j = 0; j < height; j++) {
            const index = (i + j * width) * 4;

            const [red, green, blue] = automaton.getColorFromPixel(i, j);
            pixels[index + 0] = red;
            pixels[index + 1] = green;
            pixels[index + 2] = blue;
            pixels[index + 3] = 255;
          }
        }
        context.putImageData(image, 0, 0);
        automaton.step();
      };
    },
    [automaton]
  );

  const manager = useRef<ReturnType<typeof canvasSketch> | null>(null);

  useEffect(() => {
    if (ref.current) {
      const settings: Settings = {
        animate: true,
        pixelated: true,
        // resizeCanvas: false,
        // scaleToFit: false,
        // scaleToView: true,
        dimensions: [automaton.width, automaton.height],
        canvas: ref.current,
      };
      automaton.init();
      if (manager.current) {
        manager.current.then((m) => {
          m.pause();
          ref.current
            ?.getContext('2d')
            ?.clearRect(0, 0, ref.current.width, ref.current.height);
          m.unload();
          manager.current = canvasSketch(sketch, settings);
        });
      } else {
        manager.current = canvasSketch(sketch, settings);
      }
    }
  }, [automaton, sketch]);
  return <canvas ref={ref} className={canvasStyle} />;
}
