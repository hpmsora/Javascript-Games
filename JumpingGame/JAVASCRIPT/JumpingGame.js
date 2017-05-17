var gamePiece;
var gameObstacle = [];
var gameScore;

function startGame() {
  gamePiece = new component(30, 30, "red", 10, 120);
  gamePiece.gravity = 0.05;
  gameScore = new component("30px", "consolas", "black", 280, 40, "text");
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
    window.addEventListener('keydown', function(e) {
      gameArea.key = e.keyCode;
    })
    window.addEventListener('keyup', function(e) {
      gameArea.key = false;
    })
    updateGameArea();
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
    clearInterval(this.interval);
  }
}

function component(width, height, color, x, y, type) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.gravity = 0;
  this.gravitySpeed = 0;
  this.update = function() {
    ctx = gameArea.context;
    if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  this.newPos = function() {
    this.gravitySpeed += this.gravity;
    this.y += this.speedY + this.gravitySpeed;
    this.hitBottom();
  }
  this.hitBottom = function() {
    var realBottom = gameArea.canvas.height - this.height;
    if(this.y > realBottom) {
      this.y = realBottom;
      this.gravitySpeed = 0;
    }
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
  var x;
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
    minHeight = 20;
    maxHeight = 150;
    height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    minGap = 50;
    maxGap = 100;
    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    gameObstacle.push(new component(10, height, "green", x, 0));
    gameObstacle.push(new component(10, x - height - gap, "green", x, height + gap));
  }

  for(i = 0; i < gameObstacle.length; i += 1) {
    gameObstacle[i].x += -1;
    gameObstacle[i].update();
  }
  if(gameArea.key && gameArea.key == 32) {
    accelerate(-0.2);
    console.log("ss");
  } else {
    accelerate(0.5);
  }
  gamePiece.newPos();
  gamePiece.update();
  gameScore.text = "Score: " + gameArea.frameNo;
  gameScore.update();
}

function everyInterval(n) {
  if((gameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}

function accelerate(n) {
  if(!gameArea.interval) {
    gameArea.interval = setInterval(updateGameArea, 20);
  }
  gamePiece.gravity = n;
}