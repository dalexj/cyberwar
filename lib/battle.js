function BattleState(game, battleOptions) {
  this.game = game;
  this.battleOptions = battleOptions;
}

BattleState.prototype.create = function() {
  this.groups = {};
  this.actionButtons = [];
  this.groups.tiles = this.game.add.group();
  this.groups.tiles.z = -1;
  this.setDefaults();
  this.sidebar = this.game.add.graphics(0, 0);
  this.sidebar.beginFill(0xc8c8c8);
  this.sidebar.drawRect(10, 5, offset-20, 488 - 20);
  this.sidebar.endFill();
  var enemyUnit;
  if(window.battle) {
    for (var i = 0; i < window.battle.enemyUnits.length; i++) {
      enemyUnit = createUnit(window.battle.enemyUnits[i].name, null, this);
      enemyUnit.tiles = window.battle.enemyUnits[i].tiles;
      enemyUnit.head = window.battle.enemyUnits[i].head;
      enemyUnit._needsRender = true;
      this.computerTeam.addUnit(enemyUnit);
    }
  }
  this.computerTeam.markForRedraw();
  window.abc = this.computerTeam;
  this.addPlacingButtons();
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
  this.setButtons(Object.keys(saveState.ownedUnits).map(function(unitType) {
    return {
      getText: function() {
        return unitType.capitalize() + ' x'  + amountLeft(state.playerTeam.unitCount(), unitType);
      },
      onclick: function() {
        state.unitToPlace = unitType;
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
    this.actionButtons.push(new SideButton(10, 100 + (35 * index), button.getText, button.onclick));
  }.bind(this));
  if(extraButton) {
    this.setExtraButton(extraButton.getText, extraButton.onclick);
  } else{
    this.setUndoButton();
  }
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
  this.actionButtons.push(new SideButton(10, 400, text, onclick));
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
