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
'....MPMMMPM....\n'+
'....MMMMMMM....\n'+
'...............\n',
  enemyUnits: [
    { name: 'bug', head: [5,3] },
    { name: 'bug', head: [9,3] },
  ]
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
    { name: 'hack', head: [5,3], tiles: [[5,3], [5,2]] },
    { name: 'hack', head: [9,3], tiles: [[9,3], [9,2]] },
  ]
};

gameData.unitTypes = {
  hack: {
    maxMoves: 2,
    maxLength: 4,
    attacks: [{ name: 'slice', damage: 2, range: 1, type: 'attack'}],
    name: 'hack'
  },
  bug: {
    maxMoves: 5,
    maxLength: 1,
    attacks: [{ name: 'glitch', damage: 2, range: 1, type: 'attack' }],
    name: 'bug'
  },
  unicorn: {
    maxMoves: 3,
    maxLength: 9,
    attacks: [{ name: 'horn_drill', damage: 2, range: 2, type: 'attack' }],
    name: 'unicorn'
  },
  medic: {
    maxMoves: 3,
    maxLength: 3,
    attacks: [
      { name: 'speed_boost', damage: 2, range: 1, type: 'speed' },
      { name: 'grow', damage: 1, range: 1, type: 'grow' }
    ],
    name: 'medic'
  },
  hammer: {
    maxMoves: 3,
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
    bug: 2,
    hack: 1,
    unicorn: 3,
    medic: 1,
    hammer: 1
  }
};
