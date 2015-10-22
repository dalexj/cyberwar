function UnitRenderer(unit) {
  this.unit = unit;
  this.rendering = {};
}

UnitRenderer.prototype.renderMovementAndAttackOptions = function() {
  this.rendering.attackOptions = [];
  this.rendering.movementOptions = [];
  for (var j = 0; j < board.tiles.length; j++) {
    var tile = board.tiles[j];
    if(this.unit.canAttackTile(tile.loc)) {
      this.rendering.attackOptions.push(addSpriteAndConvert(tile.loc, 'attack-option'));
    }
    if(!this.unit.attackMode && !arrayEqual(tile.loc, this.unit.head) && tileDist(tile.loc, this.unit.head) <= this.unit.movesRemaining()) {
      this.rendering.movementOptions.push(addSpriteAndConvert(tile.loc, 'movement-option'));
    }
  }
};

UnitRenderer.prototype.renderBody = function() {
  this.rendering.sprites = [];
  for (var i = 0; i < this.unit.tiles.length; i++) {
    var pixels = convertTileToPixels(this.unit.tiles[i]);
    var sprite;
    if(arrayEqual(this.unit.tiles[i], this.unit.head)) {
      sprite = addSprite(pixels, this.unit.name);
    } else {
      sprite = addSprite(pixels, this.unit.name + '-background');
    }
    this.rendering.sprites.push(sprite);
  }
};

UnitRenderer.prototype.redraw = function() {
  if(!this.unit._needsRender) return;
  console.log('rendering a unit');
  this.erase();
  this.renderBody();

  if(this.unit.isSelected()) {
    this.renderMovementAndAttackOptions();
    this.renderButtons();
  }
  this.unit._needsRender = false;
};

UnitRenderer.prototype.erase = function() {
  ['sprites', 'movementOptions', 'attackOptions'].forEach(function(imageType) {
    if(this.rendering[imageType]) {
      this.rendering[imageType].forEach(function(sprite) { sprite.destroy(); });
    }
  }.bind(this));
};

UnitRenderer.prototype.renderButtons = function() {
  setButtons(this.unit.makeButtonsForAttacks());
};
