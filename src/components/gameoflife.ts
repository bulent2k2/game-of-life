export class GofGameOfLife {
  canvas: HTMLElement;

  constructor(canvas: HTMLElement) {
    this.canvas = canvas;
  }

  next(shape) {
    var neighbours = {};
    var newShape = [];
    shape.forEach(function (cell, i) {
      var index;

      index = 'c' + (cell[0] - 1) + ',' + (cell[1] - 1);
      if (neighbours[index]) {
        neighbours[index].n++;
      } else {
        neighbours[index] = {n: 1, cell: [cell[0] - 1, cell[1] - 1]};
      }
      index = 'c' + (cell[0]) + ',' + (cell[1] - 1);
      if (neighbours[index]) {
        neighbours[index].n++;
      } else {
        neighbours[index] = {n: 1, cell: [cell[0], cell[1] - 1]};
      }
      index = 'c' + (cell[0] + 1) + ',' + (cell[1] - 1);
      if (neighbours[index]) {
        neighbours[index].n++;
      } else {
        neighbours[index] = {n: 1, cell: [cell[0] + 1, cell[1] - 1]};
      }
      index = 'c' + (cell[0] - 1) + ',' + (cell[1]);
      if (neighbours[index]) {
        neighbours[index].n++;
      } else {
        neighbours[index] = {n: 1, cell: [cell[0] - 1, cell[1]]};
      }
      index = 'c' + (cell[0] + 1) + ',' + (cell[1]);
      if (neighbours[index]) {
        neighbours[index].n++;
      } else {
        neighbours[index] = {n: 1, cell: [cell[0] + 1, cell[1]]};
      }
      index = 'c' + (cell[0] - 1) + ',' + (cell[1] + 1);
      if (neighbours[index]) {
        neighbours[index].n++;
      } else {
        neighbours[index] = {n: 1, cell: [cell[0] - 1, cell[1] + 1]};
      }
      index = 'c' + (cell[0]) + ',' + (cell[1] + 1);
      if (neighbours[index]) {
        neighbours[index].n++;
      } else {
        neighbours[index] = {n: 1, cell: [cell[0], cell[1] + 1]};
      }
      index = 'c' + (cell[0] + 1) + ',' + (cell[1] + 1);
      if (neighbours[index]) {
        neighbours[index].n++;
      } else {
        neighbours[index] = {n: 1, cell: [cell[0] + 1, cell[1] + 1]};
      }
    });
    shape.forEach(function (cell, i) {
      const index = 'c' + cell[0] + ',' + cell[1];
      if (neighbours[index]) {
        neighbours[index].populated = true;
      }
    });

    for (const index in neighbours) {
      if ((neighbours[index].n == 2 && neighbours[index].populated) || neighbours[index].n == 3) {
        newShape.push(neighbours[index].cell);
      }
    }
    return newShape;
  }
}
