export abstract class Automation {
  public abstract width: number;
  public abstract height: number;
  public abstract data: Uint32Array | number[] | Uint16Array | Uint8Array;

  abstract step(): void;
  abstract getColorFromPixel(pixel: number): string;
  abstract init(): void;
}
