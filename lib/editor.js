if(window.Phaser) {
  var phaserGame = new Phaser.Game(650, 488, Phaser.CANVAS, 'phaser-canvas', { create: create, update: update, preload: preload, render: render});
}
var sidebar;
var offset = 130;
var size = 30;
var space = 4;
var buttons = [];
var unitNames = ['bug', 'hack', 'unicorn'];
var unitToPlace = null;
var placingTile = false;
var tiles = [];
var units = [];
var xTiles = Math.floor((650 - space - offset) / (size + space));
var yTiles = Math.floor((488 - space) / (size + space));

function create() {
  sidebar = phaserGame.add.graphics(0, 0);
  sidebar.beginFill(0xc8c8c8);
  sidebar.drawRect(10, 5, offset-20, 488 - 20);
  sidebar.endFill();

  unitNames.forEach(function(unitName, index) {
    buttons.push(new SideButton(10, 100 + (35 * (index + 1)), unitName, function() {
      unitToPlace = unitName;
      placingTile = false;
    }));
  });
  buttons.push(new SideButton(10, 100, 'add/remove', function() {
    unitToPlace = null;
    placingTile = false;
  }));
  buttons.push(new SideButton(10, 100 + (35 * (unitNames.length + 1)), 'placing tile', function() {
    placingTile = true;
    unitToPlace = null;
  }));
  buttons.push(new SideButton(10, 100 + (35 * (unitNames.length + 2)), 'export', function() {
    var battle = {};
    battle.map = '';
    battle.enemyUnits = [];
    for (var i = 0; i < xTiles; i++) {
      for (var j = 0; j < yTiles; j++) {
        var t = getTileOn([i, j]).representation;
        if(arrayAny(unitNames, t)) {
          battle.enemyUnits.push({ name: t, tiles: [[i,j]], head: [i,j] });
          battle.map += 'M';
        } else {
          battle.map += t;
        }
      }
      battle.map += '\n';
    }
    battle.map = battle.map.trim();
    console.log(JSON.stringify(battle));
  }));
  for (var i = 0; i < xTiles; i++) {
    for (var j = 0; j < yTiles; j++) {
      var x = space + i*(size + space);
      var y = space + j*(size + space);
      tiles.push(new EditorTile({ x: x + offset, y: y, size: size, loc: [i, j] }));
    }
  }
}

function getTileOn(loc) {
  for (var i = 0; i < tiles.length; i++) {
    if(arrayEqual(tiles[i].loc, loc))
      return tiles[i];
  }
}

function EditorTile(options) {
  this.x = options.x;
  this.y = options.y;
  this.size = options.size;
  this.loc = options.loc;

  if(this.loc[0] === 0 || this.loc[1] === 0 || this.loc[1] === yTiles-1 || this.loc[0] === xTiles-1) {
    this.sprite = addButton([this.x,this.y], 'attack-option', this.onclick.bind(this));
    this.representation = '.';
  } else {
    this.sprite = addButton([this.x,this.y], 'tile', this.onclick.bind(this));
    this.representation = 'M';
  }

}

EditorTile.prototype.onclick = function() {
  if(placingTile) {
    this.representation = 'P';
    this.sprite.destroy();
    this.sprite = addButton([this.x,this.y], 'tile2', this.onclick.bind(this));
  } else if(unitToPlace) {
    this.representation = unitToPlace;
    this.sprite.destroy();
    this.sprite = addButton([this.x,this.y], unitToPlace, this.onclick.bind(this));
  } else {
    if(this.representation === 'M') {
      this.representation = '.';
      this.sprite.destroy();
      this.sprite = addButton([this.x,this.y], 'attack-option', this.onclick.bind(this));
    } else {
      this.representation = 'M';
      this.sprite.destroy();
      this.sprite = addButton([this.x,this.y], 'tile', this.onclick.bind(this));
    }
  }
};

function update() {

}
function render() {

}

function convertTileToPixels(coords) {
  return [space + offset + coords[0]*(size + space), space + coords[1]*(size + space)];
}

function addSprite(pixels, spriteName) {
  return phaserGame.add.sprite(pixels[0], pixels[1], spriteName);
}

function addButton(pixels, spriteName, onclick) {
  return phaserGame.add.button(pixels[0], pixels[1], spriteName, onclick);
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

function isInArray(arr, val) {
  if(!arr) return false;
  for (var i = 0; i < arr.length; i++) {
    if(arrayEqual(arr[i], val)) return true;
  }
  return false;
}

function arrayAny(arr, val) {
  if(!arr) return false;
  for (var i = 0; i < arr.length; i++) {
    if(arr[i] === val) return true;
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
