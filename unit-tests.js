QUnit.test('Unit#movesRemaining', function(assert) {
  var u = new Unit({ maxMoves: 9 });
  u.movesMade += 6;
  assert.equal(3, u.movesRemaining());
});

QUnit.test('Unit#currentAttack', function(assert) {
  var u = new Unit({attacks: ['attack1', 'attack2']});
  assert.equal('attack1', u.currentAttack());
  u._currentAttack = 'attack2';
  assert.equal('attack2', u.currentAttack());
});

QUnit.test('Unit#attack', function(assert) {
  var u = new Unit({ attacks: [{ damage: 2 }] });
  var squares = [[0,0], [0,1], [0,2], [1,2]];
  var enemy = new Unit({ squares: squares }, squares[0]);
  assert.notOk(u.moveOver);
  assert.equal(4, enemy.health());
  u.attack(enemy);
  assert.ok(u.moveOver);
  assert.equal(2, enemy.health());
});

QUnit.test('Unit#removeSquares', function(assert) {
  var squares = [[1,2], [0,2], [0,1], [0,0]];
  var u = new Unit({ squares: squares }, squares[0]);

  assert.equal(4, u.health());
  u.removeSquares(0);
  assert.equal(4, u.health());
  u.removeSquares(-2);
  assert.equal(4, u.health());

  u.removeSquares(2);
  assert.equal(2, u.health());
  assert.deepEqual([[1,2], [0,2]], u.squares);
});

QUnit.test('Unit#restartTurn', function(assert) {
  var u = new Unit({});
  u.moveOver = true;
  u._currentAttack = '123';
  u.attackMode = true;
  u.movesMade = 9;
  u.restartTurn();
  assert.ok(!u.moveOver);
  assert.ok(!u._currentAttack);
  assert.ok(!u.attackMode);
  assert.equal(0, u.movesMade);
});

QUnit.test('Unit#canAttack', function(assert) {
  assert.ok(true);
});

QUnit.test('Unit#canAttackSquare', function(assert) {
  var atks = [{ name: 'test', damage: 1, range: 1}, { name: 'test2', damage: 1, range: 2}];
  var squares = [[1,2], [2,2]];
  var u = new Unit({ attacks: atks, squares: squares }, [2,2]);
  u.attackMode = true;
  assert.ok(!u.canAttackSquare([1,2])); // cant attack self
  assert.ok(!u.canAttackSquare([4,2])); // cant attack out of range
  assert.ok(!u.canAttackSquare([3,3])); // cant attack out of range
  assert.ok(u.canAttackSquare([3,2])); // can attack in range
  u._currentAttack = u.attacks[1];
  assert.ok(!u.canAttackSquare([5,2])); // cant attack out of range
  assert.ok(!u.canAttackSquare([4,3])); // cant attack out of range
  assert.ok(u.canAttackSquare([4,2])); // can attack in range
  assert.ok(u.canAttackSquare([3,3])); // can attack in range
});

QUnit.test('Unit#canMoveTo', function(assert) {
  assert.ok(true);
});

QUnit.test('Unit#moveTo', function(assert) {
  assert.ok(true);
});

QUnit.test('Unit#isOnSquare', function(assert) {
  assert.ok(true);
});

QUnit.test('Unit#makeButtonsForAttacks', function(assert) {
  assert.ok(true);
});