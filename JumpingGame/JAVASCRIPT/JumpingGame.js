var gamePiece;
var gameObstacle = [];

function startGame() {
  gamePiece = new component(30, 30, "red", 10, 120);
  gameArea.start();
}

var gameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = $(document).width();
    this.canvas.height = 200;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener('keydown', function(e) {
      gameArea.key = e.keyCode;
    })
    window.addEventListener('keyup', function(e) {
      gameArea.key = false;
    })
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
    clearInterval(this.interval);
  }
}

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function() {
    ctx = gameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  this.newPos = function() {
    this.y += this.speedY;
  }
  this.crashWith = function(otherobj) {
    var pieceLeft = this.x;
    var pieceRight = this.x + this.width;
    var pieceTop = this.y;
    var pieceBottom = this.y + this.height;
    var otherLeft = otherobj.x;
    var otherRight = otherobj.x + otherobj.width;
    var otherTop = otherobj.y;
    var otherBottom = otherobj.y + otherobj.height;
    var crash = true;

    if(pieceBottom < otherTop || pieceTop > otherBottom || pieceRight < otherLeft || pieceLeft > otherRight) {
      crash = false;
    }
    return crash;
  }
}

function updateGameArea() {
  var x, y;
  for(i = 0; i < gameObstacle.length; i += 1) {
    if(gamePiece.crashWith(gameObstacle[i])) {
      gameArea.stop();
      return;
    }
  }
  gameArea.clear();
  gameArea.frameNo += 1;
  if(gameArea.frameNo == 1 || everyInterval(150)) {
    x = gameArea.canvas.width;
    y = gameArea.canvas.height - 200;
    gameObstacle.push(new component(10, 200, "green", x, y));
  }
  for(i = 0; i < gameObstacle.length; i += 1) {
    gameObstacle[i].x += -1;
    gameObstacle[i].update();
  }
  gamePiece.speedY = 0;
  if(gameArea.key && gameArea.key == 32) {gamePiece.speedY = -1;}
  gamePiece.newPos();
  gamePiece.update();
}

function everyInterval(n) {
  if((gameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}