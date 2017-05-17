var gamePiece;

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
}

function updateGameArea() {
  gameArea.clear();
  gamePiece.speedY = 0;
  if(gameArea.key && gameArea.key == 32) {gamePiece.speedY = -1;}
  gamePiece.newPos();
  gamePiece.update();
}