require['geometry/orthogonal/outlines'] = function() {

  Point   = require('geometry/point').Point;
  Line    = require('geometry/line').Line;
  Polygon = require('geometry/polygon').Polygon;
  Style   = require('geometry/style').Style;

  Outlines = function(grid, scale, styles) {
    scale = scale || 1;
    styles = styles || {};

    this.grid = grid;
    this.layers = [];

    var defaultWallStyle = styles.wall;
    var defaultPolyStyle = styles.cell;

    this.min = new Point(1000000, 1000000)
    this.max = new Point(-1000000, -1000000)

    if (!defaultWallStyle) {
      defaultWallStyle = new Style();
      defaultWallStyle.strokeStyle = "black";
    }

    if (!defaultPolyStyle) {
      defaultPolyStyle = new Style();
      defaultPolyStyle.fillStyle = "transparent";
      defaultPolyStyle.strokeStyle = "transparent";
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

      var polyStyle = cell.data.polyStyle || defaultPolyStyle;
      var wallStyle = cell.data.wallStyle || defaultWallStyle;

      self.layers[world][level][0].push(new Polygon([nw, ne, se, sw], polyStyle));

      if (!cell.neighbor.north)
        self.layers[world][level][1].push(new Line(nw, ne, wallStyle));
      if (!cell.neighbor.west)
        self.layers[world][level][1].push(new Line(nw, sw, wallStyle));

      if (!cell.isLinked(cell.neighbor.south))
        self.layers[world][level][1].push(new Line(sw, se, wallStyle));
      if (!cell.isLinked(cell.neighbor.east))
        self.layers[world][level][1].push(new Line(ne, se, wallStyle));
    });
  }

  return {
    Outlines: Outlines
  };

}
