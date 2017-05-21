import * as util from './util.js';
import BLOCKS from './blocks.js';
import { Tetrimino } from './tetrimino.js';

let blocks = util.shuffle(BLOCKS);
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
    quadrel: 0
  },
  stats: {
    rows: null,
    quadrel: null
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
        return Object.assign({}, acc, { prev: n, sequence: 0, quadrel: acc.quadrel + 1 });
      }
      return Object.assign({}, acc, { prev: n, sequence: acc.sequence + 1 });
    }
    return Object.assign({}, acc, { prev: n, sequence: 0 });
  }, { prev: 0, sequence: 0, quadrel: 0 });

  STATE.completed.quadrel += stats.quadrel;

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
  STATE.stats.quadrel.textContent = STATE.completed.quadrel;
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
  STATE.accruedTime = 0
  STATE.start = 0

  if (collision) {
    let block = STATE.blocks.pop();

    STATE.board = updateBoard(STATE.board, STATE.tetrimino);
    STATE.tetrimino = new Tetrimino(block);
    STATE.ghost = new Tetrimino(block);
    STATE.ghost.hardDrop(STATE.board);

    if (STATE.blocks.length === 1) {
      let blocks = util.shuffle(BLOCKS);
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
  STATE.img.src = "img/tetriminos.png"
  STATE.ghost.hardDrop(STATE.board);
  STATE.stats.rows = document.getElementById('1-row-count');
  STATE.stats.quadrel = document.getElementById('4-row-count');

  document.addEventListener('keydown', keyDownHandling);
  document.addEventListener('keyup', keyUpHandling);

  requestAnimationFrame(mainLoop);
}

util.onReady(main);
