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
  var enemy = new Unit({
    maxLength: 9,
    maxMoves: 3,
    tiles: [[3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [9, 5], [9, 6]],
    attacks: [
      { name: 'attack', range: 2, damage: 2 }
    ],
    name: 'unicorn'
  }, [3, 4], this);
  this.teams[1].addUnit(enemy);

  this.addPlacingButtons();
};

BattleState.prototype.setDefaults = function() {
  this.playerTeam = new Team('You', this);
  this.computerTeam = new Team('Computer player', this, true);
  this.teams = [this.playerTeam, this.computerTeam];
  this.placingPhase = true;
  this.board = {
    not: [
      [4, 8], [4, 9], [4, 10], [4, 11], [4, 12], [4, 13], [5, 8],
      [5, 9], [5, 10], [5, 11], [5, 12], [5, 13], [6, 8], [6, 9],
      [6, 10], [6, 11], [6, 12], [6, 13], [7, 8], [7, 9], [7, 10],
      [7, 11], [7, 12], [7, 13], [8, 8], [8, 9], [8, 10], [8, 11],
      [8, 12], [8, 13], [9, 8], [9, 9], [9, 10], [9, 11], [9, 12],
      [9, 13], [10, 8], [10, 9], [10, 10], [10, 11], [10, 12], [10, 13],
      [11, 8], [11, 9], [11, 10], [11, 11], [11, 12], [11, 13], [12, 8],
      [12, 9], [12, 10], [12, 11], [12, 12], [12, 13], [13, 8], [13, 9],
      [13, 10], [13, 11], [13, 12], [13, 13], [14, 8], [14, 9], [14, 10],
      [14, 11], [14, 12], [14, 13]
    ],
    openSpots: [[1,1], [5,1], [1,5]],
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
        state.teams[0].restartTurn();
        state.board.tiles.forEach(function(tile) {
          tile.killClicker();
        });
      }
    }
  });
};

BattleState.prototype.checkEndOfTurn = function() {
  if(this.placingPhase) return;
  if(this.teams[0].isDead()) {
    window.winText = this.teams[1].name;
    phaserGame.state.start('menu');
  }
  if(this.teams[1].isDead()) {
    window.winText = this.teams[0].name;
    phaserGame.state.start('menu');
  }
  if(this.teams[0].turnOver()) {
    this.teams.unshift(this.teams.pop());
    this.teams[0].restartTurn();
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
    team1.selectedUnit().undoMove();
  });
};

BattleState.prototype.setExtraButton = function(text, onclick) {
  this.actionButtons.push(new SideButton(10, 400, text, onclick));
};
