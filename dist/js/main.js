(function () {
'use strict';

// Run function with document is ready
function onReady(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

// Fisher-Yates shuffle
function shuffle(a) {
  let len = a.length;

  return [...a.keys()].reduceRight((a, i) => {
    let rand = Math.floor(Math.random() * len);

    return (rand === i) ? a : swap(a, i, rand);
  }, a);
}

// immutably swap two values in an array
function swap(a, x, y) {
  let array = [...a];
  let tmp = array[x];

  array[x] = array[y];
  array[y] = tmp;

  return array;
}

// FPS Timer
class Timer {
  constructor() {
    this.elapsed = 0;
    this.last = null;
  }

  tick(now) {
    this.elapsed = (now - (this.last || now)) / 1000;
    this.last = now;
  }

  fps() {
    return 1 / this.elapsed;
  }
}

var timer = new Timer();

// Main Loop
(() => {
  function main (now) {
    requestAnimationFrame(main);
    timer.tick(now);
  }

  main();
})();

const BRIGHT_BLUE = 0;
const YELLOW = 1;
const BRIGHT_GREEN = 2;
const BLUE = 3;
const PURPLE = 4;
const GREEN = 5;
const SALMON = 6;

const I_BLOCK = {
  color: BRIGHT_BLUE,
  origin: [3, -1],
  rotations: [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0]
    ]
  ]
};

const S_BLOCK = {
  color: YELLOW,
  origin: [3, 0],
  rotations: [
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1]
    ],
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0]
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0]
    ]
  ]
};

const Z_BLOCK = {
  color: BLUE,
  origin: [3, 0],
  rotations: [
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1]
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0]
    ]
  ]
};

const T_BLOCK = { 
  color: PURPLE,
  origin: [3, 0],
  rotations: [
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0]
    ]
  ]
};

const J_BLOCK = { 
  color: GREEN,
  origin: [3, 0],
  rotations: [
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0]
    ]
  ]
};

const L_BLOCK = { 
  color: SALMON,
  origin: [3, -1],
  rotations: [
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0]
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1]
    ]
  ]
};

const O_BLOCK = {
  color: BRIGHT_GREEN,
  origin: [4, 0],
  rotations: [
    [
      [1, 1],
      [1, 1]
    ]
  ]
};

const BLOCKS$1 = [
  I_BLOCK,
  S_BLOCK,
  Z_BLOCK,
  J_BLOCK,
  L_BLOCK,
  T_BLOCK,
  O_BLOCK
];

