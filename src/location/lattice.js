require['location/lattice'] = function() {

  Location = function() {
    var i = arguments.length - 1;

    this.column = arguments[i];
    this.row    = arguments[i-1];
    this.level  = arguments[i-2] || 0;
    this.world  = arguments[i-3] || 0;

    this.key = "w" + this.world +
      "l" + this.level +
      "r" + this.row +
      "c" + this.column;
  }

  Location.prototype.change = function(object) {
    var world  = this.world  + (object.world  || 0);
    var level  = this.level  + (object.level  || 0);
    var row    = this.row    + (object.row    || 0);
    var column = this.column + (object.column || 0);

    return new Location(world, level, row, column);
  }

  return {
    Location: Location
  };

}
