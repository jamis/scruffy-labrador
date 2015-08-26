require['geometry/style'] = function() {

  Style = function(parent) {
    this.parent = parent;
  }

  Style.prototype.apply = function(ctx) {
    if (this.parent) this.parent.apply(ctx);

    if (this.fillStyle) ctx.fillStyle = this.fillStyle;
    if (this.strokeStyle) ctx.strokeStyle = this.strokeStyle;
    if (this.shadowColor) ctx.shadowColor = this.shadowColor;
    if (this.shadowBlur) ctx.shadowBlur = this.shadowBlur;
    if (this.shadowOffsetX) ctx.shadowOffsetX = this.shadowOffsetX;
    if (this.shadowOffsetY) ctx.shadowOffsetY = this.shadowOffsetY;

    if (this.lineCap) ctx.lineCap = this.lineCap;
    if (this.lineJoin) ctx.lineJoin = this.lineJoin;
    if (this.lineWidth) ctx.lineWidth = this.lineWidth;
    if (this.miterLimit) ctx.miterLimit = this.miterLimit;
  }

  return {
    Style: Style
  };

}
