
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

  this.audio = new AudioContext();
  this.gameAudio = new GameAudio(this.audio);

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

      this.world.enemies.add(new Enemy(this, x, y, ENEMY_WIDTH, ENEMY_HEIGHT, Math.round(Math.random() * 3)));
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
        distanceBetweenPoints(this.world.width/2, this.world.height/2, x,y) < 
        700);

      this.world.meteor_shower.add(new Meteor(this, x, y));     
    }    
  }, 

  /**
   * Creates a Planet in the left/center of the screen
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
    localStorage.setItem(DSMS_HIGH_SCORES, localStorage.getItem(DSMS_HIGH_SCORES)!==null?localStorage.getItem(DSMS_HIGH_SCORES):0);    

    if(this.world.score > parseInt(localStorage.getItem(DSMS_HIGH_SCORES))){       

        localStorage.setItem(DSMS_HIGH_SCORES, this.world.score);
    }      
    
    // Handle exploding objects, set to be removed and sound effect.
    if(object.tag !== 'Debris'){             
      
      if(object.explode_time <= 0){      

        switch(object.tag){
          case "Asteroid":
            this.world.asteroids.delete(object);
            this.splitObject(object);
            this.gameEngine.removeObject(object);
  
            this.world.score += (object.width + object.height) * Math.ceil(this.world.time_keeper/10);

            this.gameAudio.play(280, 0.2, "sine", 0.1).stop(0.2);     
            this.gameAudio.play(260, 0.2, "sine", 0.2).stop(0.3);          
            this.gameAudio.play(200, 0.2, "sine", 0.4).stop(0.6); 
            break;
          case "Enemy":
            this.world.enemies.delete(object);
            this.gameEngine.removeObject(object);   
  
            this.world.score += (object.width + object.height) * Math.ceil(this.world.time_keeper/10);     
            
            this.gameAudio.play(280, 0.2, "sine", 0.1).stop(0.2);     
            this.gameAudio.play(260, 0.2, "sine", 0.2).stop(0.3);          
            this.gameAudio.play(200, 0.2, "sine", 0.4).stop(0.6); 
            break;
          case "Laser": 
            this.gameEngine.removeObject(object);    
            break;
          case "Froggy":
            this.world.time_trial = 0;
            this.world.froggy = null;
            this.gameEngine.removeObject(object);             
            break;
          case "Meteor":
            this.world.meteor_shower.delete(object);
            this.gameEngine.removeObject(object);   
        
            this.world.score += 1000; 
            
            this.gameAudio.play(580, 0.2, "sine", 0.1).stop(0.2);     
            this.gameAudio.play(560, 0.2, "sine", 0.2).stop(0.3);          
            this.gameAudio.play(500, 0.2, "sine", 0.4).stop(0.6); 
            break;
          case "Planet":           
            this.splitObject(object);
            this.gameEngine.removeObject(object);
      
            this.world.score -= 5000;

            this.gameAudio.play(780, 0.2, "sine", 0.1).stop(0.2);     
            this.gameAudio.play(760, 0.2, "sine", 0.2).stop(0.3);          
            this.gameAudio.play(700, 0.2, "sine", 0.4).stop(0.6); 
            this.gameAudio.play(680, 0.2, "sine", 0.7).stop(0.9);     
            this.gameAudio.play(660, 0.2, "sine", 1.0).stop(1.2);          
            this.gameAudio.play(600, 0.2, "sine", 1.4).stop(1.6); 
            break;
          case "Boss":
            this.world.boss = null;
            this.world.win = true;
            this.gameEngine.removeObject(object);
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