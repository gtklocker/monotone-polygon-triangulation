class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  modelToView() {
    return new Point(this.x * SCALE, H - this.y * 2);
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
}

function p(x, y) {
  return new Point(x, y);
}
