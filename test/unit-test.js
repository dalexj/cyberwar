QUnit.test('Unit#movesRemaining', function(assert) {
  var u = new Unit({ maxMoves: 9 });
  u.movesMade += 6;
  assert.strictEqual(3, u.movesRemaining(), 'based on movesMade and maxMoves');
});

QUnit.test('Unit#currentAttack', function(assert) {
  var u = new Unit({attacks: ['attack1', 'attack2']});
  assert.strictEqual('attack1', u.currentAttack(), 'defaults when not set');
  u._currentAttack = 'attack2';
  assert.strictEqual('attack2', u.currentAttack(), 'shows set one when set');
});

QUnit.test('Unit#attack', function(assert) {
  var u = new Unit({ attacks: [{ damage: 2 }] });
  var tiles = [[0,0], [0,1], [0,2], [1,2]];
  var enemy = new Unit({ tiles: tiles }, tiles[0]);
  assert.ok(!u.moveOver, 'turn in progress');
  assert.strictEqual(4, enemy.health(), 'enemy before attack');
  u.attack(enemy);
  assert.ok(u.moveOver, 'turn ends after attack');
  assert.strictEqual(2, enemy.health(), 'enemy takes damage');
});

QUnit.test('Unit#removeTiles', function(assert) {
  var tiles = [[1,2], [0,2], [0,1], [0,0]];
  var u = new Unit({ tiles: tiles }, tiles[0]);

  assert.strictEqual(4, u.health(), 'health full at first');
  u.removeTiles(0);
  assert.strictEqual(4, u.health(), 'removing 0 does nothing');
  u.removeTiles(-2);
  assert.strictEqual(4, u.health(), 'removing -2 does nothing');

  u.removeTiles(2);
  assert.strictEqual(2, u.health(), 'removing 2 actually works');
  assert.deepEqual([[1,2], [0,2]], u.tiles, 'removes tiles farther from head');
});

QUnit.test('Unit#restartTurn', function(assert) {
  var u = new Unit({});
  u.moveOver = true;
  u._currentAttack = '123';
  u.attackMode = true;
  u.movesMade = 9;
  assert.ok(u.moveOver && u._currentAttack && u.attackMode && u.movesMade !== 0, 'units things are opposite before turn restarts');
  u.restartTurn();
  assert.ok(!u.moveOver, 'is units turn again');
  assert.ok(!u._currentAttack, 'no selected attack');
  assert.ok(!u.attackMode, 'not in attack mode');
  assert.strictEqual(0, u.movesMade, 'hasnt made any moves');
});

QUnit.test('Unit#canAttack', function(assert) {
  var atks = [{ name: 'test', damage: 1, range: 1}];
  var tiles = [[1,2], [2,2]];
  var u = new Unit({ attacks: atks, tiles: tiles }, [2,2]);
  var enemy = new Unit({tiles: [[2,4], [2,3]]}, [2,3]);
  u.attackMode = true;
  assert.ok(u.canAttack(enemy, [2,3]), 'can attack enemy in range');
  assert.ok(!u.canAttack(enemy, [3,2]), 'cant attack, enemy not there');
  assert.ok(!u.canAttack(enemy, [2,4]), 'cant attack, not in range');
});

QUnit.test('Unit#canAttackTile', function(assert) {
  var atks = [{ name: 'test', damage: 1, range: 1}, { name: 'test2', damage: 1, range: 2}];
  var tiles = [[1,2], [2,2]];
  var u = new Unit({ attacks: atks, tiles: tiles }, [2,2]);
  u.attackMode = true;
  assert.ok(!u.canAttackTile([1,2]), 'cant attack self');
  assert.ok(!u.canAttackTile([4,2]), 'cant attack out of range');
  assert.ok(!u.canAttackTile([3,3]), 'cant attack out of range');
  assert.ok(u.canAttackTile([3,2]), 'can attack in range');
  u._currentAttack = u.attacks[1];
  assert.ok(!u.canAttackTile([5,2]), 'cant attack out of range with attack 2');
  assert.ok(!u.canAttackTile([4,3]), 'cant attack out of range with attack 2');
  assert.ok(u.canAttackTile([4,2]), 'can attack in range with attack 2');
  assert.ok(u.canAttackTile([3,3]), 'can attack in range with attack 2');
});

