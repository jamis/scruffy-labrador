require['algorithm/recursive_backtracker'] = function() {

  var _ = require('utility');

  RecursiveBacktracker = function() {
  }

  RecursiveBacktracker.prototype.run = function(grid, start) {
    start = start || grid.sample();
    var stack = [ start ];

    var self = this;
    while(stack.length > 0) {
      var current = stack[stack.length-1];
      var neighbors = current.neighbors();
      var unvisited = _.select(current.neighbors(), function(n) { return n.links().length == 0; });

      if(unvisited.length == 0) {
        stack.pop();
      } else {
        var neighbor = _.sample(unvisited);
        current.link(neighbor);
        stack.push(neighbor);
      }
    }
  }

  return {
    Algorithm: RecursiveBacktracker
  };

}

