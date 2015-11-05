function Tile(data, state) {
  this.x = data.x;
  this.y = data.y;
  this.size = data.size;
  this.loc = data.loc;
  this.open = data.open;
  this.exists = data.exists;
  this.state = state;

  if(this.exists) {
    this.sprite = phaserGame.add.button(this.x, this.y, 'tile', this.clickHandler, this);
    this.state.groups.tiles.add(this.sprite);
    if(this.open) {
      this.clicker = addSprite([this.x, this.y], 'tile2');
    }
  }
}

Tile.prototype.clickHandler = function() {
  if(this.state.placingPhase) {
    if(this.open && hasUnitLeft(this.state.playerTeam.unitCount(), this.state.unitToPlace)) {
      this.state.playerTeam.deleteUnitOnTile(this.loc);
      this.state.playerTeam.placeUnit(this.state.unitToPlace, this.loc);
    }
  } else if(this.team(1).selectedUnit().canAttackTile(this.loc)) {
    if(this.findEnemy()) {
      this.team(1).selectedUnit().attack(this.findEnemy());
    } else if(this.findAlly() && this.findAlly() !== this.team(1).selectedUnit()) {
      console.log('supporting ally');
      this.team(1).selectedUnit().support(this.findAlly());
    } else {
      this.team(1).selectedUnit().doNothing();
    }
    this.team(1).deselectUnit();
    this.team(2).trimDeadUnits();
  } else if(this.findAllyHead()) {
    this.team(1)._selectedUnit = this.findAllyHead();
    this.team(1).markForRedraw();
  } else if(this.exists && !this.findEnemy() && !this.findAllyNotSelected() && this.team(1).selectedUnit().canMoveTo(this.loc)) {
    this.team(1).selectedUnit().moveTo(this.loc);
  }
  this.state.checkEndOfTurn();
  this.state.displayUnitInfo();
};

Tile.prototype.findEnemy = function() {
  return this.team(2).getUnitOnTile(this.loc);
};

Tile.prototype.findAlly = function() {
  return this.team(1).getUnitOnTile(this.loc);
};

Tile.prototype.findAllyHead = function() {
  return this.team(1).getUnitHeadOnTile(this.loc);
};

Tile.prototype.findAllyNotSelected = function() {
  var unit = this.findAlly();
  if(this.team(1).selectedUnit() === unit) {
    return null;
  }
  return unit;
};

Tile.prototype.killClicker = function() {
  if(this.clicker) {
    this.clicker.destroy();
    delete this.clicker;
  }
};

Tile.prototype.update = function() {
  if(this.exists) {
    this.sprite.input.enabled = this.shouldBeClickable();
  }
};

Tile.prototype.shouldBeClickable = function() {
  if(!this.exists) return false;
  return  (this.team(1).selectedUnit() && this.team(1).selectedUnit().canAttackTile(this.loc)) ||
          (!this.findEnemy() && this.team(1).selectedUnit() && this.team(1).selectedUnit().canMoveTo(this.loc)) ||
          (this.open && this.state.placingPhase) ||
          (this.findAllyHead());
};

Tile.prototype.team = function(n) {
  return this.state.teams[n-1];
};

Tile.dist = function(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};
