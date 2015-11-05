var shopState = {
  create: function() {
    var text = phaserGame.add.text(phaserGame.world.centerX + 200, 100, 'Shop', {font: 'Ubuntu', fontSize: 48, fill: '#ffffff'});
    text.anchor.set(0.5);
    this.ownedAmounts = {};
    Object.keys(gameData.unitTypes).forEach(function(type, index) {
      new SideButton(
        phaserGame.world.centerX - 250, 100 + (32*index),
        type + ' ' + gameData.unitTypes[type].price,
        this.buy.bind(this, type)
      ).update();
      this.ownedAmounts[type] = phaserGame.add.text(phaserGame.world.centerX - 100, 100 + (32*index), '', {font: 'Ubuntu', fontSize: 16, fill: '#ffffff'});
    }.bind(this));
    this.moneyText = phaserGame.add.text(phaserGame.world.centerX - 100, 50, '', {font: 'Ubuntu', fontSize: 16, fill: '#ffffff'});
    this.infoText = phaserGame.add.text(phaserGame.world.centerX, 300, '', {font: 'Ubuntu', fontSize: 16, fill: '#ffffff'});
    this.infoText.anchor.set(0.5);
    this.infoText.align = 'center';
    new SideButton(phaserGame.world.centerX + 200, 150,'Back', function() { phaserGame.state.start('menu'); }).update();
  },
  buy: function(unit) {
    if(gameData.save.money > gameData.unitTypes[unit].price) {
      gameData.save.money -= gameData.unitTypes[unit].price;
      gameData.save.ownedUnits[unit] = gameData.save.ownedUnits[unit] || 0;
      gameData.save.ownedUnits[unit]++;
      this.setInfoText('buying ' + unit);
    } else {
      this.setInfoText('not enough money');
    }
  },

  update: function() {
    for(var unitName in this.ownedAmounts) {
      this.ownedAmounts[unitName].text = (gameData.save.ownedUnits[unitName] || 0) + ' owned';
    }
    this.moneyText.text = 'money: ' + gameData.save.money;
  },
  setInfoText: function(text, dontClear) {
    this.infoText.text = text;
    if(!dontClear) {
      clearTimeout(this._infoTextTimeout);
      this._infoTextTimeout = setTimeout(this.setInfoText.bind(this, '', true), 5000);
    }
  }
};
