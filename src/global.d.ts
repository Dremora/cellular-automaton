declare module 'canvas-sketch' {
  export type Settings = {
    animate?: boolean;
    canvas?: HTMLCanvasElement;
    dimensions?: [number, number];
    pixelated: boolean;
    resizeCanvas?: boolean;
    scaleToFit: boolean;
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
  const canvasSketch: (
    sketch: () => SketchFunction,
    settings: Settings
  ) => void;
  export default canvasSketch;
}
