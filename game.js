
var phaserGame = new Phaser.Game(650, 488, Phaser.CANVAS, 'phaser-canvas', { preload: preload, create: create, update: update, render: render });

function convertSquareToPixels(coords) {
  return [space + offset + coords[0]*(size + space), space + coords[1]*(size + space)];
}

function MovementOption(x, y, canPress) {
  var pixels = convertSquareToPixels([x, y]);
  this.sprite = phaserGame.add.sprite(pixels[0], pixels[1], 'movement-option');
}

function CustomButton(x, y, getText, onclick) {
  this.getText = getText;
  onclick = onclick || function() { console.log('nothing implemented for button ' + this.getText()); };
  this.sprite = phaserGame.add.button(x, y, 'button', onclick, this);
  this.text = phaserGame.add.text(0, 0, this.getText(), {font: 'monospace', fontSize: 16, fill: '#ffffff'});
  this.text.anchor.set(0.5);
  this.update();
}

CustomButton.prototype.update = function() {
  this.setText(this.getText());
  this.text.x = Math.floor(this.sprite.x + this.sprite.width / 2);
  this.text.y = Math.floor(this.sprite.y + this.sprite.height / 2);
};

CustomButton.prototype.setText = function(newText) {
  this.text.text = newText;
};

CustomButton.prototype.setImage = function(image) {
  this.sprite.loadTexture(image);
};

function CustomUnit(unit) {
  console.log(unit);
  this.unit = unit;
  var pixels = convertSquareToPixels(this.unit.head);
  phaserGame.add.sprite(pixels[0], pixels[1], this.unit.name);
  // for (var i = 0; i < unit.squares.length; i++) {
  //   square = unit.squares[i];
  //   if(arrayEqual(square, this.unit.head)) return;
  // }
  for (var i = 0; i < board.squares.length; i++) {
    if(arrayEqual(board.squares[i].loc, this.unit.head)) {
    } else if (isInArray(this.unit.squares, board.squares[i].loc)){
      phaserGame.add.sprite(board.squares[i].x, board.squares[i].y, this.unit.name + '-background');
    }
  }

}

function preload() {
  phaserGame.stage.backgroundColor = '#ffffff';
  phaserGame.load.image('button', 'assets/sprites/button.png');
  phaserGame.load.image('button2', 'assets/sprites/button2.png');
  phaserGame.load.image('square', 'assets/sprites/square.png');
  phaserGame.load.image('square2', 'assets/sprites/square2.png');
  phaserGame.load.image('unicorn', 'assets/sprites/unicorn.png');
  phaserGame.load.image('unicorn-background', 'assets/sprites/unicorn-background.png');
  phaserGame.load.image('hack', 'assets/sprites/hack.png');
  phaserGame.load.image('hack-background', 'assets/sprites/hack-background.png');
  phaserGame.load.image('bug', 'assets/sprites/bug.png');
  phaserGame.load.image('bug-background', 'assets/sprites/bug-background.png');
  phaserGame.load.image('movement-option', 'assets/sprites/movement-option.png');
}

var graphics;
var theButtons;
function create() {
  graphics = phaserGame.add.graphics(0, 0);
  graphics.beginFill(0xc8c8c8);
  graphics.drawRect(10, 5, offset-20, 488 - 20);
  graphics.endFill();
  board.squares.forEach(function(square) {
    if(!square.exists) return;
    square.sprite = phaserGame.add.sprite(square.x, square.y, 'square');
    if(square.open) {
      square.clicker = phaserGame.add.button(square.x, square.y, 'square2', function() {
        if(hasUnitLeft(playerTeam.unitCount(), unitToPlace)) {
          playerTeam.deleteUnitOnSqaure(square.loc);
          playerTeam.placeUnit(unitToPlace, square.loc);
        }
      }, this);
    }
  });


  theButtons = [
    new CustomButton(10, 100 + (35 * 0), function() { return 'Hack x' + amountLeft(playerTeam.unitCount(), 'hack'); }, function() { unitToPlace = 'hack'; }),
    new CustomButton(10, 100 + (35 * 1), function() { return 'Bug x'  + amountLeft(playerTeam.unitCount(), 'bug');  }, function() { unitToPlace = 'bug'; }),
    new CustomButton(10, 400, function(){ return 'start'; }, function() {
      if(playerTeam.units.length > 0) placingPhase = false;
    })
  ];
}

