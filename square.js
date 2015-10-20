function Square(data) {
  this.x = data.x;
  this.y = data.y;
  this.size = data.size;
  this.loc = data.loc;
  this.open = data.open;
  this.exists = data.exists;

  if(this.exists) {
    this.sprite = phaserGame.add.button(this.x, this.y, 'square', this.clickHandler, this);
    groups.squares.add(this.sprite);
    if(this.open) {
      this.clicker = addSprite([this.x, this.y], 'square2');
    }
  }
}

Square.prototype.clickHandler = function() {
  if(placingPhase) {
    if(this.open && hasUnitLeft(playerTeam.unitCount(), unitToPlace)) {
      playerTeam.deleteUnitOnSquare(this.loc);
      playerTeam.placeUnit(unitToPlace, this.loc);
    }
  } else if(this.findAlly()) {
    team1._selectedUnit = this.findAlly();
  } else if(team1.selectedUnit().canAttackSquare(this.loc)) {
    if(this.findEnemy()) {
      team1.selectedUnit().attack(this.findEnemy());
    } else {
      team1.selectedUnit().doNothing();
    }
    team1._selectedUnit = null;
    team2.trimDeadUnits();
  } else if(this.exists && !this.findEnemy() && team1.selectedUnit().canMoveTo(this.loc)) {
    team1.selectedUnit().moveTo(this.loc);
  }
};

Square.prototype.findEnemy = function() {
  this._findEnemy = this._findEnemy || team2.getUnitOnSquare(this.loc);
  return this._findEnemy;
};

Square.prototype.findAlly = function() {
  this._findAlly = this._findAlly || team1.getUnitHeadOnSquare(this.loc);
  return this._findAlly;
};
