
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
 
  this.gameEngine= new GameEngine();    
  this.spaceEngine= engine;

  this.world = new World(this);

  this.width = this.world.width;
  this.height = this.world.height;

  this.audio = new AudioContext();
  this.gameAudio = new GameAudio(new AudioContext());

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
    
    for(let i = this.world.number_asteroids; i > this.world.asteroids.size; i--){      
      do{
        x = Math.floor(Math.random()* this.world.width);
        y = Math.floor(Math.random()* this.world.height);
        
      }while(this.gameEngine.
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
        this.gameEngine.removeObject(object); 
      }
    }    
  },
  
  /**
   * Creates enemies at random coordinates, but away from the player
   */
  this.setEnemies = function(){  
    let x,y;   

    for(let i = this.world.number_enemies; i > this.world.enemies.size; i--){      
      do{
        x = Math.floor(Math.random()* this.world.width);
        y = Math.floor(Math.random()* this.world.height);
        
      }while(this.gameEngine.
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
    
    for(let i = Math.round(this.world.asteroids.size/2); i > this.world.meteor_shower.size; i--){  
      do{
        x = Math.floor(Math.random()* this.world.width);
        y = Math.floor(Math.random()* this.world.height);     

      }while(this.gameEngine.
        distanceBetweenPoints(this.world.player.x, this.world.player.y, x,y) < 
        this.world.player.width + 200);

      this.world.meteor_shower.add(new Meteor(this, x, y));     
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
    if(object.tag !== 'Debris'){             
      
      if(object.explode_time <= 0){          

        
        //beep boop
        // this.gameAudio.play(100, 0.3, "sine").setFrequency(150, 0.3).stop(0.8);

        this.gameAudio.play(300, 0.2, "sine").stop(0.1);    
        this.gameAudio.play(280, 0.2, "sine", 0.1).stop(0.2);     
        this.gameAudio.play(260, 0.2, "sine", 0.2).stop(0.3); 
        this.gameAudio.play(240, 0.2, "sine", 0.3).stop(0.4);     
        this.gameAudio.play(200, 0.2, "sine", 0.4).stop(0.6);
       

        //Something goes wrong
        // this.gameAudio.play(150, 0.1, "sine").stop(0.3);    
        // this.gameAudio.play(400, 0.25, "sine", 0.3).stop(0.5);     
        // this.gameAudio.play(280, 0.3, "sine", 0.5).stop(0.7); 

        switch(object.tag){
          case "Asteroid":
            this.world.asteroids.delete(object);
            this.splitObject(object);
            this.gameEngine.removeObject(object);
  
            this.world.score += (object.width + object.height) / 2;
            break;
          case "Enemy":
            this.world.enemies.delete(object);
            this.gameEngine.removeObject(object);   
  
            this.world.score += (object.width + object.height) / 2;
            break;
          case "Laser": case "Froggy":
            this.gameEngine.removeObject(object);    
            break;
          case "Meteor":
            this.world.meteor_shower.delete(object);
            this.gameEngine.removeObject(object);   
        
            this.world.score += 100;  
            break;
          case "Planet":           
            this.splitObject(object);
            this.gameEngine.removeObject(object);
      
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

    localStorage.setItem(DSMS_HIGH_SCORES, 0);      

    if(this.score > parseInt(localStorage.getItem(DSMS_HIGH_SCORES))){       

        localStorage.setItem(DSMS_HIGH_SCORES, this.world.score);
    }      
   
    this.world.update();  
    this.gameEngine.update(); 

    if(this.world.player !== null){
      this.setAsteroidBelt();
      this.setEnemies();      
    }
  };
};

Game.prototype = { constructor : Game };

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}