function update() {
  theButtons.forEach(function(button) {
    button.update();
  });
}

function render() {
}

// Unit class

function Unit(options, loc, name) {
  this.maxMoves = options.maxMoves;
  this.maxLength = options.maxLength;
  this.movesMade = 0;
  this.head = loc;
  this.squares = options.squares || [loc];
  this.attackMode = false;
  this.attacks = options.attacks || [];
  this.moveOver = false;
  this.image = options.image;
  this.color = options.color;
  this.name = options.name;
  var u = this;
  setTimeout(function() { new CustomUnit(u); }, 200);
}

Unit.prototype.movesRemaining = function() {
  return this.maxMoves - this.movesMade;
};

Unit.prototype.currentAttack = function() {
  return this._currentAttack || this.attacks[0];
};

Unit.prototype.attack = function(enemy) {
  this.attackMode = false;
  this.moveOver = true;
  enemy.removeSquares(this.currentAttack().damage);
};

Unit.prototype.health = function() {
  return this.squares.length;
};

Unit.prototype.removeSquares = function(amount) {
  if(amount <= 0) return;
  this.squares = this.squares.slice(0, -amount);
};

Unit.prototype.restartTurn = function() {
  this.movesMade = 0;
  this.attackMode = false;
  this.moveOver = false;
  this._currentAttack = null;
};

Unit.prototype.canAttack = function(enemy, loc) {
  return this.canAttackSquare(loc) && enemy.isOnSquare(loc);
};

Unit.prototype.canAttackSquare = function(loc) {
  return this.attackMode && squareDist(this.head, loc) <= this.currentAttack().range && !this.isOnSquare(loc);
};

Unit.prototype.canMoveTo = function(loc) {
  return !this.attackMode && this.movesRemaining() > 0 && squareNextTo(loc, this.head);
};

Unit.prototype.moveTo = function(loc) {
  if(!this.canMoveTo(loc)) return;
  this.movesMade++;
  this.head = loc;
  // if crossing over self, replace the square that already exists
  // so that unit squares stay in order
  for (var i = 0; i < this.squares.length; i++) {
    if (arrayEqual(this.squares[i], loc)) {
      this.squares.splice(i, 1);
      break;
    }
  }
  this.squares.unshift(loc);
  if(this.movesRemaining() <= 0) {
    this.attackMode = true;
  }
  this.removeSquares(this.squares.length - this.maxLength);
};

Unit.prototype.isOnSquare = function(loc) {
  return isInArray(this.squares, loc);
};

Unit.prototype.makeButtonsForAttacks = function() {
  unit = this;
  return this.attacks.map(function(attack) {
    return {
      press: function() {
        unit.attackMode = true;
        unit._currentAttack = attack;
      },
      text: attack.name,
      getText: function() { return this.text; }
    };
  }).concat(this.noAttackButton());
};

Unit.prototype.noAttackButton = function() {
  return {
    press: this.doNothing,
    text: 'no action',
    getText: function() { return this.text; }
  };
};

Unit.prototype.doNothing = function() {
  unit.moveOver = true;
};

function createHack(loc) {
  return new Unit({
    maxMoves: 2,
    maxLength: 4,
    attacks: [{ name: 'slice', damage: 2, range: 1}],
    image: 'H',
    color: 'rgb(43,169,211)',
    name: 'hack'
  }, loc);
}

function createBug(loc) {
  return new Unit({
    maxMoves: 5,
    maxLength: 1,
    attacks: [{ name: 'glitch', damage: 2, range: 1 }],
    image: 'B',
    color: 'rgb(155,216,83)',
    name: 'bug'
  }, loc);
}

// end Unit class
// Team class

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

