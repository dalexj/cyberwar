function UnitAI(unit, state) {
  this.unit = unit;
  this.done = false;
  this.state = state;
}

UnitAI.prototype.takeNextMove = function(){
  if(this.unit.attackMode) {
    this.takeWeightedAttack();
  } else {
    this.takeWeightedMove();
  }
};

UnitAI.prototype.takeWeightedMove = function() {
  var priority = this.sortPossibilities(this.tilesCanMoveTo());
  console.log(priority.map(function(p) { return p.tile.loc.concat(p.weight).join(', '); }));
  if(priority.length > 0) {
    if(priority[0].weight >= 500) {
      this.unit.useAttack(0);
      return;
    }
    priority = priority.filter(function(poss) {
      return poss.weight === priority[0].weight;
    });
    console.log(priority.map(function(p) { return p.tile.loc.concat(p.weight).join(', '); }));
    this.unit.moveTo(randomElement(priority).tile.loc);
  } else {
    this.unit.useAttack(0);
  }
};

UnitAI.prototype.unitsCanAttack = function() {
  return this.state.board.tiles.map(function(tile) {
    return this.unit.canAttackTile(tile.loc) && tile.findEnemy();
  }, this).filter(function(t) { return !!t; });
};

UnitAI.prototype.takeWeightedAttack = function() {
  this.unit.useAttack(0);
  var unitsToAttack = this.unitsCanAttack();
  if(unitsToAttack.length === 0) {
    this.unit.doNothing();
    console.log('did nothing');
  } else {
    console.log('attacked');
    this.attackPriority(unitsToAttack);
  }
  this.state.checkEndOfTurn();
  this.done = true;
};

UnitAI.prototype.attackPriority = function(units) {
  var minHealthUnit = units[0];
  for (var i = 0; i < units.length; i++) {
    var unit = units[i];
    if(minHealthUnit.health() > unit.health()) {
      minHealthUnit = unit;
    }
  }
  this.unit.attack(minHealthUnit);
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

UnitAI.prototype.sortPossibilities = function(possibilities) {
  return possibilities.map(function(tile) {
    return { weight: this.weightTile(tile), tile: tile };
  }.bind(this)).sort(function(a, b) {
    return a.weight > b.weight;
  });
};


UnitAI.prototype.weightTile = function(tile) {
  var weight = 0;
  var unitDist = this.minDistFromEnemy(tile.loc);
  var unitDistFromNow = this.minDistFromEnemy(this.unit.head);
  weight += unitDist;
  var range = this.unit.currentAttack().range;
  var isCurrentlyInRangeToAttack = unitDistFromNow <= range;
  var wouldBeInRangeToAttackIfMoved = unitDist <= range;
  console.log('isCurrentlyInRangeToAttack:', isCurrentlyInRangeToAttack, ', wouldBeInRangeToAttackIfMoved:', wouldBeInRangeToAttackIfMoved);
  if(this.unit.movesRemaining() === 1) {
    if(isCurrentlyInRangeToAttack && !wouldBeInRangeToAttackIfMoved) {
      weight += 500;
    } else if(!wouldBeInRangeToAttackIfMoved) {
      weight += 20;
    }
  }
  if(this.unit.health() < this.unit.maxLength && this.willGrow(tile)) {
     weight += 10;
  }
  return weight;
};

UnitAI.prototype.minDistFromEnemy = function(loc) {
  return Math.min.apply(null, this.state.teams[1].units.map(function(unit) {
    return Math.min.apply(null, unit.tiles.map(function(t) {
      return Tile.dist(loc, t);
    }));
  }));
};

UnitAI.prototype.willGrow = function(tile) {
  return !isInArray(this.unit.tiles, tile.loc);
};
