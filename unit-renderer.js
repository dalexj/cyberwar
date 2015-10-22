function UnitRenderer(unit) {
  this.unit = unit;
  this.rendering = {};
}

UnitRenderer.prototype.renderMovementAndAttackOptions = function() {
  this.rendering.attackOptions = [];
  this.rendering.movementOptions = [];
  for (var j = 0; j < board.squares.length; j++) {
    var square = board.squares[j];
    if(this.unit.canAttackSquare(square.loc)) {
      this.rendering.attackOptions.push(addSpriteAndConvert(square.loc, 'attack-option'));
    }
    if(!this.unit.attackMode && !arrayEqual(square.loc, this.unit.head) && squareDist(square.loc, this.unit.head) <= this.unit.movesRemaining()) {
      this.rendering.movementOptions.push(addSpriteAndConvert(square.loc, 'movement-option'));
    }
  }
};

UnitRenderer.prototype.renderBody = function() {
  this.rendering.sprites = [];
  for (var i = 0; i < this.unit.squares.length; i++) {
    var pixels = convertSquareToPixels(this.unit.squares[i]);
    var sprite;
    if(arrayEqual(this.unit.squares[i], this.unit.head)) {
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
