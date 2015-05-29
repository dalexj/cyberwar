
function Unit(options, loc) {
  this.maxMoves = options.maxMoves;
  this.maxLength = options.maxLength;
  this.movesMade = 0;
  this.head = loc;
  this.squares = options.squares || [loc];
  this.attackMode = false;
  this.attacks = options.attacks;
  this.moveOver = false;
}

Unit.prototype.movesRemaining = function() {
  return this.maxMoves - this.movesMade;
};

Unit.prototype.currentAttack = function() {
  return this._currentAttack || this.attacks[0];
};

Unit.prototype.attack = function(enemy) {
  this.attackMode = false;
  this.moveOver = true;
  enemy.removeSquares(this.currentAttack().damage);
};

Unit.prototype.health = function() {
  return this.squares.length;
};

Unit.prototype.removeSquares = function(amount) {
  if(amount <= 0) return;
  this.squares = this.squares.slice(0, -amount);
};

Unit.prototype.restartTurn = function() {
  this.movesMade = 0;
  this.attackMode = false;
  this.moveOver = false;
  this._currentAttack = null;
};

Unit.prototype.canAttack = function(enemy, loc) {
  return this.canAttackSquare(loc) && enemy.isOnSquare(loc);
};

Unit.prototype.canAttackSquare = function(loc) {
  return this.attackMode && squareDist(this.head, loc) <= this.currentAttack().range && !this.isOnSquare(loc);
};

Unit.prototype.canMoveTo = function(loc) {
  return !this.attackMode && this.movesRemaining() > 0 && squareNextTo(loc, this.head);
};

Unit.prototype.moveTo = function(loc) {
  this.movesMade++;
  this.head = loc;
  if(!isInArray(this.squares, loc)) {
    this.squares.unshift(loc);
  }
  if(this.movesRemaining() <= 0) {
    this.attackMode = true;
  }
  this.removeSquares(this.squares.length - this.maxLength);
};

Unit.prototype.isOnSquare = function(loc) {
  return isInArray(this.squares, loc);
};

Unit.prototype.makeButtonsForAttacks = function() {
  unit = this;
  return this.attacks.map(function(attack) {
    return {
      press: function() {
        unit.attackMode = true;
        unit._currentAttack = attack;
      },
      text: attack.name
    };
  });
};

var player = new Unit({
  maxLength: 3,
  maxMoves: 4,
  attacks: [
    { name: 'attack1', range: 2, damage: 2 },
    { name: 'attack2', range: 1, damage: 3 }
  ]
}, [2, 2]);
var player2 = new Unit({
  maxLength: 2,
  maxMoves: 6,
  attacks: [
    { name: 'attack1', range: 2, damage: 2 },
    { name: 'attack2', range: 1, damage: 3 }
  ]
}, [2, 8]);

var playerQ = {
  units: [player, player2],
  nextUnit: function() {
    for (var i = 0; i < this.units.length; i++) {
      if(!this.units[i].moveOver) return this.units[i];
    }
  },
  selectedUnit: function() {
    return this._selectedUnit || this.nextUnit();
  }
};

var buttons = player.makeButtonsForAttacks();

var enemy = new Unit({
  maxLength: 3,
  maxMoves: 4,
  squares: [[3, 4], [4, 4], [5, 4]],
  attacks: [
    { name: 'attack', range: 2, damage: 2 }
  ]
}, [3, 4]);

var board = { squares: [] };

var color1 = 'rgb(100,200,100)';
var color2 = 'rgb(200,100,200)';
var color3 = 'rgb(0,100,100)';
var color4 = 'rgb(255,255,60)';
var color5 = 'rgb(255,0,0)';
var color6 = 'rgb(255,130,0)';

var color7 = 'rgb(200,200,200)';
var white = 'rgb(255,255,255)';

var offset = 130;
var size = 30;
var space = 4;

