const canvasSketch = require("canvas-sketch");
const Color = require("canvas-sketch-util/color");

const settings = {
  animate: true,
  fps: 5,
};

const params = new URLSearchParams(document.location.search.substring(1));

const numParam = (name, defaultValue) => {
  const param = parseInt(params.get(name));
  return isNaN(param) ? defaultValue : param;
};

const WIDTH = numParam("width", 200);
const HEIGHT = numParam("height", 200);
const INITIAL_POPULATION = numParam("initialPopulation", 0.1);
const MUTATION_CHANCE = numParam("mutationChance", 0.001);
const EPIDEMIC_CHANCE = numParam("epidemicChance", 0.000001);
const TRANSMISSION_CHANCE = numParam("transmissionChance", 0.2);
const VIRUS_STRENGTH = numParam("virusStrength", 20);

const MIN_NEIGHBORS = numParam("minNeighbors", 2);
const MAX_NEIGHBORS = numParam("maxNeighbors", 4);

let data = new Int8Array(WIDTH * HEIGHT);
let dataStep = new Int8Array(WIDTH * HEIGHT);

function swapDataArray() {
  const tmp = data;
  data = dataStep;
  dataStep = tmp;
}

function init() {
  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT; j++) {
      data[i * WIDTH + j] = Math.random() < INITIAL_POPULATION ? 1 : 0;
    }
  }
}

function mutate() {
  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT; j++) {
      dataStep[i * WIDTH + j] =
        Math.random() < EPIDEMIC_CHANCE
          ? -VIRUS_STRENGTH
          : Math.random() < MUTATION_CHANCE
          ? 1
          : data[i * WIDTH + j];
    }
  }
  swapDataArray();
}

function neighborsCount(i, j) {
  return (
    data[i * WIDTH + j + 1] +
    data[i * WIDTH + j - 1] +
    data[(i + 1) * WIDTH + j] +
    data[(i - 1) * WIDTH + j] +
    data[(i + 1) * WIDTH + j + 1] +
    data[(i - 1) * WIDTH + j + 1] +
    data[(i - 1) * WIDTH + j - 1] +
    data[(i + 1) * WIDTH + j - 1]
  );
}

function step() {
  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT; j++) {
      const neighbors = neighborsCount(i, j);
      const alive = !!data[i * WIDTH + j];
      dataStep[i * WIDTH + j] =
        alive && neighbors >= MIN_NEIGHBORS && neighbors <= MAX_NEIGHBORS
          ? 1
          : !alive && neighbors === 3
          ? 1
          : neighbors < 0
          ? Math.random() < TRANSMISSION_CHANCE
            ? Math.max(-VIRUS_STRENGTH, neighbors)
            : 0
          : 0;
    }
  }
  swapDataArray();
}

init();

const sketch = () => {
  return ({ context, width, height }) => {
    const xScale = width / WIDTH;
    const yScale = height / HEIGHT;
    for (let i = 0; i < WIDTH; i++) {
      for (let j = 0; j < HEIGHT; j++) {
        const pixel = data[i * WIDTH + j];
        context.fillStyle =
          pixel === 1
            ? "black"
            : pixel === 0
            ? "white"
            : Color.style({
                hsl: [0, 100 + Math.floor((pixel / VIRUS_STRENGTH) * 50), 50],
              });
        context.fillRect(i * xScale, j * yScale, 1 * xScale, 1 * yScale);
      }
    }
    step();
    mutate();
  };
};

canvasSketch(sketch, settings);
