var squaresOnBoard = [];
var player = {
  squares: [[2, 2]],
  head: [2, 2],
  maxLength: 3,
  maxMoves: 4,
  movesMade: 0,
  movesRemaining: function() {
    return this.maxMoves - this.movesMade;
  },
  attack: {
    range: 2,
    damage: 2
  }
};

var attackMode = false;

var enemy = {
  squares: [[3, 4], [4, 4], [5, 4]],
  head: [3, 4],
  maxLength: 3,
  maxMoves: 4,
  movesMade: 0,
  movesRemaining: function() {
    return this.maxMoves - this.movesMade;
  },
  attack: {
    range: 2,
    damage: 2
  }
};

var color1 = 'rgb(100,200,100)';
var color2 = 'rgb(200,100,200)';
var color3 = 'rgb(0,100,100)';
var color4 = 'rgb(255,255,60)';
var color5 = 'rgb(255,0,0)';
var color6 = 'rgb(255,130,0)';

document.addEventListener("DOMContentLoaded", function(event) {
  'use strict';
  var canvas = document.getElementById('game-canvas');
  var ctx = canvas.getContext('2d');

  var size = 48;
  var space = 10;
  var xMany = Math.floor((canvas.width - space) / (size + space));
  var yMany = Math.floor((canvas.height - space) / (size + space));

  // console.log(xMany, yMany);

  for (var i = 0; i < xMany; i++) {
    for (var j = 0; j < yMany; j++) {
      var x = space + i*(size + space);
      var y = space + j*(size + space);
      squaresOnBoard.push({ x: x, y: y, size: size, loc: [i, j] });
    }
  }
  drawOnCanvas(ctx);
  canvas.addEventListener('click', function(e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;

    var clickedSquare = null;
    for (var i = 0; i < squaresOnBoard.length; i++) {
      var square = squaresOnBoard[i];
      if(square.x < x && square.x + square.size > x && square.y < y && square.y + square.size > y) {
        clickedSquare = square;
        break;
      }
    }
    if(clickedSquare && attackMode && squareDist(player.head, clickedSquare.loc) <= player.attack.range && isInArray(enemy.squares, clickedSquare.loc)) {
      enemy.squares = enemy.squares.slice(0, -player.attack.damage);
    } else if(clickedSquare && player.movesRemaining() > 0 && squareNextTo(clickedSquare.loc, player.head)) {
      player.head = clickedSquare.loc;
      player.squares.unshift(clickedSquare.loc);
      player.squares = player.squares.slice(0, player.maxLength);
      player.movesMade++;
      if(player.movesRemaining() === 0) {
        attackMode = true;
      }
    }
    drawOnCanvas(ctx);
    // console.log({ x: x, y: y});
  }, false);
});

function squareNextTo(a, b) {
  return squareDist(a, b) === 1;
}

function drawOnCanvas(ctx) {
  clearCanvas(ctx);
  squaresOnBoard.forEach(function(square) {
    if(arrayEqual(player.head, square.loc)) {
      ctx.fillStyle = color3;
    } else if(isInArray(player.squares, square.loc)) {
      ctx.fillStyle = color2;
    } else if(isInArray(enemy.squares, square.loc)) {
      ctx.fillStyle = color6;
    } else if(squareDist(square.loc, player.head) <= player.movesRemaining()) {
      ctx.fillStyle = color4;
    } else {
      ctx.fillStyle = color1;
    }
    ctx.fillRect(square.x, square.y, square.size, square.size);
    if(attackMode && squareDist(square.loc, player.head) <= player.attack.range && !isInArray(player.squares, square.loc)) {
      ctx.fillStyle = color5;
      ctx.font = '' + 48 + 'px monospaced';
      ctx.fillText('X', square.x, square.y + 48);
    }
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
