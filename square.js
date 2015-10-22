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
    team1.markForRedraw();
  } else if(team1.selectedUnit().canAttackSquare(this.loc)) {
    if(this.findEnemy()) {
      team1.selectedUnit().attack(this.findEnemy());
    } else {
      team1.selectedUnit().doNothing();
    }
    team1.markForRedraw();
    team1._selectedUnit = null;
    team2.trimDeadUnits();
  } else if(this.exists && !this.findEnemy() && team1.selectedUnit().canMoveTo(this.loc)) {
    team1.selectedUnit().moveTo(this.loc);
  }
  if(team1.isDead()) console.log(team2.name, ' wins');
  if(team2.isDead()) console.log(team1.name, ' wins');
  if(team1.turnOver()) {
    var temp = team1;
    team1 = team2;
    team2 = temp;
    team1.restartTurn();
  }
};

Square.prototype.findEnemy = function() {
  return team2.getUnitOnSquare(this.loc);
};

Square.prototype.findAlly = function() {
  return team1.getUnitHeadOnSquare(this.loc);
};

Square.prototype.killClicker = function() {
  if(this.clicker) {
    this.clicker.destroy();
    delete this.clicker;
  }
};
