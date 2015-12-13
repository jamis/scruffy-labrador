require['cell'] = function() {

  var _ = require('utility');

  var Cell = function(location) {
    this.location = location;
    this.neighbor = {}
    this._links = {}
    this.data = {}
  }

  Cell.prototype.linkOne = function(cell) {
    this._links[cell.location.key] = cell;
  }

  Cell.prototype.unlinkOne = function(cell) {
    delete this._links[cell.location.key];
  }

  Cell.prototype.link = function(cell) {
    this.linkOne(cell);
    cell.linkOne(this);
  }

  Cell.prototype.isDeadEnd = function() {
    return this.links().length == 1;
  }

  Cell.prototype.links = function() {
    var list = [];
    for (var key in this._links)
      list.push(this._links[key]);
    return list;
  }

  Cell.prototype.unlink = function(cell) {
    this.unlinkOne(cell);
    cell.unlinkOne(this);
  }

  Cell.prototype.isLinked = function(cell) {
    if (!cell) return false;
    return !! this._links[cell.location.key];
  }

  Cell.prototype.isOpen = function() {
    return this.links().length > 0;
  }

  Cell.prototype.neighbors = function() {
    var list = [];
    for (var direction in this.neighbor)
      list = list.concat(this.neighbor[direction]);
    return list;
  }

  Cell.prototype.neighborDirections = function() {
    if (Object.keys)
      return Object.keys(this.neighbor);
    else {
      var list = [];
      for (var direction in this.neighbor)
        list.push(direction);
      return list;
    }
  }

  function Block(location) {
    Cell.call(this, location);
    this.isCarved = false;
  }
  Block.prototype = new Cell();
  Block.prototype.constructor = Block;

  Block.prototype.link = function(block) {
    if (this.neighbors().indexOf(block) < 0) return;
    this.isCarved = true;
    block.isCarved = true;
  }

  Block.prototype.unlink = function(block) {
    if (this.neighbors().indexOf(block) < 0) return;
    block.isCarved = false;
  }

  Block.prototype.links = function() {
    return _.select(this.neighbors(), function(n) { return n.isCarved; });
  }

  Block.prototype.isLinked = function(block) {
    return block &&
      block.isCarved &&
      this.isCarved &&
      (this.neighbors().indexOf(block) >= 0);
  }

  Block.prototype.isOpen = function() {
    return this.isCarved;
  }

  return {
    Cell: Cell,
    Block: Block
  };
}
