var gameData = {};

gameData.battle1 = {
  map:
    "" +
    "...............\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MMMPMMM....\n" +
    "....MMMMMMM....\n" +
    "...............\n",
  enemyUnits: [{ name: "fence", head: [7, 3] }],
  id: 1,
};
gameData.battle2 = {
  map:
    "" +
    "...............\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MMMMMMM....\n" +
    "....MPMMMPM....\n" +
    "....MMMMMMM....\n" +
    "...............\n",
  enemyUnits: [
    { name: "fence", head: [5, 3], tiles: [[5, 3], [5, 2]] },
    { name: "fence", head: [9, 3], tiles: [[9, 3], [9, 2]] },
  ],
  id: 2,
};
gameData.battle3 = {
  map:
    "" +
    "...............\n" +
    "...............\n" +
    "...............\n" +
    "..MMMPMMMPMMM..\n" +
    "..MMMMMMMMMMM..\n" +
    "..MMMMMMMMMMM..\n" +
    "..MM.......MM..\n" +
    "..MM.......MM..\n" +
    "..MMMMMMMMMMM..\n" +
    "..MMMMMMMMMMM..\n" +
    "..MMMMMMMMMMM..\n" +
    "...............\n" +
    "...............\n" +
    "...............\n",
  enemyUnits: [
    { name: "battery", head: [5, 8], tiles: [[5, 8]] },
    { name: "battery", head: [6, 8], tiles: [[6, 8]] },
    { name: "battery", head: [7, 8], tiles: [[7, 8]] },
    { name: "battery", head: [8, 8], tiles: [[8, 8]] },
    { name: "battery", head: [9, 8], tiles: [[9, 8]] },
  ],
  id: 3,
};
gameData.unitTypes = {
  hack: {
    maxMoves: 2,
    fileSize: 5,
    maxLength: 4,
    attacks: [{ name: "slice", damage: 2, range: 1, type: "attack" }],
    name: "hack",
  },
  battery: {
    maxMoves: 0,
    fileSize: 99,
    maxLength: 1,
    attacks: [{ name: "zap", damage: 2, range: 3, type: "attack" }],
    name: "battery",
  },
  fence: {
    maxMoves: 1,
    fileSize: 99,
    maxLength: 4,
    attacks: [{ name: "keep out", damage: 2, range: 1, type: "attack" }],
    name: "fence",
  },
  bug: {
    maxMoves: 5,
    fileSize: 3,
    maxLength: 1,
    attacks: [{ name: "glitch", damage: 2, range: 1, type: "attack" }],
    name: "bug",
  },
  unicorn: {
    maxMoves: 3,
    fileSize: 6,
    maxLength: 9,
    attacks: [{ name: "horn_drill", damage: 2, range: 2, type: "attack" }],
    name: "unicorn",
  },
  medic: {
    maxMoves: 3,
    fileSize: 10,
    maxLength: 3,
    attacks: [
      { name: "speed_boost", damage: 2, range: 1, type: "speed" },
      { name: "grow", damage: 1, range: 1, type: "grow" },
    ],
    name: "medic",
  },
  hammer: {
    maxMoves: 3,
    fileSize: 10,
    maxLength: 3,
    attacks: [
      { name: "repair", damage: 1, range: 1, type: "add_tile" },
      { name: "smash", damage: 1, range: 1, type: "remove_tile" },
    ],
    name: "hammer",
  },
};

gameData.save = {
  ownedUnits: {
    hack: 5,
    battery: 5,
    fence: 5,
    bug: 5,
    unicorn: 5,
    medic: 5,
    hammer: 5,
  },
  hardDrive: 50,
  completed: { 1: true, 2: true },
};

function saveLocalStorage() {
  localStorage.cyberwarSaveData = JSON.stringify(gameData.save);
}

function deleteLocalStore() {
  delete localStorage.cyberwarSaveData;
}

function readLocalStorage() {
  if (localStorage.cyberwarSaveData) {
    return JSON.parse(localStorage.cyberwarSaveData);
  }
  return {};
}
