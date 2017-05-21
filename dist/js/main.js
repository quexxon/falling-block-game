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

  hardDrop(board) {
    let collision;

    do {
      collision = this.moveDown(board);
    } while (!collision);
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
  canvas: null,
  preview: null,
  ctx: null,
  pctx: null,
  img: new Image(),
  start: 0,
  accruedTime: 0,
  blocks: blocks,
  tetrimino: new Tetrimino(block),
  ghost: new Tetrimino(block, true),
  dropTime: 500,
  completed: {
    rows: 0,
    tetris: 0
  },
  stats: {
    rows: null,
    tetris: null
  }
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

  STATE.completed.rows += completedRows.length;

  let stats = completedRows.reduce((acc, n) => {
    if ( acc.prev + 1 === n ) {
      if (acc.sequence + 1 === 3) {
        return Object.assign({}, acc, { prev: n, sequence: 0, tetris: acc.tetris + 1 });
      }
      return Object.assign({}, acc, { prev: n, sequence: acc.sequence + 1 });
    }
    return Object.assign({}, acc, { prev: n, sequence: 0 });
  }, { prev: 0, sequence: 0, tetris: 0 });

  STATE.completed.tetris += stats.tetris;

  board = completedRows.reduce((acc, i) => {
    return [
      (new Array(10)).fill(0), 
      ...acc.slice(0, i), 
      ...acc.slice(i + 1, acc.length)
    ];
  }, board);

  updateStats();

  return board;
}

function updateStats() {
  STATE.stats.rows.textContent = STATE.completed.rows;
  STATE.stats.tetris.textContent = STATE.completed.tetris;
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

function drawTetrimino(tetrimino) {
  let rows = tetrimino.rotations[STATE.tetrimino.rotation];

  rows.forEach((row, rowIndex) => {
    row.forEach((block, columnIndex) => {
      if ( block === 1 ) {
        STATE.ctx.drawImage(
          STATE.img, 
          32 * tetrimino.color,
          0,
          32,
          32,
          (tetrimino.x * 32) + (columnIndex * 32), 
          (tetrimino.y * 32) + (rowIndex * 32),
          32,
          32
        );
      }
    });
  });
}

function drawPreview(tetrimino) {
  STATE.pctx.clearRect(0, 0, STATE.preview.width, STATE.preview.height);

  let rows = tetrimino.rotations[0];

  rows.forEach((row, rowIndex) => {
    row.forEach((block, columnIndex) => {
      if ( block === 1 ) {
        STATE.pctx.drawImage(
          STATE.img, 
          32 * tetrimino.color,
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

function update() {
  let collision = STATE.tetrimino.moveDown(STATE.board);
  STATE.accruedTime = 0;
  STATE.start = 0;

  if (collision) {
    let block = STATE.blocks.pop();

    STATE.board = updateBoard(STATE.board, STATE.tetrimino);
    STATE.tetrimino = new Tetrimino(block);
    STATE.ghost = new Tetrimino(block);
    STATE.ghost.hardDrop(STATE.board);

    if (STATE.blocks.length === 1) {
      let blocks = shuffle(BLOCKS$1);
      STATE.blocks = [...blocks, ...STATE.blocks];
    }
  }
}


function animate() {
  let nextTetrimino = STATE.blocks[STATE.blocks.length - 1];

  STATE.ctx.clearRect(0, 0, STATE.canvas.width, STATE.canvas.height);
  drawBoard();
  STATE.ctx.globalAlpha = 0.25;
  drawTetrimino(STATE.ghost);
  STATE.ctx.globalAlpha = 1.0;
  drawTetrimino(STATE.tetrimino);
  drawPreview(nextTetrimino);
}

function keyDownHandling(e) {
  switch (e.key) {
    case 'a':
      STATE.tetrimino.moveLeft(STATE.board);
      STATE.ghost.setPosition(STATE.tetrimino.x, STATE.tetrimino.y);
      STATE.ghost.hardDrop(STATE.board);
      break;

    case 'd':
      STATE.tetrimino.moveRight(STATE.board);
      STATE.ghost.setPosition(STATE.tetrimino.x, STATE.tetrimino.y);
      STATE.ghost.hardDrop(STATE.board);
      break;

    case 'j':
      STATE.ghost.setPosition(STATE.tetrimino.x, STATE.tetrimino.y);
      STATE.tetrimino.rotateLeft(STATE.board);
      STATE.ghost.rotateLeft(STATE.board);
      STATE.ghost.hardDrop(STATE.board);
      break;

    case 'k':
      STATE.ghost.setPosition(STATE.tetrimino.x, STATE.tetrimino.y);
      STATE.tetrimino.rotateRight(STATE.board);
      STATE.ghost.rotateRight(STATE.board);
      STATE.ghost.hardDrop(STATE.board);
      break;

    case 'w':
      STATE.tetrimino.hardDrop(STATE.board);
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
  let canvas = document.getElementById('canvas');
  let preview = document.getElementById('preview');

  STATE.canvas = canvas;
  STATE.preview = preview;
  STATE.ctx = canvas.getContext('2d');
  STATE.pctx = preview.getContext('2d');
  STATE.img.src = "img/tetriminos.png";
  STATE.ghost.hardDrop(STATE.board);
  STATE.stats.rows = document.getElementById('1-row-count');
  STATE.stats.tetris = document.getElementById('4-row-count');

  document.addEventListener('keydown', keyDownHandling);
  document.addEventListener('keyup', keyUpHandling);

  requestAnimationFrame(mainLoop);
}

onReady(main);

}());
