var phaserGame = new Phaser.Game(650, 488, Phaser.CANVAS, 'phaser-canvas');

phaserGame.state.add('game', new BattleState(phaserGame));
phaserGame.state.add('menu', menuState);
phaserGame.state.start('menu');
var offset = 130;
var size = 30;
var space = 4;

function convertTileToPixels(coords) {
  return [space + offset + coords[0]*(size + space), space + coords[1]*(size + space)];
}

function coordsBetween(coords1, coords2) {
  var x,y;
  var converted1 = convertTileToPixels(coords1);
  var converted2 = convertTileToPixels(coords2);
  if(converted1[0] === converted2[0]) {
    x = converted1[0] + 13;
  } else {
    x = max(converted1[0], converted2[0]) - 4;
  }
  if(converted1[1] === converted2[1]) {
    y = converted1[1] + 13;
  } else {
    y = max(converted1[1], converted2[1]) - 4;
  }

  return [x, y];
}

function max(x, y) {
  return x > y ? x : y;
}

function addSprite(pixels, spriteName) {
  return phaserGame.add.sprite(pixels[0], pixels[1], spriteName);
}

function addSpriteAndConvert(tile, spriteName) {
  var pixels = convertTileToPixels(tile);
  return phaserGame.add.sprite(pixels[0], pixels[1], spriteName);
}

function preload() {
  phaserGame.stage.backgroundColor = '#666666';
  [
    'button', 'button2', 'tile', 'tile2', 'unicorn', 'unicorn-background',
    'hack', 'hack-background', 'bug', 'bug-background', 'movement-option', 'attack-option'
  ].forEach(function(imageName) {
    phaserGame.load.image(imageName, 'assets/sprites/' + imageName + '.png');
  });
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

var saveState = {
  ownedUnits: {
    bug: 2,
    hack: 1,
    unicorn: 5
  }
};

function hasUnitLeft(placed, unit) {
  return amountLeft(placed, unit) > 0;
}

function amountLeft(placed, unit) {
  return saveState.ownedUnits[unit] - (placed[unit] || 0);
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

function tileNextTo(a, b) {
  return tileDist(a, b) === 1;
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

function tileDist(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}
