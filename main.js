let showLabels = true;
let polygon = new Polygon([]);
let triangles = [];
let interval;
let generator;
let output = document.getElementById('output');
let input = document.getElementById('input');

function init() {
  console.log(`have ${polygon.vertices.length} vertices`);
  ctx.setTransform(SCALE, 0, 0, -SCALE, 0, H);
}

function render() {
  ctx.clearRect(0, 0, W, H);
  renderPolygon(polygon);
  triangles.forEach(renderTriangle);
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

function renderTriangle([a, b, c], i) {
  ctx.save();
  ctx.fillStyle = 'hsl(' + (i / triangles.length) * 360.0 + ', 50%, 50%)';
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(c.x, c.y);
  ctx.fill();
  ctx.restore();
}

function renderEdge(from, to) {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

function reset() {
  done();
  triangles = [];
  setPolygonFromInput();
  generator = triangulatePolygon(polygon);
  output.value = '';
}

function done() {
  generator = undefined;
  if (interval !== undefined) {
    clearInterval(interval);
    interval = undefined;
  }
}

function step() {
  if (generator !== undefined) {
    const next = generator.next();
    if (!next.done)
      handleNewStep(next.value);
    else
      done();
  }
}

function run() {
  if (interval === undefined)
    interval = setInterval(step, 250);
}

function triangleToString(triangle) {
  return triangle.map(vertex => vertex.x + ' ' + vertex.y).join(' | ');
}

function handleNewStep(newTriangle) {
  console.log("new triangle", newTriangle);
  triangles.push(newTriangle);
  output.value += triangleToString(newTriangle) + '\n';
}

function setPolygonFromInput() {
  const str = input.value.trim();
  const lines = str.split('\n');
  const n = parseFloat(lines[0]);
  const vertices = lines.slice(1, n + 1).map(line => p(...line.split(' ').map(parseFloat)));
  polygon = new Polygon(vertices);
}

init();
render();
reset();
