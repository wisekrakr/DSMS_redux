/* David Damian 15/08/2019 */

const Game = function(engine) {  
  
  /* The instance of the game's spaceEngine and gameEngine */
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

    numberOfAsteroids: WORLD_AS_NUM,
    numberOfEnemies: WORLD_EN_NUM,

    // Game Objects
    player:null,  
    asteroids:new Set(),
    enemies:new Set(), 
    meteorShower:new Set(),
         
    // Text messages
    sendMessage: false,    
    messages:new Set(),
    textObject:null,
    text: "Don't let anything hit you!",
    textAlpha:1.0,

    /* Out of bounds Detection */
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

    messenger:function(message, object){      
      // this.messages.add(message, object);

      this.sendMessage = true;      
  
      if(this.sendMessage){
        this.text = message;
        this.textObject = object;      
      
      }
    },

     /* Diffulty Changes and Messages */
    checkProgression:function(){
      let delta = engine.delta /1000;
      
      this.timeKeeper += delta;
           
      switch(Math.round(this.timeKeeper)){          
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
  
  

  // Set a flickering effect with an array of colors
  this.colorPicker = function(colors){    
    return colors[getRandomInt(colors.length)];
  },

  //Function to create an array of asteroids 
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

  // Function to split asteroids in two
  this.splitAsteroid = function(object){
    if(object.width === AS_WIDTH && object.height === AS_HEIGHT){

      let bits = Math.random() * 5;

      for(let i = 0; i < bits; i++){
        if(AS_WIDTH/bits > 5 && AS_HEIGHT/bits > 5){
          new Asteroid(this, object.x, object.y, AS_WIDTH/bits, AS_HEIGHT/bits);
        }else{
          this.instance.gameEngine.gameEngine.removeObject(object); 
        }
      }
    }
  },

  //Function to create an array of enemies
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

  //Function to create an array of asteroids 
  this.setMeteorShower = function(){    
    x = Math.floor(Math.random()* this.world.width);
    y = Math.floor(Math.random()* this.world.height);     

    for(let i = 30; i > this.world.meteorShower.size; i--){    
      this.world.meteorShower.add(new Meteor(this, x, y));
    }
  },
  
  // Go through all objects and handle their respective behavior when exploding
  this.explosionHandler = function(object){
    
    // Handle exploding objects
    if(object.tag !== "Thruster" && object.tag !== 'Debris'){        

      if(object.explodeTime <= 0){                 
        
        if(object instanceof Player){

          
        }else if(object instanceof Asteroid){

          this.world.asteroids.delete(object);
          this.splitAsteroid(object);
          this.instance.gameEngine.gameEngine.removeObject(object);
          
        }else if(object instanceof Enemy){

          this.world.enemies.delete(object);
          this.instance.gameEngine.gameEngine.removeObject(object);   

        }else if(object instanceof Laser){       

          this.instance.gameEngine.gameEngine.removeObject(object);              
        }                  
      }        
    }    
  },

  this.worldRunner = function(){   
    if(this.world.player === null){
      this.world.player = new Player(this);
      console.log("New Player Created");
       
    }else{       

      this.world.checkProgression();
      

      if(this.world.player.live <= 0){
        // GAME OVER
        this.instance.gameEngine.gameEngine.removeObject(this.world.player); 
        
        let clock = (this.instance.spaceEngine.clock/1000);

        if(this.world.deathTime === 0){
          this.world.deathTime = clock;       
        }      
        
        if(clock - this.world.deathTime >= RESPAWN_TIME){
          this.world.player = null;
          this.destroyWorld();
        
          this.world.deathTime = 0;        
        }
      }

      for(let object of this.instance.gameEngine.gameEngine.gameObjects){       
      
        // When object goes out of bounds it will return from the opposite side
        this.world.outOfBounds(object);    

        // Handle exploding objects
        this.explosionHandler(object);
      }
    }
  }

  this.destroyWorld = function(){
    for(let object of this.instance.gameEngine.gameEngine.gameObjects){ 
      this.instance.gameEngine.gameEngine.removeObject(object); 
      this.world.enemies.clear();
      this.world.asteroids.clear();
    }
  }

  this.update = function() {    
    
    this.worldRunner();    
    this.instance.gameEngine.update(); 

    if(this.world.player !== null){
      this.setAsteroidBelt();
      this.setEnemies();
      // this.setMeteorShower();
    }
  };

};

Game.prototype = { constructor : Game };



  