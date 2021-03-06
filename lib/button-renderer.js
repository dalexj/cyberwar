function SideButton(x, y, getText, onclick) {
  this.sprites = [];
  this.getText = getText;
  onclick = onclick || function() { console.log('nothing implemented for button ' + this.getText()); };
  this.sprite = phaserGame.add.button(x, y, 'button', onclick, this, 0, 0, 1, 0);
  this.text = phaserGame.add.text(0, 0, this.buttonText(), {font: 'Ubuntu', fontSize: 16, fill: '#ffffff'});
  this.text.anchor.set(0.5);
  this.update();
}

SideButton.prototype.destroy = function() {
  this.sprite.destroy();
  this.text.destroy();
};

SideButton.prototype.update = function() {
  if(this.isChangingText()) this.setText(this.getText());
  this.text.x = Math.floor(this.sprite.x + this.sprite.width / 2);
  this.text.y = Math.floor(this.sprite.y + this.sprite.height / 2);
};

SideButton.prototype.setText = function(newText) {
  this.text.text = newText;
};

SideButton.prototype.setImage = function(image) {
  this.sprite.loadTexture(image);
};

SideButton.prototype.buttonText = function() {
  return this.isChangingText() ? this.getText() : this.getText ;
};

SideButton.prototype.isChangingText = function() {
  return (this.getText instanceof Function);
};

SideButton.prototype.disable = function() {
  this.sprite.input.enabled = false;
};

SideButton.prototype.enable = function() {
  this.sprite.input.enabled = true;
};
