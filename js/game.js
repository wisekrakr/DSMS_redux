/* David Damian 15/08/2019 */

const Game = function(engine) {  
  
  this.instance = {
    gameEngine: new GameEngine(),   
    spaceEngine: engine,   
  };

  this.world = {
    
    tag : "World",
    fps: FPS,
    background_color:'#000000',

    friction:0.9,  

    height:HEIGHT,
    width:WIDTH,  
    
    numberOfAsteroids: 2,
    numberOfEnemies: 1,

    // Game Objects
    player:null,  
    asteroids:new Set(),
    enemies:new Set(), 
    meteorShower:new Set(),
         

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
  };

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

      this.world.asteroids.add(new Asteroid(this, x, y));
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
  
  // Set a flickering effect with an array of colors
  this.colorPicker = function(colors){    
    return colors[getRandomInt(colors.length)];
  },

  this.worldRunner = function(){   
    if(this.world.player === null){
      this.world.player = new Player(this);

    }else{ 

      for(let sub of this.instance.gameEngine.gameEngine.gameObjects){
        let object = sub;
      
        // When object goes out of bounds it will return from the opposite side
        this.world.outOfBounds(object);    

        // Handle exploding objects
        if(object.tag !== "Thruster" && object.tag !== 'Debris'){        

          if(object.explodeTime <= 0){                 
            
            if(object instanceof Player){

          //TODO: add the object Tag nr to the condition
             
            }else if(object instanceof Asteroid){
              this.world.asteroids.delete(object);
              this.instance.gameEngine.gameEngine.removeObject(object);
              
            }else if(object instanceof Enemy){
              this.world.enemies.delete(object);
              this.instance.gameEngine.gameEngine.removeObject(object);              
            }              
          }        
        }
      }
    }
  }

  this.update = function() {
    
    this.worldRunner();    
    this.instance.gameEngine.update(); 
    this.setAsteroidBelt();
    this.setEnemies();
    // this.setMeteorShower();
  };

};

Game.prototype = { constructor : Game };



  