require['geometry/point'] = function() {

  var Epsilon = 0.00001;

  Point = function(x, y) {
    this.x = x;
    this.y = y;
  }

  Point.prototype.isEqual = function(point) {
    var x = Math.abs(point.x - x);
    var y = Math.abs(point.y - y);

    return (x < Epsilon) && (y < Epsilon);
  }

  return {
    Point: Point
  };

}
