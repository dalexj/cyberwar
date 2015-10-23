function Tile(data) {
  this.x = data.x;
  this.y = data.y;
  this.size = data.size;
  this.loc = data.loc;
  this.open = data.open;
  this.exists = data.exists;

  if(this.exists) {
    this.sprite = phaserGame.add.button(this.x, this.y, 'tile', this.clickHandler, this);
    groups.tiles.add(this.sprite);
    if(this.open) {
      this.clicker = addSprite([this.x, this.y], 'tile2');
    }
  }
}

Tile.prototype.clickHandler = function() {
  if(placingPhase) {
    if(this.open && hasUnitLeft(playerTeam.unitCount(), unitToPlace)) {
      playerTeam.deleteUnitOnTile(this.loc);
      playerTeam.placeUnit(unitToPlace, this.loc);
    }
  } else if(this.findAlly()) {
    team1._selectedUnit = this.findAlly();
    team1.markForRedraw();
  } else if(team1.selectedUnit().canAttackTile(this.loc)) {
    if(this.findEnemy()) {
      team1.selectedUnit().attack(this.findEnemy());
    } else {
      team1.selectedUnit().doNothing();
    }
    team1.deselectUnit();
    team2.trimDeadUnits();
  } else if(this.exists && !this.findEnemy() && team1.selectedUnit().canMoveTo(this.loc)) {
    team1.selectedUnit().moveTo(this.loc);
  }
  checkEndOfTurn();
};

Tile.prototype.findEnemy = function() {
  return team2.getUnitOnTile(this.loc);
};

Tile.prototype.findAlly = function() {
  return team1.getUnitHeadOnTile(this.loc);
};

Tile.prototype.killClicker = function() {
  if(this.clicker) {
    this.clicker.destroy();
    delete this.clicker;
  }
};

Tile.prototype.update = function() {
  if(this.exists) {
    // this.sprite.input.enabled = this.shouldBeClickable();
  }
};

Tile.prototype.shouldBeClickable = function() {
  if(!this.exists) return false;
  return  (team1.selectedUnit() && team1.selectedUnit().canAttackTile(this.loc)) ||
          (!this.findEnemy() && team1.selectedUnit() && team1.selectedUnit().canMoveTo(this.loc)) ||
          (this.open && placingPhase) ||
          (this.findAlly());
};
