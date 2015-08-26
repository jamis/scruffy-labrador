require['layout/orthogonal'] = function() {

  Location = require('location/lattice').Location;

  Orthogonal = function() {
    var i = arguments.length - 1;

    this.columns = arguments[i];
    this.rows    = arguments[i-1];
    this.levels  = arguments[i-2] || 1;
    this.worlds  = arguments[i-3] || 1;
  }

  Orthogonal.location = function() {
    switch(arguments.length) {
      case 2: return new Location(arguments[0], arguments[1]);
      case 3: return new Location(arguments[0], arguments[1], arguments[2]);
      case 4: return new Location(arguments[0], arguments[1], arguments[2], arguments[3]);
      default: throw "wrong # of arguments"
    }
  }

  Orthogonal.prototype.build = function(grid, cellFactory) {
    cellFactory = cellFactory || require('cell').Cell;

    for(var world = 0; world < this.worlds; world++) {
      for(var level = 0; level < this.levels; level++) {
        for(var row = 0; row < this.rows; row++) {
          for(var column = 0; column < this.columns; column++) {
            var location = new Location(world, level, row, column);
            var cell = new cellFactory(location);

            var hither = grid.at(location.change({world: -1}));
            var down   = grid.at(location.change({level: -1}));
            var north  = grid.at(location.change({row: -1}));
            var west   = grid.at(location.change({column: -1}));

            if (hither) {
              cell.neighbor.hither = hither;
              hither.neighbor.yon = cell;
            }

            if (down) {
              cell.neighbor.down = down;
              down.neighbor.up = cell;
            }

            if (north) {
              cell.neighbor.north = north;
              north.neighbor.south = cell;
            }

            if (west) {
              cell.neighbor.west = west;
              west.neighbor.east = cell;
            }

            grid.addCell(cell);
          }
        }
      }
    }
  }

  return { Layout: Orthogonal };
}
