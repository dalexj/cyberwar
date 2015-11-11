if(window.Phaser) {
  var phaserGame = new Phaser.Game(650, 488, Phaser.CANVAS, 'phaser-canvas');

  phaserGame.state.add('game', BattleState);
  phaserGame.state.add('menu', menuState);
  phaserGame.state.add('shop', ShopState);
  phaserGame.state.add('levels', levelState);
  phaserGame.state.start('menu');
}

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
    x = converted1[0] + 11;
  } else {
    x = max(converted1[0], converted2[0]) - 6;
  }
  if(converted1[1] === converted2[1]) {
    y = converted1[1] + 11;
  } else {
    y = max(converted1[1], converted2[1]) - 6;
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
  // phaserGame.stage.backgroundColor = '#073642';
  phaserGame.stage.backgroundColor = '#3a3a3a';
  phaserGame.load.spritesheet('button', 'assets/sprites/button.png', 110, 30);
  phaserGame.load.spritesheet('server', 'assets/sprites/server.png', 60, 60);
  [
    'button2', 'tile', 'tile2', 'unicorn', 'unicorn-background',
    'hack', 'hack-background', 'bug', 'bug-background', 'movement-option', 'attack-option',
    'medic', 'medic-background', 'sidebar', 'hammer', 'hammer-background', 'movement-option-2',
    'fence', 'fence-background'
  ].forEach(function(imageName) {
    phaserGame.load.image(imageName, 'assets/sprites/' + imageName + '.png');
  });
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function hasUnitLeft(placed, unit) {
  return amountLeft(placed, unit) > 0;
}

function amountLeft(placed, unit) {
  return gameData.save.ownedUnits[unit] - (placed[unit] || 0);
}

function tileNextTo(a, b) {
  return Tile.dist(a, b) === 1;
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
