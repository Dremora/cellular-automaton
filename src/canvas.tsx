import canvasSketch, { type Settings } from 'canvas-sketch';
import { useEffect, useRef } from 'react';
import { ColorfulPixels } from './colorful-pixels';
import { canvasStyle } from './canvas.css';

const automaton = new ColorfulPixels();

const settings: Settings = {
  animate: true,
  pixelated: true,
  resizeCanvas: false,
  scaleToFit: true,
  scaleToView: true,
};

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
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const pixel = automaton.data[i * width + j];
        context.fillStyle = automaton.getColorFromPixel(pixel);
        context.fillRect(i, j, 1, 1);
      }
    }
    automaton.step();
  };
}

export function Canvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) {
      automaton.init();
      canvasSketch(sketch, {
        ...settings,
        dimensions: [automaton.width, automaton.height],
        canvas: ref.current,
      });
    }
  }, []);
  return <canvas ref={ref} className={canvasStyle} />;
}
