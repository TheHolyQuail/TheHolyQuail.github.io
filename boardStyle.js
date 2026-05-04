// Adjust the div’s width/height or the script’s SPACING/OFFSET to fit your design.
// Change the class name in document.querySelector('.canvas-container') to match your div.

// --- SETTINGS ------------------------------------
const ENDLESS_MODE = false;
// const BACKGROUND_COLOR = '#094D1C';
// const INITIAL_DOT_COLOR = '#0F7D2D';
const BACKGROUND_COLOR = '#090c4d';
const INITIAL_DOT_COLOR = '#0f467d';
const INITIAL_DOT_WEIGHT = 2;
const FINAL_DOT_WEIGHT = 20;

const OFFSET = 20;
const SPACING = 20;

const NUMBER_WALKERS = 300;
// Choose from ['random', 'vrt', 'hrz']
const TYPES = ['random', 'vrt', 'hrz'];

const LINE_COLOR = '#b87333';
const LINE_WEIGHT = 5;
const LINE_CAP = 'Rounded';

// -------------------------------------------------

function spawnWalker(x, y, spacing, offset, rgb, type) {
  this.currX = x;
  this.currY = y;
  this.spacing = spacing;
  this.offset = offset;
  this.path = [];
  this.drawnPath = [];
  this.lastChoice = {};
  this.penulChoice = {};
  this.backtracked = false;

  this.advance = function (grid) {
    opts = this.getOptions(grid);
    if (type == 'random') {
      choice = random(opts);
    } else if (type == 'vrt') {
      choice = opts[0];
    } else if (type == 'hrz') {
      choice = opts[2] ? opts[2] : random(opts);
    } else {
      choice = random(opts);
    }

    this.penulChoice = this.lastChoice;
    this.lastChoice = choice;

    if (choice) {
      this.path.push({ dx: this.currX, dy: this.currY });
      this.drawnPath.push({ dx: this.currX, dy: this.currY });
      this.currX = choice.dx;
      this.currY = choice.dy;
      this.backtracked = false;
      return { end: false, dx: this.currX, dy: this.currY };
    } else if (this.penulChoice) {
      this.path.push({ dx: this.currX, dy: this.currY });
      this.drawnPath.push({ dx: this.currX, dy: this.currY });
      this.backtracked = true;
      return { end: true, dx: this.penulChoice.dx, dy: this.penulChoice.dy };
    } else if (this.lastChoice) {
      this.path.push({ dx: this.currX, dy: this.currY });
      this.drawnPath.push({ dx: this.currX, dy: this.currY });
      this.path.push({ dx: this.currX, dy: this.currY });
      this.drawnPath.push({ dx: this.currX, dy: this.currY });
      this.backtracked = false;
      return { end: false, dx: this.lastChoice.dx, dy: this.lastChoice.dy };
    } else {
      backtracked = this.path.pop();
      if (backtracked !== undefined) {
        this.currX = backtracked.dx;
        this.currY = backtracked.dy;
        if (this.backtracked === false) {
          return { end: false, dx: backtracked.dx, dy: backtracked.dy };
        }
      }
      this.backtracked = true;
    }
  };

  this.getOptions = function (grid) {
    options = [];
    if (this.currY > 0 && grid[this.currX][this.currY - 1] === 1) {
      options.push({ dx: this.currX, dy: this.currY - 1 });
    }
    if (this.currY < grid[0].length - 1 && grid[this.currX][this.currY + 1] === 1) {
      options.push({ dx: this.currX, dy: this.currY + 1 });
    }
    if (this.currX > 0 && grid[this.currX - 1][this.currY] === 1) {
      options.push({ dx: this.currX - 1, dy: this.currY });
    }
    if (this.currX < grid.length - 1 && grid[this.currX + 1][this.currY] === 1) {
      options.push({ dx: this.currX + 1, dy: this.currY });
    }
    return options;
  };

  this.display = function (g) {
    for (let n = 0; n < this.drawnPath.length - 1; n++) {
      if (
        dist(
          this.drawnPath[n].dx * this.spacing + this.offset,
          this.drawnPath[n].dy * this.spacing + this.offset,
          this.drawnPath[n + 1].dx * this.spacing + this.offset,
          this.drawnPath[n + 1].dy * this.spacing + this.offset
        ) <= this.spacing + 0.1
      ) {
        strokeWeight(LINE_WEIGHT);
        stroke(`${rgb}`);
        LINE_CAP === 'PROJECT' ? strokeCap(PROJECT) : strokeCap(ROUND);
        line(
          this.drawnPath[n].dx * this.spacing + this.offset,
          this.drawnPath[n].dy * this.spacing + this.offset,
          this.drawnPath[n + 1].dx * this.spacing + this.offset,
          this.drawnPath[n + 1].dy * this.spacing + this.offset
        );
      }
    }
  };
}

