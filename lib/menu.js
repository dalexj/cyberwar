var menuState = {
  preload: function() {
    preload();
  },
  create: function() {
    var titleText = 'CyberWar';
    if(window.winText) { titleText += '\n' + window.winText + ' won'; }
    var text = phaserGame.add.text(phaserGame.world.centerX, 100, titleText, {font: 'monospace', fontSize: 48, fill: '#ffffff'});
    text.anchor.set(0.5);
    new SideButton(phaserGame.world.centerX - 250, 200, 'Level 1', function() {
      phaserGame.state.start('game');
    }).update();
    new SideButton(phaserGame.world.centerX - 50, 200, 'Level 2', function() {
      phaserGame.state.start('game');
    }).update();
    new SideButton(phaserGame.world.centerX + 150, 200, 'Level 3', function() {
      phaserGame.state.start('game');
    }).update();
  }
};