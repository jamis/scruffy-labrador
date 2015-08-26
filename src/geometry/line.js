require['geometry/line'] = function() {

  Line = function(a, b, style) {
    this.a = a;
    this.b = b;
    this.style = style;
  }

  Line.prototype.render = function(ctx) {
    this.style.apply(ctx);

    ctx.beginPath();

    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);

    ctx.stroke();
  }

  Line.prototype.hasPoint = function(point) {
    var xdiff = (this.b.x - this.a.x);
    var ydiff = (this.b.y - this.a.y);

    if (xdiff == 0) // vertical line
      return Math.abs(point.x - this.b.x) < 0.00001;
    else if (ydiff == 0) // horizontal line
      return Math.abs(point.y - this.b.y) < 0.00001;

    var x = (point.x - this.a.x) / xdiff;
    var y = (point.y - this.a.y) / ydiff;

    return Math.abs(x - y) < 0.00001;
  }

  Line.prototype.tryMerge = function(line) {
    if (!line.a) return null;
    if (this.style != line.style) return null;

    var l1 = [this.a, this.b];
    var l2 = [line.a, line.b];

    if (this.a.isEqual(line.a)) {
      l1 = [this.b, this.a];
    } else if (this.b.isEqual(line.a)) {
      // already set up correctly
    } else if (this.a.isEqual(line.b)) {
      l1 = [this.b, this.a];
      l2 = [line.b, line.a];
    } else if (this.b.isEqual(line.b)) {
      l2 = [line.b, line.a];
    } else {
      return null;
    }

    if (!this.hasPoint(l2[1])) return null;

    return new Line(l1[0], l2[1]);
  }

  return {
    Line: Line
  };

}
