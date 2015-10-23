var menuState = {
  preload: function() {
    preload();
  },
  create: function() {
    var text = phaserGame.add.text(phaserGame.world.centerX, 100, 'CyberWar', {font: 'monospace', fontSize: 48, fill: '#ffffff'});
    text.anchor.set(0.5);
    new SideButton(phaserGame.world.centerX - 50, 200, 'Play', function() {
      phaserGame.state.start('game');
    }).update();
  }
};
