require['geometry/orthogonal/paths'] = function() {

  Point   = require('geometry/point').Point;
  Line    = require('geometry/line').Line;
  Style   = require('geometry/style').Style;

  Paths = function(grid, scale, styles) {
    scale = scale || 1;
    styles = styles || {};

    if (typeof scale != "object")
      scale = { x: scale, y: scale };

    this.grid = grid;
    this.layers = [];

    var defaultPathStyle = styles.path;

    this.min = new Point(1000000, 1000000)
    this.max = new Point(-1000000, -1000000)

    if (!defaultPathStyle) {
      defaultPathStyle = new Style();
      defaultPathStyle.strokeStyle = "black";
    }

    var self = this;
    grid.each(function(cell) {
      var world = cell.location.world;
      var level = cell.location.level;
      var row = cell.location.row;
      var column = cell.location.column;

      if (!self.layers[world]) self.layers[world] = [];
      if (!self.layers[world][level]) self.layers[world][level] = [[]];

      var point = new Point((column+0.5)*scale.x, (row+0.5)*scale.y);
      var south = new Point((column+0.5)*scale.x, (row+1.5)*scale.y);
      var east  = new Point((column+1.5)*scale.x, (row+0.5)*scale.y);

      if (point.x < self.min.x) self.min.x = point.x;
      if (point.y < self.min.y) self.min.y = point.y;
      if (point.x > self.max.x) self.max.x = point.x;
      if (point.y > self.max.y) self.max.y = point.y;

      var wallStyle = cell.data.wallStyle || defaultPathStyle;

      if (cell.isLinked(cell.neighbor.south))
        self.layers[world][level][0].push(new Line(point, south, wallStyle));
      if (cell.isLinked(cell.neighbor.east))
        self.layers[world][level][0].push(new Line(point, east, wallStyle));
    });
  }

  return {
    Paths: Paths
  };

}
