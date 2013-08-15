// Snake game ver 1.0

(function(){
  
  var Game = { };
  Game.fps = 50;

  // Get canvas and context
  var canvas = document.getElementById("gameField");
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Game constants
  var GAME_WIDTH = canvas.width;
  var GAME_HEIGHT = canvas.height;
  var CELL_SIZE = 10;


  // Helpers
  
  function getRandomInteger(min, max) {
    return Math.floor(Math.random() * ( max - min + 1)) + min;
  }

  function getRandomPoint() {
    return new Point(getRandomInteger(0, GAME_WIDTH), getRandomInteger(0, GAME_HEIGHT));
  }


  /* Game objects */
  
  // Point

  function Point(x, y) {
    this.x = x;
    this.y = y;

    this.toString = function() {
      return "[x: " + this.x + " y:" + this.y+ "]";
    }
  }
  
  // Snake

  function Snake(length, headPosition) {
    this.length = length;
    this.headPosition = headPosition;
    this.body = [];
    this.moveDirection = "";

    for(var i = 0; i < 5; i++) {
      this.body.push(new Point((this.headPosition.x - (i * CELL_SIZE)), this.headPosition.y));
    }
  }
    
  Snake.prototype.head = function() {
    return this.body[0];
  }
  
  Snake.prototype.tail = function() {
    return this.body[length - 1];
  }

  Snake.prototype.eat = function() { // dummy
      this.length = this.body.push(new Point((this.tail().x - (CELL_SIZE)), this.tail().y));
  }
  
  Snake.prototype.move = function(point) { // dummy
    this.body.forEach(function(elem) {
      elem.x += point.x;
      elem.y += point.y;
    });
  }
    
  Snake.prototype.draw = function() {
    this.body.forEach(function(elem) {
      ctx.beginPath();
      ctx.rect(elem.x, elem.y, CELL_SIZE, CELL_SIZE);
      ctx.fillStyle = "yellow";
      ctx.fill();  
      ctx.lineWitdh=1;
      ctx.strokeStyle="black";
      ctx.stroke();
    });
  }

  // Food 

  function Food(position) {
    this.position = position;
  }

  Food.prototype.draw = function() {
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, CELL_SIZE, CELL_SIZE);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.lineWitdh=1;
    ctx.strokeStyle="green";
    ctx.stroke();
  }

  /*      */





  // Main loop
  
  var food = new Food(getRandomPoint());
  food.draw();
  

  var snake = new Snake(5, getRandomPoint());

  var loop  = function() {
    snake.draw();
  }

  
  var key;
  
  
  document.onkeydown = function() {
     switch(window.event.keyCode) {
      case 32 :
        snake.eat();
        break;
      case 37:
        snake.move(new Point(-CELL_SIZE, 0));
        break;
      case 38 :
        snake.move(new Point(0, -CELL_SIZE));
        break;
      case 39 :
        snake.move(new Point(CELL_SIZE, 0));
        break;
      case 40 :
        snake.move(new Point(0, CELL_SIZE));
        break;
    }
  }

  Game.update = function() { loop(); }
  Game.draw = function() { }


  Game.run = function() {
    Game.update();
    Game.draw();
  };
  
  
  Game._intervalId = setInterval(Game.run, 1000 / Game.fps);


  // End of main loop
  

})();