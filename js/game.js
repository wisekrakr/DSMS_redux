/* David Damian 15/08/2019 */

/**
 * Holds the game world. Creates a new instance of the Game Engine
 * Creates the game objects and game rules. 
 * 
 * @param  {} engine the engine that runs the game
 */
const Game = function(engine) {    
      
  /**
   * This instance of the game's spaceEngine and gameEngine
   */
  this.instance = {
    
    gameEngine: new GameEngine(),      
    spaceEngine: engine      
  };

  this.world = new World(this);

  this.width = this.world.width;
  this.height = this.world.height;
   
  /**
   * Set a flickering effect with an array of colors
   * 
   * @param  {} colors an array of color hexes
   */
  this.colorPicker = function(colors){    
    return colors[getRandomInt(colors.length)];
  },

  /**
   * Creates asteroids at random coordinates, but away from the player
   */
  this.setAsteroidBelt = function(){  
    let x,y;   
    
    for(let i = this.world.numberOfAsteroids; i > this.world.asteroids.size; i--){      
      do{
        x = Math.floor(Math.random()* this.world.width);
        y = Math.floor(Math.random()* this.world.height);
        
      }while(this.instance.gameEngine.gameEngine.
        distanceBetweenPoints(this.world.player.x, this.world.player.y, x,y) < 
        this.world.player.width + 200);

      this.world.asteroids.add(new Asteroid(this, x, y, AS_WIDTH, AS_HEIGHT));
    }
  }, 

  /**
   * Creates 3 new Asteroids from the original width and height of the exploded Object.
   * 
   * @param  {} object the Asteroid that needs to be split in 3
   */
  this.splitObject = function(object){        

    for(let i = 0; i < 3; i++){

      if(object.width/3 > 5 && object.height/3 > 5){
        new Asteroid(this, object.x, object.y, object.width/3, object.height/3);
      }else{
        this.instance.gameEngine.gameEngine.removeObject(object); 
      }
    }    
  },
  
  /**
   * Creates enemies at random coordinates, but away from the player
   */
  this.setEnemies = function(){  
    let x,y;   

    for(let i = this.world.numberOfEnemies; i > this.world.enemies.size; i--){      
      do{
        x = Math.floor(Math.random()* this.world.width);
        y = Math.floor(Math.random()* this.world.height);
        
      }while(this.instance.gameEngine.gameEngine.
        distanceBetweenPoints(this.world.player.x, this.world.player.y, x,y) < 
        this.world.player.width + 200);

      this.world.enemies.add(new Enemy(this, x, y));
    }
  }, 
  
  /**
   * Creates meteors at random coordinates away from the player. 
   */
  this.setMeteorShower = function(){   
    let x,y;   
    
    for(let i = Math.round(this.world.asteroids.size/2); i > this.world.meteorShower.size; i--){  
      do{
        x = Math.floor(Math.random()* this.world.width);
        y = Math.floor(Math.random()* this.world.height);     

      }while(this.instance.gameEngine.gameEngine.
        distanceBetweenPoints(this.world.player.x, this.world.player.y, x,y) < 
        this.world.player.width + 200);

      this.world.meteorShower.add(new Meteor(this, x, y));     
    }    
  }, 

  /**
   * Creates a Planet in the center of the screen
   */
  this.setPlanets= function(){   
    
    for(let i = 1; i > this.world.planets.size; i--){      

      this.world.planets.add(new Planet(this));     
    }    
  }, 
  
  /**
   * Handles behavior of object that is exploding.
   * Adds to score when certain objects explode.
   * 
   * @param  {} object exploding game object
   */
  this.scoreAndObjectHandler = function(object){    
    
    // Handle exploding objects
    if(object.tag !== "Thruster" && object.tag !== 'Debris'){             
      
      if(object.explodeTime <= 0){   
        
        switch(object.tag){
          case "Asteroid":
            this.world.asteroids.delete(object);
            this.splitObject(object);
            this.instance.gameEngine.gameEngine.removeObject(object);
  
            this.world.score += (object.width + object.height) / 2;
            break;
          case "Enemy":
            this.world.enemies.delete(object);
            this.instance.gameEngine.gameEngine.removeObject(object);   
  
            this.world.score += (object.width + object.height) / 2;
            break;
          case "Laser": case "Froggy":
            this.instance.gameEngine.gameEngine.removeObject(object);    
            break;
          case "Meteor":
            this.world.meteorShower.delete(object);
            this.instance.gameEngine.gameEngine.removeObject(object);   
            console.log("removing meteor");
            this.world.score += 100;  
            break;
          case "Planet":           
            this.splitObject(object);
            this.instance.gameEngine.gameEngine.removeObject(object);
            console.log("removing planet");
            this.world.score -= 5000;
            break;
        }    
      }
    }    
  },  
  
  
  /**
   * Update the world and the Game Engine.
   * We can keep track of asteroids and enemies to add new ones
   * when one gets removed.
   */
  this.update = function() {   
   
    this.world.update();  
    this.instance.gameEngine.update(); 

    if(this.world.player !== null){
      this.setAsteroidBelt();
      this.setEnemies();      
    }
  };
};

Game.prototype = { constructor : Game };