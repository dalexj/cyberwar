var gameData = {};

gameData.battle1 = {
  map: '' +
'...............\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MMMPMMM....\n'+
'....MMMMMMM....\n'+
'...............\n',
  enemyUnits: [
    { name: 'fence', head: [7,3] }
  ],
  id: 1
};
gameData.battle2 = {
  map: '' +
'...............\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MMMMMMM....\n'+
'....MPMMMPM....\n'+
'....MMMMMMM....\n'+
'...............\n',
  enemyUnits: [
    { name: 'fence', head: [5,3], tiles: [[5,3], [5,2]] },
    { name: 'fence', head: [9,3], tiles: [[9,3], [9,2]] },
  ],
  id: 2
};
gameData.battle3 = gameData.battle2;
gameData.unitTypes = {
  hack: {
    maxMoves: 2,
    fileSize: 5,
    maxLength: 4,
    attacks: [{ name: 'slice', damage: 2, range: 1, type: 'attack'}],
    name: 'hack'
  },
  fence: {
    maxMoves: 1,
    fileSize: 99,
    maxLength: 4,
    attacks: [{ name: 'keep out', damage: 2, range: 1, type: 'attack' }],
    name: 'fence'
  },
  bug: {
    maxMoves: 5,
    fileSize: 3,
    maxLength: 1,
    attacks: [{ name: 'glitch', damage: 2, range: 1, type: 'attack' }],
    name: 'bug'
  },
  unicorn: {
    maxMoves: 3,
    fileSize: 6,
    maxLength: 9,
    attacks: [{ name: 'horn_drill', damage: 2, range: 2, type: 'attack' }],
    name: 'unicorn'
  },
  medic: {
    maxMoves: 3,
    fileSize: 10,
    maxLength: 3,
    attacks: [
      { name: 'speed_boost', damage: 2, range: 1, type: 'speed' },
      { name: 'grow', damage: 1, range: 1, type: 'grow' }
    ],
    name: 'medic'
  },
  hammer: {
    maxMoves: 3,
    fileSize: 10,
    maxLength: 3,
    attacks: [
      { name: 'repair', damage: 1, range: 1, type: 'add_tile' },
      { name: 'smash', damage: 1, range: 1, type: 'remove_tile' }
    ],
    name: 'hammer'
  }
};

gameData.save = {
  ownedUnits: {
    hack: 2
  },
  hardDrive: 50,
  completed: {}
};

function saveLocalStorage() {
  localStorage.cyberwarSaveData = JSON.stringify(gameData.save);
}

function deleteLocalStore() {
  delete localStorage.cyberwarSaveData;
}

function readLocalStorage() {
  if(localStorage.cyberwarSaveData) {
    return JSON.parse(localStorage.cyberwarSaveData);
  }
  return {};
}
