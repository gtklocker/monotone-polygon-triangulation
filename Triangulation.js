function decreasingYCmp(a, b) {
  if (a.y !== b.y) return b.y - a.y;
  else return a.x - b.x;
}

function ySorted(points) {
  return points.concat().sort(decreasingYCmp);
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

// TODO: which chain do the top and bottom vertices belong to?
function vertexToChain(polygon) {
  const { leftChain, rightChain } = splitPolygonInChains(polygon);
  const chainOfVertex = new Array(polygon.vertices.length);
  for (let vertex of leftChain) chainOfVertex[vertex] = "l";
  for (let vertex of rightChain) chainOfVertex[vertex] = "r";
  return chainOfVertex;
}

function ccw(a, b, c) {
  return a.x * b.y - a.y * b.x + a.y * c.x - a.x * c.y + b.x * c.y - b.y * c.x;
}

function* triangulatePolygon(polygon) {
  const u = ySorted(polygon.vertices);
  const n = polygon.vertices.length;
  const S = [0, 1];
  const chainOf = vertexToChain(polygon);
  console.log({ chainOf });

  for (let j = 2; j < n - 1; ++j) {
    console.log(j, "" + S);
    const head = S[S.length - 1];
    if (chainOf[u[j].id] !== chainOf[u[head].id]) {
      console.log("different chain");
      while (S.length) {
        const head = S.pop();
        if (S.length === 0) break;
        yield [u[j], u[head]];
      }
      S.push(j - 1);
      S.push(j);
    } else {
      console.log("same chain");
      let lastPopped = S.pop();
      while (S.length) {
        const head = S[S.length - 1];
        console.log({ S, head });

        if (ccw(u[j], u[lastPopped], u[head]) <= 0)
          break;

        lastPopped = S.pop();
        yield [u[j], u[head]];
      }

      S.push(lastPopped);
      S.push(j);
    }
  }

  S.pop();
  while (S.length > 1) {
    const head = S.pop();
    yield [u[n - 1], u[head]];
  }
  console.log({ S });
}
