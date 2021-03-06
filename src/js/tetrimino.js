export class Tetrimino {
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
    let collision = this.isCollision({x: this.x, y: this.y + 1}, this.rotation, board)
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
