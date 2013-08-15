// Snake game 

(function(){  

  var Snake = { };
  
  // Get canvas and context
  Snake.canvas = document.getElementById("gameField");
  Snake.ctx = Snake.canvas.getContext('2d');

  // Game constants
  Snake.GAME_WIDTH = Snake.canvas.width;
  Snake.GAME_HEIGHT = Snake.canvas.height;
  Snake.CELL_SIZE = 25;


  // Helpers
  
  Snake.helpers = { };

  Snake.helpers.getRandomInteger = function(min, max) {
    return Math.floor(Math.random() * ( max - min + 1)) + min;
  }

  Snake.helpers.getRandomPoint = function() {
    var x = Snake.helpers.getRandomInteger(0, (Snake.GAME_WIDTH - Snake.CELL_SIZE) / Snake.CELL_SIZE);
    var y = Snake.helpers.getRandomInteger(0, (Snake.GAME_HEIGHT - Snake.CELL_SIZE) / Snake.CELL_SIZE);
    return new Snake.point(x, y);
  }
  
  Snake.helpers.checkCollision = function(point, arrayOfPoints) {
    var result = false;
    arrayOfPoints.forEach(function(elem) {
      if(point.x == elem.x && point.y == elem.y)
        result = true;
    });
    return result;
  }   

  // Point

  Snake.point = function(x, y) {
    this.x = x;
    this.y = y;

    this.toString = function() {
      return "[x: " + this.x + " y:" + this.y+ "]";
    }
  }
  
  // Direction

  Snake.direction = {
    right: 1,
    left: 2,
    up: 3,
    down: 4
  };

  /* Game objects */
  
  Snake.obj = { };

  // Snake

  Snake.obj.snake = {
    body: [],
    moveDirection: Snake.direction.right,
    isAlive: false,
    
    create: function() {
      var length = 5;
      this.isAlive = true;
      this.moveDirection = Snake.direction.right;
      this.body = [];
      for(var i = length - 1; i > -1; i -= 1) {
        this.body.push(new Snake.point(i, 0));
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
      this.body.unshift(new Snake.point(x, y));
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
      
      if(this._selfOwned(new Snake.point(x, y))) {
        this.isAlive = false;
      } 
      else {
        var tail = this.body.pop();
        tail.x = x;
        tail.y = y;
        this.body.unshift(tail);
      }
    },

    draw: function() {
      this.body.forEach(function(elem) {
        Snake.ctx.beginPath();
        Snake.ctx.rect(elem.x * Snake.CELL_SIZE, elem.y * Snake.CELL_SIZE, Snake.CELL_SIZE, Snake.CELL_SIZE);
        Snake.ctx.fillStyle = "green";
        Snake.ctx.fill();  
        Snake.ctx.lineWitdh=1;
        Snake.ctx.strokeStyle="yellow";
        Snake.ctx.stroke();
      });
    }
  };

  // Food 

  Snake.obj.food = {
    position : undefined,

    create: function() {
      this.position = Snake.helpers.getRandomPoint();
    },

    draw: function() {
      if(this.position != undefined) {
        Snake.ctx.beginPath();
        Snake.ctx.rect(this.position.x * Snake.CELL_SIZE, this.position.y * Snake.CELL_SIZE, Snake.CELL_SIZE, Snake.CELL_SIZE);
        Snake.ctx.fillStyle = "red";
        Snake.ctx.fill();
        Snake.ctx.lineWitdh=1;
        Snake.ctx.strokeStyle="white";
        Snake.ctx.stroke();
      }
    }
  };

  // Game

  Snake.game = { };

  Snake.game.score = 0;

  Snake.game.scoreTxt = "Score: ";

  Snake.game.fps = 20;
  
  Snake.game.init = function() {
    Snake.obj.food.create();
    Snake.obj.snake.create();
  }

  Snake.game.reset = function() {
    Snake.game.score = 0;
    Snake.obj.snake.create();
  }
  
  Snake.game.getInput = function() {

    var snake = Snake.obj.snake;
    var direction = Snake.direction;

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
  }

  Snake.game.update = function() { 

    var snake = Snake.obj.snake;
    var food = Snake.obj.food;

    if(snake.isAlive) {
      snake.move();
      
      // Eat food
      if(snake.head().x == food.position.x && snake.head().y == food.position.y) {
        snake.eat();
        food.create(); 
        Snake.game.score += 1
      }

      // Check in bounds
      if(snake.head().x == -1 || snake.head().y == -1 || snake.head().x == Snake.GAME_WIDTH / Snake.CELL_SIZE || snake.head().y == Snake.GAME_HEIGHT / Snake.CELL_SIZE) {
        Snake.game.reset();
      }
    } else {
      Snake.game.reset();
    }
  }

  Snake.game.draw = function() { 
    // Draw canvas
    Snake.ctx.fillStyle = "black";
    Snake.ctx.fillRect(0, 0, Snake.canvas.width, Snake.canvas.height);
    
    // Draw objects
    Snake.obj.snake.draw();
    Snake.obj.food.draw();
    
    // Draw score
    Snake.ctx.fillStyle = "blue";
    Snake.ctx.font = "bold 16px Arial";
    Snake.ctx.fillText(Snake.game.scoreTxt + Snake.game.score, 10, Snake.GAME_HEIGHT - 10);
  }

  Snake.game.run = function() {
    Snake.game.update();
    Snake.game.draw();
  }
  
  // Main Loop

  Snake.game.init();
  Snake.game._intervalId = setInterval(Snake.game.run, 1000 / Snake.game.fps);

  // Handle input
  
  document.onkeydown = Snake.game.getInput;
  
  
})();