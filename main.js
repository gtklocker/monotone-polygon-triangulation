let showLabels = true;
const polygon = new Polygon([
  p(200, 180),
  p(180, 190),
  p(165, 210),
  p(165, 235),
  p(150, 250),
  p(100, 170),
  p(120, 120),
  p(150, 100),
  p(170, 140),
  p(130, 150)
]);
const diagonals = [];

function init() {
  console.log(`have ${polygon.vertices.length} vertices`);
  ctx.setTransform(SCALE, 0, 0, -SCALE, 0, H);
}

function render() {
  ctx.clearRect(0, 0, W, H);
  renderPolygon(polygon);
  diagonals.forEach(renderDiagonal);
  requestAnimationFrame(render);
}

function renderPolygon(polygon) {
  const { vertices } = polygon;
  for (let i = 0; i < vertices.length; ++i) {
    if (showLabels) renderLabel(i, vertices[i]);
    renderEdge(vertices[i], vertices[(i + 1) % vertices.length]);
  }
}

function renderLabel(label, point) {
  // we have to manually provide the translated coordinates because of bad
  // handling of the translation matrix from strokeText
  const view = point.modelToView();
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = "20px monospace";
  ctx.strokeText(label, view.x + 5, view.y + 5);
  ctx.restore();
}

function renderDiagonal([a, b]) {
  ctx.save();
  ctx.setLineDash([3]);
  ctx.strokeStyle = "red";
  renderEdge(a, b);
  ctx.restore();
}

function renderEdge(from, to) {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

function lazyEval(gen, cb) {
  setTimeout(() => {
    const next = gen.next();
    if (!next.done) {
      cb(next.value);
      lazyEval(gen, cb);
    }
  }, 250);
}

init();
render();
lazyEval(triangulatePolygon(polygon), newDiagonal => {
  console.log("new diagonal", newDiagonal);
  diagonals.push(newDiagonal);
});
