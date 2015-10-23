function UnitAI(unit) {
  this.unit = unit;
  this.done = false;
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
  var unitsToAttack = board.tiles.map(function(tile) {
    return this.unit.canAttackTile(tile.loc) && tile.findEnemy();
  }.bind(this)).filter(function(t) { return !!t; });
  if(unitsToAttack.length === 0) {
    this.unit.doNothing();
    console.log('did nothing');
  } else {
    console.log('attacked');
    this.unit.attack(randomElement(unitsToAttack));
  }
  if(team1.turnOver()) {
    var temp = team1;
    team1 = team2;
    team2 = temp;
    team1.restartTurn();
  }
  this.done = true;
};


UnitAI.prototype.tilesCanMoveTo = function() {
  return board.tiles.filter(function (tile) {
    // console.log(tile.loc[0], tile.loc[1], tile.exists, !this.isUnitOn(tile.loc), this.unit.canMoveTo(tile.loc));
    return tile.exists && !this.isUnitOn(tile.loc) && team1.selectedUnit().canMoveTo(tile.loc);
  }.bind(this));
};

UnitAI.prototype.isUnitOn = function(loc) {
  return !!(team1.getUnitOnTile(loc) && team2.getUnitOnTile(loc));
};

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
