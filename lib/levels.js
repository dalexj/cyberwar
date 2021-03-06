var levelState = {
  preload: function() {
    preload();
  },
  create: function() {
    var levels = {
      1: { x: 100, y: 100, name: 1, required: null },
      2: { x: 250, y: 100, name: 2, required: 1 },
      3: { x: 250, y: 200, name: 3, required: 2 },
      4: { x: 400, y: 200, name: 4, required: 3 },
      5: { x: 250, y: 300, name: 5, required: 3 },
    };
    this.lines = phaserGame.add.graphics(0, 0);
    for(var levelNum in levels) {
      var level = levels[levelNum];
      this.lines.beginFill(0xFFFFFF);
      var button = phaserGame.add.button(
        level.x - 30, level.y - 30, 'server',
        this.startGame.bind(this, gameData['battle' + level.name]), this,
        1, 0, 2, 1
      );
      if(gameData.save.completed[levelNum]) {
        button.setFrames(4, 3, 5, 4);
      }
      if(level.required) {
        if(!gameData.save.completed[level.required]) {
          button.input.enabled = false;
          button.setFrames(6,6,6,6);
        }
        var x = Math.min(level.x, levels[level.required].x) - 1;
        var y = Math.min(level.y, levels[level.required].y) - 1;
        var width = Math.abs(levels[level.required].x - level.x) + 1;
        var height = Math.abs(levels[level.required].y - level.y) + 1;
        this.lines.drawRect(x, y, width, height);
      }
    }
    this.lines.endFill();
    new SideButton(phaserGame.world.centerX + 200, 150,'Back', function() { phaserGame.state.start('menu'); }).update();
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
