class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  viewToModel() {
    return new Point(this.x / SCALE, (H - this.y) / SCALE);
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
}

function p(x, y) {
  return new Point(x, y);
}
