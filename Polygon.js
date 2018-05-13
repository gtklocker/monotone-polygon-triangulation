class Polygon {
  constructor(vertices) {
    this.vertices = vertices;
    for (let i = 0; i < this.vertices.length; ++i) {
      this.vertices[i].id = i;
    }
  }
}
