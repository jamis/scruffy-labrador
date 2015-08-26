require['algorithm/binary_tree'] = function() {

  var _ = require('utility');

  BinaryTree = function(directions) {
    this.directions = directions;
  }

  BinaryTree.prototype.run = function(grid) {
    var self = this;
    grid.each(function(cell) {
      var candidates = [];
      for(var i = 0; i < self.directions.length; i++) {
        var neighbor = cell.neighbor[self.directions[i]];
        if (neighbor)
          candidates.push(neighbor);
      }

      if (candidates.length > 0) {
        var candidate = _.sample(candidates);
        cell.link(candidate);
      }
    });
  }

  return {
    Algorithm: BinaryTree
  };

}
