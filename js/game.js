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

  this.world = {
    
    tag : "World",
    fps: FPS,
    background_color:'#000000',

    friction:0.9,  

    height:HEIGHT,
    width:WIDTH,   
    
    timeKeeper:0,
    deathTime:0,
    score:0,    

    numberOfAsteroids: WORLD_AS_NUM,
    numberOfEnemies: WORLD_EN_NUM,

    // Game Objects
    player:null,  
    asteroids:new Set(),
    enemies:new Set(), 
    meteorShower:new Set(),

    letItRain: false,
         
    // Text messages
    sendMessage: false,   
    textObject:null,
    text: "Don't let anything hit you!",   

   
    /**
     * Out of bounds Detection
     * 
     * @param  {} object game object
     */
    outOfBounds:function(object) {
 
      if(object.x < 0 - object.width) {
        object.x = this.width + object.width;

      }else if(object.x > this.width + object.width ) { 
        object.x = 0 - object.width;                
      }

      if (object.y < 0 - object.height) { 
        object.y = this.height + object.height;   

      }else if (object.y > this.height + object.height) {
        object.y = 0 - object.height;    
      }      
    },
    
    /**
     * Links a message to a game object and sets sendMessage to true,
     * so that we know that the display needs to render a message.
     * 
     * @param  {} message string text
     * @param  {} object sender of message
     */
    messenger:function(message, object){   

      this.sendMessage = true;      
  
      if(this.sendMessage){
        this.text = message;
        this.textObject = object;      
      
      }
    },
 
    /**
     * Diffulty Changes and Messages.
     * 
     * The game is based on time and this will keep track of that and create scenarios
     * for that time.
     * Keeps track of the high score.
     */
    checkProgression:function(){
            
      localStorage.setItem(WISE_HIGH_SCORES, 0);

      if(this.score > parseInt(localStorage.getItem(WISE_HIGH_SCORES))){       

        localStorage.setItem(WISE_HIGH_SCORES, this.score);
      }
     
      
      switch(Math.round(this.timeKeeper)){   
        case 3:
          this.letItRain = true;  
          this.messenger("Look out!", this.player);    
          break;        
        case 59:
          this.letItRain = false;
          break;
        case 60:
          this.numberOfAsteroids = WORLD_AS_NUM*2;
          this.numberOfEnemies = WORLD_EN_NUM*2;

          this.messenger("One minute passed", this.player);
          break;
        case 120:
          this.numberOfAsteroids = WORLD_AS_NUM*3;
          this.numberOfEnemies = WORLD_EN_NUM*3;

          this.messenger("Two minutes passed", this.player);
          break;
        case 180:
          this.numberOfAsteroids = WORLD_AS_NUM*4;
          this.numberOfEnemies = WORLD_EN_NUM*4;

          this.messenger("Three minutes passed", this.player);
          break;       
        case 240:
          this.numberOfAsteroids = WORLD_AS_NUM*5;
          this.numberOfEnemies = WORLD_EN_NUM*5;
          this.messenger("Four minutes passed", this.player);
          break;
      }
    }    
  }; 
 
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
   * Creates 3 new Asteroids from the original width and height of the exploded Asteroid (object).
   * 
   * @param  {} object the Asteroid that needs to be split in 3
   */
  this.splitAsteroid = function(object){        

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
   * Creates meteors add random coordinates.
   */
  this.setMeteorShower = function(){    
    x = Math.floor(Math.random()* this.world.width);
    y = Math.floor(Math.random()* this.world.height);     

    for(let i = Math.round(WORLD_AS_NUM/2); i > this.world.meteorShower.size; i--){    
      this.world.meteorShower.add(new Meteor(this, x, y));
    }
  },
  
  
  /**
   * Handles behavior of object that is exploding.
   * Adds to score when certain objects explode.
   * 
   * @param  {} object exploding game object
   */
  this.explosionHandler = function(object){
    
    // Handle exploding objects
    if(object.tag !== "Thruster" && object.tag !== 'Debris'){             
      
      if(object.explodeTime <= 0){                      
        
        if(object instanceof Player){
          
        }else if(object instanceof Asteroid){

          this.world.asteroids.delete(object);
          this.splitAsteroid(object);
          this.instance.gameEngine.gameEngine.removeObject(object);

          this.world.score += (object.width + object.height) / 2;
          
        }else if(object instanceof Enemy){

          this.world.enemies.delete(object);
          this.instance.gameEngine.gameEngine.removeObject(object);   

          this.world.score += (object.width + object.height) / 2;

        }else if(object instanceof Laser){       

          this.instance.gameEngine.gameEngine.removeObject(object);              
        }        
        
      }
    }    
  },

  /**
   * This will run the game mechanics. Creates player and keeps track of time, live and death.
   * This will run the outOfBounds and explosionHandler functions.
   * This will also hold special events that happen during the game. 
   */
  this.worldRunner = function(){   
    if(this.world.player === null){
      this.world.player = new Player(this);

      this.world.score = 0;
      this.world.timeKeeper = 0;
      
      console.log("New Player Created");
       
    }else{       
   
      let delta = engine.delta /1000;
      
      this.world.timeKeeper += delta;
      
      if(this.world.player.live <= 0){
        // GAME OVER
        this.instance.gameEngine.gameEngine.removeObject(this.world.player); 
        this.instance.gameEngine.gameEngine.removeObject(this.world.player.thruster); 
                
        let clock = (this.instance.spaceEngine.clock/1000);    

        if(this.world.deathTime === 0){
          this.world.deathTime = clock;       
        }      
        
        if(clock - this.world.deathTime >= RESPAWN_TIME){
          this.world.player = null; // Player is null will start a new game
          this.destroyWorld(); // Remove everything from display and start anew                        
        }   
        
        
      }else{

        // Conditions for when a player arrives at certain time frame and score setter
        this.world.checkProgression();

        // case 25 of checkProgression: Create Meteorswwwww
        
          if(this.world.letItRain){
            this.setMeteorShower();
            // Make Meteors explode to create trails of Debris    
            for(let met of this.world.meteorShower){         
              this.instance.gameEngine.gameEngine.explode(met, this); 
            }
          }else{
            // Remove meteors
            for(let met of this.world.meteorShower){    
              this.instance.gameEngine.gameEngine.removeObject(met); 
            }
            this.world.meteorShower.clear();
          }
        

        for(let object of this.instance.gameEngine.gameEngine.gameObjects){       
      
          // When object goes out of bounds it will return from the opposite side
          this.world.outOfBounds(object);    

          // Handle exploding objects
          this.explosionHandler(object);        
        }
      }
    }
  }

  /**
   * Get all active game objects and clear them from all sets/arrays
   * Set death time to 0.
   * This will clear all information and we can start a new world.
   */
  this.destroyWorld = function(){
    for(let object of this.instance.gameEngine.gameEngine.gameObjects){ 
      this.instance.gameEngine.gameEngine.removeObject(object); 
      this.world.enemies.clear();
      this.world.asteroids.clear();
      this.world.meteorShower.clear();
      this.world.deathTime = 0; 
    }
  }
  
  /**
   * Update the world and the Game Engine.
   * We can keep track of asteroids and enemies to add new ones
   * when one gets removed.
   */
  this.update = function() {    
    
    this.worldRunner();    
    this.instance.gameEngine.update(); 

    if(this.world.player !== null){
      this.setAsteroidBelt();
      this.setEnemies();
      
    }
  };
};

Game.prototype = { constructor : Game };



  