Team.prototype.deleteUnitOnSqaure = function(loc) {
  this.units = this.units.filter(function(unit) {
    return !arrayEqual(unit.head, loc);
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

// end Team class

var saveState = {
  ownedUnits: {
    bug: 2,
    hack: 1
  }
};

function hasUnitLeft(placed, unit) {
  return amountLeft(placed, unit) > 0;
}

function amountLeft(placed, unit) {
  return saveState.ownedUnits[unit] - (placed[unit] || 0);
}

var playerTeam = new Team([], 'player1');
var unitToPlace = 'none';
var buttons = [
  {text: 'hack', getText: function() { return this.text + ' x' + amountLeft(playerTeam.unitCount(), this.text); }, press: function() { unitToPlace = 'hack'; } },
  {text: 'bug',  getText: function() { return this.text + ' x' + amountLeft(playerTeam.unitCount(), this.text); }, press: function() { unitToPlace = 'bug'; } }
];

var team1 = playerTeam;
var placingPhase = true;

var board = { squares: [], not: [
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
  isOpenSquare: function(loc) {
    var square = this.getSquare(loc);
    return square && square.open;
  },
  getSquare: function(loc) {
    for (var i = 0; i < this.squares.length; i++) {
      if(arrayEqual(this.squares[i].loc, loc))
        return this.squares[i];
    }
  }
};

function initalizeBoard(xMany, yMany) {
  for (var i = 0; i < xMany; i++) {
    for (var j = 0; j < yMany; j++) {
      var exists = !isInArray(board.not, [i, j]);
      var open = isInArray(board.openSpots, [i, j]);
      var x = space + i*(size + space);
      var y = space + j*(size + space);
      board.squares.push({ x: x + offset, y: y, size: size, loc: [i, j], open: open, exists: exists });
    }
  }
}

function readMap(m) {
  var abc = [];
  m.trim().split('\n').forEach(function(line, i) {
    line.split('').forEach(function(letter, j) {
      if(letter === '.') abc.push([j,i]);
    });
  });
  return abc;
}
if(window.map) {
  board.not = readMap(window.map);
}

var color1 = 'rgb(100,200,100)';
var color2 = 'rgb(200,100,200)';
var color3 = 'rgb(0,100,100)';
var color4 = 'rgb(255,255,60)';
var color5 = 'rgb(255,0,0)';
var color6 = 'rgb(255,130,0)';

var color7 = 'rgb(200,200,200)';
var white = 'rgb(255,255,255)';

var offset = 130;
var size = 30;
var space = 4;

var enemy = new Unit({
  maxLength: 9,
  maxMoves: 3,
  squares: [[3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [9, 5], [9, 6]],
  attacks: [
    { name: 'attack', range: 2, damage: 2 }
  ],
  color: 'rgb(85,85,85)',
  image: 'E',
  name: 'unicorn'
}, [3, 4]);
var enemyTeam = new Team([enemy], 'player2');
var team2 = enemyTeam;

document.addEventListener('DOMContentLoaded', function(event) {
  'use strict';
  var canvas = document.getElementById('game-canvas');
  canvas.width = '650';
  canvas.height = '488';
  var ctx = canvas.getContext('2d');

  var xMany = Math.floor((canvas.width - space - offset) / (size + space));
  var yMany = Math.floor((canvas.height - space) / (size + space));
  initalizeBoard(xMany, yMany);
  drawOnCanvas(ctx);


  canvas.addEventListener('click', function(e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;

    var clickedSquare = findSquareClicked(x, y);
    var clickedButton = findButtonClicked(x, y);
    var clickedAllyUnit = null;
    var clickedEnemyUnit = null;
    if(placingPhase && clickedExtraButton(x, y) && playerTeam.units.length > 0) {
      placingPhase = false;
    }
    if(clickedSquare) {
      clickedEnemyUnit = team2.getUnitOnSquare(clickedSquare.loc);
      clickedAllyUnit = team1.getUnitHeadOnSquare(clickedSquare.loc);
    }
    if(placingPhase) {
      if(clickedSquare && board.isOpenSquare(clickedSquare.loc) && hasUnitLeft(playerTeam.unitCount(), unitToPlace)) {
        playerTeam.deleteUnitOnSqaure(clickedSquare.loc);
        playerTeam.placeUnit(unitToPlace, clickedSquare.loc);
      } else if(clickedButton) {
        clickedButton.press();
      }
    } else {
      if(clickedSquare && clickedAllyUnit) {
        team1._selectedUnit = clickedAllyUnit;
      } else if(clickedSquare && team1.selectedUnit().canAttackSquare(clickedSquare.loc)) {
        if(clickedEnemyUnit) {
          team1.selectedUnit().attack(clickedEnemyUnit);
        } else {
          team1.selectedUnit().doNothing();
        }
        team1._selectedUnit = null;
        team2.trimDeadUnits();
      } else if(clickedSquare && clickedSquare.exists && !clickedEnemyUnit && team1.selectedUnit().canMoveTo(clickedSquare.loc)) {
        team1.selectedUnit().moveTo(clickedSquare.loc);
      } else if(clickedButton) {
        clickedButton.press();
        if(clickedButton.text === 'no action') team1._selectedUnit = null;
      }
      if(team1.isDead()) console.log(team2.name, ' wins');
      if(team2.isDead()) console.log(team1.name, ' wins');
      if(team1.turnOver()) {
        var temp = team1;
        team1 = team2;
        team2 = temp;
        team1.restartTurn();
      }
      buttons = team1.selectedUnit().makeButtonsForAttacks();
    }
    drawOnCanvas(ctx);
  }, false);
});

function findButtonClicked(xClicked, yClicked) {
  for (var i = 0; i < buttons.length; i++) {
    if(10 < xClicked && offset-10 > xClicked &&
      100 + (35 * i) < yClicked && 130 + (35 * i) > yClicked) {
      return buttons[i];
    }
  }
}

function clickedExtraButton(xClicked, yClicked) {
  return 10 < xClicked && offset-10 > xClicked &&
    400 < yClicked && 430 > yClicked;
}

function findSquareClicked(xClicked, yClicked) {
  for (var i = 0; i < board.squares.length; i++) {
    var square = board.squares[i];
    if(square.x < xClicked && square.x + square.size > xClicked &&
       square.y < yClicked && square.y + square.size > yClicked) {
      return square;
    }
  }
}

function squareNextTo(a, b) {
  return squareDist(a, b) === 1;
}

function drawOnCanvas(ctx) {
  clearCanvas(ctx);
  board.squares.forEach(function(square) {
    if(!square.exists) return;
    ctx.fillStyle = color1;
    var changed = false;
    var allUnits = team1.units.concat(team2.units);
    var image = null;
    for (var i = 0; i < allUnits.length; i++) {
      if(changed) break;
      changed = true;
      if(allUnits[i].isOnSquare(square.loc)) {
        ctx.fillStyle = allUnits[i].color;
        if(arrayEqual(allUnits[i].head, square.loc)) {
          image = allUnits[i].image;
        }
      } else {
        changed = false;
      }
    }
    if(!placingPhase && !changed && !team1.selectedUnit().attackMode && squareDist(square.loc, team1.selectedUnit().head) <= team1.selectedUnit().movesRemaining()) {
      ctx.fillStyle = color4;
    }
    if(placingPhase && !changed && board.isOpenSquare(square.loc)) {
      ctx.fillStyle = color7;
    }
    ctx.fillRect(square.x, square.y, square.size, square.size);
    if(!placingPhase && team1.selectedUnit().canAttackSquare(square.loc)) {
      ctx.fillStyle = color5;
      ctx.textAlign = 'center';
      ctx.font = '' + size + 'px monospace';
      ctx.fillText('X', square.x + size/2, square.y + size );
    }
    if(image) {
      ctx.fillStyle = white;
      ctx.textAlign = 'center';
      ctx.font = '' + size + 'px monospace';
      ctx.fillText(image, square.x + size/2, square.y + size );

    }
  });
  ctx.fillStyle = color7;
  ctx.fillRect(10, 5, offset - 20, ctx.canvas.height - 20);
  buttons.forEach(function(button, index) {
    ctx.fillStyle = color6;
    ctx.fillRect(10, 100 + (35 * index), offset - 20, 30);
    ctx.fillStyle = white;
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(button.getText(), 10 + (offset / 2), 125 + (35*index));
  });
  ctx.fillStyle = color6;
  ctx.fillRect(10, 400, offset-20, 30);
  ctx.fillStyle = white;
  ctx.font = '20px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('start', 10 + (offset / 2), 425);
}

function isInArray(arr, val) {
  if(!arr) return false;
  for (var i = 0; i < arr.length; i++) {
    if(arrayEqual(arr[i], val)) return true;
  }
  return false;
}

function arrayEqual(arr1, arr2) {
  if(!arr1 || !arr2 || arr1.length !== arr2.length) return false;
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

function squareDist(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function clearCanvas(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
