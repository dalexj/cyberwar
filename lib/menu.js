var menuState = {
  preload: function() {
    preload();
  },
  create: function() {
    var titleText = 'CyberWar';
    if(window.winText) { titleText += '\n' + window.winText + ' won'; }
    var text = phaserGame.add.text(phaserGame.world.centerX, 100, titleText, {font: 'Ubuntu', fontSize: 48, fill: '#ffffff'});
    text.anchor.set(0.5);
    new SideButton(phaserGame.world.centerX - 250, 200, 'Level 1', this.startGame.bind(this, gameData.battle1)).update();
    new SideButton(phaserGame.world.centerX - 50, 200,  'Level 2', this.startGame.bind(this, gameData.battle2)).update();
    new SideButton(phaserGame.world.centerX + 150, 200, 'Level 3', this.startGame.bind(this, gameData.battle2)).update();
    new SideButton(phaserGame.world.centerX - 50, 300,  'Shop', function() { phaserGame.state.start('shop'); }).update();
  },
  startGame: function(battle) {
    if(Object.keys(gameData.save.ownedUnits).length === 0) {
      console.log('no units, cant start');
      return;
    }
    window.battle = JSON.parse(JSON.stringify(battle));
    phaserGame.state.start('game');
  }
};
