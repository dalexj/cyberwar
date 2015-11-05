function BattleState(game) {
  this.game = game;
}

BattleState.prototype.create = function() {
  this.groups = {};
  this.actionButtons = [];
  this.groups.tiles = this.game.add.group();
  this.groups.tiles.z = -1;
  this.setDefaults();
  this.sidebar = this.game.add.sprite(10, 5, 'sidebar');
  // 14 char max
  this.infoText = phaserGame.add.text(60, 50, '', {font: 'Ubuntu', fontSize: 16, fill: '#ffffff'});
  this.infoText.anchor.set(0.5);
  this.infoText.align = 'center';
  var enemyUnit;
  if(window.battle) {
    for (var i = 0; i < window.battle.enemyUnits.length; i++) {
      enemyUnit = createUnit(window.battle.enemyUnits[i].name, window.battle.enemyUnits[i].head, this);
      if(window.battle.enemyUnits[i].tiles) {
        enemyUnit.tiles = window.battle.enemyUnits[i].tiles;
      }
      enemyUnit._needsRender = true;
      this.computerTeam.addUnit(enemyUnit);
    }
  }
  this.computerTeam.markForRedraw();
  this.addPlacingButtons();
};

BattleState.prototype.setInfoText = function(text, dontClear) {
  this.infoText.text = text;
  if(!dontClear) {
    clearTimeout(this._infoTextTimeout);
    this._infoTextTimeout = setTimeout(this.setInfoText.bind(this, '', true), 5000);
  }
};

BattleState.prototype.displayUnitInfo = function() {
  if(this.placingPhase) return;
  var unit = this.teams[0].selectedUnit();
  if(this.sideSprite) this.sideSprite.destroy();
  if(this.sideText) this.sideText.destroy();
  this.sideSprite = addSprite([15, 70 + (32 * this.actionButtons.length)], unit.name);
  var info = 'health: ' + unit.health() + '\nmoves: ' + unit.maxMoves + '\nmax_hp: ' + unit.maxLength;
  this.sideText = phaserGame.add.text(15, 100 + (32 * this.actionButtons.length), info, {font: 'Ubuntu', fontSize: 16, fill: '#ffffff', textAlign: 'center'});
};


BattleState.prototype.setDefaults = function() {
  this.playerTeam = new Team('You', this);
  this.computerTeam = new Team('Computer player', this, true);
  this.teams = [this.playerTeam, this.computerTeam];
  this.placingPhase = true;
  this.board = {
    isOpenTile: function(loc) {
      var tile = this.getTile(loc);
      return tile && tile.open;
    },
    getTile: function(loc) {
      for (var i = 0; i < this.tiles.length; i++) {
        if(arrayEqual(this.tiles[i].loc, loc))
          return this.tiles[i];
      }
    }
  };
  if(window.battle) {
    this.board.not = this.readMap(window.battle.map, '.');
    this.board.openSpots = this.readMap(window.battle.map, 'P');
  }
  this.makeBoard();
};

BattleState.prototype.makeBoard = function() {
  this.board.tiles = [];
  var xTiles = Math.floor((650 - space - offset) / (size + space));
  var yTiles = Math.floor((488 - space) / (size + space));
  for (var i = 0; i < xTiles; i++) {
    for (var j = 0; j < yTiles; j++) {
      var exists = !isInArray(this.board.not, [i, j]);
      var open = isInArray(this.board.openSpots, [i, j]);
      var x = space + i*(size + space);
      var y = space + j*(size + space);
      this.board.tiles.push(new Tile({ x: x + offset, y: y, size: size, loc: [i, j], open: open, exists: exists }, this));
    }
  }
};


BattleState.prototype.addPlacingButtons = function() {
  var state = this;
  this.setButtons(Object.keys(gameData.save.ownedUnits).map(function(unitType) {
    return {
      getText: function() {
        return unitType.capitalize() + ' x'  + amountLeft(state.playerTeam.unitCount(), unitType);
      },
      onclick: function() {
        state.unitToPlace = unitType;
        state.setInfoText(unitType + '\nselected');
      }
    };
  }), {
    getText: 'start',
    onclick: function() {
      if(state.playerTeam.units.length > 0) {
        state.placingPhase = false;
        state.playingTeam().restartTurn();
        state.board.tiles.forEach(function(tile) {
          tile.killClicker();
        });
      }
    }
  });
};

BattleState.prototype.checkEndOfTurn = function() {
  if(this.placingPhase) return;
  if(this.playingTeam().isDead()) {
    window.winText = this.teams[1].name;
    phaserGame.state.start('menu');
  }
  if(this.teams[1].isDead()) {
    window.winText = this.playingTeam().name;
    phaserGame.state.start('menu');
  }
  if(this.playingTeam().turnOver()) {
    this.teams.unshift(this.teams.pop());
    this.playingTeam().restartTurn();
  }
};

BattleState.prototype.setButtons = function(buttonData, extraButton) {
  this.actionButtons.forEach(function(button) {
    button.destroy();
  });
  this.actionButtons = [];
  buttonData.forEach(function(button, index) {
    this.actionButtons.push(new SideButton(10, 100 + (32 * index), button.getText, button.onclick));
  }.bind(this));
  if(extraButton) {
    this.setExtraButton(extraButton.getText, extraButton.onclick);
  } else{
    this.setUndoButton();
  }
  this.displayUnitInfo();
};


BattleState.prototype.getAllUnits = function() {
  return this.teams.reduce(function(units,t) { return units.concat(t.units); }, []);
};

BattleState.prototype.render = function() {
  this.getAllUnits().forEach(function(unit) {
    unit.redraw();
  });
};

BattleState.prototype.update = function() {
  this.actionButtons.forEach(function(button) {
    button.update();
  });
  this.board.tiles.forEach(function(tile) {
    tile.update();
  });
};

BattleState.prototype.setUndoButton = function() {
  this.setExtraButton('Undo', function() {
    this.playingTeam().selectedUnit().undoMove();
  }.bind(this));
};

BattleState.prototype.playingTeam = function() {
  return this.teams[0];
};

BattleState.prototype.setExtraButton = function(text, onclick) {
  this.actionButtons.push(new SideButton(10, 448, text, onclick));
};


BattleState.prototype.readMap = function(map, match) {
  var abc = [];
  map.trim().split('\n').forEach(function(line, i) {
    line.split('').forEach(function(letter, j) {
      if(letter === match) abc.push([j,i]);
    });
  });
  return abc;
};
