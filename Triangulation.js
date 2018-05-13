function decreasingYCmp(a, b) {
  if (a.y !== b.y) return b.y - a.y;
  else return a.x - b.x;
}

function ySorted(points) {
  return points.concat().sort(ySortCmp);
}

// Javascript min/max doesn't take a custom comparator :(
function best(array, cmp, criterion) {
  if (array.length === 0) return undefined;
  let ret = array[0];
  let index = 0;
  let i;
  for (i = 0; i < array.length; ++i) {
    if (criterion(cmp(array[i], ret))) {
      ret = array[i];
      index = i;
    }
  }
  return { value: ret, index };
}
function min(array, cmp) {
  return best(array, cmp, x => x < 0);
}

function max(array, cmp) {
  return best(array, cmp, x => x > 0);
}

function range(start, end, step = 1) {
  const ret = [];
  for (let i = start; i !== end; i += step) ret.push(i);
  return ret;
}

function splitPolygonInChains(polygon) {
  const { vertices } = polygon;
  const topVertex = min(vertices, decreasingYCmp);
  const bottomVertex = max(vertices, decreasingYCmp);

  console.log({ topVertex, bottomVertex });

  let leftChain, rightChain;
  if (bottomVertex.index >= topVertex.index) {
    leftChain = range(topVertex.index, bottomVertex.index + 1);
    rightChain = range(topVertex.index, -1, -1).concat(
      range(vertices.length - 1, bottomVertex.index - 1, -1)
    );
  } else {
    leftChain = range(topVertex.index, vertices.length).concat(
      range(0, bottomVertex.index + 1)
    );
    rightChain = range(topVertex.index, bottomVertex.index - 1, -1);
  }

  return {
    leftChain,
    rightChain
  };
}

function* triangulatePolygon(polygon) {
  const S = [];
  yield;
}