document.addEventListener("DOMContentLoaded", function(event) {
  'use strict';
  var canvas = document.getElementById('game-canvas');
  canvas.width = '650';
  canvas.height = '488';
  var ctx = canvas.getContext('2d');

  var xMany = Math.floor((canvas.width - space - offset) / (size + space));
  var yMany = Math.floor((canvas.height - space) / (size + space));

  for (var i = 0; i < xMany; i++) {
    for (var j = 0; j < yMany; j++) {
      var x = space + i*(size + space);
      var y = space + j*(size + space);
      board.squares.push({ x: x + offset, y: y, size: size, loc: [i, j] });
    }
  }
  drawOnCanvas(ctx);


  canvas.addEventListener('click', function(e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;

    var clickedSquare = null;
    var clickedButton = null;
    for (var i = 0; i < board.squares.length; i++) {
      var square = board.squares[i];
      if(square.x < x && square.x + square.size > x && square.y < y && square.y + square.size > y) {
        clickedSquare = square;
        break;
      }
    }
    if(!clickedSquare) {
      for (var j = 0; j < buttons.length; j++) {
        if(10 < x && offset-10 > x && 100 + (35 * j) < y && 130 + (35 * j) > y) {
          clickedButton = buttons[j];
          break;
        }
      }
    }
    if(clickedSquare && playerQ.selectedUnit().canAttack(enemy, clickedSquare.loc)) {
      playerQ.selectedUnit().attack(enemy);
    } else if(clickedSquare && playerQ.selectedUnit().canMoveTo(clickedSquare.loc)) {
      playerQ.selectedUnit().moveTo(clickedSquare.loc);
    } else if(clickedButton) {
      clickedButton.press();
    }
    drawOnCanvas(ctx);
  }, false);
});

function squareNextTo(a, b) {
  return squareDist(a, b) === 1;
}

function drawOnCanvas(ctx) {
  clearCanvas(ctx);
  board.squares.forEach(function(square) {
    ctx.fillStyle = color1;
    var changed = false;
    for (var i = 0; i < playerQ.units.length; i++) {
      if(changed) break;
      changed = true;
      if(arrayEqual(playerQ.units[i].head, square.loc)) {
        ctx.fillStyle = color3;
      } else if(isInArray(playerQ.units[i].squares, square.loc)) {
        ctx.fillStyle = color2;
      } else if(isInArray(enemy.squares, square.loc)) {
        ctx.fillStyle = color6;
      } else {
        changed = false;
      }
    }
    if(!changed && !playerQ.selectedUnit().attackMode && squareDist(square.loc, playerQ.selectedUnit().head) <= playerQ.selectedUnit().movesRemaining()) {
      ctx.fillStyle = color4;
    }
    ctx.fillRect(square.x, square.y, square.size, square.size);
    if(playerQ.selectedUnit().canAttackSquare(square.loc)) {
      ctx.fillStyle = color5;
      ctx.textAlign = 'center';
      ctx.font = '' + size + 'px monospace';
      ctx.fillText('X', square.x + size/2, square.y + size );
    }
  });
  ctx.fillStyle = color7;
  ctx.fillRect(10, 5, offset - 20, ctx.canvas.height - 20);
  buttons.forEach(function(button, index) {
    ctx.fillStyle = color6;
    ctx.fillRect(10, 100 + (35 * index), offset - 20, 30);
    ctx.fillStyle = white;
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(button.text, 10 + (offset / 2), 125 + (35*index));
  });
}

function isInArray(arr, val) {
  if(!arr) return false;
  for (var i = 0; i < arr.length; i++) {
    if(arrayEqual(arr[i], val)) return true;
  }
  return false;
}

function arrayEqual(arr1, arr2) {
  if(!arr1 || !arr2 || arr1.length !== arr2.length) return false;
  for (var i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

function squareDist(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function clearCanvas(ctx) {
  ctx.clearRect (0, 0, ctx.canvas.width, ctx.canvas.height);
}
