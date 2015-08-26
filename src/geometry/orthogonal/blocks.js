require['geometry/orthogonal/blocks'] = function() {

  Point   = require('geometry/point').Point;
  Polygon = require('geometry/polygon').Polygon;
  Style   = require('geometry/style').Style;

  Blocks = function(grid, scale, styles) {
    scale = scale || 1;
    styles = styles || {};

    this.grid = grid;
    this.layers = [];

    var defaultBlockStyle = styles.block;
    var defaultFloorStyle = styles.floor;

    this.min = new Point(1000000, 1000000)
    this.max = new Point(-1000000, -1000000)

    if (!defaultBlockStyle) {
      defaultBlockStyle = new Style();
      defaultBlockStyle.strokeStyle = "gray";
      defaultBlockStyle.fillStyle = "black";
    }

    var self = this;
    grid.each(function(cell) {
      var world = cell.location.world;
      var level = cell.location.level;
      var row = cell.location.row;
      var column = cell.location.column;

      if (!self.layers[world]) self.layers[world] = [];
      if (!self.layers[world][level]) self.layers[world][level] = [[], []];

      var nw = new Point(column*scale, row*scale);
      var ne = new Point((column+1)*scale, row*scale);
      var sw = new Point(column*scale, (row+1)*scale);
      var se = new Point((column+1)*scale, (row+1)*scale);

      if (nw.x < self.min.x) self.min.x = nw.x;
      if (nw.y < self.min.y) self.min.y = nw.y;
      if (se.x > self.max.x) self.max.x = se.x;
      if (se.y > self.max.y) self.max.y = se.y;

      var list = self.layers[world][level][0];

      var floorStyle = cell.style || defaultFloorStyle;
      var blockStyle = cell.style || defaultBlockStyle;

      if (cell.isOpen()) {
        if (floorStyle) {
          list.push(new Polygon([nw, ne, se, sw], floorStyle));
        }
      } else {
        list.push(new Polygon([nw, ne, se, sw], blockStyle));
      }
    });
  }

  return {
    Blocks: Blocks
  };

}