function makeGrid(w, h, spacing, offset) {
  this.w = w;
  this.h = h;
  this.spacing = spacing;
  this.offset = offset;
  this.grid = [];

  this.initGrid = function () {
    const rows = (this.w - this.offset * 2) / this.spacing;
    const columns = (this.h - this.offset * 2) / this.spacing;
    for (let x = 1; x < rows; x++) {
      row = [];
      for (let y = 1; y < columns; y++) {
        row.push(1);
      }
      this.grid.push(row);
    }
  };

  globalGrid = this.grid;

  this.display = function () {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[0].length; j++) {
        if (this.grid[i][j] === 1) {
          stroke(INITIAL_DOT_COLOR);
          strokeWeight(INITIAL_DOT_WEIGHT);
          point(i * this.spacing + this.offset, j * this.spacing + this.offset);
        } else if (this.grid[i][j] === 2) {
          stroke(LINE_COLOR);
          strokeWeight(FINAL_DOT_WEIGHT);
          point(i * this.spacing + this.offset, j * this.spacing + this.offset);
          strokeWeight(FINAL_DOT_WEIGHT / 2);
        //   stroke('#084217');
          stroke('#090c4d');
          point(i * this.spacing + this.offset, j * this.spacing + this.offset);
        }
      }
    }
  };
}

function gridHandler(grid, randomWalkers) {
  this.grid = grid;
  this.randomWalkers = [...randomWalkers];

  for (let n = 0; n < this.randomWalkers.length; n++) {
    this.grid.grid[randomWalkers[n].currX][randomWalkers[n].currY] = 0;
  }

  this.advanceGrid = function () {
    for (let n = 0; n < this.randomWalkers.length; n++) {
      toCheck = this.randomWalkers[n].advance(this.grid.grid);
      if (toCheck) {
        if (!toCheck.end && !ENDLESS_MODE) {
          this.grid.grid[toCheck.dx][toCheck.dy] = 0;
        } else if (toCheck.end) {
          this.grid.grid[toCheck.dx][toCheck.dy] = 2;
        }
      }
    }
  };

  this.display = function () {
    for (let n = 0; n < this.randomWalkers.length; n++) {
      this.randomWalkers[n].display();
    }
    this.grid.display();
  };
}

// --- NEW: Setup for a specific div ---
function setup() {
  // Replace 'canvas-container' with your div's class
  const container = document.querySelector('.canvas-container');
  if (!container) {
    console.error("Div with class 'canvas-container' not found!");
    return;
  }

  const wW = container.clientWidth;
  const wH = container.clientHeight;
  const hyp = Math.sqrt(wW * wW + wH * wH);
  const wx = hyp * 1.5;
  const wy = hyp * 1.5;

  const canvas = createCanvas(wx, wy);
    //   canvas.parent(container); // Attach canvas to the div
    // Create the canvas and manually append it to the container
    canvas.id('defaultCanvas0'); // Assign the same ID as the original
    canvas.parent(container);
    // !!!!!

  g = new makeGrid(wx, wy, SPACING, OFFSET);
  g.initGrid();

  let walkerArray = [];
  for (let i = 0; i < NUMBER_WALKERS; i++) {
    const typeRandom = Math.random();
    let typeChoice = null;
    if (typeRandom <= 0.7) { typeChoice = 'random'; }
    else if (typeRandom <= 0.85) { typeChoice = 'vrt'; }
    else { typeChoice = 'hrz'; }
    walkerArray.push(
      new spawnWalker(
        Math.round((globalGrid.length - 1) * Math.random()),
        Math.round((globalGrid[0].length - 1) * Math.random()),
        SPACING,
        OFFSET,
        LINE_COLOR,
        typeChoice
      )
    );
  }

  gridHandler = new gridHandler(g, walkerArray);
}

function draw() {
  background(BACKGROUND_COLOR);
  gridHandler.advanceGrid();
  gridHandler.display();
}
