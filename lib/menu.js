var menuState = {
  preload: function() {
    preload();
  },
  create: function() {
    var titleText = 'CyberWar';
    if(window.winText) { titleText += '\n' + window.winText + ' won'; }
    var text = phaserGame.add.text(phaserGame.world.centerX, 100, titleText, {font: 'Ubuntu', fontSize: 48, fill: '#ffffff'});
    text.anchor.set(0.5);
    new SideButton(phaserGame.world.centerX - 50, 200, 'Play', function() { phaserGame.state.start('levels'); }).update();
    new SideButton(phaserGame.world.centerX - 50, 300, 'Shop', function() { phaserGame.state.start('shop'); }).update();
  }
};
