
function Team(name, ai) {
  this.isAI = ai;
  this.units = [];
  this.name = name;
}

Team.prototype.addUnit = function(unit) {
  this.units.push(unit);
  unit.team = this;
};

Team.prototype.nextUnit = function() {
  for (var i = 0; i < this.units.length; i++) {
    if(!this.units[i].moveOver) return this.units[i];
  }
};

Team.prototype.restartTurn = function() {
  this._selectedUnit = null;
  for (var i = 0; i < this.units.length; i++) {
    this.units[i].restartTurn();
  }
  if(this.isAI) {
    this.startAI();
  }
};

Team.prototype.selectedUnit = function() {
  return this._selectedUnit || this.nextUnit();
};

Team.prototype.turnOver = function() {
  return !this.nextUnit();
};

Team.prototype.getUnitOnTile = function(loc) {
  for (var i = 0; i < this.units.length; i++) {
    if(this.units[i].isOnTile(loc)) return this.units[i];
  }
};

Team.prototype.getUnitHeadOnTile = function(loc) {
  for (var i = 0; i < this.units.length; i++) {
    if(arrayEqual(this.units[i].head, loc)) return this.units[i];
  }
};

Team.prototype.isDead = function() {
  this.trimDeadUnits();
  return this.units.length <= 0;
};

Team.prototype.deleteUnitOnTile = function(loc) {
  this.units = this.units.filter(function(unit) {
    if(arrayEqual(unit.head, loc)) {
      unit.destroy();
    } else return true;
  });
};

Team.prototype.trimDeadUnits = function() {
  this.units = this.units.filter(function(unit) {
    if(unit.health() <= 0) {
      unit.destroy();
    } else return true;
  });
};

Team.prototype.unitCount = function() {
  var count = {};
  for (var i = 0; i < this.units.length; i++) {
    var name = this.units[i].name;
    if(!count[name]) count[name] = 0;
    count[name]++;
  }
  return count;
};

Team.prototype.placeUnit = function(unitName, loc) {
  var createUnit = {
    bug: createBug,
    hack: createHack,
    unicorn: createUnicorn
  }[unitName];
  if(!createUnit) return;
  this.addUnit(createUnit(loc));
};

Team.prototype.markForRedraw = function() {
  this.units.forEach(function(unit) {
    unit._needsRender = true;
  });
};

Team.prototype.startAI = function() {
  board.tiles.forEach(function(tile) {
    if(tile.exists) tile.sprite.input.enabled = false;
  });
  this.n = 0;
  this.interval = setInterval(this.runAIStep.bind(this), 1000);
};

Team.prototype.runAIStep = function() {
  var unitAI = new UnitAI(this.selectedUnit());
  unitAI.takeRandomMove();
  if(unitAI.done) {
    clearInterval(this.interval);
    board.tiles.forEach(function(tile) {
      if(tile.exists) tile.sprite.input.enabled = true;
    });
  }
};

Team.prototype.deselectUnit = function() {
  this._selectedUnit = null;
  this.markForRedraw();
};
