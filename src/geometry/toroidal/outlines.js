require['geometry/toroidal/outlines'] = function() {

  Point   = require('geometry/point').Point;
  Line    = require('geometry/line').Line;
  Polygon = require('geometry/polygon').Polygon;
  Style   = require('geometry/style').Style;

  Outlines = function(grid, scale, styles) {
    scale = scale || 1;
    styles = styles || {};

    if (typeof scale != "object")
      scale = { x: scale, y: scale };

    this.grid = grid;
    this.layers = [[], []];

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
      var row = cell.location.row;
      var column = cell.location.column;

      var y1 = row * scale.y;
      var y2 = (row + 1) * scale.y;

      var width = scale.x / grid.layout.cellCounts[row];
      var x1 = column * width;
      var x2 = (column+1) * width;

      var nw = new Point(x1, y1);
      var ne = new Point(x2, y1);
      var sw = new Point(x1, y2);
      var se = new Point(x2, y2);

      if (nw.x < self.min.x) self.min.x = nw.x;
      if (nw.y < self.min.y) self.min.y = nw.y;
      if (se.x > self.max.x) self.max.x = se.x;
      if (se.y > self.max.y) self.max.y = se.y;

      var polyStyle = cell.data.polyStyle || defaultPolyStyle;
      var wallStyle = cell.data.wallStyle || defaultWallStyle;

      self.layers[0].push(new Polygon([nw, ne, se, sw], polyStyle));

      if (!cell.isLinked(cell.neighbor.west))
        self.layers[1].push(new Line(nw, sw, wallStyle));

      var wallInc = width / cell.neighbor.south.length;
      var prior = x1;
      for(var i = 0; i < cell.neighbor.south.length; i++) {
        var x = x1 + wallInc * (i+1);
        var south = cell.neighbor.south[i];

        if(!cell.isLinked(south)) {
          var sw = new Point(prior, y2);
          var se = new Point(x, y2);
          self.layers[1].push(new Line(sw, se, wallStyle));
        }

        prior = x;
      }
    });
  }

  return {
    Outlines: Outlines
  };

}
