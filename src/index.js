const canvasSketch = require("canvas-sketch");
const Color = require("canvas-sketch-util/color");

const settings = {
  animate: true,
};

const params = new URLSearchParams(document.location.search.substring(1));

function numParam(name, defaultValue) {
  const param = parseFloat(params.get(name));
  return isNaN(param) ? defaultValue : param;
}

function swapDataArray() {
  const tmp = data;
  data = dataStep;
  dataStep = tmp;
}

const WIDTH = numParam("width", 200);
const HEIGHT = numParam("height", 200);

let data = new Uint32Array(WIDTH * HEIGHT);
// let dataStep = new Uint32Array(WIDTH * HEIGHT);

function init() {
  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT; j++) {
      data[i * WIDTH + j] = Math.floor(Math.random() * 256 * 256 * 256);
    }
  }
}

// function copyArray(from, to) {
//   for (let i = 0; i < from.length; i++) {
//     to[i] = from[i];
//   }
// }

function getRed(pixel) {
  return (pixel >> 16) & 0xff;
}

function getGreen(pixel) {
  return (pixel >> 8) & 0xff;
}

function getBlue(pixel) {
  return pixel & 0xff;
}

function step() {
  // copyArray(data, dataStep);
  for (let iteration = 0; iteration < 1000; iteration++) {
    // select random cell
    const i = Math.floor(Math.random() * WIDTH);
    const j = Math.floor(Math.random() * HEIGHT);

    // currentPixel = data[i * WIDTH + j];

    // for (let x = i - 1; x <= i + 1; x++) {
    //   if (x < 0 || x >= WIDTH) continue;
    //   for (let y = j - 1; y <= j + 1; y++) {
    //     if (y < 0 || y >= HEIGHT) continue;
    //     if (x === i && y === j) continue;
    //     data[x * WIDTH + y] = currentPixel;
    //   }
    // }

    // let count = 0;
    const centralPixel = data[i * WIDTH + j];
    for (x of [i - 1, i, i + 1]) {
      if (x < 0 || x >= WIDTH) continue;
      for (y of [j - 1, j, j + 1]) {
        if (y < 0 || y >= HEIGHT) continue;
        if (x === i && y === j) continue;
        const pixel = data[x * WIDTH + y];

        const red = Math.round((getRed(pixel) + getRed(centralPixel)) / 2);
        const green = Math.round(
          (getGreen(pixel) + getGreen(centralPixel)) / 2
        );
        const blue = Math.round((getBlue(pixel) + getBlue(centralPixel)) / 2);

        data[i * WIDTH + j] = (red << 16) | (green << 8) | blue;
      }
    }

    // const red = Math.floor(reds / count);
    // const green = Math.floor(greens / count);
    // const blue = Math.floor(blues / count);

    // data[i * WIDTH + j] = (red << 16) | (green << 8) | blue;
  }
  // swapDataArray();
}

init();

function getColorFromPixel(pixel) {
  return `rgb(${getRed(pixel)}, ${getGreen(pixel)}, ${getBlue(pixel)})`;
}

function sketch() {
  return ({ context, width, height }) => {
    const xScale = width / WIDTH;
    const yScale = height / HEIGHT;
    for (let i = 0; i < WIDTH; i++) {
      for (let j = 0; j < HEIGHT; j++) {
        const pixel = data[i * WIDTH + j];
        context.fillStyle = getColorFromPixel(pixel);
        context.fillRect(i * xScale, j * yScale, 1 * xScale, 1 * yScale);
      }
    }
    step();
  };
}

canvasSketch(sketch, settings);
