// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var p = document.querySelector('p');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;
var ballCount = 0;

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Object.defineProperty(Ball.prototype, 'constructor', {
  value: Ball,
  enumerable: false,
  writable: true
});

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}

Ball.prototype.collisionDetect = function() {
  for(var j = 0; j < balls.length; j++) {
    if(this !== balls[j]) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;

      var distance = Math.sqrt(dx*dx + dy*dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb('+ random(0,255) + ',' + random(0,255) + ',' + random(0,255) + ')';
      }
    }
  }
}

// EVIL CIRCLE
function EvilCircle(x, y, exists) {
  Shape.call(this, x, y, 20, 20, exists);
  this.color = 'white';
  this.size = 10;
}
EvilCircle.prototype = Object.create(Shape.prototype);
Object.defineProperty(EvilCircle.prototype, 'constructor', {
  value: EvilCircle,
  enumerable: false,
  writable: true
});
EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};
EvilCircle.prototype.setControls = function() {
  var _this = this;

  window.onkeydown = function(e) {  
    //console.log(e.keyCode);
    switch (e.keyCode) {
      case 38: // up arrow
        _this.y -= _this.velY;
        break;
      case 40: // down arrow
        _this.y += _this.velY;
        break;
      case 39: // right arrow
        _this.x += _this.velX;
        break;
      case 37: // left arrow
        _this.x -= _this.velX;
        break;
    }
  }
};
EvilCircle.prototype.checkBounds = function() {
  if((this.x + this.size) >= width) {
    this.x = width - this.size;
  }

  if((this.x - this.size) <= 0) {
    this.x = this.size;
  }

  if((this.y + this.size) >= height) {
    this.y = height - this.size;
  }

  if((this.y - this.size) <= 0) {
    this.y = this.size;
  }
};
EvilCircle.prototype.collisionDetect = function() {
  for(var j = 0; j < balls.length; j++) {
    if(balls[j].exists) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;

      var distance = Math.sqrt(dx*dx + dy*dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        ballCount--;
      }
    }
  }
};

var evilCircle = new EvilCircle(random(10, width - 10), random(10, height - 10), true);
evilCircle.setControls();

console.log(evilCircle);

var balls = [];

while (balls.length < 25) {
  var size = random(20,40);

  var ball = new Ball(random(0 + size, width - size), random(0 + size, height - size), random(-7,7), random(-7,7), true, 'rgb('+ random(0,255) + ',' + random(0,255) + ',' + random(0,255) + ')', size);

  ballCount++;

  balls.push(ball);
}

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(0, 0, width, height);
   
  for(var i = 0; i < balls.length; i++) {
    if(balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }
   
  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  p.textContent = `Ball count: ${ballCount}`;

  requestAnimationFrame(loop);
}

loop();