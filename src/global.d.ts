declare module 'canvas-sketch' {
  export type Settings = {
    animate?: boolean;
    canvas?: HTMLCanvasElement;
    dimensions?: [number, number];
    pixelated?: boolean;
    totalFrames?: number;
    duration?: number;
    resizeCanvas?: boolean;
    scaleToFit?: boolean;
    scaleToView?: boolean;
  };
  type SketchFunctionProps = {
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    pixelated?: boolean;
    dimensions?: [number, number];
  };
  type SketchFunction = (props: SketchFunctionProps) => void;
  type SketchManager = {
    play: () => void;
    stop: () => void;
    pause: () => void;
    update: (settings: Settings) => void;
    unload: () => void;
    destroy: () => void;
    loadAndRun: (sketch: SketchFunction, settings: Settings) => void;
  };
  const canvasSketch: (
    sketch: () => SketchFunction,
    settings: Settings
  ) => Promise<SketchManager>;
  export default canvasSketch;
}
