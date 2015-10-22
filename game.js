var phaserGame = new Phaser.Game(650, 488, Phaser.CANVAS, 'phaser-canvas', { preload: preload, create: create, update: update, render: render });

var offset = 130;
var size = 30;
var space = 4;
var actionButtons;

function convertSquareToPixels(coords) {
  return [space + offset + coords[0]*(size + space), space + coords[1]*(size + space)];
}

function addSprite(pixels, spriteName) {
  return phaserGame.add.sprite(pixels[0], pixels[1], spriteName);
}

function addSpriteAndConvert(square, spriteName) {
  var pixels = convertSquareToPixels(square);
  return phaserGame.add.sprite(pixels[0], pixels[1], spriteName);
}

function preload() {
  // phaserGame.stage.backgroundColor = '#ffffff';
  phaserGame.stage.backgroundColor = '#666666';
  [
    'button', 'button2', 'square', 'square2', 'unicorn', 'unicorn-background',
    'hack', 'hack-background', 'bug', 'bug-background', 'movement-option', 'attack-option'
  ].forEach(function(imageName) {
    phaserGame.load.image(imageName, 'assets/sprites/' + imageName + '.png');
  });
}

var graphics;
var groups = {};
function create() {
  groups.squares = phaserGame.add.group();
  groups.squares.z = -1;
  initialSetup();
  graphics = phaserGame.add.graphics(0, 0);
  graphics.beginFill(0xc8c8c8);
  graphics.drawRect(10, 5, offset-20, 488 - 20);
  graphics.endFill();
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
  team2.addUnit(enemy);

  actionButtons = [
    new SideButton(10, 100 + (35 * 0), function() { return 'Hack x' + amountLeft(playerTeam.unitCount(), 'hack'); }, function() { unitToPlace = 'hack'; }),
    new SideButton(10, 100 + (35 * 1), function() { return 'Bug x'  + amountLeft(playerTeam.unitCount(), 'bug');  }, function() { unitToPlace = 'bug'; }),
    new SideButton(10, 400, function(){ return 'start'; }, function() {
      if(playerTeam.units.length > 0) {
        placingPhase = false;
        team1.restartTurn();
        board.squares.forEach(function(square) {
          square.killClicker();
        });
      }
    })
  ];
}

function update() {
  actionButtons.forEach(function(button) {
    button.update();
  });
}

function render() {
  team1.units.concat(team2.units).forEach(function(unit) {
    unit.redraw();
  });
}

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
var playerTeam,
    unitToPlace,
    team1,
    placingPhase,
    board,
    team2;
function initialSetup() {
  playerTeam = new Team('player1');
  unitToPlace = 'none';
  team1 = playerTeam;
  placingPhase = true;
  board = { squares: [], not: [
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
  team2 = new Team('player2');
  if(window.map) {
    board.not = readMap(window.map);
  }
  var xMany = Math.floor((650 - space - offset) / (size + space));
  var yMany = Math.floor((488 - space) / (size + space));
  initializeBoard(xMany, yMany);
}

function initializeBoard(xMany, yMany) {
  for (var i = 0; i < xMany; i++) {
    for (var j = 0; j < yMany; j++) {
      var exists = !isInArray(board.not, [i, j]);
      var open = isInArray(board.openSpots, [i, j]);
      var x = space + i*(size + space);
      var y = space + j*(size + space);
      board.squares.push(new Square({ x: x + offset, y: y, size: size, loc: [i, j], open: open, exists: exists }));
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

function squareNextTo(a, b) {
  return squareDist(a, b) === 1;
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
