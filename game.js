var squaresOnBoard = [];
var player = {
  squares: [[2, 2]],
  head: [2, 2],
  maxLength: 3
};

var color1 = 'rgb(100,200,100)';
var color2 = 'rgb(200,100,200)';
var color3 = 'rgb(0,100,100)';

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
      squaresOnBoard.push({ drawX: x, drawY: y, size: size, x: i, y: j });
    }
  }
  drawOnCanvas(ctx);
  canvas.addEventListener('click', function(e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;

    var clickedSquare = null;
    for (var i = 0; i < squaresOnBoard.length; i++) {
      var square = squaresOnBoard[i];
      if(square.drawX < x && square.drawX + square.size > x && square.drawY < y && square.drawY + square.size > y) {
        clickedSquare = square;
        break;
      }
    }
    if(clickedSquare && squareNextTo([clickedSquare.x, clickedSquare.y], player.head)) {
      console.log('hi');
      var a = [clickedSquare.x, clickedSquare.y];
      player.head = a;
      player.squares.unshift(a);
      player.squares = player.squares.slice(0, player.maxLength);
    }
    drawOnCanvas(ctx);
    // console.log({ x: x, y: y});
  }, false);
});

function squareNextTo(a, b) {
  return Math.abs(Math.abs(a[0] - b[0]) - Math.abs(a[1] - b[1])) === 1;
}

function drawOnCanvas(ctx) {
  squaresOnBoard.forEach(function(square) {
    if(arrayEqual(player.head, [square.x, square.y])) {
      ctx.fillStyle = color3;
    } else if(isInArray(player.squares, [square.x, square.y])) {
      ctx.fillStyle = color2;
    } else {
      ctx.fillStyle = color1;
    }
    ctx.fillRect(square.drawX, square.drawY, square.size, square.size);
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
