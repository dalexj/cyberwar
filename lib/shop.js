function ShopState() {}

ShopState.prototype = {
  create: function() {
    var text = addText(20, 20, 'hacker_brew 1.0.1', 48);
    this.setBlockText(this.shopText());
    new SideButton(450, 30, 'Back', function() { phaserGame.state.start('menu'); }).update();
    for (var i = 0; i < 5; i++) {
      var downloadText = phaserGame.add.text(436, 126 + (24*i), 'dl', {font: 'Ubuntu', fontSize: 16, fill: '#99aaff'});
      downloadText.inputEnabled = true;
      downloadText.input.useHandCursor = true;
      downloadText.events.onInputUp.add(this.download.bind(this,i));
    }
  },
  download: function(index) {
    var unitName = Object.keys(gameData.unitTypes)[index];
    if(this.remainingSpace() >= gameData.unitTypes[unitName].fileSize) {
      gameData.save.ownedUnits[unitName] = (gameData.save.ownedUnits[unitName] || 0) + 1;
    }
    this.setBlockText(this.shopText());
  },

  remainingSpace: function() {
    return gameData.save.hardDrive - this.usedSpace();
  },

  usedSpace: function() {
    var used = 0;
    for(var unitName in gameData.save.ownedUnits) {
      used += gameData.unitTypes[unitName].fileSize * gameData.save.ownedUnits[unitName];
    }
    return used;
  },

  setBlockText: function(bigText) {
    if(this.textBlob) this.textBlob.destroy();
    this.textBlob = addText(20, 80, '');
    this.textBlob.text = bigText;
  },

  shopText: function() {
    var shop = '';
    shop += 'program_name\t| size\t| amt\t| total_size\t| download\n';
    shop += '=====================================================\n';
    Object.keys(gameData.unitTypes).forEach(function(unitName, index) {
      var owned = gameData.save.ownedUnits[unitName] || 0;
      var fileSize = gameData.unitTypes[unitName].fileSize;
      shop += [
        unitName,
        fileSize.toString() + 'GB',
        owned.toString() + ' owned',
        (owned * fileSize).toString() + 'GB used',
        '\n'
      ].join('\t| ');
    });
    shop += '=====================================================\n';
    shop += ' \n';
    var percentUsed = Math.round(this.usedSpace() * 100 / gameData.save.hardDrive);
    shop += '[';
    for (var i = 0; i < Math.floor(percentUsed / 4); i++) {
      shop += '#';
    }
    for (var i = 0; i < Math.floor((100 - percentUsed) / 4); i++) {
      shop += '.';
    }
    shop += ']\n';
    shop += this.usedSpace() + '/' + gameData.save.hardDrive + ' GB (' + percentUsed + '%) used\n';
    return shop.trim();
  },
};

function ljust(str, len) {
  str = str.toString();
  while(str.length < len) {
    str += ' ';
  }
  return str;
}

function addText(x, y, words, textSize) {
  textSize = textSize || 16;
  return phaserGame.add.text(x, y, words, {font: 'Ubuntu', fontSize: textSize, fill: '#ffffff', tabs: 100});
}
