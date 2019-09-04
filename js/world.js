const World = function(game){    
    
    this.tag = "World";
    this.fps = FPS;
    this.background_color='#000000';

    this.friction= 0.9;  

    this.height = HEIGHT;
    this.width = WIDTH;  

    this.timeKeeper = 0;
    this.deathTime = 0;
    this.score = 0;
    this.timeTrial = 0;  
    this.timeTrialHigh = 0;
    this.counter = 0;

    this.numberOfAsteroids=  ASTEROID_NUMBER;
    this.numberOfEnemies= ENEMY_NUMBER;

    // Game Objects
    this.player=new Player(game);
    this.asteroids=new Set();
    this.enemies=new Set();
    this.meteorShower=new Set();
    this.planets=new Set();

    this.letItRain= false;
    this.planet=false;    
    this.froggy=null;
            
    // Text messages  
    this.messages= new Map();  
    this.worldMessage=new WorldMessage();

    this.game = game;
}
 
World.prototype = { 

    constructor : World,


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
     * Links a message to a game object by setting it to a map.
     * This gets rendered by the display
     * 
     * @param  {} message string text
     * @param  {} object sender of message
     */
    messenger : function(message, object){  
        this.messages.set(message, object); 
        object.sendMessage = true;
    },

    /**
     * Diffulty Changes and Messages.
     * 
     * The game is based on time and this will keep track of that and create scenarios
     * for that time.
     * Keeps track of the high score.
     */
    levelProgression : function(){
            
        localStorage.setItem(DSMS_HIGH_SCORES, 0);      

        if(this.score > parseInt(localStorage.getItem(DSMS_HIGH_SCORES))){       

            localStorage.setItem(DSMS_HIGH_SCORES, this.score);
        }      
        
        switch(Math.round(this.timeKeeper)){   
            case 3:
                this.letItRain = true;          
                this.messenger("Protect the Planet from Meteors", this.worldMessage);    
                break;        
            case 59:
                this.letItRain = false;
                break;
            case 60:          
                this.numberOfEnemies = ENEMY_NUMBER*2;          
                break;
            case 82:
                if(this.froggy === null){
                    //Create a Froggy to escort to a safe haven at a random position
                    this.froggy = new Froggy(this.game, 0, Math.random() * this.height); 
                    this.messenger("Time Trail: Escort Mission!", this.worldMessage);                        
                }                 
                break;
            case 120:
                this.numberOfAsteroids = ASTEROID_NUMBER*2;   
            
                break;
            case 180:         
                if(this.froggy === null){
                    //Create a Froggy to escort to a safe haven at a random position
                    this.froggy = new Froggy(this.game, 0, Math.random() * this.height);  
                    this.messenger("Time Trail 2: Escort Harder!", this.worldMessage);   
                }
                break;       
            case 240:
                this.numberOfAsteroids = ASTEROID_NUMBER * 3;
                this.numberOfEnemies = ASTEROID_NUMBER * 3;
                
                break;
        }
    },  
    
    /**
   * This will run the game mechanics. Creates player and keeps track of time, live and death.
   * This will run the outOfBounds and scoreAndObjectHandler functions.
   * This will also hold special events that happen during the game. 
   */
    update: function(){      

        if(this.player === null){

            this.player = new Player(this.game);                 
                
            this.score = 0;
            this.timeKeeper = 0;

        }else{       
   
            let delta = this.game.instance.spaceEngine.delta /1000;
            let clock = this.game.instance.spaceEngine.clock /1000;
            
            this.timeKeeper += delta;
            
            if(this.player.live <= 0){
                // GAME OVER
                this.game.instance.gameEngine.gameEngine.removeObject(this.player); 
                this.game.instance.gameEngine.gameEngine.removeObject(this.player.thruster);                        
                  
                  
                if(this.deathTime === 0){
                    this.deathTime = clock;       
                }      
                
                if(clock - this.deathTime >= RESPAWN_TIME){                 
                    this.player = null; // Player is null will start a new game
                    this.destroyWorld(); // Remove everything from display and start anew                            
                }        
                
            }else{

                // Conditions for when a player arrives at certain time frame and score setter
                this.levelProgression();

                // case 25 of levelProgression: Create Meteors

                if(this.letItRain){
                   
                    this.game.setPlanets();
                    
                    if(this.counter === 0){
                        this.counter = clock;       
                    }      
                    
                    if(clock - this.counter >= RESPAWN_TIME){                 
                        this.game.setMeteorShower();      
                        this.counter = 0;                               
                    }    
                }else{
                    // Remove meteors and planets
                    for(let met of this.meteorShower){    
                        this.game.instance.gameEngine.gameEngine.removeObject(met); 
                    }
                    for(let planet of this.planets){    
                        this.game.instance.gameEngine.gameEngine.removeObject(planet); 
                    }
                    this.meteorShower.clear();
                    this.planets.clear();
                }
                
                // case 82 of levelProgression: Create Froggy

                if(this.froggy !== null){                     
                    if(this.froggy.following){             
                        this.timeTrial += 1 / this.fps; 
                
                    }else{
                        if(this.timeTrial > 0){
                            this.score += this.timeTrial * 10;

                            if(this.timeTrial > this.timeTrialHigh){
                                this.timeTrialHigh = this.timeTrial;
                            }      
                            this.timeTrial = 0;         
                        }            
                    }
                }                                         

                for(let object of this.game.instance.gameEngine.gameEngine.gameObjects){       
            
                    // When object goes out of bounds it will return from the opposite side
                    this.outOfBounds(object);    

                    // Handle exploding objects and setting the Score
                    this.game.scoreAndObjectHandler(object);        
                }
            }
        }
    },

    /**
   * Get all active game objects and clear them from all sets/arrays
   * We basically reset everything here, just to be sure.
   * This will clear all information and we can start a new world.
   */
  destroyWorld : function(){
    for(let object of this.game.instance.gameEngine.gameEngine.gameObjects){ 
      this.game.instance.gameEngine.gameEngine.removeObject(object);    

    }

    this.enemies.clear();
    this.asteroids.clear();
    this.meteorShower.clear();
    this.planets.clear();
    this.froggy = null;    
    this.deathTime = 0; 
    this.counter = 0;
    this.timeTrial = 0; 
    if(this.letItRain){
        this.letItRain = false;
    }
  }
};

const WorldMessage = function() {
  
    this.width      = WIDTH/2;    
    this.height     = HEIGHT/2;  
    this.x          = CENTER_X;
    this.y          = CENTER_Y; 
    
};
  
WorldMessage.prototype = {

    constructor : WorldMessage,    

};      