class Tetrimino {
  constructor(block) {
    this.origin = block.origin;
    this.rotations = block.rotations;
    this.x = block.origin[0];
    this.y = block.origin[1];
    this.color = block.color;
    this.rotation = 0;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  moveDown(board) {
    let collision = this.isCollision({x: this.x, y: this.y + 1}, this.rotation, board);
    if (!collision) {
      this.y += 1;
    }

    return collision;
  }

  moveLeft(board) {
    let newCoords = {x: this.x - 1, y: this.y};

    if (!this.isCollision(newCoords, this.rotation, board)) {
      this.x -= 1;
    }
  }

  moveRight(board) {
    if (!this.isCollision({x: this.x + 1, y: this.y}, this.rotation, board)) {
      this.x += 1;
    }
  }

  rotateLeft(board) {
    let coords = {x: this.x, y: this.y};
    let newRotation = this.rotation > 0 ? this.rotation - 1 : this.rotations.length - 1;

    if (!this.isCollision(coords, newRotation, board)) {
      this.rotation = newRotation;
    }
  }

  rotateRight(board) {
    let coords = {x: this.x, y: this.y};
    let newRotation = this.rotation < this.rotations.length - 1 ?  this.rotation + 1 : 0;

    if (!this.isCollision(coords, newRotation, board)) {
      this.rotation = newRotation;
    }
  }

  isCollision(coords, rotation, board) {
    return this.rotations[rotation].reduce((acc, row, y) => {
      return acc || row.reduce((acc, block, x) => {
        if (block === 1) {
          if ((coords.x + x) < 0) {
            return acc || true;
          } else if ((coords.x + x) === 10) {
            return acc || true;
          } else if ((coords.y + y) === 20) {
            return acc || true;
          } else if (board[coords.y + y][coords.x + x].occupied === 1) {
            return acc || true;
          } else {
            return acc || false;
          }
        }

        return acc || false;
      }, acc);
    }, false);
  }
}

let blocks = shuffle(BLOCKS$1);
let block = blocks.pop();

const STATE = {
  board: generateBoard(),
  canvas: document.getElementById('canvas'),
  ctx: canvas.getContext('2d'),
  img: new Image(),
  start: 0,
  accruedTime: 0,
  blocks: blocks,
  tetrimino: new Tetrimino(block),
  dropTime: 500
};

function generateBoard() {
  let board = [];

  for (let y = 0; y < 20; y++) {
    board[y] = [];
    for (let x = 0; x < 10; x++) {
      board[y][x] = { occupied: 0 };
    }
  }

  return board;
}

function updateBoard(board, tetrimino) {
  tetrimino.rotations[tetrimino.rotation].forEach((row, yOffset) => {
    row.forEach((cell, xOffset) => {
      if (cell === 1) {
        let block = { color: tetrimino.color, occupied: 1 };

        board[tetrimino.y + yOffset][tetrimino.x + xOffset] = block;
      }
    });
  });

  let completedRows = board.reduce((acc, row, i) => { 
    return row.every(block => block.occupied === 1) ? [...acc, i] : acc
  }, []);

  board = completedRows.reduce((acc, i) => {
    return [
      (new Array(10)).fill(0), 
      ...acc.slice(0, i), 
      ...acc.slice(i + 1, acc.length)
    ];
  }, board);

  return board;
}

function mainLoop(now) {
  let af = window.requestAnimationFrame(mainLoop);

  STATE.start = (STATE.start === 0) ? now : STATE.start;
  STATE.accruedTime = now - STATE.start;

  document.removeEventListener('keydown', keyDownHandling);
  if (STATE.accruedTime > STATE.dropTime) {
    update();
  }

  animate();
  document.addEventListener('keydown', keyDownHandling);
}

function drawBoard() {
  STATE.board.forEach((row, rowIndex) => {
    row.forEach((block, columnIndex) => {
      if ( block.occupied === 1 ) {
        STATE.ctx.drawImage(
          STATE.img,
          32 * block.color,
          0,
          32,
          32,
          columnIndex * 32,
          rowIndex * 32,
          32,
          32
        );
      }
    });
  });
}

function drawTetrimino() {
  let rows = STATE.tetrimino.rotations[STATE.tetrimino.rotation];

  rows.forEach((row, rowIndex) => {
    row.forEach((block, columnIndex) => {
      if ( block === 1 ) {
        STATE.ctx.drawImage(
          STATE.img, 
          32 * STATE.tetrimino.color,
          0,
          32,
          32,
          (STATE.tetrimino.x * 32) + (columnIndex * 32), 
          (STATE.tetrimino.y * 32) + (rowIndex * 32),
          32,
          32
        );
      }
    });
  });
}

function update() {
  let collision = STATE.tetrimino.moveDown(STATE.board);
  STATE.accruedTime = 0;
  STATE.start = 0;

  if (collision) {
    STATE.board = updateBoard(STATE.board, STATE.tetrimino);

    if (STATE.blocks.length === 0) {
      let blocks = shuffle(BLOCKS$1);
      let block = blocks.pop();

      STATE.blocks = blocks;
      STATE.tetrimino = new Tetrimino(block, block.origin[0], block.origin[1]);
    } else {
      let block = STATE.blocks.pop();

      STATE.tetrimino = new Tetrimino(block, block.origin[0], block.origin[1]);
    }
  }
}

function hardDrop() {
  let collision;

  do {
    collision = STATE.tetrimino.moveDown(STATE.board);
  } while (!collision);
}

function animate() {
  STATE.ctx.clearRect(0, 0, STATE.canvas.width, STATE.canvas.height);
  drawBoard();
  drawTetrimino();
}

function keyDownHandling(e) {
  switch (e.key) {
    case 'a':
      STATE.tetrimino.moveLeft(STATE.board);
      break;

    case 'd':
      STATE.tetrimino.moveRight(STATE.board);
      break;

    case 'j':
      STATE.tetrimino.rotateLeft(STATE.board);
      break;

    case 'k':
      STATE.tetrimino.rotateRight(STATE.board);
      break;

    case 'w':
      hardDrop();
      break;

    case 's':
      STATE.dropTime = 50;
      break;
  }
}


function keyUpHandling(e) {
  switch (e.key) {
    case 's':
      STATE.dropTime = 500;
      break;
  }
}

function main() {
  STATE.img.src = "img/tetrominos.png";

  document.addEventListener('keydown', keyDownHandling);
  document.addEventListener('keyup', keyUpHandling);
  requestAnimationFrame(mainLoop);
}

onReady(main);

}());
