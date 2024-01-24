export abstract class Automation {
  public abstract width: number;
  public abstract height: number;
  protected abstract data: Uint32Array | number[] | Uint16Array | Uint8Array;

  abstract step(): void;
  abstract getColorFromPixel(x: number, y: number): [number, number, number];
  abstract init(): void;
}
