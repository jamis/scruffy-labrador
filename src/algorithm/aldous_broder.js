require['algorithm/aldous_broder'] = function() {

  var _ = require('utility');

  AldousBroder = function() { }

  AldousBroder.prototype.run = function(grid, start) {
    cell = start || grid.sample();
    var count = grid.size() - 1;

    cell._abVisited = true;
    while(count > 0) {
      var neighbor = _.sample(cell.neighbors());

      if (!neighbor._abVisited) {
        cell.link(neighbor);
        neighbor._abVisited = true;
        count--;
      }

      cell = neighbor;
    }
  }

  return {
    Algorithm: AldousBroder
  };

}
