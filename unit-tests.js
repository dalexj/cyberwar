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
  assert.ok(true);
});

QUnit.test('Unit#restartTurn', function(assert) {
  assert.ok(true);
});

QUnit.test('Unit#canAttack', function(assert) {
  assert.ok(true);
});

QUnit.test('Unit#canAttackSquare', function(assert) {
  assert.ok(true);
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
