var shopState = {
  create: function() {
    var text = addText(20, 20, 'hacker_brew 1.0.1', 48);
    this.setBlockText(this.shopText());
    new SideButton(450, 30, 'Back', function() { phaserGame.state.start('menu'); }).update();
    for (var i = 2; i < 7; i++) {
      var a = phaserGame.add.button(436, 82 + (26*i), 'button', function() {
        console.log('a');
      }, this);
      a.height = 16;
      addText(436, 82 + (26*i), 'download', 14)
    }
  },
  download: function(unitName) {
    if(gameData.save.money > gameData.unitTypes[unit].price) {
      gameData.save.money -= gameData.unitTypes[unit].price;
      gameData.save.ownedUnits[unit] = gameData.save.ownedUnits[unit] || 0;
      gameData.save.ownedUnits[unit]++;
      this.setInfoText('buying ' + unit);
    } else {
      this.setInfoText('not enough money');
    }
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
    if(this.textBlob) {
      this.textBlob.destroy();
    }
    this.textBlob = addText(20, 80, bigText);
    // this.textBlob.lineSpacing = 0;
  },

  shopText: function() {
    var shop = '';
    shop += 'program_name\t| size\t| amt  \t| total_size\t| download\n';
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
    shop += '[#######################################............]\n';
    shop += '30/50 GB (64%) used\n';
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
  return phaserGame.add.text(x, y, words, {font: 'Ubuntu', fontSize: textSize, fill: '#ffffff', textDecoration: 'underline', tabs: 100});
}
