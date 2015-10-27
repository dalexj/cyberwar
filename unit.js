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
  enemy.removeTiles(this.currentAttack().damage);
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
  return this.attackMode && tileDist(this.head, loc) <= this.currentAttack().range && !this.isOnTile(loc);
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
  return this.attacks.map(function(attack) {
    return {
      onclick: this.useAttack.bind(this, attack.name),
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

Unit.prototype.useAttack = function(attackName) {
  this.attackMode = true;
  this._currentAttack = this.findAttackByName(attackName);
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
  return !this.state.placingPhase && arrayEqual(this.state.teams[0].selectedUnit() && this.state.teams[0].selectedUnit().head, this.head);
};

Unit.prototype.findAttackByName = function(attackName) {
  for (var i = 0; i < this.attacks.length; i++) {
    if(this.attacks[i].name === attackName) {
      return this.attacks[i];
    }
  }
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
  return {
    hack: {
      maxMoves: 2,
      maxLength: 4,
      attacks: [{ name: 'slice', damage: 2, range: 1}],
      name: 'hack'
    },
    bug: {
      maxMoves: 5,
      maxLength: 1,
      attacks: [{ name: 'glitch', damage: 2, range: 1 }],
      name: 'bug'
    },
    unicorn: {
      maxMoves: 3,
      maxLength: 9,
      attacks: [{ name: 'horn_drill', damage: 2, range: 2 }],
      name: 'unicorn'
    }
  }[name];
}
