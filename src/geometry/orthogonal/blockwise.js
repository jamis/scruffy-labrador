require['geometry/orthogonal/blockwise'] = function() {

  Point   = require('geometry/point').Point;
  Polygon = require('geometry/polygon').Polygon;
  Style   = require('geometry/style').Style;

  Blockwise = function(grid, scale, styles) {
    scale = scale || 1;
    styles = styles || {};

    this.grid = grid;
    this.layers = [];

    var defaultBlockStyle = styles.block;
    var defaultFloorStyle = styles.floor;

    this.min = new Point(0, 0);
    this.max = new Point(scale*(grid.layout.columns+1), scale*(grid.layout.rows+1));

    if (!defaultBlockStyle) {
      defaultBlockStyle = new Style();
      defaultBlockStyle.strokeStyle = "gray";
      defaultBlockStyle.fillStyle = "black";
    }

    // north and west boundary walls
    var half = scale * 0.5;
    for(var world = 0; world < grid.layout.worlds; world++) {
      this.layers[world] = [];
      for(var level = 0; level < grid.layout.levels; level++) {
        this.layers[world][level] = [[]];
        var list = this.layers[world][level][0];

        for(var row = 0; row < grid.layout.rows*2+1; row++) {
          var nw = new Point(0, row*half);
          var ne = new Point(half, row*half);
          var sw = new Point(0, (row+1)*half);
          var se = new Point(half, (row+1)*half);

          list.push(new Polygon([nw, ne, se, sw], defaultBlockStyle));
        }

        for(var col = 0; col < grid.layout.columns*2+1; col++) {
          var nw = new Point(col*half, 0);
          var ne = new Point((col+1)*half, 0);
          var sw = new Point(col*half, half);
          var se = new Point((col+1)*half, half);

          list.push(new Polygon([nw, ne, se, sw], defaultBlockStyle));
        }
      }
    }

    var self = this;
    grid.each(function(cell) {
      var world = cell.location.world;
      var level = cell.location.level;
      var row = cell.location.row;
      var column = cell.location.column;

      // a--b--c
      // |  |  |
      // d--e--f
      // |  |  |
      // g--h--i
      var a = new Point(half+column*scale,       half+row*scale);
      var b = new Point(half+(column+0.5)*scale, half+row*scale);
      var c = new Point(half+(column+1)*scale,   half+row*scale);
      var d = new Point(half+column*scale,       half+(row+0.5)*scale);
      var e = new Point(half+(column+0.5)*scale, half+(row+0.5)*scale);
      var f = new Point(half+(column+1)*scale,   half+(row+0.5)*scale);
      var g = new Point(half+column*scale,       half+(row+1)*scale);
      var h = new Point(half+(column+0.5)*scale, half+(row+1)*scale);
      var i = new Point(half+(column+1)*scale,   half+(row+1)*scale);

      var list = self.layers[world][level][0];

      var floorStyle = cell.style || defaultFloorStyle;
      var blockStyle = cell.style || defaultBlockStyle;

      var nw = [a, b, e, d];
      var ne = [b, c, f, e];
      var sw = [d, e, h, g];
      var se = [e, f, i, h];

      if (floorStyle) list.push(new Polygon(nw, floorStyle));
      list.push(new Polygon(se, blockStyle));

      if (cell.isLinked(cell.neighbor.south)) {
        if (floorStyle)
          list.push(new Polygon(sw, floorStyle));
      } else
        list.push(new Polygon(sw, blockStyle));

      if (cell.isLinked(cell.neighbor.east)) {
        if (floorStyle)
          list.push(new Polygon(ne, floorStyle));
      } else
        list.push(new Polygon(ne, blockStyle));
    });
  }

  return {
    Blockwise: Blockwise
  };

}
