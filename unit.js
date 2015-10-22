function Unit(options, loc) {
  this.maxMoves = options.maxMoves;
  this.maxLength = options.maxLength;
  this.movesMade = 0;
  this.head = loc;
  this.squares = options.squares || [loc];
  this.attackMode = false;
  this.attacks = options.attacks || [];
  this.moveOver = false;
  this.name = options.name;

  this._needsRender = true;
  this.renderer = new UnitRenderer(this);
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
  enemy.removeSquares(this.currentAttack().damage);
};

Unit.prototype.health = function() {
  return this.squares.length;
};

Unit.prototype.removeSquares = function(amount) {
  if(amount <= 0) return;
  this.squares = this.squares.slice(0, -amount);
  this._needsRender = true;
};

Unit.prototype.restartTurn = function() {
  this._needsRender = true;
  this.movesMade = 0;
  this.attackMode = false;
  this.moveOver = false;
  this._currentAttack = null;
};

Unit.prototype.canAttack = function(enemy, loc) {
  return this.canAttackSquare(loc) && enemy.isOnSquare(loc);
};

Unit.prototype.canAttackSquare = function(loc) {
  return this.attackMode && squareDist(this.head, loc) <= this.currentAttack().range && !this.isOnSquare(loc);
};

Unit.prototype.canMoveTo = function(loc) {
  return !this.attackMode && this.movesRemaining() > 0 && squareNextTo(loc, this.head);
};

Unit.prototype.moveTo = function(loc) {
  if(!this.canMoveTo(loc)) return;
  this.movesMade++;
  this.head = loc;
  // if crossing over self, replace the square that already exists
  // so that unit squares stay in order
  for (var i = 0; i < this.squares.length; i++) {
    if (arrayEqual(this.squares[i], loc)) {
      this.squares.splice(i, 1);
      break;
    }
  }
  this.squares.unshift(loc);
  if(this.movesRemaining() <= 0) {
    this.attackMode = true;
  }
  this.removeSquares(this.squares.length - this.maxLength);
  this._needsRender = true;
};

Unit.prototype.isOnSquare = function(loc) {
  return isInArray(this.squares, loc);
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
    onclick: this.doNothing,
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
};

function createHack(loc) {
  return new Unit({
    maxMoves: 2,
    maxLength: 4,
    attacks: [{ name: 'slice', damage: 2, range: 1}],
    name: 'hack'
  }, loc);
}

function createBug(loc) {
  return new Unit({
    maxMoves: 5,
    maxLength: 1,
    attacks: [{ name: 'glitch', damage: 2, range: 1 }],
    name: 'bug'
  }, loc);
}

Unit.prototype.redraw = function() {
  this.renderer.redraw();
};

Unit.prototype.destroy = function() {
  this.renderer.erase();
};

Unit.prototype.isSelected = function() {
  return !placingPhase && arrayEqual(team1.selectedUnit() && team1.selectedUnit().head, this.head);
};

Unit.prototype.findAttackByName = function(attackName) {
  for (var i = 0; i < this.attacks.length; i++) {
    if(this.attacks[i].name === attackName) {
      return this.attacks[i];
    }
  }
};
