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
  var squares = [[0,0], [0,1], [0,2], [1,2]];
  var enemy = new Unit({ squares: squares }, squares[0]);
  assert.ok(!u.moveOver, 'turn in progress');
  assert.strictEqual(4, enemy.health(), 'enemy before attack');
  u.attack(enemy);
  assert.ok(u.moveOver, 'turn ends after attack');
  assert.strictEqual(2, enemy.health(), 'enemy takes damage');
});

QUnit.test('Unit#removeSquares', function(assert) {
  var squares = [[1,2], [0,2], [0,1], [0,0]];
  var u = new Unit({ squares: squares }, squares[0]);

  assert.strictEqual(4, u.health(), 'health full at first');
  u.removeSquares(0);
  assert.strictEqual(4, u.health(), 'removing 0 does nothing');
  u.removeSquares(-2);
  assert.strictEqual(4, u.health(), 'removing -2 does nothing');

  u.removeSquares(2);
  assert.strictEqual(2, u.health(), 'removing 2 actually works');
  assert.deepEqual([[1,2], [0,2]], u.squares, 'removes squares farther from head');
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
  var squares = [[1,2], [2,2]];
  var u = new Unit({ attacks: atks, squares: squares }, [2,2]);
  var enemy = new Unit({squares: [[2,4], [2,3]]}, [2,3]);
  u.attackMode = true;
  assert.ok(u.canAttack(enemy, [2,3]), 'can attack enemy in range');
  assert.ok(!u.canAttack(enemy, [3,2]), 'cant attack, enemy not there');
  assert.ok(!u.canAttack(enemy, [2,4]), 'cant attack, not in range');
});

QUnit.test('Unit#canAttackSquare', function(assert) {
  var atks = [{ name: 'test', damage: 1, range: 1}, { name: 'test2', damage: 1, range: 2}];
  var squares = [[1,2], [2,2]];
  var u = new Unit({ attacks: atks, squares: squares }, [2,2]);
  u.attackMode = true;
  assert.ok(!u.canAttackSquare([1,2]), 'cant attack self');
  assert.ok(!u.canAttackSquare([4,2]), 'cant attack out of range');
  assert.ok(!u.canAttackSquare([3,3]), 'cant attack out of range');
  assert.ok(u.canAttackSquare([3,2]), 'can attack in range');
  u._currentAttack = u.attacks[1];
  assert.ok(!u.canAttackSquare([5,2]), 'cant attack out of range with attack 2');
  assert.ok(!u.canAttackSquare([4,3]), 'cant attack out of range with attack 2');
  assert.ok(u.canAttackSquare([4,2]), 'can attack in range with attack 2');
  assert.ok(u.canAttackSquare([3,3]), 'can attack in range with attack 2');
});

QUnit.test('Unit#canMoveTo', function(assert) {
  var u = new Unit({ maxMoves: 2 }, [1,1]);
  assert.ok(u.canMoveTo([1,2]), 'can move to square next to head');
  assert.ok(u.canMoveTo([2,1]), 'can move to square next to head');
  assert.ok(u.canMoveTo([0,1]), 'can move to square next to head');
  assert.ok(u.canMoveTo([1,0]), 'can move to square next to head');
  assert.ok(!u.canMoveTo([1,1]), 'cant move to the square youre on');
  assert.ok(!u.canMoveTo([2,2]), 'cant move to the square diagonally');
  assert.ok(!u.canMoveTo([0,0]), 'cant move to the square diagonally');
  assert.ok(!u.canMoveTo([1,3]), 'cant move to the square 2 spaces away');
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

  assert.deepEqual([[1,2], [1,1]], u.squares, 'expands correctly');
  assert.strictEqual(2, u.health(), 'health goes up');

  u.moveTo([1,1]);
  assert.strictEqual(2, u.health(), 'health doesnt go up when crossing over self');
  u.moveTo([1,0]);
  assert.strictEqual(3, u.health(), 'health hits max');
  u.moveTo([0,0]);
  assert.strictEqual(3, u.health(), 'health doesnt go beyond max');
  assert.deepEqual([[0,0], [1,0], [1,1]], u.squares, 'expands correctly again');

});

QUnit.test('Unit#isOnSquare', function(assert) {
  var u = new Unit({ squares: [[0,0], [1,0], [1,1]] }, [0,0]);
  assert.ok(u.isOnSquare([0,0]), 'unit is on this square');
  assert.ok(u.isOnSquare([1,0]), 'unit is on this square');
  assert.ok(u.isOnSquare([1,1]), 'unit is on this square');
  assert.ok(!u.isOnSquare([2,1]), 'unit is not on this square');
  assert.ok(!u.isOnSquare([1,2]), 'unit is not on this square');
  assert.ok(!u.isOnSquare([0,1]), 'unit is not on this square');
});

QUnit.test('Unit#makeButtonsForAttacks', function(assert) {
  var u = new Unit({ attacks: [{ range: 1, damage: 1 }, { range: 2, damage: 3 }] }, [0,0]);
  assert.ok(!u._currentAttack, 'no attack selected yet');
  u.makeButtonsForAttacks()[0].press();
  assert.deepEqual(u._currentAttack, {range: 1, damage: 1}, 'first attack selected');
  u.makeButtonsForAttacks()[1].press();
  assert.deepEqual(u._currentAttack, {range: 2, damage: 3}, 'second attack selected');
});
