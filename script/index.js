class Sand {
  constructor(color) {
    this.color = color;
  }

  draw(context, canvas, dimension, i, j, world) {
    context.fillStyle = this.color;
    context.fillRect(
      i * (canvas.width / dimension),
      j * (canvas.height / dimension),
      canvas.width / dimension,
      canvas.height / dimension
    );
    this.fall(world, i, j);
  }

  fall(grid, i, j) {
    if (j >= grid.length - 1) return;
    const isEmpty = (row, col) => grid[row]?.[col] === undefined;
    const move = (newRow, newCol) => {
      grid[newRow][newCol] = this;
      grid[i][j] = undefined;
    };

    const checkAndMove = (newI, newJ) => {
      if (isEmpty(newI, newJ)) move(newI, newJ);
    };

    if (isEmpty(i, j + 1)) move(i, j + 1);
    else {
      if (i === 0) checkAndMove(i + 1, j + 1);
      if (i === grid.length - 1) checkAndMove(i - 1, j + 1);
      if (
        i > 0 &&
        i < grid.length - 1 &&
        isEmpty(i - 1, j + 1) &&
        isEmpty(i + 1, j + 1)
      ) {
        Math.random() < 0.5 ? move(i - 1, j + 1) : move(i + 1, j + 1);
      } else if (i > 0 && i < grid.length - 1) {
        if (isEmpty(i - 1, j + 1) && !isEmpty(i + 1, j + 1)) move(i - 1, j + 1);
        else if (!isEmpty(i - 1, j + 1) && isEmpty(i + 1, j + 1))
          move(i + 1, j + 1);
      }
    }
  }
}

class Simulation {
  constructor(canvas, context, dimension = 10) {
    this.sum = 0;
    this.sandCount = 0;
    this.iteration = 0;
    this.canvas = canvas;
    this.context = context;
    this.dimension = dimension;
    this.colors = [
      "#dad19e",
      "#ddd69f",
      "#e9deb5",
      "#f6eebb",
      "#b1a972",
      "#c1bb68",
      "#bcb47b",
      "#f5e4ba",
      "#b4b47c",
      "#b0a971",
      "#b4ac7c",
      "#bbb47c",
      "#bcb486",
      "#c4c48b",
      "#c6bb89",
      "#ccc484",
      "#ccc692",
      "#d4c495",
      "#d4cc94",
      "#d4cd9c",
      "#dccc9f",
      "#dcd49c",
      "#dcd4a4",
      "#dcd5b4",
      "#dcdca3",
      "#e0d49c",
      "#e1d8ac",
      "#e4daa3",
      "#e4e4ac",
      "#e9dcb4",
      "#ecdeac",
      "#eee4b7",
      "#efeccc",
      "#f0e0bc",
      "#f1ecb4",
      "#f4e4ac",
      "#f9f0c0",
      "#fbfadc",
    ];
    this.world = Array.from({ length: dimension }, () =>
      Array.from({ length: dimension }, () => undefined)
    );
  }

  randomColor() {
    // return this.colors[Math.floor(Math.random() * this.colors.length)];
    return this.colors[this.sandCount++ % this.colors.length];
  }

  start() {
    this.iteration++;
    requestAnimationFrame(() => this.start());
    const start = performance.now();
    this.clearCanvas();
    this.drawSand();
    this.updatePerformance(start);
  }
  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawSand() {
    for (let i = this.dimension - 1; i >= 0; i--) {
      for (let j = this.dimension - 1; j >= 0; j--) {
        if (this.world[i][j] !== undefined) {
          this.world[i][j].draw(
            this.context,
            this.canvas,
            this.dimension,
            i,
            j,
            this.world
          );
        }
      }
    }
  }

  addSand(x, y) {
    const newX = Math.floor(x / (this.canvas.width / this.dimension));
    const newY = Math.floor(y / (this.canvas.height / this.dimension));

    if (this.world[newX][newY] === undefined) {
      this.world[newX][newY] = new Sand(this.randomColor());
    }
  }
  updatePerformance(start) {
    const end = performance.now();
    this.sum += end - start;
    perf.textContent = this.sum / this.iteration / 1000 + " s";
  }
}

(function main() {
  let canvas,
    c,
    perf,
    simulation,
    click = false;

  function initialize() {
    canvas = document.querySelector("canvas");
    c = canvas.getContext("2d");
    canvas.width = document.documentElement.clientWidth - 10;
    canvas.height = document.documentElement.clientHeight - 10;
    window.addEventListener("resize", function () {
      canvas.width = document.documentElement.clientWidth - 10;
      canvas.height = document.documentElement.clientHeight - 10;
    });
    console.log(canvas.width);
    perf = document.querySelector("#perf");
    simulation = new Simulation(canvas, c, 100);
    simulation.start();

    canvas.addEventListener("mousedown", toggleClick);
    canvas.addEventListener("mouseup", toggleClick);
    canvas.addEventListener("mousemove", (e) => {
      if (click) simulation.addSand(e.clientX, e.clientY);
    });
  }

  function toggleClick() {
    click = !click;
  }

  initialize();
})();
