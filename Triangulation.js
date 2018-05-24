function splitPolygonInChains(polygon) {
  const { vertices } = polygon;
  const topVertex = _.maxBy(vertices, 'y');
  const bottomVertex = _.minBy(vertices, 'y');

  console.log({ topVertex, bottomVertex });

  let leftChain, rightChain;
  if (bottomVertex.id >= topVertex.id) {
    leftChain = _.range(topVertex.id, bottomVertex.id + 1);
    rightChain = _.range(topVertex.id, -1, -1).concat(
      _.range(vertices.length - 1, bottomVertex.id - 1, -1)
    );
  } else {
    leftChain = _.range(topVertex.id, vertices.length).concat(
      _.range(0, bottomVertex.id + 1)
    );
    rightChain = _.range(topVertex.id, bottomVertex.id - 1, -1);
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
  const u = _.sortBy(polygon.vertices, pt => -pt.y);
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
