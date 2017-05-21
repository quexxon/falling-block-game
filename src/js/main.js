import * as util from './util.js';
import BLOCKS from './blocks.js';
import { Tetrimino } from './tetrimino.js';

let blocks = util.shuffle(BLOCKS);
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
  STATE.accruedTime = 0
  STATE.start = 0

  if (collision) {
    STATE.board = updateBoard(STATE.board, STATE.tetrimino);

    if (STATE.blocks.length === 0) {
      let blocks = util.shuffle(BLOCKS);
      let block = blocks.pop()

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
  STATE.img.src = "img/tetrominos.png"

  document.addEventListener('keydown', keyDownHandling);
  document.addEventListener('keyup', keyUpHandling);
  requestAnimationFrame(mainLoop);
}

util.onReady(main);
