describe('Unit', function() {
  it('#movesRemaining', function(assert) {
    var u = new Unit({ maxMoves: 9 });
    u.movesMade += 6;
    expect(u.movesRemaining()).toBe(3);
  });

  it('#currentAttack', function(assert) {
    var u = new Unit({attacks: ['attack1', 'attack2']});
    expect(u.currentAttack()).toBe('attack1');
    u._currentAttack = 'attack2';
    expect(u.currentAttack()).toBe('attack2');
  });

  it('#attack', function(assert) {
    var u = new Unit({ attacks: [{ damage: 2 }] });
    var tiles = [[0,0], [0,1], [0,2], [1,2]];
    var enemy = new Unit({ tiles: tiles }, tiles[0]);
    expect(u.moveOver).toBe(false);
    expect(u.health()).toBe(4);
    u.attack(enemy);
    expect(u.moveOver).toBe(true);
    expect(u.health()).toBe(2);
  });

  it('#removeTiles', function(assert) {
    var tiles = [[1,2], [0,2], [0,1], [0,0]];
    var u = new Unit({ tiles: tiles }, tiles[0]);

    expect(u.health()).toBe(4);
    u.removeTiles(0);
    expect(u.health()).toBe(4);
    u.removeTiles(-2);
    expect(u.health()).toBe(4);

    u.removeTiles(2);
    expect(u.health()).toBe(2);
    expect(u.tiles).toBe([[1,2], [0,2]]);
  });

  it('#restartTurn', function(assert) {
    var u = new Unit({});
    u.moveOver = true;
    u._currentAttack = '123';
    u.attackMode = true;
    u.movesMade = 9;
    expect(u.moveOver && u._currentAttack && u.attackMode && u.movesMade !== 0).toBe(true);
    u.restartTurn();
    expect(u.moveOver).toBe(false);
    expect(u._currentAttack).toBe(undefined);
    expect(u.attackMode).toBe(false);
    expect(u.movesMade).toBe(0);
  });

  it('#canAttack', function(assert) {
    var atks = [{ name: 'test', damage: 1, range: 1}];
    var tiles = [[1,2], [2,2]];
    var u = new Unit({ attacks: atks, tiles: tiles }, [2,2]);
    var enemy = new Unit({tiles: [[2,4], [2,3]]}, [2,3]);
    u.attackMode = true;
    expect(u.canAttack(enemy, [2,3])).toBe(true);
    expect(u.canAttack(enemy, [3,2])).toBe(false);
    expect(u.canAttack(enemy, [2,4])).toBe(false);
  });

  it('#canAttackTile', function(assert) {
    var atks = [{ name: 'test', damage: 1, range: 1}, { name: 'test2', damage: 1, range: 2}];
    var tiles = [[1,2], [2,2]];
    var u = new Unit({ attacks: atks, tiles: tiles }, [2,2]);
    u.attackMode = true;
    expect(u.canAttackTile([1,2])).toBe(false);
    expect(u.canAttackTile([4,2])).toBe(false);
    expect(u.canAttackTile([3,3])).toBe(false);
    expect(u.canAttackTile([3,2])).toBe(true);
    u._currentAttack = u.attacks[1];
    expect(u.canAttackTile([5,2])).toBe(false);
    expect(u.canAttackTile([4,3])).toBe(false);
    expect(u.canAttackTile([4,2])).toBe(true);
    expect(u.canAttackTile([3,3])).toBe(true);
  });

  it('#canMoveTo', function(assert) {
    var u = new Unit({ maxMoves: 2 }, [1,1]);
    expect(u.canMoveTo([1,2])).toBe(true);
    expect(u.canMoveTo([2,1])).toBe(true);
    expect(u.canMoveTo([0,1])).toBe(true);
    expect(u.canMoveTo([1,0])).toBe(true);
    expect(u.canMoveTo([1,1])).toBe(false);
    expect(u.canMoveTo([2,2])).toBe(false);
    expect(u.canMoveTo([0,0])).toBe(false);
    expect(u.canMoveTo([1,3])).toBe(false);
    u.movesMade = 2;
    expect(u.canMoveTo([1,2])).toBe(false);
    u.movesMade = 0;
    u.attackMode = true;
    expect(u.canMoveTo([1,2])).toBe(false);
    u.attackMode = false;
    expect(u.canMoveTo([1,2])).toBe(true);
  });

  it('#moveTo', function(assert) {
    var u = new Unit({ maxMoves: 8, maxLength: 3 }, [1,1]);
    expect(u.health()).toBe(1);
    u.moveTo([1,2]);

    expect(u.tiles).toBe([[1,2], [1,1]]);
    expect(u.health()).toBe(2);

    u.moveTo([1,1]);
    expect(u.health()).toBe(2);
    u.moveTo([1,0]);
    expect(u.health()).toBe(3);
    u.moveTo([0,0]);
    expect(u.health()).toBe(3);
    expect(u.tiles).toBe([[0,0], [1,0], [1,1]]);
  });

  it('#isOnTile', function(assert) {
    var u = new Unit({ tiles: [[0,0], [1,0], [1,1]] }, [0,0]);
    expect(u.isOnTile([0,0])).toBe(true);
    expect(u.isOnTile([1,0])).toBe(true);
    expect(u.isOnTile([1,1])).toBe(true);
    expect(u.isOnTile([2,1])).toBe(false);
    expect(u.isOnTile([1,2])).toBe(false);
    expect(u.isOnTile([0,1])).toBe(false);
  });

  it('#makeButtonsForAttacks', function(assert) {
    var u = new Unit({ attacks: [{ range: 1, damage: 1 }, { range: 2, damage: 3 }] }, [0,0]);
    expect(u._currentAttack).toBe(undefined);
    u.makeButtonsForAttacks()[0].onclick();
    expect(u._currentAttack).toBe({range: 1, damage: 1});
    u.makeButtonsForAttacks()[1].onclick();
    expect(u._currentAttack).toBe({range: 2, damage: 3});
  });

  it('#undoMove', function(assert) {
    var u = new Unit({ tiles: [[0,0], [1,0], [1,1]] }, [0,0]);
    u.restartTurn();
    u.tiles = [[3,3], [8,3], [8,8]];
    u.head = [3,3];
    expect(u.tiles).toNotEqual([[0,0], [1,0], [1,1]]);
    expect(u.head).toNotEqual([0,0]);
    u.undoMove();
    expect(u.tiles).toBe([[0,0], [1,0], [1,1]]);
    expect(u.head).toBe([0,0]);
  });

});
