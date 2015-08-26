require['grid'] = function() {

  _ = require('utility');

  Grid = function(layout, cellFactory) {
    this._cells = [];
    this._lookup = {};
    this.layout = layout;
    layout.build(this, cellFactory);
  }

  Grid.prototype.addCell = function(cell) {
    this._cells.push(cell);
    this._lookup[cell.location.key] = cell;
    return this;
  }

  Grid.prototype.size = function() {
    return this._cells.length;
  }

  Grid.prototype.at = function(location) {
    return this._lookup[location.key];
  }

  Grid.prototype.sample = function() {
    return _.sample(this._cells);
  }

  Grid.prototype.deadends = function() {
    var deadends = [];

    this.each(function(cell) {
      if (cell.isDeadEnd())
        deadends.push(cell);
    });

    return deadends;
  }

  Grid.prototype.braid = function(p) {
    p = p || 0.5;
    var deadends = _.shuffle(this.deadends());
    var count = Math.floor(deadends.length * p);

    for(var i = 0; i < count; i++) {
      var cell = deadends[i];
      if (cell.links().length > 1) continue;

      var options = _.reject(cell.neighbors(), function(n) { return cell.isLinked(n); });
      cell.link(_.sample(options));
    }
  }

  Grid.prototype.each = function(iterator) {
    for(var i = 0; i < this._cells.length; i++) {
      iterator(this._cells[i]);
    }
    return this;
  }

  return { Grid: Grid };
}
