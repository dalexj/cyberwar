function Unit(options, loc, state) {
  this.state = state;
  this.maxMoves = options.maxMoves;
  this.maxLength = options.maxLength;
  this.movesMade = 0;
  this.head = loc;
  this.tiles = options.tiles || [loc];
  this.attackMode = false;
  this.attacks = options.attacks || [];
  this.moveOver = false;
  this.name = options.name;

  this._needsRender = true;
  this.renderer = new UnitRenderer(this, this.state);
}

Unit.prototype.movesRemaining = function() {
  return this.maxMoves - this.movesMade;
};

Unit.prototype.currentAttack = function() {
  return this._currentAttack || this.attacks[0];
};

Unit.prototype.attack = function(enemy) {

  this.attackMode = false;
  this.moveOver = true;
  this._canUndo = false;
  if(this.currentAttack().type === 'attack') {
    enemy.removeTiles(this.currentAttack().damage);
  } else {
    this.doNothing();
  }
};

Unit.prototype.support = function(ally) {
  this.attackMode = false;
  this.moveOver = true;
  this._canUndo = false;
  this._needsRender = true;
  var type = this.currentAttack().type;
  if(type === 'speed') {
    ally.maxMoves += this.currentAttack().damage;
  } else if(type === 'grow') {
    ally.maxLength += this.currentAttack().damage;
  } else {
    this.doNothing();
  }
};

Unit.prototype.modifyTile = function(tile) {
  this.attackMode = false;
  this.moveOver = true;
  this._canUndo = false;
  this._needsRender = true;
  var type = this.currentAttack().type;
  if(type === 'add_tile') {
    tile.exists = true;
    tile._needsRender = true;
  } else if(type === 'remove_tile') {
    tile.exists = false;
    tile._needsRender = true;
  } else {
    this.doNothing();
  }
};

Unit.prototype.health = function() {
  return this.tiles.length;
};

Unit.prototype.removeTiles = function(amount) {
  if(amount <= 0) return;
  this.tiles = this.tiles.slice(0, -amount);
  this._needsRender = true;
};

Unit.prototype.restartTurn = function() {
  this._needsRender = true;
  this.movesMade = 0;
  this.attackMode = false;
  this.moveOver = false;
  this._currentAttack = null;
  this._prevState = {
    head: dupArr(this.head),
    tiles: dupArr(this.tiles)
  };
  this._canUndo = true;
};

Unit.prototype.undoMove = function() {
  this.head = dupArr(this._prevState.head);
  this.tiles = dupArr(this._prevState.tiles);
  this.movesMade = 0;
  this.attackMode = false;
  this._needsRender = true;
};

Unit.prototype.canAttack = function(enemy, loc) {
  return this.canAttackTile(loc) && enemy.isOnTile(loc);
};

Unit.prototype.canAttackTile = function(loc) {
  return this.attackMode && Tile.dist(this.head, loc) <= this.currentAttack().range && !this.isOnTile(loc);
};

Unit.prototype.canMoveTo = function(loc) {
  return !this.attackMode && this.movesRemaining() > 0 && tileNextTo(loc, this.head);
};

Unit.prototype.moveTo = function(loc) {
  if(!this.canMoveTo(loc)) return;
  this.movesMade++;
  this.head = loc;
  // if crossing over self, replace the tile that already exists
  // so that unit tiles stay in order
  for (var i = 0; i < this.tiles.length; i++) {
    if (arrayEqual(this.tiles[i], loc)) {
      this.tiles.splice(i, 1);
      break;
    }
  }
  this.tiles.unshift(loc);
  if(this.movesRemaining() <= 0) {
    this.attackMode = true;
  }
  this.removeTiles(this.tiles.length - this.maxLength);
  this._needsRender = true;
};

Unit.prototype.isOnTile = function(loc) {
  return isInArray(this.tiles, loc);
};

Unit.prototype.makeButtonsForAttacks = function() {
  return this.attacks.map(function(attack, index) {
    return {
      onclick: this.useAttack.bind(this, index),
      getText: function() { return attack.name; }
    };
  }.bind(this)).concat(this.noAttackButton());
};

Unit.prototype.noAttackButton = function() {
  return {
    onclick: this.doNothing.bind(this),
    getText: function() { return 'no action'; }
  };
};

Unit.prototype.useAttack = function(index) {
  this.attackMode = true;
  this._currentAttack = this.findAttackByIndex(index);
  this._needsRender = true;
};

Unit.prototype.doNothing = function() {
  this.moveOver = true;
  this._needsRender = true;
  this.team.deselectUnit();
  this.state.checkEndOfTurn();
};

Unit.prototype.redraw = function() {
  this.renderer.redraw();
};

Unit.prototype.destroy = function() {
  this.renderer.erase();
};

Unit.prototype.isSelected = function() {
  return !this.state.placingPhase && arrayEqual(this.state.playingTeam().selectedUnit() && this.state.playingTeam().selectedUnit().head, this.head);
};

Unit.prototype.findAttackByIndex = function(index) {
  return this.attacks[index];
};

function dupArr(obj) {
  if(obj instanceof Array) {
    return obj.map(function(ele) {
      return dupArr(ele);
    });
  } else {
    return obj;
  }
}

function createUnit(name, loc, state) {
  var data = unitDataFor(name);
  if(!data) return null;
  return new Unit(data, loc, state);
}

function unitDataFor(name) {
  return gameData.unitTypes[name];
}
