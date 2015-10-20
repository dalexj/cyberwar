
function Team(units, name) {
  this.units = units;
  this.name = name;
}

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
};

Team.prototype.selectedUnit = function() {
  return this._selectedUnit || this.nextUnit();
};

Team.prototype.turnOver = function() {
  return !this.nextUnit();
};

Team.prototype.getUnitOnSquare = function(loc) {
  for (var i = 0; i < this.units.length; i++) {
    if(this.units[i].isOnSquare(loc)) return this.units[i];
  }
};

Team.prototype.getUnitHeadOnSquare = function(loc) {
  for (var i = 0; i < this.units.length; i++) {
    if(arrayEqual(this.units[i].head, loc)) return this.units[i];
  }
};

Team.prototype.isDead = function() {
  this.trimDeadUnits();
  return this.units.length <= 0;
};

Team.prototype.deleteUnitOnSquare = function(loc) {
  this.units = this.units.filter(function(unit) {
    if(arrayEqual(unit.head, loc)) {
      unit.customUnit.destroyAll();
    } else return true;
  });
};

Team.prototype.trimDeadUnits = function() {
  this.units = this.units.filter(function(unit) {
    return unit.health() > 0;
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
    hack: createHack
  }[unitName];
  if(!createUnit) return;
  this.units.push(createUnit(loc));
};
