function UnitAI(unit, state) {
  this.unit = unit;
  this.done = false;
  this.state = state;
}

UnitAI.prototype.takeRandomMove = function() {
  var possibilities = this.tilesCanMoveTo();
  var priority = possibilities.filter(function(possibility) {
    return !isInArray(this.unit.tiles, possibility.loc);
  }.bind(this));
  console.log(possibilities, priority);
  if(possibilities.length === 0) {
    this.takeRandomAttack();
  } else if(priority.length > 0) {
    this.unit.moveTo(randomElement(priority).loc);
  } else {
    this.unit.moveTo(randomElement(possibilities).loc);
  }
};


UnitAI.prototype.takeRandomAttack = function() {
  this.unit.useAttack(randomElement(this.unit.attacks).name);
  var unitsToAttack = this.state.board.tiles.map(function(tile) {
    return this.unit.canAttackTile(tile.loc) && tile.findEnemy();
  }.bind(this)).filter(function(t) { return !!t; });
  if(unitsToAttack.length === 0) {
    this.unit.doNothing();
    console.log('did nothing');
  } else {
    console.log('attacked');
    this.unit.attack(randomElement(unitsToAttack));
  }
  this.state.checkEndOfTurn();
  this.done = true;
};


UnitAI.prototype.tilesCanMoveTo = function() {
  return this.state.board.tiles.filter(function (tile) {
    return tile.exists && !this.isUnitOn(tile.loc) && this.state.playingTeam().selectedUnit().canMoveTo(tile.loc);
  }.bind(this));
};

UnitAI.prototype.isUnitOn = function(loc) {
  for (var i = 0; i < this.state.teams.length; i++) {
    if(this.state.teams[i].getUnitOnTile(loc)) {
      return true;
    }
  }
  return false;
};

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
