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

  // pattern = { row: 0 }
  // pattern = { row: { from: 1, to: 5, except: [3] } }
  // pattern = { row: function(row) { ... } }
  Location.prototype.match = function(pattern) {
    var matcher = function(value, pattern) {
      if (typeof pattern === "undefined") return true;

      if (typeof pattern !== "function") {
        var attrs;

        if (typeof pattern !== "object")
          attrs = { from: parseInt(pattern), to: parseInt(pattern), except: [] };
        else
          attrs = {
            from: pattern.from || 0,
            to: pattern.to || Infinity,
            except: pattern.except || [] };

        pattern = function(value) {
          if (value < attrs.from) return false;
          if (value > attrs.to) return false;
          if (attrs.except.indexOf(value) >= 0) return false;
          return true;
        }
      }

      return pattern(value);
    }

    return matcher(this.world,  pattern.world) &&
           matcher(this.level,  pattern.level) &&
           matcher(this.row,    pattern.row  ) &&
           matcher(this.column, pattern.column);
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
