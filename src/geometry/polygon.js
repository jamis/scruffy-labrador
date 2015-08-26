require['geometry/polygon'] = function() {

  Polygon = function(points, style) {
    this.points = points;
    this.style = style;
  }

  Polygon.prototype.render = function(ctx) {
    this.style.apply(ctx);

    ctx.beginPath();

    for(var i = 0; i < this.points.length; i++) {
      if (i == 0) {
        ctx.moveTo(this.points[i].x, this.points[i].y);
      } else {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }
    }

    ctx.closePath();

    ctx.fill();
    ctx.stroke();
  }

  Polygon.prototype.tryMerge = function(poly) {
    if (!poly.points) return null;
    if (this.style != poly.style) return null;

    // FIXME
    return null;
  }

  return {
    Polygon: Polygon
  };

}