QUnit.test('Unit#canMoveTo', function(assert) {
  var u = new Unit({ maxMoves: 2 }, [1,1]);
  assert.ok(u.canMoveTo([1,2]), 'can move to tile next to head');
  assert.ok(u.canMoveTo([2,1]), 'can move to tile next to head');
  assert.ok(u.canMoveTo([0,1]), 'can move to tile next to head');
  assert.ok(u.canMoveTo([1,0]), 'can move to tile next to head');
  assert.ok(!u.canMoveTo([1,1]), 'cant move to the tile youre on');
  assert.ok(!u.canMoveTo([2,2]), 'cant move to the tile diagonally');
  assert.ok(!u.canMoveTo([0,0]), 'cant move to the tile diagonally');
  assert.ok(!u.canMoveTo([1,3]), 'cant move to the tile 2 spaces away');
  u.movesMade = 2;
  assert.ok(!u.canMoveTo([1,2]), 'cant move once all moves are used up');
  u.movesMade = 0;
  u.attackMode = true;
  assert.ok(!u.canMoveTo([1,2]), 'cant move in attackMode');
  u.attackMode = false;
  assert.ok(u.canMoveTo([1,2]), 'make sure can still move when not in attackMode');
});

QUnit.test('Unit#moveTo', function(assert) {
  var u = new Unit({ maxMoves: 8, maxLength: 3 }, [1,1]);
  assert.strictEqual(1, u.health(), 'start at 1 health');
  u.moveTo([1,2]);

  assert.deepEqual([[1,2], [1,1]], u.tiles, 'expands correctly');
  assert.strictEqual(2, u.health(), 'health goes up');

  u.moveTo([1,1]);
  assert.strictEqual(2, u.health(), 'health doesnt go up when crossing over self');
  u.moveTo([1,0]);
  assert.strictEqual(3, u.health(), 'health hits max');
  u.moveTo([0,0]);
  assert.strictEqual(3, u.health(), 'health doesnt go beyond max');
  assert.deepEqual([[0,0], [1,0], [1,1]], u.tiles, 'expands correctly again');

});

QUnit.test('Unit#isOnTile', function(assert) {
  var u = new Unit({ tiles: [[0,0], [1,0], [1,1]] }, [0,0]);
  assert.ok(u.isOnTile([0,0]), 'unit is on this tile');
  assert.ok(u.isOnTile([1,0]), 'unit is on this tile');
  assert.ok(u.isOnTile([1,1]), 'unit is on this tile');
  assert.ok(!u.isOnTile([2,1]), 'unit is not on this tile');
  assert.ok(!u.isOnTile([1,2]), 'unit is not on this tile');
  assert.ok(!u.isOnTile([0,1]), 'unit is not on this tile');
});

QUnit.test('Unit#makeButtonsForAttacks', function(assert) {
  var u = new Unit({ attacks: [{ range: 1, damage: 1 }, { range: 2, damage: 3 }] }, [0,0]);
  assert.ok(!u._currentAttack, 'no attack selected yet');
  u.makeButtonsForAttacks()[0].onclick();
  assert.deepEqual(u._currentAttack, {range: 1, damage: 1}, 'first attack selected');
  u.makeButtonsForAttacks()[1].onclick();
  assert.deepEqual(u._currentAttack, {range: 2, damage: 3}, 'second attack selected');
});

QUnit.test('Unit.undoMove', function(assert) {
  var u = new Unit({ tiles: [[0,0], [1,0], [1,1]] }, [0,0]);
  u.restartTurn();
  u.tiles = [[3,3], [8,3], [8,8]];
  u.head = [3,3];
  assert.notDeepEqual(u.tiles, [[0,0], [1,0], [1,1]]);
  assert.notDeepEqual(u.head, [0,0]);
  u.undoMove();
  assert.deepEqual(u.tiles, [[0,0], [1,0], [1,1]]);
  assert.deepEqual(u.head, [0,0]);
});
