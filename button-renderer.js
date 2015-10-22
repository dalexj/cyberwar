function SideButton(x, y, getText, onclick) {
  this.sprites = [];
  this.getText = getText;
  onclick = onclick || function() { console.log('nothing implemented for button ' + this.getText()); };
  this.sprite = phaserGame.add.button(x, y, 'button', onclick, this);
  this.text = phaserGame.add.text(0, 0, this.getText(), {font: 'monospace', fontSize: 16, fill: '#ffffff'});
  this.text.anchor.set(0.5);
  this.update();
}

SideButton.prototype.destroy = function() {
  this.sprite.destroy();
  this.text.destroy();
};

SideButton.prototype.update = function() {
  this.setText(this.getText());
  this.text.x = Math.floor(this.sprite.x + this.sprite.width / 2);
  this.text.y = Math.floor(this.sprite.y + this.sprite.height / 2);
};

SideButton.prototype.setText = function(newText) {
  this.text.text = newText;
};

SideButton.prototype.setImage = function(image) {
  this.sprite.loadTexture(image);
};

function setButtons(buttonData) {
  actionButtons.forEach(function(button) {
    button.destroy();
  });
  actionButtons = [];
  buttonData.forEach(function(button, index) {
    actionButtons.push(new SideButton(10, 100 + (35 * index), button.getText, button.onclick));
  });
}
