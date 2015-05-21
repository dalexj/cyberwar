var squaresOnBoard = [];

var color1 = 'rgb(100,0,100)';
var color2 = 'rgb(100,200,100)';

document.addEventListener("DOMContentLoaded", function(event) {
  'use strict';
  var canvas = document.getElementById('game-canvas');
  var ctx = canvas.getContext('2d');

  var size = 48;
  var space = 10;
  var xMany = Math.floor((canvas.width - space) / (size + space));
  var yMany = Math.floor((canvas.height - space) / (size + space));

  console.log(xMany);
  console.log(yMany);

  ctx.fillStyle = color1;
  for (var i = 0; i < xMany; i++) {
    for (var j = 0; j < yMany; j++) {
      var x = space + i*(size + space);
      var y = space + j*(size + space);
      ctx.fillRect(x, y, size, size);
      squaresOnBoard.push({ x: x, y: y, size: size });
    }
  }
  canvas.addEventListener('click', function(e) {
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;
    squaresOnBoard.forEach(function(square) {
      if(square.x < x && square.x + square.size > x && square.y < y && square.y + square.size > y) {
        ctx.fillStyle = color2;
      } else {
        ctx.fillStyle = color1;
      }
      ctx.fillRect(square.x, square.y, square.size, square.size);
    });
    console.log('x: ', x);
    console.log('y: ', y);
  }, false);
});
