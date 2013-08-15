// Snake game 

(function(){  
  
  var Game = { };
  Game.fps = 15;

  // Get canvas and context
  var canvas = document.getElementById("gameField");
  var ctx = canvas.getContext('2d');

  
  // Game constants
  var GAME_WIDTH = canvas.width;
  var GAME_HEIGHT = canvas.height;
  var CELL_SIZE = 20;


  // Helpers
  
  function getRandomInteger(min, max) {
    return Math.floor(Math.random() * ( max - min + 1)) + min;
  }

  function getRandomPoint() {
    return new Point(getRandomInteger(0, (GAME_WIDTH - CELL_SIZE) / CELL_SIZE), getRandomInteger(0, (GAME_HEIGHT - CELL_SIZE) / CELL_SIZE));
  }
  

  function checkCollision(point, arrayOfPoints) {
    var result = false;
    arrayOfPoints.forEach(function(elem) {
      if(point.x == elem.x && point.y == elem.y)
        result = true;
    });
    return result;
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
  
  // Direction

  var direction = {
    right: 1,
    left: 2,
    up: 3,
    down: 4
  }
  
  // Snake

  var snake = {
    body: [],
    moveDirection: direction.right,
    isAlive: false,
    
    create: function() {
      var length = 5;
      this.isAlive = true;
      this.moveDirection = direction.right;
      this.body = [];
      for(var i = length - 1; i > -1; i -= 1) {
        this.body.push(new Point(i, 0));
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
      this.body.unshift(new Point(x, y));
    },

    selfOwned: function(point) {
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
      
      if(this.selfOwned(new Point(x, y))) {
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
        ctx.beginPath();
        ctx.rect(elem.x * CELL_SIZE, elem.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.fillStyle = "green";
        ctx.fill();  
        ctx.lineWitdh=1;
        ctx.strokeStyle="yellow";
        ctx.stroke();
      });
    }
  };

  // Food 

  var food = {
    position : undefined,

    create: function() {
      this.position = getRandomPoint();
    },

    draw: function() {
      if(this.position != undefined) {
        ctx.beginPath();
        ctx.rect(this.position.x * CELL_SIZE, this.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.lineWitdh=1;
        ctx.strokeStyle="white";
        ctx.stroke();
      }
    }
  };

  /*      */

  // Main loop
  
  document.onkeydown = function() {
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

  Game.update = function() { 
    
    if(snake.isAlive) {
      snake.move();
      
      // Eat food
      if(snake.head().x == food.position.x && snake.head().y == food.position.y) {
        snake.eat();
        food.create(); 
      }

      // Check in bounds

      if(snake.head().x < -1 || snake.head().y < -1 || snake.head().x > GAME_WIDTH / CELL_SIZE || snake.head().y > GAME_HEIGHT / CELL_SIZE) {
        snake.create();
      }
    } else {
      snake.create();
    }
  }

  Game.draw = function() { 
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ctx.strokeStyle = "black";
    // ctx.strokeRect(0, 0, canvas.width, canvas.height);

    snake.draw();
    food.draw();
  }

  food.create();

  Game.run = function() {
    Game.update();
    Game.draw();
  };
  
  
  Game._intervalId = setInterval(Game.run, 1000 / Game.fps);

  // End of main loop
  

})();