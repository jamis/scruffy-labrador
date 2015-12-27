require['layout/toroidal'] = function() {

  var Location = require('location/lattice').Location;

  var Toroidal = function(rowCount, minorRadius) {
    this.rowCount = rowCount;
    this.minorRadius = minorRadius;
    this.cellCounts = [];
  }

  Toroidal.location = function(row, column) {
    return new Location(row, column);
  }

  Toroidal.prototype.build = function(grid, cellFactory) {
    cellFactory = cellFactory || require('cell').Cell;

    // angular height of a single row (unit circle)
    var theta = 2 * Math.PI / this.rowCount;

    // minor circumference of the torus (poloidal distance)
    var minorCirc = 2 * Math.PI * this.minorRadius;
    var rowHeight = minorCirc / this.rowCount;

    // the row with the largest dimension, and maximum # of cells
    var equator = (this.rowCount-1) / 2;

    var priorRow, firstRow;

    for(var rowIdx = 0; rowIdx < this.rowCount; rowIdx++) {
      var northAngle = theta * rowIdx;
      var southAngle = theta * (rowIdx + 1);

      // 1 == major radius of torus
      // north/south radius -- radius of the circle formed by the
      //   boundary on that side of the current row
      var southRadius = 1 - this.minorRadius * Math.cos(southAngle);
      var northRadius = 1 - this.minorRadius * Math.cos(northAngle);

      // distance around the torus for the given boundary of the current
      // row
      var southCirc = 2 * Math.PI * southRadius;
      var northCirc = 2 * Math.PI * northRadius;

      var shortest = southCirc;
      if (northCirc < shortest) shortest = northCirc;

      var idealCount = shortest / rowHeight;
      var count = 1;

      if(rowIdx == 0) {
        if(idealCount > count) count = Math.round(idealCount);
      } else if(rowIdx > equator) {
        var mirror = this.rowCount - rowIdx - 1;
        count = this.cellCounts[mirror];
      } else {
        priorCount = this.cellCounts[rowIdx-1];

        if(idealCount < (priorCount * 2.0 / 3))
          count = priorCount / 2;
        else if(idealCount > (priorCount * 3.0 / 2))
          count = priorCount * 2;
        else
          count = priorCount;
      }

      this.cellCounts[rowIdx] = count;
      var row = [];

      firstRow = firstRow || row;

      for(var col = 0; col < count; col++) {
        var cell = new cellFactory(new Location(rowIdx, col));
        cell.neighbor.north = [];
        cell.neighbor.south = [];
        row.push(cell);
        grid.addCell(cell);
      }

      for(var col = 0; col < count; col++) {
        var cell = row[col];

        if(priorRow) {
          if(priorRow.length == row.length) {
            cell.neighbor.north.push(priorRow[col]);
          } else if(priorRow.length < row.length) {
            cell.neighbor.north.push(priorRow[Math.floor(col/2)]);
          } else if(priorRow.length > row.length) {
            cell.neighbor.north.push(priorRow[col*2]);
            cell.neighbor.north.push(priorRow[col*2+1]);
          }

          for(var i = 0; i < cell.neighbor.north.length; i++) {
            var n = cell.neighbor.north[i];
            n.neighbor.south.push(cell);
          }
        }

        var west = (col - 1) % count;
        if(west < 0) west = west + count;
        cell.neighbor.west = row[west];
        cell.neighbor.east = row[(col + 1) % count];
      }

      priorRow = row;
    }

    // account for north/south boundary wrapping
    for(var col = 0; col < firstRow.length; col++) {
      var cell1 = firstRow[col];
      var cell2 = priorRow[col];
      cell1.neighbor.north.push(cell2);
      cell2.neighbor.south.push(cell1);
    }
  }

  return { Layout: Toroidal };
}
