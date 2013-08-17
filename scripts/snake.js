// SNAKE game 

  var SNAKE = SNAKE || { };
  
  // Get canvas and context
  SNAKE.canvas = document.getElementById("gameField");
  SNAKE.ctx = SNAKE.canvas.getContext('2d');

  // Game constants
  SNAKE.GAME_WIDTH = SNAKE.canvas.width;
  SNAKE.GAME_HEIGHT = SNAKE.canvas.height;
  SNAKE.CELL_SIZE = 25;

  // Helpers
  
  SNAKE.helpers = { };

  SNAKE.helpers.getRandomInteger = function(min, max) {
    return Math.floor(Math.random() * ( max - min + 1)) + min;
  };

  SNAKE.helpers.getRandomPoint = function() {
    var x = SNAKE.helpers.getRandomInteger(0, (SNAKE.GAME_WIDTH - SNAKE.CELL_SIZE) / SNAKE.CELL_SIZE);
    var y = SNAKE.helpers.getRandomInteger(0, (SNAKE.GAME_HEIGHT - SNAKE.CELL_SIZE) / SNAKE.CELL_SIZE);
    return new SNAKE.point(x, y);
  };
  
  SNAKE.helpers.drawSquare = function(fillColor, borderColor, position, size) {
    SNAKE.ctx.beginPath();
    SNAKE.ctx.rect(position.x * size, position.y * size, size, size);
    SNAKE.ctx.fillStyle = fillColor;
    SNAKE.ctx.fill();  
    SNAKE.ctx.lineWitdh = 1;
    SNAKE.ctx.strokeStyle = borderColor;
    SNAKE.ctx.stroke();
  };

  // Point

  SNAKE.point = function(x, y) {
    this.x = x;
    this.y = y;
  };
  
  // Direction

  SNAKE.direction = {
    right: 1,
    left: 2,
    up: 3,
    down: 4
  };

  /* Game objects */
  
  SNAKE.obj = { };

  // SNAKE

  SNAKE.obj.snake = {
    body: [],
    moveDirection: SNAKE.direction.right,
    isAlive: false,
    
    create: function() {
      var length = 5;
      this.isAlive = true;
      this.moveDirection = SNAKE.direction.right;
      this.body = [];
      for(var i = length - 1; i > -1; i -= 1) {
        this.body.push(new SNAKE.point(i, 0));
      }
    },

    head: function() {
      return this.body[0];
    },

    tail: function() {
      return this.body[this.body.length - 1];
    },

    eat: function() {
      var x = this.head().x;
      var y = this.head().y;
      this.body.unshift(new SNAKE.point(x, y));
    },

    _selfOwned: function(point) {
      for(var i = 0; i < this.body.length; i += 1) {
        if(point.x == this.body[i].x && point.y == this.body[i].y)
          return true;
      }
      return false;
    },
    
    setMoveDirection: function(direction) {
      if(direction == 1 && this.moveDirection == 2)
        return;
      else if(direction == 2 && this.moveDirection == 1) 
        return;
      else if(direction == 3 && this.moveDirection == 4)
        return;
      else if(direction == 4 && this.moveDirection == 3)
        return;
      else
        this.moveDirection = direction;
    },

    move: function() {
      var x = this.head().x;
      var y = this.head().y;

      switch(this.moveDirection) {
      case 1 :
        x += 1;
        break;
      case 2 :
        x -= 1;
        break;
      case 3 :
        y += 1;
        break;
      case 4 :
        y -= 1;
        break;
      }
      
      if(this._selfOwned(new SNAKE.point(x, y))) {
        this.isAlive = false;
      } 
      else {
        var tail = this.body.pop();
        tail.x = x;
        tail.y = y;
        this.body.unshift(tail);
      }
    }
  };

  SNAKE.obj.snake.draw = function() {
    this.body.forEach(function(elem) {
      SNAKE.helpers.drawSquare("green", "yellow", elem, SNAKE.CELL_SIZE);
    });
  };

  // Food 

  SNAKE.obj.food = {
    position : undefined,

    create: function() {
      this.position = SNAKE.helpers.getRandomPoint();
    }
  };

  SNAKE.obj.food.draw = function() {
    SNAKE.helpers.drawSquare("red", "white", this.position, SNAKE.CELL_SIZE);
  };

  // Game

  SNAKE.game = { };

  SNAKE.game.score = 0;

  SNAKE.game.scoreTxt = "Score: ";

  SNAKE.game.fps = 15;
  
  SNAKE.game.init = function() {
    SNAKE.obj.food.create();
    SNAKE.obj.snake.create();
  };

  SNAKE.game.reset = function() {
    SNAKE.game.score = 0;
    SNAKE.obj.snake.create();
  };
  
  SNAKE.game.getInput = function() {

    var snake = SNAKE.obj.snake;
    var direction = SNAKE.direction;

    switch(window.event.keyCode) {
    case 32 :
      snake.eat();
      break;
    case 37:
      snake.setMoveDirection(direction.left);
      break;
    case 38 :
      snake.setMoveDirection(direction.down);
      break;
    case 39 :
      snake.setMoveDirection(direction.right);
      break;
    case 40 :
      snake.setMoveDirection(direction.up);
      break;
    }
  };

  SNAKE.game.update = function() { 

    var snake = SNAKE.obj.snake;
    var food = SNAKE.obj.food;

    if(snake.isAlive) {
      snake.move();
      
      // Eat food
      if(snake.head().x == food.position.x && snake.head().y == food.position.y) {
        snake.eat();
        food.create(); 
        SNAKE.game.score += 1
      }

      // Check in bounds
      if(snake.head().x == -1 || snake.head().y == -1 || snake.head().x == SNAKE.GAME_WIDTH / SNAKE.CELL_SIZE || snake.head().y == SNAKE.GAME_HEIGHT / SNAKE.CELL_SIZE) {
        SNAKE.game.reset();
      }
    } else {
      SNAKE.game.reset();
    }
  };

  SNAKE.game.draw = function() { 
    // Draw canvas
    SNAKE.ctx.fillStyle = "black";
    SNAKE.ctx.fillRect(0, 0, SNAKE.canvas.width, SNAKE.canvas.height);
    
    // Draw objects
    SNAKE.obj.snake.draw();
    SNAKE.obj.food.draw();
    
    // Draw score
    SNAKE.ctx.fillStyle = "blue";
    SNAKE.ctx.font = "bold 16px Arial";
    SNAKE.ctx.fillText(SNAKE.game.scoreTxt + SNAKE.game.score, 10, SNAKE.GAME_HEIGHT - 10);
  };

  SNAKE.game.run = function() {
    SNAKE.game.update();
    SNAKE.game.draw();
  };
  
  // Main Loop

  SNAKE.game.init();
  SNAKE.game._intervalId = setInterval(SNAKE.game.run, 1000 / SNAKE.game.fps);

  // Handle input
  
  document.onkeydown = SNAKE.game.getInput;
  
  
